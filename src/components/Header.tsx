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
          Xavier Puig <span className="text-neutral-400 font-normal">/ Product Management · User Experience · AI Systems</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-neutral-500 hover:text-neutral-900 transition-colors">
            Work
          </Link>
          <Link href="/about" className="text-neutral-500 hover:text-neutral-900 transition-colors">
            About
          </Link>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-900 text-white px-4 py-1.5 rounded-full text-xs font-semibold transition-opacity hover:opacity-80"
          >
            GitHub
          </a>
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
