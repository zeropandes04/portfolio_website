import { profile } from "@/lib/profile";
import { ArrowUpRight, GitHubIcon, LinkedInIcon } from "@/components/Icons";

export const metadata = {
  title: `About — ${profile.name}`,
  description: profile.bio,
};

const experience = [
  {
    company: "Ocado Technology",
    roles: [
      { title: "Product Manager", period: "Jun 2021 – Present" },
      { title: "Senior UX Designer", period: "May 2019 – May 2021" },
    ],
  },
  {
    company: "eDreams",
    roles: [
      { title: "Product Designer (UX)", period: "Aug 2017 – May 2019" },
    ],
  },
  {
    company: "Cronos Group",
    roles: [
      { title: "UX Designer", period: "Sep 2016 – Aug 2017" },
    ],
  },
];

const education = [
  { school: "Elisava School of Design and Engineering", degree: "Master's in Design and Internet Projects Management" },
  { school: "Universitat Ramon Llull", degree: "MSc in Advertising Strategies and Creativity, Advertising and Applied Communication" },
  { school: "University of the Arts London", degree: "BA (Hons) Graphic and Media Design" },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-16 md:pt-28">
      {/* Bio */}
      <section className="rise max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle mb-6">About</p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] text-fg">
          Hi, I&apos;m <span className="text-accent">{profile.name.split(" ")[0]}</span>.
        </h1>
        <p className="mt-8 text-xl md:text-2xl text-muted leading-relaxed">
          I&apos;m a Product Manager with roots in UX and product design. I work at the intersection of customer insights and data to turn ambiguous problems into products people care about.
        </p>
        <p className="mt-4 text-xl md:text-2xl text-muted leading-relaxed">
          I recharge my batteries by logging miles on my bike.
        </p>
      </section>

      {/* Experience */}
      <Section title="Experience">
        <ul className="divide-y divide-line">
          {experience.map((entry) => (
            <li key={entry.company} className="py-6 first:pt-0 grid sm:grid-cols-[200px_1fr] gap-x-8 gap-y-3">
              <p className="font-semibold text-fg">{entry.company}</p>
              <div className="flex flex-col gap-2">
                {entry.roles.map((role) => (
                  <div key={role.title} className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <span className="text-muted">{role.title}</span>
                    <span className="font-mono text-xs text-subtle whitespace-nowrap">{role.period}</span>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Education */}
      <Section title="Education">
        <ul className="divide-y divide-line">
          {education.map((entry) => (
            <li key={entry.school} className="py-6 first:pt-0 grid sm:grid-cols-[200px_1fr] gap-x-8 gap-y-1">
              <p className="font-semibold text-fg">{entry.school}</p>
              <p className="text-muted">{entry.degree}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <section className="mt-24 rounded-3xl border border-line bg-surface/60 p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-fg">Let&apos;s connect</h2>
          <p className="mt-2 text-muted">Full career history on LinkedIn, side projects on GitHub.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-fg text-bg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-85"
          >
            <LinkedInIcon size={16} />
            LinkedIn
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-line bg-bg px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface"
          >
            <GitHubIcon size={16} />
            GitHub
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-20 md:mt-28">
      <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-subtle pb-4 mb-6 border-b border-line">
        {title}
      </h2>
      {children}
    </section>
  );
}
