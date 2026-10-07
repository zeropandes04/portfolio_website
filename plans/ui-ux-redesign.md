# Feature Implementation Plan

**Overall Progress:** `100%`

## TLDR
Modernise the portfolio's look and UX without changing its purpose (showcasing projects and ideas) or its data model (Notion). Same pages, same content, sharper presentation and better navigation.

## Critical Decisions
- Design tokens over hardcoded colours — one set of CSS variables (`bg`, `fg`, `muted`, `line`, `surface`, `accent`) exposed to Tailwind; enables automatic dark mode (`prefers-color-scheme`) for free.
- Keep brand blue `#3D79F2` as the single accent — drop the coral/yellow pills that competed with it.
- Font: Open Sans → Geist (+ Geist Mono for small labels) — modern, tight, still loaded via `next/font` (no runtime cost).
- Home gets a short hero (name, focus areas, bio, links) — the page previously opened straight onto the project list with no context.
- Projects shown as a visual grid (first project featured full-width) instead of a stacked list.
- Case study pages: clean editorial header + framed cover, sticky "On this page" table of contents built from the existing H2 sections, and a next-project link at the end.
- Header: name + Work/About + GitHub/LinkedIn icon buttons; sticky, active-link state, fits on mobile (long subtitle moved into the hero).
- No new dependencies. No changes to Notion schema or fetching logic, except wrapping both fetchers in React `cache()` so repeated calls in one request share a fetch.

## Tasks

- [x] 🟩 **Step 1: Foundation**
  - [x] 🟩 Tokens + dark mode + prose styles in `globals.css`
  - [x] 🟩 Geist fonts, sticky header, new footer in `layout.tsx`
  - [x] 🟩 Shared icons + colour helpers

- [x] 🟩 **Step 2: Header** — icon links, active state, mobile-friendly

- [x] 🟩 **Step 3: Home** — hero + project grid + refreshed `ProjectCard` / empty state

- [x] 🟩 **Step 4: Project page** — header, cover, TOC, sections, next project; restyle `NotionBlock`

- [x] 🟩 **Step 5: About + 404** — token-based restyle, same copy

- [x] 🟩 **Step 6: Verify** — lint, build, screenshots (desktop/mobile, light/dark) with mock data

## Outcome
- New files: `src/components/Icons.tsx`, `src/components/TableOfContents.tsx` (client), `src/lib/colors.ts` (project colour map + `slugify`, shared by card and project page).
- `Header` is now a client component (needs `usePathname` for active state). Header is `sticky`, so `<main>` no longer needs `pt-14`.
- Colours: use token classes (`text-fg`, `text-muted`, `text-subtle`, `border-line`, `bg-surface`, `text-accent`) — not `neutral-*` or `var(--brand-*)`. Dark mode follows the OS; there's no toggle.
- Project page now also calls `getProjects()` (for "Next project"); both Notion fetchers are wrapped in React `cache()` so repeated calls in one request are deduped.
- TOC only shows on `lg+` screens and only when a case study has 2+ H2 sections.
