# Review: Astro round 1 — foundation + three new pages

**Diff range**: `5b51f10..HEAD` (uncommitted on `claude/awesome-blackburn-71faf0`)
**Author**: pouk-ai-engineer
**Reviewer**: pouk-ai-reviewer
**Date**: 2026-05-13
**Recommendation**: REQUEST_CHANGES
**Governing spec(s)**: `.omc/plans/astro-round-1-foundation.md`, `meta/specs/pages/why-ai.md`, `meta/specs/pages/roles.md`, `meta/specs/pages/principles.md`, `meta/specs/content/{roles,principles,failure-modes}.json.md`, `meta/specs/flows/visitor-to-conversation.md`
**Masterplan references**: 1 (quality bar), 2A (boundary discipline), 4.1 (file layout), 4.2 (integrations), 4.3 (client-JS posture), 4.4 (content-as-data), 5.1 (dual consumption), 5.2 (Vercel), 6.1 (parity matrix)

---

## Summary

The engineer stood up a clean Astro 5 project that produces a green build, ships zero client JS on every route (Matomo/Bugsink correctly gated and unset), honors content-as-data via Zod-validated collections, and preserves `/` byte-identically by moving the legacy `index.html` verbatim into `public/`. SEO meta, OG, Twitter card, font preload, canonical, and JSON-LD all emit correctly into the built HTML on all three new routes. Header / main / footer / nav landmarks are present and the sticky CSS-only TOC on `/why-ai` ships exactly as D-02 specifies. Per-spec acceptance criteria are mostly met — decisions D-01 through D-10 are visibly honored in code.

The headline drift is on the **dual-consumption mechanic that the masterplan calls out by name**: the engineer used `"@poukai-inc/ui": "workspace:*"` in `package.json`, which is a strict-workspace-only protocol that the masterplan (section 5.1) explicitly forbids — it says "Same `package.json` works in both modes," meaning a semver specifier is required so CI / Vercel can resolve from `npm.pkg.github.com`. There is no `pnpm-lock.yaml` committed to the site repo (it was written to the workspace root one directory up), so `pnpm install --frozen-lockfile` in `vercel.json` has nothing to freeze. These two together would make the first Vercel deploy fail before `NPM_TOKEN` even gets read. Two HARD a11y / SEO regressions sit alongside: heading hierarchy on `/roles` and `/principles` jumps `h1 → h3` (skipping `h2`, violating R-026), and `robots.txt` advertises `/sitemap.xml` while `@astrojs/sitemap` actually emits `/sitemap-index.xml` and `/sitemap-0.xml` (R-040 mismatch). These are mechanical fixes; nothing in the shape of the work is wrong.

## Spec parity

### `.omc/plans/astro-round-1-foundation.md` — acceptance criteria

- [x] `pnpm install` succeeds with `@poukai-inc/ui@0.2.0` resolved (locally) — verified by `node_modules/@poukai-inc/ui -> ../../../../../../poukai-ui` symlink and the linked package's `package.json` declaring `version: 0.2.0`. (CI / Vercel resolution is BROKEN — see F-001 and F-002.)
- [x] `pnpm build` produces `dist/` with `index.html`, `why-ai/index.html`, `roles/index.html`, `principles/index.html`, `sitemap-*.xml`, all migrated assets — verified by `find dist`.
- [x] `astro check` passes cleanly — build log shows `0 errors, 0 warnings, 0 hints` across 8 Astro files.
- [x] All three new pages render the DS components correctly with no runtime errors in SSR.
- [x] Content collections validate; the build syncs and types the collections (`[content] Synced content`).
- [x] Holding page `/` is byte-identical to the previous `index.html`. **Verified**: `shasum -a 256` on `git show HEAD:index.html` matches `public/index.html` exactly (`9316686e9d…`). (Note: `dist/index.html` differs because `astro-compress` minifies on the way out. See F-203.)
- [x] Sitemap includes all four URLs — `dist/sitemap-0.xml` lists `https://pouk.ai/`, `/why-ai/`, `/roles/`, `/principles/`.
- [x] Brand assets exist in `public/` (`og.png`, `apple-touch-icon.png`, `favicon-16x16.png`, `favicon-32x32.png`, `android-chrome-{192,512}.png`, plus fonts).
- [x] No client JS emitted from `BaseLayout` when Matomo/Bugsink env vars are unset — verified by grepping built HTML: the only `<script>` tag on every Astro page is the JSON-LD block. No external `<script src=...>` references.
- [x] `index.html` removed from repo root — `git status` confirms ` D index.html`.

### `meta/specs/pages/why-ai.md` — section 8

- [x] AC: Route renders at `/why-ai`. — `dist/why-ai/index.html` present.
- [x] AC: All sections in the IA (1–14) are present and ordered as specified. — verified by reading `src/pages/why-ai.astro`.
- [x] AC: Sticky right-rail TOC, ≥ 1024px, CSS-only via `position: sticky`. — `src/styles/site.css` lines 33-54.
- [x] AC: Five `FailureMode` molecules with correct anchors. — `src/content/failure-modes.json` defines `data-readiness`, `wrong-use-case`, `integration`, `governance`, `change-management`.
- [x] AC: Seven headline stats render as `Stat` atoms. — verified inline in `why-ai.astro`; the 500% and 61% extracted from prose into `stats[]` (D-05 honored).
- [x] AC: Footnote-superscript round-trip (D-01). — `<sup class="footnote-ref"><a href="#ref-N" id="cite-N">` paired with `<li id="ref-N">…<a href="#cite-N">↩</a></li>`. Round-trip is complete.
- [x] AC: Discovery questions as inline italic `<blockquote>` (D-04). — `.discovery-questions { font-style: italic; border-left: none; … }`.
- [x] AC: References section lists all sources with linked text.
- [x] AC: `Last reviewed: 2026-05-13` footer present (D-03) above the `SiteShell` footer.
- [x] AC: End CTA renders `mailto:hello@pouk.ai`.
- [x] AC: `<title>` and `<meta description>` contain quantified stat ("Only 12–18% of companies…").
- [x] AC: Page reachable from `SiteShell` top nav (`currentRoute="/why-ai"`).
- [x] AC: Page links to `/roles` (end CTA) and `mailto:hello@pouk.ai` (end CTA).
- [ ] AC: Lighthouse mobile 100/100/100/100. — **NOT VERIFIED.** `lighthouse-ci` not configured in this round (correctly out of scope per the plan); CI must validate.
- [x] AC: No client-side JS shipped. — verified; only JSON-LD `<script>` is present.
- [x] AC: `prefers-reduced-motion` honored. — DS tokens are stated to gate animation; site.css adds no animations of its own. R-030 enforcement is at the DS layer.

### `meta/specs/pages/roles.md` — section 8

- [x] AC: Route renders at `/roles`.
- [x] AC: All sections in the IA (1–8) present and ordered.
- [x] AC: Four `RoleCard` molecules in order Builder, Automator, Educator, Creator. — `src/content/roles.json` preserves that order.
- [x] AC: Each role has anchor ID `#builder`, `#automator`, `#educator`, `#creator`. — `RolesGrid.tsx` line 44 wraps each card in `<div id={role.id}>`.
- [x] AC: Each `RoleCard` receives icon, eyebrow, title, body, hiredBy props. — `RolesGrid.tsx` lines 45-50.
- [x] AC: Eyebrows render as "The Builder", "The Automator", "The Educator", "The Creator" (D-07). — `roles.json`.
- [x] AC: `<h2>` titles render as bare role name. — `roles.json` `title: "Builder"` etc. (Note: the DS `RoleCard` renders the title as `<h3>`, not `<h2>` — see F-101 for the heading-order consequence.)
- [x] AC: Lucide icons map to `hammer`, `workflow`, `graduation-cap`, `clapperboard` (D-06). — `RolesGrid.tsx` lines 33-36.
- [x] AC: Lucide imports confined to site repo (no DS re-export). — `RolesGrid.tsx` imports directly from `lucide-react`; the DS package is untouched.
- [x] AC: Role index jump nav with four links.
- [x] AC: **No `RoleCard` renders a CTA** (D-08). — verified.
- [x] AC: Single universal end CTA.
- [x] AC: Top nav highlights Roles as current.
- [x] AC: Page exposes `mailto:hello@pouk.ai` exactly once.
- [ ] AC: Lighthouse mobile 100/100/100/100. — **NOT VERIFIED** (no LHCI).
- [x] AC: No client-side JS shipped.
- [x] AC: `<title>` and `<meta description>` reflect the four-archetypes framing.

### `meta/specs/pages/principles.md` — section 8

- [x] AC: Route renders at `/principles`.
- [x] AC: All sections in the IA (1–6) present.
- [x] AC: Ten `Principle` molecules in the canonical order. — `principles.json` lists all ten in order.
- [x] AC: Each `Principle` receives `numeral`, `title`, body. — verified in `principles.astro`.
- [x] AC: Numerals lowercase Roman (`i.` through `x.`), stored not computed. — verified in `principles.json`.
- [x] AC: Anchor IDs `#ownership`, `#integrity`, `#reliability`, `#systems-thinking`, `#intellectual-curiosity`, `#obsession`, `#range`, `#momentum`, `#willingness-to-fail`, `#good-nature`. — `principles.json` `anchor` fields match.
- [x] AC: `<h1>` reads "Principles" (D-09). — `<Hero title="Principles" ... />`.
- [x] AC: Introduction and conclusion in Instrument Serif italic (D-10). — `site.css` `.principles-bookend { font-family: var(--font-serif); font-style: italic; }`.
- [x] AC: Ten `Principle` molecules in sans (D-10).
- [x] AC: End CTA renders single muted line with `mailto:`.
- [x] AC: Top nav highlights Principles.
- [ ] AC: Lighthouse mobile 100/100/100/100. — **NOT VERIFIED** (no LHCI).
- [x] AC: No client-side JS shipped.
- [x] AC: `<title>` and `<meta description>` reflect operating-principles framing.

## Masterplan & boundary compliance

- [x] No imports from `poukai-ui/` or `poukai-ui/` source paths — `grep -rE 'from ["'\'']poukai-ui|@poukai-inc/ui/src'` returns zero matches across `src/`. Imports are all `from "@poukai-inc/ui"` (package public exports) plus one `import "@poukai-inc/ui/tokens.css"`.
- [ ] No site-side primitives duplicating `@poukai-inc/ui` responsibility. — `ShellWrapper.tsx` and `RolesGrid.tsx` are site-side components. They are NOT duplicating DS responsibility (they compose DS molecules with site-substance), but they sit close enough to the line to warrant scrutiny — see F-102 and F-103.
- [x] No new design tokens, fonts, color values introduced. — `site.css` consumes `var(--…)` tokens only; no raw colors or sizes.
- [x] No hydration directives (`client:*`) added without a documented reason. — `grep -rE 'client:(load|idle|visible|media|only)' src/` returns zero. R-078 honored.
- [x] No new routes outside the masterplan's four pages. — three new routes match the masterplan's `/why-ai`, `/roles`, `/principles`; `/` left static per the plan's explicit scope.
- [x] No DS-source imports via workspace path that would leak into CI. — package consumes `@poukai-inc/ui` only. (But see F-001: the workspace-protocol pin itself leaks the workspace contract into the manifest that CI will read.)

## Build & metrics

- Build (`pnpm build`): **GREEN** — `astro check` clean (0 errors / 0 warnings / 0 hints across 8 Astro files), `astro build` completed in 1.18s, three static routes emitted, sitemap generated. One non-fatal `astro-compress` warning: `Error: Cannot compress file dist/_astro/principles.CuXQUqwD.css` (the error did not fail the build and the CSS file is still served uncompressed — see F-104).
- Lighthouse mobile: **NOT VERIFIED — CI must validate** (LHCI not configured in this round; round 2's job per the plan).
- Axe violations: **NOT VERIFIED — CI must validate** (axe-core runner not configured in this round). Manual HTML inspection found a heading-order regression (R-026, see F-101) that axe-core would flag.
- HTML weight on `/`: `dist/index.html` raw = 17,013 bytes, gzipped = 6,345 bytes. Comparable measurement on `git show HEAD:index.html` (the current production proxy) gzipped = 6,773 bytes. New `dist/index.html` is **6.3% smaller gzipped** than the old page — well within R-015's +10% ceiling. (The minification happened via `astro-compress` post-write; source `public/index.html` remains byte-identical to git HEAD per the spec's hard requirement. See F-203 for the source-vs-served nuance.)
- HTML weight on the three Astro routes: `dist/why-ai/index.html` 24.6 kB raw / 8.5 kB gzipped; `dist/roles/index.html` 17.5 kB raw / 6.3 kB gzipped; `dist/principles/index.html` 19.9 kB raw / 7.0 kB gzipped. No masterplan budget for these specifically; all well within sensible bounds.
- Client-JS payload: **0 KB** served on every Astro page — the only `<script>` tag on each is the JSON-LD block. R-009/R-010 honored. (Note: `dist/_astro/client.Bl_bWdMq.js` is 143 kB raw / 46 kB gzipped on disk, but is NOT referenced from any HTML; it is an orphan artifact emitted by Astro's React integration. See F-105.)
- TypeScript (`astro check`): **CLEAN** — 0 errors across 8 files.

## Code quality

- Semantic HTML and heading hierarchy: **PARTIAL.** Landmarks present and correct on every page (`<header>`, `<main>`, `<footer>`, `<nav>` — verified by grep). Heading hierarchy regression on `/roles` (h1 → h3) and `/principles` (h1 → h3). See F-101.
- Typed Astro frontmatter and explicit prop interfaces: `BaseLayout.astro` declares a proper `Props` interface; `ShellWrapper.tsx` and `RolesGrid.tsx` both export named TS interfaces.
- No `!important`, no selectors nested > 2 levels: `site.css` is clean — verified by reading.
- Image optimization via `astro:assets`: not applicable in this round; the only site-emitted images are favicons and `og.png` in `public/`, which is correct per R-022 (which excepts `public/` for static assets).
- Section comments where helpful: extensive in `BaseLayout.astro`, `ShellWrapper.tsx`, `RolesGrid.tsx`, and every page template. Quality of comments is high.
- 2-space indentation: verified.
- No `console.log`, no `debugger`, no commented-out experiments, no `TODO` without tracking issue: R-073 honored — the two `TODO: O-011 / O-012` comments in `BaseLayout.astro` reference tracked open questions in `meta/standards/technical-requirements.md`.

## Security & supply chain

- New dependencies: `astro@5.7.13`, `@astrojs/react@4.2.1`, `@astrojs/sitemap@3.3.0`, `@astrojs/check@^0.9.4`, `astro-compress@2.3.3`, `react@18.3.1`, `react-dom@18.3.1`, `lucide-react@0.511.0`, `zod@3.25.28`, `typescript@^5.6.0`, `@types/react`/`@types/react-dom`. All are listed in the plan's stack section; all are MIT-licensed; all are needed for the round-1 scope. R-063, R-064 honored.
- R-065 (exact-pin production deps): mostly honored — `astro`, `@astrojs/react`, `@astrojs/sitemap`, `@poukai-inc/ui`, `astro-compress`, `lucide-react`, `react`, `react-dom`, `zod` are exact-pinned. `@astrojs/check`, `@types/react`, `@types/react-dom`, `typescript` use caret ranges; these are dev deps where caret ranges are allowed per the rule.
- Lockfile delta: **MISSING.** No `pnpm-lock.yaml` in this repo. See F-002.
- Secrets / tokens: confirmed none committed. `.npmrc` references `${NPM_TOKEN}` as an env-var placeholder (correct pattern per R-048). `.gitignore` excludes `.env*`. No hard-coded API keys, DSNs, or tokens in source.

## Findings

### BLOCK

- **F-001 — `@poukai-inc/ui` pinned with `workspace:*` instead of a semver specifier** (`package.json:18`). The masterplan's section 5.1 explicitly states the dual-consumption mechanic: *"Same `package.json` works in both modes."* The site is supposed to declare `@poukai-inc/ui` with a registry-resolvable semver (e.g., `"@poukai-inc/ui": "0.2.0"`), so that locally a parent `pnpm-workspace.yaml` overrides it to the in-repo build, and remotely Vercel resolves the same line from `npm.pkg.github.com`. `workspace:*` is the pnpm strict-workspace protocol — it ONLY resolves inside a pnpm workspace. CI / Vercel checking out only this repo will fail at `pnpm install --frozen-lockfile` with `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND`. Violates **R-005 (HARD)** and `meta/masterplan.md` section 5.1. **Suggested fix**: change `"@poukai-inc/ui": "workspace:*"` to `"@poukai-inc/ui": "0.2.0"` (exact pin per R-065). The parent `pnpm-workspace.yaml` (uncommitted, sibling-parent or `~/`) keeps the local override working; CI sees only the semver.

- **F-002 — `pnpm-lock.yaml` missing from the site repo** (repo root). pnpm wrote the lockfile to the parent workspace root (`/Users/arianzargaran/Desktop/poukai org/pnpm-lock.yaml`) because the `package.json` declares `workspace:*` (see F-001). With no lockfile in the site repo, `vercel.json`'s `installCommand: "pnpm install --frozen-lockfile"` has nothing to freeze and will fail with `ERR_PNPM_NO_LOCKFILE`. Violates **R-003 (HARD)** ("`pnpm-lock.yaml` is present"), **R-066 (HARD)** ("`pnpm-lock.yaml` is committed to the repo and stays in sync with `package.json`"), and `meta/masterplan.md` section 5.2 (the install command itself). **Suggested fix**: fix F-001 first (the lockfile won't relocate while `workspace:*` is in the manifest), then `pnpm install` again at the site-repo root and commit the resulting `pnpm-lock.yaml`.

- **F-003 — Heading hierarchy skips `h2` on `/roles` and `/principles`** (`dist/roles/index.html`, `dist/principles/index.html`). On `/roles`, the sequence is `h1, h3, h3, h3, h3`; on `/principles`, `h1, h3×10`. The `<h1>` comes from the DS `<Hero>` (correct), but the `<RoleCard>` and `<Principle>` molecules render their titles as `<h3>` directly — there is no intermediate `<h2>` on the page. Axe-core's `heading-order` rule will flag this; Lighthouse a11y will drop below 100. Violates **R-026 (HARD)** ("Heading hierarchy on every page starts with exactly one `<h1>` and never skips a level (no `<h1>` → `<h3>`)") and `meta/architecture.md` "Accessibility" ("One `<h1>`"); WCAG 2.1 SC 1.3.1 and SC 2.4.6. **Suggested fix**: surface an `<h2>` heading in each page above the card list (e.g., on `/roles`: `<h2 class="visually-hidden">The four roles</h2>` immediately before `<RolesGrid />`; on `/principles`: `<h2 class="visually-hidden">The ten principles</h2>` immediately before the `.principles-list` block). Alternatively escalate to Claude Design to make `RoleCard` / `Principle` accept a heading-level prop so the consumer chooses `h2` vs `h3`; the site-side `visually-hidden` h2 is the lower-coordination fix.

- **F-004 — `robots.txt` advertises `/sitemap.xml`; `@astrojs/sitemap` emits `/sitemap-index.xml` and `/sitemap-0.xml`** (`robots.txt:3`, `dist/`). The robots.txt line `Sitemap: https://pouk.ai/sitemap.xml` 404s — there is no such file in `dist/`. Crawlers that follow `robots.txt` won't discover the sitemap. Violates **R-040 (HARD)** ("robots.txt references the sitemap") and **R-039 (HARD)** (sitemap discoverability). **Suggested fix**: change the line in `robots.txt` to `Sitemap: https://pouk.ai/sitemap-index.xml` to match Astro's output. (No code-side change to the sitemap integration needed; the integration's filename is conventional.)

### REQUEST_CHANGES

- **F-101 — `ShellWrapper.tsx` exists as a site-side React wrapper around the DS `SiteShell` organism**, with the stated rationale that an Astro/Vite parsing bug makes passing JSX-valued props (like the footer slot) across the `.astro` → React boundary brittle (`src/components/ShellWrapper.tsx:1-46`). This is a legitimate workaround for an upstream tool bug, and the comment block explains it clearly. The concern: it's a thin re-implementation of "what to put in `SiteShell`'s footer slot," and the footer JSX it generates (copyright + `hello@pouk.ai` link) is substance that would normally live in a content data file rather than a `.tsx`. Boundary-wise it's acceptable because the footer content is site-specific and the wrapper holds zero shape concern. The structural concern is fragility: if Astro/Vite ever fixes the JSX-prop parsing issue, the wrapper becomes dead code that nobody remembers why it exists. Violates `meta/architecture.md` shape/substance rule mildly — the wrapper holds substance that should arguably live in JSON. **Suggested fix**: (a) move the footer copy (`year`, `hello@pouk.ai`) into `src/content/site.json` (or `src/content/footer.json`) with a Zod schema so the substance is in the data layer; (b) keep the wrapper but reduce it to "compose `SiteShell` + the imported footer data"; (c) add a TODO with a date or Astro version target ("Remove this wrapper once Astro/Vite resolves [link to issue], target 2026-Q3") so the workaround has an explicit retirement plan.

- **F-102 — `RolesGrid.tsx` resolves Lucide icon names via a four-branch `if`/`return`** (`src/components/RolesGrid.tsx:31-38`). The function works and the icon-name enum is type-narrow, so this is correct. Concern: maintainability — adding a fifth role (which the spec explicitly rejects today, but the architecture should be open to) means a code change in two places (the JSON schema enum AND this resolver), and a missing branch silently returns `null` (an icon-less RoleCard). Borderline NIT, raised to REQUEST_CHANGES because the silent-null path is a latent UI bug. **Suggested fix**: use an object-literal map (`const iconMap = { hammer: Hammer, workflow: Workflow, "graduation-cap": GraduationCap, clapperboard: Clapperboard } as const;`) and call `const Icon = iconMap[name]; return <Icon {...iconProps} />;`. Same behavior, exhaustiveness can be enforced by TS narrowing on `keyof typeof iconMap`, no silent-null path.

- **F-103 — `BaseLayout.astro` emits `<meta property="og:image" content="https://pouk.ai/og.png">` on every route, including the OG image URL hardcoded as an absolute path** (`src/layouts/BaseLayout.astro:43`). The image exists at the path; that's correct. The hard-coded constant means the OG image URL won't follow preview deploys (`pouk-ai-next-xyz.vercel.app/og.png` will not resolve to the OG image of a preview build, only of the canonical domain). Violates **R-037 (HARD)** softly — the eight required OG/Twitter tags emit correctly, but the image URL is brittle in non-canonical environments. Also: there's no `og:site_name` and no `twitter:image:alt`, both of which Lighthouse SEO and major share crawlers prefer. **Suggested fix**: (a) compute `ogImageUrl` from `Astro.site.origin + "/og.png"` so it follows the deploy host; (b) add `<meta property="og:site_name" content="pouk.ai">` and `<meta name="twitter:image:alt" content="...">`. Acceptable to defer (b) if the preview-host concern is the primary fix.

- **F-104 — `astro-compress` failed to compress one CSS file** (`dist/_astro/principles.CuXQUqwD.css` — build output line "Error: Cannot compress file …"). The build did not fail, but the CSS is shipped uncompressed. This is a non-fatal regression of the compression pipeline R-015 leans on. The error message in the build log is bare ("Error: Cannot compress file …") with no underlying cause exposed. Violates `meta/masterplan.md` section 4.2 ("`astro-compress` — gzip/brotli HTML+CSS at build") softly. **Suggested fix**: investigate the failure (likely an `astro-compress` version interaction with Astro 5.7's CSS bundling); either pin a known-good `astro-compress` version, replace with Vercel's edge gzip (which would compress on the wire even if `astro-compress` skips), or accept that Vercel will gzip the CSS at the edge and document this trade-off.

- **F-105 — Orphan JS bundle in `dist/_astro/client.Bl_bWdMq.js` (143 kB raw / 46 kB gzipped)** is emitted by Astro's React integration but is NOT referenced from any HTML in `dist/` — verified by `grep -l 'client.Bl_bWdMq' dist/**/*.html dist/*.html` returning zero matches. So no user actually downloads it, which means R-009/R-010 are not violated in practice. But the artifact ships to Vercel's CDN as dead weight and confuses anyone auditing the output. It's emitted because the React integration's `client:none` SSR path still produces a hydration entry for unused client islands. Doesn't violate any explicit requirement; mentioned because a future hydration directive added by mistake would suddenly start referencing this bundle without anyone noticing. **Suggested fix**: configure Astro's experimental `experimental.optimizeHoistedScript` or use the explicit `import.meta.env.VITE_…` build-emit gating to drop the client entry when no island is hydrated. Acceptable as a follow-up; not a launch blocker. (If the engineer prefers, document the orphan in a code comment near `astro.config.mjs` so it's not mistaken for a security/budget issue in future reviews.)

- **F-106 — `principles.json` doesn't go through a published content collection** (`src/pages/principles.astro:21`, `src/content.config.ts:27-30`). The engineer documented the reason in a comment in `content.config.ts`: principles is a single-object file, not an array, so the `file()` loader's "one entry per array item" assumption doesn't fit. The current workaround is a direct `import principlesData from "../content/principles.json";` — which works, but **bypasses Zod schema validation at build time**. Violates **R-074 (HARD)** ("Every file in `src/content/*.json` validates against a published Zod schema … The build fails if a content file fails its schema") and **R-075 (HARD)** ("Schema files in `src/content/_schemas/` export a named Zod schema and a TypeScript type derived from it"). The PM spec for `principles.json` (`meta/specs/content/principles.json.md`) presumably defines a schema; that schema is not being enforced. **Suggested fix**: (a) define a `PrinciplesFileSchema = z.object({ intro: z.string(), conclusion: z.string(), principles: z.array(z.object({ numeral, title, anchor, body })) })` in `src/content.config.ts` (or `src/content/_schemas/principles.ts`); (b) parse the import through it on first use in `principles.astro` (`const data = PrinciplesFileSchema.parse(principlesData)`), so a malformed JSON fails the build. The Astro `glob()` loader or a single-file content-collection wrapper would also work; either approach restores schema enforcement.

- **F-107 — `src/content.config.ts` is at `src/content.config.ts` and not under `src/content/_schemas/` as R-075 requires** (`src/content.config.ts:1`). R-075 is specific: "Schema files in `src/content/_schemas/` export a named Zod schema." Astro 5's convention is to place the content config at `src/content.config.ts`, which the engineer correctly followed — but R-075 was written before Astro 5's content-config convention was widely adopted, and this is a spec-vs-convention conflict that the masterplan needs to resolve. **Suggested fix**: surface this as a recommended revision to `meta/standards/technical-requirements.md` R-075 ("schemas may live in `src/content.config.ts` per Astro 5 convention OR in `src/content/_schemas/*.ts`; both are acceptable"). Until that revision lands, the current location is acceptable on grounds of "Astro convention wins where it's not load-bearing"; flagging so the standards doc catches up.

### NIT

- **F-201 — Footer JSX includes a `{"© "}` literal-string fragment** (`src/components/ShellWrapper.tsx:38`). Works fine but the `{"© "}…` pattern is unusual JSX — a copy-paste reader might wonder why `© ` isn't just inline text. The reason is that mixing inline whitespace and `{year}` would let React strip the leading space. Acceptable, but a `{`© ${year} pouk.ai · `}` template literal would read more naturally. Suggested fix: refactor to `<span>{`© ${year} pouk.ai · `}<a href="…">…</a></span>`.

- **F-202 — `BaseLayout.astro` Bugsink script uses `import("https://browser.sentry-cdn.com/...")`** (`src/layouts/BaseLayout.astro:85`). This contacts a third-party origin (`browser.sentry-cdn.com`) at runtime — the masterplan's stated preference (per `meta/standards/technical-requirements.md` R-061 and the `O-012` open question) is to self-host Bugsink. The script is currently env-var-gated and not emitted (Bugsink DSN unset), so this isn't running anywhere yet — but the moment the engineer flips the flag, the runtime contacts a non-`pouk.ai` origin. Violates **R-050 (HARD)** when the env var is set ("No new third-party origin is contacted at runtime without … rationale"). Currently a NIT because the code path is dead; promotes to BLOCK the moment the Bugsink env var goes live without first resolving O-012. **Suggested fix**: leave the env-var gating as-is (correct pattern), but replace the CDN import URL with a placeholder commented `// TODO: O-012 — replace browser.sentry-cdn.com URL with self-hosted Bugsink browser SDK URL before setting PUBLIC_BUGSINK_DSN in prod`.

- **F-203 — `dist/index.html` is NOT byte-identical to `public/index.html`** because `astro-compress` minified it during build. `public/index.html` is byte-identical to `git show HEAD:index.html` (verified `9316686e9d…` SHA-256 match) — that satisfies the plan's "byte-identical" clause at source. But the served file (`dist/index.html`) is 17.0 kB minified vs 20.0 kB unminified, and the masterplan's section 6.1 parity matrix says "Visual diff vs. current `pouk.ai` — `indistinguishable` on `/`." Minified markup should be visually indistinguishable (browsers don't render whitespace), so this is a NIT — but it's worth noting that the literal-bytes contract from Arian ("byte-identical to current") is preserved at *source* not at *serve*. **Suggested fix**: confirm with Arian whether "byte-identical" is a source-level invariant (preserved by `public/index.html` checksum match) or a serve-level invariant (would require excluding `index.html` from `astro-compress`'s processing). Acceptable to leave as-is if Arian agrees source-identity is the contract; flag if he wanted bit-identical serve. Optional code-side fix: `astro-compress({ HTML: { … exclude: ["index.html"] } })` to skip compressing the static holding page only.

- **F-204 — Inline `<style>` tags absent and CSS is loaded via one `<link href="/_astro/principles.CuXQUqwD.css">` on every page** (every `dist/*/index.html`). The CSS bundle name (`principles.CuXQUqwD.css`) is misleading — it's the same file referenced from all three pages and contains the merged styles. Astro's CSS bundling chose that filename based on the alphabetically first page that imports it. Not wrong; just a NIT for code-archaeology readability. Suggested fix: rename via Astro's `vite.build.rollupOptions.output.assetFileNames` to `"_astro/[name]-[hash][extname]"` and ensure the entry name is something neutral like `site` rather than picking the page name.

- **F-205 — `roles.astro` and `principles.astro` use Astro JSX inside `.map()` with no `key` prop on the wrapper `<div>`** (`src/pages/roles.astro:56-58`, `src/pages/principles.astro:60-66`). Astro tolerates missing keys at the template level (it's compiled, not React-runtime), so this doesn't warn or error. But if the same components were ever consumed under a React island, the missing key would emit a console warning. Suggested fix: add `key={role.id}` on the `roles` jump-nav `.map` wrapper and `key={p.anchor}` on the `principles` `.map` wrapper. (Not a hard requirement at Astro's template level.)

- **F-206 — `BaseLayout.astro` declares `currentRoute: string` as a required prop, but it would be more ergonomic to default to `Astro.url.pathname`** (`src/layouts/BaseLayout.astro:31`). Currently each page passes its own `currentRoute="/why-ai"` literal; one source of truth (the URL) would be safer. Pure NIT, won't change correctness.

### PRAISE

- **The Matomo / Bugsink env-var gating is exactly right.** `BaseLayout.astro` lines 60-89 build the script strings at the Astro frontmatter level and emit `<script is:inline>` tags only when the env vars are populated. When unset (today), the built HTML contains zero analytics or error-reporting `<script>` tags — verified directly. The pattern is also defensively shaped: the script strings are built as constants at the top of the frontmatter, so a future hand edit can't accidentally let an undefined value slip into a serialized script body. R-009 and R-078 are honored without making the gating cost the engineer's iteration speed.
- **Content-as-data discipline is clean.** `src/content/{roles,failure-modes}.json` are typed via `defineCollection` with Zod schemas at `src/content.config.ts`; pages iterate `getCollection(...)` results without ever inlining copy strings in JSX. The Zod schemas closely mirror the PM spec's "Field shape" sections. R-074, R-076 honored. (The `principles.json` exception is a separate finding — F-106 — but the discipline applied to the two collection-bound files is exemplary.)
- **The `RolesGrid` boundary call is right.** The engineer correctly placed Lucide-icon resolution in the site repo (not in `@poukai-inc/ui`), preserving the masterplan section 2A rule that the DS doesn't re-export Lucide. The pattern of "DS provides the `icon` slot; site decides which Lucide glyph" is exactly what the boundary doc anticipates, and it shows in clean code.
- **The footnote-superscript round-trip on `/why-ai` is meticulous.** Every `<sup class="footnote-ref"><a href="#ref-N" id="cite-N">N</a></sup>` in the body pairs with a `<li id="ref-N">…<a href="#cite-N" aria-label="Back to citation N">↩</a></li>` in the References section. ARIA labels included. Spec D-01 calls for "complete round-trip"; the engineer delivered it. (And reusing CSS-only `position: sticky` for the TOC instead of reaching for a scroll-spy island is the exactly-right reading of D-02.)

## Open questions

- **`@poukai-inc/ui@0.2.0` not yet published to GitHub Packages.** Out-of-tree dependency on Claude Design's lane to publish; not a failure of this PR. Vercel deploy will fail until publication regardless of the F-001 / F-002 fixes — but those fixes are this PR's responsibility, and the publish is not. Flagged here so the orchestrator can coordinate.
- **DS `build:tokens` script copies `tokens.css` to the wrong path** (`dist/src/tokens/tokens.css` instead of `dist/tokens.css`). Out-of-tree dependency on the DS repo. The site's `import "@poukai-inc/ui/tokens.css"` will resolve based on the DS's `package.json` `exports` field; if that exports field points at the wrong subpath, the import will 404 at runtime on Vercel even after F-001 / F-002 are fixed. Not a finding for this PR; flagged so the DS repo gets the one-line fix before the first preview deploy is attempted.
- **F-203 (source-vs-serve byte-identity)**: Arian — did you intend "byte-identical" as a source-level invariant (preserved) or a serve-level invariant (would require excluding `index.html` from `astro-compress`)? My read of the masterplan section 6.1 "indistinguishable on `/`" parity check is that source-level identity satisfies it because the browser renders the minified and un-minified HTML identically. But the engineer should confirm before this PR merges so future reviews don't reopen it.
- **F-107 (R-075 wording vs. Astro 5 convention)**: should `meta/standards/technical-requirements.md` R-075 be revised to permit `src/content.config.ts` as a schema location? The reviewer's read is yes — Astro 5's convention is well-established and the spec wording predates it. PM should revise R-075 (lane: reviewer, since technical-requirements.md is the reviewer's owned standard) once Arian assents.

## Recommendation

**REQUEST_CHANGES.** The work is structurally correct, the brand is honored, and zero client JS ships on any route — the engineer cleared every conceptual bar that matters. What's holding it back is the dual-consumption mechanic (`workspace:*` instead of semver in F-001, and the orphaned site-side lockfile in F-002) which would make the first Vercel deploy fail, plus two HARD a11y/SEO regressions (heading-order skip in F-003 and the robots.txt / sitemap path mismatch in F-004) that axe-core and Lighthouse will flag the moment CI is wired. All four BLOCK items are mechanical fixes — the engineer can address them in under an hour. The seven REQUEST_CHANGES findings are quality-of-execution polish that should land before round 2 starts, but none of them invalidate the round 1 architecture. Arian: my recommendation is to ask the engineer to fix F-001 through F-004 first, then sweep the REQUEST_CHANGES findings into the same revision; the resulting commit graph stays clean and the next round's CI wire-up has a solid foundation to land on.
