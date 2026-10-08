"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { profile } from "@/lib/profile";
import { GitHubIcon, LinkedInIcon } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Work", match: (p: string) => p === "/" || p.startsWith("/projects") },
  { href: "/about", label: "About", match: (p: string) => p.startsWith("/about") },
];

export function Header() {
  const pathname = usePathname();
  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 bg-bg/75 backdrop-blur-xl border-b border-line/70">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-2.5" aria-label={`${profile.name} — home`}>
          <span className="grid place-items-center size-8 rounded-full bg-fg text-bg text-xs font-semibold tracking-tight transition-transform group-hover:scale-105">
            {initials}
          </span>
          <span className="hidden sm:block font-semibold tracking-tight text-fg">{profile.name}</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-3 py-1.5 rounded-full transition-colors ${
                  active ? "bg-surface text-fg font-medium" : "text-muted hover:text-fg"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="w-px h-5 bg-line mx-2" aria-hidden="true" />
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid place-items-center size-9 rounded-full text-muted hover:text-fg hover:bg-surface transition-colors"
          >
            <GitHubIcon />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid place-items-center size-9 rounded-full text-muted hover:text-accent hover:bg-surface transition-colors"
          >
            <LinkedInIcon />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
