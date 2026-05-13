# Technical Requirements — pouk.ai marketing site

**Status**: Draft
**Last updated**: 2026-05-13
**Author**: pouk-ai-reviewer
**Decision authority**: Arian (founder)
**Supersedes**: nothing yet — first engineering standard for the repo.

---

## 1. Purpose

This document is the catalog of testable, non-functional requirements that every change to `Pouk-AI-INC/pouk.ai` must satisfy before merge. It promotes the standards embedded in `meta/masterplan.md` and `meta/architecture.md` prose into first-class, numbered requirements that reviews can cite (e.g. "violates R-014").

The masterplan remains the strategic narrative — the *why*. This document is the operational checklist — the *what must be true*. Where the two overlap, the masterplan wins on intent and this document wins on test specificity. Where this document references a masterplan section, that section stays authoritative for the underlying decision.

This is a Draft. Several calls below are reviewer defaults pending Arian's sign-off; those are listed explicitly in section 6 (Open questions). Treat anything in section 6 as provisional even if it appears as a numbered requirement.

---

## 2. Scope

**In scope**: the `Pouk-AI-INC/pouk.ai` repo only — the Astro site that will replace the current single-file `index.html`. Covers the four canonical routes (`/`, `/why-ai`, `/roles`, `/principles`), `BaseLayout.astro`, content JSON files, build pipeline, Vercel deploy, and the `.npmrc` / GitHub Packages consumption of `@poukai/ui`.

**Out of scope**: the `@poukai/ui` package itself (lives in `Pouk-AI-INC/poukai-ds`, has its own quality bars in masterplan section 3.3 and its own `size-limit` budgets). Brand-source assets in `/brand/`. The `meta/` project-memory tree. Future product surfaces (`*-app` repos).

**Audience**: `pouk-ai-engineer` (must satisfy these to ship), `pouk-ai-reviewer` (cites these in review findings), `pouk-ai-pm` (writes specs that respect these as the baseline), Arian (decides when a requirement should change).

---

## 3. Requirements

Every requirement follows the form:

> `**R-NNN (HARD|SOFT)** — <statement>. Verification: <how>. Source: <upstream authority>.`

HARD = merge blocker. The reviewer must recommend BLOCK if a HARD requirement is unmet.
SOFT = should be true, exceptions allowed with documented rationale in the PR description. The reviewer raises as REQUEST_CHANGES, not BLOCK.

Requirements are numbered consecutively across all sub-topics so a future review can cite `R-042` unambiguously. Once a requirement is published it does not get renumbered; if retired it stays in the list marked `(retired)`.

---

### 3.1 Stack & build constraints

**R-001 (HARD)** — The site is built with Astro. No other site-generator framework (Next.js, Remix, SvelteKit, Hugo, etc.) is permitted in this repo. Verification: `astro.config.mjs` exists at repo root; `astro` is a direct dependency in `package.json`. Source: `meta/masterplan.md` section 1 ("Stack") and section 4.2.

**R-002 (HARD)** — `@astrojs/react` is the integration used to render `@poukai/ui` components to static HTML at build time. No other React renderer integration (`@astrojs/preact`, `@astrojs/solid-js`) may render DS components. Verification: `@astrojs/react` listed in `astro.config.mjs` integrations array. Source: `meta/masterplan.md` section 4.2.

**R-003 (HARD)** — `pnpm` is the package manager. `npm` and `yarn` lockfiles must not appear in the repo. Verification: `pnpm-lock.yaml` is present, `package-lock.json` and `yarn.lock` are absent (and listed in `.gitignore` as a defensive measure). Source: `meta/masterplan.md` section 5.1 and 5.2 ("Install command: `pnpm install --frozen-lockfile`").

**R-004 (HARD)** — Node 20 LTS is the build target. The `engines` field in `package.json` pins Node to `>=20 <21`; CI / Vercel use Node 20. Verification: `package.json` `engines.node`, Vercel project setting matches. Source: `meta/masterplan.md` section 5.2.

**R-005 (HARD)** — `@poukai/ui` is consumed via GitHub Packages from `npm.pkg.github.com`, never via a path import or git URL in the site repo's committed manifests. Verification: `.npmrc` at repo root contains `@poukai:registry=https://npm.pkg.github.com` and the auth-token line referencing `${NPM_TOKEN}`; `package.json` lists `@poukai/ui` with a version specifier (not a `file:` or `link:` protocol); grep of the repo finds zero relative or workspace imports of DS source. Source: `meta/masterplan.md` section 5.1 and section 5.2.

**R-006 (HARD)** — Vercel is the deploy target. Build command `pnpm build`, output dir `dist`, install command `pnpm install --frozen-lockfile`, env var `NPM_TOKEN` configured as a Vercel secret. Verification: `vercel.json` (or Vercel project settings, evidenced by a successful preview deploy) match these values. Source: `meta/masterplan.md` section 5.2.

**R-007 (HARD)** — All four canonical routes (`/`, `/why-ai`, `/roles`, `/principles`) exist as `.astro` files under `src/pages/`. No additional routes ship without an approved PM spec in `meta/specs/pages/`. Verification: directory listing of `src/pages/`; reviewer rejects new routes without a spec. Source: `meta/masterplan.md` section 1 ("Scope") and section 4.1.

**R-008 (SOFT)** — Astro integrations are limited to `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/check`, and `astro-compress` unless a PR justifies an addition with a one-line rationale. Verification: `astro.config.mjs` integrations match; new integrations called out in PR description. Source: `meta/masterplan.md` section 4.2.

---

### 3.2 Zero-JS contract

**R-009 (HARD)** — The holding page (`/`) ships zero client-side JavaScript. The built `index.html` must contain no `<script>` tags other than the JSON-LD block (`<script type="application/ld+json">`), and no inline event handlers. Verification: grep the built `dist/index.html` for `<script` — only `application/ld+json` may match; `lighthouse-ci` "uses-passive-event-listeners" and "no-unused-javascript" audits pass cleanly. Source: `meta/masterplan.md` section 0 (TL;DR), section 1, and section 4.3.

**R-010 (HARD)** — Astro hydration directives (`client:load`, `client:idle`, `client:visible`, `client:media`, `client:only`) are forbidden by default across all four routes. Any introduction of a hydration directive requires an inline `// hydration: <reason>` comment on the same line or the line above, and the reviewer must independently verify the reason is load-bearing. Verification: grep of `src/**/*.astro` for `client:` matches — every match must have a justifying comment within 1 line. Source: `meta/masterplan.md` section 4.3 ("`<Hero client:none />` is the default — no hydration directive"); reviewer agent definition section 5 ("No hydration directives (`client:*`) added without a documented reason").

**R-011 (HARD)** — Components imported from `@poukai/ui` are rendered through Astro's server renderer, not hydrated. Any animation in those components must be CSS-only (keyframes), not JS-driven. Verification: code review confirms no `useState` / `useEffect` is in scope at the leaf-render boundary on any page; the `StatusBadge` pulse is CSS keyframes, as documented. Source: `meta/masterplan.md` section 4.3 ("`StatusBadge`'s pulse is CSS keyframes, not state — already JS-free"); `meta/architecture.md` "Motion" section.

**R-012 (HARD)** — No new third-party JS runtime is added to any page (analytics SDKs, chat widgets, A/B testing, marketing pixels) unless an approved spec exists and Arian has signed off in writing. Verification: grep of built HTML for third-party domains in `<script src=>`. Source: `meta/architecture.md` "Decision rules for future changes" ("No JS unless strictly necessary is a load-bearing constraint, not a preference"); `meta/masterplan.md` section 1 (Quality bar).

---

### 3.3 Performance

**R-013 (HARD)** — Every page achieves Lighthouse mobile scores of 100 on Performance, Accessibility, Best Practices, and SEO. CI must run `lighthouse-ci` against each preview deploy and fail the deploy on any score below 100. Verification: `lighthouse-ci` configuration in `.lighthouserc.*` with thresholds set to 100/100/100/100 for the mobile preset; CI run output. Source: `meta/masterplan.md` section 1 (Quality bar) and section 6.1.

**R-014 (HARD)** — Core Web Vitals on mobile: LCP < 2.5s, CLS < 0.1, INP < 200ms, measured on the Lighthouse mobile preset (Moto G4 throttling, slow 4G network simulation). Verification: extracted from the `lighthouse-ci` JSON output in CI. Source: [web.dev/vitals](https://web.dev/articles/vitals) ("Good" thresholds for LCP, CLS, INP); aligns with Lighthouse 100 Performance bar in masterplan section 1.

**R-015 (HARD)** — HTML weight on `/` after gzip is at most 110% of the current static `index.html`'s gzipped weight on `main` (the production holding page). Verification: `wc -c` (or `gzip -c | wc -c`) on the built `dist/index.html`, compared against the same measurement on the current `index.html` checked out from `main`; recorded in the preview-deploy comment thread per masterplan section 6.1. Source: `meta/masterplan.md` section 6.1 (parity matrix, "HTML weight `/` ≤ current page +10%").

**R-016 (SOFT)** — `@poukai/ui`'s ESM full bundle stays ≤ 18 kB and `tokens.css` stays ≤ 4 kB, measured at the package level. Because these are package-side budgets enforced by the DS repo's `size-limit`, the site repo's responsibility is to fail loudly if the consumed package exceeds them (e.g. by a regression check on `pnpm pack` size). Verification: optional `size-check` script in `package.json` or surfaced via DS package's own CI; not enforced by site CI but the reviewer flags an unexplained jump. Source: `meta/masterplan.md` section 3.3 (size-limit budgets).

**R-017 (HARD)** — Webfonts are self-hosted via `@poukai/ui/fonts/*` (no Google Fonts CDN, no Adobe Fonts, no other third-party font host) on every route. Verification: grep built HTML for `fonts.googleapis.com`, `fonts.gstatic.com`, `use.typekit.net` — zero matches. Source: `meta/masterplan.md` section 2A ("Self-hosted webfonts (`.woff2` files in `tokens/fonts/`)"), section 8 risks ("preload Geist Regular + Instrument Serif Regular in `BaseLayout`; subset to Latin").

**R-018 (HARD)** — Primary fonts are preloaded in `BaseLayout.astro`: Geist Regular and Instrument Serif Regular, both as `.woff2`, both with `crossorigin` attribute. Verification: `<link rel="preload" as="font" type="font/woff2" crossorigin>` present in the built `<head>` of every page. Source: `meta/masterplan.md` section 8 risks (Lighthouse 100 mitigation) and `meta/masterplan.md` section 2A action-point row "`BaseLayout.astro` (`<head>`, JSON-LD, font preload)".

**R-019 (HARD)** — Every webfont declaration uses `font-display: swap`. No `font-display: block`, no missing `font-display`. Verification: grep `@font-face` blocks in the served CSS; every block contains `font-display: swap`. Source: `meta/masterplan.md` section 8 risks ("`font-display: swap` already in tokens"); `meta/architecture.md` "Decision rules" ("New font — measure CLS before adding").

**R-020 (HARD)** — Fonts are subset to Latin (Latin Basic + Latin-1 Supplement at minimum). No CJK, Cyrillic, or full-Unicode font payloads ship on the marketing site. Verification: file size of each `.woff2` consistent with Latin subset (rule-of-thumb: a Latin subset of a body face is typically < 40 kB; full Unicode is hundreds of kB). Source: `meta/masterplan.md` section 8 risks ("subset to Latin").

**R-021 (HARD)** — All `<img>` elements have explicit `width` and `height` attributes (or are constrained via CSS aspect-ratio set before paint) to prevent CLS. Verification: grep `<img` in built HTML — every match has `width=` and `height=` attributes. Source: `meta/architecture.md` "Motion" section + universal accessibility / performance bar; aligns with Lighthouse Best-Practices "image-aspect-ratio" audit.

**R-022 (SOFT)** — Images use `astro:assets` for build-time optimization where the source file is in the repo (`public/` excepted for static assets like `og.png` and favicons). Verification: code review — illustrative imagery imported via `import img from '...'` and rendered with `<Image>`. Source: `meta/masterplan.md` section 4.1 (`public/` for static, implied `src/assets/` for processed); Astro docs as the reference for `astro:assets`.

**R-023 (HARD)** — No render-blocking third-party requests. The browser must be able to render the first paint using only resources served from the site's own origin (and Vercel's CDN). Verification: Network panel on preview deploy — first paint completes with no external-origin requests in the critical path; Lighthouse "render-blocking-resources" audit passes. Source: `meta/masterplan.md` section 1 (Quality bar) implies no third-party dependencies in the critical path.

---

### 3.4 Accessibility

**R-024 (HARD)** — Every page conforms to WCAG 2.1 Level AA. Verification: Lighthouse Accessibility = 100 (R-013) **plus** a clean axe-core run against the preview deploy (R-029). Source: `meta/masterplan.md` section 1 (Quality bar); [W3C WCAG 2.1](https://www.w3.org/TR/WCAG21/) as the upstream specification.

**R-025 (HARD)** — Semantic landmarks are present on every page: exactly one `<header>`, exactly one `<main>`, at least one `<nav>` where navigation exists, exactly one `<footer>`. Page-internal sectioning uses `<section>`, `<article>` semantically — not `<div>` containers when a semantic element fits. Verification: axe-core "region" and "landmark-one-main" rules pass; reviewer eyeballs the rendered HTML outline. Source: `meta/architecture.md` "Accessibility" section ("`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>` semantics throughout"); WCAG 2.1 SC 1.3.1 (Info and Relationships).

**R-026 (HARD)** — Heading hierarchy on every page starts with exactly one `<h1>` and never skips a level (no `<h1>` → `<h3>`). Verification: axe-core "heading-order" rule passes; manual outline check during review. Source: `meta/architecture.md` "Accessibility" section ("One `<h1>`"); WCAG 2.1 SC 1.3.1 and SC 2.4.6 (Headings and Labels).

**R-027 (HARD)** — Color contrast against `#FFFFFF` meets WCAG AA: ≥ 4.5:1 for body text, ≥ 3:1 for large text and UI components. The existing token palette (`--fg` at 16.7:1, `--fg-muted` at 5.0:1) is the canonical reference; any new color token must demonstrate AA compliance in its PR. Verification: axe-core "color-contrast" rule passes; for any new token, a contrast measurement is included in the PR description. Source: `meta/architecture.md` "Accessibility" section ("Primary text 16.7:1, muted 5.0:1"); WCAG 2.1 SC 1.4.3 (Contrast Minimum).

**R-028 (HARD)** — Every interactive element (`<a>`, `<button>`, `<input>`, `<summary>`, anything with `tabindex`) has a visible focus indicator using `:focus-visible` (not `:focus`) styling. The focus ring uses the `--accent` token. No `outline: none` without an explicit replacement. Verification: keyboard-tab through each page; axe-core "focus-order-semantics" rule passes. Source: `meta/architecture.md` "Accessibility" section ("`:focus-visible` (not `:focus`) — keyboard ring, no mouse-click ring"); WCAG 2.1 SC 2.4.7 (Focus Visible).

**R-029 (HARD)** — Axe-core reports zero violations on every preview deploy. CI runs `@axe-core/playwright` (or equivalent) against each of the four routes and fails the deploy on any violation. Verification: CI output, archived per deploy. Source: `meta/masterplan.md` section 6.1 ("Axe a11y — `@axe-core/playwright` — 0 violations").

**R-030 (HARD)** — Every animation (entrance staggers, status-dot pulse, hover transitions, scroll-triggered reveals) is gated by an `@media (prefers-reduced-motion: reduce)` block that disables or neutralizes it. The reduced-motion block is the only place `!important` is permitted in CSS, per the existing a11y exception. Verification: grep for `@keyframes` and `transition:` — every animated property has a corresponding `prefers-reduced-motion` exit; manual check by toggling the OS setting on preview. Source: `meta/architecture.md` "Motion" section ("both gated by `@media (prefers-reduced-motion: reduce)`"); WCAG 2.1 SC 2.3.3 (Animation from Interactions).

**R-031 (HARD)** — Every `<img>` has either meaningful `alt` text or an explicit `alt=""` declaring the image decorative. Decorative SVGs use `aria-hidden="true"`. No image is silently missing an `alt` attribute. Verification: axe-core "image-alt" rule passes; grep `<img` and `<svg` in built HTML. Source: `meta/architecture.md` "Accessibility" section ("`aria-hidden="true"` on the decorative brand-logo SVG"); WCAG 2.1 SC 1.1.1 (Non-text Content).

**R-032 (HARD)** — ARIA attributes are used only when semantic HTML cannot carry the meaning. No redundant `role` attributes on elements that already imply their role (`<nav role="navigation">`, `<button role="button">`). Verification: axe-core "aria-allowed-attr" and "aria-required-attr" rules pass; manual review. Source: WCAG 2.1 SC 4.1.2 (Name, Role, Value); [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) ("first rule of ARIA").

**R-033 (HARD)** — The brand wordmark is paired with an accessible text fallback (e.g., `<span class="visuallyhidden">pouk.ai</span>`) so screen readers announce the brand name. The decorative SVG itself is `aria-hidden="true"`. Verification: read the rendered DOM of `<Wordmark>` output; toggle a screen reader on preview. Source: `meta/architecture.md` "Accessibility" section ("paired with `<span class="visuallyhidden">POUKAI</span>`").

---

### 3.5 SEO

**R-034 (HARD)** — Every route has a unique `<title>` element in `<head>`. No two routes share a title; no route ships without one. Verification: fetch each route, parse `<title>`; check uniqueness. Source: WCAG 2.1 SC 2.4.2 (Page Titled); Lighthouse SEO "document-title" audit.

**R-035 (HARD)** — Every route has a `<meta name="description">` tag, between 70 and 160 characters, written for the page's specific intent (not boilerplate copied across routes). Verification: parse `<meta name="description">` per route; check length and uniqueness. Source: Lighthouse SEO "meta-description" audit.

**R-036 (HARD)** — Every route has a `<link rel="canonical">` pointing to its own absolute URL on `pouk.ai`. Verification: parse `<link rel="canonical">` per route. Source: Lighthouse SEO "canonical" audit; aligns with `meta/backlog.md` "Blockers for launch" (canonical references).

**R-037 (HARD)** — Every route emits OG and Twitter card meta: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`. `og:image` must reference an existing 1200×630 PNG in `public/`. Verification: parse the eight required meta tags per route. Source: `meta/backlog.md` "Blockers for launch" ("Referenced by `<meta property="og:image">` and Twitter card"); [Open Graph Protocol](https://ogp.me/) as the upstream spec.

**R-038 (HARD)** — JSON-LD structured data is present on routes where the governing PM spec requires it. The home route (`/`) ships an `Organization` JSON-LD block at minimum, matching the data already present in the legacy `index.html`. Verification: parse `<script type="application/ld+json">` from each route; validate the JSON; compare `/` against the current production page per masterplan section 6.1 ("JSON-LD — manual JSON validate — identical to current page"). Source: `meta/masterplan.md` section 6.1.

**R-039 (HARD)** — `sitemap.xml` is generated by `@astrojs/sitemap` and lists every public route. Verification: fetch `/sitemap.xml` from the preview deploy; confirm all four canonical routes appear; confirm no `noindex` or staging URLs leak. Source: `meta/masterplan.md` section 4.2 ("`@astrojs/sitemap` — Lighthouse SEO 100"); `meta/backlog.md` "Blockers for launch".

**R-040 (HARD)** — `robots.txt` is present at the site root, allows crawling of all four canonical routes by default, and references the sitemap. Verification: fetch `/robots.txt`. Source: `meta/backlog.md` "Blockers for launch" (the exact body is given there).

**R-041 (SOFT)** — Internal linking between routes follows the prospect-funnel order described in `meta/backlog.md` (Why AI → Roles → Principles → contact). The site nav and footer reflect this order. Verification: read the nav structure on each page; confirm consistent ordering. Source: `meta/backlog.md` "Why AI page" section ("Nav order in the eventual site nav: `Why AI → Roles → Principles → contact` mirrors the prospect funnel").

---

### 3.6 Security & headers

**R-042 (HARD)** — `vercel.json` ships an HSTS header on every response: `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`. Verification: `curl -I https://<preview-url>/ | grep -i strict-transport-security` returns the exact header value. Source: `meta/backlog.md` "Blockers for launch" ("HSTS"); [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/) → HSTS recommendation; [hstspreload.org](https://hstspreload.org/) submission requires `max-age >= 31536000`, `includeSubDomains`, and `preload`.

**R-043 (HARD)** — `vercel.json` ships `X-Content-Type-Options: nosniff` on every response. Verification: `curl -I` check. Source: `meta/backlog.md` "Blockers for launch"; OWASP A05:2021 (Security Misconfiguration); MDN reference.

**R-044 (HARD)** — `vercel.json` ships `Referrer-Policy: strict-origin-when-cross-origin` on every response. Verification: `curl -I` check. Source: `meta/backlog.md` "Blockers for launch"; OWASP Secure Headers Project.

**R-045 (HARD)** — `vercel.json` ships `Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()` on every response. (Disables FLoC and confirms the site never asks for sensor/device permission.) Verification: `curl -I` check. Source: `meta/backlog.md` "Blockers for launch"; [permissionspolicy.com](https://www.permissionspolicy.com/) as the syntax reference.

**R-046 (SOFT)** — Content-Security-Policy is opt-in. If a CSP header is added to `vercel.json`, any inline `<script type="application/ld+json">` block must be permitted via a SHA-256 hash directive (`script-src 'sha256-…'`), not via `'unsafe-inline'`. Verification: if `Content-Security-Policy` is present, decode the hash and confirm it matches the JSON-LD block's bytes. Source: `meta/backlog.md` "Blockers for launch" ("Resolve JSON-LD ↔ CSP only **if** you add `script-src 'none'`"); [W3C CSP Level 3](https://www.w3.org/TR/CSP3/).

**R-047 (HARD)** — DNS-level email authentication is configured before the first prospect email goes out: SPF, DKIM, DMARC records on `pouk.ai`, plus a CAA record limiting cert issuance to Let's Encrypt (or whoever Vercel uses). This is a deploy-blocking gate for the moment the domain alias swaps, not for individual PRs. Verification: `dig TXT pouk.ai` returns SPF + DMARC; DKIM selectors return TXT records; `dig CAA pouk.ai` returns a restricting set. Source: `meta/backlog.md` "DNS + email" ("Add MX, SPF, DKIM, DMARC, CAA records — must be live before first prospect email goes out"); RFC 7208 (SPF), RFC 6376 (DKIM), RFC 7489 (DMARC), RFC 8659 (CAA).

**R-048 (HARD)** — No secrets, tokens, credentials, or API keys are committed to the repo. `NPM_TOKEN` is only configured as a Vercel project env var and a developer's local `~/.npmrc` (or `.npmrc` in a gitignored sibling parent), never in the repo's tracked `.npmrc`. Verification: `git log -p` grep for likely secret patterns (`sk-`, `ghp_`, `npm_`, AWS access key prefixes); `gitleaks` or equivalent in CI. Source: `meta/masterplan.md` section 5.1; OWASP A02:2021 (Cryptographic Failures); reviewer agent definition section 5 ("Security: No secrets, tokens, or credentials committed").

**R-049 (HARD)** — `pnpm audit --prod` reports zero high or critical vulnerabilities at merge time. Moderate findings are allowed but must be acknowledged in the PR description. Verification: CI runs `pnpm audit --prod --audit-level=high` and fails on any output. Source: universal supply-chain hygiene; [npm audit docs](https://docs.npmjs.com/cli/v10/commands/npm-audit) as the model.

**R-050 (HARD)** — No new third-party origin is contacted at runtime (analytics, fonts, embeds, CDN scripts) without a one-line rationale in the PR description and a corresponding update to this document. Verification: diff the Network panel between `main` and the PR's preview deploy. Source: reviewer agent definition section 5 ("Security: No new third-party domains hit at runtime without a documented reason").

---

### 3.7 Browser support

**R-051 (HARD)** — Supported browsers: Chrome, Safari, Firefox, Edge — last two stable versions, mobile and desktop. No graceful-degradation contract for older browsers; the site is allowed to break on IE 11, Chrome 90, Safari 14, etc. Verification: BrowserStack or local device check at the start of each release; documented as the support matrix in `README.md`. Source: `meta/architecture.md` "Constraints" ("Modern evergreen browsers only (Chrome / Safari / Firefox / Edge, last 2 versions)"); `meta/masterplan.md` section 1 ("Modern evergreen only" framing).

**R-052 (HARD)** — Layout is mobile-first responsive and renders cleanly down to 320px viewport width. No horizontal scroll, no overflow-clipped content, at 320px on iOS Safari's smallest target. Verification: DevTools viewport at 320×568; manual check on a real device. Source: `meta/backlog.md` "Nice-to-haves" ("Real-device check at 320px width") promoted here to HARD because the masterplan's quality bar applies to mobile.

**R-053 (SOFT)** — Reduced-motion users see a functional, animation-free site (R-030 covers the rule; R-053 covers the visual outcome). The lack of motion must not break layout or hide content. Verification: toggle `prefers-reduced-motion` in DevTools and verify each page renders fully. Source: `meta/architecture.md` "Motion" section; WCAG 2.1 SC 2.3.3.

---

### 3.8 Build & deploy gates

**R-054 (HARD)** — `pnpm build` exits 0 on `main` and on every PR's HEAD. A red build blocks merge. Verification: CI runs `pnpm install --frozen-lockfile && pnpm build`. Source: `meta/masterplan.md` section 5.2 (build command).

**R-055 (HARD)** — `astro check` (via `@astrojs/check`) reports zero TypeScript errors. Verification: CI runs `pnpm astro check` (or it's wired into `pnpm build`). Source: `meta/masterplan.md` section 4.2 ("`@astrojs/check` — typecheck on build").

**R-056 (HARD)** — `lighthouse-ci` runs against the Vercel preview deploy for every PR and asserts 100/100/100/100 on mobile for each of the four routes. Failure to meet the threshold blocks the deploy from being promoted to production. Verification: CI artifact archive contains the Lighthouse JSON; reviewer cites it in the review's "Build & metrics" block. Source: `meta/masterplan.md` section 1 and section 6.1.

**R-057 (HARD)** — `@axe-core/playwright` (or equivalent axe-core runner) runs against every preview deploy for every PR and reports zero violations on every route. Verification: CI artifact archive contains the axe JSON. Source: `meta/masterplan.md` section 6.1.

**R-058 (HARD)** — `pnpm test` exits 0 if any test files exist in the repo. Adding tests is encouraged; absence of tests does not block merge, but if a test file exists and is red, merge is blocked. Verification: CI runs `pnpm test`. Source: universal engineering quality; will be tightened to a coverage threshold when section 6 Open Question O-008 is resolved.

**R-059 (HARD)** — Before the `pouk.ai` domain alias swaps from the legacy holding page to the new Astro project, the preview deploy must pass every check in the masterplan section 6.1 parity matrix (visual diff "indistinguishable" on `/`, Lighthouse 100/100/100/100, axe 0 violations, JSON-LD identical to current page, HTML weight `/` ≤ current page +10%, `prefers-reduced-motion` all animation off). This is a launch gate, not a per-PR gate. Verification: a launch-readiness review documents each row of the matrix with a measurement and a verdict. Source: `meta/masterplan.md` section 6.1 and section 6.2.

---

### 3.9 Observability

**R-060 (SOFT)** — Analytics, if added, must be cookieless and require zero client JS for the basic tier. Vercel Web Analytics' basic tier meets this; Cloudflare Web Analytics is an acceptable alternative. Third-party analytics (Google Analytics, Mixpanel, PostHog) are not permitted on the marketing site at this stage. Verification: vendor confirmation; Network-panel diff confirms no cookie set, no JS request on first paint. Source: `meta/backlog.md` "Nice-to-haves" ("Vercel Web Analytics is one toggle in the dashboard (cookieless, no JS for the basic tier)").

**R-061 (SOFT)** — Error reporting tool — undecided. Pending Arian's call (see O-003). If chosen, the SDK must respect R-009 (zero client JS on `/`); a build-time error sink (Vercel logs, Sentry release-only) is preferred over a client-side runtime SDK. Verification: deferred until decision. Source: universal observability hygiene.

**R-062 (HARD)** — No analytics, observability, or telemetry tool fires before user-visible content has rendered. If a tool is added, it loads from the same origin (no third-party blocking request on the critical path). Verification: Lighthouse "render-blocking-resources" audit; Network panel diff. Source: `meta/masterplan.md` section 1 (Quality bar implies critical-path discipline); reinforces R-023.

---

### 3.10 Dependency & supply chain policy

**R-063 (HARD)** — Every new dependency (direct or dev) requires a one-line rationale in the PR description: what it does, why an existing tool can't, and the license. Verification: reviewer reads the PR description; rejects PRs that add dependencies without a rationale. Source: universal supply-chain hygiene; aligns with reviewer agent definition section 5 ("Security: New dependencies are minimal, maintained, MIT/Apache/ISC licensed").

**R-064 (HARD)** — All dependencies (direct and transitive, dev and prod) must be licensed under MIT, Apache-2.0, ISC, or BSD-2/3-Clause. GPL, AGPL, LGPL, BSL, CC-BY-NC, "Commons Clause", and unlicensed packages are forbidden. Verification: `pnpm licenses list` (or `license-checker`) in CI; flag any non-permissive license. Source: universal supply-chain hygiene; matches reviewer agent definition section 5.

**R-065 (HARD)** — Production dependencies in `package.json` are pinned to exact versions (no `^`, no `~`, no ranges) for reproducibility. Dev dependencies may use caret ranges. Verification: parse `package.json`'s `dependencies` object — every value matches `\d+\.\d+\.\d+(-[\w.]+)?` with no leading operator. Source: universal reproducibility; aligns with `meta/masterplan.md` section 5.2 ("`pnpm install --frozen-lockfile`").

**R-066 (HARD)** — `pnpm-lock.yaml` is committed to the repo and stays in sync with `package.json`. CI fails on a stale lockfile. Verification: `pnpm install --frozen-lockfile` in CI exits 0. Source: `meta/masterplan.md` section 5.2.

**R-067 (SOFT)** — Deprecated packages (per `npm`'s deprecation registry) are not added; existing deprecated transitives are tracked in the PR description with a plan to remove. Verification: `pnpm outdated --long` or `npm deprecated` check in CI. Source: universal supply-chain hygiene.

**R-068 (SOFT)** — Automated minor/patch dependency updates via Renovate or Dependabot, with human review on major updates. Verification: `.github/renovate.json` or `.github/dependabot.yml` present. Source: universal supply-chain hygiene.

---

### 3.11 Repository hygiene

**R-069 (HARD)** — `.gitignore` excludes: `/brand` (brand source assets), `.env*` (local env files), `dist/`, `.astro/`, `.vercel/`, `node_modules/`, OS files (`.DS_Store`, `Thumbs.db`), and editor folders (`.idea/`, `.vscode/` unless explicitly shared). Verification: file content check. Source: `meta/architecture.md` "File layout" ("Brand source assets live in a `brand/` folder … but are **gitignored**"); universal repo hygiene.

**R-070 (SOFT)** — Branch naming: `feature/<slug>` for new work, `fix/<slug>` for bugfixes, `chore/<slug>` for tooling. `main` is the long-lived default. Verification: branch naming convention checked at PR-open time. Source: reviewer judgment, common-practice default. Promoted to HARD on Arian's call (see O-009).

**R-071 (HARD)** — No force-push to `main`. No force-push to a branch with an open PR unless the PR author owns the branch and the rebase is non-destructive. Verification: branch protection rules on GitHub. Source: universal git hygiene; matches reviewer agent definition section 9 ("Don't merge, push, deploy, or commit code changes").

**R-072 (SOFT)** — Commit messages are readable: imperative mood, ≤ 72 chars on the subject line, body explains *why* not *what*. Conventional Commits format (`feat:`, `fix:`, `chore:`) is welcomed but not required. Verification: reviewer reads `git log` during review. Source: reviewer judgment. See O-006.

**R-073 (HARD)** — No `console.log`, no `debugger`, no commented-out experiments, no `TODO` without a tracking issue, no dead imports in the merged code. Verification: ESLint rules `no-console`, `no-debugger`; reviewer manual scan. Source: reviewer agent definition section 5 ("Maintainability: No dead code, no commented-out experiments, no `console.log`").

---

### 3.12 Content data contract

**R-074 (HARD)** — Every file in `src/content/*.json` (per `meta/masterplan.md` section 4.1: `roles.json`, `principles.json`, `failure-modes.json`, and any future content files) validates against a published Zod schema located at `src/content/_schemas/<name>.ts`. The build fails if a content file fails its schema. Verification: a build-time script (or Astro content collection) loads each JSON, parses it through the schema, and exits non-zero on failure. Source: `meta/masterplan.md` section 4.4 ("Long-form content as data … typed JSON in `src/content/`"); universal data-contract hygiene.

**R-075 (HARD)** — Schema files in `src/content/_schemas/` export a named Zod schema (e.g., `export const RolesSchema = z.array(z.object({...}))`) and a TypeScript type derived from it (`export type Role = z.infer<typeof RoleSchema>`). Page templates that consume the JSON import the type and rely on it, not on `any` or `unknown`. Verification: grep for `as any` in `src/pages/`; should be zero. Source: universal type-safety hygiene; aligns with R-055 (`astro check` clean).

**R-076 (HARD)** — Content JSON is the only place copy lives. Page templates and components do not contain hard-coded copy strings (the brand wordmark is excepted, since it's rendered via `<Wordmark>` from the DS). Verification: reviewer reads each `.astro` file in `src/pages/`; any inline copy literal is a finding. Source: reviewer agent definition section 5 ("Maintainability: Copy lives in `src/content/*.json`, not JSX literals"); `meta/masterplan.md` section 4.4.

**R-077 (SOFT)** — Content JSON does not contain HTML markup. If a content item needs rich formatting (line breaks, emphasis), either (a) the JSON exposes structured fields the template renders into HTML, or (b) the content moves to MDX in a future Astro content collection. Verification: grep for `<` characters inside JSON string values. Source: `meta/masterplan.md` section 4.4 (MDX is the planned escape hatch).

---

## 4. Verification & enforcement

**Per-PR verification matrix.** Every PR runs:

| Gate | Tool | Requirements covered |
| --- | --- | --- |
| Lint | ESLint (with `no-console`, `no-debugger`) | R-073 |
| Type check | `astro check` | R-055 |
| Build | `pnpm build` | R-054 |
| Lighthouse | `lighthouse-ci` on preview | R-013, R-014, R-015, R-023, R-056 |
| Axe-core | `@axe-core/playwright` on preview | R-024–R-033, R-057 |
| Security headers | `curl -I` on preview deploy | R-042–R-045 |
| Dependency audit | `pnpm audit --prod --audit-level=high` | R-049 |
| License check | `pnpm licenses list` (or `license-checker`) | R-064 |
| Lockfile freshness | `pnpm install --frozen-lockfile` | R-066 |
| Content schemas | Build-time Zod validation | R-074, R-075 |
| Secret scan | `gitleaks` or `trufflehog` | R-048 |

**Per-launch verification (one-time, before domain alias swap).** Runs the parity matrix from `meta/masterplan.md` section 6.1 (R-059) plus a manual a11y walk with a screen reader and the 320px real-device check (R-052).

**Per-review verification (reviewer's job).** The reviewer's `meta/reviews/` document cites specific R-NNN identifiers in each finding. A finding without an R-NNN citation (or without an upstream-authority citation when no R-NNN applies) should be re-stated or downgraded.

**Tooling that doesn't exist yet.** Several gates above (Zod content schemas, lighthouse-ci config, axe-core runner, license check) will be added by the engineer in Phase 2 of the masterplan. Until those land, the corresponding requirements are *aspirational* for CI but *enforced manually* by the reviewer reading the diff. The reviewer flags missing automation as a finding rather than waiving the requirement.

---

## 5. Change log

| Date | Author | Change |
| --- | --- | --- |
| 2026-05-13 | pouk-ai-reviewer | Initial Draft. R-001 through R-077 published. Status: Draft. |

---

## 6. Open questions

Items the reviewer could not resolve without Arian's input. Each is the blocker for promoting this document from Draft to Approved.

- **O-001 — Lighthouse 100 vs. 99 as the HARD bar (R-013, R-056).** The masterplan says 100. In practice, Lighthouse Performance fluctuates by 1–2 points run-to-run on identical content. Reviewer default: hold the bar at 100 — but Arian should confirm he's accepting the operational cost (occasional re-runs, occasional last-minute optimization to claw back a point).
- **O-002 — Analytics provider for production (R-060).** Vercel Web Analytics basic tier or Cloudflare Web Analytics? Both meet the cookieless / no-JS bar. Vercel is one toggle, lives where the deploy lives. Cloudflare is host-agnostic and is the "future-proof" pick. Reviewer default: ship Vercel until there's a reason to migrate.
- **O-003 — Error reporting tool (R-061).** Sentry (full-featured, but is a third-party JS SDK on the client by default), Vercel's built-in logs (server-side only, free), or none until traffic justifies it? Reviewer default: none on launch; revisit at first sustained traffic.
- **O-004 — CSP strategy (R-046).** Ship a CSP from day one (and hash-pin the JSON-LD), or stay CSP-less until there's an actual XSS surface? Reviewer default: stay CSP-less for the static-marketing phase, add CSP the moment a form or third-party embed enters the picture.
- **O-005 — Service worker for offline (universal).** Reviewer default: no. The site is small enough that browser HTTP cache plus Vercel's edge CDN cover the offline-ish case; a service worker adds complexity that fights R-009 (zero JS).
- **O-006 — Conventional Commits as HARD or SOFT (R-072).** Reviewer default: SOFT. The masterplan is silent. Adopting strict Conventional Commits would unlock changesets-style automation, but the site is small and the cost may not be worth it.
- **O-007 — Test coverage threshold (R-058).** No tests today. If/when tests are added, what's the bar? Reviewer default: when tests exist, require ≥ 80% line coverage on changed files (not absolute), and require any new component to ship with a smoke test.
- **O-008 — `.well-known/security.txt` (universal security hygiene).** A `security.txt` file at `/.well-known/security.txt` advertising a security contact ([security@pouk.ai], a PGP key, a disclosure policy) is a low-cost good-citizen move. Reviewer default: add it once `hello@pouk.ai` is live (R-047 prerequisite).
- **O-009 — Branch naming as HARD (R-070).** Default SOFT; promote to HARD if Arian wants branch-name-based PR labeling.
- **O-010 — PM specs missing.** `meta/specs/pages/*.md` and `meta/specs/content/*.md` referenced in this reviewer's brief are not yet present in the tree (only `.gitkeep` files). Several requirements in this document defer to "the governing PM spec" (e.g., R-038 JSON-LD, R-007 new routes). Until the PM lands those specs, the reviewer falls back to the masterplan and `meta/backlog.md` "Approved copy from founder" sections, which is fine for now — but this gap should be closed before the four-page build starts in earnest.

---

## 7. Suspected masterplan updates

Items where reading the masterplan against this standard surfaced wording that should probably be revised (not by this document — flag for the PM/Arian):

- **`meta/masterplan.md` section 6.1 "HTML weight (`/`)"** — measured against `wc -c` on the built file, but the production page is gzipped on the wire. R-015 specifies gzipped bytes; the masterplan should match or explicitly say "uncompressed".
- **`meta/masterplan.md` section 4.2** — lists four integrations but doesn't mention how `lighthouse-ci`, axe-core, or content-schema validation are integrated. The masterplan is silent on the CI shape; this document fills it in via section 4 (Verification). The masterplan could either point at this document or absorb the CI architecture as a new sub-section.
- **`meta/masterplan.md` section 7 ("Open questions")** — item 1 says "ship `banner.png` as the OG image" until `og.png` exists. R-037 here requires a 1200×630 OG image. `banner.png` may or may not be 1200×630; the engineer should verify dimensions before merging the BaseLayout, or the masterplan should be updated to acknowledge that the launch-blocker `og.png` from `meta/backlog.md` is the only acceptable artifact.
- **`meta/architecture.md` "Constraints"** — describes the current single-file `index.html` reality ("Pure HTML5 + CSS. **No JavaScript. No build step. No frameworks.**"). Once Phase 2 lands, that paragraph will be historically true but operationally false. Recommend annotating that file with a "Note: superseded by `meta/masterplan.md` once Astro migration lands" header, or rewriting it to describe the Astro architecture.

---

## 8. References

- `meta/masterplan.md` — strategic decisions, taxonomy, release sequence. Especially sections 1, 2A, 4.2, 4.3, 4.4, 5.1, 5.2, 6.1, 6.2, 8.
- `meta/architecture.md` — current single-file reality, design-token contract, motion / a11y rules.
- `meta/backlog.md` — launch blockers (security headers, DNS, OG image), approved page copy.
- `.claude/agents/pouk-ai-reviewer.md` — reviewer's own working contract, especially section 5 (universal quality checks) and section 9 (hard "no" list).
- [W3C WCAG 2.1](https://www.w3.org/TR/WCAG21/) — accessibility upstream specification (cited under R-024, R-025, R-026, R-027, R-028, R-030, R-031, R-032, R-053).
- [web.dev — Web Vitals](https://web.dev/articles/vitals) — Core Web Vitals "Good" thresholds (cited under R-014).
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/) — security header recommendations (cited under R-042, R-043, R-044).
- [Open Graph Protocol](https://ogp.me/) — OG meta tag specification (cited under R-037).
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — ARIA usage rules (cited under R-032).
- [permissionspolicy.com](https://www.permissionspolicy.com/) — Permissions-Policy syntax reference (cited under R-045).
- [hstspreload.org](https://hstspreload.org/) — HSTS preload requirements (cited under R-042).
- RFC 7208 (SPF), RFC 6376 (DKIM), RFC 7489 (DMARC), RFC 8659 (CAA) — email auth (cited under R-047).
- [W3C CSP Level 3](https://www.w3.org/TR/CSP3/) — Content Security Policy spec (cited under R-046).
