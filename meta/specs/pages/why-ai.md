# Spec: Why AI

**Route**: `/why-ai`
**Status**: Approved
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Sections 2A (repo boundaries), 4.1 (site layout), 4.4 (long-form content as data), 6 (cutover)
**Decisions log**: D-01 (citation style), D-02 (sticky desktop TOC), D-03 (dataset-vintage footer), D-04 (discovery-questions callout), D-05 (stats extraction) — all resolved via `meta/decisions/launch-readiness.md` on 2026-05-13.

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

The page reads top-to-bottom as a single editorial argument. A sticky right-rail TOC renders on desktop (≥ 1024px); mobile falls back to natural scroll. The DS `Hero` molecule frames the page header; `FailureMode` is the per-mode unit; `Stat` is the typographic treatment for headline numbers. Cited claims throughout the page carry footnote-style superscripts that link to the References block (item 12).

1. `SiteShell` — top nav (Why AI marked current) + hairline footer.
2. `Hero` — page eyebrow ("Why AI"), thesis-statement title, lede summarizing the deployment gap, no inline CTA (the page itself is the CTA).
3. **Sticky right-rail TOC (desktop ≥ 1024px)** — anchored list linking to `#data-readiness`, `#wrong-use-case`, `#integration`, `#governance`, `#change-management`. CSS-only via `position: sticky` — no scroll-spy / hydration island. Hidden below the desktop breakpoint; mobile uses scroll. Per D-02.
4. **Opening argument** — three to four short paragraphs establishing the headline stats (12–18%, 85%, 15%, $300B). Stats render as `Stat` atoms — large numeral, short caption, optional source — pulled out of body prose where the page lives or dies by typographic emphasis. Cited claims carry footnote-style superscripts (e.g., `¹`) that link to the corresponding entry in the References block (item 12). Closes with the line "This is the gap your consulting practice lives in."
5. **Section heading** — "Why projects fail — the five failure modes." Plain semantic `<h2>`, no DS molecule needed here.
6. **Five failure modes** — five `FailureMode` molecules in sequence. Each contains: index numeral (1–5), title, body prose, and (where present) a typed `stats` array rendered as `Stat` atoms inline within the failure-mode body. The 500% figure (Failure Mode 2 — Wrong use case) and the 61% figure (Failure Mode 5 — Change management) are stored in the `stats` array of their parent failure mode per D-05; they are not inline `<strong>` in the body prose. Anchors: `#data-readiness`, `#wrong-use-case`, `#integration`, `#governance`, `#change-management`.
7. **Section heading** — "What the leaders do differently."
8. **Leaders pattern** — four bullets (top-down strategy / vertical specialization / measurement from day one / iterative rollout) rendered as a list, followed by the three quartile stats (1.7×, 3.6×, 2.7×) as `Stat` atoms in a row or grid.
9. **Section heading** — "The consulting angle."
10. **Consulting angle** — two paragraphs framing pouk.ai's position at the intersection of technical and operational fluency. Closes with "the questions to ask in a discovery conversation."
11. **Discovery questions block** — the four discovery questions rendered as an inline italic `<blockquote>` using the same body type as surrounding prose (no boxed surface, no card, no hero-typography pull-quote). Per D-04. Numbered list inside the blockquote is acceptable; the visual distinction is the italic body voice, not a containing surface.
12. **End CTA** — single sentence + email link. The conversation-starter, not a separate marketing block.
13. **References** — numbered list of source links with publication names; each entry is the target of a footnote-style superscript from the body. Plus the note about cleaned-from-tracker URLs. Type-de-emphasized (`--fg-muted`). Per D-01 this block is load-bearing: every superscript in the body must round-trip to a numbered entry here.
14. **"Last reviewed" footer line** — `Last reviewed: 2026-05-13` plus a one-line commitment to annual refresh. Lives inside the page content, above the global `SiteShell` footer. Per D-03.

## 5. Content requirements

The substance lives verbatim in `meta/backlog.md` under the "Why AI page" block. Engineer reads copy from there into `src/content/failure-modes.json` (per the content data spec at `meta/specs/content/failure-modes.json.md`) and the page template renders the rest of the prose inline.

Outcomes the copy must hit:

- The opening paragraph must establish the deployment gap as **quantified, sourced, and current** — at least three of the four headline stats must appear in the first viewport on desktop. Without numbers, the page collapses into opinion.
- **Every cited claim carries a footnote-style superscript** (e.g., `¹`, `²`) that links to the corresponding numbered entry in the References block (per D-01). Sources should not be inline parentheticals — keep body prose uncluttered, push attribution to References.
- The five failure modes must read as **a taxonomy a reader can recall by name**, not as five paragraphs of similar texture. Each title should be a label a prospect can adopt ("We're a Failure Mode 1 — our data isn't ready").
- The 500% figure (Failure Mode 2) and the 61% figure (Failure Mode 5) are **extracted from prose into the typed `stats` array** on their parent failure mode (per D-05). The surrounding body sentence must read cleanly with the figure removed — the adjacent `Stat` atom carries the number. Arian approves the rewritten sentences.
- The "What the leaders do differently" section must imply that pouk.ai's engagement pattern *matches* what leaders do — without saying so explicitly. The reader connects the dots.
- The "Consulting angle" section must position pouk.ai as the diagnostic partner ("let me understand your problem first") versus the vendor ("here's our AI product"). This sentence is load-bearing; every other section sets it up.
- The four discovery questions must read as questions Arian would actually ask in a first call — they must survive being copy-pasted into a sales email. They render as an inline italic `<blockquote>` in the same body type as surrounding prose (per D-04) — no boxed surface, no hero-typography pull-quote.
- The end CTA must offer **a way to start the conversation**, not a "book a demo" button. The brand competes by being a person, not a funnel.
- The "Last reviewed: 2026-05-13" footer line carries the annual-refresh commitment (per D-03). Wording is brief, single-line, type-de-emphasized.

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
- [ ] All sections in the IA (1–14) are present and ordered as specified.
- [ ] Sticky right-rail TOC renders on viewports ≥ 1024px, links to all five failure-mode anchors, and is hidden on mobile. Implemented CSS-only via `position: sticky` — no scroll-spy hydration island.
- [ ] Five `FailureMode` molecules render in the correct order with anchors `#data-readiness`, `#wrong-use-case`, `#integration`, `#governance`, `#change-management`.
- [ ] Seven headline stats (12–18%, 85%, 15%, $300B in the opener; 1.7×, 3.6×, 2.7× in the leaders section) render as `Stat` atoms — not inline emphasized prose. The 500% (Failure Mode 2) and 61% (Failure Mode 5) figures render as `Stat` atoms sourced from the `stats` array of their parent failure mode in `failure-modes.json` — not as inline `<strong>` in the body prose.
- [ ] Every cited claim in the body carries a footnote-style superscript that links to a numbered entry in the References block. Every numbered References entry is the target of at least one superscript — the round-trip is complete (no orphaned superscripts, no orphaned References entries).
- [ ] The four discovery questions render as an inline italic `<blockquote>` in the same body type as surrounding prose — no boxed surface, no `--surface` background, no card chrome (per D-04).
- [ ] References section lists all sources numbered to match the body superscripts, with linked text — anchor text is the article title, surfacing the publication via trailing em-dash.
- [ ] "Last reviewed: 2026-05-13" footer line is present, sits above the `SiteShell` footer, and carries the annual-refresh commitment.
- [ ] End CTA renders an `<a href="mailto:hello@pouk.ai">` with copy that references the discovery conversation (final wording: Arian).
- [ ] `<title>` and `<meta description>` reflect the deployment-gap framing and contain at least one quantified stat in the description.
- [ ] Page is reachable from `SiteShell` top nav with the Why AI item marked current.
- [ ] Page links to `/roles` at least once (footer-of-page next step) and to `mailto:hello@pouk.ai` at least once (end CTA).
- [ ] Lighthouse mobile: 100/100/100/100.
- [ ] No client-side JS shipped (sticky TOC is CSS-only via `position: sticky` — no scroll-spy hydration island in launch scope).
- [ ] All content in section 5 outcomes is met by the shipped copy (Arian-verified).
- [ ] `prefers-reduced-motion` honored — no animation on stats or entrance.

## 9. Open questions / dependencies

The original draft's open questions (citation style, sticky TOC, dataset vintage, discovery-questions callout, stats extraction) were resolved via `meta/decisions/launch-readiness.md` on 2026-05-13. See decisions D-01 through D-05.

Remaining dependencies blocking `Built`:

- **DS dependency — `FailureMode` molecule.** Required and listed as in scope for DS Phase 1.3. Cannot ship until the molecule is published in `@poukai-inc/ui@0.1.0`. Tracked in `meta/masterplan.md` section 3.2.
- **DS dependency — `Stat` atom.** Required and listed as in scope for DS Phase 1.2 (`@poukai-inc/ui@0.1.0-alpha.1`). Site needs both `align="start"` (inline within `FailureMode` body) and the standalone large display variant. Confirm `Stat` supports both before this page can be built end-to-end.
- **Footnote-superscript implementation — engineer's call.** D-01 locks the style; the engineer chooses the HTML mechanism (e.g., `<sup><a href="#ref-1">¹</a></sup>` round-tripped to a numbered References `<ol>`). No JS required.
- **Homepage hand-off — coordinated with `/` spec.** When `/why-ai` ships, the homepage lede ends with "Most AI projects fail to deliver. Here's why →" pointing here. Locked in `meta/specs/pages/home.md` per D-11.
- **Content lift — Arian-owned.** The verbatim copy in `meta/backlog.md` is approved as the source. The rewrite of the 500% and 61% sentences (post-extraction to `stats` array) is Arian-approved. Any edits to that copy are Arian's, not the engineer's. If the engineer hits a question while implementing, route via Arian.

## 10. Out of scope

- Interactive elements (scroll-spy TOC with active-state highlighting, animated stat counters, hover-card definitions for failure-mode titles). Zero-JS contract per masterplan section 4.3.
- A "Download the deployment-gap PDF" CTA or any lead-magnet pattern. The page itself is the asset.
- A newsletter signup, contact form, or scheduling widget. The conversion is `mailto:` only at this stage; richer contact flows are deferred to a separate `features/contact-flow.md` spec if ever needed.
- Case studies, customer logos, or testimonial blocks. Pouk.ai is too early for these and forcing them dilutes the page's argument.
- Visual imagery / illustrations. The page is typography-and-stats first per the brand's restraint principle. If illustration enters, it enters via a separate visual-design pass; this spec doesn't define it.
- A second route per failure mode (e.g., `/why-ai/data-readiness`). Failure modes are anchors on this page; they are not routes.
