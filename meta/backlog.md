# pouk.ai — backlog

Things to ship before / around launch. Roughly priority-ordered within sections.

## Blockers for launch

- [ ] **Register `pouk.ai` at Porkbun.** The Vercel deploy is live on its `*.vercel.app` preview URL but the canonical domain doesn't exist yet. Until registered: meta tags (canonical, OG, Twitter, JSON-LD) all reference `https://pouk.ai/` and will be wrong if shared anywhere. Priced at ~$10–15/yr with WHOIS privacy.
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

## Beyond the holding page

Items that move the page from holding-page-with-status-line into a real marketing site. **The first concrete one of these is the trigger to migrate from a single static `index.html` to Astro** (per `architecture.md` decision rules — Astro keeps zero-JS-by-default, adds routing + MDX, and we can port the existing page nearly verbatim).

- [ ] **Roles page** — `/roles` (path/naming TBD; candidates: `/roles`, `/services`, `/work-with-us`, `/specializations`). Showcases the four AI-consultant roles Poukai stands up for clients. This is the first multi-page concern, so building it likely also means migrating the codebase to Astro at the same time.

  Approved copy from founder, verbatim:

  > ### 🔨 The Builder
  > Builds custom solutions when off-the-shelf tools fall short — dashboards, agents, internal tools, client-facing products. Modern tools (Lovable, Claude, Supabase) collapsed what used to take a dev team six months into days or weeks.
  >
  > **Hired by**: Founders needing prototypes, product leads testing ideas fast, teams unlocking budget with a proof-of-concept.
  >
  > ### ⚙️ The Automator
  > Redesigns how work gets done by wiring together the right tools and turning scattered tasks into self-running systems — connecting an LLM, like GPT, to Salesforce, eliminating manual data entry, building 24/7 outreach sequences. Their edge is systems thinking, not technical complexity.
  >
  > **Hired by**: Ops leaders cutting manual work, sales teams drowning in admin, small businesses scaling without headcount.
  >
  > ### 🎓 The Educator
  > Focuses on adoption — helping teams actually use AI, not just talk about it. The blocker is rarely tech; it's behavior. Educators deliver AI audits, hands-on training with real workflows, and prompt libraries teams can use immediately.
  >
  > **Hired by**: HR/L&D teams rolling out AI org-wide, leadership closing the gap between "we bought the tools" and "people use them."
  >
  > ### 📸 The Creator
  > Streamlines creative workflows that are time and cost intensive. Creators don't run full-service agencies with agents. They identify where concept iteration, motion graphics, post-production, and other parts of the creative process get faster and cheaper with the right tools.
  >
  > **Hired by**: Chief Marketing / Chief Creative Officers who are feeling their budgets constrain and their timelines accelerate.

  Open design questions for when we build it:
  - One page with all four roles, or four routes (`/roles/builder` etc.) with an index page?
  - Visual hierarchy: do the four roles need imagery / illustration, or can they live in pure typography matching the holding page's restraint?
  - Does each role get a CTA (e.g., "Book a Builder conversation") or do they all funnel to `hello@pouk.ai`?
  - Update homepage tagline / lede to point at this page once it exists?

- [ ] **Operating Principles page** — `/principles` (or `/operating-principles`, `/manifesto`, naming TBD). The ten principles that define how Poukai operates. Manifesto-flavored content that builds the brand's character moat; complements the Roles page (Roles = *what we do*, Principles = *how we work*). Likely shares a layout with the Roles page once Astro is in place.

  Approved copy from founder, verbatim:

  > ### Introduction
  >
  > The tools matter. The systems matter. But what matters most, what separates great consultants from everyone else, is how they think and operate.
  >
  > These ten principles aren't tactics or hacks. They're the foundations for doing great work. Learn them. Practice them. Build from them.
  >
  > ### 1. Ownership
  > Working for yourself doesn't make life easier. It makes it 10× harder. Everything starts and ends with you: every relationship, deliverable, deadline, and outcome. When something goes wrong, there's nowhere to point but inward. That's the trade: no safety net, but full control. Once you accept that, you stop waiting for permission and start building momentum. Ownership is what turns uncertainty into action.
  >
  > ### 2. Integrity
  > AI consulting runs on trust. Clients rarely understand every technical detail, so they trust your word, your process, and your judgment. That means doing what you say you'll do, even when it's inconvenient, especially when no one's watching. Integrity compounds quietly: one honest conversation at a time, one promise kept after another. Over time, it becomes your reputation. And your moat.
  >
  > ### 3. Reliability
  > The best consultants make clients feel safe. Reliability means showing up prepared, meeting deadlines, and staying composed when things go sideways. It's not glamorous, but it's the backbone of every great engagement. You communicate early, document clearly, and fix problems before they spread. Clients might not notice when you're reliable, but they always notice when you're not. Consistency is credibility.
  >
  > ### 4. Systems Thinking
  > Every problem is part of a larger system: a web of people, processes, tools, and incentives. Weak consultants treat symptoms. Strong ones zoom out to treat root causes. Systems thinking means designing solutions that last: automations that evolve, workflows that scale, insights that keep paying off. The more you think in loops, not lines, the more durable your impact becomes.
  >
  > ### 5. Intellectual Curiosity
  > AI changes weekly. The habit that separates professionals from tourists is staying genuinely interested, not just in tools but in ideas. Intellectual curiosity is the muscle of asking why: why this process exists, why a result happened, why something might work better another way. The more interested you are, the more leverage you create, because you see what others don't.
  >
  > ### 6. Obsession
  > To be great at this, you have to care more than most people think is reasonable. Obsession means caring about the details: the UX of your workflows, the wording of your prompts, the reliability of your systems. You experiment after hours because you want to see what's possible. That kind of energy can't be faked. Clients can feel it. Obsession is what turns skill into mastery.
  >
  > ### 7. Range
  > Range is the ability to think and operate across disciplines. You're strategic enough to scope a project and technical enough to build it. You can talk business with executives and tokens with developers — often in the same meeting. Range gives you adaptability; it's what lets you stay valuable as the landscape shifts. In AI consulting, depth gets you in the room, but range keeps you relevant.
  >
  > ### 8. Momentum
  > Momentum beats perfection every time. Every draft, demo, and deliverable teaches you something — but only if you ship it. Momentum means valuing iteration over polish, learning in public, and letting progress create confidence. The faster your feedback loops, the faster you grow. The consultants who win aren't the ones with perfect plans. They're the ones who keep moving.
  >
  > ### 9. Willingness to Fail
  > Failure isn't an obstacle; it's part of the rhythm. You'll write prompts that break, run pilots that flop, pitch clients who ghost. What matters is how quickly you rebound and what you learn. Most people retreat when things go wrong; professionals get curious. The willingness to fail, to feel discomfort without losing momentum, is the single fastest way to level up your craft.
  >
  > ### 10. Good Nature
  > Skill might open the door, but character keeps it open. Good nature means being calm under pressure, generous with your knowledge, and easy to work with. You don't need to be everyone's best friend, but people should leave interactions with more clarity and energy than they came in with. Clients remember how you made them feel, and that memory is often what turns a project into a partnership.
  >
  > ### Conclusion
  >
  > You can't fake these principles. They're built one project, one decision, one late night at a time. Tools will change, trends will fade, but how you operate, how you think, communicate, and carry yourself, will always define the quality of your work. These principles are your compass.

  Open design questions for when we build it:
  - Single long-scroll page or per-principle routes (`/principles/ownership`, etc.)? Long-scroll keeps the manifesto reading as one piece; per-principle routes make individual principles linkable and citable.
  - Linkable anchors regardless (`#ownership`, `#integrity`) so a specific principle can be quoted in a tweet or DM.
  - Numbering treatment: large display numerals (Apple-style "01 / 02 / …" margin), subtle inline numbers, or just numbered `<h2>`s?
  - Introduction + Conclusion bookend visually — same type as principles, or a quieter editorial voice (e.g., Instrument Serif italic for the framing, sans for the principles themselves)?
  - Reading order in nav once both pages exist: Roles first (commercial intent) or Principles first (character/manifesto)?
  - Does any principle get pulled forward onto the homepage as a hover-card / quote treatment, or do they live exclusively on `/principles`?
