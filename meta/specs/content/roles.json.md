# Spec: `roles.json` content data

**File**: `src/content/roles.json`
**Consumed by**: `src/pages/roles.astro` (see `meta/specs/pages/roles.md`)
**Status**: Approved
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Section 4.1 (site layout), 4.4 (long-form content as data), 2A (Lucide picks are site-owned)
**Decisions log**: D-06 (Lucide picks), D-07 (eyebrow shape), D-08 (no per-role CTA field) — all resolved via `meta/decisions/launch-readiness.md` on 2026-05-13.

---

## 1. Purpose

`roles.json` is the typed source of truth for the four role archetypes rendered on `/roles`. Storing the substance as data (a) keeps copy edits out of JSX, (b) makes the page's shape obvious from one folder per masterplan section 4.4, and (c) gives `pouk-ai-engineer` a single import that maps cleanly onto four `RoleCard` molecules. The schema is small on purpose — one shape per role, no role-specific exceptions.

## 2. Audience

- **Primary**: `pouk-ai-engineer`, who reads this spec to author `roles.json` and to write the `roles.astro` page template that iterates it.
- **Secondary**: Arian, who edits the file directly when role copy changes.

## 3. Success criteria

- **Behavior**: The engineer authors `roles.json` strictly to this schema; the page template iterates the array and produces four `RoleCard`s with no per-role conditional logic. Arian can update any role's copy by editing this file alone and re-deploying.
- **Signal**: Zero per-role branches in the page template. Zero hardcoded role strings in `.astro` or `.tsx` files. Anchor IDs match `id` slugs exactly.
- **Failure mode**: The schema permits per-role exceptions (an optional `cta`, an optional `image`) that pull one role away from the canonical shape. If three roles render one way and the fourth renders another, the schema failed.

## 4. Schema

Top-level shape: an **array of four role objects**, ordered Builder → Automator → Educator → Creator. Order is significant — it determines render order. No top-level wrapper object; the file is the array.

```jsonc
[
  {
    "id": "string — kebab-case role slug. Required. Used directly as the anchor ID on /roles (e.g., 'builder' → '#builder'). Must be unique across the array. Allowed values: 'builder' | 'automator' | 'educator' | 'creator'. No other values without a backlog update.",
    "eyebrow": "string — short label above the role title. Required. Plain text only. Locked shape per D-07: 'The <Role>' — i.e., exactly one of 'The Builder' | 'The Automator' | 'The Educator' | 'The Creator'. Maps 1:1 to the role's id.",
    "title": "string — the bare role name. Required. Plain text. One word, no 'The' prefix (per D-07). Allowed values: 'Builder' | 'Automator' | 'Educator' | 'Creator'. Sentence-case capitalization.",
    "body": "string — the role's service-shape description. Required. Plain text or lightweight markdown (bold/italic only — no headings, lists, or links). Typically two to four sentences. Maps to RoleCard.body. Source: meta/backlog.md 'Roles page' block.",
    "hiredBy": "string — the hiring-trigger descriptor. Required. Plain text. One sentence describing who hires this role. Maps to RoleCard.hiredBy. Source: meta/backlog.md 'Roles page' block.",
    "icon": "string — Lucide glyph name (kebab-case identifier as used in lucide.dev). Required. Locked per D-06: exactly one of 'hammer' (Builder) | 'workflow' (Automator) | 'graduation-cap' (Educator) | 'clapperboard' (Creator). The page template translates the kebab-case identifier to the corresponding lucide-react import; never re-exported through @poukai-inc/ui."
  }
]
```

**No `cta` field per role** (per D-08). The site renders a single universal end CTA on `/roles`; per-role CTAs are out of scope. Adding a `cta` field is a schema regression.

## 5. Validation and constraints

Engineer enforces these at build (via `@astrojs/check` typecheck or a small zod schema in the page-template import; implementation detail).

- Array length: **exactly 4**. Adding a fifth role requires a backlog update and a re-spec.
- `id` field: unique across the array; matches `/^[a-z]+(?:-[a-z]+)*$/`; one of the four allowed values listed in section 4.
- `id` ordering: the array order must match the canonical funnel-friendly order in `meta/backlog.md` — Builder, Automator, Educator, Creator. The engineer should not re-sort the array at render time.
- `eyebrow`: exact match for one of `"The Builder"`, `"The Automator"`, `"The Educator"`, `"The Creator"` (per D-07). The `eyebrow` value must correspond to the role's `id` — `id: "builder"` pairs with `eyebrow: "The Builder"`, and so on.
- `title`: exact match for one of `"Builder"`, `"Automator"`, `"Educator"`, `"Creator"` (per D-07). One word. No "The" prefix. No punctuation.
- `body`: 80–600 characters. Plain text or markdown bold/italic only. No links — `RoleCard` doesn't slot inline anchors at this stage.
- `hiredBy`: 40–280 characters. Plain text. A single sentence — no semicolons that split into multiple clauses.
- `icon`: exact match for one of `"hammer"` (Builder), `"workflow"` (Automator), `"graduation-cap"` (Educator), `"clapperboard"` (Creator) (per D-06). The engineer verifies the kebab-case identifier resolves to a `lucide-react` export at build; a broken icon name is a build failure.
- **No additional fields are permitted.** In particular, no `cta`, no `image`, no `featured` (per D-08 and existing schema discipline).

## 6. Anchor-slug derivation

The anchor on `/roles` for a given role is exactly `#${id}`. No transformation. The engineer must not re-derive the slug from `title` — that introduces a second source of truth.

| `id` (JSON) | Anchor on `/roles` |
| --- | --- |
| `builder` | `#builder` |
| `automator` | `#automator` |
| `educator` | `#educator` |
| `creator` | `#creator` |

## 7. Acceptance criteria

- [ ] File exists at `src/content/roles.json`.
- [ ] File is a JSON array of length 4.
- [ ] Each object has all six required fields: `id`, `eyebrow`, `title`, `body`, `hiredBy`, `icon`.
- [ ] `id` values are exactly `builder`, `automator`, `educator`, `creator` — no others.
- [ ] Array order is Builder, Automator, Educator, Creator.
- [ ] `eyebrow` values are exactly `"The Builder"`, `"The Automator"`, `"The Educator"`, `"The Creator"` and pair 1:1 with the matching `id` (per D-07).
- [ ] `title` values are exactly `"Builder"`, `"Automator"`, `"Educator"`, `"Creator"` — no "The" prefix (per D-07).
- [ ] `icon` values are exactly `"hammer"`, `"workflow"`, `"graduation-cap"`, `"clapperboard"` and pair 1:1 with the matching `id` (per D-06).
- [ ] `body` and `hiredBy` content matches `meta/backlog.md` "Roles page" verbatim copy (any divergence is Arian-approved).
- [ ] Each `icon` kebab-case identifier resolves to a valid `lucide-react` export at build time.
- [ ] Field lengths fall within the bounds in section 5.
- [ ] Anchors on `/roles` match `#${id}` exactly.
- [ ] **No `cta` field is present on any role** (per D-08).
- [ ] No optional / per-role-exception fields are present (no `cta`, no `image`, no `featured`).

## 8. Open questions / dependencies

The original draft's open questions (icon picks, eyebrow convention) were resolved via `meta/decisions/launch-readiness.md` on 2026-05-13. See decisions D-06 (icons), D-07 (eyebrow shape), D-08 (no per-role CTA).

Remaining dependencies blocking `Built`:

- **Markdown allowance in `body` — locked.** Bold/italic only. No headings, lists, or links because `RoleCard.body` is a typographic block, not a rich-text region. If a role's body ever needs a link, escalate to the `RoleCard` API (DS decision) — do not work around by widening this schema.
- **DS dependency.** `RoleCard.icon` is a slot, not a glyph name string, per masterplan section 3.2. The schema's `icon` is the **glyph name as content data** (kebab-case per Lucide convention); the page template imports `lucide-react` and resolves the string to a component instance to pass into the slot. Confirm this resolution pattern with the engineer.

## 9. Out of scope

- A fifth role (Strategist, Researcher, etc.). Four is fixed.
- Per-role pricing, packages, or "starts at" fields.
- Per-role case-study links or testimonial fields.
- Per-role featured-image paths. Illustrations decision deferred per `pages/roles.md`.
- Translation / i18n fields (e.g., `body.en`, `body.es`). English-only at launch.
