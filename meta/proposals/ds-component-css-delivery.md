---
title: "Deliver component CSS to consumers via side-effect imports"
target_repo: poukai-inc/poukai-ui
suggested_resolution: patch
status: resolved
ds_issue:
target_version: 0.2.2
created: 2026-05-14
resolved: 2026-05-14
---

# Proposal: deliver component CSS to consumers

> **Resolved**: shipped as `@poukai-inc/ui@0.2.2` on 2026-05-14 (DS PR #8 — auto-inject per-entry CSS). Consumer side: `89c5751` added `vite.ssr.noExternal: ["@poukai-inc/ui"]` to handle Astro SSR. Retained as a record of the cross-repo flow's first successful round-trip; predates the formal proposal frontmatter convention in `meta/workflow.md`.

**From**: `poukai-inc/pouk.ai` (site repo)
**To**: `poukai-inc/poukai-ui` (DS repo)
**Affected version**: `@poukai-inc/ui@0.2.1`

---

## Symptom (consumer-side evidence)

`poukai-inc/pouk.ai` consumes `@poukai-inc/ui@0.2.1`. Standard imports:

```ts
import { SiteShell, Hero, RoleCard, Principle, FailureMode } from "@poukai-inc/ui";
import "@poukai-inc/ui/tokens.css";
```

Every component lands in the DOM with its scoped CSS-module class names attached (`<header class="poukai_YcL9S7">`, `<nav class="poukai_8tKxiy">`, `<article class="poukai_xxxxx">`, etc.), but **none of the per-component CSS rules reach the browser**. Visible result on the three Astro routes (`/why-ai`, `/roles`, `/principles`):

- `SiteShell` header has no styling — brand mark is tiny, nav renders as a default `<ul><li>` bulleted list, no horizontal layout, no hairline separator.
- `RoleCard` cards have no surface fill, no hairline, no card recipe.
- `Hero`, `Principle`, `FailureMode` typography is correct (it comes from `tokens.css`, which IS exported and imported correctly), but per-component spacing / layout / dividers / pulled-out numerals are missing.

Screenshot reproducing the issue is in `meta/reviews/` if needed; the visual diff against a Ladle story would also reproduce.

## Root cause

The DS package **builds** `dist/style.css` correctly. The bug is in delivery:

1. **`package.json` `exports` field only exposes `./tokens.css`.** There is no `./style.css` subpath export. `dist/style.css` is built but unreachable from consumers.
2. **The entry files don't import the CSS.** `dist/index.js`, `dist/index.cjs`, `dist/atoms.js`, `dist/molecules.js`, `dist/organisms.js` all import component code but never `import "./style.css"`. Verified by inspecting `node_modules/@poukai-inc/ui/dist/index.js` after `pnpm install` of `0.2.1`.

So even a consumer who knew to look for the CSS has no path to it.

## Suggested fix (preferred — Option A: auto-inject)

Add a side-effect CSS import at the top of every entry file. Vite / rollup compiles it into the dist entries, and consumers don't need to do anything:

```ts
// src/index.ts
import "./style.css";
export * from "./atoms";
// ...

// src/atoms.ts
import "./style.css";
// ... existing atom exports

// src/molecules.ts
import "./style.css";
// ...

// src/organisms.ts
import "./style.css";
// ...
```

(If your build pipeline emits per-entry CSS bundles, you may need to import the corresponding per-entry CSS rather than a single combined file — adjust accordingly.)

**Mark side effects truthfully** in `package.json` so Vite doesn't tree-shake the CSS import:

```json
{
  "sideEffects": ["**/*.css", "src/index.ts", "src/atoms.ts", "src/molecules.ts", "src/organisms.ts"]
}
```

(Adjust the entry paths to match your actual source layout.)

## Alternative fix (Option B: subpath export)

If auto-injection causes unacceptable tree-shaking pain (e.g. a consumer wants to use only `Wordmark` and tree-shake everything else), expose the CSS as an explicit subpath instead:

```json
{
  "exports": {
    ...
    "./style.css": "./dist/style.css",
    ...
  }
}
```

Consumers then add `import "@poukai-inc/ui/style.css";` alongside the existing tokens import. Slightly worse DX but explicit; preserves tree-shaking for consumers who want to provide their own component CSS.

The site repo prefers **Option A**. If Option B is what you ship, confirm in the release notes and the site updates its imports accordingly.

## Validation

After landing the fix in DS and publishing `0.2.2`:

1. From the site repo: `pnpm up @poukai-inc/ui@0.2.2 && pnpm build`.
2. Open `dist/roles/index.html` — there MUST be a `<link rel="stylesheet" href="/_astro/*.css">` whose contents include rules for `.poukai_<hash>` class names. (Astro will bundle the side-effect CSS into the per-page CSS bundle.)
3. Open `http://localhost:4321/roles/` — confirm:
   - `SiteShell` nav is horizontal in the header, brand mark at proper size, hairline separator below the header.
   - `RoleCard` shows the card recipe: surface fill, hairline, radius.
   - `Hero`, `Principle`, `FailureMode` show their full per-component layout.

## Release shape

- **Patch bump**: `0.2.1` → `0.2.2`. This is a delivery bug, not a public-API change.
- Changeset summary (suggestion): _"Auto-inject component CSS via side-effect imports in entry files so consumers ship styled components without an additional explicit import."_
- After the changesets release PR merges and publish CI runs, ping the site repo. The site bumps to `0.2.2`, re-verifies the build, and re-screenshots.

## Out of scope

- Don't change the public component API.
- Don't touch the existing `./tokens.css` export (the site still imports that separately and it works).
- Don't open PRs against `poukai-inc/pouk.ai` — the site repo update is a separate engineer's lane.
- Don't ship Option A and Option B both. Pick one.
