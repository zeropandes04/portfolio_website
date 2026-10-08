import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjects } from "@/lib/notion";
import { coverGradient, getProjectColor, slugify } from "@/lib/colors";
import { PyramidSection } from "@/components/PyramidSection";
import { NotionBlocks } from "@/components/NotionBlock";
import { TableOfContents } from "@/components/TableOfContents";
import { ArrowLeft, ArrowRight } from "@/components/Icons";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title}`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.coverUrl ? [project.coverUrl] : [],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProjectBySlug(slug), getProjects()]);

  if (!project) notFound();

  const { hex, icon } = getProjectColor(project.color);

  // Stable, unique anchor ids for each H2 section
  const seen = new Map<string, number>();
  const sections = project.sections
    .filter((s) => s.blocks.length > 0)
    .map((s, i) => {
      const base = slugify(s.label) || `section-${i + 1}`;
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return { ...s, id: count ? `${base}-${count + 1}` : base };
    });

  const position = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length > 1 && position !== -1 ? projects[(position + 1) % projects.length] : null;

  return (
    // --project drives the colour coding (icon tile, section numbers, TOC, quotes)
    <article style={{ "--project": hex } as React.CSSProperties}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="rise max-w-5xl mx-auto px-6 pt-10 md:pt-16">
        <Link
          href="/#work"
          className="group inline-flex items-center gap-2 text-sm text-muted hover:text-fg transition-colors"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          All projects
        </Link>
        <span
          className="mt-8 grid place-items-center size-14 rounded-2xl ring-1 ring-line text-2xl"
          style={{ background: coverGradient(hex) }}
          aria-hidden="true"
        >
          {icon}
        </span>
        <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-fg max-w-4xl">
          {project.title}
        </h1>
        {project.description && (
          <p className="mt-6 text-lg md:text-xl text-muted leading-relaxed max-w-2xl">
            {project.description}
          </p>
        )}
      </header>

      {/* ── Cover (only when the project has a real image) ───────────────── */}
      {project.coverUrl && (
        <div className="max-w-5xl mx-auto px-6 mt-12 md:mt-16">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl ring-1 ring-line bg-surface">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div
        className={`max-w-5xl mx-auto px-6 py-16 md:py-20 ${
          sections.length > 1 ? "lg:grid lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-16" : ""
        }`}
      >
        {sections.length > 1 && (
          <aside className="hidden lg:block">
            <TableOfContents items={sections.map(({ id, label }) => ({ id, label }))} />
          </aside>
        )}

        <div className="max-w-[68ch]">
          {/* Intro blocks (before first H2) */}
          {project.intro.length > 0 && (
            <div className="prose-content text-lg mb-12">
              <NotionBlocks blocks={project.intro} />
            </div>
          )}

          {/* H2-delimited sections */}
          {project.sections.length > 0 ? (
            sections.map((section, i) => (
              <PyramidSection
                key={section.id}
                id={section.id}
                index={i}
                label={section.label}
                blocks={section.blocks}
              />
            ))
          ) : (
            <div className="prose-content">
              <NotionBlocks blocks={project.allBlocks} />
            </div>
          )}
        </div>
      </div>

      {/* ── Next project ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center justify-between gap-6 rounded-3xl border border-line bg-surface/60 p-6 md:p-10 transition-colors hover:bg-surface"
          >
            <div className="flex items-center gap-5 min-w-0">
              <span
                className="hidden sm:grid place-items-center size-16 md:size-20 shrink-0 rounded-2xl ring-1 ring-line text-3xl transition-transform group-hover:scale-105"
                style={{ background: coverGradient(getProjectColor(next.color).hex) }}
                aria-hidden="true"
              >
                {getProjectColor(next.color).icon}
              </span>
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle">Next project</p>
                <p className="mt-3 text-2xl md:text-4xl font-semibold tracking-tight text-fg truncate transition-colors group-hover:text-accent">
                  {next.title}
                </p>
              </div>
            </div>
            <span className="grid place-items-center size-12 md:size-14 shrink-0 rounded-full bg-fg text-bg transition-transform group-hover:translate-x-1">
              <ArrowRight size={18} />
            </span>
          </Link>
        ) : (
          <Link
            href="/#work"
            className="group inline-flex items-center gap-2 text-muted hover:text-fg font-medium transition-colors"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
            All projects
          </Link>
        )}
      </div>
    </article>
  );
}
