# Feature Implementation Plan

**Overall Progress:** `100%`

## TLDR
Add a GitHub pill button to the header nav and footer, remove the "Contact" nav item and its now-orphaned page, and drop the unused email field/links from profile and footer.

## Critical Decisions
- GitHub pill style: black bg, white text, "GitHub" label, placed before the LinkedIn pill — matches existing pill pattern, no new icon assets needed
- Delete `src/app/contact/` entirely — confirmed orphaned (only inbound link was the Header "Contact" item being removed)
- Remove `profile.email` field — becomes fully unused once footer/contact references are gone
- Footer order becomes `GitHub | LinkedIn` (text links), email link removed

## Tasks

- [x] 🟩 **Step 1: Update profile.ts**
  - [x] 🟩 Add `github: "https://github.com/zeropandes04"`
  - [x] 🟩 Remove `email` field

- [x] 🟩 **Step 2: Update Header nav (src/components/Header.tsx)**
  - [x] 🟩 Remove the "Contact" `Link`
  - [x] 🟩 Add GitHub pill button (black bg, white text, "GitHub" label) before the LinkedIn pill, matching its shape/classes

- [x] 🟩 **Step 3: Update Footer (src/app/layout.tsx)**
  - [x] 🟩 Remove the `mailto` email link
  - [x] 🟩 Add GitHub text link; order becomes `GitHub | LinkedIn`

- [x] 🟩 **Step 4: Remove Contact page**
  - [x] 🟩 Delete `src/app/contact/` directory entirely

- [x] 🟩 **Step 5: Verify**
  - [x] 🟩 Run dev server, check header/footer render correctly
  - [x] 🟩 Confirm `/contact` returns 404
  - [x] 🟩 Lint/build passes

## Outcome
- Site has **no contact mechanism** anymore (no `/contact` page, no email/mailto anywhere). If a future ticket wants a contact CTA back, `profile.ts` no longer has an `email` field — re-add it then.
- Header nav is now: `Work`, `About` (text) + `GitHub`, `LinkedIn` (black/blue pills). Two pills side-by-side — if a 3rd CTA is ever added, revisit nav spacing/wrapping on narrow viewports (nav has no mobile/hamburger variant).
- `profile.github` / `profile.linkedin` are hardcoded strings (not env-driven), consistent with prior `linkedin` pattern — `name`/`title`/`bio` are the only env-overridable fields.
