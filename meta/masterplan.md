# pouk.ai -> `@poukai/ui` -- migration plan

**Status** Draft v1 - 2026-05-12
**Author** Design-system pass, for review
**Decision deadline** Before any code lands in `Pouk-AI-INC/pouk.ai`

---

## 0. TL;DR

We're going to do **three things, in order**, and not skip step 1:

1. **Reshape `@poukai/ui` under an atomic-design taxonomy** and ship six new pieces (`Stat`, `Hero`, `RoleCard`, `Principle`, `FailureMode`, `SiteShell`). Cut **`@poukai/ui@0.1.0`** and publish to GitHub Packages.
2. **Rebuild `Pouk-AI-INC/pouk.ai` as an Astro site** that consumes `@poukai/ui` -- static-rendered React from the package, no client JS on the holding page, islands only where they earn it.
3. **Wire the dev loop both ways** -- pnpm workspace link for day-to-day iteration, the published GitHub Packages version for CI/Vercel -- so the system is realistic in prod and frictionless in dev.

No code in this document. Mechanics, taxonomy, file layout, and risks only. Code starts the moment this plan is signed off.

---

## 1. Constraints we're designing inside

Pulled directly from your answers; restated so they can't drift:

|                   |                                                                                                                                                                                                                         |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Stack**         | Astro for the site shell. React islands for anything stateful. `@astrojs/react` renders package components to static HTML at build time.                                                                                |
| **Repo layout**   | Site stays at `Pouk-AI-INC/pouk.ai`. Design system stays at `Pouk-AI-INC/poukai-ds` (this repo). They are **separate repos**; the site never imports source from the DS -- only the published package.                  |
| **Dep mode**      | Dual. `pnpm` workspace link locally (`@poukai/ui` resolves to the in-repo build); CI installs the versioned package from `npm.pkg.github.com`.                                                                          |
| **Scope**         | All four surfaces -- `/`, `/why-ai`, `/roles`, `/principles`.                                                                                                                                                           |
| **Deploy**        | Vercel.                                                                                                                                                                                                                 |
| **Quality bar**   | Lighthouse 100 across Performance, Accessibility, Best-practices, SEO -- on every page, on mobile.                                                                                                                      |
| **Atomic Design** | Tokens, atoms, molecules, organisms live in the DS. Templates and pages live in the client repo (pouk.ai). The DS must be reusable by other Pouk AI INC services -- so nothing in it is allowed to know about the site. |

The Lighthouse 100 + Astro choice has one immediate implication: **the holding page must ship zero client JS by default**, including the package. React is a build-time concern only on `/`.

---

## 2. Atomic-design taxonomy -- where each piece lives

The DS already implicitly uses an atomic split. Making it explicit so future contributors (and other internal clients) don't have to guess.

```
@poukai/ui                                Pouk-AI-INC/pouk.ai
-------------                             --------------------
tokens/   <- single source of truth        templates/  <- page layouts
atoms/    <- Wordmark, StatusBadge,        pages/      <- /, /why-ai,
            Button, Stat (new)                          /roles,
molecules/<- Hero, RoleCard,                              /principles
            Principle, FailureMode (new)  content/    <- MDX long-form
organisms/<- SiteShell (new)               public/     <- og.png, robots
```

**Rule of thumb for new contributions**

- **Atom** -- one job, no children of its own (`Stat` = numeral + caption).
- **Molecule** -- combines atoms into a self-contained unit of meaning (`RoleCard` = icon + eyebrow + h + body + hired-by).
- **Organism** -- combines molecules with layout intent and may know about the page chrome (`SiteShell` = top nav + slot + footer).
- **Template / Page** -- never in `@poukai/ui`. Lives in the consumer repo.

This is the only piece of structure the consuming repos need to memorise.

---

## 2A. Repo responsibilities -- who owns what

The DS package and the site repo answer different questions. Mixing them is the failure mode that ate the most time in your last migration; pinning it down before code lands.

### What `@poukai/ui` owns (this repo)

- Design tokens -- color, type, spacing, motion, radii -- the brand contract.
- Self-hosted webfonts (`.woff2` files in `tokens/fonts/`).
- Brand-mark geometry -- `Wordmark` lockup, isotype, banner.
- All atoms / molecules / organisms -- visual structure, props API, scoped CSS modules.
- Ladle stories -- the showroom for components in isolation.
- Playwright CT tests, axe a11y gates, size-limit budgets.
- Versioning, `CHANGELOG.md`, GitHub Packages publish.
- Public `README` explaining how to consume.

### What `Pouk-AI-INC/pouk.ai` owns (the site repo)

- Astro config, Vercel deploy, lighthouse-ci, sitemap.
- Routes, page templates, navigation contents (what's in the menu).
- Long-form copy (in `content/*.json` or MDX).
- All site-specific imagery -- illustrations (current direction), customer-story photography (future), favicons, `og.png`.
- The four `/roles` icons -- imported directly from `lucide-react` and composed in the page; the DS doesn't re-export Lucide.
- SEO -- meta tags, JSON-LD, `robots.txt`.
- Analytics, forms, anything stateful.

### The shape / substance rule

When a question is ambiguous, ask: is it shape or substance?

- **Shape** lives in the DS -- where the title sits, how the lede wraps, the rhythm between status and CTA, the card recipe.
- **Substance** lives in the site -- what the title says, what the lede says, what the CTA links to, which Lucide glyph stands in for "Builder".

`<Hero>` encodes the shape; `<Hero title={...} lede={...} />` accepts the substance.

### Decision authority

| Decision                                                                 | Owner                                              |
| ------------------------------------------------------------------------ | -------------------------------------------------- |
| Add / remove a brand color or token                                      | DS                                                 |
| Change a component's public API                                          | DS (with a changeset; site picks up after release) |
| Add / remove a route                                                     | site                                               |
| Change copy on any page                                                  | site                                               |
| Pick an illustration style                                               | site (escalate to DS only if it implies a token)   |
| Pick which Lucide glyph maps to Builder / Automator / Educator / Creator | site                                               |
| Modify the hero's vertical rhythm                                        | DS (encoded inside `<Hero>`)                       |
| Modify the hero's tagline copy                                           | site (pass through props)                          |

### Boundary cases -- decided

| Case                                | Lives in      | Why                                                    |
| ----------------------------------- | ------------- | ------------------------------------------------------ |
| Wordmark, isotype, banner           | DS            | Brand mark -- shared across every Pouk AI INC service. |
| `og.png`                            | site          | Marketing artwork, not a brand primitive.              |
| Favicon variations                  | site          | Sized site-specific outputs of the isotype.            |
| Lucide icons                        | site          | DS lists Lucide as a peer dep; never re-exports.       |
| Illustrations                       | site          | Per-page marketing material at the SaaS stage.         |
| Customer-story photography (future) | site          | Per-page content.                                      |
| Branded glyph Lucide can't cover    | DS (new atom) | If it's reused twice it's a primitive.                 |

### Action-point split for this migration

Every item in sections 3-6 belongs to exactly one repo. Restated as a worklist:

| Work item                                                       | Repo | Phase      |
| --------------------------------------------------------------- | ---- | ---------- |
| Restructure `src/` into atoms/molecules/organisms               | DS   | 1.1 (done) |
| `Stat` atom + stories + tests                                   | DS   | 1.2        |
| `Hero`, `RoleCard`, `Principle` molecules                       | DS   | 1.2        |
| `FailureMode` molecule                                          | DS   | 1.3        |
| `SiteShell` organism                                            | DS   | 1.3        |
| Cut `0.1.0` and publish to GitHub Packages                      | DS   | 1.3        |
| Astro project scaffold                                          | site | 2          |
| `.npmrc` + workspace-sibling setup + `CONTRIBUTING.md`          | site | 2          |
| Vercel project + `NPM_TOKEN` secret                             | site | 2          |
| `BaseLayout.astro` (`<head>`, JSON-LD, font preload)            | site | 2          |
| Four page templates (`index`, `why-ai`, `roles`, `principles`)  | site | 2          |
| `content/roles.json` + `principles.json` + `failure-modes.json` | site | 2          |
| `og.png`, favicons, illustrations                               | site | 2          |
| Lucide icon picks for `/roles`                                  | site | 2          |
| Lighthouse-ci config + thresholds                               | site | 2          |
| Cutover + domain alias swap                                     | site | 4          |

No line item appears in both columns. If something feels like it should, the boundary rule above is wrong and we need to fix it before writing the code.

---

## 3. Phase 1 -- Reshape `@poukai/ui` (DS repo)

### 3.1 Restructure `src/`

```
src/
|-- tokens/                <- unchanged
|   |-- tokens.css
|   `-- fonts/*.woff2
|-- atoms/
|   |-- Wordmark/          <- moved from components/
|   |-- StatusBadge/       <- moved from components/
|   |-- Button/            <- moved from components/
|   `-- Stat/              <- NEW
|-- molecules/
|   |-- Hero/              <- NEW
|   |-- RoleCard/          <- NEW
|   |-- Principle/         <- NEW
|   `-- FailureMode/       <- NEW
|-- organisms/
|   `-- SiteShell/         <- NEW
|-- icons/                 <- Lucide re-exports, curated
`-- index.ts               <- named exports, grouped by layer
```

The `components/` folder goes away. Imports stay flat at the package level (`import { Hero } from "@poukai/ui"`) -- the on-disk taxonomy is for contributors, not consumers.

**Subpath exports** (optional, recommended):

| Subpath                 | Resolves to          |
| ----------------------- | -------------------- |
| `@poukai/ui`            | everything (current) |
| `@poukai/ui/atoms`      | atoms only           |
| `@poukai/ui/tokens.css` | unchanged            |
| `@poukai/ui/fonts/*`    | unchanged            |

This lets other Pouk AI INC services that only need atoms tree-shake cleanly.

### 3.2 The six new components

Each follows the existing four-file recipe (`*.tsx`, `*.module.css`, `*.stories.tsx`, `*.test.tsx`) and the existing conventions (`forwardRef`, `...rest` spread, tokens only).

| Component         | Layer    | Props sketch                                                                               | Notes                                                                                                                                               |
| ----------------- | -------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Stat`**        | atom     | `value: string - caption: string - source?: string - align?: "start" \| "end"`             | The "85% / $300B" treatment. Pure typography -- no chart, no animation.                                                                             |
| **`Hero`**        | molecule | `title: ReactNode - lede: ReactNode - status?: ReactNode - cta?: ReactNode`                | Wraps `<h1>`, `.lede`, slot for `StatusBadge`, slot for `<a>`. Owns the hand-tuned vertical rhythm from the holding page.                           |
| **`RoleCard`**    | molecule | `eyebrow: string - title: string - body: ReactNode - hiredBy: ReactNode - icon: ReactNode` | Card recipe = `--surface` + hairline + `--radius-3`. Icon is **slot-in**, not hard-coded -- keeps `lucide-react` a peer dep choice.                 |
| **`Principle`**   | molecule | `numeral: string - title: string - children: ReactNode`                                    | Margin numeral in lowercase Roman (`i.`, `ii.`, ...). Editorial layout.                                                                             |
| **`FailureMode`** | molecule | `index: number - title: string - children: ReactNode`                                      | Numbered failure-mode block for `/why-ai`.                                                                                                          |
| **`SiteShell`**   | organism | `currentRoute?: string - routes?: Route[] - footer?: ReactNode - children: ReactNode`      | Renders `Wordmark` (linked to `/`), nav, slot, hairline footer. **No router awareness** -- emits plain `<a>`; the consumer (Astro) handles routing. |

**On `SiteShell` being in the DS at all** -- it does sit on the edge of the atomic split. We're keeping it in the package because (a) every Pouk AI INC surface will need the same chrome, (b) keeping it out forces every consumer to re-implement the nav/footer pairing, and (c) its surface is small (logo + label list + footer slot). The moment a second service needs a _different_ shell, we split into `SiteShell` and `MinimalShell`.

### 3.3 Versioning and release

- Bump `package.json` to **`0.1.0`** (first minor with new APIs).
- New `CHANGELOG.md` entry via `changesets`.
- Publish to GitHub Packages on tag push, gated by green Playwright + size-limit + a11y CI.
- `size-limit` budgets:

  | Bundle                              | Target              |
  | ----------------------------------- | ------------------- |
  | ESM full                            | <= 18 kB            |
  | ESM tree-shaken `Wordmark + Button` | <= 3 kB (unchanged) |
  | `tokens.css`                        | <= 4 kB             |

- Tag SemVer: a breaking move of `Wordmark` from `components/` to `atoms/` is **not breaking** because the public import path doesn't change.

### 3.4 What does _not_ change in Phase 1

- `tokens.css` semantics. The site consumes the existing tokens verbatim. Any token additions (e.g. a numeric scale for `Stat`) get added, not replaced.
- The Wordmark / StatusBadge / Button public APIs.
- Self-hosted font policy.

---

## 4. Phase 2 -- Stand up the Astro site (pouk.ai repo)

### 4.1 Repo layout

```
Pouk-AI-INC/pouk.ai
|-- .github/workflows/        ci.yml, deploy is Vercel-native
|-- .npmrc                    <- @poukai:registry=https://npm.pkg.github.com
|-- astro.config.mjs
|-- package.json
|-- public/
|   |-- og.png                <- still on the open-Qs list
|   |-- favicon.svg
|   `-- robots.txt
|-- src/
|   |-- layouts/
|   |   `-- BaseLayout.astro  <- <html>, <head>, meta, JSON-LD, tokens import
|   |-- pages/
|   |   |-- index.astro
|   |   |-- why-ai.astro
|   |   |-- roles.astro
|   |   `-- principles.astro
|   |-- content/
|   |   |-- roles.json        <- 4 roles, sourced from meta/backlog.md
|   |   |-- principles.json   <- 10 principles
|   |   `-- failure-modes.json<- 5 failure modes
|   `-- styles/
|       `-- site.css          <- page-level overrides only; tokens come from package
`-- tsconfig.json
```

### 4.2 Astro integrations

- `@astrojs/react` -- render `@poukai/ui` components.
- `@astrojs/sitemap` -- Lighthouse SEO 100.
- `@astrojs/check` -- typecheck on build.
- `astro-compress` -- gzip/brotli HTML+CSS at build.

### 4.3 The zero-JS contract

For each page, components render through Astro's server-renderer (`<Hero client:none />` is the default -- no hydration directive). The shipped HTML contains the rendered DOM and the imported CSS. No React runtime is sent to the browser.

`StatusBadge`'s pulse is CSS keyframes, not state -- already JS-free. If a future component genuinely needs interactivity (e.g. a `<Dialog>`), it gets `client:visible` and we pay the hydration cost only on that island.

### 4.4 Long-form content as data

Three pages (`/why-ai`, `/roles`, `/principles`) are content-heavy. The copy from `meta/backlog.md` moves into typed JSON in `src/content/`. The page templates iterate those arrays and render `RoleCard` / `Principle` / `FailureMode`. This:

- keeps copy edits out of JSX,
- lets us add a `content/` Astro collection later for MDX,
- makes the site's shape obvious from one folder.

---

## 5. Phase 3 -- Dual consumption (workspace + GitHub Packages)

### 5.1 The two repos, two install modes

| Mode                         | Where                                                                                                                  | What `@poukai/ui` resolves to                                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Dev (local)**              | Designer/dev has both repos cloned into a parent folder and uses a `pnpm-workspace.yaml` at the parent that lists both | The freshly built `dist/` of the DS -- live, watchable via `pnpm dev` in the DS repo.                   |
| **CI (Vercel + GH Actions)** | Only `pouk.ai` is checked out                                                                                          | The versioned `@poukai/ui@0.1.x` pulled from `npm.pkg.github.com` using a read-only `NPM_TOKEN` secret. |

The trick is one file, **`.npmrc`** in `pouk.ai`:

```
@poukai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

-- and an optional **`pnpm-workspace.yaml`** _in your home directory or a sibling parent folder_ (NOT committed to `pouk.ai`) listing both repo paths. pnpm then prefers the workspace package; CI doesn't see that file, so it goes to the registry. Same `package.json` works in both modes.

### 5.2 Vercel project setup

| Setting          | Value                                         |
| ---------------- | --------------------------------------------- |
| Framework preset | Astro                                         |
| Build command    | `pnpm build`                                  |
| Output dir       | `dist`                                        |
| Install command  | `pnpm install --frozen-lockfile`              |
| Env vars         | `NPM_TOKEN` (GitHub PAT with `read:packages`) |
| Node             | 20 LTS                                        |

### 5.3 The release flow

```
DS repo                         pouk.ai repo
---------                       ------------
edit Stat.tsx
pnpm changeset
git push                        # CI opens version PR
merge version PR                # CI publishes 0.1.1
                                pnpm up @poukai/ui
                                git push           # Vercel deploys
```

Versioned deploys; reproducible builds; no source-level coupling.

---

## 6. Phase 4 -- Cutover

### 6.1 Page-by-page parity matrix

Before any DNS / Vercel domain swap, every page in the new build has to pass:

| Check                             | Tool                   | Pass bar                   |
| --------------------------------- | ---------------------- | -------------------------- |
| Visual diff vs. current `pouk.ai` | screenshot, manual     | "indistinguishable" on `/` |
| Lighthouse mobile                 | `lighthouse-ci` in CI  | 100 / 100 / 100 / 100      |
| Axe a11y                          | `@axe-core/playwright` | 0 violations               |
| JSON-LD                           | manual JSON validate   | identical to current page  |
| HTML weight (`/`)                 | `wc -c` on built file  | <= current page +10%       |
| `prefers-reduced-motion`          | manual                 | all animation off          |

### 6.2 Switch order

1. Deploy the new build to a Vercel preview URL (`pouk-ai-next.vercel.app`).
2. Run the parity matrix above; fix until green.
3. Swap the `pouk.ai` domain alias from the old project to the new project in Vercel.
4. Archive the old static `index.html` to a `legacy/` branch -- don't delete; we may want to diff later.

No DNS changes. No downtime.

---

## 7. Open questions parked from your note

These don't block the plan but should be resolved before launch:

1. **`og.png`** -- still on the backlog. Until we have it, ship `banner.png` as the OG image. (Lighthouse SEO 100 needs _an_ OG image.)
2. **Icon library** -- **decided:** Lucide is the icon system. The DS lists `lucide-react` as a peer dep; the site imports directly. Branded glyphs or anything Lucide can't cover get hand-built into a DS atom on demand. `RoleCard.icon` stays a slot so each consumer picks its own.
3. **Imagery** -- **decided:** illustrations are the visual direction for the SaaS stage. They live in the site repo (per-page marketing material, not brand primitives). Real photography lands later, only via a Customer Story page (founder-approved per case). `Hero` still exposes no image slot -- imagery sits in page templates around the hero, not inside it.
4. **Other internal clients** -- once the DS pattern proves out here, the obvious next consumer is whatever ships under `Pouk-AI-INC/*-app`. The taxonomy in section 2 is set up so that's a config change in the new repo's `.npmrc`, not a DS rewrite.

---

## 8. Risks

| Risk                                                                     | Likelihood  | Mitigation                                                                                                                  |
| ------------------------------------------------------------------------ | ----------- | --------------------------------------------------------------------------------------------------------------------------- |
| Lighthouse 100 on Performance is fragile with custom fonts               | medium      | `font-display: swap` already in tokens; preload Geist Regular + Instrument Serif Regular in `BaseLayout`; subset to Latin.  |
| GitHub Packages auth in Vercel needs a PAT that someone has to rotate    | low         | Document the rotation in the new repo's `README` and set a calendar reminder. Long-term, replace with a fine-grained token. |
| Atomic-design buckets get argued                                         | low         | The rule in section 2 is the rule. If a contributor disagrees, file an issue in the DS repo; don't move things ad-hoc.      |
| Two-repo dev loop confuses contributors                                  | medium      | Add a one-page `CONTRIBUTING.md` in `pouk.ai` describing the workspace-sibling setup with copy-paste commands.              |
| Pixel drift between the React `Hero` and the current static `index.html` | medium-high | Phase 4 section 6.1 -- visual diff is a hard gate, not a courtesy check.                                                    |

---

## 9. What I need from you to start cutting code

1. **Green light on section 2** (taxonomy) -- that's the change that touches the most files.
2. **Confirm** that `SiteShell` belongs in the DS rather than the site repo. I've defaulted to "yes" but it's the call most likely to flip.
3. **Confirm** GitHub Packages is the registry (vs. private npm). Affects the `.npmrc` and the PAT story.
4. **Anyone else** committing to either repo during the window? Phase 1 will touch every `src/components/*` import path.

Once those four are settled, I'd suggest sequencing:

1. DS atomic restructure (no new components yet) -> release `0.1.0-alpha.0`.
2. Three molecules (`Hero`, `RoleCard`, `Principle`) + `Stat` atom -> `0.1.0-alpha.1`.
3. `FailureMode` + `SiteShell` -> `0.1.0`.
4. Astro scaffold + holding page only, consume `0.1.0` -> preview deploy.
5. Three long-form pages -> cutover.

Five tagged releases. ~Five PR-sized chunks.

---

## 10. Sign-off

|                             |                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Date**                    | 2026-05-12                                                                                               |
| **Mode**                    | Defaults (no answers within the sign-off window)                                                         |
| **Section 2 taxonomy**      | Approved as drafted                                                                                      |
| **SiteShell placement**     | Stays in `@poukai/ui` as an organism                                                                     |
| **Registry**                | GitHub Packages (`npm.pkg.github.com`)                                                                   |
| **Concurrent contributors** | Assumed none                                                                                             |
| **Release sequence**        | Five tagged releases as listed in section 9                                                              |
| **First PR**                | Phase 1.1 -- restructure `src/` into `atoms/molecules/organisms`, no new components, cut `0.1.0-alpha.0` |

### What landed in this PR (Phase 1.1)

- `src/components/Wordmark` -> `src/atoms/Wordmark`
- `src/components/StatusBadge` -> `src/atoms/StatusBadge`
- `src/components/Button` -> `src/atoms/Button`
- `src/components/` directory removed; reserved empty layers `src/molecules/` and `src/organisms/` documented in `src/index.ts` and `README.md`.
- `tsconfig.json` path aliases: `@components/*` -> `@atoms/*` + `@molecules/*` + `@organisms/*`.
- `playwright-ct.config.ts` aliases updated to match.
- `README.md` "Add a component" section rewritten around the atomic taxonomy.
- `package.json` version bumped `0.0.1` -> `0.1.0-alpha.0`.
- Changeset added (`atomic-restructure.md`) -- minor bump, no public API change.

Public import paths (`import { Wordmark } from "@poukai/ui"`) are unchanged. This is a contributor-facing reshape only.

### Next PR

Phase 1.2 from section 9 -- add `Stat` atom and `Hero` molecule, cut `0.1.0-alpha.1`.
