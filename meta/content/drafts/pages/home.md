# Content: Home

**Route**: `/`
**Status**: Draft
**Owner**: Arian (founder) · Author: pouk-ai-content (general-purpose stand-in)
**Last updated**: 2026-05-15
**Governing spec**: `meta/specs/pages/home.md` (section 5 content requirements)
**Composition reference** (if available): None on file yet — `/` shipped without a `meta/compositions/pages/home.md` recipe. This draft is retroactive.

This is a **retroactive ratification**: the page is already built and live. Copy below is the canonical record of voice and copy choices for `/`. Where the shipped copy diverges from a DS guideline, the divergence is named and surfaced as an open question rather than silently endorsed.

---

## 1. Drafting notes

- **Audience read**: A first-time direct visitor (typed `pouk.ai`, clicked a banner from a sent email, followed a referrer) with zero context, plus a returning prospect or referrer re-checking that the site is alive and the contact path works. Both audiences are operator-grade; assume they have shipped.
- **Outcome read** (from spec §5):
  - The tagline must continue to read as **the brand mark itself** — restrained, serif-led, refined. Typography is the credential.
  - The lede must communicate (a) pouk.ai is technical consulting that ships with AI, (b) the audience is teams who already build, (c) the gap pouk.ai exists to close — surfaced as the final integrated sentence of the lede (per D-11).
  - Status line copy carries over verbatim from the pre-cutover `index.html` (per D-12, byte-identical at cutover).
  - Email link remains the primary conversion path. No form, no widget, no scheduling embed at launch.
- **Voice anchor**: Refined (§4.3) doing the most work — sentence-case discipline, em dashes, curly punctuation, no throat-clearing. Direct (§4.1) second — single clause per sentence, no hedging. Pouk-specific naming (§4.5) third — "technical consulting that uses AI" framing differentiates from deck-builders; Pouākai treated as origin note, not metaphor.
- **Assumptions**:
  - Treating the **shipped** 4-sentence lede as the canonical draft (option (c) below). Recommending a 3-sentence trim as the "sharpest" alternative so Arian can make the call without re-briefing.
  - Treating the inconsistency between the meta description ("conversations for Q3") and the status badge ("Currently taking conversations for Q3.") as a copy bug, not a deliberate variant. Recommendation in §7.
  - Treating canonical as `https://pouk.ai/` (with trailing slash) per spec §8 AC and per the BaseLayout passing `canonical` from the page frontmatter. The engineer wires the exact string.
  - Treating the `<em>AI</em>` italic inside the tagline as a brand-mark detail (Instrument Serif italic on "AI") — it ships and stays.

---

## 2. Copy

For each block, the copy that ships, labelled by the spec §5 outcome it satisfies.

### Block: SiteShell top nav (spec §4 IA item 1)

Per D-13, funnel order: Why AI → Roles → Principles. Wordmark links back to `/`. SiteShell is a DS organism; the nav labels are the only copy `/` contributes here.

- **Nav labels** (left to right, post-wordmark):
  - `Why AI`
  - `Roles`
  - `Principles`
- **Wordmark**: rendered as `<Wordmark>` (DS organism owns the geometry — no plain-text fallback inside the visual mark).

### Block: Hero (spec §5 outcomes A, B, C)

- **Status badge child** (per D-12, byte-identical to pre-cutover `index.html`):
  > Currently taking conversations for Q3.
- **Title** (verbatim tagline from pre-cutover `index.html`; the `<em>AI</em>` italic is part of the mark):
  > Technical consulting for teams shipping with *AI*.
- **Lede** (current shipped, 4 sentences — see §5 and §6 for the trim alternative):
  > pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate. Named for Pouākai — the largest eagle that ever flew, hunting by stooping from height. Most AI projects fail to deliver. [Here's why →](/why-ai)
- **CTA label** (verbatim from pre-cutover `index.html`):
  > hello@pouk.ai
  - Rendered as `<Button asChild><a href="mailto:hello@pouk.ai">hello@pouk.ai</a></Button>`. The label *is* the address — operator audience reads the address as the affordance.

### Block: SiteShell footer (spec §4 IA item 1, hairline footer)

Single line, no marketing. Year is build-time `new Date().getFullYear()`; do not hardcode.

- **Footer line**:
  > © {year} pouk.ai · hello@pouk.ai
  - The email substring renders as `<a href="mailto:hello@pouk.ai">hello@pouk.ai</a>`. Middle dot (`·`) separator with single spaces, not a hyphen. Copyright symbol is the curly `©`, not `(c)`.

### Block: Hero supplemental — nothing else

Per spec §4 IA item 3: **end — no further sections**. No about block, no services block, no testimonial, no logo bar. The hairline footer closes the page. Documented here so a later revision doesn't quietly add a section.

---

## 3. Page-level SEO copy

Confirming the shipped values; flagging the meta-desc vs. status-line inconsistency in §7 (R26).

- **`<title>`** (currently shipped; flag below if the live value diverges):
  > pouk.ai — technical consulting for teams shipping with AI
  - 56 characters. Under the 60-char Google truncation. Front-loads the brand wordmark because direct-type traffic to `/` *is* the brand recognition surface. The em dash is a typographic mark (`U+2014`), not a hyphen.
- **`<meta name="description">`** (recommended canonical phrasing — see §7 R26):
  > pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate. Currently taking Q3 conversations.
  - 153 characters. Under 155. Declarative. Mirrors the lede's first sentence so search snippets and the page itself rhyme. The "Q3 conversations" phrasing trims a word vs. the status badge's "conversations for Q3" — see §7 R26 for the canonical-phrasing recommendation.
- **OG title**:
  > pouk.ai — technical consulting for teams shipping with AI
  - Same as `<title>`. Social-share previews benefit from the brand wordmark in the same line; no punchier variant earns the deviation at this stage.
- **OG description**:
  > pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate. Most AI projects fail to deliver — here's why.
  - 167 characters. Under 200. Declarative. Drops the status-line clause (it dates a share preview) and replaces it with the lede's hand-off sentence — same voice, share-context-appropriate. The em dash separates the two clauses.
- **Heading hierarchy**:
  - H1: the tagline ("Technical consulting for teams shipping with *AI*.") — rendered by `Hero`'s title slot. Exactly one H1.
  - No H2 or H3 on `/`. The page is one block. Confirmed clean — no skip.
- **Canonical**:
  > `https://pouk.ai/`
  - Trailing slash. Apex domain. Passed to `BaseLayout` via the page frontmatter.

---

## 4. Voice rationale

For each significant line, one short clause on *why* this phrasing rather than the obvious alternative.

- **Tagline — "Technical consulting for teams shipping with *AI*."** rather than "AI consulting" or "We help companies leverage AI" because (a) §4.5 forbids "AI consulting" framing — it collapses pouk.ai into the deck-builder category, and (b) "teams shipping with AI" is operator-language (§4.2): assumes the reader has a release process, doesn't define "ship."
- **Italic on "*AI*"** rather than roman because the Instrument Serif italic is part of the brand mark — it's the typographic credential that earns the restraint. Removing it would flatten the tagline into a generic positioning line.
- **Lede sentence 1 — "pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate."** rather than "pouk.ai delivers AI-powered solutions for businesses" because every noun is specific (systems, automations, advisory engagements) and the closer ("ship than speculate") names the audience by what they do, not by what they aspire to be (§4.2 operator-first, §4.6 implied confidence).
- **Lede sentence 2 — "Named for Pouākai — the largest eagle that ever flew, hunting by stooping from height."** rather than "Named after a powerful Māori bird of prey" because §4.5 permits a one-line origin note, sparingly; "hunting by stooping from height" is operator-flavored (specific verb, geometric image) and avoids the forbidden marketing metaphor. The macron stays.
- **Lede sentence 3 — "Most AI projects fail to deliver."** rather than "Many AI initiatives struggle to deliver value" because the noun ("projects") matches what the operator audience runs; "fail to deliver" is the operator phrase for the gap pouk.ai exists to close. No hedging modifier.
- **Lede sentence 4 — "Here's why →"** as the link text rather than "Learn more" or "Read why AI projects fail" because (a) it's the natural prose continuation of sentence 3 — the link is part of the sentence, not under it (D-11 structural lock), and (b) two words plus the arrow is the minimum legible affordance; anything longer competes with the email CTA.
- **Status badge — "Currently taking conversations for Q3."** rather than "Available for new engagements" or "Booking now" because D-12 locks it byte-identical to the pre-cutover `index.html`. The phrasing is operator-grade: "conversations" frames the first contact correctly (not "engagements" — those come later), and "Q3" is concrete time without forcing a date.
- **CTA — "hello@pouk.ai"** as the literal label rather than "Get in touch" or "Contact us" because the address *is* the affordance for an operator audience; obscuring it behind a verb adds a click of indirection and a layer of marketing tone for no benefit. (§4.6 "implied confidence.")
- **Footer — "© {year} pouk.ai · hello@pouk.ai"** rather than "Copyright pouk.ai. All rights reserved." because the curly symbol + dynamic year + middle-dot separator is the entire legally-sufficient line; the "All rights reserved" coda is decorative and dates the site.

---

## 5. Headline alternatives

Hero title and Hero lede are high-stakes lines and ship with three labelled options each. **Status copy is locked by D-12 (byte-identical to pre-cutover `index.html`) — no alternatives.**

### Hero title

| Option | Copy | Rationale | Risk |
|---|---|---|---|
| Safest (current — recommended) | Technical consulting for teams shipping with *AI*. | Verbatim from the pre-cutover `index.html`. Operator framing in `teams shipping`. The italic *AI* is the typographic mark. Carries the parity gate (spec §8 AC + masterplan §6.1 visual-parity). | None at the current stage — this is the line. |
| Sharpest | Technical consulting for teams that ship with *AI*. | "Teams that ship" is the §4.5 audience handle. Trades the participle for the relative clause — fractionally more direct, fractionally more declarative. | Breaks visual parity with pre-cutover `index.html`. Spec §8 AC and masterplan §6.1 require byte-identical or "indistinguishable" output. Cannot ship as a swap-in without re-opening the parity gate. |
| Weirdest | Built by operators. Shipped with *AI*. | Two-line tagline. Names the maker, then the tool. Strips the "consulting" word entirely (the page exists; the word is implied). | Drops the search-relevant noun phrase ("technical consulting"). Forces the Hero to compose two short title lines instead of one — the composition risk lives in §6. |

**Recommendation**: Safest. The line is doing its job, it earned the parity gate, and the sharpest variant would require re-opening that gate for a one-word delta.

### Hero lede

| Option | Copy | Rationale | Risk |
|---|---|---|---|
| Safest (current — shipped) | pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate. Named for Pouākai — the largest eagle that ever flew, hunting by stooping from height. Most AI projects fail to deliver. [Here's why →](/why-ai) | What is live today. Carries the origin note, the positioning, the gap, and the hand-off in four sentences. | Exceeds the DS Hero `lede: 1-3 sentences at most` cap by one sentence. Flagged as R14 in `/review-page`. See §6 and §7. |
| Sharpest (recommended for the DS-compliant variant) | pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate. Most AI projects fail to deliver. [Here's why →](/why-ai) | Three sentences. Drops the Pouākai origin sentence — it's a brand-identity grace note, not load-bearing for the doorway-page job, and it lives more naturally on a later `/about` page where the masterplan permits the origin note (§4.5). Brings the lede inside the DS cap without losing positioning, gap, or hand-off. | Loses the Pouākai origin from `/`. Origin needs a future home (recommend: a one-line origin in `/about` or a longer-form post). |
| Weirdest | pouk.ai is technical consulting that ships. With AI. [Most AI projects don't →](/why-ai) | Three short sentences and a fragment. Maximum restraint. The hand-off rephrases the gap as a verb-led claim. | Drops "custom AI systems, automations, and advisory engagements" — the concrete-noun list that earns the operator audience's trust. Probably too compressed for a first-time visitor with zero context. |

**Recommendation**:
- If Arian decides the 4-sentence lede is a deliberate doorway-page exception to the DS cap (option (a) in the brief): keep **Safest**, file the DS-rule-relaxation as an open question with Claude Design (see §7 R14a).
- If Arian decides to trim to the DS cap (option (b) in the brief): ship **Sharpest**. The dropped Pouākai sentence migrates to `/about` whenever that page exists.
- Author's lean: **(c) both — Safest is what ships today, Sharpest is the trim Arian can swap in without re-briefing.** The Pouākai origin is the right grace note for a brand page but not the right load on a doorway page; the trim sharpens the read path without losing voice. Defended in §6.

---

## 6. Composition-fit flags

For the Designer's revision pass (when a `meta/compositions/pages/home.md` recipe is authored).

- **R14 — Hero lede sentence count exceeds DS cap.** The shipped lede is 4 sentences; DS `Hero.lede` rule is `1-3 sentences at most` (per `meta/ds-snapshot/llms-full.txt`). The page shipped before the cap was tightened — or shipped against an earlier reading of the rule. Three resolutions, in order of author preference:
  1. **Trim to 3 sentences** using the Sharpest alternative in §5. Drops the Pouākai origin sentence; preserves positioning + gap + hand-off; brings the page back inside the DS contract. **Author's lean.**
  2. **Keep 4 sentences and surface a DS-rule-relaxation request** to Claude Design — argue the doorway-page case (the only page on the site where the lede carries both an origin note and a hand-off into the funnel). If granted, the cap becomes "1-3 except where the page is a single Hero" — a narrow, defensible exception.
  3. **Keep 4 sentences silently.** Not recommended — it stores up a contradiction between shipped copy and DS rule that a future reviewer will flag again.

  *Defense of the author's lean*: the Pouākai sentence is the loveliest line on the page, but it isn't load-bearing for the doorway-page job (confirming pouk.ai is alive, handing off into the funnel). It earns its keep on a brand-page, not a doorway-page. The trim respects the DS contract without losing voice; the origin migrates somewhere it can breathe. Going the other way — asking Claude Design to relax the cap — is a real cost on the DS side for a sentence whose better home is `/about`.

- **Status-badge children word count**: "Currently taking conversations for Q3." is **6 words**. DS cap is `≤10 words`. Inside the cap. No flag.

- **Button label format**: "hello@pouk.ai" is a single token, not sentence-case prose. DS Button rule is `sentence-case, never ALL CAPS, max 4 words`. The address is technically not sentence-case (it's lowercase by convention) but is also not a sentence — it's an identifier. Reads as compliant under the spirit of the rule (no marketing-speak, no shouting). If a reviewer flags it: argue spirit, not letter; do not change the address.

- **Tagline italic span**: the `<em>AI</em>` is rendered inside the `Hero.title` slot. Hero's title rule says `One per page. Do NOT nest Hero inside another Hero.` — silent on inline `<em>`. No flag, but worth Designer awareness when the Hero molecule is touched.

- **No H2/H3 on the page**: spec §4 IA item 3 enforces no further sections. The heading hierarchy is `H1 only`. Reviewer agents that enforce heading-skip rules should be told `/` is a single-block doorway and the rule doesn't apply.

---

## 7. Open questions for Arian

Specific decisions needed before this draft reaches `Approved`.

1. **R14 — Hero lede sentence count (DS cap)**. Pick one:
   - (a) **Ratify the current 4-sentence lede** as a deliberate doorway-page exception. File a DS-rule-relaxation request with Claude Design ("Hero.lede: 1-3 sentences, except on a single-Hero doorway page where origin + positioning + hand-off justify 4"). Status badge stays unchanged either way.
   - (b) **Approve the 3-sentence trim** in §5 (Sharpest). The Pouākai origin sentence migrates to a future `/about` page or longer-form post. Engineer updates the `HomeHero.tsx` lede slot.
   - (c) **Defer**. Keep current copy live; flag in `meta/journal.md` that the page ships outside the DS cap until a revision pass decides.

   **Author's recommendation**: (b) — trim now, migrate the origin later.

2. **R26 — Meta-desc vs. status-line phrasing inconsistency.** Current shipped status badge child is "Currently taking conversations for Q3." (D-12 locks this byte-identical). The current `<meta name="description">` ends with "Currently taking Q3 conversations." or a variant (engineer to confirm live value). Two unequal phrasings of the same fact. Pick the canonical phrasing:
   - (a) **"Currently taking Q3 conversations."** — terser, share-preview-friendly. Reads as the meta-desc's clause. Status badge stays "Currently taking conversations for Q3." (locked).
   - (b) **"Currently taking conversations for Q3."** — matches the status badge verbatim. Adds two characters to the meta-desc; harmless.
   - (c) **Drop the status clause from the meta-desc entirely**; let the lede's framing carry the description. Avoids the inconsistency by removing one side of it. Loses the "alive and booking" signal in social-share previews.

   **Author's recommendation**: (a) — terser meta-desc, locked status badge, accept the small phrasing delta as the artifact of two different jobs (status badge is a UI atom; meta-desc is a sentence in a search result).

3. **OG description vs. `<meta description>` parity.** The draft above gives the OG description a different second clause than the meta-desc (uses the lede's hand-off line instead of the status clause). Two phrasings, two surfaces. OK as-is, or should the OG mirror the meta-desc verbatim? **Author's recommendation**: keep them differentiated — social-share previews date faster than search snippets; the status clause is better in search where it freshens the SERP, the hand-off line is better on a share where the recipient is one click from `/why-ai`.

4. **`<title>` brand-first vs. noun-first.** The current `<title>` leads with `pouk.ai —`. Agent §5.1 says "include the brand name only when it strengthens the line." For `/` specifically the brand wordmark *is* the page subject (visitors typing `pouk.ai` are looking for the brand), so brand-first earns its place — but this is the only page on the site where that reasoning holds. Flag for awareness; no change requested.

---

## 8. Out of scope

This draft deliberately does not cover:

- `/why-ai`, `/roles`, `/principles` — separate page drafts in `meta/content/drafts/pages/`. The hand-off line in `/`'s lede mentions `/why-ai` only to set up the link; the `/why-ai` page itself is its own brief.
- The wordmark text inside `<Wordmark>` — Claude Design owns DS-internal copy per agent §1 and §4.5.
- The `StatusBadge` atom's default copy, error states, or visual treatment — DS-internal.
- The OG image *content* (`og.png` itself) — visual asset, not copy. Tracked as a launch blocker in `meta/backlog.md`.
- The `apple-touch-icon`, favicon, `robots.txt`, `sitemap.xml`, JSON-LD payload — all engineering/asset surfaces, not copy.
- Composition decisions: icon picks, primitive selection, spacing rhythm, where the Hero sits on the page — Designer's lane.
- The DS rule itself (Hero `lede: 1-3 sentences at most`) — author flags the conflict, surfaces a relaxation pathway, but does not propose a DS-side change. Claude Design owns DS source.
- Analytics, Bugsink, CSP, service workers, performance budgets — Reviewer/Engineer lanes.
- Future iterations of the homepage (a featured stat, a quote, a thumbnail of `/why-ai`) — out of scope per spec §10. The page is a doorway; adding sections is a brand regression.
