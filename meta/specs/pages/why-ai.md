# Spec: Why AI

**Route**: `/why-ai`
**Status**: Draft
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Sections 2A (repo boundaries), 4.1 (site layout), 4.4 (long-form content as data), 6 (cutover)

---

## 1. Purpose

`/why-ai` is the thesis page that establishes the market gap pouk.ai exists to close. Before a prospect cares about *which* role pouk.ai plays or *how* pouk.ai operates, they have to believe there is a real, expensive problem worth paying a consultant to fix. This page is that argument: a quantified case that most AI projects fail to capture ROI, a structured taxonomy of *why* (the five failure modes), and a discovery-question CTA that converts intellectual agreement into a conversation. It is the top of the funnel — the page that frames why anyone hires us at all.

## 2. Audience

- **Primary**: Founders, COOs, and engineering leaders at companies that have already tried AI and been disappointed — or are about to commit budget and want to de-risk the decision. They are skeptical, time-constrained, and have read at least three "state of AI" decks this quarter. They land here from a LinkedIn share, a founder DM, or a sent email signature.
- **Secondary**: Operators who are AI-curious but haven't started yet, and analysts/journalists looking for a sharp framing of the deployment gap. Both groups should leave with a precise vocabulary (the five failure modes) they didn't have when they arrived.

## 3. Success criteria

- **Behavior**: The visitor reaches the end of the page and either (a) clicks through to `/roles` to find their specific shape of help, or (b) emails `hello@pouk.ai` referencing one of the four discovery questions or one of the five failure modes by name.
- **Signal**: Qualitatively — inbound emails quote a stat or failure-mode label from the page ("we're stuck in failure mode 3", "we need the data-readiness audit"). When analytics arrive, scroll depth past the failure modes (~60% of page height) and click-through to `/roles` or `mailto:` are the two read-outs.
- **Failure mode**: The visitor reads it as a generic "AI is hard" essay — no quantified gap, no specific diagnosis, no obvious next step. If a reader walks away unable to repeat at least one stat and one failure mode, the page failed even if it rendered perfectly.

## 4. Information architecture

The page reads top-to-bottom as a single editorial argument. Sticky TOC is recommended on desktop given the length; mobile gets natural scroll. The DS `Hero` molecule frames the page header; `FailureMode` is the per-mode unit; `Stat` is the typographic treatment for headline numbers.

1. `SiteShell` — top nav (Why AI marked current) + hairline footer.
2. `Hero` — page eyebrow ("Why AI"), thesis-statement title, lede summarizing the deployment gap, no inline CTA (the page itself is the CTA).
3. **Opening argument** — three to four short paragraphs establishing the headline stats (12–18%, 85%, 15%, $300B). Stats render as `Stat` atoms — large numeral, short caption, optional source — pulled out of body prose where the page lives or dies by typographic emphasis. Closes with the line "This is the gap your consulting practice lives in."
4. **Section heading** — "Why projects fail — the five failure modes." Plain semantic `<h2>`, no DS molecule needed here.
5. **Five failure modes** — five `FailureMode` molecules in sequence. Each contains: index numeral (1–5), title, body prose. The 500% and 61% stats inside the body of modes 2 and 5 render as `Stat` atoms inline within the failure-mode body, not as separate sections. Anchors: `#data-readiness`, `#wrong-use-case`, `#integration`, `#governance`, `#change-management`.
6. **Section heading** — "What the leaders do differently."
7. **Leaders pattern** — four bullets (top-down strategy / vertical specialization / measurement from day one / iterative rollout) rendered as a list, followed by the three quartile stats (1.7×, 3.6×, 2.7×) as `Stat` atoms in a row or grid.
8. **Section heading** — "The consulting angle."
9. **Consulting angle** — two paragraphs framing pouk.ai's position at the intersection of technical and operational fluency. Closes with "the questions to ask in a discovery conversation."
10. **Discovery questions block** — the four discovery questions, numbered, in italic or otherwise visually distinct from body prose. <NEEDS: a treatment for a "discovery questions" callout — could be a styled `<ol>` inside a bounded card, or just an `<ol>` with editorial type. The DS doesn't have a "callout" molecule today and shouldn't need one; this lives in site CSS.>
11. **End CTA** — single sentence + email link. The conversation-starter, not a separate marketing block.
12. **References** — list of source links with publication names, plus the note about cleaned-from-tracker URLs. Type-de-emphasized (`--fg-muted`).
13. **"Last reviewed" footer line** — date stamp committing to annual refresh (e.g., "Last reviewed: May 2026"). Lives inside the page content, above the global `SiteShell` footer.

## 5. Content requirements

The substance lives verbatim in `meta/backlog.md` under the "Why AI page" block. Engineer reads copy from there into `src/content/failure-modes.json` (per the content data spec at `meta/specs/content/failure-modes.json.md`) and the page template renders the rest of the prose inline.

Outcomes the copy must hit:

- The opening paragraph must establish the deployment gap as **quantified, sourced, and current** — at least three of the four headline stats must appear in the first viewport on desktop. Without numbers, the page collapses into opinion.
- The five failure modes must read as **a taxonomy a reader can recall by name**, not as five paragraphs of similar texture. Each title should be a label a prospect can adopt ("We're a Failure Mode 1 — our data isn't ready").
- The "What the leaders do differently" section must imply that pouk.ai's engagement pattern *matches* what leaders do — without saying so explicitly. The reader connects the dots.
- The "Consulting angle" section must position pouk.ai as the diagnostic partner ("let me understand your problem first") versus the vendor ("here's our AI product"). This sentence is load-bearing; every other section sets it up.
- The four discovery questions must read as questions Arian would actually ask in a first call — they must survive being copy-pasted into a sales email.
- The end CTA must offer **a way to start the conversation**, not a "book a demo" button. The brand competes by being a person, not a funnel.

`Draft:` The page lede could read: "Only 12–18% of companies deploying AI are capturing meaningful ROI. The rest are stuck in one of five failure modes. Here they are — and what to do about each." This is a *direction*, not final copy. Arian writes or approves the final.

## 6. Content data shape

The five failure modes are stored in `src/content/failure-modes.json` per the schema at `meta/specs/content/failure-modes.json.md`. The opening argument, leaders-pattern, consulting-angle, discovery questions, and references can live as page-template prose for now (only one page renders them; no reuse argues for a JSON file yet). If a second page ever needs them, promote to JSON then.

The four headline stats in the opening argument (12–18%, 85%, 15%, $300B) and the three quartile stats (1.7×, 3.6×, 2.7×) render as `Stat` atoms with hardcoded values in the page template. They are not data — they are editorial assertions tied to a specific argument and would be misleading if reused elsewhere.

## 7. User flow

- **Entry**: Direct link from a founder DM, LinkedIn share, X share, or pouk.ai email signature. Some arrive from `/` after clicking the "Most AI projects fail to deliver. Here's why →" lede link. A smaller fraction lands here as the first touch via search ("AI deployment gap", "why AI projects fail 2026").
- **Read path**: Hero → opening argument → scan failure-mode titles → read 2–3 failure modes that resonate → leaders section (skim) → consulting angle (close read) → discovery questions → end CTA. Sticky TOC on desktop lets a returning reader jump directly to a failure mode they want to reference.
- **Exit / conversion**: Two acceptable exits — (a) `mailto:hello@pouk.ai` from the end CTA, (b) click into `/roles` from a footer-of-page next-step link to self-identify which role of help applies. A third, weaker exit is the reader saving/sharing the URL; that's acceptable but doesn't count as conversion.

## 8. Acceptance criteria

- [ ] Route renders at `/why-ai`.
- [ ] All sections in the IA (1–13) are present and ordered as specified.
- [ ] Five `FailureMode` molecules render in the correct order with anchors `#data-readiness`, `#wrong-use-case`, `#integration`, `#governance`, `#change-management`.
- [ ] Seven headline stats (12–18%, 85%, 15%, $300B in the opener; 1.7×, 3.6×, 2.7× in the leaders section) render as `Stat` atoms — not inline emphasized prose. The 500% and 61% stats appear as `Stat` atoms within failure-mode bodies (modes 2 and 5).
- [ ] The four discovery questions render as a numbered list inside a visually distinct callout block (per IA item 10).
- [ ] References section lists all four sources with linked text matching the masterplan / backlog source — anchor text is the article title, surfacing the publication via trailing em-dash.
- [ ] "Last reviewed: <month year>" footer line is present and matches the page's last content review date.
- [ ] End CTA renders an `<a href="mailto:hello@pouk.ai">` with copy that references the discovery conversation (final wording: Arian).
- [ ] `<title>` and `<meta description>` reflect the deployment-gap framing and contain at least one quantified stat in the description.
- [ ] Page is reachable from `SiteShell` top nav with the Why AI item marked current.
- [ ] Page links to `/roles` at least once (footer-of-page next step) and to `mailto:hello@pouk.ai` at least once (end CTA).
- [ ] Lighthouse mobile: 100/100/100/100.
- [ ] No client-side JS shipped (sticky TOC, if implemented, is CSS-only via `position: sticky` — no scroll-spy hydration island in launch scope).
- [ ] All content in section 5 outcomes is met by the shipped copy (Arian-verified).
- [ ] `prefers-reduced-motion` honored — no animation on stats or entrance.

## 9. Open questions / dependencies

- **DS dependency — `FailureMode` molecule.** Required and listed as in scope for DS Phase 1.3. Cannot ship until the molecule is published in `@poukai/ui@0.1.0`. Tracked in `meta/masterplan.md` section 3.2.
- **DS dependency — `Stat` atom.** Required and listed as in scope for DS Phase 1.2 (`@poukai/ui@0.1.0-alpha.1`). Site needs both `align="start"` (inline within `FailureMode` body) and the standalone large display variant. Confirm `Stat` supports both before this page can be built end-to-end.
- **<NEEDS: a "callout" treatment for the four discovery questions.>** Not a DS primitive — this is site CSS sitting around an `<ol>`. Decision is the engineer's, with brand alignment by Arian.
- **Sticky TOC — decision pending Arian.** Recommended for desktop given the length; mobile probably doesn't need it. If we commit to zero-JS, this is `position: sticky` only, no scroll-spy. Listed in the backlog's "Why AI page" open design questions.
- **Citation style — decision pending Arian.** Backlog flags footnote superscripts vs. inline parentheticals. Recommendation: inline parentheticals on first mention (e.g., "(Gartner)"), then a consolidated References list at the bottom. Footnote superscripts add JS or complex CSS for one page's worth of content. Arian's call.
- **Dataset vintage — decision pending Arian.** Recommendation: ship with a "Last reviewed: <month year>" footer line and an internal calendar reminder to refresh annually. The references' own dates carry the rest. Listed in the backlog's open design questions.
- **Homepage hand-off — coordinated with `/` spec.** When `/why-ai` ships, the homepage lede must add "Most AI projects fail to deliver. Here's why →" pointing here. Coordinated in `meta/specs/pages/home.md`.
- **Content lift — Arian-owned.** The verbatim copy in `meta/backlog.md` is approved as the source. Any edits to that copy are Arian's, not the engineer's. If the engineer hits a question while implementing, route via Arian.

## 10. Out of scope

- Interactive elements (scroll-spy TOC with active-state highlighting, animated stat counters, hover-card definitions for failure-mode titles). Zero-JS contract per masterplan section 4.3.
- A "Download the deployment-gap PDF" CTA or any lead-magnet pattern. The page itself is the asset.
- A newsletter signup, contact form, or scheduling widget. The conversion is `mailto:` only at this stage; richer contact flows are deferred to a separate `features/contact-flow.md` spec if ever needed.
- Case studies, customer logos, or testimonial blocks. Pouk.ai is too early for these and forcing them dilutes the page's argument.
- Visual imagery / illustrations. The page is typography-and-stats first per the brand's restraint principle. If illustration enters, it enters via a separate visual-design pass; this spec doesn't define it.
- A second route per failure mode (e.g., `/why-ai/data-readiness`). Failure modes are anchors on this page; they are not routes.
