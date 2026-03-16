import { getProjects } from "@/lib/notion";
import { profile } from "@/lib/profile";
import { ProjectCard } from "@/components/ProjectCard";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* ── Hero / Profile ─────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 mb-4">
            Product Manager
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 leading-tight mb-6">
            Hi, I&apos;m{" "}
            <span className="text-indigo-600">
              {profile.name.split(" ")[0]}
            </span>
          </h1>
          <p className="text-xl text-neutral-500 leading-relaxed mb-8">
            {profile.bio}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#work"
              className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors"
            >
              View my work
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-neutral-600 font-medium hover:text-indigo-600 transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

{/* ── Projects / Case Studies ─────────────────────────────────────── */}
      <section id="work" className="pb-24">
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-3xl font-bold text-neutral-900">Case studies</h2>
          <span className="text-sm text-neutral-400">{projects.length} projects</span>
        </div>
        <p className="text-neutral-500 mb-8">
          A selection of product work — click any card to read the full case study.
        </p>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-16 text-center">
      <p className="text-4xl mb-4">📋</p>
      <h3 className="text-xl font-semibold text-neutral-700 mb-2">
        No projects yet
      </h3>
      <p className="text-neutral-400 max-w-sm mx-auto">
        Connect your Notion database and add your first project to see it
        appear here. See the{" "}
        <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-sm">
          .env.local.example
        </code>{" "}
        file for setup instructions.
      </p>
    </div>
  );
}
