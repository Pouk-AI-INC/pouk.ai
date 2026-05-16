---
name: review-page
description: Audit a live page on the pouk.ai site against its approved spec, content draft, and composition recipe by fanning out four specialist agents (pouk-ai-pm, pouk-ai-content, pouk-ai-designer, pouk-ai-reviewer) in parallel against a dev-server render, then merge their findings into prioritized tasks appended to meta/backlog.md. Use when Arian says "review the page", "audit /<slug>", "find issues on home", "what's wrong with /roles", or any request to evaluate a rendered page against its governing artifacts. Takes a slug argument (e.g., `home`, `roles`, `principles`, `why-ai`). Does NOT write code, does NOT edit content JSON, does NOT touch DS source. Outputs a single backlog section sorted P0→P2.
---

# /review-page <slug>

A four-lane parallel audit of a rendered page against its three governing artifacts, plus the engineering quality bar. Findings land in `meta/backlog.md` as a prioritized task section.

## Boundary

- This skill **orchestrates** — it does not author code, copy, specs, or compositions. Every finding belongs to one of the four agents; the orchestrator only merges and sorts.
- The skill **never modifies** `src/`, `meta/specs/`, `meta/content/drafts/`, `meta/compositions/`, or `meta/standards/`. The only write target is `meta/backlog.md`.
- The skill **never fixes** what it finds. Fixes are downstream — engineer picks up backlog tasks, definers revise their artifacts.

## Inputs

One arg: `slug`. Normalizes as follows:

| slug | route | spec | content draft | composition |
|---|---|---|---|---|
| `home` or `index` | `/` | `meta/specs/pages/home.md` | `meta/content/drafts/pages/home.md` | `meta/compositions/pages/home.md` |
| `roles` | `/roles` | `meta/specs/pages/roles.md` | `meta/content/drafts/pages/roles.md` | `meta/compositions/pages/roles.md` |
| `principles` | `/principles` | … | … | … |
| `why-ai` | `/why-ai` | … | … | … |

If the slug isn't one of the four canonical routes and isn't otherwise present in `meta/specs/pages/`, stop and ask Arian.

## Execution order

### 1. Preflight — verify artifacts

Read the three artifact paths for the slug. For each, note:
- Exists or missing
- `Status:` field value (`Draft` / `In review` / `Approved` / `Built` / `Live`)

Surface a one-line preflight summary to Arian before fanning out:

```
Preflight for /<slug>:
- spec: Approved (meta/specs/pages/<slug>.md)
- content draft: missing
- composition: In review (meta/compositions/pages/<slug>.md)
```

**Do not block on missing/unapproved artifacts.** The corresponding agent will surface the gap as a P0 finding (`Cannot audit copy parity — no Approved draft on file`). That is itself a useful task to land in the backlog.

### 2. Start the dev server

Run in background:

```
pnpm dev
```

Default port is `4321`. Confirm the server is reachable at `http://localhost:4321` before opening the page. If `4321` is busy, Astro picks the next port — capture it from the dev-server output.

If `pnpm dev` fails, stop and surface the error to Arian. Don't run the audit against a stale build.

### 3. Open the page in Chrome MCP and capture the snapshot

Use `mcp__Claude_in_Chrome__navigate` to open `http://localhost:4321/<route>`. Then capture the snapshot — every field below is **required** in the brief handed to all four agents. Missing fields cause systematic false positives (e.g., missing-anchor findings when `get_page_text` strips link info — see PF3 in `meta/backlog.md`).

Required snapshot fields, captured via `mcp__Claude_in_Chrome__browser_batch`:

1. **Rendered text** — `mcp__Claude_in_Chrome__get_page_text`. Lossy for links and structure; use only for prose-level checks.
2. **Interactive elements** — `mcp__Claude_in_Chrome__read_page` with `filter: "interactive"`. Mandatory so the PM and Designer lanes see every anchor's `href`, every button, every form control.
3. **Link inventory** — `mcp__Claude_in_Chrome__javascript_tool` running `Array.from(document.querySelectorAll('a')).map(a => ({text: a.innerText.trim(), href: a.getAttribute('href')}))`. Belt-and-braces against tool quirks in `read_page`.
4. **Console messages** — `mcp__Claude_in_Chrome__read_console_messages` with `pattern: ".*"`, `limit: 50`.
5. **Document meta** — `javascript_tool` dump of `{title, metaDesc, ogTitle, ogDesc, ogImage, twitterCard, canonical, h1Count, h1Texts, headings (h1..h4), jsonLd, landmarks (header/main/nav/footer presence), htmlLang, viewport, charset, totalNodes}`. The `canonical` field is required by spec §8.
6. **Computed-style spot-checks (Designer lane)** — `javascript_tool` running `getComputedStyle()` on key elements (Hero status badge, H1, lede, CTA) and reporting the resolved `--space-*`, `--dur-*`, `--easing*`, `--bg-*` token values. Belts the PF2 gap (Designer agent can't run Chrome MCP itself).

If `claude-in-chrome` isn't connected, ask Arian to install the extension rather than falling back to source-only review — the skill's value depends on auditing the rendered page.

### 4. Fan out four agents in parallel

Send all four `Agent` invocations in a single message. Each agent gets:

- The slug + route + localhost URL
- **Only their own artifact path** (don't cross-brief — each agent should review through their own lens)
- The initial Chrome snapshot text + console log
- Authorization to use `mcp__Claude_in_Chrome__*` tools to inspect further (open sub-pages, click links, screenshot, check network) and `Bash` for `pnpm build` / `lighthouse` / `axe` where relevant (reviewer only)
- The **required output schema** in section 5 below
- The instruction: *return findings, not fixes*

Per-agent briefs:

#### Lane A — `pouk-ai-pm` (spec parity)

> Review the rendered page at `<localhost URL>` against `meta/specs/pages/<slug>.md`. For each acceptance criterion in spec §8 and each success criterion in spec §3, check whether the live page satisfies it. For each content-requirement outcome in spec §5, check whether the rendered copy delivers it. Surface every gap as a finding. Also surface any acceptance criterion that is unverifiable or missing from the spec — that is a finding against the spec itself (Owner: pm).

#### Lane B — `pouk-ai-content` (copy fidelity + voice)

> Review the shipped copy at `<localhost URL>` against `meta/content/drafts/pages/<slug>.md`. Check (a) substantive drift between the Approved draft and the rendered copy (minor Arian-edited tweaks are fine; rewrites without a draft revision are findings), (b) voice violations against the brand rulebook in your agent definition §4 (banned filler, marketing-speak, casing, punctuation), (c) page-level SEO copy: `<title>` ≤60 chars, meta description ≤155, OG fields populated, heading hierarchy intact, exactly one H1. Surface every gap. If no `Approved` draft exists, the top finding is "no canonical draft — recommend draft authoring before further copy review."

#### Lane C — `pouk-ai-designer` (composition parity)

> Review the rendered page at `<localhost URL>` against `meta/compositions/pages/<slug>.md`. Check (a) DS primitives match composition §2 (no improvised substitutions, no missing primitives), (b) section order matches, (c) spacing tokens between sections match composition §2/§3, (d) icon picks match composition §5, (e) motion specs match composition §4 and respect `prefers-reduced-motion`. Use Chrome MCP to inspect actual rendered DOM (`mcp__Claude_in_Chrome__read_page`) and computed styles (`mcp__Claude_in_Chrome__javascript_tool`) where needed. If no `Approved` composition exists, the top finding is "no composition on file — recommend designer authoring before further visual review."

#### Lane D — `pouk-ai-reviewer` (quality bar)

> Audit `<localhost URL>` against `meta/standards/` and the universal quality checks in your agent definition §5. Run, where tooling permits: `pnpm build` (must be green), Lighthouse mobile (target 100/100/100/100), axe (target 0 violations). Check JSON-LD present where spec calls for it, OG/Twitter meta complete, semantic landmarks, heading hierarchy, image weights, zero-JS discipline (no `client:*` without justification), DS-token-only styling, no console errors, no broken links. If a metric can't be verified locally, mark it `NOT VERIFIED` rather than guessing.

### 5. Required output schema (each agent)

Every agent returns a flat list. One finding per bullet. No prose around it.

```
- [P0|P1|P2] <Title — short imperative>
  - Source: pouk-ai-{pm,content,designer,reviewer}
  - Where: <route or file:line or section reference>
  - Why: <1-2 sentence rationale citing the governing artifact + section, e.g. "spec §8 AC3 requires CTA target hello@pouk.ai; rendered CTA targets /contact">
  - Owner: engineer | content | designer | pm | reviewer
  - Effort: S | M | L
```

Priority rubric (agents apply this themselves):
- **P0** — visitor-visible regression, hard-gate failure (Lighthouse <100, axe violation, broken AC, copy that violates brand voice rulebook §4.4, composition primitive missing or substituted), or "cannot audit — artifact missing"
- **P1** — drift that doesn't break the page but compounds (minor copy divergence without draft revision, NIT-level a11y, spacing off by one token, OG description missing)
- **P2** — polish (verb sharpenings, icon-pick second-guesses, micro-perf, NIT-level naming)

### 6. Merge

Collect the four lists. Then:

1. **Dedupe** — when two agents surface the same underlying issue (e.g., PM says "hero copy doesn't satisfy outcome A" and Content says "hero copy drifted from draft"), merge into one finding and credit both in the `Source:` line.
2. **Sort** — by Priority (P0 → P1 → P2), then by Effort (S → M → L) within priority.
3. **Renumber** — assign `R<NN>` IDs in sorted order so the backlog section is referenceable later.

### 7. Append to backlog

Append a new section to `meta/backlog.md` at the bottom:

```markdown
## Review: /<route> (YYYY-MM-DD)

Generated by `/review-page <slug>`. Preflight: spec=<status>, draft=<status>, composition=<status>.

### P0

- [ ] **R01 — <Title>** (Owner: engineer · Effort: S)
  - Source: pouk-ai-pm, pouk-ai-content
  - Where: src/pages/<slug>.astro:12 (rendered) ↔ meta/specs/pages/<slug>.md §8 AC3
  - Why: <rationale>

### P1
…

### P2
…

### Preflight findings (artifacts missing/unapproved)

- [ ] **PF1 — <Title>** (Owner: <pm|content|designer>) — <one-line reason>
```

`Preflight findings` is the bucket for "no draft on file" / "composition not approved" / "spec missing acceptance criterion N" — they aren't visitor-facing bugs but they block subsequent reviews.

If the page is clean (zero findings across all four lanes), still append the section with `## Review: /<route> (YYYY-MM-DD)\n\nClean. No findings.` so the backlog has a record of the audit.

### 8. Cleanup

Kill the background `pnpm dev` process. Close the Chrome MCP tab if one was opened.

### 9. Report back to Arian

One short summary message:

```
/review-page /<route> — N findings (P0: x, P1: y, P2: z). Appended to meta/backlog.md as "Review: /<route> (<date>)". Top blockers:
- R01 — <title>
- R02 — <title>
```

That's it. No prose around it.

## Preconditions (run before preflight)

These are environment checks the orchestrator must verify before any preflight. A failure on any of these is a hard stop, not a finding.

1. **Worktree is in the parent `pnpm-workspace.yaml`.** If `pnpm-workspace.yaml` (one level above `poukai/`) lists a different worktree path, `pnpm install` will silently no-op and `node_modules/.bin/astro` will be absent. Fix: edit the workspace file to point at this worktree, then `pnpm install`.
2. **`node_modules/.bin/astro` exists.** If absent, run `pnpm install`. The install needs `NPM_TOKEN` in env (sourced from `/Users/arianzargaran/Desktop/poukai org/poukai/.env`) to fetch `@poukai-inc/ui` from GitHub Packages. Symptom of a missing token: `.npmrc` `WARN  Failed to replace env in config: ${NPM_TOKEN}`.
3. **All four target agents are in the Agent-tool registry this session.** The registry loads at session start; agent files added by a mid-session `git pull` are NOT visible until the next session. Check by inspecting the Agent tool's "Available agents" list. If `pouk-ai-content` (or any of the four) is missing, see Fallbacks below.
4. **Chrome MCP is connected.** Call `mcp__Claude_in_Chrome__list_connected_browsers` — must return at least one entry. If empty, ask Arian to launch a Chrome browser with the extension. Don't degrade to source-only review.

## Fallbacks (when a precondition can't be met)

- **An agent isn't in the registry.** Two options, in order of preference:
  1. Ask Arian to restart the Claude Code session (cleanest — registry rehydrates from disk).
  2. Run that single lane inline as the orchestrator, citing the agent definition's brand-voice / standards rules by section. Mark the finding's `Source:` as `<agent-name> (orchestrator-inline)` so the backlog record is honest. This is acceptable for the **audit** pass; it is NOT acceptable for an **authoring** pass (e.g., do not orchestrator-write a content draft — that violates the pipeline contract).
- **Chrome MCP not inherited by sub-agents.** Specialist agents see only the tools their `tools:` frontmatter lists; deferred MCP namespaces don't cross the boundary. Compensate by pre-capturing in the orchestrator and including in each brief: rendered text, console messages, meta-tag dump, JSON-LD, landmarks summary, computed-style spot-checks for the Designer lane (gather via `mcp__Claude_in_Chrome__javascript_tool` with `getComputedStyle(...)` calls before fan-out). Long-term fix: amend the affected agent's frontmatter `tools:` list to include `mcp__Claude_in_Chrome__*` and ask Arian to commit.

## Failure modes

- **Dev server fails to start after preconditions pass.** Surface the error excerpt from the dev-server output file, stop. Don't audit a stale build.
- **An agent times out or returns malformed output.** Re-run that single lane once. If it fails again, log the lane as `incomplete` in the backlog section and surface to Arian.
- **Slug doesn't match any spec.** Stop and ask Arian; don't invent a route.
- **All four lanes return zero findings on a page Arian considers broken.** That itself is a finding — the audit was insufficient. Note in the report and recommend revising one of the agent briefs.

## What this skill is not

- Not a fixer. Findings → backlog → engineer's lane.
- Not a gate. The engineer's pre-merge review still runs `pouk-ai-reviewer` separately against the diff. This skill is post-ship / mid-life-cycle.
- Not a substitute for content/designer/PM revising their own artifacts. When the skill surfaces "draft missing" or "composition incomplete," the remedy is upstream.
- Not for arbitrary URLs. The four canonical routes only, unless Arian explicitly extends.
