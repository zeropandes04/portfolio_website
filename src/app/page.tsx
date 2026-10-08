import Link from "next/link";
import { getProjects } from "@/lib/notion";
import { profile } from "@/lib/profile";
import { ProjectCard } from "@/components/ProjectCard";
import { ArrowRight, GitHubIcon, LinkedInIcon } from "@/components/Icons";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* ── Intro ───────────────────────────────────────────────────────── */}
      <section className="rise pt-16 pb-16 md:pt-28 md:pb-24">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle mb-6">
          {profile.focus.join(" · ")}
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-fg max-w-3xl">
          {profile.name}
          <span className="text-subtle"> — {profile.title.toLowerCase()} with roots in design.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted leading-relaxed max-w-2xl">
          {profile.bio}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href="#work"
            className="group inline-flex items-center gap-2 rounded-full bg-fg text-bg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-85"
          >
            See the work
            <ArrowRight size={14} className="rotate-90 transition-transform group-hover:translate-y-0.5" />
          </a>
          <Link
            href="/about"
            className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface"
          >
            About me
          </Link>
          <div className="hidden sm:flex items-center gap-1 ml-1">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="grid place-items-center size-10 rounded-full text-muted hover:text-fg hover:bg-surface transition-colors"
            >
              <GitHubIcon />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="grid place-items-center size-10 rounded-full text-muted hover:text-accent hover:bg-surface transition-colors"
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>
      </section>

      {/* ── Projects / Case Studies ─────────────────────────────────────── */}
      <section id="work" className="scroll-mt-24">
        <div className="flex items-end justify-between gap-4 pb-6 mb-10 border-b border-line">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg">
              Projects &amp; explorations
            </h2>
            <p className="mt-2 text-muted">
              Experiments, products and ideas — pick one to dig in.
            </p>
          </div>
          {projects.length > 0 && (
            <span className="font-mono text-xs text-subtle shrink-0">
              {String(projects.length).padStart(2, "0")} projects
            </span>
          )}
        </div>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-14">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                featured={i === 0 && projects.length !== 2}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-line rounded-3xl p-16 text-center bg-surface/50">
      <h3 className="text-lg font-semibold text-fg mb-2">No projects yet</h3>
      <p className="text-muted max-w-sm mx-auto">
        Connect your Notion database and add your first project to see it
        appear here. See the{" "}
        <code className="px-1.5 py-0.5 rounded text-sm font-mono text-accent bg-accent-soft">
          .env.local.example
        </code>{" "}
        file for setup instructions.
      </p>
    </div>
  );
}
