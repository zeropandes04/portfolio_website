"use client";

import { MoonIcon, SunIcon } from "./Icons";

// Flips between light and dark and remembers the choice. Until the visitor
// clicks, the site follows their OS setting. Icons swap via the `dark:`
// variant (CSS), so server and client render the same markup.
export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const isDark =
      root.dataset.theme === "dark" ||
      (!root.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage blocked (private mode etc.) — the toggle still works for this page view
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="grid place-items-center size-9 rounded-full text-muted hover:text-fg hover:bg-surface transition-colors cursor-pointer"
    >
      {/* Moon in light mode (switch to dark), sun in dark mode (switch to light) */}
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  );
}
