# Technical Requirements — pouk.ai marketing site

**Status**: Approved
**Last updated**: 2026-05-13
**Author**: pouk-ai-reviewer
**Decision authority**: Arian (founder)
**Decisions resolved**: see `meta/decisions/launch-readiness.md` (D-14 through D-22, resolved 2026-05-13)
**Supersedes**: nothing yet — first engineering standard for the repo.

---

## 1. Purpose

This document is the catalog of testable, non-functional requirements that every change to `poukai-inc/pouk.ai` must satisfy before merge. It promotes the standards embedded in `meta/masterplan.md` and `meta/architecture.md` prose into first-class, numbered requirements that reviews can cite (e.g. "violates R-014").

The masterplan remains the strategic narrative — the *why*. This document is the operational checklist — the *what must be true*. Where the two overlap, the masterplan wins on intent and this document wins on test specificity. Where this document references a masterplan section, that section stays authoritative for the underlying decision.

This document is Approved. The open questions O-001 through O-009 that gated promotion from Draft were resolved on 2026-05-13 via `meta/decisions/launch-readiness.md` (D-14 through D-22). Two new open questions (O-011, O-012) cover deployment shape for the tools that decision pass selected; those are infrastructure choices, not standards holes. Section 6 lists the resolved set and the new open questions.

---

## 2. Scope

**In scope**: the `poukai-inc/pouk.ai` repo only — the Astro site that will replace the current single-file `index.html`. Covers the four canonical routes (`/`, `/why-ai`, `/roles`, `/principles`), `BaseLayout.astro`, content JSON files, build pipeline, Vercel deploy, and the `.npmrc` / GitHub Packages consumption of `@poukai-inc/ui`.

**Out of scope**: the `@poukai-inc/ui` package itself (lives in `poukai-inc/poukai-ui`, has its own quality bars in masterplan section 3.3 and its own `size-limit` budgets). Brand-source assets in `/brand/`. The `meta/` project-memory tree. Future product surfaces (`*-app` repos).

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

**R-002 (HARD)** — `@astrojs/react` is the integration used to render `@poukai-inc/ui` components to static HTML at build time. No other React renderer integration (`@astrojs/preact`, `@astrojs/solid-js`) may render DS components. Verification: `@astrojs/react` listed in `astro.config.mjs` integrations array. Source: `meta/masterplan.md` section 4.2.

**R-003 (HARD)** — `pnpm` is the package manager. `npm` and `yarn` lockfiles must not appear in the repo. Verification: `pnpm-lock.yaml` is present, `package-lock.json` and `yarn.lock` are absent (and listed in `.gitignore` as a defensive measure). Source: `meta/masterplan.md` section 5.1 and 5.2 ("Install command: `pnpm install --frozen-lockfile`").

**R-004 (HARD)** — Node 20 LTS is the build target. The `engines` field in `package.json` pins Node to `>=20 <21`; CI / Vercel use Node 20. Verification: `package.json` `engines.node`, Vercel project setting matches. Source: `meta/masterplan.md` section 5.2.

**R-005 (HARD)** — `@poukai-inc/ui` is consumed via GitHub Packages from `npm.pkg.github.com`, never via a path import or git URL in the site repo's committed manifests. Verification: `.npmrc` at repo root contains `@poukai-inc:registry=https://npm.pkg.github.com` and the auth-token line referencing `${NPM_TOKEN}`; `package.json` lists `@poukai-inc/ui` with a version specifier (not a `file:` or `link:` protocol); grep of the repo finds zero relative or workspace imports of DS source. Source: `meta/masterplan.md` section 5.1 and section 5.2.

**R-006 (HARD)** — Vercel is the deploy target. Build command `pnpm build`, output dir `dist`, install command `pnpm install --frozen-lockfile`, env var `NPM_TOKEN` configured as a Vercel secret. Verification: `vercel.json` (or Vercel project settings, evidenced by a successful preview deploy) match these values. Source: `meta/masterplan.md` section 5.2.

**R-007 (HARD)** — All four canonical routes (`/`, `/why-ai`, `/roles`, `/principles`) exist as `.astro` files under `src/pages/`. No additional routes ship without an approved PM spec in `meta/specs/pages/`. Verification: directory listing of `src/pages/`; reviewer rejects new routes without a spec. Source: `meta/masterplan.md` section 1 ("Scope") and section 4.1.

**R-008 (SOFT)** — Astro integrations are limited to `@astrojs/react`, `@astrojs/sitemap`, `@astrojs/check`, and `astro-compress` unless a PR justifies an addition with a one-line rationale. Verification: `astro.config.mjs` integrations match; new integrations called out in PR description. Source: `meta/masterplan.md` section 4.2.

---

### 3.2 Client JS budget and discipline

The original posture (zero client JS on `/`) was relaxed on 2026-05-13 by decisions D-15 (Matomo on every page) and D-16 (Bugsink on every page). Zero-JS-on-`/` was a *means*, not the end. The end — fast, private, accessible — is preserved by the budget rules below. See section 5 (Rationale) for the full reasoning.

**R-009 (HARD)** — Client JS on any page is limited to: (a) first-party analytics (Matomo tracker, per R-060); (b) first-party error reporting (Bugsink / Sentry-compatible browser SDK, per R-061); (c) `@poukai-inc/ui` islands explicitly hydrated with an inline `// hydration: <reason>` comment on the same line or the line above. No other client JS — no third-party analytics SDKs, no chat widgets, no A/B testing, no marketing pixels, no embedded video players — ships without an explicit standards revision approved by Arian. Verification: grep the built HTML for `<script` tags and external `src=` attributes; every match must map to one of (a), (b), or (c). Source: `meta/decisions/launch-readiness.md` D-15 and D-16; `meta/masterplan.md` section 4.3 (hydration discipline carries over).

**R-010 (HARD)** — Total third-party JS payload on any page is ≤ 75 kB gzipped. Matomo's tracker (~25 kB) plus Bugsink's browser SDK (~40 kB) together baseline at ~65 kB; the 75 kB ceiling leaves a small headroom and forces a hard conversation if a third tool is proposed. Verification: measure each external `<script src>` artifact's gzipped size on the preview deploy; sum across all third-party scripts on the page; fail the deploy if sum > 75 kB. Source: `meta/decisions/launch-readiness.md` D-15 and D-16 (tool picks); reviewer judgment on headroom calibration.

**R-011 (HARD)** — Every third-party `<script>` tag is `defer`-ed (or has `async` where defer would re-order critical execution) and is loaded after the meaningful paint. Render-blocking third-party JS is forbidden. Inline `<script>` tags carrying third-party logic are forbidden — third-party logic loads from its own file, even if it lives on the same origin (self-hosted Matomo / Bugsink). Verification: parse every `<script>` tag in the built HTML; every external third-party script has `defer` or `async`; Lighthouse "render-blocking-resources" audit passes. Source: `meta/decisions/launch-readiness.md` D-15 and D-16; `meta/masterplan.md` section 1 (Quality bar implies critical-path discipline).

**R-012 (HARD)** — In jurisdictions that require it, no third-party JS executes before user consent. Matomo's cookieless tracking mode is the launch configuration and is permitted to fire on page load. Bugsink's browser SDK is treated as essential operational telemetry and may also fire on page load, with PII scrubbing configured on the server side. If Matomo's cookie-mode is enabled in a future standards revision, this requirement must be tightened with a consent-gate flow — flagged as a future revision in section 6. Verification: confirm Matomo configuration on the preview deploy uses cookieless mode (no `_pk_*` cookies set); confirm Bugsink scrubs IP and form data on ingest. Source: `meta/decisions/launch-readiness.md` D-15 and D-16; [GDPR Art. 7 and ePrivacy Directive Art. 5(3)] as the upstream legal references; [Matomo cookieless tracking docs] as the configuration reference.

**R-078 (HARD)** — Astro hydration directives (`client:load`, `client:idle`, `client:visible`, `client:media`, `client:only`) are forbidden by default across all four routes. Any introduction of a hydration directive requires an inline `// hydration: <reason>` comment on the same line or the line above, and the reviewer must independently verify the reason is load-bearing. The same inline-comment discipline applies to the two whitelisted first-party script tags: `// analytics: matomo` for the Matomo tracker tag in `BaseLayout.astro` and `// error-reporting: bugsink` for the Bugsink SDK tag in `BaseLayout.astro`. Verification: grep of `src/**/*.astro` for `client:` and for the analytics/error-reporting tag insertions — every match must have a justifying comment within 1 line. Source: `meta/masterplan.md` section 4.3 ("`<Hero client:none />` is the default — no hydration directive"); reviewer agent definition section 5; `meta/decisions/launch-readiness.md` D-15 and D-16. (Continues the hydration discipline formerly at R-010, restated here so the new section 3.2 numbering can host the client-JS budget rules; future review findings citing the old R-010 should reference R-078 instead.)

**R-079 (HARD)** — Components imported from `@poukai-inc/ui` are rendered through Astro's server renderer, not hydrated. Any animation in those components must be CSS-only (keyframes), not JS-driven. Verification: code review confirms no `useState` / `useEffect` is in scope at the leaf-render boundary on any page; the `StatusBadge` pulse is CSS keyframes, as documented. Source: `meta/masterplan.md` section 4.3 ("`StatusBadge`'s pulse is CSS keyframes, not state — already JS-free"); `meta/architecture.md` "Motion" section. (Preserves the rule formerly at R-011; future review findings citing R-011 should reference R-079 instead.)

**R-080 (HARD)** — No service worker is registered. Static caching is handled by Vercel's edge CDN and the browser HTTP cache. A service worker would add a JS runtime that fights the budget rules in R-009/R-010 without an offsetting benefit for a four-page static site. Verification: grep the built JS for `navigator.serviceWorker.register` — zero matches; no `sw.js` or `service-worker.js` in `dist/`. Source: `meta/decisions/launch-readiness.md` D-18.

---

### 3.3 Performance

**R-013 (HARD)** — Every page achieves Lighthouse mobile scores of: Performance ≥ 95, Accessibility = 100, Best Practices = 100, SEO = 100. CI must run `lighthouse-ci` against each preview deploy and fail the deploy on any per-category miss. Lighthouse flake (Performance fluctuating by 1–2 points run-to-run) is handled by re-running on flake, not by lowering the bar; any sustained per-category miss must be investigated and root-caused, not papered over. Verification: `lighthouse-ci` configuration in `.lighthouserc.*` with thresholds set to 95/100/100/100 for the mobile preset; CI run output. Source: `meta/masterplan.md` section 1 (Quality bar); `meta/decisions/launch-readiness.md` D-14 (Performance band relaxed from 100 to ≥ 95 to absorb the ~65 kB third-party JS baseline introduced by D-15 + D-16; A11y/BP/SEO stay at 100 because they're deterministic and unaffected by JS-budget churn).

**R-014 (HARD)** — Core Web Vitals on mobile: LCP < 2.5s, CLS < 0.1, INP < 200ms, measured on the Lighthouse mobile preset (Moto G4 throttling, slow 4G network simulation). These thresholds remain HARD despite the Performance score being relaxed to ≥ 95 in R-013; the JS-budget shift in section 3.2 does not justify softening user-facing vitals. If meeting these vitals under the new client-JS budget proves hard, the engineer's response is to defer/optimize JS loading, not to seek a standards revision. Verification: extracted from the `lighthouse-ci` JSON output in CI. Source: [web.dev/vitals](https://web.dev/articles/vitals) ("Good" thresholds for LCP, CLS, INP).

**R-015 (HARD)** — HTML weight on `/` after gzip is at most 110% of the current static `index.html`'s gzipped weight on `main` (the production holding page). Verification: `wc -c` (or `gzip -c | wc -c`) on the built `dist/index.html`, compared against the same measurement on the current `index.html` checked out from `main`; recorded in the preview-deploy comment thread per masterplan section 6.1. Source: `meta/masterplan.md` section 6.1 (parity matrix, "HTML weight `/` ≤ current page +10%").

**R-016 (SOFT)** — `@poukai-inc/ui`'s ESM full bundle stays ≤ 18 kB and `tokens.css` stays ≤ 4 kB, measured at the package level. Because these are package-side budgets enforced by the DS repo's `size-limit`, the site repo's responsibility is to fail loudly if the consumed package exceeds them (e.g. by a regression check on `pnpm pack` size). Verification: optional `size-check` script in `package.json` or surfaced via DS package's own CI; not enforced by site CI but the reviewer flags an unexplained jump. Source: `meta/masterplan.md` section 3.3 (size-limit budgets).

**R-017 (HARD)** — Webfonts are self-hosted via `@poukai-inc/ui/fonts/*` (no Google Fonts CDN, no Adobe Fonts, no other third-party font host) on every route. Verification: grep built HTML for `fonts.googleapis.com`, `fonts.gstatic.com`, `use.typekit.net` — zero matches. Source: `meta/masterplan.md` section 2A ("Self-hosted webfonts (`.woff2` files in `tokens/fonts/`)"), section 8 risks ("preload Geist Regular + Instrument Serif Regular in `BaseLayout`; subset to Latin").

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

**R-046 (SOFT)** — No Content-Security-Policy header ships on launch. CSP is added the moment a form, third-party embed (beyond Matomo and Bugsink, which are self-hosted first-party tools), or other XSS surface enters the picture. When that day comes, any inline `<script type="application/ld+json">` block must be permitted via a SHA-256 hash directive (`script-src 'sha256-…'`), not via `'unsafe-inline'`; the Matomo and Bugsink script tags must be permitted via `script-src` referencing the first-party origin that serves them. Verification at launch: `curl -I https://pouk.ai/` returns no `Content-Security-Policy` header — and that absence is itself the verified state, not a gap. Source: `meta/backlog.md` "Blockers for launch" ("Resolve JSON-LD ↔ CSP only **if** you add `script-src 'none'`"); [W3C CSP Level 3](https://www.w3.org/TR/CSP3/); `meta/decisions/launch-readiness.md` D-17.

**R-047 (HARD)** — DNS-level email authentication is configured before the first prospect email goes out: SPF, DKIM, DMARC records on `pouk.ai`, plus a CAA record limiting cert issuance to Let's Encrypt (or whoever Vercel uses). This is a deploy-blocking gate for the moment the domain alias swaps, not for individual PRs. Verification: `dig TXT pouk.ai` returns SPF + DMARC; DKIM selectors return TXT records; `dig CAA pouk.ai` returns a restricting set. Source: `meta/backlog.md` "DNS + email" ("Add MX, SPF, DKIM, DMARC, CAA records — must be live before first prospect email goes out"); RFC 7208 (SPF), RFC 6376 (DKIM), RFC 7489 (DMARC), RFC 8659 (CAA).

**R-048 (HARD)** — No secrets, tokens, credentials, or API keys are committed to the repo. `NPM_TOKEN` is only configured as a Vercel project env var and a developer's local `~/.npmrc` (or `.npmrc` in a gitignored sibling parent), never in the repo's tracked `.npmrc`. Verification: `git log -p` grep for likely secret patterns (`sk-`, `ghp_`, `npm_`, AWS access key prefixes); `gitleaks` or equivalent in CI. Source: `meta/masterplan.md` section 5.1; OWASP A02:2021 (Cryptographic Failures); reviewer agent definition section 5 ("Security: No secrets, tokens, or credentials committed").

**R-049 (HARD)** — `pnpm audit --prod` reports zero high or critical vulnerabilities at merge time. Moderate findings are allowed but must be acknowledged in the PR description. Verification: CI runs `pnpm audit --prod --audit-level=high` and fails on any output. Source: universal supply-chain hygiene; [npm audit docs](https://docs.npmjs.com/cli/v10/commands/npm-audit) as the model.

**R-050 (HARD)** — No new third-party origin is contacted at runtime (analytics, fonts, embeds, CDN scripts) without a one-line rationale in the PR description and a corresponding update to this document. Verification: diff the Network panel between `main` and the PR's preview deploy. Source: reviewer agent definition section 5 ("Security: No new third-party domains hit at runtime without a documented reason").

**R-081 (SOFT now; HARD once `hello@pouk.ai` (or equivalent) is live)** — A `.well-known/security.txt` file at `/.well-known/security.txt` advertises a security contact (`security@pouk.ai` or `hello@pouk.ai`), an optional PGP key, and a disclosure policy. Required fields per RFC 9116: `Contact:` (email or URL), `Expires:` (ISO 8601 date, ≤ 1 year out). Recommended fields: `Encryption:`, `Preferred-Languages:`, `Policy:`. While `hello@pouk.ai` is not yet live, this requirement is SOFT and the reviewer raises absence as a NIT; once mailbox routing lands (R-047 prerequisite), this requirement promotes to HARD automatically. The work item lives in `meta/backlog.md` per `meta/decisions/launch-readiness.md` D-21. Verification: `curl https://pouk.ai/.well-known/security.txt` returns 200 with valid `Contact:` and non-expired `Expires:` fields. Source: [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116); `meta/decisions/launch-readiness.md` D-21.

---

### 3.7 Browser support

**R-051 (HARD)** — Supported browsers: Chrome, Safari, Firefox, Edge — last two stable versions, mobile and desktop. No graceful-degradation contract for older browsers; the site is allowed to break on IE 11, Chrome 90, Safari 14, etc. Verification: BrowserStack or local device check at the start of each release; documented as the support matrix in `README.md`. Source: `meta/architecture.md` "Constraints" ("Modern evergreen browsers only (Chrome / Safari / Firefox / Edge, last 2 versions)"); `meta/masterplan.md` section 1 ("Modern evergreen only" framing).

**R-052 (HARD)** — Layout is mobile-first responsive and renders cleanly down to 320px viewport width. No horizontal scroll, no overflow-clipped content, at 320px on iOS Safari's smallest target. Verification: DevTools viewport at 320×568; manual check on a real device. Source: `meta/backlog.md` "Nice-to-haves" ("Real-device check at 320px width") promoted here to HARD because the masterplan's quality bar applies to mobile.

**R-053 (SOFT)** — Reduced-motion users see a functional, animation-free site (R-030 covers the rule; R-053 covers the visual outcome). The lack of motion must not break layout or hide content. Verification: toggle `prefers-reduced-motion` in DevTools and verify each page renders fully. Source: `meta/architecture.md` "Motion" section; WCAG 2.1 SC 2.3.3.

---

### 3.8 Build & deploy gates

**R-054 (HARD)** — `pnpm build` exits 0 on `main` and on every PR's HEAD. A red build blocks merge. Verification: CI runs `pnpm install --frozen-lockfile && pnpm build`. Source: `meta/masterplan.md` section 5.2 (build command).

**R-055 (HARD)** — `astro check` (via `@astrojs/check`) reports zero TypeScript errors. Verification: CI runs `pnpm astro check` (or it's wired into `pnpm build`). Source: `meta/masterplan.md` section 4.2 ("`@astrojs/check` — typecheck on build").

**R-056 (HARD)** — `lighthouse-ci` runs against the Vercel preview deploy for every PR and asserts Performance ≥ 95, Accessibility = 100, Best Practices = 100, SEO = 100 on mobile for each of the four routes. Failure to meet any per-category threshold blocks the deploy from being promoted to production. Performance flake (single-run dips of 1–2 points) is handled by re-running before failing the build; sustained Performance misses below 95 must be root-caused, not retried away. Verification: CI artifact archive contains the Lighthouse JSON; reviewer cites it in the review's "Build & metrics" block. Source: `meta/masterplan.md` section 1 and section 6.1; `meta/decisions/launch-readiness.md` D-14.

**R-057 (HARD)** — `@axe-core/playwright` (or equivalent axe-core runner) runs against every preview deploy for every PR and reports zero violations on every route. Verification: CI artifact archive contains the axe JSON. Source: `meta/masterplan.md` section 6.1.

**R-058 (HARD when tests exist on changed files)** — `pnpm test` exits 0 if any test files exist in the repo; if a test file exists and is red, merge is blocked. When tests exist on the changed files, line coverage on those changed files must be ≥ 80%. Every new component ships with a smoke test. If no tests exist on the changed files, the coverage threshold does not apply for that PR — but the reviewer surfaces the absence as a NIT so the gap stays visible. Verification: CI runs `pnpm test`; coverage report is parsed and the changed-files threshold checked. Source: `meta/decisions/launch-readiness.md` D-20; universal engineering quality.

**R-059 (HARD)** — Before the `pouk.ai` domain alias swaps from the legacy holding page to the new Astro project, the preview deploy must pass every check in the masterplan section 6.1 parity matrix (visual diff "indistinguishable" on `/`, Lighthouse 100/100/100/100, axe 0 violations, JSON-LD identical to current page, HTML weight `/` ≤ current page +10%, `prefers-reduced-motion` all animation off). This is a launch gate, not a per-PR gate. Verification: a launch-readiness review documents each row of the matrix with a measurement and a verdict. Source: `meta/masterplan.md` section 6.1 and section 6.2.

---

### 3.9 Observability

**R-060 (HARD)** — Analytics provider is Matomo. The Matomo tracker runs on every page including `/`. Tracker is configured in cookieless mode at launch (no `_pk_*` cookies set); IPs are anonymized before storage. Matomo's HTTP API may also be hit server-side for first-party event recording where useful. The deployment shape — self-hosted on poukai-inc infrastructure vs. Matomo Cloud (paid SaaS) — is a remaining infrastructure decision tracked at O-011 in section 6; the tool pick is locked. Verification: parse `BaseLayout.astro` for the Matomo tracker tag annotated `// analytics: matomo`; confirm on the preview deploy that no `_pk_*` cookies are set on first paint; confirm Matomo's tracker file gzips to ≤ 30 kB (sub-budget within R-010). Source: `meta/decisions/launch-readiness.md` D-15; [Matomo cookieless tracking documentation] as the configuration reference.

**R-061 (HARD)** — Error reporting tool is Bugsink (Sentry-compatible, self-hostable). The Sentry-protocol browser SDK and server SDK are both active. The client SDK runs on every page including `/`. Server-side ingest scrubs IP addresses and form data before storage. The deployment shape — self-hosted vs. Bugsink Cloud — is a remaining infrastructure decision tracked at O-012 in section 6; the tool pick is locked. The SDK tag in `BaseLayout.astro` is annotated `// error-reporting: bugsink`. Verification: parse `BaseLayout.astro` for the Bugsink SDK tag with the inline justification comment; confirm the SDK file gzips to ≤ 45 kB (sub-budget within R-010); confirm Bugsink ingest config scrubs PII. Source: `meta/decisions/launch-readiness.md` D-16; [Bugsink documentation] and [Sentry browser SDK docs] as the configuration references.

**R-062 (HARD)** — No analytics, observability, or telemetry tool fires before user-visible content has rendered. Matomo and Bugsink load `defer`-ed (R-011) and execute after the meaningful paint; both load from the site's own origin if self-hosted (preferred per O-011 and O-012), or from the vendor's first-party CDN if the cloud deployment shape is chosen. No third-party blocking request on the critical path under any deployment shape. Verification: Lighthouse "render-blocking-resources" audit passes; Network panel diff confirms Matomo and Bugsink fire after `DOMContentLoaded`. Source: `meta/masterplan.md` section 1 (Quality bar implies critical-path discipline); reinforces R-011 and R-023.

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

**R-070 (SOFT)** — Branch naming: `feature/<slug>` for new work, `fix/<slug>` for bugfixes, `chore/<slug>` for tooling. `main` is the long-lived default. Reviewer prefers this convention but does not block on a non-matching name. Verification: reviewer reads the branch name at PR-open time and notes drift as a NIT. Source: `meta/decisions/launch-readiness.md` D-22; reviewer judgment.

**R-071 (HARD)** — No force-push to `main`. No force-push to a branch with an open PR unless the PR author owns the branch and the rebase is non-destructive. Verification: branch protection rules on GitHub. Source: universal git hygiene; matches reviewer agent definition section 9 ("Don't merge, push, deploy, or commit code changes").

**R-072 (SOFT)** — Commit messages follow Conventional Commits form: `type: subject`, where `type` is one of `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`. Subject is imperative mood, ≤ 72 chars; optional body explains *why* not *what*. Reviewer requests changes when commits drift from this form but does not block merge on it. Verification: reviewer reads `git log` during review. Source: `meta/decisions/launch-readiness.md` D-19; reviewer judgment.

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
| Lighthouse | `lighthouse-ci` on preview (Perf ≥ 95, A11y/BP/SEO = 100) | R-013, R-014, R-015, R-023, R-056 |
| Axe-core | `@axe-core/playwright` on preview | R-024–R-033, R-057 |
| Client-JS budget | parse built HTML; sum gzipped third-party JS ≤ 75 kB | R-009, R-010, R-011, R-012, R-078, R-079, R-080 |
| Test coverage | `pnpm test` + coverage report on changed files (≥ 80% when tests exist) | R-058 |
| Security headers | `curl -I` on preview deploy | R-042–R-045 |
| security.txt | `curl /.well-known/security.txt` (SOFT until R-047 lands) | R-081 |
| Dependency audit | `pnpm audit --prod --audit-level=high` | R-049 |
| License check | `pnpm licenses list` (or `license-checker`) | R-064 |
| Lockfile freshness | `pnpm install --frozen-lockfile` | R-066 |
| Content schemas | Build-time Zod validation | R-074, R-075 |
| Secret scan | `gitleaks` or `trufflehog` | R-048 |

**Per-launch verification (one-time, before domain alias swap).** Runs the parity matrix from `meta/masterplan.md` section 6.1 (R-059) plus a manual a11y walk with a screen reader and the 320px real-device check (R-052).

**Per-review verification (reviewer's job).** The reviewer's `meta/reviews/` document cites specific R-NNN identifiers in each finding. A finding without an R-NNN citation (or without an upstream-authority citation when no R-NNN applies) should be re-stated or downgraded.

**Tooling that doesn't exist yet.** Several gates above (Zod content schemas, lighthouse-ci config, axe-core runner, license check) will be added by the engineer in Phase 2 of the masterplan. Until those land, the corresponding requirements are *aspirational* for CI but *enforced manually* by the reviewer reading the diff. The reviewer flags missing automation as a finding rather than waiving the requirement.

---

## 5. Rationale and change log

### 5.1 Rationale — the 2026-05-13 posture shift

The original draft of this document held two related positions: (a) Lighthouse Performance at 100, no exceptions; (b) zero client JS on `/`. Both were means to an end. The end is fast, private, accessible, owned. The 2026-05-13 decision pass (`meta/decisions/launch-readiness.md` D-14 through D-22) changed the means and preserved the end. Three shifts deserve explanation in this document because they're the ones most likely to surprise a future reviewer reading R-009, R-010, or R-013 against the masterplan's older "no JS unless strictly necessary" framing.

**Performance band relaxed from 100 to ≥ 95 (R-013, R-056).** Lighthouse Performance is sensitive to third-party JS payload, even when deferred. Matomo's tracker (~25 kB gzipped) plus Bugsink's browser SDK (~40 kB gzipped) together baseline at ~65 kB of post-paint JS that the audit measures. Holding Performance at exactly 100 with that baseline forces a constant fight against single-run flake without materially improving the user experience. Relaxing the band to ≥ 95 absorbs that baseline honestly while keeping the bar visibly tight. A11y, Best Practices, and SEO stay at 100 because they're deterministic — they measure properties of the markup, not properties of the JS budget — and there's no reason to lower a bar that the JS-budget shift doesn't touch.

**Zero-JS-on-`/` posture shift (R-009, section 3.2 rewrite).** The brand competes by owning its stack. Matomo (analytics) and Bugsink (error reporting) are first-party, self-hostable, privacy-respecting tools chosen explicitly to avoid the alternative — Google Analytics, Sentry SaaS, third-party SDKs that quietly grow the surface area you don't control. Loading them on every page including `/` is the cost of owning the operational telemetry rather than borrowing it. The new R-009 makes that explicit, the new R-010 puts a hard ceiling on what "first-party JS" is allowed to grow into, and the new R-011 enforces that the JS the site does ship doesn't block the meaningful paint.

**Third-party JS ceiling at 75 kB gzipped (R-010).** Matomo + Bugsink together are ~65 kB. The 75 kB ceiling leaves ~10 kB of headroom — enough to absorb minor SDK version bumps, not enough to absorb a third tool without an explicit standards revision. The number is calibrated to force a conversation rather than enable drift. The user-facing performance bars (R-014 Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms; R-015 HTML weight) stay HARD; if the third-party JS budget makes meeting them harder, that's an engineer problem to solve (deferred loading, partial hydration discipline, server-side event recording where the tracker would otherwise fire), not a standards problem to lower.

### 5.2 Change log

| Date | Author | Change |
| --- | --- | --- |
| 2026-05-13 | pouk-ai-reviewer | Initial Draft. R-001 through R-077 published. Status: Draft. |
| 2026-05-13 | pouk-ai-reviewer | Promoted Draft → Approved via `meta/decisions/launch-readiness.md` D-14 through D-22. Rewrote section 3.2 (Zero-JS contract → Client JS budget and discipline); R-009/R-010/R-011/R-012 replaced; old R-010 hydration discipline → R-078, old R-011 DS-SSR rule → R-079. Updated R-013 (Lighthouse Perf ≥ 95, A11y/BP/SEO = 100), R-046 (no CSP on launch), R-056 (lighthouse-ci thresholds), R-058 (test coverage ≥ 80% on changed files when tests exist), R-060 (Matomo locked), R-061 (Bugsink locked), R-062 (defer discipline for first-party tools), R-070 (branch naming SOFT, reviewer-NIT only), R-072 (Conventional Commits SOFT). Added R-080 (no service worker), R-081 (security.txt, SOFT until email lands). Closed O-001 through O-009; left O-010 noted as resolved; added O-011 (Matomo deployment shape) and O-012 (Bugsink deployment shape). |

---

## 6. Open questions

### 6.1 Open

Items still needing resolution. None of these block the standards document from being Approved; both are infrastructure choices downstream of the locked tool picks in D-15 and D-16.

- **O-011 — Matomo deployment shape (R-060).** Self-hosted on poukai-inc infrastructure vs. Matomo Cloud (paid SaaS). Reviewer default: self-hosted matches the brand's "owns the stack" posture and avoids a third-party data-flow on every page load. Cloud is faster to launch and offloads ops. The decision affects R-061 indirectly (if Matomo is cloud-hosted the tracker file is served from a third-party origin and the JS budget rules in R-009/R-010/R-011 still apply but the verification step changes).
- **O-012 — Bugsink deployment shape (R-061).** Self-hosted vs. Bugsink Cloud. Reviewer default: self-hosted, same rationale as O-011. Same caveat about R-009/R-010/R-011 verification under the cloud shape.

A future revision watch-list (not gating approval, just flagged for the reviewer to track):

- If Matomo's cookie mode is enabled in a future configuration change (currently cookieless per D-15 and R-060), R-012 must be tightened with a consent-gate flow before the change ships.
- If a third operational tool (beyond Matomo and Bugsink) is proposed, R-010's 75 kB ceiling will be hit — that's by design and forces a standards revision rather than allowing drift.

### 6.2 Resolved (closed via decisions doc)

All items O-001 through O-009 were resolved on 2026-05-13 via `meta/decisions/launch-readiness.md`. See section 5.1 (Rationale) and 5.2 (Change log) for resolution detail per requirement.

- **O-001 — Lighthouse threshold band.** Resolved by D-14 → R-013, R-056. Performance ≥ 95, A11y/BP/SEO = 100, HARD on every page.
- **O-002 — Analytics provider.** Resolved by D-15 → R-060. Matomo, every page including `/`, cookieless at launch.
- **O-003 — Error reporting tool.** Resolved by D-16 → R-061. Bugsink, client + server SDK, every page including `/`.
- **O-004 — CSP strategy.** Resolved by D-17 → R-046. No CSP on launch; add when a form or non-first-party embed appears.
- **O-005 — Service worker.** Resolved by D-18 → R-080. None registered.
- **O-006 — Conventional Commits.** Resolved by D-19 → R-072. SOFT; reviewer requests changes on drift but does not block.
- **O-007 — Test coverage threshold.** Resolved by D-20 → R-058. ≥ 80% on changed files when tests exist; absence surfaced as NIT.
- **O-008 — `.well-known/security.txt`.** Resolved by D-21 → R-081. SOFT now, HARD once `hello@pouk.ai` is live; task tracked in `meta/backlog.md`.
- **O-009 — Branch naming.** Resolved by D-22 → R-070. SOFT; reviewer prefers convention but does not block.
- **O-010 — PM specs missing.** Resolved 2026-05-13: PM specs for `meta/specs/pages/*.md` and `meta/specs/content/*.md` landed on the same date as this revision. Future review findings deferring to "the governing PM spec" can now cite a real spec file.

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
- `meta/decisions/launch-readiness.md` — D-14 through D-22 (resolved 2026-05-13) drive the section 3.2 rewrite and the R-013/R-046/R-058/R-060/R-061/R-070/R-072/R-080/R-081 changes.
- `.claude/agents/pouk-ai-reviewer.md` — reviewer's own working contract, especially section 5 (universal quality checks) and section 9 (hard "no" list).
- [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116) — `security.txt` format (cited under R-081).
- [W3C WCAG 2.1](https://www.w3.org/TR/WCAG21/) — accessibility upstream specification (cited under R-024, R-025, R-026, R-027, R-028, R-030, R-031, R-032, R-053).
- [web.dev — Web Vitals](https://web.dev/articles/vitals) — Core Web Vitals "Good" thresholds (cited under R-014).
- [OWASP Secure Headers Project](https://owasp.org/www-project-secure-headers/) — security header recommendations (cited under R-042, R-043, R-044).
- [Open Graph Protocol](https://ogp.me/) — OG meta tag specification (cited under R-037).
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — ARIA usage rules (cited under R-032).
- [permissionspolicy.com](https://www.permissionspolicy.com/) — Permissions-Policy syntax reference (cited under R-045).
- [hstspreload.org](https://hstspreload.org/) — HSTS preload requirements (cited under R-042).
- RFC 7208 (SPF), RFC 6376 (DKIM), RFC 7489 (DMARC), RFC 8659 (CAA) — email auth (cited under R-047).
- [W3C CSP Level 3](https://www.w3.org/TR/CSP3/) — Content Security Policy spec (cited under R-046).
