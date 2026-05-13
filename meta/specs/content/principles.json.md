# Spec: `principles.json` content data

**File**: `src/content/principles.json`
**Consumed by**: `src/pages/principles.astro` (see `meta/specs/pages/principles.md`)
**Status**: Draft
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Section 4.1 (site layout), 4.4 (long-form content as data)

---

## 1. Purpose

`principles.json` is the typed source of truth for the `/principles` page — ten principles plus the introduction and conclusion editorial bookends. Storing all three together keeps the manifesto in one file with a shared content lifecycle; storing the principles as an array makes the page template a single iteration with no per-principle branching. The Roman numerals are stored, not computed, so reordering is explicit and a Roman-numeral library is unnecessary.

## 2. Audience

- **Primary**: `pouk-ai-engineer`, who reads this spec to author `principles.json` and the `principles.astro` template.
- **Secondary**: Arian, who edits the file directly when principle copy or ordering changes.

## 3. Success criteria

- **Behavior**: The engineer authors `principles.json` strictly to this schema; the page template iterates `principles[]` to render ten `Principle` molecules and renders `intro` and `conclusion` as separate editorial-voice blocks. Arian can reorder or edit principles by editing this file alone.
- **Signal**: Zero per-principle conditionals in the page template. Numerals in the rendered DOM match the `numeral` field in JSON exactly.
- **Failure mode**: The schema permits per-principle exceptions (an optional `quote`, an optional `image`) that break the manifesto rhythm. If one principle renders differently from the other nine, the schema failed.

## 4. Schema

Top-level shape: an **object** with three keys: `intro`, `principles`, `conclusion`. The bookends are top-level fields because they share content lifecycle but are not numbered entries — co-locating them prevents a separate `principles-bookends.json` from existing.

```jsonc
{
  "intro": "string — the introduction prose. Required. Markdown allowed (paragraphs, italic, bold; no headings or lists). Three to four sentences. Source: meta/backlog.md 'Operating Principles page' → Introduction.",
  "principles": [
    {
      "numeral": "string — lowercase Roman numeral with trailing period. Required. Stored, not computed. Allowed values: 'i.' | 'ii.' | 'iii.' | 'iv.' | 'v.' | 'vi.' | 'vii.' | 'viii.' | 'ix.' | 'x.'. Used verbatim as Principle.numeral.",
      "id": "string — kebab-case slug. Required. Used directly as the anchor ID on /principles (e.g., 'ownership' → '#ownership'). Must be unique across the array. Derived from title.",
      "title": "string — the principle name. Required. Plain text. One or two words. Title-case (e.g., 'Systems Thinking', 'Willingness to Fail').",
      "body": "string — the principle's prose. Required. Markdown allowed (paragraphs, italic, bold; no headings or lists). Typically four to seven sentences. Source: meta/backlog.md 'Operating Principles page' verbatim copy."
    }
  ],
  "conclusion": "string — the conclusion prose. Required. Markdown allowed (paragraphs, italic, bold; no headings or lists). Two to three sentences. Source: meta/backlog.md 'Operating Principles page' → Conclusion."
}
```

## 5. Validation and constraints

- `principles` array length: **exactly 10**.
- `principles[].numeral`: exactly one of the ten allowed strings in section 4. Order in the array must match Roman-numeral order — `principles[0].numeral` is `i.`, `principles[1].numeral` is `ii.`, etc. Any drift between array index and numeral string is a build failure.
- `principles[].id`: unique across the array; matches `/^[a-z]+(?:-[a-z]+)*$/`. Canonical values, derived once and locked, are: `ownership`, `integrity`, `reliability`, `systems-thinking`, `intellectual-curiosity`, `obsession`, `range`, `momentum`, `willingness-to-fail`, `good-nature`.
- `principles[].title`: 4–32 characters. Plain text. Title-case.
- `principles[].body`: 320–1200 characters. Markdown subset only (paragraphs, italic, bold). No links, no headings, no lists.
- `intro`, `conclusion`: 200–800 characters each. Same markdown subset.

## 6. Anchor-slug derivation

The anchor on `/principles` for a given principle is exactly `#${id}`. No transformation. The engineer must not re-derive from `title`.

| `id` (JSON) | Anchor |
| --- | --- |
| `ownership` | `#ownership` |
| `integrity` | `#integrity` |
| `reliability` | `#reliability` |
| `systems-thinking` | `#systems-thinking` |
| `intellectual-curiosity` | `#intellectual-curiosity` |
| `obsession` | `#obsession` |
| `range` | `#range` |
| `momentum` | `#momentum` |
| `willingness-to-fail` | `#willingness-to-fail` |
| `good-nature` | `#good-nature` |

## 7. Acceptance criteria

- [ ] File exists at `src/content/principles.json`.
- [ ] Top-level shape is an object with keys `intro`, `principles`, `conclusion` — and only those keys.
- [ ] `principles` is an array of length 10.
- [ ] Each principle has all four required fields: `numeral`, `id`, `title`, `body`.
- [ ] `numeral` values are exactly `i.`, `ii.`, ..., `x.` in that order.
- [ ] `id` values match the canonical list in section 6 exactly.
- [ ] `intro`, principle `body`, and `conclusion` content matches `meta/backlog.md` "Operating Principles page" verbatim copy (any divergence is Arian-approved).
- [ ] Field lengths fall within the bounds in section 5.
- [ ] Markdown in `body`, `intro`, `conclusion` uses only paragraphs, italic, and bold — no links, headings, or lists.
- [ ] Anchors on `/principles` match `#${id}` exactly.
- [ ] No optional / per-principle-exception fields are present.

## 8. Open questions / dependencies

- **Numeral storage vs. computation — locked.** Roman numerals are stored to avoid a converter dependency and to make reordering explicit. Engineer should not synthesize numerals from array index.
- **DS dependency — `Principle` molecule.** Confirm `Principle.numeral`, `Principle.title`, and the children/body slot accept the field values directly. Tracked in `meta/specs/pages/principles.md` section 9.
- **Bookend rendering — site-side.** `intro` and `conclusion` do not pass through a DS molecule; they render in the page template directly with the editorial-voice treatment recommended in `pages/principles.md`.
- **Markdown subset — recommendation.** Italic, bold, and paragraph breaks only. If a principle's body ever needs a link, escalate to the `Principle` molecule API (DS) — do not widen the schema.

## 9. Out of scope

- An eleventh principle. Ten is fixed.
- Per-principle quotes, author bylines, related-reading links, or pull-out callout fields.
- A "featured principle" flag for cross-surface use on `/`. Out of scope per `pages/principles.md`.
- Translation / i18n fields. English-only at launch.
- An audio / spoken-version field. The web page is the artifact.
