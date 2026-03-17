import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectBySlug, getProjects } from "@/lib/notion";
import { PyramidSection } from "@/components/PyramidSection";
import { NotionBlocks } from "@/components/NotionBlock";

export const revalidate = 60;

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
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div>
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative h-64 md:h-96 bg-neutral-900 overflow-hidden">
        {project.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverUrl}
            alt={project.title}
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, var(--brand-blue), #1a4fa8)" }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-6 pb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/70 text-sm mb-4 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to work
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {project.title}
          </h1>
          {project.description && (
            <p className="mt-3 text-lg text-white/70 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Intro blocks (before first H2) */}
        {project.intro.length > 0 && (
          <div className="prose-content mb-8">
            <NotionBlocks blocks={project.intro} />
          </div>
        )}

        {/* H2-delimited sections */}
        {project.sections.length > 0 ? (
          project.sections.map((section) => (
            <PyramidSection
              key={section.label}
              label={section.label}
              blocks={section.blocks}
            />
          ))
        ) : (
          <div className="prose-content">
            <NotionBlocks blocks={project.allBlocks} />
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-neutral-100">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-600 font-medium transition-colors hover:opacity-70"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All projects
          </Link>
        </div>
      </div>
    </div>
  );
}
