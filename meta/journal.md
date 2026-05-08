# pouk.ai — journal

Reverse-chronological. Newest entry on top.

## 2026-05-08 — repo flatten: site/ contents moved to repo root

After the initial push to `Pouk-AI-INC/pouk.ai`, decided the repo should represent only what's deployed — not the working folder. Flattened:

- `site/index.html`, `site/README.md`, `site/meta/`, `site/specs/` moved up to the repo root.
- `site/` directory removed.
- `brand/` added to `.gitignore` — brand source assets stay on local disk but don't ship in the repo (they're inputs, not artifacts).
- Doc references updated: dropped "Root Directory: site" from README and architecture, dropped `cd site` from the Vercel CLI flow, `site/vercel.json` → `vercel.json` (repo root), brand-folder note rewritten as "alongside repo, gitignored."
- Force-pushed (single-commit history, private repo, low risk).

The mental model lands: **this repo IS the site**, not a wrapper around it.

## 2026-05-08 — header swap: brand logo replaces placeholder wordmark

Swapped the placeholder header (3-stroke altimeter sigil + Geist Mono `pouk.ai`) for the real brand asset from `/brand/`: the feather isotype + `POUKAI` typography, vertically stacked.

- Inlined a cleaned version of `brand/avatar svg.svg` directly into the header — stripped editor metadata, IDs, empty styles, and dead stroke specs; fills set to `currentColor` so the logo inherits `--fg`.
- Logo height: `clamp(3.5rem, 2.5rem + 2vw, 4.5rem)` (56→72px). Larger than the prior 24px sigil, but the brand asset's typography needs the room to read.
- `<span class="visuallyhidden">POUKAI</span>` added inside the header for screen readers (matches displayed identity).
- **Geist Mono dropped** from Google Fonts (only consumer was the wordmark). `--font-mono` token removed. Single Google Fonts request now — Instrument Serif only.
- Visible identity in the header is now `POUKAI` (uppercase brand). The `pouk.ai` domain still appears in `<title>`, contact email, footer copyright, and JSON-LD — the brand-name vs. domain split mirrors how Apple, Linear, Stripe etc. handle it.
- File grew 11.3KB → 20.5KB (mostly path data for the POUKAI letterforms).
- Favicon **not** updated this pass — the feather isotype path is much heavier than the 3-stroke geometry. Tracked in `backlog.md`.

## 2026-05-08 — palette pivot to Apple-light

After seeing the warm-dark home page rendered, decided to pivot to a light palette closer to Apple's product-page system.

- bg `#FFFFFF`, secondary `#F5F5F7`, hairline `#D2D2D7`
- text `#1D1D1F` primary, `#6E6E73` muted (dropped third `--fg-subtle` tier — fails WCAG AA on white at 14px)
- accent `#0071E3` (Apple Blue) replaces warm amber `#D4A574`
- body font swapped to Apple system stack; Inter dropped from Google Fonts (one fewer font request)
- Geist Mono wordmark + Instrument Serif tagline italic kept — these are the brand's identity differentiators against generic Apple-clone territory
- favicon SVG made dark-mode-aware via inline `prefers-color-scheme: dark` so it stays visible against dark browser tabs
- README `og.png` / `apple-touch-icon.png` palette specs updated to the new colors

## 2026-05-08 — initial build

Implemented the full holding-page spec.

- Single-file `index.html`, no JS, no build, embedded `<style>`
- Inline-SVG favicon via data URI (one of the tech requirements)
- Mobile-first, `clamp()` typography, `dvh` units, `:focus-visible` rings
- Three-fonts setup at the time: Geist Mono (wordmark) / Instrument Serif (tagline) / Inter (body)
- 5-step staggered entrance + continuous status-dot pulse, both gated by `prefers-reduced-motion`
- Full meta inventory: title, description, canonical, Open Graph, Twitter card, Organization JSON-LD
- Founder reorganized files into `./site/` mid-build — non-blocking, paths re-pointed
