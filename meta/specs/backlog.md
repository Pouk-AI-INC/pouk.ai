# Spec Backlog

This directory holds product specs authored by `pouk-ai-pm` for the pouk.ai marketing site: `pages/` for routes, `features/` for cross-page capabilities, `content/` for JSON data schemas, and `flows/` for visitor journeys.

This file is the running, prioritized list of every spec authored under `meta/specs/`. Distinct from the parent `meta/backlog.md`, which tracks launch blockers, DNS, and approved verbatim copy — **this file tracks specs only**: what's drafted, what's approved, what's blocked, what's next. The agent updates it whenever a spec is added, moved in priority, or moves through `Draft → In review → Approved → Built → Live`.

> **2026-05-13 — Decisions D-01 through D-13 resolved.** All spec-side decisions tracked in `meta/decisions/launch-readiness.md` were closed on 2026-05-13. Every spec listed below has had its `Status` field flipped from `Draft` to `Approved`. The remaining dependencies are now framed as **Dependencies blocking `Built`**, primarily DS molecule availability in `@poukai/ui@0.1.0` and a handful of Arian-owned final copy lifts. See each spec's "Decisions log" line for the IDs that touched it.

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

1. **`pages/why-ai.md`** — `Approved`
   - Why this priority: Top-of-funnel thesis page. The biggest content lift; the page that frames why anyone hires pouk.ai. Per the funnel order (Why AI → Roles → Principles → contact) this is the most leveraged page to ship first.
   - Decisions applied: D-01 (citation style), D-02 (sticky desktop TOC), D-03 (dataset-vintage footer), D-04 (discovery-questions callout), D-05 (stats extraction).
   - Dependencies blocking `Built`: DS `FailureMode` molecule + `Stat` atom shipped in `@poukai/ui@0.1.0`; `content/failure-modes.json.md` spec also `Approved` (same content lifecycle — now satisfied); Arian-owned rewrite of the 500%/61% sentences post-extraction; final copy on end CTA.

2. **`pages/roles.md`** — `Approved`
   - Why this priority: Self-identification page. Once a prospect agrees with `/why-ai`, they need to match their problem to a service shape. Single page with anchor links recommended (`#builder`, `#automator`, etc.) over four sub-routes — defended in the spec.
   - Decisions applied: D-06 (Lucide picks: hammer / workflow / graduation-cap / clapperboard), D-07 (eyebrow "The <Role>"; title bare role name), D-08 (universal end CTA only).
   - Dependencies blocking `Built`: DS `RoleCard` molecule shipped (with no required CTA slot); `content/roles.json.md` spec also `Approved` — now satisfied; verbatim copy lift from `meta/backlog.md`.

3. **`pages/principles.md`** — `Approved`
   - Why this priority: Trust closer. Once a prospect has self-identified, they triangulate whether pouk.ai is the operator they want in the room. Single long-scroll page with anchor IDs recommended over per-principle routes — defended in the spec.
   - Decisions applied: D-09 (page heading "Principles"), D-10 (Instrument Serif italic bookends; sans for the ten principles).
   - Dependencies blocking `Built`: DS `Principle` molecule shipped; bookend typography mapping accessible from site CSS; `content/principles.json.md` spec also `Approved` — now satisfied; verbatim copy lift from `meta/backlog.md`.

4. **`pages/home.md`** — `Approved`
   - Why this priority: The post-cutover homepage. Defines the doorway behavior — preserves the holding page's restraint while adding the `/why-ai` lede hand-off. Ships last because it depends on the other three pages existing for its links to mean anything.
   - Decisions applied: D-11 (integrated lede-extension link sentence), D-12 (status-line copy verbatim from current `index.html` at cutover).
   - Dependencies blocking `Built`: DS `Hero` molecule + `SiteShell` organism shipped; `SiteShell` current-route handling on `/`; visual-parity gate per masterplan section 6.1 (screenshot diff vs. current `index.html`, including byte-identical status-line text); brand assets (`og.png`, `apple-touch-icon.png`, favicon, robots.txt, sitemap.xml).

### Content data specs

5. **`content/roles.json.md`** — `Approved`
   - Why this priority: Required for `pages/roles.md` to ship. Schema is small and stable.
   - Decisions applied: D-06 (`icon` allowed values locked to four kebab-case Lucide identifiers), D-07 (`eyebrow` shape locked to "The <Role>"; `title` is the bare role name), D-08 (no `cta` field permitted).
   - Dependencies blocking `Built`: DS `RoleCard.icon` slot resolution pattern confirmed with engineer; verbatim copy lift from `meta/backlog.md`.

6. **`content/principles.json.md`** — `Approved`
   - Why this priority: Required for `pages/principles.md` to ship. Schema includes the editorial bookends as top-level fields alongside the principles array — opinionated call defended in the spec.
   - Decisions applied: D-09 / D-10 confirm `intro` and `conclusion` as top-level fields and the `numeral` field for the ten principles — schema unchanged.
   - Dependencies blocking `Built`: DS `Principle` molecule shipped; verbatim copy lift from `meta/backlog.md`.

7. **`content/failure-modes.json.md`** — `Approved`
   - Why this priority: Required for `pages/why-ai.md` to ship. Schema includes a per-failure-mode `stats` array (default `[]`) so the 500% and 61% figures render as `Stat` atoms rather than inline bold — opinionated call defended in the spec.
   - Decisions applied: D-05 (typed `stats` array locked; 500% extracted from Failure Mode 2 body, 61% extracted from Failure Mode 5 body).
   - Dependencies blocking `Built`: DS `FailureMode` molecule + `Stat` atom shipped; Arian-approved rewrite of the body sentences from which 500% and 61% were extracted; Arian-picked canonical attribution strings for `stats[].source`.

### Flow specs

8. **`flows/visitor-to-conversation.md`** — `Approved`
   - Why this priority: Connective tissue across the four page specs. Locks the nav order (Why AI → Roles → Principles), the inter-page hand-offs, and the conversion definition. Without it, each page spec is independently sensible but the funnel is theoretical.
   - Decisions applied: D-13 (nav order: Why AI · Roles · Principles, with cascade to sitemap and footer).
   - Dependencies blocking `Built`: DS `SiteShell` shipped; engineer wires sitemap and footer ordering consistent with nav.

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
