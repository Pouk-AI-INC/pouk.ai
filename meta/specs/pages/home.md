# Spec: Home

**Route**: `/`
**Status**: Draft
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Sections 4.1 (site layout), 4.3 (zero-JS contract), 6 (cutover)

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
2. `Hero` — eyebrow (none, or `Wordmark` from the SiteShell carrying the role), title (the brand tagline), lede (two sentences ending in the `/why-ai` link), status (`StatusBadge` with pulse — "shipping" or equivalent state copy), CTA (the email link).
3. **End — no further sections.** The hairline footer from `SiteShell` closes the page. No "About," no "Services," no testimonial block, no logo bar.

## 5. Content requirements

The tagline + body lede + status text + email link carry over from the current holding page verbatim where possible; only the final sentence of the lede changes.

Outcomes the copy must hit:

- The tagline must continue to read as **the brand mark itself** — restrained, serif-led, refined. The current treatment (Instrument Serif `<h1>` clamp 36–68px) is the credential.
- The lede must communicate (a) pouk.ai is technical consulting that ships with AI, (b) the audience is teams who already build, (c) the next sentence is "and here's the gap we exist to close — read why →." This last clause is the **only structural change** from the current holding page.
- The status line must continue to read as a live, human signal — "currently shipping for X" or "next intake Y." The pulse dot reinforces it. Avoid "we're hiring," "join the waitlist," or any marketing flourish.
- The email link must remain the primary conversion path. No form, no widget, no scheduling embed at launch.

`Draft:` Post-cutover lede direction: "[Current lede sentence carries over.] Most AI projects fail to deliver. [Here's why →](/why-ai)." The bracketed link sentence is the only new copy. Arian writes the final.

`Draft:` Alternative — keep the current lede unchanged, and add a separate tertiary line below the email CTA: "Why AI projects fail →" linking to `/why-ai`. Lower-emphasis hand-off, preserves the holding page's exact visual rhythm. Decision pending Arian.

## 6. Content data shape

The homepage is hardcoded prose in the page template — no JSON file. The four content surfaces driving the rest of the site (`roles.json`, `principles.json`, `failure-modes.json`) don't apply here. If, post-launch, the homepage starts pulling a featured stat or quote from a content file, promote then.

## 7. User flow

- **Entry**: Direct (`pouk.ai` typed); LinkedIn or X profile link; founder DM / email signature; from `/why-ai` or `/roles` via the top nav `SiteShell` wordmark click; from search ("pouk ai consulting").
- **Read path**: Wordmark → tagline → lede → status → email link → optional `/why-ai` click. Total dwell time target: under 20 seconds on first visit. The page rewards short reading; long reading means the lede failed.
- **Exit / conversion**: Three valid exits — (a) click into `/why-ai`, (b) `mailto:hello@pouk.ai`, (c) close with intent to return. Per the funnel, (a) is the most common for new visitors and (b) for returning prospects.

## 8. Acceptance criteria

- [ ] Route renders at `/`.
- [ ] All sections in the IA (1–3) are present.
- [ ] `Hero` molecule renders with title, lede, status, and CTA slots populated.
- [ ] `StatusBadge` renders with the pulse animation (CSS keyframes, no JS) and matches the current holding page's behavior.
- [ ] Lede contains a link with `href="/why-ai"` whose anchor text matches the approved copy direction (final wording: Arian).
- [ ] Email link renders as `<a href="mailto:hello@pouk.ai">`.
- [ ] No additional sections (services, about, testimonials, logo bar) are present.
- [ ] Visual parity with the current `index.html` on `/` confirmed per masterplan section 6.1: "indistinguishable" on screenshot diff.
- [ ] Lighthouse mobile: 100/100/100/100.
- [ ] Zero client-side JS shipped on `/` (per masterplan section 4.3 — the zero-JS contract is strictest on the homepage).
- [ ] HTML weight stays within +10% of the current `index.html` (per masterplan section 6.1).
- [ ] `prefers-reduced-motion` honored — pulse and any entrance animations disabled per the current page's behavior.
- [ ] `<title>`, `<meta description>`, OG image, and JSON-LD render correctly with values appropriate to the post-cutover page (canonical: `https://pouk.ai/`).
- [ ] `SiteShell` top nav links to `/why-ai`, `/roles`, `/principles` work; wordmark links back to `/`.
- [ ] Spec section 5 outcomes are met by the shipped copy (Arian-verified).

## 9. Open questions / dependencies

- **DS dependency — `Hero` molecule, `SiteShell` organism, `StatusBadge` atom.** `Hero` and `SiteShell` are in scope for DS Phases 1.2 and 1.3 respectively. `StatusBadge` already exists. Confirm `Hero` API exposes `status` and `cta` slots, and that `SiteShell` accepts a route list and `currentRoute`. Tracked in `meta/masterplan.md` section 3.2.
- **Lede treatment — decision pending Arian (recommendation in section 5).** Recommended: extend the current lede with the hand-off sentence ending in "Here's why →". Alternative: tertiary line below the email CTA. Recommendation favors A — the integrated lede preserves a single typographic block.
- **Status line copy — Arian-owned.** Current holding page status text needs Arian's call on whether it stays unchanged at cutover or gets updated for "shipping the four-route site" / next phase.
- **`SiteShell` current-route handling.** Confirm with Claude Design whether `currentRoute="/"` is a valid current state, or whether the home is the canonical no-current state. Affects nav visual on `/`.
- **Visual-parity gate — masterplan section 6.1.** This spec's success is bound to a screenshot-diff parity check before any DNS swap. Coordinate with the engineer's cutover checklist.
- **Brand assets — backlog blockers.** `og.png`, `apple-touch-icon.png`, favicon, robots.txt, sitemap.xml are launch-blockers per the existing `meta/backlog.md`. They must land before `/` ships under the canonical domain.

## 10. Out of scope

- A services / about / pricing block on `/`. Restraint is the credential; adding sections is a regression.
- A newsletter signup, scheduling widget, or contact form. `mailto:` only at launch.
- A featured-content carousel ("read our latest principle"). The homepage is a doorway.
- Per-visit personalization, A/B copy variants, or dynamic stat insertion. Zero-JS contract.
- A logo bar / customer logos. Pouk.ai is too early.
- Adjusting the typographic rhythm of the holding page during cutover. Parity first, evolution later.
- An interstitial / cookie banner. None of the launch dependencies justify one.
