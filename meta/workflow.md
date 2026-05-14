# Cross-repo proposal workflow

How two Claude Code sessions in two repos collaborate without a human-in-the-loop forwarding step. **Authoritative spec; both repos point at this file.**

---

## The actors

| Side | Repo | Agents (in `.claude/agents/`) | Identity |
|---|---|---|---|
| **Consumer** | `poukai-inc/pouk.ai` (this repo) | `pouk-ai-pm`, `pouk-ai-engineer`, `pouk-ai-reviewer` | a Claude Code session |
| **Producer** | `poukai-inc/poukai-ui` (DS) | (their own agent set) | a Claude Code session |
| **Human** | n/a | Arian (founder) | sole approver of merges + deploys |

Both Claude Code sessions are the **same tool**, just in different repos with different agent definitions and different boundary rules (per masterplan section 2A: shape lives in DS, substance lives in consumer).

---

## The artifact chain

Every cross-repo request follows the same chain. Each step has a durable record.

```
1. meta/proposals/<slug>.md            ← consumer authors (this repo)
            │
            ▼
2. GitHub issue                         ← consumer opens (gh issue create on producer repo)
   labeled `proposal:from-consumer`
   body = verbatim copy of (1)
            │
            ▼
3. Producer PR                          ← producer Claude Code session opens
   "Closes #<issue>"
   includes a changeset
            │
            ▼
4. Version Packages PR                  ← changesets/action auto-opens on merge of (3)
            │
            ▼
5. publish CI                           ← runs on merge of (4) → tarball on npm.pkg.github.com
            │
            ▼
6. repository_dispatch event            ← producer's post-publish workflow emits
   type=ds-package-published
   payload={version, closed_issues}
            │
            ▼
7. Draft bump PR                        ← consumer's .github/workflows/ds-bump.yml opens
   in poukai-inc/pouk.ai
            │
            ▼
8. Human merges bump PR                 ← only human action in the chain
            │
            ▼
9. Vercel auto-deploys main
            │
            ▼
10. Consumer agent closes (1) locally   ← marks proposal "resolved in 0.x.y"
    + updates meta/backlog.md
```

Steps 2, 3, 4, 5, 6 happen on the producer side. Steps 7 and 10 happen on the consumer side. Step 8 is the only human gate.

---

## Proposal frontmatter

Every proposal in `meta/proposals/` carries this frontmatter so the workflow can track state mechanically:

```yaml
---
title: <short imperative title — becomes the issue title>
target_repo: poukai-inc/poukai-ui
suggested_resolution: patch | minor | major
status: drafted | issue-opened | in-progress | published | resolved | rejected
ds_issue: <URL once opened, otherwise empty>
target_version: <semver expected once published, otherwise empty>
created: YYYY-MM-DD
resolved: <YYYY-MM-DD once status=resolved, otherwise empty>
---
```

Status transitions:

- `drafted` → consumer authors the file but hasn't opened the issue yet (human review window)
- `issue-opened` → consumer agent ran `gh issue create`; `ds_issue` is populated
- `in-progress` → producer agent has opened a PR closing the issue
- `published` → publish CI shipped the version; `target_version` is populated
- `resolved` → consumer's bump PR merged and Vercel deployed; consumer agent marked the proposal closed
- `rejected` → producer declined or counter-proposed; needs human re-author

---

## Conventions

**Labels** (on producer issues):
- `proposal:from-consumer` — triggers the producer's issue-handler workflow
- `consumer:pouk.ai` — for filtering / dashboards when more consumers exist

**Issue title** = proposal frontmatter `title`. Keep it imperative and ≤ 80 chars.

**Issue body** = the proposal file content verbatim, **including the frontmatter**, so the producer side sees the full context — release shape, validation steps, out-of-scope notes — without flipping repos.

**PR description (producer side)** must include `Closes #<issue>` so the issue auto-closes on merge.

**Commit messages on bump PRs (consumer side)** must include `Refs <proposal-slug>` so we can trace which proposal a bump resolves.

---

## Tools

### Consumer side (this repo)

- **Opening an issue from a proposal** (manual until automated):
  ```
  gh issue create \
    --repo poukai-inc/poukai-ui \
    --title "<title from frontmatter>" \
    --label "proposal:from-consumer,consumer:pouk.ai" \
    --body-file meta/proposals/<slug>.md
  ```
  Then update the proposal's `ds_issue:` and flip `status:` to `issue-opened`.

- **Receiving a publish**: `.github/workflows/ds-bump.yml` listens for `repository_dispatch` type `ds-package-published`. Bumps `package.json`, regenerates `pnpm-lock.yaml` against the registry, runs `pnpm build`, opens a draft PR.

- **Closing a proposal**: when the bump PR merges, the consumer agent re-runs `pnpm build`, screenshots (or asks the user to spot-check), then edits the proposal's frontmatter (`status: resolved`, `target_version: 0.x.y`, `resolved: YYYY-MM-DD`).

### Producer side (DS repo) — to be installed by them

What the DS side needs to set up (subject of its own bootstrap proposal):

1. **Anthropic's Claude Code GitHub Action** installed on the repo.
2. `.github/workflows/handle-proposal.yml` — listens for `issues.labeled` where label is `proposal:from-consumer`, invokes Claude Code with the issue body, expects a PR back.
3. `.github/workflows/post-publish.yml` — runs after the changesets publish CI, emits `repository_dispatch` to the consumer.

The first DS issue we open under this flow can be the bootstrap request itself.

---

## Failure modes & mitigations

| Failure | Mitigation |
|---|---|
| Producer interprets the proposal rather than implementing it | Proposal is the canonical brief; PR description must restate which option (A/B) was chosen and why. Consumer review checks the diff against the proposal's validation steps. |
| Producer cuts the wrong SemVer level | Changesets requires explicit `patch/minor/major` in the changeset file. Consumer agent's `ds-bump.yml` doesn't auto-merge — human reviews and catches surprises. |
| Producer publishes without going through an issue | `ds-bump.yml` runs on every publish anyway and opens a draft PR. The proposal-tracking is for traceability, not gating. |
| Consumer opens an issue without authoring a local proposal | Wrong direction — proposals are the consumer's record. Author the proposal file first, then open the issue from it. |
| The two records drift (issue body diverges from proposal file) | The producer's issue body is a snapshot at open-time; the proposal file in the consumer repo is the living record. When they conflict, the file wins. Consumer agent re-syncs by commenting on the issue with a link to the new file revision. |
| `CONSUMER_DISPATCH_TOKEN` fine-grained PAT errors with `Resource not accessible by personal access token` | The endpoint `POST /repos/{owner}/{repo}/dispatches` requires fine-grained permission **Contents: Read and write** on the target consumer repo — not `Actions`. (Originally documented incorrectly in the bootstrap proposal; corrected here after the first round-trip failed at the dispatch step.) Regenerate the PAT with Contents permission, repaste into the DS repo's `CONSUMER_DISPATCH_TOKEN` secret. |
| Bump PR introduces a silent gzipped-weight regression | `ds-bump.yml` captures per-route raw + gzipped HTML sizes and embeds them in the PR body. Reviewer compares against the prior bump PR's table; routes >10% larger gzipped violate R-015 in `meta/standards/technical-requirements.md`. |

---

## Bootstrapping the first cycle

Until the producer side has its workflows installed, the loop runs with manual fallback:

1. Consumer agent authors `meta/proposals/<slug>.md` and opens the GitHub issue.
2. Arian opens a Claude Code session in `poukai-inc/poukai-ui` and pastes the issue link.
3. The producer session reads the issue, works the fix, opens the PR, etc.
4. Changesets + publish CI runs as normal.
5. Without `repository_dispatch`, the consumer agent (or Arian) manually triggers the bump.

After the bootstrap proposal lands ("install Claude Code GitHub Action on DS"), steps 2 and 5 stop needing Arian.
