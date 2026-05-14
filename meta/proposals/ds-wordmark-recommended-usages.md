---
title: "Expand Wordmark recommended usages: size + horizontal lockup"
target_repo: poukai-inc/poukai-ui
suggested_resolution: patch
status: resolved
ds_issue: https://github.com/poukai-inc/poukai-ui/issues/10
target_version: 0.2.3
created: 2026-05-14
resolved: 2026-05-14
ds_pr: https://github.com/poukai-inc/poukai-ui/pull/17
notes_on_resolution: |
  Shipped Option A1 from the proposal — SiteShell brand-mark height
  raised from 28 → 56. Investigation step confirmed the underlying
  SVG path data is byte-identical to the prior holding page (same
  viewBox 0 0 518.67 274.41, same first path coords), so no orientation
  reshape was needed. Composition was always isotype-above-wordmark
  within a horizontal canvas. Open follow-up if desired: bump from
  fixed 56px to a 56–72px responsive clamp to match the old holding
  page's max-height feel on wider viewports.
---

# Expand `Wordmark` recommended usages: size + horizontal lockup

Two-part request, one proposal, one patch release.

## Symptom

On the live `pouk.ai` site, the brand mark in the top-left of every Astro route renders very small and reads as a stacked / cramped lockup rather than the proper horizontal POUKAI brand asset.

Two specific complaints from the founder:

1. **Too small.** The mark is essentially a footnote. The prior static holding page rendered the brand at a `clamp(3.5rem, 2.5rem + 2vw, 4.5rem)` height — i.e. **56–72px responsive**. The current `SiteShell` hardcodes `<Wordmark height={28} />`, which is roughly half that visual weight.

2. **Wrong-feeling lockup.** The prior holding page rendered the brand as a **horizontal** lockup (isotype on the left, then `POUKAI` wordtype to the right of it) and it read cleanly. The current site renders something that perceives as **stacked** (isotype above the wordtype). The founder explicitly prefers the horizontal version.

The viewBox of the inlined SVG (`0 0 518.67 274.41`, ~1.9:1 aspect ratio) suggests the underlying geometry is already horizontal — meaning the "stacked" perception may be a side effect of the 28px rendering compressing the lockup into illegibility, OR the geometry may have been re-shaped at some point since the holding page captured it. **Worth investigating before deciding the fix.**

## Investigation request

Before authoring the fix, please confirm one of these two states:

- **State A — horizontal geometry, just too small.** `Wordmark`'s SVG paths form a single horizontal lockup (isotype + POUKAI on one line) per the original `brand/avatar svg.svg`. The "stacked" appearance on `pouk.ai` is purely the result of 28px rendering, where the wordtype shrinks below the isotype's visual weight. **Fix: enlarge.**

- **State B — reshaped to stacked.** `Wordmark`'s SVG paths now arrange the isotype above the wordtype as a stacked composition, deviating from the original brand source. **Fix: restore the horizontal geometry AND enlarge.**

Open the DS in a browser at the size SiteShell renders it (28px height) and at the size the holding page rendered it (56–72px height) and compare. Or check `git log` on `wordmark-geometry.ts` (or wherever the inline SVG paths live) for any reshape commit since the package was first cut.

## Suggested fix

### Part 1 — Enlarge in SiteShell

Two acceptable shapes:

**Option A1 (preferred): raise the SiteShell default.** One line in `src/organisms/SiteShell/SiteShell.tsx`:

```diff
- <Wordmark height={28} />
+ <Wordmark height={56} />
```

48 or 56 — your call. 56 matches the lower end of the holding page's clamp. Pure JS prop change; no API expansion.

**Option A2: expose `brandHeight` prop on SiteShell.** Adds an opt-in lever for future consumers (e.g. `Pouk-AI-INC/*-app` surfaces that want a different mark height). Default to 48 or 56.

```ts
export interface SiteShellProps extends ComponentPropsWithoutRef<"div"> {
  // ...existing props
  /** Pixel height of the wordmark in the header. Defaults to 56. */
  brandHeight?: number;
}
```

Site repo prefers A1; A2 is fine if you'd rather expose the lever now.

### Part 2 — Confirm horizontal lockup

If the investigation lands on **State A** (horizontal geometry already): no work needed in Part 2 — Part 1 alone reveals the horizontal lockup the founder remembers.

If it lands on **State B** (geometry was reshaped to stacked): restore the horizontal lockup from the original brand source asset. The site has no opinion on the exact path data — only that the final rendered mark should match the prior holding page's identity. Use whatever was inlined in the prior `index.html` (now in git history at `git show e<sha>:public/index.html` from before its deletion) as the visual reference.

### Optional — `WordmarkStacked` as a future component

If a stacked variant is actually wanted on some other surface (e.g. a card or sidebar where horizontal space is constrained), don't reshape the canonical `Wordmark` — instead, ship a separate `WordmarkStacked` component or expose `Wordmark` with an `orientation: "horizontal" | "stacked"` prop. The canonical brand reads as horizontal; stacked is a derivative for tight surfaces.

This isn't requested for `0.2.3` — flagging only so if a stacked variant exists in the codebase it doesn't get conflated with the canonical mark.

## Validation

After landing the fix and publishing `0.2.3`:

1. `.github/workflows/ds-bump.yml` in `poukai-inc/pouk.ai` will receive the `ds-package-published` dispatch (once the producer side has emission wired — see the separate bootstrap proposal) and open a draft bump PR. Until then, the consumer agent will manually run the bump.
2. Open `https://pouk.ai/` (or the latest Vercel preview URL).
3. The POUKAI brand mark in the top-left should:
   - Appear at roughly **3× its current visual weight**
   - Read as a clear horizontal lockup: isotype on the left, `POUKAI` wordtype to the right of it on the same baseline
   - Match the visual identity of the prior holding page (`git show HEAD:public/index.html` — wait, the file is deleted; reference the commit before `9e56cdb` for the prior version)
4. The nav text (`Why AI · Roles · Principles`) should now feel proportional to the brand mark rather than dominating it.

## Out of scope

- Don't change the `Wordmark` atom's prop API.
- Don't change the `Wordmark` default `height` (64).
- Don't ship a stacked variant in this patch.
- Don't open PRs against `poukai-inc/pouk.ai`.

## Release shape

- **Patch bump**: `0.2.2 → 0.2.3` via changesets.
- Changeset summary: _"Raise `SiteShell` brand-mark height from 28px to 56px so the wordmark reads as the page's identity anchor."_ (Adjust if you go with `brandHeight` prop or restore horizontal geometry — describe what you did.)
- After publish CI runs and emits `repository_dispatch`, the consumer's `.github/workflows/ds-bump.yml` opens the bump PR.
