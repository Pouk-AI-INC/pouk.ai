# Plan: Astro round 1 — foundation + three new pages

**Status**: Approved (by Arian, 2026-05-13)
**Owner**: Arian · Author: orchestrator
**Executor**: `pouk-ai-engineer`
**Branch**: `claude/awesome-blackburn-71faf0` (push to `main` per established pattern)

---

## Scope

Stand up Astro alongside the existing static `index.html`. Astro serves three new routes (`/why-ai`, `/roles`, `/principles`) consuming `@poukai/ui@0.2.0` design-system components. `/` is left untouched as static `index.html`. Asset migration from the DS repo's `brand/` folder lands in `public/`.

**Not in scope (deferred)**:
- Porting `/` to Astro — handled in a future round, untouched per founder ("any changes to the current holding landing page is cosmetic and temporary")
- CI gates (Lighthouse-CI, axe-core, content-schema validation) — wired in round 2
- Final favicon swap on the static `index.html` — separate cosmetic patch when convenient

---

## Stack

- **Astro** 5.x latest stable
- **TypeScript** strict
- **pnpm** + Node 20 LTS
- **`@astrojs/react`** for SSR of `@poukai/ui` components
- **`@poukai/ui@0.2.0`** — atoms (`Wordmark`, `StatusBadge`, `Button`, `Stat`), molecules (`Hero`, `RoleCard`, `Principle`, `FailureMode`), organism (`SiteShell`)
- **`@astrojs/sitemap`** — auto-generate sitemap including the static `/` via the integration's `customPages` option
- **`astro-compress`** — gzip/brotli HTML+CSS at build (per masterplan section 4.2)
- **`zod`** — content-collection schema validation (Astro 5 native)

---

## File layout (per masterplan section 4.1)

```
.
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── .npmrc                          <- @poukai:registry=https://npm.pkg.github.com
├── vercel.json                     <- security headers + buildCommand/outputDirectory
├── robots.txt                      <- kept at root (Astro public/ would also work, this is fine)
├── public/
│   ├── index.html                  <- the holding page, moved verbatim from repo root
│   ├── og.png                      <- migrated from poukai-ui/src/brand/og.png
│   ├── apple-touch-icon.png        <- migrated
│   ├── favicon-16x16.png           <- migrated
│   ├── favicon-32x32.png           <- migrated
│   ├── android-chrome-192x192.png  <- migrated
│   └── android-chrome-512x512.png  <- migrated
├── src/
│   ├── content.config.ts           <- Zod-validated Astro content collections
│   ├── content/
│   │   ├── roles.json
│   │   ├── principles.json
│   │   └── failure-modes.json
│   ├── layouts/
│   │   └── BaseLayout.astro        <- <html>, <head>, JSON-LD, font preload, Matomo, Bugsink, SiteShell wrapper
│   ├── pages/
│   │   ├── why-ai.astro
│   │   ├── roles.astro
│   │   └── principles.astro
│   └── styles/
│       └── site.css                <- per-route overrides; tokens come from @poukai/ui/tokens.css
└── sitemap.xml                     <- DELETED; @astrojs/sitemap regenerates
```

`/index.html` at repo root is **moved** to `public/index.html` so Astro emits it verbatim in `dist/`. There is no `src/pages/index.astro` in this round.

---

## Routing behavior

- **`/`** → `public/index.html` (static, byte-identical to current holding page)
- **`/why-ai/`** → Astro-rendered, uses `BaseLayout` + `SiteShell` + page-specific components
- **`/roles/`** → Astro-rendered
- **`/principles/`** → Astro-rendered

Astro `build.format: 'directory'` (default) produces clean URLs without `.html` extensions.

---

## Content collections

Three JSON files in `src/content/`, validated by Zod schemas defined in `src/content.config.ts`:

- `roles.json` — four role entries (Builder, Automator, Educator, Creator). Schema per `meta/specs/content/roles.json.md`. Icon field enumerated as `hammer | workflow | graduation-cap | clapperboard` per D-06.
- `principles.json` — top-level `intro`, `conclusion`, plus `principles[]` array (ten entries with `numeral`, `title`, `body`). Schema per `meta/specs/content/principles.json.md`.
- `failure-modes.json` — five entries with `index`, `title`, `body`, and a typed `stats[]` array. Per D-05, the 500% (failure 2) and 61% (failure 5) figures are extracted from prose into the `stats` array.

Source copy: `meta/backlog.md` "Beyond the holding page" sections contain the founder-approved verbatim text. The engineer reads those and structures into the JSON files.

---

## Honors

- **Technical Requirements** at `meta/standards/technical-requirements.md`. Headline gates: R-013 (Perf ≥ 95, A11y/BP/SEO = 100, HARD), R-014 (Core Web Vitals HARD), R-009/R-010 (client-JS budget ≤ 75 KB gzipped), R-021–R-031 (accessibility specifics), R-032–R-038 (SEO specifics).
- **PM specs** at `meta/specs/pages/{why-ai,roles,principles}.md` — section 4 (IA), section 5 (content requirements), section 8 (acceptance criteria).
- **Flow spec** at `meta/specs/flows/visitor-to-conversation.md` — nav order: Why AI · Roles · Principles. `SiteShell`'s nav prop drives this.
- **Decisions** at `meta/decisions/2026-05-13-launch-readiness-closed.md` — full propagation list.

---

## Matomo + Bugsink

Env-var-gated; render scripts conditionally in `BaseLayout`:

```
PUBLIC_MATOMO_URL=
PUBLIC_MATOMO_SITE_ID=
PUBLIC_BUGSINK_DSN=
```

When unset (today), no tracker tags emit. Zero-JS posture on every route preserved until endpoints are wired. Add a `TODO: provide endpoints (O-011/O-012)` comment near each script tag.

---

## Vercel

- `vercel.json` keeps current security headers; add `buildCommand`, `outputDirectory: "dist"`, `installCommand: "pnpm install --frozen-lockfile"`.
- `NPM_TOKEN` (GitHub PAT with `read:packages`) needed in Vercel project secrets for the `@poukai/ui` install. **Manual step Arian executes** after this round lands.

---

## Acceptance criteria

- [ ] `pnpm install` succeeds with `@poukai/ui@0.2.0` resolved (locally via workspace link; CI/Vercel via GitHub Packages once `NPM_TOKEN` is set).
- [ ] `pnpm build` produces `dist/` with `index.html`, `why-ai/index.html`, `roles/index.html`, `principles/index.html`, `sitemap-*.xml`, all migrated assets, and security-header-compatible static layout.
- [ ] `astro check` passes cleanly.
- [ ] All three new pages render the DS components correctly with no runtime errors in SSR.
- [ ] Content collections validate; intentionally-malformed JSON fails the build.
- [ ] Holding page `/` is byte-identical to the previous `index.html`.
- [ ] Sitemap includes all four URLs (`/`, `/why-ai/`, `/roles/`, `/principles/`).
- [ ] Brand assets exist in `public/` and resolve from both the static `index.html` and the Astro pages.
- [ ] No client JS emitted from `BaseLayout` when Matomo/Bugsink env vars are unset.
- [ ] `index.html` removed from repo root (its destination is `public/index.html`).
- [ ] All `meta/specs/pages/*.md` section 8 acceptance criteria that don't require external assets or live endpoints are met.

---

## Risks

| Risk | Mitigation |
|---|---|
| `@poukai/ui@0.2.0` not published to GitHub Packages yet | Local workspace link covers dev; Vercel deploy will fail until publication. Surface in turn-end report; do not block the round. |
| `tokens.css` import path or font-asset URLs differ from masterplan section 3.2 expectations | Engineer reads `poukai-ui/package.json` `exports` field and uses exact subpaths. |
| Visual parity between static `/` and Astro pages diverges (different chrome) | Acknowledged trade-off of this scope choice — `SiteShell` only wraps the three new pages; `/` stays original. |
| Bundle weight blows past R-010 75 KB ceiling | Bugsink + Matomo not wired (env vars unset) → 0 KB third-party JS on launch. Risk only materializes when endpoints land. |
| Content-collection schemas drift from `meta/specs/content/*.md` | Engineer reads the spec, writes the Zod schema directly from the spec's "Field shape" sections. |

---

## Out of scope

- CI configuration (Lighthouse-CI, axe-core, content-schema runner in GitHub Actions). Wire in round 2.
- Porting `/` to Astro. Future round.
- Real Matomo / Bugsink endpoints. Comes after O-011/O-012 deployment-shape decisions.
- Final favicon swap on the static holding page. Cosmetic patch when convenient.
- Customer Story page (`/case-studies` and similar) — pre-mature per masterplan section 7.3.
