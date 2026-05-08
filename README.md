# pouk.ai

Holding page for pouk.ai. Pure HTML/CSS, single file, no build step, no JavaScript.

## Local preview

Any static server works. From this directory:

```bash
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000.

## Deploy to Vercel

### One-shot, via the Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

The first run prompts for a project name; subsequent runs publish a new version under that project.

### Continuous, via Git

1. Push the repo to GitHub.
2. Vercel dashboard → **Add New** → **Project** → import the GitHub repo.
3. No framework preset, no build command, no output directory override. Repo root is the deployable.
4. Add `pouk.ai` and `www.pouk.ai` under **Settings → Domains** once the first deploy is green.

### Files to add before going live

These are referenced by the HTML but not in the repo:

| File | What | Notes |
|---|---|---|
| `og.png` | 1200×630 social card | `#FFFFFF` bg, full POUKAI logo (feather isotype + letterforms) in `#1D1D1F` centered, tagline in Instrument Serif italic 56px `#6E6E73` below. ≤80KB. Source: `brand/avatar svg.svg`. |
| `apple-touch-icon.png` | 180×180 home-screen icon | Feather isotype `#1D1D1F` on `#FFFFFF` bg. Source: extract isotype paths from `brand/avatar svg.svg`, or convert `brand/avatar-isotype.png` to 180×180. |
| `robots.txt` | `User-agent: *\nAllow: /\nSitemap: https://pouk.ai/sitemap.xml` | |
| `sitemap.xml` | Single URL: `https://pouk.ai/` | |
| `vercel.json` | Security headers (HSTS, nosniff, Permissions-Policy, optional CSP) | See the note below for a baseline + the JSON-LD/CSP gotcha. Lives at the repo root. |

### Note on `vercel.json` and JSON-LD

Vercel doesn't enforce a strict CSP unless you add one. The original spec's `script-src 'none'` would block inline `<script type="application/ld+json">` in Chrome and Firefox, so if you carry that policy over to `vercel.json`, pick one:

- **Hash-pin it** (preferred): compute `openssl dgst -sha256 -binary < json-ld.txt | openssl base64`, then set `script-src 'sha256-<hash>'`.
- **Relax to inline**: `script-src 'self' 'unsafe-inline'` — simpler, weaker.
- **Drop JSON-LD** from `index.html` if structured data isn't needed at launch.

A baseline `vercel.json` with the safe headers and **no CSP** (so JSON-LD just works):

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=(), interest-cohort=()" }
      ]
    }
  ]
}
```

## DNS — apex domain at Porkbun

The domain stays at Porkbun; Vercel issues the cert and serves the site.

Porkbun supports `ALIAS` records for the apex, which is how you point `pouk.ai` at Vercel's hostname (apex `CNAME` is forbidden by RFC). If you'd rather use A-records, drop in `76.76.21.21` instead of the `ALIAS`.

In Porkbun → **Domain Management** → **DNS Records**:

| Type | Host | Answer | TTL |
|---|---|---|---|
| `ALIAS` | (leave blank for root) | `cname.vercel-dns.com` | 600 |
| `CNAME` | `www` | `cname.vercel-dns.com` | 600 |

Then in Vercel → **Settings → Domains**, add both `pouk.ai` and `www.pouk.ai`. Vercel verifies ownership via the records above and provisions TLS automatically (≈30s–2min).

### Email (`hello@pouk.ai`)

Add these once you've picked an email host (Fastmail, Google Workspace, etc.) — values come from the provider:

| Type | Host | Answer |
|---|---|---|
| `MX` | (root) | `<provider MX records>` |
| `TXT` | (root) | `v=spf1 include:<provider> -all` |
| `TXT` | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:hello@pouk.ai` |
| `TXT` | `<selector>._domainkey` | `<DKIM key>` |
| `CAA` | (root) | `0 issue "letsencrypt.org"` |
| `CAA` | (root) | `0 issue "pki.goog"` |

SPF, DKIM, and DMARC need to be live before the first prospect email goes out — otherwise it lands in spam.

### Verify

```bash
dig +short pouk.ai
dig +short www.pouk.ai
curl -I https://pouk.ai/
```

Expect a `200` with `server: Vercel` and `strict-transport-security` headers (once `vercel.json` is in place).
