# Composition: Home (`/`)

**Route**: `/`
**Status**: Draft
**Owner**: Arian (founder) · Author: pouk-ai-designer
**Last updated**: 2026-05-16
**Governing spec**: `meta/specs/pages/home.md` (Approved, 2026-05-13)
**Governing content draft**: `meta/content/drafts/pages/home.md` (Status: **Draft** — not yet Approved)
**DS version targeted**: `@poukai-inc/ui@0.6.0`
**Implementation under ratification**: `src/pages/index.astro`, `src/components/HomeHero.tsx`, `src/components/ShellWrapper.tsx`, `src/layouts/BaseLayout.astro`
**Decisions referenced**: D-11 (lede-extension structure), D-12 (status-line byte-identical parity), D-13 (nav funnel order)

> **Pipeline caveat (acknowledged).** The standard pipeline requires both an Approved PM spec *and* an Approved content draft before composition. Here the spec is Approved but the content draft is still `Draft`. Arian has explicitly authorized proceeding with the understanding that content-draft revisions may force composition revisions (R14 lede-length and R26 meta-desc phrasing are the most likely revision triggers). This composition is **retroactive**: the page is already built and live; this document ratifies the current DS-primitive choices and rhythm decisions as the canonical recipe.

---

## 1. Intent

`/` is a **doorway page**, not a destination. The visitor should land, read three short blocks of text — status, tagline, lede — recognise pouk.ai as an operator-grade brand, and either click through to `/why-ai`, click the email link, or leave with the impression that the site is alive and the brand is real. Two of three count as success per spec §3.

The composition's job is to make that pass feel inevitable. Density is **deliberately low**: a single `Hero` block, generous vertical breathing, no secondary sections, no auxiliary affordances competing with the email CTA. The credential is typography — the Instrument Serif tagline (clamp 36–68px) doing the work that a logo-bar or testimonial would do on a lesser page. The `StatusBadge` pulse is the only living element; everything else holds still. Reading time target is under 20 seconds (spec §7). Long reading means the lede failed.

Brand-wise: refinement (§4.3) is the lead voice, direct (§4.1) is the second, restraint is the operating constraint. A future reviewer who looks at this page and thinks "should we add a services block?" — that's the failure mode this composition is designed to refuse.

---

## 2. Section-by-section composition

The IA from spec §4 is three items: (1) `SiteShell` top nav + hairline footer (one organism, two visual surfaces), (2) `Hero` block, (3) end — no further sections. Composition order below mirrors the rendered DOM order.

### Section 2.1 — SiteShell top nav (spec §4 IA item 1, top surface)

- **DS primitive(s)**: `<SiteShell>` (organism) wrapping page content. Site-side adapter is `src/components/ShellWrapper.tsx` (thin React wrapper around `<SiteShell>` that owns site-specific footer JSX so `BaseLayout.astro` passes only scalar props across the .astro→React boundary; pattern documented in the wrapper file).
- **Props (substantive)**:
  ```
  <SiteShell
    currentRoute="/"                        // from index.astro frontmatter, passed via BaseLayout
    routes={[                               // D-13 funnel order, defined once in BaseLayout.astro
      { href: "/why-ai",     label: "Why AI" },
      { href: "/roles",      label: "Roles" },
      { href: "/principles", label: "Principles" },
    ]}
    footer={<p>© {year} pouk.ai · <a href="mailto:hello@pouk.ai">hello@pouk.ai</a></p>}
    navLabel="Primary"                      // DS default; do not override
  />
  ```
  Wordmark is rendered by `<SiteShell>` itself — DS-internal. The site never instantiates `<Wordmark>` directly and never substitutes a string literal for the wordmark (see Brand notes below).
- **Layout / spacing**: `<SiteShell>` owns `--page-pad` for the outer horizontal padding (the only token governing the outer page edge per DS layout rules). Header height: `<Wordmark>` at `height={56}` per ADR-0008 (DS-internal — do not override).
- **Motion**: None at section level. Link hover micro-interactions inside `<SiteShell>` use `--dur-fast` (180ms) with `--easing-link` per DS contract; site does not orchestrate these.
- **Content slot**: Hardcoded in `BaseLayout.astro` (`navRoutes` array, `currentYear`) and in `ShellWrapper.tsx` (footer JSX). No JSON content file.
- **Brand notes**:
  - Funnel order locked by D-13: **Why AI → Roles → Principles**. Alphabetical and commercial-first orderings were rejected (decisions log §5).
  - `currentRoute="/"` is the active state for the home page. Spec §9 lists a `SiteShell` open question (whether `/` is a valid currentRoute or the canonical no-current state). The current implementation passes `"/"` and the page ships fine; if Claude Design later distinguishes a "no-current" mode, revisit.

### Section 2.2 — Hero block (spec §4 IA item 2, spec §5 outcomes A–C)

This is the single content block on the page. All four slots (`status`, `title`, `lede`, `cta`) populated; no other Hero variants in play.

- **DS primitive(s)**: `<Hero>` (molecule) with `<StatusBadge>` (atom) in its `status` slot, prose in `title` and `lede`, `<Button asChild>` wrapping `<a href="mailto:…">` in `cta`. Site-side adapter is `src/components/HomeHero.tsx` (thin React wrapper that assembles the JSX slots so `index.astro` passes nothing across the boundary; same .astro→React pattern as `ShellWrapper.tsx`).
- **Props (substantive)**:
  ```
  <Hero
    status={
      <StatusBadge status="available">
        Currently taking conversations for Q3.
      </StatusBadge>
    }
    title={<>Technical consulting for teams shipping with <em>AI</em>.</>}
    lede={<>
      pouk.ai builds custom AI systems, automations, and advisory
      engagements for operators who'd rather ship than speculate.
      Named for Pouākai — the largest eagle that ever flew,
      hunting by stooping from height.{" "}
      Most AI projects fail to deliver.{" "}
      <a href="/why-ai">Here's why →</a>
    </>}
    cta={<Button asChild><a href="mailto:hello@pouk.ai">hello@pouk.ai</a></Button>}
  />
  ```
  Notes on each slot:
  - **`status`**: `<StatusBadge status="available">`. The `available` value automatically triggers the DS pulse animation — do **not** add a second animation, do **not** force-animate via JS or inline styles. Child copy locked by D-12 to "Currently taking conversations for Q3." Byte-identical to pre-cutover `index.html`. See §7 finding R15 for the explicit lock rationale (the DS canonical voice example "Taking conversations for Q3." is **not** the canonical here — D-12 wins).
  - **`title`**: Verbatim tagline. The `<em>AI</em>` is the typographic credential — Instrument Serif italic on a two-letter token. The DS Hero `title` rule is silent on inline `<em>`; the italic ships as-is.
  - **`lede`**: Currently **4 sentences** (positioning, Pouākai origin, gap, hand-off). DS Hero `lede` rule is `1-3 sentences at most`. See §7 finding R14 — recommendation is to **trim to 3 sentences** (drop the Pouākai sentence). Until Arian rules, the lede ships at 4 and the composition flags the deviation rather than papering over it.
  - **`cta`**: `<Button asChild>` wrapping a plain `<a>` is the DS-mandated pattern for link-styled buttons (DS contract: "Use asChild with an <a> element… Do NOT nest a `<button>` inside Button with asChild"). The label is the email address itself — see §7 finding R-Button below.
- **Layout / spacing**:
  - Hero text column constrained by `--hero-max` (608px) — DS-internal; do not override.
  - Within the Hero block the DS molecule owns its own vertical rhythm: `--space-6` (24px) status→title, `--space-8` (32px) title→lede. See §3 for the cross-section rhythm.
  - Outer page padding inherited from `<SiteShell>` (`--page-pad`).
- **Motion**:
  - **Entrance**: none orchestrated by the site. The DS molecule may apply an entrance animation using `--dur-slow` (600ms) with `--easing` (expo-out); if so, it's CSS-only and reduced-motion-gated. The site does **not** add a JS-driven reveal, does **not** add a scroll-triggered animation, and does **not** add `client:visible` to force hydration for a fade-in.
  - **`StatusBadge` pulse**: DS-internal, CSS-only, automatic for `status="available"`. Gated by `prefers-reduced-motion: reduce` via the DS `:root !important` block in `tokens.css`. The site does not interact with this animation.
  - **Link underline-on-hover** (Hero's inline `Here's why →` and CTA hover): DS-internal, uses `--easing-link` over `--dur-fast`.
- **Content slot**: Hardcoded prose in `HomeHero.tsx`. Per spec §6, no JSON file backs `/`. If post-launch the homepage starts pulling featured content from JSON, promote then.
- **Brand notes**:
  - Maximum 1 `<StatusBadge>` per page (DS contract). This is it; no second instance permitted anywhere on `/`.
  - Maximum 1 `<Hero>` per page; no nesting (DS contract). This composition uses exactly one; the rest of the route is the SiteShell.
  - The email CTA is `<Button>` default variant — **not** `variant="primary"`. The page's affordance hierarchy is: tagline (read first) → lede with embedded `Here's why →` link → email CTA → SiteShell footer email. Reserving `variant="primary"` would over-shout. (DS contract: "Maximum one variant="primary" per visual section" — this section has zero, which is also valid.)

### Section 2.3 — SiteShell hairline footer (spec §4 IA item 1, bottom surface)

- **DS primitive(s)**: `<SiteShell>` `footer` prop (rendered as the page's hairline footer). Same organism as §2.1; the footer is one of its slots, not a separate primitive.
- **Props (substantive)**: footer JSX assembled in `ShellWrapper.tsx`:
  ```
  footer={
    <p>
      © {year} pouk.ai · <a href="mailto:hello@pouk.ai">hello@pouk.ai</a>
    </p>
  }
  ```
  `{year}` is `new Date().getFullYear()` at build time (Astro pre-renders to static HTML). The middle dot is `·` (U+00B7) with single spaces.
- **Layout / spacing**: DS-internal. The footer sits below the page's main content with `<SiteShell>`'s own bottom rhythm. The Hero's CTA is the last content above the footer; spacing between Hero block and footer is owned by `<SiteShell>` and the Hero molecule together — site does not orchestrate. (`--space-24` / 96px main content bottom padding is the DS reference; the site does not set this.)
- **Motion**: None.
- **Content slot**: Hardcoded in `ShellWrapper.tsx`.
- **Brand notes**:
  - **Email-CTA duplication is deliberate.** `hello@pouk.ai` appears twice — once in the Hero CTA (§2.2), once in the footer here. This is the doorway-page convention: the Hero CTA is the conversion affordance; the footer email is the "found by scroll" backstop for a returning visitor who scanned past the Hero. See §7 finding R13. **A future "deduplication" refactor must not drop either instance.**

### Section 2.4 — End

Spec §4 IA item 3: end — no further sections. No about block, no services block, no testimonial, no logo bar, no featured-content carousel. The hairline footer closes the page. This composition explicitly forbids adding sections; a request to add one is a brand-violation escalation per spec §10.

---

## 3. Cross-section rhythm

The page is short enough that the cross-section rhythm is dominated by DS-internal tokens. Recipe-level rhythm decisions:

- **Outer page padding** (left/right gutters on `<SiteShell>` header, footer, and main column): `--page-pad` — `clamp(1.5rem, 2vw + 1rem, 3rem)`. DS owns this; site never overrides.
- **`<SiteShell>` top nav → main content top**: DS-internal. The shell sets its own `--space-12` / 48px main content top per DS reference; site does not set.
- **Inside the Hero molecule** (slot-to-slot rhythm — DS-owned but documented here for the recipe's clarity):
  - status → title: `--space-6` (24px).
  - title → lede: `--space-8` (32px).
  - lede → cta: DS-owned rhythm. The site does not specify the gap; the molecule's own composition handles it.
- **Hero (cta) → SiteShell footer hairline**: DS-internal. The molecule sits above the shell's footer with the shell's bottom padding (`--space-24` / 96px reference) doing the work. Site does not set.
- **Across the whole page**: the DS publishes a 4px-base spacing scale (`--space-1` through `--space-32`) with documented gaps (no `--space-5`, no `--space-7`). The site uses only published values, never raw pixels.

No site-side CSS adds vertical rhythm to this page. If the visual reads correctly today, it's because the DS molecules and the organism compose into the right rhythm by themselves — that's the contract.

---

## 4. Motion choreography (page-level)

The page's choreography is **almost nothing**, by design.

- **Initial render**: no JS-driven entrance. The page renders as static HTML from Astro's build. Any entrance animation on `<Hero>` is DS-internal (CSS keyframes on the molecule's root, fired by `:root` paint timing), uses `--dur-slow` (600ms) with `--easing` (`cubic-bezier(0.16, 1, 0.3, 1)`, expo-out), and is reduced-motion-gated by the DS `:root !important` block in `tokens.css`.
- **`StatusBadge` pulse**: continuous, CSS keyframes on the dot, fired automatically by `status="available"`. Reduced-motion-gated by the same `:root !important` block. The site does not override, augment, or restart this animation.
- **Link underline-on-hover** (inline lede link `Here's why →`, footer email link, nav links): DS-owned. `--dur-fast` (180ms) with `--easing-link` (`cubic-bezier(0.2, 0, 0, 1)`).
- **CTA hover** (the email button): DS-owned. Default `<Button>` variant micro-interaction; `--dur-fast` with the DS button easing.
- **Scroll-triggered**: none. No section has an `IntersectionObserver`-driven reveal. The page is short enough to fit in a viewport on most screens; there's no second viewport to reveal.
- **`prefers-reduced-motion`**: honored at the CSS layer by the DS's `:root !important` block. **The site does not work around it.** No `prefers-reduced-motion: no-preference` overrides; no `aria-hidden` hacks to keep an animation alive under reduce; no JS-side detection that re-enables a disabled animation. R21 (recipe gap) is closed by this section.

The choreography earns zero hydration cost. No `client:*` directives on any component (R30 — see §7).

---

## 5. Icon picks

`/` is the only route that does **not** use Lucide glyphs. The page has one quasi-icon surface: the typographic right-arrow `→` in the lede's inline hand-off link.

- **`Here's why →`** (lede sentence 4, link to `/why-ai`): the arrow is the literal `→` (U+2192, RIGHTWARDS ARROW), currently rendered via the HTML entity `&rarr;` in `HomeHero.tsx`. **This is a composition-deliberate choice, not an oversight.**

  **Defense.** Inside an inline prose sentence ending in a typographic dash (`—`) and curly quotes, a Unicode arrow continues the editorial register. A Lucide `ArrowRight` SVG glyph would (a) drop a non-prose object into a prose sentence, (b) require sizing and vertical-alignment tuning that the DS doesn't currently publish a contract for, and (c) read as "UI affordance" where the surrounding text reads as "editorial." The arrow here is part of the *sentence*, not part of the *button*. It's typesetting, not iconography.

  **Lock.** Future refactors **must not** substitute `<ArrowRight />` here. If a future audit flags the entity-arrow as inconsistent with site-wide icon usage, the resolution is to keep this one and confirm sitewide that Lucide is used for *icon surfaces* (RoleCard glyph wells, FailureMode index marks, nav chevrons if any) and Unicode is used for *typesetting marks inside prose* (em dashes, ellipses, arrows-in-sentences). R12 is resolved by this lock.

- **`<StatusBadge>` dot**: not a Lucide glyph — DS-owned SVG/CSS circle with the pulse animation. Not composed by the site.

- **`<Wordmark>` isotype**: not a Lucide glyph — DS-owned SVG (the feather). Geometry locked by ADR-0011. Not composed by the site.

No Lucide glyphs are used on `/`.

---

## 6. DS-gap proposals

Two candidate proposals surfaced by composing this page. **None filed yet.** Listed for Arian to triage; do not create proposal files until Arian routes one.

1. **Candidate: `Hero.lede` cap relaxation for single-Hero doorway pages.**
   - **Need**: A documented exception to the `lede: 1-3 sentences at most` rule for pages whose entire IA is a single `<Hero>` block — i.e., where the Hero carries the page's full burden of origin, positioning, gap, and hand-off. The doorway-page case.
   - **Where it appears**: §2.2 lede slot. Currently 4 sentences against a 1–3 cap.
   - **Workaround until filed**: keep the 4-sentence lede; flag in §7 R14; revisit if Arian decides to trim instead. If Arian picks "trim to 3" (recommendation), this proposal is moot.
   - **Proposal shape if filed**: argue the narrow exception ("Hero.lede: 1-3 sentences, except where the page is composed of exactly one Hero and the lede carries an origin note plus a hand-off, in which case up to 4"). Cost is non-trivial for the DS (rule complexity); the trim is cheaper. Author leans against filing.

2. **Candidate: `Button` label format clarification for identifier-as-affordance.**
   - **Need**: An explicit DS note that an identifier (e.g., an email address, a phone number, a username) is permissible as a `Button` label even though it isn't sentence-case prose. Today the DS rule is `sentence-case, never ALL CAPS, max 4 words`; "hello@pouk.ai" is one token, lowercase, technically not sentence-case.
   - **Where it appears**: §2.2 cta slot. The label is the affordance.
   - **Workaround until filed**: the existing label ships under spirit-of-rule reading (no marketing-speak, no shouting). The content draft §6 makes the same call. No urgency.
   - **Proposal shape if filed**: a one-line addition to the Button rule ("Identifier labels — email addresses, phone numbers, usernames — are permitted as-is; the sentence-case rule applies to prose labels"). Low cost on the DS; mostly documentation. Author leans neutral.

If Arian wants either of these filed as a formal `meta/proposals/<slug>.md`, say so and the proposal gets drafted in the next pass.

---

## 7. Composition-fit findings resolved

This composition closes the following findings from `meta/backlog.md` "Review: / (2026-05-15)":

- **R12 — Lede arrow choice.** Resolved in §5: the typographic `→` (Unicode U+2192) is the deliberate choice. Locked. Future refactors must not substitute Lucide `ArrowRight`. Defense: the arrow lives inside an inline prose sentence; it's typesetting, not iconography.
- **R13 — Email CTA duplication (Hero + footer).** Resolved in §2.3 brand notes: the duplication is the doorway-page convention. Hero CTA is the conversion affordance; footer email is the scan-past backstop. A future deduplication refactor must drop neither.
- **R14 — Lede sentence count exceeds DS cap.** **Surfaced, not resolved.** §2.2 ships the 4-sentence lede with the deviation flagged; §6 lists the candidate proposal; §8 contains the open question. Author's recommendation aligns with the content draft author's recommendation: **trim to 3 sentences** (drop the Pouākai origin). If Arian picks trim, the canonical lede becomes the 3-sentence Sharpest variant in `meta/content/drafts/pages/home.md` §5. If Arian picks keep, file the §6 candidate proposal with Claude Design.
- **R15 — Status-line copy diverges from DS canonical voice example.** Resolved in §2.2: the D-12 byte-identical lock wins. The DS file's example "Taking conversations for Q3." is illustrative; the site's "Currently taking conversations for Q3." is locked by D-12 and the spec §8 acceptance criterion. The composition explicitly forbids normalizing toward the DS example. R15 lock recorded.
- **R21 — No recipe documents vertical rhythm or motion choreography.** Resolved by §3 (spacing rhythm by token) and §4 (page-level motion choreography). Every adjacent block has its rhythm named; every animation has its `--dur-*` + `--easing*` and its reduced-motion gate confirmed.
- **R28 — IA order matches spec §4.** Resolved in §2: section order is SiteShell nav → Hero (status, title, lede, CTA) → SiteShell footer → end. Matches spec §4 IA items 1–3. Recorded.
- **R29 — Wordmark "never a string literal in JSX" rule not explicit.** Resolved in §2.1 brand notes: the wordmark is rendered by `<SiteShell>` (which delegates to the DS `<Wordmark>`). The site never instantiates `<Wordmark>` directly and never substitutes a string literal for the wordmark in any JSX surface (header, footer, og copy, alt text). The single wordmark surface on `/` is the SiteShell header.
- **R30 — No `client:*` directives.** Resolved in §4 and confirmed by reading `src/pages/index.astro`, `src/components/HomeHero.tsx`, and `src/components/ShellWrapper.tsx`: neither React component receives a hydration directive in `index.astro`. Both render as static HTML at build time. CSS-only motion via DS tokens. Zero-JS choreography is the explicit, ratified decision.

---

## 8. Open questions for Arian

1. **R14 — Hero lede sentence count.** Pick one (mirrors content draft §7 Q1):
   - (a) **Ratify 4 sentences** as a deliberate doorway-page exception. File §6 candidate proposal 1 with Claude Design.
   - (b) **Approve the 3-sentence trim** — drop the Pouākai origin sentence. Engineer updates `HomeHero.tsx` lede slot to the Sharpest variant in content draft §5.
   - (c) **Defer.** Keep current copy live; note in `meta/journal.md` that `/` ships outside the DS cap pending a revision pass.

   **Composer's recommendation**: (b). The Pouākai sentence is the loveliest line on the page, but it's a brand-page grace note, not load-bearing for the doorway-page job; its better home is a future `/about`. Trim respects the DS contract without losing voice.

2. **`SiteShell` currentRoute on `/`.** Spec §9 lists this as a dependency: confirm with Claude Design whether `currentRoute="/"` is a valid current state or the canonical no-current state. Current implementation passes `"/"` and ships fine. **Composer's recommendation**: defer — revisit only if Claude Design publishes a `no-current` mode and the visual on `/` improves with it. No action needed today.

3. **DS-gap proposal 1 (`Hero.lede` doorway exception)** — file or not? Only relevant if Q1 resolves to (a). **Composer's recommendation**: do not file unless Q1 → (a).

4. **DS-gap proposal 2 (`Button` identifier-label clarification)** — file or not? **Composer's recommendation**: defer. Low urgency; the spirit-of-rule reading is fine for now. File only if a future review escalates the label format.

---

## 9. Out of scope

This composition deliberately does not cover:

- The `/why-ai`, `/roles`, `/principles` page compositions. They get their own recipes once their content drafts approach Approved. The hand-off link in `/`'s lede mentions `/why-ai` only as a destination; the destination page is its own composition.
- The internals of `<Hero>`, `<StatusBadge>`, `<Button>`, `<SiteShell>`, `<Wordmark>` — DS-owned by Claude Design. This composition treats them as black boxes with documented contracts.
- The Astro template implementation (`index.astro`, `BaseLayout.astro`) — engineer's lane. This recipe describes what the page composes from; the engineer wires it.
- The OG image (`og.png`), favicon, `apple-touch-icon.png`, `robots.txt`, `sitemap.xml`, JSON-LD payload — visual/SEO surfaces, not composition. Tracked as launch blockers in `meta/backlog.md`.
- Meta-desc canonical phrasing (R26 in the content draft). Copy decision, not composition; surfaces in the content draft §7 Q2 and resolves there.
- Page-level performance budgets, Lighthouse thresholds, CSP, analytics, error reporting — reviewer/engineer lanes. The composition respects R-009 (zero-JS contract on `/`) by §4 and §7 R30; it does not redefine the standard.
- Future iterations: featured stat, embedded quote, thumbnail of `/why-ai`, customer logo bar. Spec §10 forbids; composition reinforces. Adding sections is a brand regression, not a feature improvement.
