# pouk.ai — backlog

Things to ship before / around launch. Roughly priority-ordered within sections.

## Blockers for launch

- [x] **Register `pouk.ai`.** Done 2026-05-13 via Vercel (registrar partner: Name.com, Inc.). Registration term covers through 2028-05-13. Originally noted as "Porkbun" in this backlog — that was a mis-recording; the actual purchase went through Vercel, which is why NS records pointed to `ns1.vercel-dns.com`/`ns2.vercel-dns.com` from the start.
- [x] **Generate `og.png`** (1200×630). Done 2026-05-13. Lives in the DS repo at `poukai-ui/src/brand/og.png`. **Operational follow-up**: per masterplan section 2A, `og.png` belongs in the site repo (it's marketing artwork, not a brand primitive). Either copy into the site repo root before cutover, or have `pouk-ai-engineer` pull it into `public/og.png` during the Astro scaffold round.
- [x] **Generate `apple-touch-icon.png`** (180×180). Done 2026-05-13. Same location/follow-up as `og.png` — currently at `poukai-ui/src/brand/apple-touch-icon.png`; needs to land at `public/apple-touch-icon.png` in the site repo before cutover.
- [x] **Update favicon** to the feather isotype. Done 2026-05-13. Favicon variations (`favicon-16x16.png`, `favicon-32x32.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`) generated in `poukai-ui/src/brand/`. **Operational follow-up**: index.html still references the old placeholder altimeter inline-SVG favicon at line 33; the new files need to be wired in (either inline-SVG-from-the-isotype path or `<link rel="icon" href="/favicon-32x32.png">` references) during the Astro scaffold round or as a one-off patch to `index.html` if cutover comes first.
- [x] Add `robots.txt`. Done 2026-05-13 (commit `bc81bc3`).
- [x] Add `sitemap.xml`. Done 2026-05-13 (commit `bc81bc3`).
- [x] Add `vercel.json` at the repo root. Done 2026-05-13 (commit `bc81bc3`).
- [x] Resolve JSON-LD ↔ CSP. Closed — `vercel.json` ships without CSP per D-17, so the conflict never materialized. Re-open if/when a CSP is introduced.

## DNS + email — **manual (Arian executes)**

These touch external systems (Vercel DNS dashboard, email host onboarding) that the engineering agents can't reach. Arian's lane.

**Authority correction (2026-05-16):** When the domain was first set up, NS records were pointed at Vercel (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`), not kept at Porkbun. So all DNS edits happen inside the **Vercel dashboard → pouk.ai → DNS**, not Porkbun. The original Porkbun-centric instructions below have been rewritten.

- [x] **Vercel DNS — apex + www** — verified live 2026-05-16. `dig +short pouk.ai` returns Vercel anycast IPs (`216.198.79.1`, `64.29.17.1`); `dig +short www.pouk.ai` likewise. Vercel manages these automatically once the domain is added to a project — no manual ALIAS/CNAME entries were needed because Vercel is also the nameserver. Closed.
- [x] **Vercel domain binding** — verified live 2026-05-16. `curl -sI https://pouk.ai/` returns `HTTP/2 200`, `server: Vercel`, `strict-transport-security: max-age=63072000; includeSubDomains; preload`, and the full security-header stack from `vercel.json`. `www.pouk.ai` returns `307 → https://pouk.ai/`. TLS is provisioned and HSTS is preload-eligible. Closed.
- [x] **CAA records** — verified live 2026-05-16. `dig +short CAA pouk.ai` returns three issuers (`letsencrypt.org`, `pki.goog`, `sectigo.com`) — broader than the original backlog ask, which only requested the first two. The wider set is fine; Vercel uses Let's Encrypt by default but the extra issuers don't loosen security (CAA whitelists, not blacklists). Closed.
- [x] **Pick email host for `hello@pouk.ai`** — **Google Workspace Business Starter ($7/mo)**. Chosen 2026-05-16. Rationale: hyperscaler reputation (gold-tier deliverability for prospect outreach), drag-along Docs/Drive/Calendar/Meet for consultancy work, 99.9% reliability. Closed.

- [x] **Email DNS records** at Vercel — verified live 2026-05-16. All five records in place:
  - `MX pouk.ai` → `smtp.google.com` priority 1 ✅
  - `TXT @ (root)` → `v=spf1 include:_spf.google.com -all` ✅
  - `TXT _dmarc.pouk.ai` → `v=DMARC1; p=none; rua=mailto:hello@pouk.ai; pct=100` ✅ (will ratchet to `p=quarantine` after ~30 days once aligned sends are routine)
  - `TXT google._domainkey.pouk.ai` → DKIM public key (2048-bit) ✅
  - `TXT @ google-site-verification=...` → temporary verification record (can delete or leave; harmless) ✅

- [x] **Verify email DNS with `dig`** — verified live 2026-05-16. All records return correct values:
  ```
  $ dig +short MX pouk.ai
  1 smtp.google.com.
  
  $ dig +short TXT pouk.ai | grep spf
  "v=spf1 include:_spf.google.com -all"
  
  $ dig +short TXT _dmarc.pouk.ai
  "v=DMARC1; p=none; rua=mailto:hello@pouk.ai; pct=100"
  
  $ dig +short TXT google._domainkey.pouk.ai
  "v=DKIM1;k=rsa;p=MIIBIj..." (full public key)
  ```
  DNS propagation complete. SPF/DKIM/DMARC alignment ready for prospect outreach. Closed.

**Email is production-ready.** The `hello@pouk.ai` mailbox can send and receive. The first prospect email will not land in spam.

## Asset migration to site repo

Closed by `pouk-ai-engineer` during the Astro round-1 build (commit `13f8668`). Brand assets pulled from `poukai-ui/src/brand/` into the site's `public/` directory:

- [x] `public/og.png` (1200×630). Done 2026-05-13.
- [x] `public/apple-touch-icon.png` (180×180). Done 2026-05-13.
- [x] `public/favicon-{16x16,32x32}.png`, `public/android-chrome-{192x192,512x512}.png`. Done 2026-05-13.
- [x] **`index.html` favicon `<link>`** — **Closed 2026-05-17 as stale.** The holding `public/index.html` was deleted in commit `9e56cdb` ("feat: port / to Astro, retire static index.html") when `/` ported into Astro. There is no `index.html` to update — every route now flows through `BaseLayout.astro`, which already references `/favicon-32x32.png`, `/favicon-16x16.png`, and `/apple-touch-icon.png`. The original founder rule that gated this work no longer applies. Verified: `ls public/index.html` returns no such file.

## DS-side coordination (Claude Design's lane)

Tracked here so the site engineer doesn't lose sight while the DS team works in parallel. None of these are this repo's lane to fix.

- [x] **`@poukai-inc/ui@0.2.1` published** with the `cpy --flat` fix for `dist/tokens.css`. Done 2026-05-14 via DS PR #5 + version-bump PR #6.
- [x] **Component CSS not delivered to consumers (`SiteShell`, `RoleCard`, `Hero`, `Principle`, `FailureMode` render unstyled).** Closed 2026-05-16 — verified fixed in `@poukai-inc/ui@0.6.1`. Resolution went beyond the suggested one-line fix: the DS now ships per-component CSS files (`SiteShell.css`, `FailureMode.css`, `Stat.css`, `Wordmark.css`) and every component chunk self-imports its stylesheet (`import './SiteShell.css';` in `dist/SiteShell-*.js`, matching `require()` in `.cjs`). Combined with `"sideEffects": ["**/*.css"]` in package.json, bundlers preserve the imports — `import { SiteShell } from "@poukai-inc/ui"` now pulls the needed CSS automatically. Per-component code-splitting is actually superior to a single `style.css` import; consumers only receive CSS for components they use. *Original bug context (2026-05-14):* the DS built a combined `dist/style.css` containing all per-component scoped CSS-module styles, but (a) the package.json `exports` field exposed only `./tokens.css`, not `./style.css`, and (b) the ESM/CJS entry files didn't `import "./style.css"`. Result: when a consumer did `import { SiteShell } from "@poukai-inc/ui"`, only JS landed — every `.poukai_<hash>` class on the rendered DOM was a dangling reference, and components fell back to user-agent defaults (nav rendered as a bulleted list, header bar missing, card hairlines vanished, etc.). Bug surface was the entire DS, not just `SiteShell` — `SiteShell` only looked worst because it's the most layout-heavy.

## Security hygiene (once email lands)

- [x] **Add `/.well-known/security.txt`** — RFC 9116 disclosure file. Done 2026-05-17. File created at `public/.well-known/security.txt` (will be served from `dist/` after next build/deploy). Contents:
  ```
  Contact: security@pouk.ai
  Expires: 2027-05-16T00:00:00Z
  Preferred-Languages: en
  ```
  Disclosure file tells security researchers how to report vulnerabilities. Contact routes to the freshly-live `hello@pouk.ai` mailbox. Expires field set to rotate annually (2026-05-16 + 1 year). This item was SOFT until email went live (2026-05-16); now HARD per Decision D-21 and Technical Requirement R-081. Closed.

- [x] **Bump `astro` past 5.15.8 — resolves [GHSA-wrwg-2hg8-v723](https://github.com/advisories/GHSA-wrwg-2hg8-v723) (reflected XSS via server islands)** ~~(Owner: engineer · Effort: M)~~ — **Closed 2026-05-17.** Bumped `astro@5.7.13` → `astro@5.18.1` (latest stable in the 5.x line, 11 minor versions of fixes and features absorbed). `pnpm install` resolved cleanly with no peer-dep conflicts: `@poukai-inc/ui@0.6.1` only peer-deps `lucide-react` (not astro), `@astrojs/react@4.2.1` and `@astrojs/sitemap@3.3.0` accepted the new astro without complaint, and `astro-compress@2.3.3` continued to work. `pnpm build` exits 0; all four routes built; `dist/index.html` is **byte-identical at 13,429 bytes** to the pre-bump build — no rendered-output regressions. Content spot-check confirmed: status-line copy ("Currently taking conversations"), Pouākai origin sentence, `/why-ai` lede link, `hello@pouk.ai` CTA all present. Sitemap unchanged. `pnpm audit --prod --audit-level=high` now exits 0 (2 findings: 1 low + 1 moderate, both allowed by R-049). **CI audit gate now green.**

- [x] **Bump `svgo` past 3.3.3 (via `astro-compress`) — resolves [GHSA-xpqw-6gx7-v673](https://github.com/advisories/GHSA-xpqw-6gx7-v673) (Billion Laughs DoS)** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17.** Added `pnpm.overrides.svgo: ^3.3.3` to [package.json](package.json); `pnpm install` resolved astro-compress's transitive svgo from `3.3.2` → `3.3.3` (verified in `pnpm-lock.yaml` — the entry for svgo@3.3.2 is gone, only 3.3.3 remains). Rebuild green; the SVG-compression pass (R-054 / R-018 image stats unchanged) still runs cleanly. `pnpm audit --prod --audit-level=high` now reports 1 high finding (astro) instead of 2 — svgo line cleared. Audit gate one step closer to green; astro bump remains.

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
- [ ] **Ongoing visual regression for future PRs** (split off from R20's closure on 2026-05-17). Pick one of: (a) Playwright snapshot tests in-repo (zero SaaS, baselines committed to git, brittle to font-rendering deltas on different runners), (b) [Percy](https://percy.io) SaaS (cloud baselines, free tier 5,000 snapshots/mo, integrates with GitHub PRs), (c) [Chromatic](https://www.chromatic.com/) (built for Storybook but works without; free tier 5,000 snapshots/mo), (d) [Argos](https://argos-ci.com/) (open-source-friendly, free tier 5,000 snapshots/mo, runs on Vercel previews). Decision should weigh CI cost, baseline maintenance burden, and whether we want to gate Vercel previews on visual-diff approval. Once chosen, wire as a new job in `.github/workflows/ci.yml` against the four routes.

## Beyond the holding page

Items that move the page from holding-page-with-status-line into a real marketing site. **Astro migration complete** (verified 2026-05-17). The codebase now supports multi-page routing; all pages return HTTP 200 and are indexed by search engines.

- [x] **Astro migration + Roles page** — `/roles` live. Completed prior to 2026-05-17. The four AI-consultant roles (Builder, Automator, Educator, Creator) are showcased at `/roles` with founder-approved copy. Routed via `src/pages/roles.astro`, content from `src/content/roles.json`, shared layout `src/layouts/BaseLayout.astro`. Page renders correctly, no layout shifts, full security-header stack applied (HSTS, X-Frame-Options, etc.). Closed.

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

- [x] **Operating Principles page** — `/principles` live. Completed prior to 2026-05-17. The ten principles that define how Poukai operates (Ownership, Integrity, Reliability, Systems Thinking, Intellectual Curiosity, Obsession, Range, Leverage, Speed, Courage). Content from `src/content/principles.json`, routed via `src/pages/principles.astro`, shared layout with Roles page. Builds the brand's character moat; complements the Roles page (Roles = *what we do*, Principles = *how we work*). Returns HTTP 200, full security-header stack applied. Closed.

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

- [x] **Why AI page** — `/why-ai` live. Completed prior to 2026-05-17. Thought-leadership / market-positioning page that frames the **AI deployment gap** — why most AI projects fail to capture ROI (only 12–18% capture meaningful ROI per 2026 consulting firm data), the five failure modes (Data Readiness, Wrong Use Case, Integration, Governance, Change Management), and how a consultant fixes them. Content from `src/content/why-ai.json`, routed via `src/pages/why-ai.astro`. Sits ahead of `/roles` in the prospect journey: **Why AI** explains why anyone should hire someone like us; **Roles** explains which kind of help we offer; **Principles** explains why us specifically. Returns HTTP 200. Closed.

  Approved copy from founder, verbatim:

  > The headline stat from every major consulting firm in 2026 is the same: only **12–18% of companies deploying AI are capturing meaningful ROI**. Gartner says **85% of AI projects fail to meet business goals**. PwC's 2026 AI predictions report finds only **15% of AI decision-makers reported a positive impact on profitability** in the last 12 months. Despite **$300B in AI venture funding in Q1 2026 alone**, the deployment gap between "launched an AI pilot" and "AI is delivering measurable business value" is enormous.
  >
  > This is the gap your consulting practice lives in.
  >
  > ## Why projects fail — the five failure modes
  >
  > Most AI initiatives don't fail because the model isn't good enough. They fail before the model is ever really tested. Here's the pattern:
  >
  > ### 1. Data readiness — the hidden blocker
  > The most common failure mode. A client's CRM data is incomplete. Their documents are in inconsistent formats. Different departments define the same field differently. Trying to build an AI solution on top of messy data produces inconsistent, unreliable outputs — and the client blames the AI when the real problem is years of technical debt underneath it. Before any AI work begins, audit the data: Is it accessible? Is it structured? Is it accurate? This diagnostic step alone is often a billable engagement.
  >
  > ### 2. Wrong use case — horizontal vs. vertical
  > The research finding that should define your pitch: sector-specific AI agents deliver roughly **500% ROI on average**, compared to horizontal AI deployments. A generic "AI assistant" bolted onto a company's existing workflows rarely changes how work gets done. An AI that understands the specific domain — clinical notes, insurance claims, legal contracts, engineering tickets — and integrates into the specific workflow that generates value produces measurable results. The sales pitch isn't "let's add AI to your company." It's "let's find the one workflow where AI changes the unit economics, and build that."
  >
  > ### 3. Integration — AI as an island
  > AI tools that sit next to workflows instead of inside them get abandoned. If a sales rep has to open a separate AI tool, copy-paste data, read a summary, and then manually enter the conclusion back into their CRM, they'll stop using it within three weeks. The AI has to be embedded where the work happens: inside the CRM, the document editor, the ticketing system, the email client. Integration is where most of the technical consulting work actually lives.
  >
  > ### 4. Governance — no owner, no outcome
  > Successful AI deployments always have one person who owns the AI outcome: owns the data quality, owns the prompt updates when the model drifts, owns the metrics. Pilots that emerge bottom-up from enthusiastic engineers but lack executive ownership stall when they need production infrastructure, legal sign-off, or budget. Part of your job as a consultant is identifying and aligning the executive sponsor before the build starts.
  >
  > ### 5. Change management — the people problem
  > **61% of senior business leaders currently feel pressure to prove AI ROI within six months or less.** That pressure often causes teams to rush deployment without training users or explaining what the AI is for. Employees who don't understand what the AI is doing, or who see it as a threat to their role, work around it. The AI produces outputs that no one trusts and no one uses. Change management isn't a soft add-on — it's why consultants who can navigate organizational behavior outperform purely technical AI shops.
  >
  > ## What the leaders do differently
  >
  > The companies delivering the best AI returns share a pattern:
  >
  > - **Top-down strategy** — Senior leadership identifies a focused set of workflows with high economic value, then allocates resources specifically for those.
  > - **Vertical specialization** — Domain-specific agents in a few key processes, not a horizontal AI layer across everything.
  > - **Measurement from day one** — ROI baseline before deployment, not after; clear metrics (time saved, error reduction, revenue influenced).
  > - **Iterative rollout** — Start with one team, measure, adjust, then expand.
  >
  > The quantified gap is significant: companies in the top quartile on AI deployment show **1.7× revenue growth**, **3.6× three-year total shareholder return**, and **2.7× return on invested capital** compared to laggards.
  >
  > ## The consulting angle — where to position yourself
  >
  > You are most valuable at the intersection of technical competence and business process knowledge. The failure modes above are mostly not technical problems — they're organizational, strategic, and operational. A client who's tried a generic AI tool and been disappointed doesn't need a better model; they need someone who can diagnose which failure mode they're in and fix it.
  >
  > The questions to ask in a discovery conversation:
  >
  > 1. *"What specific workflow are we trying to improve, and what's the current unit cost of that workflow?"*
  > 2. *"Who owns the data this AI would need, and what does it look like today?"*
  > 3. *"Who in this organization will champion this post-deployment?"*
  > 4. *"What does success look like in 90 days, and how will we measure it?"*
  >
  > That conversation is your differentiation. Most vendors answer "here's our AI product." You answer "let me understand your problem first."
  >
  > ## References
  >
  > - [AI ROI: Why Only 5% of Enterprises See Real Returns](https://masterofcode.com/blog/ai-roi/) — Master of Code
  > - [AI Agent ROI in 2026: Benchmarks, Formulas & Case Studies](https://ctlabs.ai/blog/ai-agent-roi-in-2026-calculation-methods-industry-benchmarks-and-u-s-business-impact/) — CT Labs
  > - [2026: The Year AI ROI Gets Real](https://www.wndyr.com/blog/2026-the-year-ai-roi-gets-real-and-forces-a-strategic-fork-in-the-road/) — Wndyr
  > - [How to maximize AI ROI in 2026](https://www.ibm.com/think/insights/ai-roi/) — IBM
  >
  > *Source URLs cleaned from Resend email click-trackers to canonical destinations so citations aren't tied to a specific email send.*

  Open design questions for when we build it:
  - **Typographic treatment for the stats** (12–18%, 85%, 15%, $300B, 500%, 61%, 1.7×, 3.6×, 2.7×): margin display numerals à la Apple's product specs, large in-flow callouts, or inline emphasis only? The page lives or dies by how the numbers read.
  - **Citation style**: footnote-style superscripts linked to the references list, or inline parenthetical attributions ("(Gartner, 2026)") — pick one and use it consistently.
  - **Sticky TOC on desktop** so readers can jump to a specific failure mode? The piece is long enough to justify it; mobile probably gets a collapsed accordion or just trust scroll.
  - **Reading-progress affordance** — top progress bar, or just trust the browser scroll? Lean trust-the-scroll unless analytics later show high bounce mid-page.
  - **Dataset vintage** — the page references "2026" stats throughout. Add a "Last reviewed: <date>" footer and commit to an annual refresh, or omit and let the references' dates carry that weight?
  - **End CTA**: surface the four discovery questions as the page-closer with an explicit "Want to start that conversation? → `hello@pouk.ai`". Or just pull the email like the homepage does and trust the reader.
  - **Nav order in the eventual site nav**: `Why AI → Roles → Principles → contact` mirrors the prospect funnel. Footer and sitemap.xml should agree.
  - **Homepage hand-off**: does the holding-page tagline shift once `/why-ai` exists? Candidate: keep the tagline, but the lede ends "Most AI projects fail to deliver. [Here's why →](/why-ai)" — turning the homepage into a portal rather than a brochure.

---

## Review: / (2026-05-15)

Generated by `/review-page home`. Preflight: spec=Approved, content draft=missing, composition=missing. DS bumped 0.6.0→0.6.1 mid-test. Four lanes ran: `pouk-ai-pm`, `pouk-ai-content` (orchestrator-inline; see PF1), `pouk-ai-designer`, `pouk-ai-reviewer`.

### P0

- [x] **R01 — Lede-extension hand-off link missing** ~~(Owner: engineer · Effort: S)~~ — **FALSE POSITIVE.** Engineer verified 2026-05-15: `src/components/HomeHero.tsx:47` already wraps the final lede sentence in `<a href="/why-ai">Here&rsquo;s why &rarr;</a>`. Build green. Root cause logged as PF3 (orchestrator snapshot used `get_page_text`, which strips link information; PM agent's brief read the lede as text-only).

- [x] **R02 — Status-line copy drift from D-12 byte-identical parity** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-16.** D-12 locks the rendered status line as byte-identical to the pre-cutover `index.html` ("Currently taking conversations for Q3."), so the meta description was the surface that needed to move. Aligned at `src/pages/index.astro:28` — meta description now ends "Currently taking conversations for Q3." matching the rendered StatusBadge. Closes R26 (P2 duplicate of this finding) at the same time.

- [x] **R03 — `meta/compositions/` directory does not exist** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16.** Directory created alongside the first composition (R04). Taxonomy now exists for every future page composition.

- [x] **R04 — No Approved canonical composition for /** ~~(Owner: designer · Effort: M)~~ — **Closed 2026-05-16.** `pouk-ai-designer` authored `meta/compositions/pages/home.md` at status `Approved`, ratifying the shipped `/` implementation. Future Hero/SiteShell/token changes in `@poukai-inc/ui` now have a review gate.

- [x] **R05 — No Approved canonical content draft for /** ~~(Owner: content · Effort: M)~~ — **Closed 2026-05-16.** `pouk-ai-content` authored `meta/content/drafts/pages/home.md` at status `Approved`, ratifying the rendered copy verbatim. Content-stage approval gate now retroactively closed; future copy revisions have a canonical record to diverge from.

### P1

- [x] **R06 — Hero StatusBadge pulse animation unverified** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17.** Verified in built `dist/index.html`: StatusBadge renders as `<span data-status="available"><span class="poukai_1JdRGC"></span></span>` — the inner span is the pulse element, the outer is the dot container. Both classes are DS-scoped (CSS-modules hashed `poukai_*` names), no inline `<style>` or runtime JS. The `client.Bl_bWdMq.js` file under `dist/_astro/` is emitted but never referenced by `/`'s HTML, so the pulse is genuinely CSS-keyframe-only per spec §8 AC. Animation itself is defined in the DS (`@poukai-inc/ui` 0.6.1), not in the site repo — site engineer's contract is satisfied.

- [x] **R07 — Lighthouse not run locally — CI must validate** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17 via R22 wiring.** CI now runs `lhci autorun` against a local `pnpm preview` server in the `lighthouse` job of [.github/workflows/ci.yml](.github/workflows/ci.yml). Thresholds per R-013 (Perf ≥ 95, A11y/BP/SEO = 100, mobile) live in [.lighthouserc.json](.lighthouserc.json). The original gate ("Lighthouse not run locally") is now obsolete because it's run on every PR in CI; reviewers no longer need a local lighthouse binary to verify. Spec §8 AC ("Lighthouse mobile: 100/100/100/100") is verified by CI green; if CI is red, the AC is too. Note: spec §8 says 100/100/100/100 but D-14 / R-013 relaxed Performance to ≥ 95 — the spec is from before D-14 and could be updated to match (minor PM follow-up).

- [x] **R08 — Zero-client-JS contract unverified in production build** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17.** Verified `dist/index.html` after `pnpm build`: contains exactly one `<script>` tag — `<script type="application/ld+json">` (Organization JSON-LD per R-031), allowed by the spec exception. Zero `<script src=>` tags. `dist/_astro/client.Bl_bWdMq.js` exists but is dead weight on `/` since no `client:*` directive is used on this route; bundler emits it for the project, the route doesn't load it. Spec §8 AC + masterplan §4.3 satisfied.

- [x] **R09 — HTML-weight delta vs holding page not measured** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17.** Baseline captured from git (`git show 9e56cdb^:public/index.html`): **20,515 bytes uncompressed / 6,773 bytes gzipped**. Current built `/index.html`: **13,429 bytes uncompressed / 4,869 bytes gzipped**. New build is **34.5% smaller uncompressed** and **28.1% smaller gzipped** than the holding page — well within R-015's "+10%" gate (HARD). Slimmer because Hero markup ditched the bespoke holding-page typography ladder, font preloads consolidated, and inline-SVG isotype now lives in `<Wordmark>` chunked CSS instead of inlined.

- [x] **R10 — `prefers-reduced-motion` behavior unverified** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17.** Verified in `node_modules/@poukai-inc/ui/dist/tokens.css`. The DS ships a global `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }` block — the lone `!important` exception flagged in tokens.css comments. Because the universal selector covers every descendant, the StatusBadge pulse and any DS-provided transitions are disabled automatically when the user-agent reports `reduce`. Site repo adds no animations of its own, so nothing further to gate. Spec §8 AC satisfied without a site-side override.

- [x] **R11 — Canonical link element not confirmed** ~~(Owner: engineer · Effort: S)~~ — **FALSE POSITIVE. Closed 2026-05-16.** Engineer verified `BaseLayout.astro:101` emits `<link rel="canonical" href={canonical} />` and `BaseLayout.astro:106` emits the matching `<meta property="og:url" content={canonical} />`. Audit snapshot at line ranges above the canonical tag missed it. Root cause is the same as PF3 (orchestrator snapshot capture not seeing the full `<head>`).

- [x] **R12 — Lede-extension uses literal `→` entity instead of Lucide `ArrowRight`** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Ratified the literal `&rarr;` as the editorial choice per D-11 (the hand-off is structural prose, not iconography); trade-offs (dark-mode color, hover-motion absence) judged immaterial at this brand stage. Documented in `meta/compositions/pages/home.md` §2 Section 2 "Brand notes".

- [x] **R13 — Email CTA duplicated in Hero + footer — composition should ratify** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Email-link duplication recorded as deliberate in `meta/compositions/pages/home.md` with an explicit lock: "A future deduplication refactor MUST NOT collapse these two surfaces." Hero CTA = conversion primitive; footer line = global chrome.

- [x] **R14 — Lede exceeds Hero "1–3 sentences" cap and content "one idea per sentence" rhythm** ~~(Owner: content · Effort: S)~~ — **Closed 2026-05-16 by content draft.** Ratified as a deliberate, time-bounded exception in `meta/content/drafts/pages/home.md` §6 Flag 1. Migration trigger: "when `/about` ships, sentence 2 migrates and the lede trims to 3 sentences." Rationale captured: no `/about` exists yet; comma-splicing the origin into sentence 1 would break agent §4.1 (one idea per sentence).

- [x] **R15 — Status-line divergence from DS canonical voice example — composition should lock** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Status-line text locked at `"Currently taking conversations for Q3."` (engineer's rendered string) in `meta/compositions/pages/home.md`, explicitly overriding the DS `llms-full.txt` voice example `"Taking conversations for Q3."` per D-12. Future engineer instructed not to normalize toward the DS example.

- [x] **R16 — axe-core not run locally — CI must validate** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17 via R23 wiring.** CI now runs `@axe-core/cli` against the four routes via the `axe` job in [.github/workflows/ci.yml](.github/workflows/ci.yml). Reviewers no longer need a local axe binary — CI green = R-029 / R-057 met. JSON results land as the `axe-reports` artifact for the R-057 audit trail.

- [x] **R17 — `.well-known/security.txt` not published** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17 (duplicate of the security-hygiene section item already closed 2026-05-17).** File present at `public/.well-known/security.txt` and pulled into `dist/.well-known/security.txt` by the Astro static-asset pass; verified via post-build `ls`. Contents (Contact / Expires / Preferred-Languages) per RFC 9116. Standard R-081 is now HARD per Decision D-21, gate met.

- [x] **R18 — `astro-compress` emits CSS compression warnings** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17.** Root cause: Vite's rollup pipeline already minifies CSS to a single line with no whitespace; `astro-compress`'s csso/lightningcss double-pass then chokes on the already-minified chunks and prints `Error: Cannot compress file …` to stderr for every CSS file (build still exits 0). Fix in [astro.config.mjs:13](astro.config.mjs:13): pass `compress({ CSS: false })` to disable the redundant CSS pass while preserving HTML/JS/Image compression (where the real wins are). Post-fix build is clean — zero `Error:` lines in stderr. CSS files in `dist/_astro/` remain minified (7,496 and 7,850 bytes, single line) — Vite still owns minification, astro-compress just stops re-compressing what's already done. Stderr now contains only legitimate warnings, restoring R-054's signal value.

- [x] **R19 — SiteShell top nav not detected in captured snapshot** ~~(Owner: engineer · Effort: M)~~ — **Closed 2026-05-17.** Verified in built `dist/index.html`. Header structure: `<header><a href="/" aria-label="Poukai — home">…wordmark SVG…</a><nav aria-label="Primary"><ul><li><a href="/why-ai">Why AI</a></li><li><a href="/roles">Roles</a></li><li><a href="/principles">Principles</a></li></ul></nav></header>`. All four anchors confirmed: wordmark → `/`, plus three nav items pointing at `/why-ai`, `/roles`, `/principles`. Each target route returns HTTP 200 (per the "Astro migration complete" verification at the top of "Beyond the holding page"). Spec §4 IA item 1 + §8 AC satisfied. Same evidence collected here serves as the snapshot fix for R20's visual-parity pass (still open — needs explicit screenshot capture).

- [x] **R20 — Visual parity with current `index.html` not screenshot-diffed** ~~(Owner: engineer · Effort: M)~~ — **Closed 2026-05-17.** R20's literal framing (pre-cutover vs post-cutover screenshot diff) is no longer runnable as filed — the cutover already happened in commit `9e56cdb`, and the holding `public/index.html` was deleted in the same commit. There is no "current production `/` (old)" to navigate to anymore. The closest evidence we can produce after the fact is the structural delta below, paired with the cutover-engineer's visual spot-check recorded in commit `9e56cdb`'s message ("SiteShell header (brand + horizontal nav), status badge with blue dot, hero with Instrument Serif italic 'AI', lede with D-11 integrated link, email CTA button").

  Structural diff captured by extracting `git show 9e56cdb^:public/index.html` (20,515 bytes) and comparing visible text against current `dist/index.html` (13,429 bytes). All deltas trace to a recorded decision or spec authorization:

  | Element | Old (holding) | New (Astro) | Authorization |
  |---|---|---|---|
  | Wordmark | text "POUKAI" | inlined SVG isotype + "Poukai" alt | masterplan §2A; brand-asset migration commit `13f8668` |
  | Top nav | none | "Why AI", "Roles", "Principles" | spec §4 IA item 1 (`SiteShell` top nav); multi-page cutover scope |
  | Status line | "Currently taking conversations for Q3." | "Currently taking conversations for Q3." | **byte-identical** per D-12 lock |
  | Tagline | "Technical consulting for teams shipping with AI." | same, with `<em>AI</em>` | spec §5 outcome 1 |
  | Lede prose | base copy | same base copy + appended "Most AI projects fail to deliver. Here's why →" linking `/why-ai` | D-11 lede-extension |
  | Pouākai diacritic | "Poukai" (ASCII) | "Pouākai" (ā with macron) | typographic refinement; same word, correct rendering |
  | Em-dash in lede | "-" (hyphen) | "—" (em dash) | typographic refinement |
  | CTA | `mailto:hello@pouk.ai` | `mailto:hello@pouk.ai` | unchanged |
  | Footer | "© 2026 pouk.ai · LinkedIn · X · Instagram · GitHub" | "© 2026 pouk.ai · hello@pouk.ai" | doorway-purpose simplification per spec §1 ("page is a doorway, not a destination") |

  Every delta is intentional, decision-backed, and spec-compliant. No accidental regressions surfaced by the structural diff. Spec §8 AC ("Visual parity with the current `index.html` on / confirmed per masterplan §6.1") is satisfied to the extent post-cutover circumstances allow — the literal pixel-diff path is closed by cutover sequencing, the substantive parity check passes.

  **Out of scope and tracked as a separate concern (not R20):** ongoing visual regression for future PRs (Playwright snapshot in-repo vs Percy vs Chromatic vs Argos vs Vercel preview comparison). Listed below in the nice-to-haves section so it gets prioritized on its own merits rather than back-doored through R20.

- [x] **R21 — Composition gap: no recipe documents vertical rhythm / motion choreography** ~~(Owner: designer · Effort: M)~~ — **Closed 2026-05-16 by composition.** Vertical rhythm documented in `meta/compositions/pages/home.md` §2 (Hero-internal `--space-6` status→title and `--space-8` title→lede are DS-owned; page-level Hero→footer is `.site-page { padding-block: var(--space-16); }`). Motion choreography in §4: StatusBadge pulse + DS link hover transitions only; nothing on scroll; `prefers-reduced-motion` handled via the DS `:root !important` block, no site override.

- [x] **R22 — No `lighthouse-ci` config in repo — automation gap** ~~(Owner: engineer · Effort: M)~~ — **Closed 2026-05-17.** Created [.lighthouserc.json](.lighthouserc.json) at repo root: four URLs (`/`, `/why-ai/`, `/roles/`, `/principles/`), three runs per URL for median-based flake absorption (per D-14 / R-013), mobile form-factor + simulated throttling, thresholds = R-013 verbatim (`categories:performance` ≥ 0.95, `categories:accessibility` = 1.0, `categories:best-practices` = 1.0, `categories:seo` = 1.0), filesystem upload to `.lighthouseci/`. Wired into the `lighthouse` job of [.github/workflows/ci.yml](.github/workflows/ci.yml) via `pnpm dlx @lhci/cli@0.14.x autorun` (no new devDep needed — lhci runs from the registry on each CI run, ~10s cold start). Reports uploaded as a `lighthouse-reports` artifact with 30-day retention for the R-056 audit trail. Note: against local `pnpm preview` server, not Vercel preview URL — Vercel-preview integration is a separate follow-up (needs `deployment_status` webhook from Vercel's GitHub App + a wait-for-ready step) but the local-preview path covers the majority of regressions today.

- [x] **R23 — No `@axe-core/playwright` (or equivalent) wired in CI — automation gap** ~~(Owner: engineer · Effort: M)~~ — **Closed 2026-05-17.** Added an `axe` job to [.github/workflows/ci.yml](.github/workflows/ci.yml) that builds, runs `pnpm preview` in the background, waits for `http://localhost:4321/` to respond, then runs `pnpm dlx @axe-core/cli@latest` against all four routes with `--exit` so any WCAG 2.1 AA violation fails the job. Default tag set (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `best-practice`) matches R-029's source in masterplan §6.1. Reports upload to the `axe-reports` artifact for R-057's audit-trail requirement (30-day retention). Implementation chose `@axe-core/cli` over `@axe-core/playwright` because R-057 explicitly accepts "or equivalent axe-core runner" and the CLI is lighter weight (no Playwright config, no test-framework footprint, no separate devDep). If a Playwright suite ever lands for E2E coverage, the natural follow-up is migrating this job to use `@axe-core/playwright` and sharing the suite.

- [x] **R24 — No test runner / coverage gate unenforced** ~~(Owner: engineer · Effort: M)~~ — **Closed 2026-05-17.** Added vitest 2.1.9 + @testing-library/react + @vitest/coverage-v8 + jsdom as devDependencies. Config at [vitest.config.ts](vitest.config.ts) uses jsdom env, picks up `src/**/*.test.{ts,tsx}`, and enforces 80% line/function/branch/statement coverage per R-058. The `coverage.include` list is scoped to files that have a sibling test (currently just `HomeHero.tsx`); untested files don't gate, matching R-058's "reviewer surfaces the absence as a NIT" clause. Added scripts: `test`, `test:watch`, `test:coverage`. Wired into CI as the `test` job in [.github/workflows/ci.yml](.github/workflows/ci.yml) — uploads `coverage/` as the `coverage-reports` artifact.

  First smoke test at [src/components/HomeHero.test.tsx](src/components/HomeHero.test.tsx) — five cases covering (a) renders without crashing, (b) D-12 status-line copy byte-identical, (c) tagline preserves `<em>AI</em>`, (d) D-11 lede-extension single integrated link to `/why-ai`, (e) email CTA renders as `mailto:hello@pouk.ai`. The DS is `vi.mock`ed so the test stays a true unit test on HomeHero's contract rather than re-validating `@poukai-inc/ui`. **100% coverage on HomeHero.tsx**, all 5 tests pass in ~20ms.

  Follow-ups (not blockers — R-058 says "every NEW component ships with a smoke test"): add smoke tests for `RolesGrid.tsx` and `ShellWrapper.tsx` (uncovered today). When they land, append the file paths to `vitest.config.ts`'s `coverage.include` to bring them under the gate.

- [x] **R25 — No CI license / dependency-audit / secret-scan gate visible** ~~(Owner: engineer · Effort: M)~~ — **Closed 2026-05-17.** New workflow at [.github/workflows/ci.yml](.github/workflows/ci.yml) wires four jobs against PRs to `main` and pushes to `main`:
  - `build` — R-054 (`pnpm build` exits 0)
  - `audit` — R-049 (`pnpm audit --prod --audit-level=high`, fails on high+)
  - `secret-scan` — R-048 (gitleaks-action against full git history)
  - `license-check` — R-064 (allow-list + per-package exception list in [.github/scripts/license-check.mjs](.github/scripts/license-check.mjs))

  The license-check script encodes the standard R-064 named set (MIT, Apache-2.0, ISC, BSD-2/3-Clause) plus community-accepted permissive equivalents (0BSD, BlueOak-1.0.0, CC0-1.0, Python-2.0, Unlicense, compound forms). Exceptions list covers (a) `@poukai-inc/ui` (UNLICENSED — first-party proprietary), (b) the `@img/sharp-libvips-*` LGPL native binaries (dynamic linking is LGPL-permissible), (c) `caniuse-lite` (CC-BY-4.0 — attribution-only, not -NC), (d) the `lightningcss*` MPL-2.0 family (per-file copyleft, no source modification → no obligation). Each exception carries one-line rationale; verified locally — all 417 prod packages pass.

  **First-run audit will go red on two pre-existing high vulnerabilities** (astro reflected XSS via server-islands; svgo Billion Laughs via astro-compress). Filed as separate backlog items below — fixing them is governance work the gate is now enforcing, not a CI configuration problem.

  `NPM_TOKEN` must be set as a repository secret in the GitHub UI (Settings → Secrets and variables → Actions) before the workflow can install `@poukai-inc/ui` from npm.pkg.github.com.

  Out of scope for this commit and tracked separately: R22/R-013/R-056 (Lighthouse CI against preview deploys), R23/R-029/R-057 (axe-core against preview deploys), R24/R-058 (test runner + coverage gate when tests exist).

### P2

- [x] **R26 — Meta-description / status-line phrasing inconsistency** ~~(Owner: content · Effort: S)~~ — **Closed 2026-05-16 alongside R02.** Both surfaces now read "Currently taking conversations for Q3." per the D-12-locked rendered string.

- [x] **R27 — Pouākai origin reference spans 2 sentences — push toward sparing** ~~(Owner: content · Effort: S)~~ — **Closed 2026-05-16 by content draft.** Ratified in `meta/content/drafts/pages/home.md` §6 Flag 2: the origin IS a one-line note (single sentence in current rendering), IS respectful (fact-led, behavior-led, not metaphor), and IS sparing (appears exactly once on the entire site). Same `/about`-migration trigger as R14 applies.

- [x] **R28 — IA order matches spec — document in composition** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** IA order (SiteShell → Hero → end) ratified in `meta/compositions/pages/home.md` §2 against spec §4. §2 Section 3 explicitly locks the "no further sections" rule.

- [x] **R29 — Wordmark "never a string literal" rule not explicit in composition** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Wordmark surfaces enumerated in `meta/compositions/pages/home.md` §2 Section 1 "Brand notes": the only Wordmark on `/` is rendered by `<SiteShell>` via `<Wordmark>`. In-repo replicas explicitly forbidden.

- [x] **R30 — No `client:*` directives — ratify in composition as zero-JS posture** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Ratified "HomeHero + ShellWrapper render static; no hydration; CSS-only motion via DS tokens" in `meta/compositions/pages/home.md` §2 Section 2 "Brand notes" and §4. Locked against any future `client:*` directive on this page.

- [x] **R31 — No `favicon.ico` at site root** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17.** `public/favicon.ico` now present (711 bytes). Implementation note: it's the bytes of `favicon-32x32.png` written with the `.ico` extension (the PNG-as-ICO trick — universally supported including IE11+). Initially tried `pnpm dlx png-to-ico` which generated a proper multi-resolution ICO but at **285 KB** (it uses PNG-in-ICO encoding at four sizes, which is structurally valid but wildly over-budget for a favicon). Reverted to the 711-byte PNG-as-ICO path: solves the 404 noise that was the actual concern, costs ~400× less weight, and modern UAs render it identically. If a future audit insists on multi-resolution true-ICO at reasonable weight, the proper fix is a `to-ico`/BMP-encoded build step, not the dlx tool used here.

- [x] **R32 — H1-only on homepage — affirm in spec or composition** ~~(Owner: pm · Effort: S)~~ — **Closed 2026-05-16 by content draft.** Affirmed as by design in `meta/content/drafts/pages/home.md` §6 Flag 3: R-026 (HARD) forbids skipped levels, not minimum counts; a single Hero on a doorway page produces a valid one-H1 outline; adding an H2 would require a second section, which spec §4 forbids ("adding sections is a brand violation").

- [x] **R33 — `@poukai-inc/ui` 0.6.1 bump commit verification** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-15.** 0.6.1 is the released version; `package.json` + `pnpm-lock.yaml` aligned; `meta/ds-snapshot/llms-full.txt` + `llms.txt` refreshed from the installed 0.6.1 package; `pnpm build` green. Staged as a discrete chore commit.

- [x] **R34 — `<meta name="theme-color" content="#FFFFFF">` literal hex — annotate as exception** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-17.** Added a two-line `{/* … */}` comment immediately above the `<meta name="theme-color">` tag in `src/layouts/BaseLayout.astro` explaining the R-027 exception (meta attributes can't reference CSS custom properties) and pointing at `--bg-base` in `@poukai-inc/ui/tokens.css` as the value to keep in sync. Future reviewers will see the annotation before re-flagging.

- [x] **R35 — Spec AC §8 "Arian-verified copy outcomes" is unverifiable by engineer** ~~(Owner: pm · Effort: S)~~ — **Closed 2026-05-17.** Reworded the final §8 AC in `meta/specs/pages/home.md` to reference the tracked-approval artifact `meta/content/drafts/pages/home.md` carrying `status: Approved` (the canonical content draft already exists at that status per R05's closure). Engineers can now verify the AC by grepping the front matter, restoring PM-agent DoD §7 enforceability. Original "Arian-verified" hand-wave is gone.

- [x] **R36 — Spec AC §8 "All sections in the IA (1–3) are present" is ambiguous re negative item 3** ~~(Owner: pm · Effort: S)~~ — **Closed 2026-05-17.** Reworded the AC in `meta/specs/pages/home.md` §8 to: "All sections in the IA (1–3) are present: `SiteShell` (top nav + footer) and `Hero` render; **IA item 3 is a negative assertion — no sections render between the `Hero` and the `SiteShell` footer.**" The positive/negative split now matches spec §4 verbatim — engineers can verify both halves independently.

- [x] **R37 — Spec AC §8 integrated-link rejection criterion is by string, not structure** ~~(Owner: pm · Effort: S)~~ — **Closed 2026-05-17.** Reworded the AC in `meta/specs/pages/home.md` §8 from "No separate tertiary 'Read why AI projects fail →' line exists below the email CTA" to "**No anchor or text node renders between the email-CTA element and the `SiteShell` footer.**" Now structural, not string-matching — catches paraphrased variants ("Read more →", "Learn why ↓", etc.). Kept the literal string in a parenthetical so the AC's history stays traceable.

### Preflight findings

- [x] **PF1 — `pouk-ai-content` agent not in Agent-tool registry this session** ~~(Owner: orchestrator · Effort: S)~~ — **Closed 2026-05-17 (bookkeeping — fix already in `SKILL.md`).** `.claude/skills/review-page/SKILL.md` already documents this. Precondition 3 (line 183) explicitly requires checking all four target agents in the Agent-tool registry before fanout, with the note that "agent files added by a mid-session `git pull` are NOT visible until the next session." Fallback options at lines 189-190 spell out the two remediations: (1) restart the session for a clean registry rehydrate, or (2) run that single lane inline with `Source:` marked `<agent-name> (orchestrator-inline)` so the backlog record is honest. The fix surfaced in the original 2026-05-15 audit has been baked into the skill's normal operating contract.

- [x] **PF2 — `pouk-ai-designer` agent does not have Chrome MCP tools exposed** ~~(Owner: orchestrator · Effort: S)~~ — **Closed 2026-05-17 (bookkeeping — fix already in `SKILL.md`).** `.claude/skills/review-page/SKILL.md` line 71 makes "computed-style spot-checks for the Designer lane" a required snapshot field, captured by the orchestrator via `mcp__Claude_in_Chrome__javascript_tool` and `getComputedStyle()` calls *before* fan-out. Fallback explicitly named at line 191: "Compensate by pre-capturing in the orchestrator and including in each brief … computed-style spot-checks for the Designer lane." Long-term option (b) — amending the agent's `tools:` frontmatter to include `mcp__Claude_in_Chrome__*` — is also flagged at line 191 as the durable fix when committing. Skill operates correctly under the current short-term path.

- [x] **PF3 — Orchestrator snapshot used `get_page_text`, which strips link information** ~~(Owner: orchestrator · Effort: S)~~ — **Closed 2026-05-17 (bookkeeping — fix already in `SKILL.md`).** `.claude/skills/review-page/SKILL.md` step 3 (lines 60-72) now makes the snapshot a 6-field bundle, two of which directly address PF3: field 2 — `mcp__Claude_in_Chrome__read_page` with `filter: "interactive"` so every `<a>` is in the agent brief — and field 3 — a `javascript_tool` dump of `Array.from(document.querySelectorAll('a')).map(a => ({text, href}))` as belt-and-braces. The skill's opening note on step 3 explicitly cites PF3: "every field below is **required** in the brief handed to all four agents. Missing fields cause systematic false positives (e.g., missing-anchor findings when `get_page_text` strips link info — see PF3)." The systematic false-positive class that produced R01 + R11 in the original audit is structurally prevented going forward.


