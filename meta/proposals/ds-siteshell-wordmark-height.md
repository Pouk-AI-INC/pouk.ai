# Proposal to Claude Design: enlarge `SiteShell`'s brand-mark height

**From**: `poukai-inc/pouk.ai` (site repo)
**To**: `poukai-inc/poukai-ui` (DS repo) — Claude Design
**Affected version**: `@poukai-inc/ui@0.2.2` (currently published)
**Suggested resolution**: cut as `0.2.3` (patch) via changesets
**Date**: 2026-05-14

---

## Symptom

`SiteShell` renders its top-left brand mark at `height={28}` (hardcoded in `src/organisms/SiteShell/SiteShell.tsx`). At the canonical 1485×812 desktop viewport on `pouk.ai`, that produces a tiny POUKAI lockup — the brand reads as a footnote rather than the page's identity anchor.

The Wordmark itself accepts a `height` prop (defaults to 64), so the constraint is purely the value `SiteShell` passes down. Other surfaces that consume `Wordmark` directly look correctly weighted.

For context: the prior static holding page rendered the brand at `clamp(3.5rem, 2.5rem + 2vw, 4.5rem)` — i.e. 56→72px responsively. The current `SiteShell` at 28px is roughly half that visual weight.

## Suggested fix (preferred — Option A: raise the default)

Change the hardcoded value to something in the 48–56px range. Recommended: **48px** desktop with no responsive scaling (keep the shell quiet on mobile where a 48px mark is still proportional). One line:

```tsx
// src/organisms/SiteShell/SiteShell.tsx
<Wordmark height={48} />
```

If you want responsive behavior similar to the prior holding page, use a CSS-side clamp via the module CSS instead of a JS prop — pass nothing to `<Wordmark />` (default 64 takes over) and override its height in `SiteShell.module.css`:

```css
.brand :global(svg) {
  height: clamp(2.5rem, 1.75rem + 1vw, 3rem) !important;
}
```

But the simpler JS prop change is what we'd ship first; CSS clamp can come later if 48px feels wrong on mobile.

## Suggested fix (alternative — Option B: expose a prop)

If different consumers need different brand-mark heights, expose a `brandHeight` prop on `SiteShell`:

```tsx
export interface SiteShellProps extends ComponentPropsWithoutRef<"div"> {
  // ...existing props
  /** Pixel height of the wordmark in the header. Defaults to 48. */
  brandHeight?: number;
}

// in the render:
<Wordmark height={brandHeight} />
```

This puts the size knob in the consumer's hands. We don't have a second consumer needing a different size today, so we don't actually need this — but if the DS is being designed for `Pouk-AI-INC/*-app` reuse, it's a cheap forward-compatibility step.

The site repo is happy with either Option A (just raise the default) or Option B (expose the prop). Pick whichever fits the DS's API philosophy.

## Out of scope

- Don't change `Wordmark`'s own default height (64).
- Don't change `Wordmark`'s prop API.
- Don't add a `size` enum (`"sm" | "md" | "lg"`) — px values are clearer for brand work.
- Don't open PRs against `poukai-inc/pouk.ai`.

## Validation

After landing the fix in DS and publishing `0.2.3`:

1. From the site repo: `pnpm up @poukai-inc/ui@0.2.3 && pnpm build`.
2. Open `http://localhost:4321/` — the POUKAI brand mark in the top-left should be visibly larger, roughly the size of the Astro "Why AI / Roles / Principles" nav text height × 1.5 (i.e. the brand is the page's anchor, the nav is its accompaniment).
3. Compare to the prior holding-page mark (`git show 89c5751:src/components/HomeHero.tsx` won't help here — the prior brand mark was inlined in `index.html` and is now in git history at `git show HEAD~1:public/index.html`, where it rendered at ~56→72px responsive). The new mark should feel proportional even if not byte-identical to the old.

## Release shape

- Patch bump: `0.2.2 → 0.2.3`. This is a default-value tweak, not an API change.
- Changeset summary: _"Raise SiteShell brand-mark height from 28px to 48px (or expose `brandHeight` prop) so the wordmark reads as the page's identity anchor, not a footnote."_
- After the changesets release PR merges and publish CI runs, ping the site repo. The site bumps to `0.2.3`, rebuilds, and re-screenshots.
