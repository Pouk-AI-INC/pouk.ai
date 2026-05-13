# Spec: Principles

**Route**: `/principles`
**Status**: Draft
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Sections 2A (shape vs. substance), 4.1 (site layout), 4.4 (long-form content as data)

---

## 1. Purpose

`/principles` is the trust-closer. By the time a prospect reaches this page, they have agreed there's a problem (`/why-ai`) and recognized their shape of help (`/roles`). Principles answers the remaining question: *why us, specifically?* The ten principles are a manifesto-flavored statement of how pouk.ai operates — a character moat that's hard to replicate by deck-building competitors. The conversion event is not a click; it's a delta in trust, expressed as a higher reply rate and a higher first-meeting close rate on inbound conversations.

## 2. Audience

- **Primary**: A prospect who has read `/why-ai` and `/roles` and is now triangulating whether pouk.ai is the kind of operator they want in the room. Often they're between two consultants and reading both their about pages. They are scanning for substance, for evidence of judgment, and for an absence of marketing-speak.
- **Secondary**: A potential referrer (a friend, a past client, an investor) who is about to make an intro and wants to confirm pouk.ai is on-brand before sending. Referrers cite specific principles in their intros ("Arian's #2 — Integrity — is why I'm sending you his way").

## 3. Success criteria

- **Behavior**: The visitor reads the introduction, scrolls through all ten principles (or pauses on two-to-three that resonate), reaches the conclusion, and either (a) emails `hello@pouk.ai` with higher confidence, (b) screenshots a principle for a DM/intro, or (c) closes the tab having internalized the brand voice.
- **Signal**: Qualitatively — inbound emails reference principles by number or name ("we hired you because of #8 Momentum"); referrers cite principles in intros; principles are quoted on social. When analytics arrive, scroll-depth-to-conclusion is the primary read-out (this page lives or dies by completion rate).
- **Failure mode**: The page reads as ten generic operating values that any consultancy could write. If a competitor's "About Us" page could swap copy and not be visibly different, this page failed. The page also fails if it reads as preachy or self-congratulatory rather than as an honest internal compass.

## 4. Information architecture

**Opinionated call: single long-scroll page with anchor IDs (`#ownership`, `#integrity`, etc.), not per-principle routes.** Defended in one paragraph: the introduction and conclusion are editorial bookends that explicitly frame the principles as one piece — pulling them apart breaks the manifesto. Per-principle routes also create ten thin pages (Lighthouse anti-pattern) and ten chances for the nav to misrepresent. Long-scroll keeps the work coherent; anchor IDs give us the same shareability (`pouk.ai/principles#momentum`) without fragmentation. If a future post-launch insight says a single principle deserves a full essay, we promote it to a route then.

**Opinionated call: introduction and conclusion render in a distinct editorial voice from the ten principles.** Recommendation per the backlog's open design questions: Instrument Serif italic (the brand's serif token) for the bookend prose, sans for the principles themselves. The serif italic carries the "compass / framing" voice; the sans carries the "principle / discipline" voice. Same DS tokens, different mappings inside the page template.

1. `SiteShell` — top nav (Principles marked current) + hairline footer.
2. `Hero` — eyebrow ("Principles" or "Operating Principles" — see open question), title, lede framing the ten principles as the brand's compass.
3. **Introduction** — three to four sentences in the bookend voice (Instrument Serif italic recommended). Sets the frame: the tools matter; what matters more is how you think and operate.
4. **Ten `Principle` molecules** — each rendered with margin numeral (lowercase Roman: `i.` through `x.`), title, body. Anchor IDs derived from title slugs: `#ownership`, `#integrity`, `#reliability`, `#systems-thinking`, `#intellectual-curiosity`, `#obsession`, `#range`, `#momentum`, `#willingness-to-fail`, `#good-nature`.
5. **Conclusion** — two to three sentences in the bookend voice. Closes the loop: these are built, not faked.
6. **End CTA — minimal.** A single muted line: "If this is the kind of partner you want, [hello@pouk.ai](mailto:hello@pouk.ai)." No button, no marketing flourish. Restraint here is the brand.

## 5. Content requirements

The substance lives verbatim in `meta/backlog.md` under the "Operating Principles page" block. Engineer reads copy from there into `src/content/principles.json` per the content data spec at `meta/specs/content/principles.json.md`. Intro and conclusion live as separate top-level fields in the same JSON, since they are editorial bookends (not numbered entries) but share a content lifecycle with the principles.

Outcomes the copy must hit:

- The introduction must establish the principles as **a working compass, not a marketing list**. The phrase "Learn them. Practice them. Build from them." (from the verbatim copy) carries the imperative voice that distinguishes this page from a values slide.
- Each of the ten principles must read as **a specific operating discipline**, not an abstract virtue. "Reliability" is right because the body describes showing up prepared, meeting deadlines, communicating early. "Be excellent" would be wrong.
- The principles must read as **the founder's personal compass**, not a brand-team manifesto. First-person isn't required, but the voice should feel like Arian wrote it after a hard quarter, not after a positioning workshop.
- The conclusion must commit to **the principles being built, not faked** — i.e., the brand vulnerability is "this is what we're trying to be," not "this is who we are." That nuance is the difference between trustworthy and grandiose.
- The ten titles must work as **standalone vocabulary** — a reader should be able to repeat all ten without re-reading the page, because the words are concrete and the order has rhythm. The verbatim copy already satisfies this.

`Draft:` Hero lede direction: "Ten operating principles. Built one project at a time. The compass we work from." Direction only — Arian writes the final.

## 6. Content data shape

Principles are stored in `src/content/principles.json` per the schema at `meta/specs/content/principles.json.md`. Top-level fields: `intro`, `principles` (array of ten), `conclusion`. Each principle has `numeral` (lowercase Roman), `title`, `body`.

The Roman numeral is **stored, not computed** — the source-of-truth roman string lives in JSON so the engineer doesn't have to ship a Roman-numeral converter and so reordering principles is explicit rather than implicit. (See `content/principles.json.md` for the validation rule.)

## 7. User flow

- **Entry**: From the top nav (a returning reader closing the trust loop); from a referrer's DM linking to a specific principle anchor; from a social share of a single principle screenshot; from the end of `/roles` for the reader who wants more before reaching out.
- **Read path**: Hero → introduction (read closely) → principles (scan titles → close-read 2–3 that resonate) → conclusion → end CTA. A reader following a deep-link anchor jumps to a single principle and may scroll up to the intro afterwards.
- **Exit / conversion**: `mailto:hello@pouk.ai` from the end CTA, or no immediate action — a quiet trust-up that converts on a later email. Both are acceptable; the second is the more common honest outcome for a manifesto page.

## 8. Acceptance criteria

- [ ] Route renders at `/principles`.
- [ ] All sections in the IA (1–6) are present and ordered as specified.
- [ ] Ten `Principle` molecules render in the order Ownership, Integrity, Reliability, Systems Thinking, Intellectual Curiosity, Obsession, Range, Momentum, Willingness to Fail, Good Nature.
- [ ] Each `Principle` receives `numeral`, `title`, and body content matching the JSON entry.
- [ ] Numerals render in lowercase Roman (`i.` through `x.`) and match the `numeral` field in JSON exactly — no computed Roman numerals.
- [ ] Anchor IDs are present on each principle: `#ownership`, `#integrity`, `#reliability`, `#systems-thinking`, `#intellectual-curiosity`, `#obsession`, `#range`, `#momentum`, `#willingness-to-fail`, `#good-nature`.
- [ ] Introduction and conclusion render in a typographically distinct voice from the principles (recommendation: Instrument Serif italic — final treatment is the engineer's call, brand-aligned by Arian).
- [ ] End CTA renders an `<a href="mailto:hello@pouk.ai">` with a single muted line of copy.
- [ ] Top nav `SiteShell` highlights Principles as current.
- [ ] Lighthouse mobile: 100/100/100/100.
- [ ] No client-side JS shipped.
- [ ] `<title>` and `<meta description>` reflect the operating-principles framing.
- [ ] Deep-link anchor URLs (`/principles#ownership`, etc.) scroll to the corresponding principle.
- [ ] Spec section 5 outcomes are met by the shipped copy (Arian-verified).

## 9. Open questions / dependencies

- **DS dependency — `Principle` molecule.** Required and listed as in scope for DS Phase 1.2 (`@poukai/ui@0.1.0-alpha.1`). Confirm props match: `numeral`, `title`, `children` (body). Tracked in `meta/masterplan.md` section 3.2.
- **Page title — Arian's call.** Backlog flags candidates: `/principles`, `/operating-principles`, `/manifesto`. Recommendation: `/principles` (shortest, most direct, matches masterplan). The page heading can read "Operating Principles" while the route stays `/principles`.
- **Numeral treatment — Arian's call.** Backlog flags lowercase Roman vs. display numerals ("01 / 02 / ...") vs. inline numbered headings. Recommendation: lowercase Roman in the margin per `Principle` molecule's existing API. It reads as editorial / typographic rather than as a marketing checklist.
- **Bookend voice treatment — Arian's call.** Recommendation: Instrument Serif italic for intro + conclusion, sans for principles. The DS tokens already support both faces; mapping is a site-CSS decision. If Arian prefers visual consistency, drop the serif and keep a typographic hierarchy distinction (size + spacing) instead.
- **Nav order — coordinated with `flows/visitor-to-conversation.md`.** Backlog flags: Roles first (commercial) or Principles first (character)? Recommendation: nav order matches funnel — Why AI → Roles → Principles → contact. Locked in the flow spec.
- **Cross-surface pullout — decision pending Arian.** Backlog asks whether any principle gets pulled forward onto `/` as a quote treatment. Recommendation: no for launch. The homepage stays restrained. Re-open if Arian wants a single quote treatment as a hand-off teaser.
- **Content lift — Arian-owned.** Verbatim copy in `meta/backlog.md` is approved as the source. Any edits to that copy are Arian's, not the engineer's.

## 10. Out of scope

- Per-principle sub-routes. Anchors only; promotion to routes is a future call.
- Pull-quote / highlight components for principles. They read in order on one page; visual emphasis comes from typography, not callouts.
- Author attribution / "by Arian Zargaran" byline. The principles are pouk.ai's compass, not bylined essays.
- Comment threads, reactions, "share this principle" widgets. The screenshot is the share.
- A printable / PDF version. The web page is the artifact.
- Translating the principles into other languages. English-only at launch.
