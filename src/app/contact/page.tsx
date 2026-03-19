import { profile } from "@/lib/profile";

export const metadata = {
  title: `Contact — ${profile.name}`,
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-4">
        Get in touch
      </h1>
      <p className="text-xl text-neutral-500 leading-relaxed mb-10">
        Have a project in mind or just want to connect? Drop me an email.
      </p>
      <a
        href={`mailto:${profile.email}`}
        className="inline-flex items-center gap-3 text-white text-lg font-semibold px-8 py-4 rounded-full transition-opacity hover:opacity-80"
        style={{ backgroundColor: "var(--brand-blue)" }}
      >
        {profile.email}
        <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
          <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
    </div>
  );
}
