import { Client, isFullBlock, isFullPage } from "@notionhq/client";
import {
  BlockObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverUrl: string | null;
  color: string;
  order: number;
  published: boolean;
}

export interface ProjectDetail extends Project {
  // Pyramid-principle sections extracted from Notion page blocks
  situation: BlockObjectResponse[];
  complication: BlockObjectResponse[];
  answer: BlockObjectResponse[];
  body: BlockObjectResponse[];
  // Raw blocks for fallback rendering
  allBlocks: BlockObjectResponse[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function richTextToPlain(rich: RichTextItemResponse[]): string {
  return rich.map((t) => t.plain_text).join("");
}

function getCover(page: PageObjectResponse): string | null {
  if (!page.cover) return null;
  if (page.cover.type === "external") return page.cover.external.url;
  if (page.cover.type === "file") return page.cover.file.url;
  return null;
}

function getProp(page: PageObjectResponse, name: string) {
  return (page.properties as Record<string, unknown>)[name];
}

function getTextProp(page: PageObjectResponse, name: string): string {
  const prop = getProp(page, name) as {
    type: string;
    rich_text?: RichTextItemResponse[];
    title?: RichTextItemResponse[];
  } | null;
  if (!prop) return "";
  if (prop.type === "rich_text" && prop.rich_text) {
    return richTextToPlain(prop.rich_text);
  }
  if (prop.type === "title" && prop.title) {
    return richTextToPlain(prop.title);
  }
  return "";
}

function getSelectProp(page: PageObjectResponse, name: string): string {
  const prop = getProp(page, name) as {
    type: string;
    select?: { name: string } | null;
  } | null;
  if (!prop || prop.type !== "select" || !prop.select) return "blue";
  return prop.select.name.toLowerCase();
}

function getCheckboxProp(page: PageObjectResponse, name: string): boolean {
  const prop = getProp(page, name) as {
    type: string;
    checkbox?: boolean;
  } | null;
  if (!prop || prop.type !== "checkbox") return false;
  return prop.checkbox ?? false;
}

function getNumberProp(page: PageObjectResponse, name: string): number {
  const prop = getProp(page, name) as {
    type: string;
    number?: number | null;
  } | null;
  if (!prop || prop.type !== "number") return 99;
  return prop.number ?? 99;
}

function getFilesProp(page: PageObjectResponse, name: string): string | null {
  const prop = getProp(page, name) as {
    type: string;
    files?: Array<{ type: string; file?: { url: string }; external?: { url: string }; name: string }>;
  } | null;
  if (!prop || prop.type !== "files" || !prop.files?.length) return null;
  const file = prop.files[0];
  if (file.type === "file" && file.file) return file.file.url;
  if (file.type === "external" && file.external) return file.external.url;
  return null;
}

function pageToProject(page: PageObjectResponse): Project {
  return {
    id: page.id,
    title: getTextProp(page, "Title") || getTextProp(page, "Name"),
    slug: getTextProp(page, "Slug"),
    description: getTextProp(page, "Description"),
    coverUrl: getFilesProp(page, "Cover") ?? getCover(page),
    color: getSelectProp(page, "Color"),
    order: getNumberProp(page, "Order"),
    published: getCheckboxProp(page, "Published"),
  };
}

// ─── API functions ────────────────────────────────────────────────────────────

export async function getProjects(): Promise<Project[]> {
  const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID;
  if (!databaseId) {
    console.warn("NOTION_PROJECTS_DATABASE_ID not set – returning empty list");
    return [];
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: { property: "Published", checkbox: { equals: true } },
    sorts: [{ property: "Order", direction: "ascending" }],
  });

  return response.results
    .filter(isFullPage)
    .map(pageToProject)
    .filter((p) => p.slug);
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const databaseId = process.env.NOTION_PROJECTS_DATABASE_ID;
  if (!databaseId) return null;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        { property: "Slug", rich_text: { equals: slug } },
        { property: "Published", checkbox: { equals: true } },
      ],
    },
  });

  const page = response.results.find(isFullPage);
  if (!page) return null;

  const project = pageToProject(page);
  const blocks = await getAllBlocks(page.id);

  // Split blocks by pyramid-principle headings
  const sections = splitByPyramidSections(blocks);

  return { ...project, ...sections, allBlocks: blocks };
}

async function getAllBlocks(blockId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    });

    for (const block of response.results) {
      if (isFullBlock(block)) {
        blocks.push(block);
        // Recursively fetch children for togglable/expandable blocks
        if (block.has_children && ["toggle", "bulleted_list_item", "numbered_list_item", "quote", "callout"].includes(block.type)) {
          const children = await getAllBlocks(block.id);
          (block as BlockObjectResponse & { children?: BlockObjectResponse[] }).children = children;
        }
      }
    }

    cursor = response.next_cursor ?? undefined;
  } while (cursor);

  return blocks;
}

/**
 * Splits Notion blocks into pyramid-principle sections.
 * Looks for headings like "## Situation", "## Complication", "## Answer"
 * Everything else goes into `body`.
 */
function splitByPyramidSections(blocks: BlockObjectResponse[]): {
  situation: BlockObjectResponse[];
  complication: BlockObjectResponse[];
  answer: BlockObjectResponse[];
  body: BlockObjectResponse[];
} {
  const sections = {
    situation: [] as BlockObjectResponse[],
    complication: [] as BlockObjectResponse[],
    answer: [] as BlockObjectResponse[],
    body: [] as BlockObjectResponse[],
  };

  type SectionKey = keyof typeof sections;
  let current: SectionKey = "body";

  const SECTION_HEADINGS: Record<string, SectionKey> = {
    situation: "situation",
    complication: "complication",
    "key question": "answer",
    answer: "answer",
    resolution: "answer",
    "key insight": "answer",
  };

  for (const block of blocks) {
    if (
      block.type === "heading_1" ||
      block.type === "heading_2" ||
      block.type === "heading_3"
    ) {
      const headingBlock = block as BlockObjectResponse & {
        [key: string]: { rich_text: RichTextItemResponse[] };
      };
      const text = richTextToPlain(headingBlock[block.type].rich_text).toLowerCase().trim();

      const matched = Object.keys(SECTION_HEADINGS).find((key) =>
        text.includes(key)
      ) as string | undefined;

      if (matched) {
        current = SECTION_HEADINGS[matched];
        sections[current].push(block);
        continue;
      }
    }
    sections[current].push(block);
  }

  return sections;
}
