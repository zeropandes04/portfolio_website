import { profile } from "@/lib/profile";

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

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      {/* Bio */}
      <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-6">
        Hi, I&apos;m{" "}
        <span style={{ color: "var(--brand-blue)" }}>
          {profile.name.split(" ")[0]}
        </span>
      </h1>
      <p className="text-xl text-neutral-500 leading-relaxed mb-4">
        I&apos;m a Product Manager at Ocado Technology with roots in UX design — which means I care as much about how something feels as whether it ships on time. I work at the intersection of customer insight, data, and cross-functional teams to turn ambiguous problems into products people actually use.
      </p>
      <p className="text-xl text-neutral-500 leading-relaxed mb-16">
        Outside of work, I recharge by traveling to new places and logging miles on the bike.
      </p>

      {/* Experience */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-8">Experience</h2>
      <div className="flex flex-col gap-10">
        {experience.map((entry) => (
          <div key={entry.company} className="grid grid-cols-[1fr_auto] gap-x-6">
            <div>
              <p className="font-semibold text-neutral-900 mb-2">{entry.company}</p>
              <div className="flex flex-col gap-1.5">
                {entry.roles.map((role) => (
                  <div key={role.title} className="flex items-baseline justify-between gap-4">
                    <span className="text-neutral-600">{role.title}</span>
                    <span className="text-sm text-neutral-400 whitespace-nowrap">{role.period}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Education */}
      <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mt-14 mb-8">Education</h2>
      <div className="flex flex-col gap-6">
        {[
          { school: "Elisava School of Design and Engineering", degree: "Master's in Design and Internet Projects Management" },
          { school: "Universitat Ramon Llull", degree: "MSc in Advertising Strategies and Creativity, Advertising and Applied Communication" },
          { school: "University of the Arts London", degree: "BA (Hons) Graphic and Media Design" },
        ].map((entry) => (
          <div key={entry.school}>
            <p className="font-semibold text-neutral-900">{entry.school}</p>
            <p className="text-neutral-500 mt-0.5">{entry.degree}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 pt-10 border-t border-neutral-100">
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
          style={{ color: "var(--brand-blue)" }}
        >
          View full profile on LinkedIn
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
