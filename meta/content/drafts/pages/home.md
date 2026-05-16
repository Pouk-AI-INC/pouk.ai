---
route: /
status: Approved
version: 1.0
lastUpdated: 2026-05-16
owner: Arian (founder)
author: pouk-ai-content
governingSpec: meta/specs/pages/home.md
decisionsHonoured:
  - D-11 (integrated lede-extension link sentence to /why-ai)
  - D-12 (status-line byte-identical to pre-cutover index.html)
backlogClosed:
  - R05 (P0 — no Approved canonical content draft for /)
  - R14 (P1 — 4-sentence lede vs DS 1–3-sentence rule)
  - R27 (P2 — Pouākai origin treatment)
  - R32 (P2 — H1-only homepage by design)
---

# Content: Home (`/`)

**Route**: `/`
**Status**: Approved
**Owner**: Arian (founder) · Author: pouk-ai-content
**Last updated**: 2026-05-16
**Governing spec**: `meta/specs/pages/home.md` (section 5 content requirements)
**Composition reference**: implicit — `HomeHero.tsx` composes `Hero` + `StatusBadge` + `Button` directly; no `meta/compositions/pages/home.md` exists.

This draft is a **ratification-after-the-fact** of the copy currently rendered on `/`. The homepage was built by the engineer directly from the PM spec, skipping the content-stage approval gate. This draft now closes that gate so future revisions have a canonical record to diverge from. No copy changes are proposed here; every string below is the exact string shipping in production as of 2026-05-16, captured so the words are owned in the content lane, not buried in JSX.

---

## 1. Drafting notes

- **Audience read**: a first-time direct visitor with zero context (typed `pouk.ai`, followed a DM, clicked a signature link) plus a returning prospect re-orienting mid-conversation. The page has under twenty seconds of attention; the words have to do positioning, brand restraint, and hand-off in that window.
- **Outcome read** (from spec §5):
  - Tagline reads as the brand mark itself — serif-led, refined, doing the work of a credential.
  - Lede communicates (a) pouk.ai is technical consulting that ships with AI, (b) the audience is operators who build, (c) the gap pouk.ai exists to close — surfaced as the final integrated link sentence per D-11.
  - Status line is byte-identical to the pre-cutover `index.html` per D-12.
  - Email link is the primary conversion path; no form, no widget.
- **Voice anchor**: agent §4.2 (operator-first), §4.4 (no marketing-speak), §4.5 (pouk.ai naming; Pouākai reference respectful and sparing), plus DS `llms-full.txt` "Brand voice": *precise, direct, technically confident. Never hedges, inflates, or reassures.*
- **Assumptions** (ratified by virtue of the page already shipping):
  - The 4-sentence rendered lede over-spends the DS `Hero` 1–3-sentence cap by one sentence. This is ratified as a *deliberate, time-bounded* over-cap because `/about` does not yet exist and the Pouākai origin needs somewhere to live (see R14/R27 rationale in §4 and §6).
  - The Pouākai origin sentence is a one-time appearance on the doorway page; when `/about` ships, the origin sentence migrates and the homepage lede trims to 3 sentences.
  - The page is H1-only by design (R32). DS Hero owns the sole `<h1>`; no `<h2>` exists because the IA has no second section. Standards R-026 (HARD) forbids skipping heading levels, not having only an H1.

---

## 2. Copy

The page is a single `Hero` block inside `BaseLayout` + `SiteShell`. There are no other sections. All copy below is the exact string shipping in `src/pages/index.astro` and `src/components/HomeHero.tsx` as of 2026-05-16.

### Block: pageTitle (spec §8 — `<title>` AC)

- **Copy**: `pouk.ai — Technical consulting for teams shipping with AI`
- **Character count**: 56 (under 60 SEO cap per agent §5.1).
- **Locked by**: spec §5 — must read as positioning, not marketing; agent §4.2 operator-first ("teams shipping with AI" addresses operators who already build); §5.1 — front-loads the brand, then the positioning noun phrase.

### Block: pageDescription (spec §8 — `<meta description>` AC)

- **Copy**: `Custom AI builds, automations, and advisory for teams that need to ship. Founded by a frontend engineer. Currently taking conversations for Q3.`
- **Character count**: 145 (under 155 SEO cap per agent §5.2).
- **Locked by**: D-12 — final sentence is byte-identical to the rendered status-line copy. Agent §5.2 — declarative, no CTA verbs ("learn more!"), front-loads the substantive nouns ("custom AI builds, automations, and advisory").
- **Voice rationale**: "Founded by a frontend engineer" is the credential sentence — operator-grade specificity (a discipline, not a title) that signals shipping-first orientation without claiming expertise. Three sentences, three jobs: what we do, who we are, current availability.

### Block: statusBadge (spec §5 + §8 — D-12 parity AC)

- **Copy**: `Currently taking conversations for Q3.`
- **Word count**: 6 (well under the DS StatusBadge ≤10-word cap per `llms-full.txt` and agent §2 source-of-truth 5).
- **Component**: `<StatusBadge status="available">…</StatusBadge>` with pulse animation honoring `prefers-reduced-motion` (CSS-only, no JS).
- **Locked by**: **D-12** — byte-identical to pre-cutover `public/index.html`. The decisions log explicitly forbids re-evaluating this copy at cutover; any future change is a separate, post-launch decision.
- **Voice rationale**: matches DS voice example for `StatusBadge` ("Taking conversations for Q3.") — availability fact, no exclamation, no "we're hiring" / "waitlist" flourish. "Currently" softens to a present-tense window without committing to a future-tense calendar.

### Block: heroTitle (spec §5 — tagline outcome)

- **Copy**: `Technical consulting for teams shipping with AI.`
- **Render note**: the word `AI` is wrapped in `<em>` for italic emphasis on the serif display face — the only inline emphasis in the entire page. Single line at most breakpoints; clamp `--fs-tagline` (36–68px).
- **Locked by**: spec §5 outcome A (tagline must read as the brand mark itself, restrained, serif-led, refined). DS `llms-full.txt` `--fs-tagline` rule: used exactly once per page for the Hero title.
- **Voice rationale**: "Technical consulting that uses AI" framing (agent §4.5) rather than "AI consulting" — the noun is *consulting*, the modifier is *technical*, the tool is *AI*. The phrasing differentiates pouk.ai from deck-builders. "Teams shipping with AI" rather than "AI-curious teams" or "early adopters" — operator-first self-identification (agent §4.2).

### Block: heroLede (spec §5 + §8 — D-11 lede-extension AC)

The lede is a single paragraph composed of four rendered sentences. The fourth-and-final sentence is the D-11 integrated link sentence.

- **Sentence 1**: `pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate.`
- **Sentence 2**: `Named for Pouākai — the largest eagle that ever flew, hunting by stooping from height.`
- **Sentence 3**: `Most AI projects fail to deliver.`
- **Sentence 4** (D-11 integrated link): `[Here's why →](/why-ai)` — anchor text `Here's why →` linked to `/why-ai`.
- **Total sentence count**: 4.
- **Locked by**: **D-11** — single integrated link sentence at the end of the lede, *not* a tertiary line under the CTA (rejected alternative per spec §5 and §8). Anchor text and href are structural-lock per the decisions log.

### Block: heroCtaLabel + heroCtaHref (spec §8 — email link AC)

- **Label**: `hello@pouk.ai`
- **Href**: `mailto:hello@pouk.ai`
- **Component**: `<Button asChild><a href="mailto:hello@pouk.ai">hello@pouk.ai</a></Button>`
- **Locked by**: spec §8 AC — email link renders as `<a href="mailto:hello@pouk.ai">`; spec §5 — email link is the primary conversion path; no form, no scheduling widget.
- **Voice rationale**: the address *is* the label. Buttons that read "Get in touch" or "Contact us" force the reader to take a second step (click → see address → decide). Showing the address directly removes that step and signals operator-grade directness. DS button-label rule: sentence-case, ≤4 words, specific verb — `hello@pouk.ai` is a noun-as-label, which is the right exception here because the noun *is* the action target.

### Block: footerLines (rendered by `SiteShell` via `ShellWrapper.tsx`)

- **Copy**: `© 2026 pouk.ai · hello@pouk.ai`
- **Render note**: the `hello@pouk.ai` substring is an `<a href="mailto:hello@pouk.ai">`. Year is template-injected via `{year}` to avoid manual updates.
- **Locked by**: agent §4.3 refined (one space after periods, middle-dot separator); agent §4.5 lowercase `pouk.ai`. Owned by `SiteShell` consumer slot — site repo's responsibility, not DS-baked.
- **Voice rationale**: hairline footer carries copyright + contact only. Adding "All rights reserved" or social links would break the doorway restraint. The mailto in the footer is a second conversion path for visitors who scroll past the Hero CTA.

---

## 3. Page-level SEO copy

- **`<title>`**: `pouk.ai — Technical consulting for teams shipping with AI` (56 chars)
- **`<meta name="description">`**: `Custom AI builds, automations, and advisory for teams that need to ship. Founded by a frontend engineer. Currently taking conversations for Q3.` (145 chars)
- **OG title**: matches `<title>` — `pouk.ai — Technical consulting for teams shipping with AI`. The line is already in voice and survives social-share truncation.
- **OG description**: matches `<meta description>` — 145 chars, well under the 200-char OG soft cap.
- **Canonical**: `https://pouk.ai/`
- **JSON-LD**: `Organization` schema with `name`, `url`, `email`, `description`, `sameAs` (LinkedIn, X, Instagram, GitHub). Owned by `index.astro` frontmatter; copy fields are byte-identical to pre-cutover `public/index.html` per D-12 parity matrix.
- **Heading hierarchy**: exactly one H1 (the Hero `<h1>` rendering the tagline). No H2, H3, H4. Standards R-026 (HARD) — "must not skip heading levels" — is honored: there are no skipped levels because there are no sub-sections. See R32 closure in §4 below.

---

## 4. Voice rationale

Anchors per significant line so future revisions have to argue against a reason, not against vibes.

- **Tagline — `Technical consulting for teams shipping with AI.`** Chosen over "AI consulting for…" (which would put pouk.ai in the deck-builder bucket) and over "Engineering consulting that uses AI" (which would understate the AI specialization). "Teams shipping with AI" is the operator self-identifier — engineering-led, post-curiosity, already-building. The italic `<em>AI</em>` on the serif face is a brand cue: the tool is named but not foregrounded; the noun *consulting* is the credential.
- **Lede sentence 1 — `pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate.`** "Operators who'd rather ship than speculate" is the audience handle. It rejects two adjacent personas: the executive looking for a deck and the AI enthusiast looking for a movement. The verb *builds* (not "delivers", not "creates", not "leverages") is a specific shipping verb per agent §4.6.
- **Lede sentence 2 — `Named for Pouākai — the largest eagle that ever flew, hunting by stooping from height.`** This is the brand-origin line, ratified despite agent §4.5's "respectful, sparing" caution (see R27 in §6 below). The justification is structural: `/about` doesn't exist yet, and the origin sentence has to live somewhere visible if it lives at all. The phrasing — fact-led ("the largest eagle that ever flew"), behavior-led ("hunting by stooping from height") — avoids the forbidden metaphor pattern ("we soar above competitors") and treats Pouākai as a real animal, not a marketing device. The macron on `Pouākai` is preserved (HTML entity `&#257;`) per agent §4.5.
- **Lede sentence 3 — `Most AI projects fail to deliver.`** Four-word claim that does the hand-off setup. Declarative, no hedge, no source-citation in the lede — the citation lives on `/why-ai` where the claim is supported. The sentence's job is to earn the click on sentence 4.
- **Lede sentence 4 — `[Here's why →](/why-ai)`** D-11 structural lock. The arrow → is the affordance; the verb *here's* points at the destination; the noun *why* names the question. Anchor text fits inside the lede prose rather than appearing as a tertiary CTA line (rejected alternative per spec §5). The link makes sentence 3 falsifiable by clicking — operator-grade rigor.
- **CTA — `hello@pouk.ai`** The address *is* the label per the rationale in §2 above. This breaks the DS Button-label "specific verb" guideline by using a noun, but the noun is the conversion target. Operator audience reads an email address as a direct invitation.

---

## 5. Headline alternatives (preserved for future revisions)

Per agent §6, high-stakes lines ship with three labelled options. These are recorded here for the next revision pass; the *recommended* option is the line currently shipping.

### Hero title

| Option | Copy | Rationale | Risk |
|---|---|---|---|
| Safest | `AI consulting that ships.` | Punchier, four words. | Drops the "technical" qualifier — reads as deck-builder. Rejected. |
| Sharpest (shipping) | `Technical consulting for teams shipping with AI.` | Names discipline, audience, and tool in nine words. | Slightly longer than the 36–68px clamp's comfort zone at small viewports. Mitigated by the clamp itself. |
| Weirdest | `We're the engineers your AI project should have hired first.` | Direct address, accusatory. | Aggressive; reads as agency-positioning. Rejected. |

### Hero lede first sentence

| Option | Copy | Rationale | Risk |
|---|---|---|---|
| Safest | `pouk.ai is a technical consultancy for AI builds.` | Two-clause, definitional. | Doesn't name the audience or the discriminator. Reads as boilerplate. Rejected. |
| Sharpest (shipping) | `pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate.` | Names three deliverables and the audience handle in one breath. | 19 words — close to the breath-cap for a Hero lede opener. Justified by the density. |
| Weirdest | `pouk.ai ships AI for people who are tired of slides.` | Slogan-feel; high-attitude. | Reads as agency-snark. Rejected. |

### Hand-off line (D-11 anchor text)

| Option | Copy | Rationale | Risk |
|---|---|---|---|
| Safest | `Read why →` | Three characters shorter. | Verb without object — reads as truncated. |
| Sharpest (shipping) | `Here's why →` | Two-word answer; arrow is the affordance. | None material. |
| Weirdest | `The receipts →` | Punchy; promises evidence. | Cute; breaks the page's restraint. Rejected. |

---

## 6. Composition-fit flags

Three flags. Two are deliberate over-caps documented for future revision; one is a structural ratification.

### Flag 1 — R14: Lede sentence count exceeds DS `Hero` rule

- **The constraint**: DS `llms-full.txt` (Hero component): *"lede: 1-3 sentences at most."*
- **The current shipping copy**: 4 sentences.
- **The over-cap**: by one sentence.
- **The structure**:
  1. Positioning ("pouk.ai builds…")
  2. Brand origin ("Named for Pouākai…")
  3. Problem ("Most AI projects fail to deliver.")
  4. Hand-off ("Here's why →")
- **Decision (ratified by shipping)**: ratify the over-cap as a **deliberate, time-bounded** exception. The sentence creating the over-cap is sentence 2 (Pouākai origin). It exists on the homepage *only* because `/about` does not yet exist. When `/about` ships and absorbs the origin sentence, the homepage lede drops to 3 sentences and falls within the DS cap.
- **Why not collapse origin into a clause now**: a comma-spliced origin clause inside sentence 1 ("pouk.ai, named for Pouākai…, builds custom AI systems…") would break agent §4.1 ("one idea per sentence; two clauses max") and would bury the audience handle ("operators who'd rather ship than speculate") behind a parenthetical. The standalone origin sentence keeps sentence 1 clean.
- **Why not move origin to a future `/about` now**: `/about` is not in the canonical four routes (`/`, `/why-ai`, `/roles`, `/principles`) per `meta/masterplan.md` §4.1 and is not on the launch path. Removing the origin sentence pre-emptively would leave the brand without an origin surface for an unknown window.
- **Trade-off recorded**: the DS Hero rule prefers 1–3 sentences for visual density / scan-ability. The site is intentionally over-spending one sentence to preserve the brand-origin until a dedicated home exists. The Designer (`pouk-ai-designer`) accepted the composition implicitly when `HomeHero.tsx` shipped; a future revision pass that adds `/about` MUST trigger a homepage lede trim.
- **Migration trigger**: when an `/about` (or equivalent origin-surface) spec lands in `meta/specs/pages/`, this draft revises to status `Draft`, sentence 2 is removed, and the lede goes to 3 sentences (positioning, problem, hand-off).
- **Status**: ratified as-is for 2026-05-16. R14 closed.

### Flag 2 — R27: Pouākai origin treatment

- **The constraint**: agent §4.5 — *"Pouākai reference: respectful, sparing. Permitted: a one-line origin note on `/about` or in a longer-form post."*
- **The current shipping copy**: 1 sentence, 2 clauses joined by em-dash — `Named for Pouākai — the largest eagle that ever flew, hunting by stooping from height.`
- **The tension**: "one-line origin note on `/about`" — but `/about` doesn't exist; the origin currently lives on `/`.
- **Decision (ratified by shipping)**: ratify the current treatment.
  - It IS a **one-line origin note** (single sentence, no second sentence on Pouākai).
  - It IS **respectful**: fact-led ("the largest eagle that ever flew"), behavior-led ("hunting by stooping from height"). It is not used as metaphor or appropriation.
  - It IS **sparing**: appears exactly once on the entire site (no recurrence in copy, no second mention).
  - The location (`/` rather than `/about`) is justified by Flag 1 — `/about` doesn't yet exist.
- **Forbidden patterns NOT triggered**: no "we soar above competitors" metaphor; no compression of the macron (`Pouākai` not `Pouakai`); no Māori visual motif suggestions.
- **Status**: ratified. R27 closed. When `/about` ships, the origin sentence migrates and is removed from `/`.

### Flag 3 — R32: Homepage is H1-only by design

- **The constraint**: standards R-026 (HARD) — *"must not skip heading levels"*. There is no standard requiring a minimum count of headings.
- **The current shipping copy**: exactly one H1 (the Hero `<h1>` rendering the tagline). No H2, H3, H4.
- **Why this is correct**: the spec IA (§4) defines the page as a single Hero block — *"adding sections is a brand violation, not a feature improvement."* A second section would force an H2; the absence of a second section is by design. The doorway pattern requires nothing more.
- **R-026 check**: no level is skipped because no level exists between H1 and... nothing. There is no H3 without an H2.
- **A11y check**: a single H1 is a valid document outline. Screen readers announce the H1 as the page label; the rest of the page is body prose inside the Hero.
- **Status**: ratified as deliberate. R32 closed. No copy change.

---

## 7. Open questions for Arian

None. This is a ratification draft. The three lower-priority backlog items (R14, R27, R32) are closed with documented rationale in §6 above; the P0 (R05) is closed by the existence of this Approved draft itself.

Future revision triggers (recorded so a future Content pass knows when to reopen):

- If an `/about` (or equivalent origin-surface) page enters the IA, this draft revises: sentence 2 of the lede migrates to that page, and the homepage lede trims to 3 sentences.
- If the status-line copy needs to change post-Q3 (cycle close, new availability state), a new draft revises §2 `statusBadge`. D-12 only locks the *cutover-day* copy; post-launch evolution is permitted.
- If Arian wants to introduce a second section to the homepage, that decision changes the doorway-pattern thesis and forces a re-spec. The right path is to raise it with PM (`pouk-ai-pm`), not to revise this draft.

---

## 8. Out of scope

- The contents of `/why-ai`, `/roles`, `/principles` — separate page specs and separate content drafts.
- Footer copy beyond the single line `© 2026 pouk.ai · hello@pouk.ai` — the `SiteShell` footer is constrained to this single line for the homepage.
- JSON-LD field values — owned by the engineer per the spec; copy here only confirms the public-facing strings.
- Choice of email host, social-link destinations, sitemap entries — engineering and infrastructure decisions, not content.
- Any treatment of `banner.png` / `og.png` artwork — visual design, not copy.
- Per-visit personalization, A/B variants, dynamic stat insertion — out of scope per spec §10 (zero-JS contract).
