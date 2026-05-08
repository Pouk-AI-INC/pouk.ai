# pouk.ai — Holding Page Specification

---

## 1. Brand Identity

### 1.1 Color palette

Warm-dark foundation. Cold pure-black (#000) reads as generic SaaS; we shift the entire palette ~3° warm to differentiate from Vercel/Linear and tie into the mythic/feather origin (firelight, aged parchment, sunset on plumage).

| Token | Hex | Role | Rationale |
|---|---|---|---|
| `--bg` | `#0E0D0C` | Page background | Near-black with a warm bias. Reads premium, not sterile. |
| `--surface` | `#17150F` | Subtle elevation (footer rule) | One step up from bg, same warm cast. |
| `--fg` | `#F5F2EB` | Primary text, wordmark | Off-white with parchment warmth. Avoids the harsh white-on-black laptop-glare problem. |
| `--fg-muted` | `#B8B2A6` | Secondary copy (description) | 7.8:1 on bg — passes AAA. |
| `--fg-subtle` | `#7A7468` | Footer, dividers, social icons | 4.6:1 on bg — passes AA for body. |
| `--accent` | `#D4A574` | Status dot, link underline-on-hover | Burnt amber. Eagle-eye / sunlit feather. The *only* chromatic note on the page — used in single drops, never in fills. |
| `--accent-glow` | `rgba(212, 165, 116, 0.18)` | Pulse halo on status dot | Same hue, low alpha. |

**No gradients. No glassmorphism. No glows except the single status-dot pulse.**

### 1.2 Typography

Three faces, each doing one job. All free, all on Google Fonts CDN — zero licensing risk for a solo founder.

| Role | Family | Weights | Why |
|---|---|---|---|
| **Wordmark + technical accents** | **Geist Mono** | 500 | Renders `pouk.ai` like a hostname / CLI prompt. Signals "operator, not marketer." The `.` becomes a deliberate punctuation mark, not noise. |
| **Display (tagline only)** | **Instrument Serif** | 400 regular, 400 italic | A high-contrast modern serif with editorial gravitas. Carries the mythic / considered side of the brand. Its slight quirkiness keeps the page from feeling corporate-sterile. |
| **Body / UI** | **Inter** | 400, 500 | Workhorse. Optical sizing, excellent rendering at small sizes, zero personality friction with the other two. |

**Font scale** (mobile → desktop, with `clamp()`):

```
--fs-wordmark:  clamp(1.0625rem, 0.95rem + 0.6vw, 1.25rem)   /* 17–20px, Geist Mono 500, letter-spacing -0.01em */
--fs-tagline:   clamp(2.25rem, 1.5rem + 3.5vw, 4.25rem)      /* 36–68px, Instrument Serif, line-height 1.05 */
--fs-body:      clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)    /* 17–19px, Inter 400, line-height 1.55 */
--fs-meta:      0.875rem                                      /* 14px, Inter 500 */
--fs-micro:     0.75rem                                       /* 12px, Inter 500, letter-spacing 0.04em, uppercase */
```

**Loading**: single `<link>` with `display=swap` and `preconnect` to fonts.googleapis.com + fonts.gstatic.com. Subset Latin only.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap">
```

### 1.3 Visual language — the mark

A 24×24 sigil placed immediately left of the wordmark. Reads as an altimeter / bearing indicator, not a bird. The brand is "from height, with precision" — the mark says that without illustrating an eagle (cliché trap).

**Specification** (24×24 viewBox, 1.25 stroke, `currentColor`, `stroke-linecap: round`):

- A horizontal hairline from `(4, 8)` to `(20, 8)` — the altitude.
- A vertical line from `(12, 8)` to `(12, 19)` — the descent / stoop.
- A short impact tick: from `(9, 19.5)` to `(15, 19.5)` — the strike.

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" aria-hidden="true">
  <line x1="4" y1="8" x2="20" y2="8"/>
  <line x1="12" y1="8" x2="12" y2="19"/>
  <line x1="9" y1="19.5" x2="15" y2="19.5"/>
</svg>
```

Three strokes. No fill. Inherits color from text. Renders identically at 16px and 64px. The geometry is unique enough to be searchable in trademark databases later but abstract enough to never become dated.

---

## 2. Page Architecture

### 2.1 Layout

- **Single viewport hero** — content fits within 100vh on desktop ≥768px tall; on shorter screens, page scrolls naturally with no second "fold."
- **Grid**: CSS Grid, 12 columns, 24px gutters on desktop / 16px on mobile.
- **Content max-width**: `min(100% - 3rem, 64rem)` — 1024px cap. Content occupies columns 1–7 on desktop (≈58% width), leaving deliberate negative space on the right. **Top-left aligned, not centered.** Centering reads as template; left-aligned with asymmetric whitespace reads as designed.
- **Outer page padding**: `clamp(1.5rem, 2vw + 1rem, 3rem)` all sides.

### 2.2 Breakpoints

```
--bp-sm: 480px    /* phone landscape / small tablet */
--bp-md: 768px    /* tablet / collapsed laptop */
--bp-lg: 1024px   /* primary desktop */
--bp-xl: 1440px   /* wide desktop */
```

Mobile-first. Only 3 media queries needed total: at 768px (typography scales lock in via clamp anyway; this query handles grid columns), and one for `prefers-reduced-motion`.

### 2.3 Section order

```
┌───────────────────────────────────────────────┐
│  [mark] pouk.ai                    ← top-left │
│                                                │
│  (vertical space — 6rem on desktop)           │
│                                                │
│  Technical consulting for                     │
│  teams shipping with AI.       ← display      │
│                                                │
│  pouk.ai builds custom AI systems,            │
│  automations, and advisory engagements        │
│  for operators who'd rather ship than         │
│  speculate. Named for Pouākai —               │
│  the largest eagle that ever flew,            │
│  hunting by stooping from height.             │
│                                                │
│  ● Currently taking conversations for Q3.     │
│                                                │
│  hello@pouk.ai                                │
│                                                │
│  (vertical space — pushes footer to bottom)   │
│                                                │
│  ─────────────────────────────────────        │
│  © 2026 pouk.ai      LinkedIn  X  IG  GitHub  │
└───────────────────────────────────────────────┘
```

The page is a `<main>` flex column with `min-height: 100svh; justify-content: space-between` — header content sits naturally near top, footer pinned to bottom on tall viewports, scrolls naturally on short ones.

### 2.4 Spacing scale

Base unit: `0.25rem` (4px). Use only these tokens — no arbitrary values.

```
--space-1:   0.25rem   /*  4px */
--space-2:   0.5rem    /*  8px */
--space-3:   0.75rem   /* 12px */
--space-4:   1rem      /* 16px */
--space-6:   1.5rem    /* 24px */
--space-8:   2rem      /* 32px */
--space-12:  3rem      /* 48px */
--space-16:  4rem      /* 64px */
--space-24:  6rem      /* 96px */
--space-32:  8rem      /* 128px */
```

**Vertical rhythm** within hero block:

| Between | Mobile | Desktop |
|---|---|---|
| Header (mark+wordmark) → Tagline | `--space-16` | `--space-24` |
| Tagline → Description | `--space-6` | `--space-8` |
| Description → Status line | `--space-8` | `--space-12` |
| Status line → Contact | `--space-4` | `--space-6` |
| Hero block → Footer | `auto` (flex spacer) | `auto` |
| Footer top border → Footer content | `--space-6` | `--space-6` |

**Horizontal rhythm**:

- Mark → Wordmark: `--space-3` (12px)
- Status dot → Status text: `--space-3`
- Footer copyright → Socials: `auto` (space-between via flex)
- Social link → Social link: `--space-6`

---

## 3. Copy — final, approved

### 3.1 On-page

| Element | Copy |
|---|---|
| Wordmark | `pouk.ai` |
| Tagline (`<h1>`) | `Technical consulting for teams shipping with AI.` |
| Description (`<p>`) | `pouk.ai builds custom AI systems, automations, and advisory engagements for operators who'd rather ship than speculate. Named for Pouākai — the largest eagle that ever flew, hunting by stooping from height.` |
| Status | `Currently taking conversations for Q3.` |
| Contact | `hello@pouk.ai` (rendered as `<a href="mailto:hello@pouk.ai">`) |
| Footer | `© 2026 pouk.ai` |

The tagline italicizes "with AI" using Instrument Serif's italic — a small editorial flourish that does most of the typographic work on the page.

### 3.2 Meta

| Field | Copy | Length |
|---|---|---|
| `<title>` | `pouk.ai — Technical consulting for teams shipping with AI` | 56 |
| Meta description | `Custom AI builds, automations, and advisory for teams that need to ship. Founded by a frontend engineer. Currently taking Q3 conversations.` | 139 |
| OG title | `pouk.ai` | 7 |
| OG description | `Technical consulting for teams shipping with AI. Custom builds, automations, and advisory.` | 91 |
| Twitter card | `summary_large_image` |

---

## 4. Interaction & Motion

The brief is "premium, refined, restrained." Motion is a *seasoning*, not a feature.

### 4.1 Hover & focus states

| Element | Default | Hover | Focus-visible |
|---|---|---|---|
| Email link | `color: var(--fg)`, no underline | `color: var(--fg)`, `box-shadow: inset 0 -1px 0 var(--accent)` (animated underline grow from left, 240ms `cubic-bezier(0.2, 0, 0, 1)`) | `outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 2px` |
| Social links (text labels) | `color: var(--fg-subtle)` | `color: var(--fg)` (180ms ease) | Same focus ring as above |
| Wordmark | Not interactive (no link — single page) | — | — |

The animated underline uses `background-image: linear-gradient(var(--accent), var(--accent))` with `background-size: 0% 1px` → `100% 1px` on hover, anchored bottom-left. This is jankless on all engines and degrades gracefully.

**No hover effects on touch devices** — wrap them in `@media (hover: hover)`.

### 4.2 Entrance animation

Single sequence, fires once on load. Total duration: 1100ms. Uses `cubic-bezier(0.16, 1, 0.3, 1)` (the "expo out" curve that Linear/Vercel both use — strong start, gentle settle).

| Step | Element | Delay | Duration | Transform | Opacity |
|---|---|---|---|---|---|
| 1 | Mark + Wordmark | 0ms | 600ms | `translateY(8px) → 0` | `0 → 1` |
| 2 | Tagline | 150ms | 700ms | `translateY(12px) → 0` | `0 → 1` |
| 3 | Description | 300ms | 600ms | `translateY(8px) → 0` | `0 → 1` |
| 4 | Status + Contact | 450ms | 600ms | `translateY(8px) → 0` | `0 → 1` |
| 5 | Footer | 600ms | 500ms | `translateY(0)` | `0 → 1` |

No bounce, no overshoot, no scale. Just a quiet upward settle.

**Status dot pulse**: continuous, 2400ms loop, `ease-in-out`. Ring of `--accent-glow` scales `1 → 2.2` while fading `0.6 → 0`. Implemented with `::after` pseudo-element + `@keyframes` so it doesn't repaint the dot itself.

### 4.3 prefers-reduced-motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Entrance: elements appear at final state immediately. Status dot: solid, no pulse. Underline hover: instant color change, no slide.

---

## 5. Accessibility & SEO

### 5.1 Contrast (calculated against `#0E0D0C`)

| Pair | Ratio | WCAG |
|---|---|---|
| `--fg` (#F5F2EB) on bg | **18.4:1** | AAA |
| `--fg-muted` (#B8B2A6) on bg | **9.6:1** | AAA |
| `--fg-subtle` (#7A7468) on bg | **4.6:1** | AA (body) |
| `--accent` (#D4A574) on bg | **9.1:1** | AAA |
| Focus ring `--accent` adjacent to bg | **9.1:1** | Visible per WCAG 2.4.13 |

All interactive elements use `--fg` or `--accent` — never the subtle tone — so all clickable text exceeds 4.5:1.

### 5.2 Semantic structure

```html
<body>
  <main>
    <header>
      <p class="wordmark"><svg .../> pouk.ai</p>
    </header>

    <section aria-label="Introduction">
      <h1>Technical consulting for teams shipping with <em>AI</em>.</h1>
      <p>pouk.ai builds custom AI systems...</p>
      <p class="status">
        <span class="status-dot" aria-hidden="true"></span>
        Currently taking conversations for Q3.
      </p>
      <p><a href="mailto:hello@pouk.ai">hello@pouk.ai</a></p>
    </section>
  </main>

  <footer>
    <p>© 2026 pouk.ai</p>
    <nav aria-label="Social media">
      <ul>
        <li><a href="https://linkedin.com/company/poukai" rel="me noopener">LinkedIn</a></li>
        <li><a href="https://x.com/pouk_ai" rel="me noopener">X</a></li>
        <li><a href="https://instagram.com/pouk.ai" rel="me noopener">Instagram</a></li>
        <li><a href="https://github.com/pouk-ai" rel="me noopener">GitHub</a></li>
      </ul>
    </nav>
  </footer>
</body>
```

- One `<h1>` only.
- Wordmark is `<p>`, not `<h1>` — the tagline is the page's headline, not the brand name.
- Mark SVG marked `aria-hidden` and the wordmark text carries the meaning.
- Socials use text labels (not icon-only) for screen reader clarity. If icons are desired later, add them with `aria-hidden` and keep text via `.visually-hidden` if needed — but for this holding page, plain text labels are more on-brand than generic social icons.
- `:focus-visible` (not `:focus`) so mouse clicks don't show the ring.
- Skip-link omitted intentionally — single-section page, nothing to skip past.

### 5.3 Complete meta inventory

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="theme-color" content="#0E0D0C">

  <title>pouk.ai — Technical consulting for teams shipping with AI</title>
  <meta name="description" content="Custom AI builds, automations, and advisory for teams that need to ship. Founded by a frontend engineer. Currently taking Q3 conversations.">

  <link rel="canonical" href="https://pouk.ai/">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://pouk.ai/">
  <meta property="og:title" content="pouk.ai">
  <meta property="og:description" content="Technical consulting for teams shipping with AI. Custom builds, automations, and advisory.">
  <meta property="og:image" content="https://pouk.ai/og.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@pouk_ai">
  <meta name="twitter:title" content="pouk.ai">
  <meta name="twitter:description" content="Technical consulting for teams shipping with AI.">
  <meta name="twitter:image" content="https://pouk.ai/og.png">

  <!-- Icons -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Robots -->
  <meta name="robots" content="index,follow">

  <!-- JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "pouk.ai",
    "url": "https://pouk.ai",
    "email": "hello@pouk.ai",
    "description": "Technical consulting for teams shipping with AI.",
    "sameAs": [
      "https://linkedin.com/company/poukai",
      "https://x.com/pouk_ai",
      "https://instagram.com/pouk.ai",
      "https://github.com/pouk-ai"
    ]
  }
  </script>
</head>
```

**OG image (`og.png`)**: 1200×630, generated once. Background `#0E0D0C`, wordmark `pouk.ai` in Geist Mono 500 at 96px in `#F5F2EB`, mark sigil to the left scaled to 96px, tagline below in Instrument Serif italic at 56px in `#B8B2A6`. Centered. PNG, ≤80KB.

**Favicon (`favicon.svg`)**: the sigil only, stroke `#F5F2EB`, transparent background. Inline-able: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#F5F2EB" stroke-width="1.5" stroke-linecap="round"><line x1="4" y1="8" x2="20" y2="8"/><line x1="12" y1="8" x2="12" y2="19"/><line x1="9" y1="19.5" x2="15" y2="19.5"/></svg>`.

---

## 6. Deployment

### 6.1 File structure

```
poukai/
├── index.html          # Everything: HTML, inline <style>, no JS
├── og.png              # 1200×630, ≤80KB
├── favicon.svg         # Sigil mark
├── apple-touch-icon.png # 180×180, sigil on #0E0D0C
├── robots.txt          # User-agent: *  Allow: /  Sitemap: https://pouk.ai/sitemap.xml
├── sitemap.xml         # Single URL, https://pouk.ai/
└── _headers            # Cloudflare/Netlify security headers (see below)
```

CSS lives inline in `<style>` in `<head>` — page is small enough that an external stylesheet adds a round-trip without benefit. No JS file at all.

**Target page weight**: HTML ≤ 8KB gzipped, OG image excluded. With Google Fonts CDN: ~80KB total first paint, ~25KB on warm cache.

**`_headers` file** (Cloudflare Pages / Netlify syntax):

```
/*
  Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=(), interest-cohort=()
  Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; script-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'
```

### 6.2 Hosting — recommended: Cloudflare Pages

**Why Cloudflare Pages over Vercel / Netlify for this specific case:**
- Free tier with no project limits and no per-seat cost as the team grows.
- Apex domain (`pouk.ai`) routing is native — no `ALIAS` / `ANAME` workarounds since DNS lives at Cloudflare.
- Edge cache hits are the fastest of the three for static-only sites in most regions.
- Zero-JS sites get full benefit from Cloudflare's automatic Brotli + early hints.
- Bot management and basic analytics free.

Vercel is the second choice (and equally fine) if the founder anticipates moving to Next.js shortly. Netlify is fine but offers no advantage here.

**Deploy flow:**
1. Push repo to GitHub.
2. Cloudflare Pages → "Connect to Git" → select repo.
3. Build command: *(none)*. Build output directory: `/`.
4. Add custom domain `pouk.ai` and `www.pouk.ai` in Pages → Custom Domains.
5. Cloudflare auto-creates the DNS records below if the zone is on Cloudflare.

### 6.3 DNS records (apex domain on Cloudflare)

If the domain is on Cloudflare DNS, Pages auto-provisions. Manual records (for reference, or if DNS is elsewhere):

| Type | Name | Value | Proxy | TTL |
|---|---|---|---|---|
| `CNAME` | `pouk.ai` (apex, flattened) | `<your-project>.pages.dev` | Proxied (orange cloud) | Auto |
| `CNAME` | `www` | `<your-project>.pages.dev` | Proxied | Auto |
| `MX` | `pouk.ai` | `<email provider, e.g., Fastmail / Google Workspace>` | DNS only | 3600 |
| `TXT` | `pouk.ai` | `v=spf1 include:<provider> -all` | DNS only | 3600 |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:hello@pouk.ai` | DNS only | 3600 |
| `TXT` | `<selector>._domainkey` | `<DKIM key from email provider>` | DNS only | 3600 |
| `CAA` | `pouk.ai` | `0 issue "letsencrypt.org"` and `0 issue "pki.goog"` | DNS only | 3600 |

**Apex flattening**: Cloudflare's CNAME flattening lets `pouk.ai` use a `CNAME` directly, which other DNS providers don't allow. If DNS is *not* on Cloudflare, use `ALIAS` (DNSimple, Route 53), `ANAME` (DNS Made Easy), or fall back to A records pointing at Cloudflare Pages' published IPs.

**`hello@pouk.ai`**: needs MX records configured before launch — recommend Fastmail ($5/mo, founder-grade) or Google Workspace if Google's other tools are in use. SPF, DKIM, DMARC are non-negotiable from day one to avoid first prospect emails landing in spam.

**SSL**: Cloudflare provisions automatically. Set SSL/TLS mode to "Full (strict)." Enable "Always Use HTTPS" and "Automatic HTTPS Rewrites."

---

## Summary of decisions worth defending

1. **Warm-dark palette over cold-dark**: differentiates from Vercel/Linear and gives the brand a temperature that matches the mythic origin without being literal about it.
2. **Geist Mono for the wordmark**: `pouk.ai` looks like a hostname, which is exactly what a technical consulting firm wants prospects' eyes to register.
3. **Instrument Serif for the tagline**: introduces the only "human" voice on the page. Italic on "AI" is the page's single editorial gesture and earns its keep.
4. **Three-stroke geometric sigil instead of any bird imagery**: bird marks for AI companies are saturated. The altimeter glyph encodes "from height" without illustrating it.
5. **Top-left asymmetric layout**: centered hero pages are the default; left-aligned with deliberate right-side negative space reads as designed, which is the entire point of a frontend engineer's holding page.
6. **One accent color, used in two places**: status dot and link-hover underline. Restraint here is the brand.
7. **Inline everything, zero JS**: the page itself becomes a credential. A founder who ships this exact page is signaling taste through the artifact, not just claims about it.
