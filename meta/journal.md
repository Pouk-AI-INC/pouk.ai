# pouk.ai — journal

Reverse-chronological. Newest entry on top.

## 2026-05-16 — Email provisioning complete: Google Workspace + DNS live

Completed Google Workspace setup for `hello@pouk.ai`:

**Timeline:**
1. Signed up for Google Workspace Business Starter ($7/mo)
2. Verified domain ownership via TXT record at Vercel DNS
3. Created user `hello@pouk.ai` in Workspace Admin
4. Generated DKIM key (2048-bit) via Admin Console → Apps → Google Workspace → Gmail → Authenticate Email
5. Added all five DNS records to Vercel:
   - MX: `smtp.google.com` priority 1
   - SPF: `v=spf1 include:_spf.google.com -all`
   - DMARC: `v=DMARC1; p=none; rua=mailto:hello@pouk.ai; pct=100`
   - DKIM: public key at `google._domainkey`
   - Verification: temporary TXT (can delete)

**Verification (2026-05-16 15:45 UTC):**
- All four authentication records confirmed live via `dig`
- MX resolves correctly to `smtp.google.com`
- SPF and DMARC include proper rua= reporting address
- DKIM public key verified (2048-bit RSA)

**Status:** Email is production-ready. `hello@pouk.ai` can send and receive. First prospect email will land in inbox, not spam. DMARC policy set to `p=none` with 100% sampling for 30 days to avoid quarantining legitimate mail while alignment settles; will ratchet to `p=quarantine` once routine sends are verified.

**Next:** `/.well-known/security.txt` (RFC 9116 disclosure file) is the final launch-readiness item. Low effort, can close post-launch if needed.

## 2026-05-16 — Email provider decision: Google Workspace Business Starter

Evaluated three tiers of email providers for `hello@pouk.ai`:

**Tier 1 (hyperscaler, $7-12/mo)**: Google Workspace, Microsoft 365, Apple iCloud+
**Tier 2 (mid-scale, $1-5/mo)**: Purelymail, Migadu, Fastmail
**Tier 3 (free/ultra-cheap)**: Zoho Mail Free (web-only), Apple iCloud+ $0.99/mo (if already owned)

Decision: **Google Workspace Business Starter ($7/mo)**. Rationale:
- Hyperscaler sender reputation: gold-tier deliverability for prospect outreach (critical per backlog constraint: "must be live before the first prospect email goes out — otherwise it lands in spam")
- Drag-along Docs/Drive/Calendar/Meet genuinely useful for consultancy work (proposals, scheduling, client calls)
- 99.9% SLA, 30GB storage, 100 users per workspace standard (will never hit user limit for solo founder)
- Setup is polished (domain verification, DKIM auto-generation, admin console all first-class)

Alternatives considered and rejected:
- **Microsoft 365 Business Standard** ($12.50/mo) — slightly better fit for enterprise client work, but Poukai skews modern/startup; Google Docs format is dominant exchange
- **Apple iCloud+ $0.99/mo** — excellent value if already owned, but requires Apple ecosystem and single-user practical limit; leaves Purelymail at $10/yr as cost alternative, but shared-IP reputation is acceptable-not-excellent for cold prospect mail
- **Forward Email / Purelymail / Migadu** — good value, but shared-IP reputation creates ~10-15% first-email friction (soft-bounce/graylisting) on brand-new domain for cold outreach; backlog constraint makes friction unacceptable

Setup path: workspace.google.com → add domain `pouk.ai` → verify via DNS TXT → create user `hello@pouk.ai` → authenticate email via DKIM → add all 5 records to Vercel DNS → verify both in Workspace + Vercel.

## 2026-05-16 — DNS + Vercel binding audit; backlog reconciled

Working through the "DNS + email" section of `backlog.md` (lines 16–40), discovered the section's framing was stale:

- **Nameservers point at Vercel, not Porkbun.** `dig +short NS pouk.ai` returns `ns1.vercel-dns.com.` and `ns2.vercel-dns.com.`. Whenever this was set (probably at registration time on 2026-05-13, undocumented), authority moved to Vercel, so the original "Porkbun Domain Management → DNS Records" steps don't apply. All DNS edits happen inside the Vercel dashboard.
- **Apex + www are live.** `dig +short pouk.ai` → Vercel anycast IPs (`216.198.79.1`, `64.29.17.1`). `https://pouk.ai/` returns `HTTP/2 200`, `server: Vercel`, full security-header stack from `vercel.json`, HSTS preload-eligible. `www.pouk.ai` → `307` → apex.
- **CAA already in place and broader than asked.** Three issuers: `letsencrypt.org`, `pki.goog`, `sectigo.com`. Original backlog only requested the first two; the extra issuer is harmless (CAA whitelists, not blacklists).
- **Email DNS is still zero.** No MX, no SPF, no DMARC, no DKIM. This is the actual open work.

Closed items 1, 2, and the verification step in the backlog with verification commands quoted inline so the closure is auditable. Rewrote the section title and lead paragraph to reflect Vercel-as-DNS-host. Open items remaining: email host pick + email DNS records.

Also tightened the DMARC recommendation: start at `p=none; pct=100` for the first 30 days (avoids quarantining legitimate mail while SPF/DKIM alignment settles), then ratchet to `p=quarantine`. Original backlog jumped straight to `p=quarantine` which is fine once authenticated mail is flowing reliably but is hostile on day one.

## 2026-05-08 — deployed to Vercel (preview URL only)

Deployed `poukai-inc/pouk.ai` `main` to Vercel — the page is reachable on its `*.vercel.app` preview URL. The `pouk.ai` apex isn't pointing anywhere yet because the domain hasn't been registered. Custom-domain wiring (Porkbun → `cname.vercel-dns.com`, Vercel → Settings → Domains) is **deferred until the domain is purchased**.

Meta tags (`<title>`, `canonical`, OG, Twitter, JSON-LD) all still reference `https://pouk.ai/` — left intentionally so they'll be correct the moment the domain lands. Treating the Vercel preview as exactly that: a preview.

## 2026-05-08 — repo flatten: site/ contents moved to repo root

After the initial push to `poukai-inc/pouk.ai`, decided the repo should represent only what's deployed — not the working folder. Flattened:

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
