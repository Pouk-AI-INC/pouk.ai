# pouk.ai — backlog

Things to ship before / around launch. Roughly priority-ordered within sections.

## Blockers for launch

- [x] **Register `pouk.ai` at Porkbun.** Done 2026-05-13.
- [x] **Generate `og.png`** (1200×630). Done 2026-05-13. Lives in the DS repo at `poukai-ui/src/brand/og.png`. **Operational follow-up**: per masterplan section 2A, `og.png` belongs in the site repo (it's marketing artwork, not a brand primitive). Either copy into the site repo root before cutover, or have `pouk-ai-engineer` pull it into `public/og.png` during the Astro scaffold round.
- [x] **Generate `apple-touch-icon.png`** (180×180). Done 2026-05-13. Same location/follow-up as `og.png` — currently at `poukai-ui/src/brand/apple-touch-icon.png`; needs to land at `public/apple-touch-icon.png` in the site repo before cutover.
- [x] **Update favicon** to the feather isotype. Done 2026-05-13. Favicon variations (`favicon-16x16.png`, `favicon-32x32.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png`) generated in `poukai-ui/src/brand/`. **Operational follow-up**: index.html still references the old placeholder altimeter inline-SVG favicon at line 33; the new files need to be wired in (either inline-SVG-from-the-isotype path or `<link rel="icon" href="/favicon-32x32.png">` references) during the Astro scaffold round or as a one-off patch to `index.html` if cutover comes first.
- [x] Add `robots.txt`. Done 2026-05-13 (commit `bc81bc3`).
- [x] Add `sitemap.xml`. Done 2026-05-13 (commit `bc81bc3`).
- [x] Add `vercel.json` at the repo root. Done 2026-05-13 (commit `bc81bc3`).
- [x] Resolve JSON-LD ↔ CSP. Closed — `vercel.json` ships without CSP per D-17, so the conflict never materialized. Re-open if/when a CSP is introduced.

## DNS + email — **manual (Arian executes)**

These touch external systems (Porkbun dashboard, Vercel dashboard, email host onboarding) that the engineering agents can't reach. Arian's lane.

- [ ] **Porkbun DNS records** — Domain Management → DNS Records → add:
  - `ALIAS` apex (leave host blank) → `cname.vercel-dns.com`, TTL 600
  - `CNAME www` → `cname.vercel-dns.com`, TTL 600
- [ ] **Vercel domain binding** — Vercel → Project → Settings → Domains → add `pouk.ai` and `www.pouk.ai`. Wait for TLS provisioning (≈30s–2min once DNS propagates).
- [ ] **Pick email host for `hello@pouk.ai`** — Fastmail or Google Workspace are the standard picks. Provider determines the next four record values.
- [ ] **Email DNS records** at Porkbun — values come from the chosen provider:
  - `MX` (root) → `<provider MX records>`
  - `TXT` (root) → `v=spf1 include:<provider> -all`
  - `TXT` `_dmarc` → `v=DMARC1; p=quarantine; rua=mailto:hello@pouk.ai`
  - `TXT` `<selector>._domainkey` → `<DKIM key>`
  - `CAA` (root) → `0 issue "letsencrypt.org"`
  - `CAA` (root) → `0 issue "pki.goog"`
- [ ] **Verify with `dig` + `curl`**:
  ```
  dig +short pouk.ai
  dig +short www.pouk.ai
  curl -I https://pouk.ai/
  ```
  Expect `200`, `server: Vercel`, and `strict-transport-security` header (from `vercel.json`).

All four of these must be live **before the first prospect email goes out** — otherwise it lands in spam.

## Asset migration to site repo — **can be done by Claude on request, or by Arian**

The generated brand assets currently live in the DS repo (`poukai-ui/src/brand/`). They need to land in the site repo before sharing the canonical `pouk.ai` URL on a social surface — otherwise the OG preview 404s and the iOS home-screen icon falls back to a screenshot.

- [ ] Copy `poukai-ui/src/brand/og.png` → site repo `public/og.png` (or repo root for the pre-Astro era). 1200×630, referenced by `<meta property="og:image">` and Twitter card in `index.html`.
- [ ] Copy `poukai-ui/src/brand/apple-touch-icon.png` → site repo `public/apple-touch-icon.png` (or repo root). 180×180, referenced by `<link rel="apple-touch-icon">` in `index.html`.
- [ ] Rewrite the favicon `<link>` in `index.html` line 33 — the existing inline data-URI SVG is the old 3-stroke altimeter placeholder. Replace with either (a) an inline data-URI SVG built from the feather isotype paths (matches the dark-mode-aware approach in the original spec) or (b) external `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">` + 16x16 variant, copying the matching PNGs from `poukai-ui/src/brand/`. Approach (a) is one HTTP request fewer.
- [ ] Once Astro lands, repath everything under `public/` and add `<link rel="manifest">` if `android-chrome-*` icons are kept.

## Security hygiene (once email lands)

- [ ] **Add `/.well-known/security.txt`** — RFC 9116 disclosure file. Contact: `security@pouk.ai` (alias to `hello@`) or `hello@pouk.ai` directly. Include `Expires:` (rotate annually) and an optional `Preferred-Languages: en` field. Decision: `meta/decisions/2026-05-13-launch-readiness-closed.md` D-21. Tracked as Technical Requirements R-081 (SOFT today; HARD once `hello@pouk.ai` is live).

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

- [ ] **Why AI page** — `/why-ai` (or `/why-ai-and-how`, `/the-gap`, `/perspective`, naming TBD). Thought-leadership / market-positioning page that frames the **AI deployment gap** — why most AI projects fail to capture ROI, what the five failure modes are, and how a consultant fixes them. Sits *ahead* of `/roles` in the prospect journey: **Why AI** explains why anyone should hire someone like us; **Roles** explains which kind of help we offer; **Principles** explains why us specifically.

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
