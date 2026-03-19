import { getProjects } from "@/lib/notion";
import { ProjectCard } from "@/components/ProjectCard";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const projects = await getProjects();

  return (
    <div className="max-w-5xl mx-auto px-6">
      {/* ── Projects / Case Studies ─────────────────────────────────────── */}
      <section id="work" className="py-12 pb-24">
        <div className="mb-2">
          <h2 className="text-3xl font-bold text-neutral-900">Projects &amp; explorations</h2>
        </div>
        <p className="text-neutral-500 mb-8">
          A mix of experiments, projects, and explorations — click any card to dig in.
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
        <code className="px-1.5 py-0.5 rounded text-sm" style={{ color: "var(--brand-blue)", backgroundColor: "#eef3fe" }}>
          .env.local.example
        </code>{" "}
        file for setup instructions.
      </p>
    </div>
  );
}
