// Maps the Notion "Color" select to a hex accent + fallback emoji used when a
// project has no cover image.
const PROJECT_COLORS: Record<string, { hex: string; icon: string }> = {
  green: { hex: "#10b981", icon: "🧾" },
  blue: { hex: "#3d79f2", icon: "📊" },
  yellow: { hex: "#f2ba52", icon: "🌍" },
  red: { hex: "#f43f5e", icon: "🏠" },
  purple: { hex: "#8b5cf6", icon: "💡" },
  orange: { hex: "#f29c50", icon: "⚡" },
  pink: { hex: "#ec4899", icon: "✨" },
  gray: { hex: "#6b7280", icon: "📁" },
};

export function getProjectColor(color: string) {
  return PROJECT_COLORS[color] ?? PROJECT_COLORS.blue;
}

/** Soft gradient background for cover placeholders. */
export function coverGradient(hex: string): string {
  return `radial-gradient(120% 120% at 0% 0%, ${hex}55 0%, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${hex}99 0%, transparent 60%), ${hex}22`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
