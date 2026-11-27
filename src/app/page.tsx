import { Fragment } from "react";
import Link from "next/link";
import { getProjects } from "@/lib/notion";
import { profile } from "@/lib/profile";
import { ProjectCard } from "@/components/ProjectCard";
import { ArrowRight } from "@/components/Icons";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* ── Intro: a one-glance shop window; the full story lives on /about ── */}
      <section className="rise pt-10 pb-10 md:pt-16 md:pb-12">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle mb-5">
          {/* nowrap per item so a line only ever breaks at the separator */}
          {profile.focus.map((item, i) => (
            <Fragment key={item}>
              {i > 0 && " · "}
              <span className="whitespace-nowrap">{item}</span>
            </Fragment>
          ))}
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1] text-fg max-w-3xl">
          {profile.name}
          <span className="text-subtle"> — {profile.tagline}</span>
        </h1>
        <Link
          href="/about"
          className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg transition-colors"
        >
          About me
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </section>

      {/* ── Projects / Case Studies ─────────────────────────────────────── */}
      <section id="work" className="scroll-mt-24">
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-subtle pb-4 mb-8 border-b border-line">
          Projects &amp; explorations
        </h2>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                // Zigzag: wide, narrow / narrow, wide → positions 1, 4, 5, 8, 9…
                featured={i % 4 === 0 || i % 4 === 3}
                // Every row holds two cards, so an odd count leaves the last one alone
                fillRow={projects.length % 2 === 1 && i === projects.length - 1}
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
