import Link from "next/link";
import { Project } from "@/lib/notion";
import { coverGradient, getProjectColor, getProjectIcon } from "@/lib/colors";
import { ArrowUpRight } from "./Icons";

interface Props {
  project: Project;
  index: number;
  featured?: boolean;
  fillRow?: boolean; // last card alone on its row: stretch it across
}

export function ProjectCard({ project, index, featured = false, fillRow = false }: Props) {
  const { hex } = getProjectColor(project.color);
  const icon = getProjectIcon(project);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
        fillRow ? "sm:col-span-2 lg:col-span-3" : featured ? "lg:col-span-2" : ""
      }`}
    >
      {/* Cover */}
      <div
        className={`relative overflow-hidden rounded-3xl ring-1 ring-line bg-surface ${
          "h-40"
        }`}
        style={project.coverUrl ? undefined : { background: coverGradient(hex) }}
      >
        {project.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverUrl}
            alt=""
            loading={index < 2 ? "eager" : "lazy"}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-4xl transition-transform duration-700 ease-out group-hover:scale-110">
            {icon}
          </span>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-bg/70 backdrop-blur px-2.5 py-1 font-mono text-xs text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        {/* Arrow lives inside the banner so it can't read as the next card's */}
        <span className="absolute top-3 right-3 grid place-items-center size-8 rounded-full bg-bg/70 backdrop-blur text-fg transition-colors group-hover:bg-fg group-hover:text-bg">
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      {/* Meta */}
      <div className="mt-5">
        <h3 className="text-xl font-semibold tracking-tight text-fg transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        {project.description && (
          <p className="mt-2 text-muted leading-relaxed line-clamp-2 max-w-2xl">
            {project.description}
          </p>
        )}
      </div>
    </Link>
  );
}
