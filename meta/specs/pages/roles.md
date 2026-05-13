# Spec: Roles

**Route**: `/roles`
**Status**: Draft
**Owner**: Arian (founder) · Author: pouk-ai-pm
**Last updated**: 2026-05-13
**Masterplan reference**: Sections 2A (decision authority — Lucide picks are site-owned), 4.1 (content layout), 4.4 (long-form content as data)

---

## 1. Purpose

`/roles` is the self-identification page. A prospect who has agreed there's a deployment gap (via `/why-ai`) needs to know which *shape* of help pouk.ai provides for *their* situation. The page presents four archetypes — Builder, Automator, Educator, Creator — each pinned to a hiring trigger so a reader can match themselves in under thirty seconds. The conversion event is the reader recognizing themselves in one role and emailing in with the role name as a reference point.

## 2. Audience

- **Primary**: A prospect mid-funnel who has arrived from `/why-ai` or directly via a referral that mentioned a specific kind of need ("I think you need pouk.ai's Automator work"). They are looking to match their problem to a service shape so they can write a coherent first email.
- **Secondary**: A returning visitor (a referrer, a past prospect) checking whether pouk.ai still offers a specific service shape before making an intro. They need anchors they can deep-link to.

## 3. Success criteria

- **Behavior**: The visitor reads a role's eyebrow + title + body + "Hired by" line, recognizes their own situation in the "Hired by" descriptor, and emails `hello@pouk.ai` referencing the role by name (or copies the deep-link anchor URL into a DM/intro email).
- **Signal**: Qualitatively — inbound emails open with "I'm reaching out about [Builder | Automator | Educator | Creator]" or "your roles page made it obvious which kind of help we need." Referrers send deep-links to specific role anchors. When analytics arrive, scroll depth and anchor-click telemetry confirm which roles draw the most inbound.
- **Failure mode**: The reader cannot pick a role for themselves — either because the roles blur into one another, because the "Hired by" descriptors are too vague to recognize, or because the visual hierarchy makes the page read as a marketing menu rather than a self-diagnostic. Two roles fitting equally well is also a failure: each archetype must claim a distinct hiring trigger.

## 4. Information architecture

**Opinionated call: one page, four `RoleCard`s, with anchor IDs (`#builder`, `#automator`, `#educator`, `#creator`). Not four routes.** Defended in one paragraph: the four roles are read together — the page's job is to let a reader compare and choose. Four routes split the comparison surface and triple the maintenance cost (four `<title>`s, four meta descriptions, four chances for the nav to misrepresent the canonical page). Anchor links give us the linkability of routes without the fragmentation. If, post-launch, one role grows substantially deeper content (case studies, sub-services), we promote that role to a sub-route then. For launch, one page.

1. `SiteShell` — top nav (Roles marked current) + hairline footer.
2. `Hero` — eyebrow ("Roles"), title, lede that frames the four roles as four shapes of help pouk.ai delivers.
3. **Role index (optional, recommended)** — a one-line jump nav listing the four roles, each linking to its anchor. Sits below the hero. Purely typographic, no DS molecule needed.
4. `RoleCard` — Builder. Icon (Lucide pick — recommendation: `Hammer` or `Wrench`, Arian's call), eyebrow ("01" or "The Builder" — see open question), title ("Builder"), body, hired-by. Anchor `#builder`.
5. `RoleCard` — Automator. Icon (Lucide pick — recommendation: `Workflow` or `Cog`, Arian's call). Anchor `#automator`.
6. `RoleCard` — Educator. Icon (Lucide pick — recommendation: `GraduationCap` or `BookOpen`, Arian's call). Anchor `#educator`.
7. `RoleCard` — Creator. Icon (Lucide pick — recommendation: `Camera` or `Sparkles`, Arian's call). Anchor `#creator`.
8. **End CTA** — single sentence framing the universal contact path. The role is the *opening line* of the email; the email address is the same.

## 5. Content requirements

The substance lives verbatim in `meta/backlog.md` under the "Roles page" block. Engineer reads copy from there into `src/content/roles.json` per the content data spec at `meta/specs/content/roles.json.md`.

Outcomes the copy must hit:

- Each role's **body must read as a specific service shape**, not a job title or a personality. A reader should understand within two sentences what pouk.ai actually *delivers* in that mode.
- Each role's **"Hired by" line must be a precise hiring trigger** — a person in a particular situation. "Founders needing prototypes" is right; "Companies looking to innovate with AI" is wrong. The verbatim copy from the founder already satisfies this; preserve the specificity.
- The four roles must read as **mutually distinguishable** — Builder ≠ Automator ≠ Educator ≠ Creator on the dimensions of (a) what gets delivered and (b) who hires. If two cards' "Hired by" lines could fit the same person, the copy is wrong.
- The hero lede must communicate (a) pouk.ai delivers four shapes of help, (b) pouk.ai operates across them depending on the engagement, (c) the goal of this page is for the reader to recognize themselves. No marketing-speak filler.
- The end CTA must not over-engineer the contact step. The brand competes by being a person. A single line + email is enough.

`Draft:` Hero lede direction: "We work in four shapes. Builder, Automator, Educator, Creator. Which one are you hiring?" Direction only — Arian writes the final.

The icons (Lucide picks) are a **site decision per masterplan section 2A**, not a DS decision. The recommendations in section 4 are starting points; Arian finalizes. Whichever glyphs are picked, they should read as tool/craft icons, not as people icons — the role names already do the personification work.

## 6. Content data shape

Roles are stored in `src/content/roles.json` per the schema at `meta/specs/content/roles.json.md`. The page template iterates the array and renders four `RoleCard`s in the order defined in JSON (Builder, Automator, Educator, Creator).

The icon field in JSON is a **Lucide glyph name string** (e.g., `"Hammer"`, `"Workflow"`). The page template resolves the string to a `lucide-react` component at build time. The DS does not re-export Lucide (per masterplan section 2A) — the site imports from `lucide-react` directly and passes the resolved component into the `RoleCard.icon` slot.

## 7. User flow

- **Entry**: From `/why-ai` end-of-page next-step link; from a referrer's DM that includes a deep-link anchor like `pouk.ai/roles#automator`; from the top nav.
- **Read path**: Hero → scan role index → click or scroll to the role that sounds closest → read its "Hired by" line — the decisive moment — → if the line matches, read the body → end CTA. A reader who hits the page without context (cold link) reads sequentially top-to-bottom and self-sorts.
- **Exit / conversion**: `mailto:hello@pouk.ai` from the end CTA, with the role name being the implicit subject line ("Reaching out about Builder work…"). A secondary exit is a return visit later via a deep-link anchor — that visit converts on a subsequent email.

## 8. Acceptance criteria

- [ ] Route renders at `/roles`.
- [ ] All sections in the IA (1–8) are present and ordered as specified.
- [ ] Four `RoleCard` molecules render in the order Builder, Automator, Educator, Creator.
- [ ] Each role has an anchor ID matching the slug derived from its `id` field — `#builder`, `#automator`, `#educator`, `#creator`.
- [ ] Each `RoleCard` receives icon, eyebrow, title, body, hiredBy props matching the JSON entry.
- [ ] Lucide icon imports are confined to the site repo (no DS re-export, per masterplan 2A).
- [ ] Role index jump nav (IA item 3) renders four links, each pointing to its corresponding anchor.
- [ ] End CTA renders an `<a href="mailto:hello@pouk.ai">` with copy framing the universal contact path.
- [ ] Top nav `SiteShell` highlights Roles as current.
- [ ] Page links to `/why-ai` and `/principles` via the global nav, and exposes `mailto:hello@pouk.ai` at least once in the end CTA.
- [ ] Deep-link anchor URLs (`/roles#builder`, etc.) scroll to the corresponding `RoleCard` and the card is visible above the fold post-scroll.
- [ ] Lighthouse mobile: 100/100/100/100.
- [ ] No client-side JS shipped.
- [ ] `<title>` and `<meta description>` reflect the four-archetypes framing.
- [ ] Spec section 5 outcomes are met by the shipped copy (Arian-verified).

## 9. Open questions / dependencies

- **DS dependency — `RoleCard` molecule.** Required and listed as in scope for DS Phase 1.2 (`@poukai/ui@0.1.0-alpha.1`). Confirm props match the schema (`icon` slot, `eyebrow`, `title`, `body`, `hiredBy`). Tracked in `meta/masterplan.md` section 3.2.
- **Lucide picks — Arian's call.** Recommendations above are starting points. The icons must read as tool/craft, not personification. Confirm by visual review against the four role bodies.
- **Eyebrow treatment — Arian's call.** Option A: numeric eyebrows ("01", "02", "03", "04"). Option B: "The Builder" / "The Automator" etc. Option C: a single role-defining verb ("Builds.", "Automates.", "Trains.", "Creates."). Recommendation: B, because the verbatim copy already uses "The Builder" as its heading. Pick one and apply consistently.
- **Per-role CTA — decision pending Arian.** Backlog flags whether each role gets its own CTA ("Book a Builder conversation"). Recommendation: no — one universal end CTA preserves brand restraint and avoids the "demo button" trap. The role name lives in the prospect's email opening line, not a button.
- **Hero illustration / imagery — masterplan section 7.3.** Illustrations are decided as the visual direction for the SaaS stage, but the masterplan defers per-page illustration choices to launch-day. Recommendation: ship `/roles` without per-role illustrations for launch — typography + Lucide icon is enough. Re-open if Arian wants visual depth.
- **Content lift — Arian-owned.** Verbatim copy in `meta/backlog.md` is approved as the source. Any edits to that copy are Arian's, not the engineer's.

## 10. Out of scope

- Per-role sub-routes (`/roles/builder`, etc.). Anchor-based for launch; promotion to sub-routes is a future call.
- Per-role pricing, packaging tiers, or "starts at $X" displays. The brand is "let me understand your problem first," not "pick a tier."
- Per-role case studies. Pouk.ai is too early; forcing them dilutes the page.
- A booking/scheduling integration per role. Universal `mailto:` only.
- Per-role illustrations or marketing imagery. Typography + Lucide icon for launch.
- Adding a fifth role. Four is fixed per the backlog. New roles require a backlog update and a re-spec.
