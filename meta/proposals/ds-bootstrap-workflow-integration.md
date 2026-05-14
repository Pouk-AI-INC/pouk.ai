---
title: "Install producer-side workflows for the cross-repo proposal loop"
target_repo: poukai-inc/poukai-ui
suggested_resolution: n/a
status: issue-opened
ds_issue: https://github.com/poukai-inc/poukai-ui/issues/11
target_version:
created: 2026-05-14
resolved:
---

# Bootstrap proposal: install producer-side workflows

This proposal is itself a meta-request: install the producer-side automation so the cross-repo proposal workflow stops requiring a human to ferry text between Claude Code sessions.

**This proposal does not change the `@poukai-inc/ui` package** — it adds repo-level CI workflows. No SemVer bump, no changeset, no release. Hence `suggested_resolution: n/a`.

## Context

The consumer side (`poukai-inc/pouk.ai`) just landed the following:

- A canonical workflow doc at [`meta/workflow.md`](https://github.com/poukai-inc/pouk.ai/blob/main/meta/workflow.md) defining the cross-repo proposal loop.
- A `.github/workflows/ds-bump.yml` listener that fires on `repository_dispatch` type `ds-package-published` and opens a draft PR bumping `@poukai-inc/ui` in `package.json` + regenerating the lockfile.
- A proposal frontmatter convention so requests are tracked from `drafted` → `issue-opened` → `in-progress` → `published` → `resolved`.
- One real proposal already live as `poukai-inc/poukai-ui#10` (Wordmark recommended usages), opened by the consumer agent via `gh issue create` with the proposal as body.

What's still missing is the producer side. Right now, every issue we open in the DS repo waits until a human opens a Claude Code session there and points it at the issue. The ask in this proposal is to wire two GitHub Actions so the loop runs without manual pickup.

## Three asks

### Ask 1 — Install Anthropic's Claude Code GitHub Action

Install the Claude Code GitHub Action / App on `poukai-inc/poukai-ui` per [Anthropic's docs](https://docs.anthropic.com/en/docs/claude-code/github-actions). Required for asks 2 and 3 to invoke Claude Code from CI.

Secrets needed on the repo (Settings → Secrets and variables → Actions):

- **`ANTHROPIC_API_KEY`** — for the Claude Code Action runtime.
- **`CONSUMER_DISPATCH_TOKEN`** — a Personal Access Token (or fine-grained token) with `Actions: write` permission on `poukai-inc/pouk.ai`. Used by ask 3 to emit `repository_dispatch` events into the consumer repo. The default `GITHUB_TOKEN` cannot dispatch to a different repo.

### Ask 2 — `.github/workflows/handle-proposal.yml`

Triggers when an issue is labeled `proposal:from-consumer`. Invokes a Claude Code session with the issue body as the prompt. The expectation: that session reads its own `.claude/agents/` definitions, treats the issue body (a verbatim consumer-authored proposal) as the brief, and opens a PR closing the issue.

Skeleton:

```yaml
name: Handle consumer proposal

on:
  issues:
    types: [labeled]

jobs:
  pickup:
    if: ${{ github.event.label.name == 'proposal:from-consumer' }}
    runs-on: ubuntu-latest
    permissions:
      contents: write
      issues: write
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
      - name: Acknowledge
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.createComment({
              ...context.repo,
              issue_number: context.issue.number,
              body: "Producer Claude Code session picked this up. Working on it.",
            })
      - name: Invoke Claude Code
        uses: anthropics/claude-code-action@beta  # confirm latest tag/version
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          # mode + prompt assembly is action-specific; consult docs for the
          # exact shape. The intent: treat issue.body as the brief, the
          # repo's .claude/agents/ as the operating constraints, and end
          # with `gh pr create --base main --head <branch> --body "Closes #<issue>"`
          # plus a changeset if the proposal's suggested_resolution is
          # patch/minor/major.
```

Two notes the producer engineer should figure out from Anthropic's docs:
- The exact action input shape (`prompt:`, `instructions:`, etc.) — the Action's surface evolves.
- Whether to scope the model (Sonnet vs. Opus) per the task. Most proposals are mechanical and Sonnet suffices.

### Ask 3 — Post-publish dispatch into the consumer

After every successful publish to `npm.pkg.github.com`, emit a `repository_dispatch` event of type `ds-package-published` with payload `{ version }` to `poukai-inc/pouk.ai`. That consumer-side workflow opens the bump PR.

Cleanest implementation: add a step to the existing release workflow (the one that calls `changesets/action@v1`), reading the action's `published` and `publishedPackages` outputs:

```yaml
# add to the existing release workflow, after the changesets/action step
- name: Dispatch to consumer
  if: steps.changesets.outputs.published == 'true'
  uses: peter-evans/repository-dispatch@v3
  with:
    token: ${{ secrets.CONSUMER_DISPATCH_TOKEN }}
    repository: poukai-inc/pouk.ai
    event-type: ds-package-published
    client-payload: |
      {
        "version": "${{ fromJson(steps.changesets.outputs.publishedPackages)[0].version }}"
      }
```

(`steps.changesets` is whatever the changesets action's step id is — adjust to match.)

Alternative: a separate `.github/workflows/post-publish.yml` that triggers on tag push (`push: tags: ['@poukai-inc/ui@*']`) and parses the version from the tag name. Cleaner separation, but parsing the scoped-package tag name takes more shell. Either works.

## Validation

After all three asks land:

1. Issue `poukai-inc/poukai-ui#10` (Wordmark recommended usages) was opened **before** the producer side is wired. It should be processed manually first — open a Claude Code session in the DS repo, point it at #10, ship `0.2.3`.
2. Open a second test proposal from the consumer side once the DS side is wired (e.g. a small typography tweak proposal). Confirm:
   - The Claude Code Action fires on label
   - A PR is opened that closes the issue
   - Changesets opens the Version Packages PR
   - Merging the Version Packages PR publishes `0.x.y`
   - The dispatch step fires; `peter-evans/repository-dispatch@v3` returns 204
   - The consumer's `.github/workflows/ds-bump.yml` runs and opens a draft bump PR within ~1 minute
3. Arian reviews the bump PR, merges, Vercel deploys. Loop closes.

## Out of scope

- Don't touch `poukai-inc/pouk.ai`.
- Don't replace the existing release workflow — just add the dispatch step.
- Don't auto-merge anything on either side. Both sides remain draft-PR-with-human-gate.
- Don't process other issues unless they carry `proposal:from-consumer`. Other issues remain human-driven.

## Release shape

- **No package release.** This is repo-infra only.
- **PR title (suggestion)**: `ci: install Claude Code action + cross-repo proposal workflows`.
- **PR description should reference**: this proposal file URL in the consumer repo, the workflow doc URL ([`meta/workflow.md`](https://github.com/poukai-inc/pouk.ai/blob/main/meta/workflow.md)), and any docs page from Anthropic about the Claude Code Action.

## Notes

- If the Claude Code Action requires additional setup (a Claude installation account, billing config, etc.) beyond `ANTHROPIC_API_KEY`, flag back via a comment on the consumer issue. We'll author a follow-up proposal with the actual prerequisites.
- Once installed, the same Action can be used to auto-review consumer-opened proposals before they trigger asks 2 — but that's a future iteration; for now, all proposals open as actionable issues, no review gate.
