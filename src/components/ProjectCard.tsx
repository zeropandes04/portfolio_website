import Link from "next/link";
import { Project } from "@/lib/notion";

const COLOR_MAP: Record<string, { bg: string; icon: string }> = {
  green: { bg: "bg-emerald-500", icon: "🧾" },
  blue: { bg: "bg-sky-500", icon: "📊" },
  yellow: { bg: "bg-amber-400", icon: "🌍" },
  red: { bg: "bg-rose-500", icon: "🏠" },
  purple: { bg: "bg-violet-500", icon: "💡" },
  orange: { bg: "bg-orange-500", icon: "⚡" },
  pink: { bg: "bg-pink-500", icon: "✨" },
  gray: { bg: "bg-neutral-500", icon: "📁" },
};

function getColor(color: string) {
  return COLOR_MAP[color] ?? COLOR_MAP.blue;
}

interface Props {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: Props) {
  const { bg, icon } = getColor(project.color);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group grid grid-cols-1 md:grid-cols-[280px_1fr] gap-0 md:gap-8 items-center py-10 border-b border-neutral-100 hover:border-neutral-200 transition-all"
    >
      {/* Cover / Thumbnail */}
      <div
        className={`relative h-52 md:h-44 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 ${bg}`}
      >
        {project.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl opacity-80">{icon}</span>
        )}
      </div>

      {/* Content */}
      <div className="pt-4 md:pt-0">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2 block">
          Project {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2 transition-colors" style={{ ["--tw-text-opacity" as string]: "1" }}>
          <span className="group-hover:text-[#3D79F2] transition-colors">{project.title}</span>
        </h3>
        <p className="text-neutral-500 leading-relaxed mb-4 max-w-lg">
          {project.description}
        </p>
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-700 border border-neutral-300 rounded-full px-4 py-1.5 transition-all group-hover:border-[#3D79F2] group-hover:text-[#3D79F2]">
          View project
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
