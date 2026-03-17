import Link from "next/link";
import { profile } from "@/lib/profile";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-neutral-900 tracking-tight text-sm transition-opacity hover:opacity-70"
        >
          {profile.name.split(" ")[0]} <span className="text-neutral-400 font-normal">/ Product</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-neutral-500 hover:text-neutral-900 transition-colors">
            Work
          </Link>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--brand-blue)" }}
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </header>
  );
}
