---
title: "Ship llms.txt + llms-full.txt and enforce updates via changesets"
target_repo: poukai-inc/poukai-ui
suggested_resolution: minor
status: resolved
ds_issue: https://github.com/poukai-inc/poukai-ui/issues/29
target_version: 0.4.0
created: 2026-05-15
resolved: 2026-05-15
notes_on_resolution: |
  Shipped in @poukai-inc/ui@0.4.0. DS chose a single-file approach
  (just `llms.txt`, 30KB) rather than the split `llms.txt` + `llms-full.txt`
  the proposal asked for. Cleaner outcome — the file IS the content, no
  redundant index layer. Structure went further than I proposed:
  components grouped by atomic layer, design tokens documented,
  brand assets listed, AND a series of architecture decision records
  (Context / Decision / Consequences) for each major DS choice. The
  ADR-per-decision pattern is stronger than the flat anti-patterns
  list I'd sketched. Consumer-side adapted:
    - All llms-full.txt references renamed to llms.txt across
      .github/workflows/ds-bump.yml, .claude/agents/pouk-ai-engineer.md,
      meta/workflow.md, meta/ds-snapshot/README.md.
    - First snapshot captured at meta/ds-snapshot/llms.txt.
    - Future bumps will diff against it via the bump-PR workflow.
  CI gate (ask 3 — DS PRs touching components/tokens must update
  llms.txt) was implemented by DS as part of the same release; verify
  on the next DS PR that changes a component.
---

# Ship llms-* context files and enforce updates via changesets

You've already signalled that the next DS release introduces an `llms.txt` for consumers. This proposal shapes the contract around it so it's useful to both sides of the loop, not just an export.

## Why this matters

`llms.txt` is read by **two** Claude Code sessions, not one:

1. **Consumer side** (`poukai-inc/pouk.ai`) — reads it before authoring any DS-touching code. Stops me from picking the wrong token, wrong component, wrong height.
2. **Producer side** (`poukai-inc/poukai-ui`) — reads it when implementing a feature/fix to know what invariants not to violate, **and updates it when the PR introduces a new invariant**.

Same artifact, two audiences. Same file. Lives in the DS repo. Shipped to consumers via the package. The strong version of this: the DS becomes self-documenting — every brand decision is captured in one place, and every PR that changes brand behavior updates that place.

## Three asks

### Ask 1 — Ship two files, not one

The standard `llms.txt` convention splits into:

- **`llms.txt`** — short, structured **index**. Links to the deeper resources (`llms-full.txt`, design tokens reference, component recipes). Per Jeremy Howard's original spec.
- **`llms-full.txt`** — the actual rules, anti-patterns, decision provenance, brand voice samples.

Most consumer agents (me included) want `llms-full.txt`. The short `llms.txt` is useful at the project URL for general crawlers / lightweight clients.

Suggested content structure for `llms-full.txt`:

```
# @poukai-inc/ui — design system rules for LLM consumers

## Token semantics
For each token: name, value range, what it *means* (not just what it is).
Example: --accent is the single brand color used for status-affirmative and
focus rings. It is NEVER used as a surface fill or text body color.

## Component recommended usages
For each component: when to use it, when not to use it, common compositions.
Example: Wordmark — use as the brand anchor in SiteShell or page hero. NEVER
render below 40px height. NEVER pair with body text on the same baseline.

## Anti-patterns
Explicit "do not do this" list, with reasons.
Example: Do not override Wordmark colors via `style=` — the geometry is
brand-locked and inherits `currentColor`. To recolor, change `color` on a
parent element.

## Brand voice
Voice constraints for prose adjacent to components — eyebrows, status text,
button labels, error states. Examples of in-voice and out-of-voice.

## Decision provenance
For each major design decision (component shape, token value), the
proposal/issue that introduced it. Lets future agents argue from rationale,
not just current state.
```

Maintain `llms-full.txt` as the single authoritative source. `llms.txt` is auto-generated from it (or a hand-maintained pointer file, whichever you prefer).

### Ask 2 — Expose via package.json exports

```json
{
  "exports": {
    ...
    "./llms.txt": "./dist/llms.txt",
    "./llms-full.txt": "./dist/llms-full.txt"
  }
}
```

That lets a consumer Node.js context (CI, dev script) resolve the file path via standard Node ESM resolution. Without the export, the file is unreachable from `import.meta.resolve` and consumers fall back to brittle relative paths.

For Claude Code's actual consumption, the simpler path is just:

```bash
cat node_modules/@poukai-inc/ui/dist/llms-full.txt
```

— deterministic, version-locked, no network. Works regardless of the export field. But shipping the export makes the file discoverable.

### Ask 3 — CI gate: changesets that touch components/tokens require an `llms-full.txt` update

Add a check to the DS repo's release CI (or as a pre-commit / PR check):

> If a PR modifies files under `src/atoms/`, `src/molecules/`, `src/organisms/`, or `src/tokens/`, AND the PR includes a changeset of level `minor` or `major`, AND the diff does not include `llms-full.txt` — fail the check with a message linking to this proposal.

Patch-level changesets (bug fixes that don't change behavior) can skip the requirement. The check exists to catch behavior or API changes that don't update the brand's living rules.

Implementation sketch: a small Action step that runs `git diff main -- 'src/atoms/' 'src/molecules/' 'src/organisms/' 'src/tokens/'` and `git diff main -- llms-full.txt`, with a paths check. The DS engineer can decide the exact mechanic.

## Validation

After landing the release:

1. `node_modules/@poukai-inc/ui/dist/llms-full.txt` exists and is readable.
2. Consumer `.github/workflows/ds-bump.yml` (already in this site repo, will be updated alongside this proposal) reads it, diffs against the prior snapshot, and surfaces the diff in the bump PR body.
3. A DS PR that adds a new atom without updating `llms-full.txt` fails the new check.
4. A DS PR with a patch-level changeset that only fixes a typo does **not** require an `llms-full.txt` update.

## Out of scope

- **MCP server**. Discussed and explicitly deferred. The static file closes most of the gap; MCP is a follow-on once we see real validation gaps that a query interface would close. Don't build it as part of this release.
- **Auto-generation from source**. If you want `llms-full.txt` to be partially generated (e.g., the token list pulled from `tokens.css`), that's fine — but the brand-voice and anti-pattern sections must stay hand-authored.
- **Cross-cutting brand decisions outside the DS** (e.g., site-side copy voice). The DS owns brand-as-it-relates-to-components. Site-level prose lives in the consumer's PM specs.

## Release shape

- **Minor bump**: this adds new public exports (`./llms.txt`, `./llms-full.txt`) — that's a minor change per SemVer.
- Suggested changeset summary: _"Ship `llms.txt` + `llms-full.txt` as package exports — the design system's living rules for LLM consumers. Adds CI gate requiring `llms-full.txt` updates on component/token changes."_
- After publish CI runs and emits `repository_dispatch`, the consumer's `ds-bump.yml` opens the bump PR with a diff of the new content vs prior snapshot in the body.
