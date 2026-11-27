import Link from "next/link";
import { Project } from "@/lib/notion";
import { coverGradient, getProjectColor, getProjectIcon } from "@/lib/colors";
import { ArrowUpRight } from "./Icons";

interface Props {
  project: Project;
  index: number;
  featured?: boolean;
}

export function ProjectCard({ project, index, featured = false }: Props) {
  const { hex } = getProjectColor(project.color);
  const icon = getProjectIcon(project);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Cover */}
      <div
        className={`relative overflow-hidden rounded-3xl ring-1 ring-line bg-surface ${
          featured ? "h-32 md:h-40" : "h-28 md:h-32"
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
          <span className={`absolute inset-0 grid place-items-center ${featured ? "text-5xl" : "text-4xl"} transition-transform duration-700 ease-out group-hover:scale-110`}>
            {icon}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-subtle">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3
              className={`font-semibold tracking-tight text-fg transition-colors group-hover:text-accent ${
                featured ? "text-2xl md:text-3xl" : "text-xl"
              }`}
            >
              {project.title}
            </h3>
          </div>
          {project.description && (
            <p className={`mt-2 text-muted leading-relaxed line-clamp-2 ${featured ? "max-w-2xl md:text-lg" : ""}`}>
              {project.description}
            </p>
          )}
        </div>
        <span className="mt-0.5 grid place-items-center size-10 shrink-0 rounded-full border border-line text-fg transition-all group-hover:bg-fg group-hover:text-bg group-hover:border-fg">
          <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
