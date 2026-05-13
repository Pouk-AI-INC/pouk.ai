# Spec: `roles.json` content data

**File**: `src/content/roles.json`
**Consumed by**: `src/pages/roles.astro` (see `meta/specs/pages/roles.md`)
**Status**: Draft
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Section 4.1 (site layout), 4.4 (long-form content as data), 2A (Lucide picks are site-owned)

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
    "eyebrow": "string — short label above the role title. Required. Plain text only. Examples: 'The Builder' or '01'. See open question in roles.md regarding which convention.",
    "title": "string — the role name. Required. Plain text. One word. Examples: 'Builder', 'Automator'. Sentence-case capitalization.",
    "body": "string — the role's service-shape description. Required. Plain text or lightweight markdown (bold/italic only — no headings, lists, or links). Typically two to four sentences. Maps to RoleCard.body. Source: meta/backlog.md 'Roles page' block.",
    "hiredBy": "string — the hiring-trigger descriptor. Required. Plain text. One sentence describing who hires this role. Maps to RoleCard.hiredBy. Source: meta/backlog.md 'Roles page' block.",
    "icon": "string — Lucide glyph name. Required. PascalCase, matches lucide-react export (e.g., 'Hammer', 'Workflow', 'GraduationCap', 'Camera'). Resolved at build time by the page template; never re-exported through @poukai/ui. Final picks: Arian."
  }
]
```

## 5. Validation and constraints

Engineer enforces these at build (via `@astrojs/check` typecheck or a small zod schema in the page-template import; implementation detail).

- Array length: **exactly 4**. Adding a fifth role requires a backlog update and a re-spec.
- `id` field: unique across the array; matches `/^[a-z]+(?:-[a-z]+)*$/`; one of the four allowed values listed in section 4.
- `id` ordering: the array order must match the canonical funnel-friendly order in `meta/backlog.md` — Builder, Automator, Educator, Creator. The engineer should not re-sort the array at render time.
- `eyebrow`: 1–24 characters. Plain text.
- `title`: 1–16 characters. Plain text. No punctuation.
- `body`: 80–600 characters. Plain text or markdown bold/italic only. No links — `RoleCard` doesn't slot inline anchors at this stage.
- `hiredBy`: 40–280 characters. Plain text. A single sentence — no semicolons that split into multiple clauses.
- `icon`: must be a valid `lucide-react` exported component name (PascalCase). The engineer verifies the import resolves at build; a broken icon name is a build failure.

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
- [ ] `body` and `hiredBy` content matches `meta/backlog.md` "Roles page" verbatim copy (any divergence is Arian-approved).
- [ ] `icon` values resolve to valid `lucide-react` exports at build time.
- [ ] Field lengths fall within the bounds in section 5.
- [ ] Anchors on `/roles` match `#${id}` exactly.
- [ ] No optional / per-role-exception fields are present (no `cta`, no `image`, no `featured`).

## 8. Open questions / dependencies

- **Icon picks — Arian's call.** See `meta/specs/pages/roles.md` section 9 for recommendations.
- **Eyebrow convention — Arian's call.** Numeric ("01"–"04") vs. "The Builder" / "The Automator" etc. Whichever is picked, applied to all four entries consistently.
- **Markdown allowance in `body` — recommendation: bold/italic only.** No headings, lists, or links because `RoleCard.body` is a typographic block, not a rich-text region. If a role's body ever needs a link, escalate to the `RoleCard` API (DS decision) — do not work around by widening this schema.
- **DS dependency.** `RoleCard.icon` is a slot, not a glyph name string, per masterplan section 3.2. The schema's `icon` is the **glyph name as content data**; the page template imports `lucide-react` and resolves the string to a component instance to pass into the slot. Confirm this resolution pattern with the engineer.

## 9. Out of scope

- A fifth role (Strategist, Researcher, etc.). Four is fixed.
- Per-role pricing, packages, or "starts at" fields.
- Per-role case-study links or testimonial fields.
- Per-role featured-image paths. Illustrations decision deferred per `pages/roles.md`.
- Translation / i18n fields (e.g., `body.en`, `body.es`). English-only at launch.
