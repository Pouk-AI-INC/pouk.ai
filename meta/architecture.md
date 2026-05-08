# pouk.ai — architecture

How the page is built. For future-self when the codebase grows past one file.

## File layout

```
.                       # repo root = the deployable
├── .gitignore
├── index.html          # everything — HTML, embedded <style>, inline JSON-LD
├── README.md           # local preview, deploy, DNS
├── meta/               # project memory (committed, not deployed-relevant)
│   ├── journal.md      # what happened and why (reverse-chronological)
│   ├── backlog.md      # what's left to do
│   └── architecture.md # this file
└── specs/              # the original product brief (committed for posterity)
```

To add at launch (see `backlog.md`): `og.png`, `apple-touch-icon.png`, `robots.txt`, `sitemap.xml`, `vercel.json`, all at the repo root.

Brand source assets live in a `brand/` folder alongside the repo on the founder's local disk but are **gitignored** — they're inputs to the site (logo SVG was inlined from there), not deployed artifacts. If a teammate ever needs them to regenerate `og.png` etc., they're out-of-band.

## Constraints

- Pure HTML5 + CSS. **No JavaScript. No build step. No frameworks.**
- Single file: CSS lives inline in `<style>`. Inline SVG for the sigil mark and the favicon (data URI).
- One external dependency: Google Fonts CDN — **Instrument Serif only** (one request). Body uses the Apple system font stack. The header is now an inline brand-asset SVG, so no monospace face is needed.
- Modern evergreen browsers only (Chrome / Safari / Firefox / Edge, last 2 versions).

## Design system

All design tokens live in `:root` as CSS custom properties. Three groups, single source of truth.

### Color (Apple-light)

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#FFFFFF` | page background |
| `--surface` | `#F5F5F7` | reserved for elevation if needed |
| `--fg` | `#1D1D1F` | primary text, sigil stroke, status-line text, email link |
| `--fg-muted` | `#6E6E73` | lede description, footer text + links |
| `--hairline` | `#D2D2D7` | footer rule |
| `--accent` | `#0071E3` | status dot, email-link underline-on-hover, focus ring |
| `--accent-glow` | `rgba(0, 113, 227, 0.18)` | status-dot pulse halo |

The accent is used in **three places only**: status dot fill, animated underline gradient, focus ring. Restraint here is the brand.

### Typography

| Token | Value |
|---|---|
| `--fs-wordmark` | `clamp(1.0625rem, 0.95rem + 0.6vw, 1.25rem)` — 17→20px |
| `--fs-tagline` | `clamp(2.25rem, 1.5rem + 3.5vw, 4.25rem)` — 36→68px |
| `--fs-body` | `clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)` — 17→19px |
| `--fs-meta` | `0.875rem` — 14px |
| `--fs-micro` | `0.75rem` — 12px |

Two font tokens:

- `--font-serif` — Instrument Serif (tagline `<h1>` only, `ital@0;1` to load both) → `Georgia, Times New Roman, serif`
- `--font-sans` — Apple system stack (body, status, footer) → `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', 'Segoe UI', Arial, sans-serif`

The header doesn't use a font face — it's the inlined brand SVG (feather isotype + `POUKAI` letterforms). Geist Mono was dropped when the placeholder wordmark was retired.

### Spacing

`--space-1` (4px) → `--space-32` (128px), powers of the 4px base. **No arbitrary spacing values appear in the stylesheet** — if a new value is needed, add a token first.

## Layout

`<body>` is a flex column with `min-height: 100svh` and the outer page padding (`clamp(1.5rem, 2vw + 1rem, 3rem)`). `<main>` flex-grows so `<footer>` pins to the bottom on tall viewports and scrolls naturally on short ones.

The hero content is capped at `38rem` on `≥768px` so the right side stays empty by design — top-left aligned, asymmetric whitespace, *not* centered. (Centered reads as template; left-aligned with deliberate negative space reads as designed.)

Vertical rhythm comes from `margin-bottom` on each preceding element using the spacing scale. Two breakpoints (`768px` for layout, `prefers-reduced-motion`) — that's all the media queries the page needs.

## Motion

Two systems, both gated by `@media (prefers-reduced-motion: reduce)` (the only `!important` block in the stylesheet, per the standard a11y exception).

- **Entrance**: 5-step stagger, total ~1.1s. Each element gets a `.reveal-N` class with `animation-fill-mode: both` to prevent flash during delays. Easing: `cubic-bezier(0.16, 1, 0.3, 1)` ("expo out").
- **Status dot pulse**: continuous 2.4s loop on `.status-dot::after`. The `--accent-glow` ring scales `1 → 2.2` while fading `0.6 → 0`. The dot itself never repaints.
- **Email-link underline**: `background-size: 0% 1px → 100% 1px` transition, 240ms `cubic-bezier(0.2, 0, 0, 1)`, anchored bottom-left. Wrapped in `@media (hover: hover)` so touch devices don't get sticky underlines.

## Accessibility

- One `<h1>`. `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>` semantics throughout.
- `aria-hidden="true"` on the decorative brand-logo SVG and the pulse dot; `aria-label` on the introduction section and the social nav.
- The brand logo is paired with `<span class="visuallyhidden">POUKAI</span>` so screen readers announce the brand name (the SVG itself is hidden from the a11y tree).
- `:focus-visible` (not `:focus`) — keyboard ring, no mouse-click ring.
- All text contrast ≥ WCAG AA against `#FFFFFF`. Primary text 16.7:1, muted 5.0:1.
- No skip-link — single-section page, nothing to skip past.

## Deployment target

Vercel, apex domain at Porkbun via `ALIAS` (Porkbun supports apex `ALIAS`, no zone migration needed). Static deploy, no framework preset, no build command, repo root deploys directly. See `README.md` for the full DNS / SSL / email setup.

## Decision rules for future changes

- **New visual change** → add a token first, use the token in the selector. Don't hardcode hex or spacing.
- **New section** → semantic element first. Wrapper `<div>`s only when motion or layout actually demands one.
- **New animation** → keyframe + class on the element. No JS. Always pair with a `prefers-reduced-motion` exit.
- **New font** → measure CLS before adding. Current target is a single Google Fonts request; the Apple system stack should cover any new sans needs.
- **No JS unless strictly necessary** is a load-bearing constraint, not a preference. The page itself is the credential — adding a runtime defeats it.
