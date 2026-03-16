import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type RichText = {
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
};

function RichTextSpan({ item }: { item: RichText }) {
  let content: React.ReactNode = item.plain_text;

  if (item.annotations.code) {
    content = (
      <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-sm font-mono" style={{ color: "var(--brand-coral)" }}>
        {content}
      </code>
    );
  } else {
    if (item.annotations.bold) content = <strong>{content}</strong>;
    if (item.annotations.italic) content = <em>{content}</em>;
    if (item.annotations.strikethrough) content = <s>{content}</s>;
    if (item.annotations.underline) content = <u>{content}</u>;
  }

  if (item.href) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-70 transition-opacity"
        style={{ color: "var(--brand-blue)" }}
      >
        {content}
      </a>
    );
  }

  return <span>{content}</span>;
}

function RichTextContent({ rich }: { rich: RichText[] }) {
  return (
    <>
      {rich.map((item, i) => (
        <RichTextSpan key={i} item={item} />
      ))}
    </>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBlock = BlockObjectResponse & { [key: string]: any; children?: AnyBlock[] };

export function NotionBlock({ block }: { block: AnyBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-neutral-700 leading-relaxed mb-4">
          <RichTextContent rich={block.paragraph.rich_text} />
        </p>
      );

    case "heading_1":
      return (
        <h1 className="text-3xl font-bold text-neutral-900 mt-10 mb-4">
          <RichTextContent rich={block.heading_1.rich_text} />
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="text-2xl font-semibold text-neutral-800 mt-8 mb-3">
          <RichTextContent rich={block.heading_2.rich_text} />
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="text-xl font-semibold text-neutral-800 mt-6 mb-2">
          <RichTextContent rich={block.heading_3.rich_text} />
        </h3>
      );

    case "bulleted_list_item":
      return (
        <li className="text-neutral-700 leading-relaxed mb-1 ml-4 list-disc">
          <RichTextContent rich={block.bulleted_list_item.rich_text} />
          {block.children && block.children.length > 0 && (
            <ul className="ml-4 mt-1">
              {block.children.map((child: AnyBlock) => (
                <NotionBlock key={child.id} block={child} />
              ))}
            </ul>
          )}
        </li>
      );

    case "numbered_list_item":
      return (
        <li className="text-neutral-700 leading-relaxed mb-1 ml-4 list-decimal">
          <RichTextContent rich={block.numbered_list_item.rich_text} />
          {block.children && block.children.length > 0 && (
            <ol className="ml-4 mt-1">
              {block.children.map((child: AnyBlock) => (
                <NotionBlock key={child.id} block={child} />
              ))}
            </ol>
          )}
        </li>
      );

    case "quote":
      return (
        <blockquote className="pl-5 py-1 my-4 text-neutral-600 italic rounded-r-lg" style={{ borderLeft: "4px solid var(--brand-yellow)", backgroundColor: "#fef9ee" }}>
          <RichTextContent rich={block.quote.rich_text} />
        </blockquote>
      );

    case "callout":
      return (
        <div className="flex gap-3 border border-neutral-200 rounded-xl p-4 my-4" style={{ backgroundColor: "var(--brand-light)" }}>
          {block.callout.icon?.type === "emoji" && (
            <span className="text-2xl">{block.callout.icon.emoji}</span>
          )}
          <p className="text-neutral-700 leading-relaxed">
            <RichTextContent rich={block.callout.rich_text} />
          </p>
        </div>
      );

    case "divider":
      return <hr className="border-neutral-200 my-8" />;

    case "image": {
      const src =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file?.url;
      const caption: RichText[] = block.image.caption ?? [];
      if (!src) return null;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={caption.map((c: RichText) => c.plain_text).join("") || ""}
            className="rounded-xl w-full object-cover"
          />
          {caption.length > 0 && (
            <figcaption className="mt-2 text-center text-sm text-neutral-500">
              <RichTextContent rich={caption} />
            </figcaption>
          )}
        </figure>
      );
    }

    case "video": {
      const url =
        block.video.type === "external"
          ? block.video.external.url
          : block.video.file?.url;
      if (!url) return null;
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.includes("youtu.be")
          ? url.split("/").pop()
          : new URL(url).searchParams.get("v");
        return (
          <div className="my-8 aspect-video rounded-xl overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
      return (
        <div className="my-8">
          <video src={url} controls className="rounded-xl w-full" />
        </div>
      );
    }

    case "code":
      return (
        <pre className="bg-neutral-900 text-neutral-100 rounded-xl p-5 my-6 overflow-x-auto text-sm font-mono">
          <code>
            <RichTextContent rich={block.code.rich_text} />
          </code>
        </pre>
      );

    case "toggle":
      return (
        <details className="my-3 border border-neutral-200 rounded-lg">
          <summary className="px-4 py-3 cursor-pointer font-medium text-neutral-800 hover:bg-neutral-50">
            <RichTextContent rich={block.toggle.rich_text} />
          </summary>
          {block.children && (
            <div className="px-4 pb-3 pt-1">
              <NotionBlocks blocks={block.children} />
            </div>
          )}
        </details>
      );

    case "column_list":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
          {block.children?.map((col: AnyBlock) => (
            <div key={col.id}>
              <NotionBlocks blocks={col.children ?? []} />
            </div>
          ))}
        </div>
      );

    case "table_of_contents":
      return null;

    case "embed":
      return (
        <div className="my-8 rounded-xl overflow-hidden border border-neutral-200 aspect-video">
          <iframe src={block.embed.url} className="w-full h-full" />
        </div>
      );

    default:
      return null;
  }
}

export function NotionBlocks({ blocks }: { blocks: AnyBlock[] }) {
  const rendered: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items: AnyBlock[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i]);
        i++;
      }
      rendered.push(
        <ul key={`ul-${i}`} className="my-4">
          {items.map((b) => (
            <NotionBlock key={b.id} block={b} />
          ))}
        </ul>
      );
    } else if (block.type === "numbered_list_item") {
      const items: AnyBlock[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(blocks[i]);
        i++;
      }
      rendered.push(
        <ol key={`ol-${i}`} className="my-4">
          {items.map((b) => (
            <NotionBlock key={b.id} block={b} />
          ))}
        </ol>
      );
    } else {
      rendered.push(<NotionBlock key={block.id} block={block} />);
      i++;
    }
  }

  return <>{rendered}</>;
}
