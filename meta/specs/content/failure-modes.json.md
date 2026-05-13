# Spec: `failure-modes.json` content data

**File**: `src/content/failure-modes.json`
**Consumed by**: `src/pages/why-ai.astro` (see `meta/specs/pages/why-ai.md`)
**Status**: Approved
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Section 4.1 (site layout), 4.4 (long-form content as data)
**Decisions log**: D-05 (stats extraction — typed `stats` array per failure mode is the locked mechanism; 500% extracted from Failure Mode 2 body, 61% extracted from Failure Mode 5 body) — resolved via `meta/decisions/launch-readiness.md` on 2026-05-13.

---

## 1. Purpose

`failure-modes.json` is the typed source of truth for the five failure modes rendered as the structural spine of `/why-ai`. The five `FailureMode` molecules are the page's load-bearing taxonomy; storing them as data keeps the page template a single iteration and lets Arian edit the diagnosis layer without touching the surrounding prose. Stats embedded in two of the failure modes (500% in mode 2, 61% in mode 5) require a deliberate storage call — this spec resolves it.

## 2. Audience

- **Primary**: `pouk-ai-engineer`, who reads this spec to author `failure-modes.json` and the `why-ai.astro` template's failure-mode section.
- **Secondary**: Arian, who edits the file directly when failure-mode framing or embedded stats change.

## 3. Success criteria

- **Behavior**: The engineer authors `failure-modes.json` strictly to this schema; the page template iterates `failureModes[]` to render five `FailureMode` molecules with consistent typography and inline `Stat` atoms in the appropriate body positions.
- **Signal**: Zero per-mode conditionals in the page template. Inline stats render as `Stat` atoms (not as bold prose). Anchor IDs match `id` slugs exactly.
- **Failure mode**: Schema lets stats hide inside markdown prose, defeating the typographic emphasis that the page lives or dies by. Or — opposite failure — schema forces stats into an array even for failure modes that don't have any, leaving empty fields scattered across entries.

## 4. Schema

**Opinionated call: typed `stats` array per failure mode (default empty), not inline within `body` prose.** Defended in one paragraph: the `/why-ai` page's design principle is that headline numbers render as `Stat` atoms — large numeral, short caption — not as inline bold text in a paragraph. Inline markdown bold can't produce that typographic treatment cleanly inside a `FailureMode` body. A typed `stats` array gives the engineer a deterministic place to render `Stat` atoms (between paragraphs of the body, or as a margin pull-out) and gives Arian a deterministic place to edit the number, caption, and source independent of the surrounding prose. Failure modes without embedded stats simply ship `"stats": []` — cost of the empty array is one trailing line per entry, well worth the typographic discipline.

Top-level shape: an **array of five failure-mode objects**, ordered 1 → 5. Order is significant.

```jsonc
[
  {
    "index": "number — the failure mode's ordinal. Required. Integer 1–5. Must match array index + 1 (failureModes[0].index === 1). Used by FailureMode.index.",
    "id": "string — kebab-case slug. Required. Used as the anchor ID on /why-ai (e.g., 'data-readiness' → '#data-readiness'). Canonical values: 'data-readiness' | 'wrong-use-case' | 'integration' | 'governance' | 'change-management'.",
    "title": "string — the failure mode title. Required. Plain text. Roughly 'Data readiness — the hidden blocker' shape. 6–80 characters.",
    "body": "string — the failure mode prose. Required. Markdown allowed (paragraphs, italic, bold; no headings or lists). Three to six sentences. Source: meta/backlog.md 'Why AI page' verbatim copy.",
    "stats": [
      {
        "value": "string — the headline figure. Required if the parent stat object is present. Plain text. Example: '500%', '61%'. Mirrors Stat.value.",
        "caption": "string — the contextualizing label. Required. Plain text. 8–140 characters. Example: 'average ROI on sector-specific AI agents'. Mirrors Stat.caption.",
        "source": "string — optional attribution. Plain text. Example: 'PwC 2026 AI predictions'. Mirrors Stat.source."
      }
    ]
  }
]
```

`stats` is an **array, default `[]`**. Failure modes 1, 3, and 4 ship with `stats: []`. Failure mode 2 ships one stat (500%). Failure mode 5 ships one stat (61%). Engineer must support arbitrary count (0+); we just happen to use 0 or 1 today.

## 5. Validation and constraints

- Array length: **exactly 5**.
- `index`: integers 1, 2, 3, 4, 5 — in that order. `failureModes[i].index === i + 1`.
- `id`: canonical values listed in section 4, in order. No other values.
- `title`: 6–80 characters. Plain text.
- `body`: 240–900 characters. Markdown subset (paragraphs, italic, bold). No links, headings, or lists.
- `stats`: array, length 0 or more. For launch: failure modes 1, 3, 4 have length 0; modes 2 and 5 have length 1.
- `stats[].value`: 1–24 characters, plain text.
- `stats[].caption`: 8–140 characters, plain text.
- `stats[].source`: optional; if present, 4–80 characters, plain text.

## 6. Anchor-slug derivation

| `id` (JSON) | Anchor on `/why-ai` |
| --- | --- |
| `data-readiness` | `#data-readiness` |
| `wrong-use-case` | `#wrong-use-case` |
| `integration` | `#integration` |
| `governance` | `#governance` |
| `change-management` | `#change-management` |

## 7. Acceptance criteria

- [ ] File exists at `src/content/failure-modes.json`.
- [ ] File is a JSON array of length 5.
- [ ] Each object has the four required fields: `index`, `id`, `title`, `body`, and `stats` (array, may be empty).
- [ ] `index` values are 1, 2, 3, 4, 5 in array order.
- [ ] `id` values match the canonical list in section 6 exactly.
- [ ] `body` content matches `meta/backlog.md` "Why AI page" verbatim copy for the five failure modes (any divergence is Arian-approved).
- [ ] Inline stats from the verbatim copy that *were* originally embedded in prose (500% in mode 2, 61% in mode 5) are extracted out into the `stats` array of their parent failure mode, with their original prose context preserved in `body` minus the bold-emphasis figure.
- [ ] Field lengths fall within the bounds in section 5.
- [ ] Anchors on `/why-ai` match `#${id}` exactly.

## 8. Open questions / dependencies

The stats-extraction decision (D-05) was resolved via `meta/decisions/launch-readiness.md` on 2026-05-13. The typed `stats` array per failure mode is the locked storage mechanism; the 500% figure (Failure Mode 2 — Wrong use case) and the 61% figure (Failure Mode 5 — Change management) are extracted from body prose into the `stats` array.

Remaining dependencies blocking `Built`:

- **Storage of stats — locked.** Typed `stats` array, not inline markdown. Engineer renders each `stats[]` entry as a `Stat` atom inside or alongside the parent `FailureMode` body. Exact rendering position (between paragraphs vs. margin pull-out) is the engineer's call given DS molecule props.
- **DS dependency — `FailureMode` molecule, `Stat` atom.** Both in scope for DS Phase 1.3 and 1.2 respectively. Confirm `FailureMode.children` accepts mixed content (prose + `Stat` atom) or whether stats need a separate `stats` slot on the molecule. If the molecule doesn't expose a `stats` slot, the engineer composes `<FailureMode>` with `<Stat>` as a child — schema is unchanged either way.
- **Stat-prose extraction rewrite — Arian-approved in principle (per D-05); copy still Arian-owned.** Pulling 500% and 61% out of the verbatim prose into `stats` changes how the body sentence reads. The engineer drafts the rewrite (e.g., dropping the figure and letting the adjacent `Stat` atom carry the number); Arian approves the final words.
- **Source field — Arian-owned.** The `stats[].source` is optional but recommended for credibility. For 500%, the source is the masterplan-aligned framing (sector-specific AI agents research). For 61%, it's the PwC / IBM / Gartner ecosystem. Arian picks the canonical attribution string for each.
- **Headline-stat storage — out of scope here.** The four opener stats (12–18%, 85%, 15%, $300B) and three quartile stats (1.7×, 3.6×, 2.7×) on `/why-ai` are **not** stored in `failure-modes.json`. They are page-template prose because they only render on this one page and are editorially tied to the page's argument. Promote to JSON only when a second surface needs them.

## 9. Out of scope

- A sixth failure mode. Five is fixed.
- Per-failure-mode imagery, illustrations, or icon picks. `FailureMode` is a typographic molecule.
- The opening-argument stats (12–18% etc.) and leaders-section stats (1.7×, 3.6×, 2.7×). Page-template prose for now.
- The four discovery questions. Page-template prose, not data.
- The references list. Page-template prose, not data.
- Translation / i18n fields. English-only at launch.
