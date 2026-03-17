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

export interface PageSection {
  label: string;
  blocks: BlockObjectResponse[];
}

export interface ProjectDetail extends Project {
  sections: PageSection[];   // one entry per H2 in the page
  intro: BlockObjectResponse[]; // blocks before the first H2
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
  const { sections, intro } = splitByH2(blocks);

  return { ...project, sections, intro, allBlocks: blocks };
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
 * Splits Notion blocks into sections at every H2.
 * The H2 text becomes the section label; its following blocks are the content.
 * Blocks before the first H2 go into `intro`.
 */
function splitByH2(blocks: BlockObjectResponse[]): {
  sections: PageSection[];
  intro: BlockObjectResponse[];
} {
  const intro: BlockObjectResponse[] = [];
  const sections: PageSection[] = [];

  for (const block of blocks) {
    if (block.type === "heading_2") {
      const h2 = block as BlockObjectResponse & {
        heading_2: { rich_text: RichTextItemResponse[] };
      };
      const label = richTextToPlain(h2.heading_2.rich_text).trim();
      sections.push({ label, blocks: [] });
      continue;
    }

    if (sections.length === 0) {
      intro.push(block);
    } else {
      sections[sections.length - 1].blocks.push(block);
    }
  }

  return { sections, intro };
}
