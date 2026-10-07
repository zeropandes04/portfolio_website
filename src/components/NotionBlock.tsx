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
      <code className="bg-surface border border-line px-1.5 py-0.5 rounded-md text-[0.9em] font-mono text-fg">
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
        className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent transition-colors"
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
        <p>
          <RichTextContent rich={block.paragraph.rich_text} />
        </p>
      );

    case "heading_1":
      return (
        <h1>
          <RichTextContent rich={block.heading_1.rich_text} />
        </h1>
      );

    case "heading_2":
      return (
        <h2>
          <RichTextContent rich={block.heading_2.rich_text} />
        </h2>
      );

    case "heading_3":
      return (
        <h3>
          <RichTextContent rich={block.heading_3.rich_text} />
        </h3>
      );

    case "bulleted_list_item":
      return (
        <li className="mb-1.5 ml-5 pl-1 list-disc">
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
        <li className="mb-1.5 ml-5 pl-1 list-decimal">
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
        <blockquote className="my-8 border-l-2 border-accent pl-6 text-xl leading-relaxed text-fg tracking-tight">
          <RichTextContent rich={block.quote.rich_text} />
        </blockquote>
      );

    case "callout":
      return (
        <div className="flex gap-4 border border-line bg-surface rounded-2xl p-5 my-6">
          {block.callout.icon?.type === "emoji" && (
            <span className="text-xl leading-7">{block.callout.icon.emoji}</span>
          )}
          <p className="!mb-0">
            <RichTextContent rich={block.callout.rich_text} />
          </p>
        </div>
      );

    case "divider":
      return <hr className="border-line my-10" />;

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
            className="rounded-2xl ring-1 ring-line w-full object-cover"
          />
          {caption.length > 0 && (
            <figcaption className="mt-3 text-center text-sm text-subtle">
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
          <div className="my-8 aspect-video rounded-2xl overflow-hidden ring-1 ring-line">
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
          <video src={url} controls className="rounded-2xl w-full ring-1 ring-line" />
        </div>
      );
    }

    case "code":
      return (
        <pre className="bg-[#0f0f11] text-neutral-100 ring-1 ring-line rounded-2xl p-5 my-6 overflow-x-auto text-sm leading-relaxed font-mono">
          <code>
            <RichTextContent rich={block.code.rich_text} />
          </code>
        </pre>
      );

    case "toggle":
      return (
        <details className="group my-3 border border-line rounded-2xl open:bg-surface/50 transition-colors">
          <summary className="px-5 py-3.5 cursor-pointer font-medium text-fg rounded-2xl hover:bg-surface">
            <RichTextContent rich={block.toggle.rich_text} />
          </summary>
          {block.children && (
            <div className="px-5 pb-4 pt-1">
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
        <div className="my-8 rounded-2xl overflow-hidden ring-1 ring-line aspect-video">
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
