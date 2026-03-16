import { NotionBlocks } from "./NotionBlock";

interface Props {
  label: string;
  description: string;
  accentColor: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blocks: any[];
  variant?: "highlight" | "default";
}

export function PyramidSection({
  label,
  description,
  accentColor,
  blocks,
  variant = "default",
}: Props) {
  if (!blocks.length) return null;

  return (
    <section
      className="rounded-2xl p-6 md:p-8 mb-6"
      style={
        variant === "highlight"
          ? { backgroundColor: "#fff8f0", border: "1px solid var(--brand-orange)" }
          : { backgroundColor: "#ffffff", border: "1px solid #e5e7eb" }
      }
    >
      <div className="flex items-start gap-4 mb-5">
        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${accentColor}`}>
          {label}
        </span>
      </div>
      <p className="text-sm text-neutral-500 mb-4 italic">{description}</p>
      <div className="prose-content">
        <NotionBlocks blocks={blocks} />
      </div>
    </section>
  );
}
