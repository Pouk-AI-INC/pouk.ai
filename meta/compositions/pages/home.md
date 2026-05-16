# Composition: Home

**Route**: `/`
**Status**: Approved
**Owner**: Arian (founder) · Author: pouk-ai-designer
**Last updated**: 2026-05-16
**Governing spec**: `meta/specs/pages/home.md` (section 4 IA)
**DS version targeted**: `@poukai-inc/ui@0.6.1`
**Ratifies**: shipped implementation in `src/pages/index.astro`, `src/components/HomeHero.tsx`, `src/components/ShellWrapper.tsx`, `src/layouts/BaseLayout.astro` as of 2026-05-16.

---

## 0. Preamble — why this composition exists after-the-fact

`/` was built directly from `meta/specs/pages/home.md` and the D-11 / D-12 launch-readiness decisions without passing through the Designer stage. The `/review-page home` audit on 2026-05-15 flagged the missing recipe (backlog R03, R04) and a cluster of related ratification gaps (R12, R13, R15, R21, R28, R29, R30). This document is the canonical recipe; it does not propose a redesign. Every choice below ratifies what currently ships, and is the gate any future change to the homepage Hero's internal rhythm, status-line wording, lede-extension treatment, or motion behavior must land against.

**Assumptions** (carried over from the shipped implementation and the closed decisions):

- The page is a doorway, not a destination. Restraint is the credential.
- D-11 and D-12 (closed 2026-05-13) are binding. The status-line text and the integrated lede-extension hand-off shape are not up for re-negotiation here; only their composition-layer expression is.
- The `<Hero>` molecule from `@poukai-inc/ui@0.6.1` owns the internal vertical rhythm between its `status`, `title`, `lede`, and `cta` slots. The site does not re-tune that rhythm; if a future audit shows a problem, it is a DS proposal, not a site-side override.
- The page ships with zero hydration directives — static HTML only (R-079, masterplan §4.3). Matomo and Bugsink are first-party deferred scripts owned by `BaseLayout.astro`, not by this page composition.

---

## 1. Intent

`/` should feel like opening a well-set table before the meal. The reader's eye lands on one tagline rendered in Instrument Serif at the page's display scale, registers the available-status dot pulsing quietly above it, scans a three-sentence lede whose last clause is a hand-off, and either follows the hand-off or starts a conversation — both paths converge on `pouk.ai` being a present, available operator. Density is deliberately low: a single Hero block, generous breathing room above and below, a hairline footer line. The brand earns trust by *not* doing more. If the visitor scrolls past the Hero, they hit the SiteShell footer — that's the page's full length. Any urge to add a section is a brand violation, not a feature.

---

## 2. Section-by-section composition

The spec's §4 IA lists three blocks: `SiteShell` chrome (header + hairline footer), the `Hero` block, and the explicit "end — no further sections" terminator. The composition mirrors this exactly.

### Section 1 — `SiteShell` (page chrome)

- **DS primitive(s)**: `<SiteShell>` (organism) from `@poukai-inc/ui`. Wrapped in the site repo by `ShellWrapper.tsx` *only* because passing JSX as a prop from an `.astro` file across the React boundary breaks esbuild's TypeScript parse of the `.astro` template (see `ShellWrapper.tsx` header comment). `ShellWrapper.tsx` adds zero visual structure — it is a substance carrier, not a composition layer. The DS contract still flows directly: `currentRoute`, `routes[]`, `footer` slot.
- **Props (substantive)**:
  ```
  <SiteShell
    currentRoute="/"
    routes={[
      { href: "/why-ai",     label: "Why AI" },
      { href: "/roles",      label: "Roles" },
      { href: "/principles", label: "Principles" },
    ]}                                        // funnel order per D-13
    footer={<p>© <year> pouk.ai · <a href="mailto:hello@pouk.ai">hello@pouk.ai</a></p>}
  >
    {/* Hero block — Section 2 below */}
  </SiteShell>
  ```
- **Layout / spacing**: `<SiteShell>` owns its own header/footer chrome internally. The DS handles `--page-pad` on the outer edge, the wordmark height (`56` per ADR-0008), and the nav gap (`--space-6` per DS internal). The site repo does not override any `<SiteShell>` token. The page-content wrapper between header and footer is `.site-page` in `site.css`, which applies `max-width: var(--content-max)` (64rem) and `padding-block: var(--space-16)` (64px top and bottom).
- **Motion**: None at the SiteShell level. Wordmark and nav links are static. Link hover uses the DS's `--easing-link` internally; no site-side override.
- **Content slot**: Nav route list is hardcoded in `BaseLayout.astro` (`navRoutes` const). The footer line is hardcoded in `ShellWrapper.tsx`. Neither is JSON-driven; both are site substance that the spec authorizes.
- **Brand notes**:
  - The wordmark in the nav is **always rendered by `<SiteShell>` via `<Wordmark>`**, never a string literal. The site does not author or import a replica `<Wordmark>` anywhere. Closes R29.
  - The footer carries the email link verbatim (`mailto:hello@pouk.ai`). This is the **second** appearance of the email on the page (the first is the Hero CTA — see Section 2). This duplication is deliberate. See §3 for the rationale. Closes R13.
  - `<SiteShell>` is rendered as static HTML at build time. No `client:*` directive. Closes R30 (partial — see Section 2).

### Section 2 — `Hero` (the doorway)

- **DS primitive(s)**: `<Hero>` (molecule), with three DS atoms slotted into it:
  - `<StatusBadge>` in the `status` slot.
  - A plain `<Button asChild><a>…</a></Button>` (DS atom `<Button>`) in the `cta` slot.
  - An inline `<a>` (not a DS primitive — plain HTML anchor) embedded in the `lede` prose as the D-11 hand-off. See "Brand notes" for why this is correct.
  Wrapped in the site repo by `HomeHero.tsx` for the same React-boundary reason as `ShellWrapper.tsx`. `HomeHero.tsx` adds zero shape — it assembles substance into DS slots.
- **Props (substantive)**:
  ```
  <Hero
    status={
      <StatusBadge status="available">
        Currently taking conversations for Q3.
      </StatusBadge>
    }
    title={<>Technical consulting for teams shipping with <em>AI</em>.</>}
    lede={
      <>
        pouk.ai builds custom AI systems, automations, and advisory
        engagements for operators who'd rather ship than speculate.
        Named for Pouākai — the largest eagle that ever flew, hunting
        by stooping from height. Most AI projects fail to deliver.{" "}
        <a href="/why-ai">Here's why →</a>
      </>
    }
    cta={
      <Button asChild>
        <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
      </Button>
    }
    // align prop: NOT set — DS default. Spec §4 implies a centered-doorway
    // posture, but the shipped page leaves alignment to the DS default and
    // visual-parity passed against pre-cutover index.html. Do not add align="center"
    // unless re-validating against the parity matrix.
  />
  ```
- **Layout / spacing**:
  - Internal Hero rhythm — `status → title → lede → cta` — is **owned by `<Hero>` in the DS**. The DS uses `--space-6` (24px, "Hero status-to-title") between status and title, and `--space-8` (32px, "Hero title-to-lede") between title and lede. CTA spacing is DS-internal. The site does not introduce, override, or compensate for any of these. Closes R21 (the rhythm is named here so a future engineer reading the DS docs can verify and so a future audit has a documented reference point).
  - Hero text column width is capped at `--hero-max` (38rem / 608px) by the DS. The site does not widen it.
  - The vertical space between the Hero block and the SiteShell footer is governed by `.site-page { padding-block: var(--space-16); }` in `site.css` — 64px top *and* 64px bottom of the content area. This is a page-level composition decision (not a DS internal), and it is consistent with every other route on the site. Closes R21 page-level rhythm.
- **Motion**:
  - `<StatusBadge status="available">` triggers an automatic CSS keyframe pulse. **No JS, no `client:*` directive, no inline animation override.** The DS's `:root !important` block in `tokens.css` disables the pulse under `prefers-reduced-motion: reduce`. This composition forbids any site-side animation on top of the badge or on the Hero block. Confirms spec §8 AC ("`StatusBadge` renders with the pulse animation (CSS keyframes, no JS)" and "`prefers-reduced-motion` honored").
  - No entrance animation on the Hero. No intersection-triggered reveal. The page is short enough that the Hero is above the fold on every viewport — an entrance animation would be a JS hydration cost with no payoff against the spec's success criteria.
  - Link hover (the lede-extension `<a>` and the email anchor inside the `<Button>`) uses the DS's `--easing-link` and `--dur-fast` via `<Hero>`-internal and `<Button>`-internal styling. No site-side override.
- **Content slot**: Homepage prose is **hardcoded in `HomeHero.tsx`**, not driven by a JSON file. Per spec §6 ("The homepage is hardcoded prose in the page template — no JSON file"). The tagline, lede, status-line text, and CTA target are all source-of-truth in `HomeHero.tsx`. Treat that file as the home-content surface for any future copy edit.
- **Brand notes**:
  - **Status-line text is locked at `"Currently taking conversations for Q3."`** — verbatim from the pre-cutover `public/index.html` per D-12 (parity AC, byte-identical at cutover). The DS's `llms-full.txt` voice example reads `"Taking conversations for Q3."` (without "Currently"); **the engineer's rendered string is the authoritative one on this page**. A future engineer reading the DS docs MUST NOT normalize toward the DS example. D-12 supersedes the DS voice example for this specific surface. Closes R15.
  - **Lede-extension hand-off renders as `Here's why →` with the literal `→` HTML entity (`&rarr;`)**, not a Lucide `ArrowRight` icon. Ratified as the editorial choice. Rationale: the entity arrow inherits body-font metrics (Geist, `--fs-body` clamp 17–19px) and reads as part of the prose — which is exactly what D-11 demanded ("a single integrated link sentence at the end of the lede, not a tertiary line under the CTA"). A Lucide `ArrowRight` would import as an SVG with a fixed pixel size, introduce a vertical-align fiddle, and visually separate the glyph from the anchor text — re-introducing the "tertiary affordance" feel D-11 explicitly rejected. The trade-off: the entity does not auto-color-invert if we ever ship dark mode, and it cannot animate on hover. Neither trade-off matters at this brand stage; both are revisitable. Closes R12.
  - **Email link appears twice on the page**: once as the Hero CTA `<Button asChild><a href="mailto:hello@pouk.ai">hello@pouk.ai</a></Button>`, and once as the SiteShell footer line `<a href="mailto:hello@pouk.ai">hello@pouk.ai</a>`. The DS rules do not forbid this. It is **deliberate**: the Hero CTA is the conversion path (a button-shaped affordance below the lede); the footer line is the chrome-level signal that the site is reachable on every route. Removing either would change behavior the spec authorizes — the Hero CTA serves spec §5 outcome ("email link must remain the primary conversion path"); the footer line is part of `<SiteShell>`'s standing chrome and appears identically on `/why-ai`, `/roles`, `/principles`. **A future deduplication refactor MUST NOT collapse these two surfaces.** Closes R13.
  - The `<em>AI</em>` inside the title is preserved verbatim from the pre-cutover `index.html`. Instrument Serif italic on the word "AI" is a tactile editorial accent the DS's `<Hero>` title slot renders correctly because `title` accepts `ReactNode`. Do not strip the `<em>`.
  - The Hero is **the only `<Hero>` on the page** (DS rule: "One per page. Do NOT nest Hero inside another Hero.") and the `<StatusBadge>` is **the only StatusBadge on the page** (DS rule: max 1 per page). Both confirmed.
  - The Hero CTA is **the only Button on the page**. Default variant (no `variant="primary"` set). One CTA, one conversion path.
  - **No hydration**: `<HomeHero>` and `<ShellWrapper>` both render as static HTML at build time. No `client:load`, `client:idle`, `client:visible`, or `client:only` directive. The page ships zero React runtime. Closes R30.

### Section 3 — End (no further sections)

- **DS primitive(s)**: None. The page ends. The `<SiteShell>` hairline footer (already specified in Section 1) closes the page.
- **Props (substantive)**: None.
- **Layout / spacing**: `.site-page` provides `--space-16` of padding below the Hero before the `<SiteShell>` footer's own internal padding takes over. No additional spacer element.
- **Motion**: None.
- **Content slot**: None.
- **Brand notes**:
  - **No additional sections.** No "About," no "Services," no "Customers," no testimonial block, no logo bar, no newsletter signup, no scheduling embed, no featured-content carousel. Spec §10 explicitly enumerates these as out of scope and frames adding them as "a brand violation, not a feature improvement." This composition ratifies that and locks it: any future PR adding a section to `/` is a spec-level conversation, not a composition revision. Closes R28 (IA order matches spec; no drift).

---

## 3. Cross-section rhythm

The vertical rhythm of `/` as a whole, top to bottom:

1. `<SiteShell>` header — DS-owned internal padding via `--page-pad` (clamp 1.5rem–3rem horizontal), Wordmark height 56px (ADR-0008), nav inline.
2. `.site-page` content area — `padding-block: var(--space-16)` (64px top, 64px bottom). Single child: `<HomeHero />`.
3. `<Hero>` internal rhythm — DS-owned: status → `--space-6` → title → `--space-8` → lede → DS-internal → CTA.
4. `.site-page` bottom padding — `--space-16`.
5. `<SiteShell>` hairline footer — DS-owned internal padding, single `<p>` line.

There is exactly one section break (Hero → footer), and it is handled by the page-content padding, not by any decorative rule, divider, or section element. The page reads as one continuous block, which is the intent. No alternating surfaces. No accent strips. The `--surface` / `--bg` / `--bg-elevated` rhythm is irrelevant on `/` — the entire page sits on `--bg` (`#FBFBFD`), and no recessed or elevated surfaces are introduced.

Token compliance: every spacing value above resolves to a DS `--space-N` token. No raw pixels. No `--space-5` / `--space-7` / etc. (those gaps do not exist per the DS tokens.css). The page would fail an audit if a future change introduced one.

---

## 4. Motion choreography (page-level)

The page ships zero JavaScript and one CSS-only animation:

- **`<StatusBadge status="available">` pulse** — DS-owned, runs on initial render, indefinite. Disabled under `prefers-reduced-motion: reduce` via the DS's `:root !important` block in `tokens.css`. No site-side override. No JS trigger. No way for a hydration directive to influence it.
- **Link hover transitions** — DS-owned, run on `:hover` / `:focus-visible`. Uses `--dur-fast` (180ms) and `--easing-link`. Applies to (a) nav links in `<SiteShell>`, (b) the lede-extension `<a href="/why-ai">`, (c) the Hero CTA's `<Button asChild><a>` underline, (d) the footer email link. All four are DS-internal styles; the site does not author transitions. Disabled under `prefers-reduced-motion: reduce`.

**Fires on scroll**: nothing. There is no scroll-triggered reveal, no intersection observer, no parallax, no scroll-spy. The page is short enough that all content is above the fold on a typical desktop and barely below on mobile — a scroll-triggered animation has no payoff and would force `client:visible`, breaking R-079.

**Fires on initial render**: the StatusBadge pulse (CSS keyframes, JS-free).

**Fires never (locked out by this composition)**: Hero entrance animation, stagger between status/title/lede/CTA, fade-in on the wordmark, marquee on the status line, any animation tied to `IntersectionObserver`. All of these would require a `client:*` directive and would violate the spec's "zero client-side JS shipped on `/`" AC (spec §8) and masterplan §4.3.

**`prefers-reduced-motion: reduce` behavior**: every animation on the page (the badge pulse and every link transition) is disabled by the DS's `:root !important` block in `tokens.css`. There is no exception. The composition does not need to instruct the engineer to add a `@media (prefers-reduced-motion)` rule — the DS handles it at the token layer. Closes the R21 motion-choreography concern.

---

## 5. Icon picks (if applicable)

None. The homepage uses no Lucide glyphs. The only glyph on the page is the literal `→` HTML entity inside the lede-extension hand-off, which is a typographic character (rendered by the body font), not a Lucide icon. See Section 2 brand notes for why this is the right choice.

---

## 6. DS gaps surfaced

None. `<Hero>`, `<StatusBadge>`, `<Button>`, `<SiteShell>`, and `<Wordmark>` (rendered inside `<SiteShell>`) all exist in `@poukai-inc/ui@0.6.1` and the composition uses them inside their documented contracts. No DS-gap proposal is filed against this composition.

---

## 7. Open questions for Arian

None. This composition ratifies shipped behavior. Every choice traces to either:

- A spec §8 acceptance criterion (status-line text, lede-extension shape, single Hero block, no further sections, zero client-side JS, `prefers-reduced-motion` honored, email CTA as the conversion path), or
- A closed launch-readiness decision (D-11 integrated lede-extension hand-off; D-12 status-line byte-identical carry-over; D-13 funnel nav order), or
- A DS rule from `meta/ds-snapshot/llms-full.txt` (one StatusBadge per page; one Hero per page; `--space-N` tokens only; motion gating via `:root !important`).

Section 7 closed at authorship time per Arian's direction to ratify the shipped implementation.

---

## 8. Out of scope

This composition deliberately does not cover:

- **Future homepage evolution.** If `/` ever needs a featured stat, a customer story, or a sub-page hand-off beyond `/why-ai`, that is a new spec, new content, new composition — not an amendment here.
- **Dark-mode behavior.** The DS palette inverts cleanly per its "never pure edges" principle, but dark mode is not shipped. If/when it ships, the lede-extension `→` glyph's color-inversion behavior is a known trade-off (see Section 2 brand notes) that may need revisiting.
- **OG image, favicon, apple-touch-icon, robots.txt, sitemap.xml.** These are launch-infrastructure surfaces owned by `BaseLayout.astro` and the site's `public/` directory. Not composition concerns.
- **Matomo and Bugsink script tags.** Owned by `BaseLayout.astro` and gated on env vars. They are first-party analytics/error-reporting per D-15/D-16 and are *not* page-level composition decisions — they apply uniformly to every route.
- **Visual parity diff against pre-cutover `index.html`.** That is the engineer's cutover-checklist gate (masterplan §6.1), not a composition output. This composition assumes parity already passed.
- **`/why-ai`, `/roles`, `/principles` compositions.** Each is its own document. The funnel-order nav decision (D-13) is referenced here only because `<SiteShell>` carries it on every page; the per-page recipes belong in their own files.
