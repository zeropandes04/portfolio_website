import { NotionBlocks } from "./NotionBlock";

interface Props {
  id: string;
  index: number;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[];
}

export function PyramidSection({ id, index, label, blocks }: Props) {
  if (!blocks.length) return null;

  return (
    <section id={id} className="scroll-mt-24 py-12 border-t border-line first:border-t-0 first:pt-0">
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
        <h2 className="text-2xl md:text-[1.75rem] font-semibold tracking-tight text-fg">{label}</h2>
      </div>
      <div className="prose-content">
        <NotionBlocks blocks={blocks} />
      </div>
    </section>
  );
}
