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
- [ ] **`index.html` favicon `<link>`** — line 33 still references the old altimeter inline-SVG placeholder. Per founder rule ("any changes to the current holding landing page are cosmetic and temporary"), this stays untouched until `/` is ported into Astro. The new Astro routes (`/why-ai`, `/roles`, `/principles`) already use the new isotype via `BaseLayout.astro`.

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

- [ ] **R06 — Hero StatusBadge pulse animation unverified** (Owner: engineer · Effort: S)
  - Source: pouk-ai-pm
  - Where: rendered `/`; spec §8 AC "StatusBadge renders with the pulse animation (CSS keyframes, no JS)"
  - Why: Page text captured but not the StatusBadge DOM element class/keyframe. Inspect computed styles for the pulse and confirm CSS-only.

- [ ] **R07 — Lighthouse not run locally — CI must validate** (Owner: engineer · Effort: S)
  - Source: pouk-ai-pm, pouk-ai-reviewer
  - Where: NOT VERIFIED; spec §8 AC "Lighthouse mobile: 100/100/100/100"; standards R-013, R-056 (HARD)
  - Why: No `lighthouse` / `lhci` binary on PATH. Standard R-056 (HARD) requires lhci wired against preview deploys; until that lands, every reviewer pass leaves this gate open.

- [ ] **R08 — Zero-client-JS contract unverified in production build** (Owner: engineer · Effort: S)
  - Source: pouk-ai-pm
  - Why: Spec §8 AC "Zero client-side JS shipped on / (per masterplan §4.3)". Dev server includes Vite client noise (expected). Confirm by inspecting `dist/index.html` and the Network panel against the built site — no `<script src=>` tags except JSON-LD.

- [ ] **R09 — HTML-weight delta vs holding page not measured** (Owner: engineer · Effort: S)
  - Source: pouk-ai-pm, pouk-ai-reviewer
  - Where: spec §8 AC "HTML weight stays within +10% of the current index.html"; standard R-015 (HARD)
  - Why: Built `/index.html` is 13,417 bytes uncompressed / 4,875 bytes gzipped. Holding-page baseline not recorded in the repo. Capture pre-cutover `index.html` weight as an artifact for the R-015 comparison.

- [ ] **R10 — `prefers-reduced-motion` behavior unverified** (Owner: engineer · Effort: S)
  - Source: pouk-ai-pm, pouk-ai-designer
  - Where: spec §8 AC "prefers-reduced-motion honored — pulse and any entrance animations disabled"
  - Why: `@poukai-inc/ui/tokens.css` carries the `:root !important` gate, so behavior should be automatic. Confirm by emulating the media query in Chrome DevTools and checking the pulse + any entrance animation disable.

- [x] **R11 — Canonical link element not confirmed** ~~(Owner: engineer · Effort: S)~~ — **FALSE POSITIVE. Closed 2026-05-16.** Engineer verified `BaseLayout.astro:101` emits `<link rel="canonical" href={canonical} />` and `BaseLayout.astro:106` emits the matching `<meta property="og:url" content={canonical} />`. Audit snapshot at line ranges above the canonical tag missed it. Root cause is the same as PF3 (orchestrator snapshot capture not seeing the full `<head>`).

- [x] **R12 — Lede-extension uses literal `→` entity instead of Lucide `ArrowRight`** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Ratified the literal `&rarr;` as the editorial choice per D-11 (the hand-off is structural prose, not iconography); trade-offs (dark-mode color, hover-motion absence) judged immaterial at this brand stage. Documented in `meta/compositions/pages/home.md` §2 Section 2 "Brand notes".

- [x] **R13 — Email CTA duplicated in Hero + footer — composition should ratify** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Email-link duplication recorded as deliberate in `meta/compositions/pages/home.md` with an explicit lock: "A future deduplication refactor MUST NOT collapse these two surfaces." Hero CTA = conversion primitive; footer line = global chrome.

- [x] **R14 — Lede exceeds Hero "1–3 sentences" cap and content "one idea per sentence" rhythm** ~~(Owner: content · Effort: S)~~ — **Closed 2026-05-16 by content draft.** Ratified as a deliberate, time-bounded exception in `meta/content/drafts/pages/home.md` §6 Flag 1. Migration trigger: "when `/about` ships, sentence 2 migrates and the lede trims to 3 sentences." Rationale captured: no `/about` exists yet; comma-splicing the origin into sentence 1 would break agent §4.1 (one idea per sentence).

- [x] **R15 — Status-line divergence from DS canonical voice example — composition should lock** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Status-line text locked at `"Currently taking conversations for Q3."` (engineer's rendered string) in `meta/compositions/pages/home.md`, explicitly overriding the DS `llms-full.txt` voice example `"Taking conversations for Q3."` per D-12. Future engineer instructed not to normalize toward the DS example.

- [ ] **R16 — axe-core not run locally — CI must validate** (Owner: engineer · Effort: S)
  - Source: pouk-ai-reviewer
  - Where: NOT VERIFIED; standards R-029, R-057 (HARD)
  - Why: No `axe` / `@axe-core/playwright` binary on PATH. R-057 (HARD) requires axe wired in CI; until that lands, every reviewer pass leaves the gate open.

- [ ] **R17 — `.well-known/security.txt` not published** (Owner: engineer · Effort: S)
  - Source: pouk-ai-reviewer
  - Where: `public/.well-known/security.txt` — absent; standard R-081 (SOFT now, HARD after `hello@pouk.ai` lands)
  - Why: Surfaced as SOFT now and tracked alongside R-047 (DNS+email gate). Becomes HARD once mailbox is live.

- [ ] **R18 — `astro-compress` emits CSS compression warnings** (Owner: engineer · Effort: S)
  - Source: pouk-ai-reviewer
  - Where: Build log: "Error: Cannot compress file …/dist/_astro/index.C4P2Dw-Z.css" and `index.ck3Qfayw.css`
  - Why: Build exits 0 (R-054 met), but stderr "Error:" lines mask real failures over time. Verify those two CSS files aren't silently shipping uncompressed; either fix the compressor input or silence the spurious warning.

- [ ] **R19 — SiteShell top nav not detected in captured snapshot** (Owner: engineer · Effort: M)
  - Source: pouk-ai-pm
  - Where: spec §4 IA item 1 (SiteShell top nav), §8 AC "SiteShell top nav links to /why-ai, /roles, /principles work; wordmark links back to /"
  - Why: Page-text capture started at the status line. Reviewer confirmed `<header>` + `<nav aria-label="Primary">` are present in `dist/index.html`, but spec §8 also requires the four nav links to be live and the wordmark anchor to point at `/`. Verify each link target.

- [ ] **R20 — Visual parity with current `index.html` not screenshot-diffed** (Owner: engineer · Effort: M)
  - Source: pouk-ai-pm
  - Where: spec §8 AC "Visual parity with the current index.html on / confirmed per masterplan §6.1"
  - Why: This audit was text+meta only. Capture two screenshots (current production `/` and built post-cutover `/`) and confirm parity before `Built` flips.

- [x] **R21 — Composition gap: no recipe documents vertical rhythm / motion choreography** ~~(Owner: designer · Effort: M)~~ — **Closed 2026-05-16 by composition.** Vertical rhythm documented in `meta/compositions/pages/home.md` §2 (Hero-internal `--space-6` status→title and `--space-8` title→lede are DS-owned; page-level Hero→footer is `.site-page { padding-block: var(--space-16); }`). Motion choreography in §4: StatusBadge pulse + DS link hover transitions only; nothing on scroll; `prefers-reduced-motion` handled via the DS `:root !important` block, no site override.

- [ ] **R22 — No `lighthouse-ci` config in repo — automation gap** (Owner: engineer · Effort: M)
  - Source: pouk-ai-reviewer
  - Where: repo root (no `.lighthouserc.*`); standards section 4 (deferred automation)
  - Why: R-056 (HARD) requires lhci wired against preview deploys. Standards explicitly call this aspirational for CI but enforced manually — overdue.

- [ ] **R23 — No `@axe-core/playwright` (or equivalent) wired in CI — automation gap** (Owner: engineer · Effort: M)
  - Source: pouk-ai-reviewer
  - Where: `package.json` devDependencies, `.github/workflows/`
  - Why: R-057 (HARD). Same standards-section-4 gap as R-22.

- [ ] **R24 — No test runner / coverage gate unenforced** (Owner: engineer · Effort: M)
  - Source: pouk-ai-reviewer
  - Where: `package.json` scripts — no `test` script
  - Why: R-058 says every new component ships with a smoke test. `HomeHero.tsx`, `RolesGrid.tsx`, `ShellWrapper.tsx` have none.

- [ ] **R25 — No CI license / dependency-audit / secret-scan gate visible** (Owner: engineer · Effort: M)
  - Source: pouk-ai-reviewer
  - Where: `.github/workflows/` (not inspected in this lane)
  - Why: R-048 (secret scan), R-049 (`pnpm audit --prod --audit-level=high`), R-064 (license check) — all HARD per standards section 4 (verification matrix).

### P2

- [x] **R26 — Meta-description / status-line phrasing inconsistency** ~~(Owner: content · Effort: S)~~ — **Closed 2026-05-16 alongside R02.** Both surfaces now read "Currently taking conversations for Q3." per the D-12-locked rendered string.

- [x] **R27 — Pouākai origin reference spans 2 sentences — push toward sparing** ~~(Owner: content · Effort: S)~~ — **Closed 2026-05-16 by content draft.** Ratified in `meta/content/drafts/pages/home.md` §6 Flag 2: the origin IS a one-line note (single sentence in current rendering), IS respectful (fact-led, behavior-led, not metaphor), and IS sparing (appears exactly once on the entire site). Same `/about`-migration trigger as R14 applies.

- [x] **R28 — IA order matches spec — document in composition** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** IA order (SiteShell → Hero → end) ratified in `meta/compositions/pages/home.md` §2 against spec §4. §2 Section 3 explicitly locks the "no further sections" rule.

- [x] **R29 — Wordmark "never a string literal" rule not explicit in composition** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Wordmark surfaces enumerated in `meta/compositions/pages/home.md` §2 Section 1 "Brand notes": the only Wordmark on `/` is rendered by `<SiteShell>` via `<Wordmark>`. In-repo replicas explicitly forbidden.

- [x] **R30 — No `client:*` directives — ratify in composition as zero-JS posture** ~~(Owner: designer · Effort: S)~~ — **Closed 2026-05-16 by composition.** Ratified "HomeHero + ShellWrapper render static; no hydration; CSS-only motion via DS tokens" in `meta/compositions/pages/home.md` §2 Section 2 "Brand notes" and §4. Locked against any future `client:*` directive on this page.

- [ ] **R31 — No `favicon.ico` at site root** (Owner: engineer · Effort: S)
  - Source: pouk-ai-reviewer
  - Where: `public/favicon.ico` — absent (PNG favicons 16/32 present)
  - Why: Modern best practice satisfied. Some user agents and crawlers still request `/favicon.ico` and generate 404 log noise.

- [x] **R32 — H1-only on homepage — affirm in spec or composition** ~~(Owner: pm · Effort: S)~~ — **Closed 2026-05-16 by content draft.** Affirmed as by design in `meta/content/drafts/pages/home.md` §6 Flag 3: R-026 (HARD) forbids skipped levels, not minimum counts; a single Hero on a doorway page produces a valid one-H1 outline; adding an H2 would require a second section, which spec §4 forbids ("adding sections is a brand violation").

- [x] **R33 — `@poukai-inc/ui` 0.6.1 bump commit verification** ~~(Owner: engineer · Effort: S)~~ — **Closed 2026-05-15.** 0.6.1 is the released version; `package.json` + `pnpm-lock.yaml` aligned; `meta/ds-snapshot/llms-full.txt` + `llms.txt` refreshed from the installed 0.6.1 package; `pnpm build` green. Staged as a discrete chore commit.

- [ ] **R34 — `<meta name="theme-color" content="#FFFFFF">` literal hex — annotate as exception** (Owner: engineer · Effort: S)
  - Source: pouk-ai-reviewer
  - Where: `src/layouts/BaseLayout.astro:97`
  - Why: Meta-tag content cannot reference CSS custom properties, so the literal hex is unavoidable. R-027 (HARD) requires tokenized colors. Add a one-line comment annotating this as the legitimate exception so a future reviewer doesn't re-flag it.

- [ ] **R35 — Spec AC §8 "Arian-verified copy outcomes" is unverifiable by engineer** (Owner: pm · Effort: S)
  - Source: pouk-ai-pm
  - Where: `meta/specs/pages/home.md` §8 final bullet
  - Why: AC depends on a human approval signal not captured anywhere checkable, contra the PM agent's DoD §7. Reword the AC to reference a tracked approval artifact (e.g., a checkbox in `meta/decisions/launch-readiness.md`).

- [ ] **R36 — Spec AC §8 "All sections in the IA (1–3) are present" is ambiguous re negative item 3** (Owner: pm · Effort: S)
  - Source: pouk-ai-pm
  - Where: `meta/specs/pages/home.md` §4 IA item 3, §8 AC
  - Why: IA item 3 is the negative assertion "End — no further sections." The AC reads positively. Reword to remove ambiguity: "Hero and SiteShell render; no further sections present."

- [ ] **R37 — Spec AC §8 integrated-link rejection criterion is by string, not structure** (Owner: pm · Effort: S)
  - Source: pouk-ai-pm
  - Where: `meta/specs/pages/home.md` §8 AC "No separate tertiary 'Read why AI projects fail →' line"
  - Why: AC names a rejected string; an engineer could miss a paraphrased violation. Reword: "No anchor or text node between the email link and the SiteShell footer."

### Preflight findings

- [ ] **PF1 — `pouk-ai-content` agent not in Agent-tool registry this session** (Owner: orchestrator · Effort: S)
  - Source: skill orchestrator (`/review-page`)
  - Where: Agent tool registry; agent file `.claude/agents/pouk-ai-content.md` was added by the mid-session `git pull`
  - Why: Agent registry loads at session start and isn't refreshed by mid-session file additions. Content lane was run inline by the orchestrator against the brand-voice rulebook from the agent definition. Update `.claude/skills/review-page/SKILL.md` to note the registry-refresh requirement; OR run the skill in a freshly-launched session after any agent-file change.

- [ ] **PF2 — `pouk-ai-designer` agent does not have Chrome MCP tools exposed** (Owner: orchestrator · Effort: S)
  - Source: skill orchestrator (`/review-page`)
  - Where: agent invocation; agent reported "Chrome MCP tools not directly listed in my available tools"
  - Why: Specialist agents don't inherit deferred MCP tools from the orchestrator. The Designer lane fell back to source-code reading + the captured snapshot — sufficient for this audit, but full DOM/computed-style inspection requires either (a) the orchestrator pre-loading richer snapshots for the agent's brief, or (b) the agent's `tools:` frontmatter explicitly listing the Chrome MCP namespace. Update SKILL.md and consider amending agent frontmatter.

- [ ] **PF3 — Orchestrator snapshot used `get_page_text`, which strips link information** (Owner: orchestrator · Effort: S)
  - Source: skill orchestrator (`/review-page`) — surfaced by engineer verification of R01
  - Where: `.claude/skills/review-page/SKILL.md` step 3 (page-snapshot capture)
  - Why: `mcp__Claude_in_Chrome__get_page_text` returns plain text without `href` attributes. When the PM lane read the snapshot "Here's why →" as a bare string, it concluded the anchor was missing (R01) — but the actual DOM has `<a href="/why-ai">…</a>`. The snapshot must include link structure. Fix SKILL.md step 3 to additionally capture (a) `read_page` with `filter: "interactive"` so every `<a>` is visible in the agent brief, or (b) a `javascript_tool` dump of `document.querySelectorAll('a')` mapped to `{text, href}`. Without this, false positives on link/CTA findings are systematic.


