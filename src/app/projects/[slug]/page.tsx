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
    title: `${project.title} — Case Study`,
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

  const hasPyramidSections =
    project.situation.length > 0 ||
    project.complication.length > 0 ||
    project.answer.length > 0;

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
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900" />
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
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Summary line */}
        <p className="text-xl text-neutral-500 leading-relaxed mb-12 pb-10 border-b border-neutral-100">
          {project.description}
        </p>

        {hasPyramidSections ? (
          <>
            {/* ── Pyramid Principle Layout ─────────────────────────────── */}
            <div className="mb-8">
              <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">
                Case Study Structure
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-12">
                {[
                  { label: "Situation", icon: "🌍", desc: "Context & background" },
                  { label: "Complication", icon: "⚡", desc: "The challenge" },
                  { label: "Answer", icon: "💡", desc: "Key insight" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-neutral-50 rounded-xl p-4 text-center border border-neutral-100"
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="font-semibold text-neutral-800 text-sm">{item.label}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <PyramidSection
              label="Situation"
              description="The context and background — what was the world like before this project?"
              accentColor="bg-blue-100 text-blue-700"
              blocks={project.situation}
            />

            <PyramidSection
              label="Complication"
              description="The challenge or tension — why was the status quo not good enough?"
              accentColor="bg-amber-100 text-amber-700"
              blocks={project.complication}
            />

            <PyramidSection
              label="Key Question & Answer"
              description="The core question this project answered — and the insight that unlocked the solution."
              accentColor="bg-indigo-100 text-indigo-700"
              blocks={project.answer}
              variant="highlight"
            />

            {project.body.length > 0 && (
              <section className="mt-8">
                <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">
                  Deep dive
                </h2>
                <div className="prose-content">
                  <NotionBlocks blocks={project.body} />
                </div>
              </section>
            )}
          </>
        ) : (
          /* ── Fallback: render all blocks normally ──────────────────── */
          <div className="prose-content">
            <NotionBlocks blocks={project.allBlocks} />
          </div>
        )}

        {/* ── Navigation ───────────────────────────────────────────────── */}
        <div className="mt-16 pt-8 border-t border-neutral-100 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-neutral-600 font-medium hover:text-indigo-600 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All case studies
          </Link>
        </div>
      </div>
    </div>
  );
}
