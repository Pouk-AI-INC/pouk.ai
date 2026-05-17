# Spec: Home

**Route**: `/`
**Status**: Approved
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-17 (§8 ACs reworded per backlog R35/R36/R37)
**Masterplan reference**: Sections 4.1 (site layout), 4.3 (zero-JS contract), 6 (cutover)
**Decisions log**: D-11 (lede-extension), D-12 (status line) — both resolved via `meta/decisions/launch-readiness.md` on 2026-05-13.

---

## 1. Purpose

`/` is the entry portal post-multi-page cutover. Today the homepage is a holding page (single static `index.html`) — see `meta/architecture.md`. After the four-route site exists, `/` evolves from a brochure into a hand-off: it preserves the restraint and credential-by-typography of the holding page, but its lede ends with an explicit link into `/why-ai`. Its job is to (a) confirm to a returning prospect that pouk.ai is alive and shipping, (b) hand a new visitor into the funnel by the second sentence, and (c) maintain the brand's restraint by *not* doing more than that. The page is a doorway, not a destination.

This spec describes the **post-cutover** homepage, not the current `index.html`. The current page's typographic rhythm, color palette, status line, and hairline footer carry over verbatim; what changes is the lede sentence and the hand-off link.

## 2. Audience

- **Primary**: A first-time direct visitor (typed `pouk.ai`, clicked a banner from a sent email, followed a tweet) who has zero context. They need to understand within two sentences what pouk.ai is, that it's real, and where to read next.
- **Secondary**: A returning visitor (a prospect mid-conversation, a referrer about to send an intro, a past client) who is checking that the site still loads and that the contact path still works. They want minimal friction; the page should reward a quick re-orientation.

## 3. Success criteria

- **Behavior**: The visitor lands, reads the tagline + lede, and either (a) clicks through to `/why-ai` to start the funnel, (b) clicks the email link to start a conversation directly, or (c) bookmarks/closes having confirmed pouk.ai is live. Two of three count as success at this stage.
- **Signal**: Qualitatively — direct visitors continue to `/why-ai` or `mailto:`; referrers report the page "still feels right" and forward links without reservation. When analytics arrive, click-through rate from `/` to `/why-ai` is the primary read-out alongside `mailto:` clicks.
- **Failure mode**: The page reads as a brochure with no next step, or — opposite failure — the next-step link is so loud it overwrites the brand restraint that earns trust in the first place. If the visitor leaves without a clear path forward *and* without an impression of refinement, the page failed.

## 4. Information architecture

The homepage is intentionally short — a single hero block, a status line, a hairline footer. Adding sections is a brand violation, not a feature improvement. The post-cutover version uses DS components in place of the current hand-tuned `index.html` markup; visual output should be indistinguishable per the masterplan section 6.1 parity matrix.

1. `SiteShell` — top nav (Home is the canonical / no-current state, or marked current depending on `SiteShell` API) + hairline footer.
2. `Hero` — eyebrow (none, or `Wordmark` from the SiteShell carrying the role), title (the brand tagline), lede (ending in a single **integrated** link sentence — per D-11 the final structural line is "Most AI projects fail to deliver. Here's why →" with `Here's why →` as the anchor to `/why-ai`, integrated into the lede prose itself, not a tertiary line under the CTA), status (`StatusBadge` carrying the verbatim status-line copy from the current `index.html` — per D-12, byte-identical at cutover), CTA (the email link).
3. **End — no further sections.** The hairline footer from `SiteShell` closes the page. No "About," no "Services," no testimonial block, no logo bar.

## 5. Content requirements

The tagline + body lede + status text + email link carry over from the current holding page verbatim where possible; only the final sentence of the lede changes.

Outcomes the copy must hit:

- The tagline must continue to read as **the brand mark itself** — restrained, serif-led, refined. The current treatment (Instrument Serif `<h1>` clamp 36–68px) is the credential.
- The lede must communicate (a) pouk.ai is technical consulting that ships with AI, (b) the audience is teams who already build, (c) the gap pouk.ai exists to close — surfaced as **the final integrated sentence of the lede** (per D-11). The structural lock is: a single integrated link sentence at the end of the lede, not a tertiary line under the CTA.
- **Per D-12, the status line copy carries over verbatim from the current `index.html`** at cutover. The pulse dot reinforces it. The status line is part of the page's restraint — changing it risks signalling "now a real site" instead of "an operator." Avoid "we're hiring," "join the waitlist," or any marketing flourish. Re-evaluation post-cutover is fine; cutover-day copy is byte-identical.
- The email link must remain the primary conversion path. No form, no widget, no scheduling embed at launch.

`Draft:` Post-cutover lede-extension wording: "Most AI projects fail to deliver. [Here's why →](/why-ai)." This is the structural lock per D-11 — a single integrated link sentence at the end of the lede. The exact wording is a `Draft:` example; Arian approves final copy.

Rejected alternatives (do not implement): a tertiary line below the email CTA; an inline `<a>` from one of the existing lede words.

## 6. Content data shape

The homepage is hardcoded prose in the page template — no JSON file. The four content surfaces driving the rest of the site (`roles.json`, `principles.json`, `failure-modes.json`) don't apply here. If, post-launch, the homepage starts pulling a featured stat or quote from a content file, promote then.

## 7. User flow

- **Entry**: Direct (`pouk.ai` typed); LinkedIn or X profile link; founder DM / email signature; from `/why-ai` or `/roles` via the top nav `SiteShell` wordmark click; from search ("pouk ai consulting").
- **Read path**: Wordmark → tagline → lede → status → email link → optional `/why-ai` click. Total dwell time target: under 20 seconds on first visit. The page rewards short reading; long reading means the lede failed.
- **Exit / conversion**: Three valid exits — (a) click into `/why-ai`, (b) `mailto:hello@pouk.ai`, (c) close with intent to return. Per the funnel, (a) is the most common for new visitors and (b) for returning prospects.

## 8. Acceptance criteria

- [ ] Route renders at `/`.
- [ ] All sections in the IA (1–3) are present: `SiteShell` (top nav + footer) and `Hero` render; **IA item 3 is a negative assertion — no sections render between the `Hero` and the `SiteShell` footer.**
- [ ] `Hero` molecule renders with title, lede, status, and CTA slots populated.
- [ ] `StatusBadge` renders with the pulse animation (CSS keyframes, no JS) and matches the current holding page's behavior.
- [ ] **Status-line text is byte-identical** to the pre-cutover `index.html` status-line copy (per D-12 — parity AC).
- [ ] Lede ends in **a single integrated link sentence** with `href="/why-ai"` (per D-11). The hand-off is part of the lede prose, not a separate line under the CTA. Final wording: Arian.
- [ ] **No anchor or text node renders between the email-CTA element and the `SiteShell` footer.** (Structural form of the "no tertiary line below the CTA" rejection — covers paraphrased variants of the rejected alternative, not just the literal "Read why AI projects fail →" string.)
- [ ] Email link renders as `<a href="mailto:hello@pouk.ai">`.
- [ ] No additional sections (services, about, testimonials, logo bar) are present.
- [ ] Visual parity with the current `index.html` on `/` confirmed per masterplan section 6.1: "indistinguishable" on screenshot diff.
- [ ] Lighthouse mobile: 100/100/100/100.
- [ ] Zero client-side JS shipped on `/` (per masterplan section 4.3 — the zero-JS contract is strictest on the homepage).
- [ ] HTML weight stays within +10% of the current `index.html` (per masterplan section 6.1).
- [ ] `prefers-reduced-motion` honored — pulse and any entrance animations disabled per the current page's behavior.
- [ ] `<title>`, `<meta description>`, OG image, and JSON-LD render correctly with values appropriate to the post-cutover page (canonical: `https://pouk.ai/`).
- [ ] `SiteShell` top nav links to `/why-ai`, `/roles`, `/principles` work; wordmark links back to `/`.
- [ ] Spec section 5 content outcomes are met by the shipped copy, evidenced by **`meta/content/drafts/pages/home.md` carrying `status: Approved`** (the content draft is the tracked-approval artifact; "Arian-verified" without an artifact is unenforceable per the PM-agent DoD §7).

## 9. Open questions / dependencies

The original draft's open questions (lede-extension treatment, status-line copy) were resolved via `meta/decisions/launch-readiness.md` on 2026-05-13. See decisions D-11 and D-12.

Remaining dependencies blocking `Built`:

- **DS dependency — `Hero` molecule, `SiteShell` organism, `StatusBadge` atom.** `Hero` and `SiteShell` are in scope for DS Phases 1.2 and 1.3 respectively. `StatusBadge` already exists. Confirm `Hero` API exposes `status` and `cta` slots, and that `SiteShell` accepts a route list and `currentRoute`. Tracked in `meta/masterplan.md` section 3.2.
- **`SiteShell` current-route handling.** Confirm with Claude Design whether `currentRoute="/"` is a valid current state, or whether the home is the canonical no-current state. Affects nav visual on `/`.
- **Visual-parity gate — masterplan section 6.1.** This spec's success is bound to a screenshot-diff parity check before any DNS swap. Coordinate with the engineer's cutover checklist. The status-line parity check (per D-12) is part of this gate.
- **Brand assets — backlog blockers.** `og.png`, `apple-touch-icon.png`, favicon, robots.txt, sitemap.xml are launch-blockers per the existing `meta/backlog.md`. They must land before `/` ships under the canonical domain.

## 10. Out of scope

- A services / about / pricing block on `/`. Restraint is the credential; adding sections is a regression.
- A newsletter signup, scheduling widget, or contact form. `mailto:` only at launch.
- A featured-content carousel ("read our latest principle"). The homepage is a doorway.
- Per-visit personalization, A/B copy variants, or dynamic stat insertion. Zero-JS contract.
- A logo bar / customer logos. Pouk.ai is too early.
- Adjusting the typographic rhythm of the holding page during cutover. Parity first, evolution later.
- An interstitial / cookie banner. None of the launch dependencies justify one.
