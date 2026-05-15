# DS snapshot

Per-bump cache of `@poukai-inc/ui` runtime context files. **Not authored by hand.** Refreshed by `.github/workflows/ds-bump.yml` on every DS package bump.

## Files

| File | Source | Refreshed by |
|---|---|---|
| `llms.txt` | `node_modules/@poukai-inc/ui/dist/llms.txt` (once DS ships it per proposal `ds-llms-context-files.md`) | `ds-bump.yml` |

## Why this exists

The bump workflow needs a comparison target to compute a diff against. Committing the snapshot means:

- The diff in the bump PR body is meaningful (it compares to what we last consumed).
- The consumer agent (`pouk-ai-engineer`) can read offline guidance even when `node_modules/` is fresh-installed and the file resolves to the latest, not the version we last decided to consume.
- Reviewers can `git blame` a brand decision back to the bump PR that introduced it.

## Don't edit by hand

If you want to change a rule, file a proposal against the DS repo (`meta/proposals/ds-*.md`). The DS updates its source `llms.txt`, publishes a new version, and the snapshot refreshes on bump.
