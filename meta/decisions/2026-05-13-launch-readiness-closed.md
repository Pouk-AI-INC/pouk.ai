# Pre-build decisions — pouk.ai marketing site

**Status**: Closed (decisions propagated 2026-05-13)
**Owner**: Arian (founder, sole approver)
**Compiled**: 2026-05-13
**Closed**: 2026-05-13
**Compiler**: Claude (orchestrator), synthesizing from `meta/specs/*`, `meta/standards/technical-requirements.md`, `meta/backlog.md`, and `meta/masterplan.md`.

---

## Closing summary

Every decision D-01 through D-23 was resolved on 2026-05-13. Propagated changes:

- **Spec lane (`pouk-ai-pm`)** — D-01 → D-13 applied to `meta/specs/pages/*.md`, `meta/specs/content/*.md`, `meta/specs/flows/visitor-to-conversation.md`. All eight spec files flipped from `Draft` → `Approved`.
- **Standards lane (`pouk-ai-reviewer`)** — D-14 → D-22 applied to `meta/standards/technical-requirements.md`. R-009/R-010/R-011/R-012 rewritten to reflect the new client-JS posture (Matomo + Bugsink on every page including `/`). R-013 Lighthouse band relaxed to Perf ≥ 95, A11y/BP/SEO = 100. O-001 → O-009 closed; O-011 (Matomo deployment shape) and O-012 (Bugsink deployment shape) opened as new infrastructure questions. Status flipped to `Approved`.
- **Masterplan lane (orchestrator)** — D-23 R1-R4 applied. Section 4.2A added (CI shape). Section 4.3 retitled "Client-JS posture" and rewritten. Section 6.1 parity matrix updated (gzipped HTML weight, Lighthouse bar matches R-013). Section 7 item 1 updated (drop `banner.png` fallback). `meta/architecture.md` annotated as superseded.
- **Backlog (orchestrator)** — D-21 task (`.well-known/security.txt`) added to `meta/backlog.md` under a new "Security hygiene" section.

The two remaining infrastructure decisions (Matomo and Bugsink deployment shape) and the launch-infrastructure tasks in section 8 of this document remain open. They do not block any spec or standard from `Approved` status.

---

## Why this document exists

There are **23 open decisions** stacked across the four PM page specs, the engineering Technical Requirements, and a small number of masterplan revisions. None of those documents can move from `Draft` to `Approved` until you weigh in.

This is a one-sitting instrument: every decision in one place, with a recommendation, a one-line "why," a default-if-deferred, and a checkbox slot for you to mark in place. After you finish a pass, this file becomes the source of truth that the PM agent (for spec decisions) and the reviewer agent (for standards decisions) propagate back into their owned documents.

---

## How to use this document

For each decision below:

1. Read the question and the options.
2. Mark **one** checkbox. If the recommendation is fine, you can just check it.
3. If you want to override, check a different option (or write your own answer under "Custom").
4. Add a one-line note in the **Notes** field if you want context preserved.
5. When you're done, tell me. I'll route each decision to the right agent (PM for spec questions, reviewer for standards questions) and they'll propagate.

If you only have 60 seconds and want everything to move with defaults, just write `accept all defaults` and we'll mark every recommendation as the chosen path. You can always revise later — these all enter `Approved` status as revisable artifacts.

---

## Decision lanes and counts

| Lane | Decisions | Owner agent | Propagates to |
|---|---|---|---|
| 1. Page spec — `/why-ai` | 5 | `pouk-ai-pm` | `meta/specs/pages/why-ai.md` |
| 2. Page spec — `/roles` | 3 | `pouk-ai-pm` | `meta/specs/pages/roles.md` + `content/roles.json.md` |
| 3. Page spec — `/principles` | 2 | `pouk-ai-pm` | `meta/specs/pages/principles.md` |
| 4. Page spec — `/` (home) | 2 | `pouk-ai-pm` | `meta/specs/pages/home.md` |
| 5. Cross-page flow | 1 | `pouk-ai-pm` | `meta/specs/flows/visitor-to-conversation.md` |
| 6. Technical Requirements | 9 | `pouk-ai-reviewer` | `meta/standards/technical-requirements.md` |
| 7. Masterplan revisions | 4 (informational) | n/a (founder action) | `meta/masterplan.md`, `meta/architecture.md` |
| 8. Launch infrastructure | n/a (action items, not decisions) | engineer + founder | `meta/backlog.md` |

---

## Section 1 — `/why-ai` decisions

### D-01 — Citation style for stats and sources

The page is heavy on stats (12–18%, 85%, 15%, $300B, 500%, 61%, 1.7×, 3.6×, 2.7×) and four named source firms (Gartner, PwC, McKinsey, IBM).

**Options**
- [X] **A. Footnote-style superscripts** linked to the references list at the bottom of the page. Academic feel. (Recommended — survives copy-paste, keeps body copy uncluttered, reads as rigorous.)
- [ ] **B. Inline parenthetical** — "(Gartner, 2026)" after each claim. More journalistic.
- [ ] **C. Endnotes only** — no inline citation markers at all, just a "References" block at the bottom. Cleanest visually, weakest auditing.
- [ ] **D. Custom**: ___________

**Default if deferred**: A (footnote-style).
**Notes**:

---

### D-02 — Sticky desktop TOC for the five failure modes

The page has ~1500 words and five numbered failure modes. On desktop, a sticky right-rail TOC linking to `#data-readiness`, `#wrong-use-case`, etc. lets a returning reader jump back to a specific section.

**Options**
- [X] **A. Sticky TOC on desktop only** (mobile falls back to scroll). (Recommended — earns its weight on a long-scroll page; the page is the credential, scroll-tracking helps it function as a reference.)
- [ ] **B. No TOC** — trust the scroll on both desktop and mobile. Matches the holding page's restraint.
- [ ] **C. Inline jump-list at top** — anchors listed under the intro, no stickiness. Middle ground.
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-03 — Dataset-vintage footer

The page references "2026" stats throughout. Citations rot. Adding a `Last reviewed: <date>` footer commits us to revisiting; omitting it leaves the references' own dates to carry the weight.

**Options**
- [X] **A. Add `Last reviewed: 2026-05-13` footer** with a commitment to annual review. (Recommended — pre-empts the "is this still current?" question, signals operator-grade rigor.)
- [ ] **B. Omit the footer.** Source dates in the references block do the work. Less maintenance overhead.
- [ ] **C. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-04 — Discovery-questions callout treatment

The page closes with four discovery questions in italics. Treatment options:

**Options**
- [X] **A. Inline italic blockquote** — same body type, just `<blockquote>` with `font-style: italic`. Matches the rest of the page. (Recommended — the questions are conversational; outsized treatment makes them feel like a sales pitch.)
- [ ] **B. Boxed callout** — `--surface` background with hairline border, sits as a visual unit. Stronger affordance.
- [ ] **C. Large-format pull-quote** — Instrument Serif italic, hero-typography weight. Emphasizes them as the page's "exit ramp."
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-05 — Extract 500% and 61% stats from failure-mode prose into typed `stats` array

The PM's content schema (`failure-modes.json.md`) recommends pulling these two figures out of the failure-mode body text and into a `stats: [{ value, caption, source }]` array per failure mode, so they render as `Stat` atoms rather than inline `<strong>`. The reviewer agreed; needs your sign-off because it changes how the founder-approved copy renders.

**Options**
- [X] **A. Approve the extraction.** Stats become typed data; body text reads as flowing prose around them. (Recommended — the page lives or dies by how the numbers read; `Stat` atom typography earns the conversion.)
- [ ] **B. Keep stats inline as `<strong>`.** Lower-effort, preserves the original copy structure verbatim.
- [ ] **C. Hybrid** — pull only the lead stat ($300B, 85%, 500%) into `Stat` atoms; leave smaller in-line stats as `<strong>`.
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

## Section 2 — `/roles` decisions

### D-06 — Lucide glyph picks for the four roles

The masterplan delegates icon picks to the site repo. `RoleCard` accepts the icon as a slot, so each role needs its Lucide glyph identifier in `roles.json`.

**Options** (Lucide names, browse at lucide.dev)
- [X] **A. Recommended pairing:**
   - Builder → `hammer`
   - Automator → `workflow` (or `cable` if `workflow` reads too generic)
   - Educator → `graduation-cap`
   - Creator → `clapperboard` (or `camera` if `clapperboard` reads too specific to film)

   (Recommended — each glyph has a single read; none of them collide with each other; all four ship in Lucide's stable set.)
- [ ] **B. Alternative pairing:**
   - Builder → `wrench`
   - Automator → `zap`
   - Educator → `book-open`
   - Creator → `camera`
- [ ] **C. Pick per role from this menu:**
   - Builder: [ ] `hammer`  [ ] `wrench`  [ ] `pickaxe`  [ ] custom: ____
   - Automator: [ ] `workflow`  [ ] `cable`  [ ] `zap`  [ ] custom: ____
   - Educator: [ ] `graduation-cap`  [ ] `book-open`  [ ] `lightbulb`  [ ] custom: ____
   - Creator: [ ] `clapperboard`  [ ] `camera`  [ ] `palette`  [ ] custom: ____

**Default if deferred**: A.
**Notes**:

---

### D-07 — Eyebrow convention on `RoleCard`

What sits above each role's `<h2>`? Reviewer's recommendation is "The Builder" (a label that names the persona); alternative is "01" (a numbered position).

**Options**
- [ ] **A. "The Builder", "The Automator", "The Educator", "The Creator"** as the eyebrow; the `<h2>` is the role name without "The". Two-line visual rhythm: persona label, then the action. (Recommended — restates the persona without making the numbering implicit; future-proofs adding a fifth role.)
- [ ] **B. "01 / Builder", "02 / Automator", …** — numbered ranking. Hierarchical, more product-page-ish.
- [ ] **C. Skip the eyebrow entirely.** `<h2>` is just "Builder" or "The Builder". Cleanest, loses the recurring visual unit.
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-08 — Per-role CTA vs. universal end CTA

Does each role end with its own contact CTA ("Book a Builder conversation →"), or do all four funnel to a single end-of-page CTA?

**Options**
- [ ] **A. Universal end CTA** — single block at the bottom of `/roles` linking to `hello@pouk.ai`, optionally with LinkedIn. Each role's `RoleCard` stays a description, not a transaction. (Recommended — at the brand's current stage every conversation is a single contact channel; per-role CTAs imply pre-fab packages that don't yet exist.)
- [ ] **B. Per-role CTA** — each card ends with "Book a Builder conversation" → `mailto:hello@pouk.ai?subject=Builder%20conversation`. Stronger conversion affordance, but every mail lands in the same inbox anyway.
- [ ] **C. Hybrid** — universal end CTA, plus a quiet "tell me which role fits" affordance per card (anchored to the end CTA, not a separate mail target).
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

## Section 3 — `/principles` decisions

### D-09 — Page heading wording

**Options**
- [ ] **A. "Principles"** — terser, matches the URL `/principles`. (Recommended — the manifesto reads as a single piece; the URL says what the page is, the heading shouldn't repeat the modifier.)
- [ ] **B. "Operating Principles"** — explicit, matches the source title in `meta/backlog.md`.
- [ ] **C. "How we operate"** — verb-led, less manifesto-flavored.
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-10 — Bookend voice treatment

The introduction + conclusion bracket the ten principles. They could share the principles' sans treatment, or shift to Instrument Serif italic for editorial framing.

**Options**
- [ ] **A. Instrument Serif italic** for the intro and conclusion; sans for the ten principles. Visual cue: framing voice vs. enumerated voice. (Recommended — uses the brand's serif italic where it's already established on the homepage hero, gives the page a tactile editorial weight.)
- [ ] **B. Sans throughout.** Bookends and principles share type. Cleaner, less editorial.
- [ ] **C. Instrument Serif italic only for the introduction**; conclusion stays sans (mirrors a newspaper feature).
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

## Section 4 — `/` (home) decisions

### D-11 — Lede-extension treatment for the `/why-ai` hand-off

Once `/why-ai` exists, the homepage lede acquires a hand-off. Two ways to express it:

**Options**
- [ ] **A. Integrated link sentence at the end of the lede:** "Most AI projects fail to deliver. Here's why →" with `Here's why →` as the link. Reads as part of the prose. (Recommended — the hand-off is the lede's job; a separate tertiary line dilutes the hero's restraint.)
- [ ] **B. Tertiary line below the existing CTA:** lede unchanged, new line under the email link: "Read why AI projects fail →".
- [ ] **C. Inline `<a>` from one of the existing lede words** (e.g., "AI") — quietest, easiest to miss.
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-12 — Status-line copy at cutover

Today the holding page says "Available for new engagements" (or similar — confirm from current `index.html`). Once the multi-page site is live, the status line either stays the same, changes to reflect the post-launch state, or disappears.

**Options**
- [ ] **A. Keep the existing status line verbatim.** The brand still competes on availability. (Recommended — the status line is part of the page's restraint; changing it risks signalling the brand is now "a real site" instead of "an operator.")
- [ ] **B. Update to a new status line.** Founder-supplied wording. Surface the new copy here:
   ```
   ___________
   ```
- [ ] **C. Drop the status line entirely** post-cutover.
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

## Section 5 — Cross-page flow decisions

### D-13 — Nav order across the site

The PM and reviewer both recommend funnel order: Why AI → Roles → Principles. Locking it here propagates to `SiteShell`, sitemap, and footer.

**Options**
- [ ] **A. Funnel order: Why AI · Roles · Principles** (recommended — mirrors the visitor journey, places the highest-intent page first).
- [ ] **B. Alphabetical: Principles · Roles · Why AI** — neutral, less prescriptive.
- [ ] **C. Commercial-first: Roles · Why AI · Principles** — leads with services.
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

## Section 6 — Technical Requirements decisions

These propagate to `meta/standards/technical-requirements.md`. Items map to O-001 through O-009 in that document.

### D-14 — Lighthouse 100 vs. 99 as the HARD bar (O-001)

**Options**
- [ ] **A. Lighthouse 100/100/100/100 on every page, HARD.** Re-run on flake, optimize when scoring drifts. Matches the masterplan as-written. (Recommended — the entire engineering posture has been built around this bar; lowering it now would change the project's premise.)
- [ ] **B. Lighthouse ≥ 99 on every page, HARD; 100 SOFT target.** Acknowledges Lighthouse's 1–2-point flake on identical content. Pragmatic.
- [X] **C. Custom thresholds per category** (e.g., Perf ≥ 99, A11y/BP/SEO = 100). Surface in notes.

**Default if deferred**: A.
**Notes**:

---

### D-15 — Analytics provider for production (O-002)

Both candidates are cookieless and meet the no-JS-for-basic-tier bar.

**Options**
- [ ] **A. Vercel Web Analytics, basic tier.** One toggle in the Vercel dashboard, lives where the deploy lives. (Recommended — minimal friction at launch; migrate later only if needed.)
- [ ] **B. Cloudflare Web Analytics.** Host-agnostic. Survives a future deploy-host change.
- [ ] **C. No analytics on launch.** Defer until there's a question the data could answer.
- [X] **D. Custom**: Matomo

**Default if deferred**: A.
**Notes**:

---

### D-16 — Error reporting tool (O-003)

**Options**
- [ ] **A. None on launch.** The site is static, the surface is small, errors will show up in Vercel's build logs and runtime logs. (Recommended — wait until there's traffic that earns the JS budget for a client-side SDK.)
- [ ] **B. Sentry, server-side only** — capture build/render errors. No client JS budget impact.
- [ ] **C. Sentry, client + server.** Full coverage, but adds a third-party JS SDK to every page (breaks R-009 zero-JS contract on `/` unless lazy-loaded).
- [X] **D. Custom**: Bugsink

**Default if deferred**: A.
**Notes**:

---

### D-17 — CSP strategy (O-004)

**Options**
- [ ] **A. No CSP on launch.** Static marketing site, no forms, no third-party embeds. Add CSP the moment a form or embed enters the picture. (Recommended — premature CSP introduces JSON-LD hash-pinning maintenance for no current threat surface.)
- [ ] **B. Ship a permissive CSP** (`script-src 'self'`, `style-src 'self' 'unsafe-inline'`) from day one. Some defense-in-depth; minor breakage risk.
- [ ] **C. Ship a strict CSP with hash-pinned JSON-LD** from day one. Maximum hardening; higher maintenance.
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-18 — Service worker for offline (O-005)

**Options**
- [X] **A. No service worker.** (Recommended — site is small enough that browser HTTP cache + Vercel edge CDN cover the offline-ish case; a SW fights the zero-JS contract.)
- [ ] **B. Ship a minimal SW** for asset caching only.
- [ ] **C. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-19 — Conventional Commits as HARD or SOFT (O-006)

**Options**
- [X] **A. SOFT.** Reviewer requests changes when commits drift; doesn't block. (Recommended — the site is single-author; the cost of strict enforcement outweighs the benefit until automation needs it.)
- [ ] **B. HARD.** Every commit must follow `type: subject`. Unlocks changesets-style release automation later. The current commit history already roughly follows this.
- [ ] **C. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-20 — Test coverage threshold when tests exist (O-007)

There are no tests today. When they're added, what's the bar?

**Options**
- [X] **A. ≥ 80% line coverage on changed files, plus a smoke test for every new component.** Pragmatic, doesn't require backfilling absolute coverage. (Recommended.)
- [ ] **B. ≥ 80% absolute coverage** across the whole codebase.
- [ ] **C. No coverage threshold; require "tests where they make sense."** Looser.
- [ ] **D. No tests planned for the marketing site.** Defer this decision until there's a reason to add them.

**Default if deferred**: D (no tests until there's a reason).
**Notes**:

---

### D-21 — Add `.well-known/security.txt` (O-008)

A low-cost good-citizen file at `/.well-known/security.txt` advertising a security contact and a disclosure policy.

**Options**
- [X] **A. Add it once `hello@pouk.ai` is live.** Contact = `security@pouk.ai` (alias to `hello@`) or `hello@pouk.ai` directly. (Recommended — costs nothing, signals operator-grade hygiene.), so add the task to the backlog
- [ ] **B. Add it on launch with `hello@pouk.ai` as the contact.**
- [ ] **C. Skip.** Defer until there's a vulnerability disclosure to handle.
- [ ] **D. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

### D-22 — Branch naming as HARD or SOFT (O-009)

**Options**
- [ ] **A. SOFT.** Reviewer prefers `feature/*` and `fix/*`; doesn't block on it. (Recommended — single-author site; convention is a habit, not a gate.)
- [ ] **B. HARD.** Enforces branch-name-based PR labelling later.
- [ ] **C. Custom**: ___________

**Default if deferred**: A.
**Notes**:

---

## Section 7 — Suspected masterplan revisions

These were surfaced by the reviewer while authoring the Technical Requirements. They're not decisions in the same sense — they're proposed edits to `meta/masterplan.md` and `meta/architecture.md` that need your assent.

### D-23 — Approve masterplan revisions

The reviewer suggests four edits:

- [ ] **R1.** `masterplan.md` section 6.1 — clarify whether HTML weight is measured **gzipped** or uncompressed. (Technical Requirements R-015 says gzipped.) Apply edit.
- [ ] **R2.** `masterplan.md` section 4.2 — add a sub-section describing the CI shape (`lighthouse-ci`, axe-core, content-schema validation). Apply edit.
- [ ] **R3.** `masterplan.md` section 7 item 1 — reconcile "ship `banner.png` as OG fallback" with the Technical Requirements 1200×630 spec. Either confirm `banner.png` is 1200×630 or update the masterplan to require `og.png` only. Apply edit.
- [ ] **R4.** `meta/architecture.md` — add a "Superseded once Astro migration lands" header noting that the "No JavaScript / No build step / No frameworks" constraints describe the holding-page reality, not the post-cutover reality. Apply edit.

**Default if deferred**: All four approved. (Reviewer's recommendation; none of them are controversial.)
**Notes**:

---

## Section 8 — Launch infrastructure (action items, not decisions)

Tracked here only so this document is a single sitting for "what's pending." None of these need a choice — they need execution. Source: `meta/backlog.md`.

### Hard launch blockers

- [ ] Register `pouk.ai` at Porkbun (~$10–15/yr with WHOIS privacy)
- [ ] Generate `og.png` (1200×630)
- [ ] Generate `apple-touch-icon.png` (180×180)
- [ ] Update favicon to the feather isotype
- [ ] Add `robots.txt`
- [ ] Add `sitemap.xml`
- [ ] Add `vercel.json` with security headers

### DNS + email

- [ ] Configure Porkbun: `ALIAS` apex + `CNAME www` → `cname.vercel-dns.com`
- [ ] Add `pouk.ai` and `www.pouk.ai` under Vercel → Settings → Domains
- [ ] Pick email host (Fastmail / Google Workspace) for `hello@pouk.ai`
- [ ] Add MX, SPF, DKIM, DMARC, CAA records before the first prospect email goes out

### Brand assets

- [ ] Decide whether `banner.png` doubles as OG image (D-23 R3) or whether a fresh `og.png` is required
- [ ] Confirm `apple-touch-icon.png` source variant matches favicon + OG

---

## Section 9 — The fully-deferred path

If you mark `accept all defaults` and check no boxes, here's what becomes `Approved` immediately:

- `/why-ai` page spec — citation style: footnotes · TOC: sticky desktop · vintage footer: yes · callout: inline italic · stats extracted to typed array
- `/roles` page spec — Lucide pairing A (hammer, workflow, graduation-cap, clapperboard) · eyebrow: "The Builder" · universal end CTA
- `/principles` page spec — heading: "Principles" · bookend voice: Instrument Serif italic
- `/` (home) page spec — lede-extension: integrated link sentence · status line: unchanged
- Flow spec — nav order: funnel order
- Technical Requirements — Lighthouse 100 HARD · Vercel Web Analytics · no error reporting · no CSP · no SW · Conventional Commits SOFT · tests deferred · security.txt after email is live · branch naming SOFT
- Masterplan revisions — all four edits applied

What still blocks `Approved` even on the fully-deferred path:

- DS components (`Hero`, `Stat`, `RoleCard`, `Principle`, `FailureMode`, `SiteShell`) must ship in `@poukai/ui@0.1.0` before the page specs reach `Built`. That's Claude Design's lane.
- Launch infrastructure (Section 8) — separate execution path, not blocked by spec approval.

---

## How to close this out

When you've made your picks (or said `accept all defaults`):

1. I'll route every spec-side decision to `pouk-ai-pm` to revise the relevant spec sections and flip `Status: Draft` → `Status: Approved`.
2. I'll route every standards-side decision to `pouk-ai-reviewer` to update `meta/standards/technical-requirements.md` accordingly and flip its `Status: Draft` → `Status: Approved`.
3. The masterplan revisions get applied by me directly (small edits, not agent-owned).
4. This file gets archived to `meta/decisions/2026-MM-DD-launch-readiness-closed.md` with your decisions preserved as the historical record.

Once that round is done, the only thing standing between us and `pouk-ai-engineer` cutting code is `@poukai/ui@0.1.0` shipping.
