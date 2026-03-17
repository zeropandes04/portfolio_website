import { NotionBlocks } from "./NotionBlock";

interface Props {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[];
}

export function PyramidSection({ label, blocks }: Props) {
  if (!blocks.length) return null;

  return (
    <section
      className="rounded-2xl p-6 md:p-8 mb-6"
      style={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }}
    >
      <div className="mb-5">
        <span
          className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-white"
          style={{ backgroundColor: "var(--brand-coral)" }}
        >
          {label}
        </span>
      </div>
      <div className="prose-content">
        <NotionBlocks blocks={blocks} />
      </div>
    </section>
  );
}
