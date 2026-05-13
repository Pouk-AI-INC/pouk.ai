# Spec Backlog

This directory holds product specs authored by `pouk-ai-pm` for the pouk.ai marketing site: `pages/` for routes, `features/` for cross-page capabilities, `content/` for JSON data schemas, and `flows/` for visitor journeys.

This file is the running, prioritized list of every spec authored under `meta/specs/`. Distinct from the parent `meta/backlog.md`, which tracks launch blockers, DNS, and approved verbatim copy — **this file tracks specs only**: what's drafted, what's approved, what's blocked, what's next. The agent updates it whenever a spec is added, moved in priority, or moves through `Draft → In review → Approved → Built → Live`.

---

## Status legend

- **Draft** — written by PM, not yet reviewed by Arian.
- **In review** — under Arian's review; open questions in section 9 of the spec.
- **Approved** — Arian has signed off; engineer can build.
- **Built** — engineer has shipped to a preview deploy.
- **Live** — running under the canonical domain.

---

## Active specs (priority order)

### Page specs — the four routes

1. **`pages/why-ai.md`** — `Draft`
   - Why this priority: Top-of-funnel thesis page. The biggest content lift; the page that frames why anyone hires pouk.ai. Per the funnel order (Why AI → Roles → Principles → contact) this is the most leveraged page to ship first.
   - Dependencies blocking `Approved`: DS `FailureMode` molecule + `Stat` atom shipped in `@poukai/ui@0.1.0`; Arian's calls on (a) sticky-TOC desktop affordance, (b) citation style, (c) dataset-vintage footer, (d) discovery-questions callout treatment.
   - Dependencies blocking `Built`: `content/failure-modes.json.md` spec also `Approved` (same content lifecycle).

2. **`pages/roles.md`** — `Draft`
   - Why this priority: Self-identification page. Once a prospect agrees with `/why-ai`, they need to match their problem to a service shape. Single page with anchor links recommended (`#builder`, `#automator`, etc.) over four sub-routes — defended in the spec.
   - Dependencies blocking `Approved`: DS `RoleCard` molecule shipped; Arian's calls on (a) Lucide glyph picks for the four roles, (b) eyebrow convention ("The Builder" vs. "01"), (c) per-role CTA vs. universal end CTA.
   - Dependencies blocking `Built`: `content/roles.json.md` spec also `Approved`.

3. **`pages/principles.md`** — `Draft`
   - Why this priority: Trust closer. Once a prospect has self-identified, they triangulate whether pouk.ai is the operator they want in the room. Single long-scroll page with anchor IDs recommended over per-principle routes — defended in the spec.
   - Dependencies blocking `Approved`: DS `Principle` molecule shipped; Arian's calls on (a) page-heading wording ("Principles" vs. "Operating Principles"), (b) bookend voice treatment (Instrument Serif italic recommended), (c) any cross-surface pull-out.
   - Dependencies blocking `Built`: `content/principles.json.md` spec also `Approved`.

4. **`pages/home.md`** — `Draft`
   - Why this priority: The post-cutover homepage. Defines the doorway behavior — preserves the holding page's restraint while adding the `/why-ai` lede hand-off. Ships last because it depends on the other three pages existing for its links to mean anything.
   - Dependencies blocking `Approved`: DS `Hero` molecule + `SiteShell` organism shipped; Arian's call on (a) lede-extension treatment (integrated link sentence vs. tertiary line), (b) status-line copy at cutover, (c) `SiteShell` current-route handling on `/`.
   - Dependencies blocking `Built`: visual-parity gate per masterplan section 6.1 (screenshot diff vs. current `index.html`).

### Content data specs

5. **`content/roles.json.md`** — `Draft`
   - Why this priority: Required for `pages/roles.md` to ship. Schema is small and stable; can be Approved early.
   - Dependencies blocking `Approved`: Arian's call on Lucide picks (the `icon` field's allowed values).

6. **`content/principles.json.md`** — `Draft`
   - Why this priority: Required for `pages/principles.md` to ship. Schema includes the editorial bookends as top-level fields alongside the principles array — opinionated call defended in the spec.
   - Dependencies blocking `Approved`: None on the schema side; Arian's review of the validation constraints.

7. **`content/failure-modes.json.md`** — `Draft`
   - Why this priority: Required for `pages/why-ai.md` to ship. Schema includes a per-failure-mode `stats` array (default `[]`) so the 500% and 61% figures render as `Stat` atoms rather than inline bold — opinionated call defended in the spec.
   - Dependencies blocking `Approved`: Arian's approval of the stat-prose extraction (pulling 500%/61% out of body text into `stats`) and of the canonical attribution string for each stat's `source` field.

### Flow specs

8. **`flows/visitor-to-conversation.md`** — `Draft`
   - Why this priority: Connective tissue across the four page specs. Locks the nav order (Why AI → Roles → Principles), the inter-page hand-offs, and the conversion definition. Without it, each page spec is independently sensible but the funnel is theoretical.
   - Dependencies blocking `Approved`: DS `SiteShell` shipped; Arian's call on nav order (recommendation: funnel order, defended in the spec).

---

## Not yet specced (future work surfaced this pass)

Items that surfaced while writing the active specs but are out of launch scope. Listed here so they don't get lost.

- **`features/contact-flow.md`** — if/when `mailto:` is augmented or replaced (scheduling link, intro questionnaire, contact form). Not needed for launch; the brand competes by being a person.
- **`features/site-shell-nav.md`** — only if the `SiteShell`'s consumption pattern (nav contents, social links in footer, current-route highlighting) becomes complex enough to need its own spec. For now, covered in `pages/home.md` and `flows/visitor-to-conversation.md`.
- **`features/seo-meta.md`** — per-page `<title>`, `<meta description>`, OG image, JSON-LD definitions consolidated. For launch, each page spec covers its own meta in acceptance criteria (sections 8). Promote to a feature spec if the engineer asks for it.
- **`flows/post-launch-iteration.md`** — once analytics arrive, the rules for revising the funnel based on measured behavior. Defer until there's at least one quarter of inbound data.
- **`flows/referrer-loop.md`** — how a referrer (past client, friend, investor) sends an intro to a prospect. Currently covered implicitly via deep-link anchors (`/roles#automator`, `/principles#integrity`). Promote to a spec if the referral motion becomes a primary growth channel.
- **`pages/case-studies.md`** — premature; pouk.ai is too early. Re-open when there's a real case to show *and* founder approval per masterplan section 7.3.
- **Brand-asset readiness spec** — `og.png`, `apple-touch-icon.png`, favicon, robots.txt, sitemap.xml — currently tracked in the parent `meta/backlog.md` as launch blockers, not here. If they slip, lift to a launch-cutover spec.

---

## Spec lifecycle hygiene

- A spec is **Draft** the moment it's authored.
- A spec moves to **In review** when Arian has eyes on it, regardless of how many open questions remain.
- A spec reaches **Approved** only when every dependency in its section 9 is resolved and Arian has set the status field manually.
- A spec is **Built** when the engineer has shipped it to a Vercel preview and the acceptance-criteria checklist is fully green.
- A spec is **Live** when the canonical domain `pouk.ai` serves it.

This file is updated by the PM whenever a new spec is authored or a status field changes. The engineer reads it as the table of contents for `meta/specs/`.
