# pouk.ai — backlog

Things to ship before / around launch. Roughly priority-ordered within sections.

## Blockers for launch

- [ ] **Generate `og.png`** (1200×630). Spec: `#FFFFFF` bg, full POUKAI logo (feather isotype + letterforms from `brand/avatar svg.svg`) in `#1D1D1F` centered, tagline in Instrument Serif italic 56px `#6E6E73` below. ≤80KB. Referenced by `<meta property="og:image">` and Twitter card.
- [ ] **Generate `apple-touch-icon.png`** (180×180). Feather isotype `#1D1D1F` on `#FFFFFF` bg. Source: extract from `brand/avatar svg.svg` or convert `brand/avatar-isotype.png` (which is already isotype-only) to 180×180. Referenced by `<link rel="apple-touch-icon">`.
- [ ] **Update favicon** to the feather isotype (currently still the 3-stroke placeholder altimeter from the original spec). The header now uses the real brand logo, so the favicon should match. Inline data-URI SVG using just the two isotype paths from `brand/avatar svg.svg`, with a `prefers-color-scheme: dark` rule to flip to `#F5F5F7` for dark browser-tab UIs.
- [ ] Add `robots.txt` (`User-agent: *\nAllow: /\nSitemap: https://pouk.ai/sitemap.xml`)
- [ ] Add `sitemap.xml` (single URL: `https://pouk.ai/`)
- [ ] Add `vercel.json` at the repo root (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy; CSP optional). Baseline JSON in `README.md`.
- [ ] Resolve JSON-LD ↔ CSP only **if** you add `script-src 'none'` to `vercel.json`. Vercel doesn't enforce a CSP by default, so the conflict is opt-in. If you do opt in: hash-pin (`'sha256-…'`), relax to `'unsafe-inline'`, or drop JSON-LD from `index.html`.

## DNS + email

- [ ] Configure Porkbun: `ALIAS` apex + `CNAME www` → `cname.vercel-dns.com`
- [ ] Vercel → **Settings → Domains**: add `pouk.ai` and `www.pouk.ai`, wait for cert
- [ ] Pick email host (Fastmail / Google Workspace) for `hello@pouk.ai`
- [ ] Add MX, SPF, DKIM, DMARC, CAA records — must be live before first prospect email goes out

## Brand assets in `/brand/` — status

`/brand/` contains: `avatar.png`, `avatar-isotype.png`, `banner.png`, `isotype svg.png`, `logo svg.png`, `avatar svg.svg`.

- [x] **Header logo** — done. Inlined a cleaned version of `avatar svg.svg` (full POUKAI logo) into the page header on 2026-05-08.
- [ ] `banner.png` — decide whether to use as the OG card, or generate a fresh card per the spec in the launch-blockers section above.
- [ ] `avatar.png` / `avatar-isotype.png` — likely candidates for `apple-touch-icon.png`; confirm chosen variant matches the favicon and OG.

## Nice-to-haves (post-launch)

- [ ] Lighthouse audit on production URL (target: 100 / 100 / 100 / 100)
- [ ] axe DevTools pass, manual screen-reader walk
- [ ] Real-device check at 320px width
- [ ] Confirm Instrument Serif fallback (Georgia) doesn't cause CLS on slow connections — it's the only remaining Google Fonts request
- [ ] Decide whether to add a basic analytics signal — Vercel Web Analytics is one toggle in the dashboard (cookieless, no JS for the basic tier); Cloudflare Web Analytics is the host-agnostic alternative.
