# Spec: Visitor-to-conversation flow

**Surfaces affected**: `/`, `/why-ai`, `/roles`, `/principles`, `mailto:hello@pouk.ai`
**Status**: Draft
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Sections 4.1 (site layout), 2A (decision authority), 6 (cutover)

---

## 1. Purpose

This spec defines the prospect journey across the four-route site, from first touch to a conversation with Arian. It's the connective tissue that the four page specs (`pages/home.md`, `pages/why-ai.md`, `pages/roles.md`, `pages/principles.md`) hang from — it answers "what order do these pages read in, what hand-offs exist between them, and what counts as a conversion?" The flow is opinionated: every page is funnel-aware, every link between pages is deliberate, and every dead-end is a defect.

## 2. Audience

- **Primary**: `pouk-ai-engineer`, who reads this spec to wire inter-page links, the `SiteShell` route order, and the homepage hand-off correctly.
- **Secondary**: Arian, who uses this flow as the brief for how to talk about the site to prospects ("read why-ai first, then roles, then principles").

## 3. Success criteria

- **Behavior**: A first-time visitor follows the canonical path **`/` → `/why-ai` → `/roles` → `mailto:`** in the majority of cases, with `/principles` reached as a trust-loop closer either pre- or post-email. A returning visitor follows the shorter path **`/roles` (or `/principles`) → `mailto:`**.
- **Signal**: Qualitatively — inbound emails arrive with funnel-aware context ("I read your why-ai page and we're in failure mode 3 — Builder seems right"). Referrer DMs cite specific anchors. When analytics arrive, the cross-page click-through pattern matches the canonical path above on at least the majority of multi-page sessions.
- **Failure mode**: A visitor lands on `/why-ai` or `/roles` directly (deep link from a share) and **cannot find the next step**. Or, opposite failure: the funnel is so prescriptive that a reader who just wanted to read `/principles` and leave feels pushed into a sales path. Both signal a bad flow.

## 4. The canonical journey

Five stages, mapped to entry source, page sequence, and conversion event.

### Stage 1 — First touch (`/`)

- **Entry sources**: Direct (`pouk.ai` typed), LinkedIn / X profile bio link, email signature on a sent message, search ("pouk ai", "pouk ai consulting").
- **What happens**: Visitor reads the tagline + lede + status + email link. Two acceptable exits — click into `/why-ai` from the lede hand-off link, or email immediately. A third valid outcome is the visitor leaving with the brand registered, intent to return.
- **Spec reference**: `meta/specs/pages/home.md`.

### Stage 2 — Diagnosis (`/why-ai`)

- **Entry sources**: From `/` via the lede hand-off; direct (LinkedIn share, founder DM, X post linking to `/why-ai`); search ("AI deployment gap", "why AI projects fail").
- **What happens**: Visitor reads the opening argument, scans failure modes, deep-reads two or three, scrolls through the leaders pattern and consulting angle, lands on the discovery questions and end CTA. Two exits — click into `/roles` (the engineer wires a clear "next: which role fits your situation? →" link at the bottom of `/why-ai`), or email directly with reference to a stat or failure mode.
- **Spec reference**: `meta/specs/pages/why-ai.md`.

### Stage 3 — Self-identification (`/roles`)

- **Entry sources**: From `/why-ai` end-of-page next-step link; from a referrer's DM that includes a role anchor (e.g., `pouk.ai/roles#automator`); from the top nav.
- **What happens**: Visitor scans the four roles, matches their situation to a "Hired by" line, reads that role's body, scrolls to the end CTA. Primary exit — `mailto:hello@pouk.ai` with the role name carried as the opening line of the email.
- **Spec reference**: `meta/specs/pages/roles.md`.

### Stage 4 — Trust loop (`/principles`)

- **Entry sources**: From the top nav (a prospect mid-conversation closing the trust loop); from a referrer's DM linking to a specific principle anchor; from a social share screenshot; rarely as a first touch.
- **What happens**: Visitor reads the intro, scans the ten principles, close-reads two or three, reaches the conclusion. Exit is often **no immediate click** — a quiet trust-up that converts on a subsequent email (next day, next week). Some readers email immediately citing a principle by number.
- **Position in the funnel**: `/principles` is **either pre- or post-`mailto:`**. Pre-email readers are de-risking the consultant. Post-email readers are reading after a first reply from Arian, validating their choice. Both are valid.
- **Spec reference**: `meta/specs/pages/principles.md`.

### Stage 5 — Conversion (`mailto:hello@pouk.ai`)

- **What counts as conversion**: A first email to `hello@pouk.ai` from a prospect not previously in conversation, or a LinkedIn DM equivalent. Volume target is qualitative for now — Arian's read of inbound quality and reply rate.
- **What does not count**: A page view, a click to social, a click to a citation URL on `/why-ai`. These are funnel inputs, not conversions.

## 5. Inter-page hand-offs

Each hand-off below is a specific link the engineer must wire. These are the funnel's mechanics — without them, the flow is theoretical.

| From | To | Trigger | Spec location |
| --- | --- | --- | --- |
| `/` | `/why-ai` | Lede sentence ends in "Most AI projects fail to deliver. Here's why →" | `pages/home.md` section 5 |
| `/why-ai` | `/roles` | End-of-page next-step link below the references section ("Next: which role fits your situation? →") | `pages/why-ai.md` section 4 (footer-of-page next step) |
| `/why-ai` | `mailto:` | End CTA after the discovery questions block | `pages/why-ai.md` section 4 |
| `/roles` | `mailto:` | End CTA after the four `RoleCard`s | `pages/roles.md` section 4 |
| `/principles` | `mailto:` | Minimal end-CTA line below the conclusion | `pages/principles.md` section 4 |
| Any | Any | Top nav via `SiteShell`, order: Why AI → Roles → Principles | This spec, section 6 |
| Any | `/` | `SiteShell` wordmark click | `pages/home.md` section 8 |

The masterplan section 2A reserves nav contents as **site repo's** decision. The order below is this spec's recommendation; Arian's call.

## 6. Top-nav order

**Opinionated call: nav order is `Why AI`, `Roles`, `Principles` — mirroring the funnel left-to-right.** Defended: a first-time visitor scans the nav left-to-right; placing the diagnosis page first signals where the journey starts. A returning visitor uses the nav as a jump table; the funnel order is still the most defensible default since it matches the canonical path. Alternative orders considered: alphabetical (rejected — `Principles, Roles, Why AI` is meaningless to a prospect); reverse-funnel `Principles → Roles → Why AI` (rejected — front-loads character at the cost of diagnosis). Locked unless Arian overrides.

The homepage `/` is reachable via the `SiteShell` wordmark, not a separate "Home" nav item. This is consistent with the holding page's restraint and with `pages/home.md` section 4.

## 7. Entry-source distribution (assumed, pre-analytics)

These are working assumptions, not measured truth — re-baseline once analytics are in place.

- **`/` direct** — highest single share of first-touches. Founder DMs, LinkedIn bio, email signatures all point here.
- **`/why-ai` deep links** — meaningful share once Arian starts sharing the page publicly (LinkedIn posts, X threads). Likely the second-largest source.
- **`/roles` deep links** — moderate share; mostly from referrers ("I think you need their Automator work — `pouk.ai/roles#automator`").
- **`/principles` deep links** — low absolute volume, high quality. Mostly social shares of single-principle screenshots.

Implication for engineer: every page must be **self-sufficient at first touch** — a clear path forward, the email address one click away, brand identity unmistakable. The `SiteShell` is the floor of that contract on every page.

## 8. Acceptance criteria

- [ ] `/` includes a lede-embedded link to `/why-ai` per `pages/home.md` section 5.
- [ ] `/why-ai` includes a next-step link to `/roles` below the references section.
- [ ] `/why-ai` includes a `mailto:hello@pouk.ai` link in the end CTA.
- [ ] `/roles` includes a `mailto:hello@pouk.ai` link in the end CTA.
- [ ] `/principles` includes a `mailto:hello@pouk.ai` link in the end-CTA line.
- [ ] `SiteShell` top nav exposes `/why-ai`, `/roles`, `/principles` in that order on every page.
- [ ] `SiteShell` wordmark links to `/` on every page.
- [ ] Each route, on first touch with no referrer, has at least one visible next-step (a nav link, an inter-page link, or `mailto:`) above the fold on mobile.
- [ ] No page on the site is a dead-end — every page either funnels to `mailto:` or offers a clearly-labeled next page.
- [ ] No "back to home" link is required from `/why-ai`, `/roles`, or `/principles` — the `SiteShell` wordmark covers that affordance.
- [ ] Deep-link anchors (`/roles#builder`, `/principles#momentum`, `/why-ai#governance`) function and the matching content is above the fold post-scroll.

## 9. Open questions / dependencies

- **Nav order — Arian's final call.** Recommendation locked above; Arian can override.
- **Email address — locked.** `hello@pouk.ai` is the single contact point. LinkedIn DM is a secondary channel handled outside the site (linked from `SiteShell` footer per masterplan section 3.2 if `SiteShell` exposes social links; otherwise not surfaced).
- **DS dependency — `SiteShell`.** Required to enforce the nav order and the wordmark hand-off on every page. In scope for DS Phase 1.3.
- **Analytics — out of scope.** This spec relies on qualitative signals (inbound email content, referrer cite patterns) at launch. Once analytics arrive, this spec's section 3 and 7 should be revisited against measured data.
- **Contact-flow extension — backlog candidate.** If `mailto:` is later replaced or augmented (scheduling link, contact form, intro questionnaire), a separate `features/contact-flow.md` spec governs that change. Not in launch scope.

## 10. Out of scope

- Funnel analytics, A/B testing infrastructure, conversion-rate optimization. Zero-JS contract; qualitative signal only at launch.
- A "next intake" / waitlist flow. The brand competes by being a person; calendared availability is handled in-conversation.
- Lead-magnet downloads, gated content, or email-capture forms.
- Multi-step contact form, intro questionnaire, or scheduling embed.
- Cross-domain funnel tracking (LinkedIn → site, X → site). Out of scope.
- Personalization based on referrer or visit count.
- Internationalization / regional flows. English-only at launch.
