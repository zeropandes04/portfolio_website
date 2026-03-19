import { profile } from "@/lib/profile";

export const metadata = {
  title: `About — ${profile.name}`,
  description: profile.bio,
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight mb-6">
        Hi, I&apos;m{" "}
        <span style={{ color: "var(--brand-blue)" }}>
          {profile.name.split(" ")[0]}
        </span>
      </h1>
      <p className="text-xl text-neutral-500 leading-relaxed">
        {profile.bio}
      </p>
    </div>
  );
}
