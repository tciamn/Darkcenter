# Handoff — Validating Claude's Instructions (2026-10-02)

**Status:** Proposal only. Nothing applied. Waiting for Operator review.
**Pick up with:** "Read docs/handoff-2026-10-02-instruction-validation.md and let's start."

## The problem

In earlier infrastructure work (the Mastodon VPS project in Berlin), roughly 80% of Claude's guidance was good and 20% was costly. Two examples:

- Claude suggested putting keys somewhere they would have been published to the cloud from an iPad. The Operator caught it.
- Claude gave wrong setup instructions, and it took many rounds to fix them.

Root causes:

- Claude gave instructions from memory as if it had checked them.
- An error in an early step only showed up many steps later.
- Claude didn't consider which device the Operator was working on.

## Proposed protocol

1. **Source label on every step:** Verified (run, or checked against the docs for the version in use, with a link) / Recalled (from memory, may be out of date) / Assumed (confirm first).
2. **BDD runbooks:** each step has Given / When / Then and a command to check the result. If Then fails, STOP and don't run the next step.
3. **Gate on irreversible steps (⚠️):** keys, publishing, push, DNS, delete, payment. Before running one, state what it does, who will see the result, and how to undo it.
4. **Secrets:** keys are created on the target server; never pasted into a chat, a cloud session or the repo; add `gitleaks` scanning. If Claude asks for a secret, that's a bug in its advice.
5. **Rehearse in the sandbox first** (`nginx -t`, `docker compose config`, scripts).
6. **Pin versions and cite the docs** (version, URL, date).
7. **Second-opinion review** of infrastructure runbooks by a separate agent.
8. **Two strikes, then stop:** read the logs and diagnose instead of guessing again.

## Confirmed findings (checked against official docs on 2026-10-02)

| Finding | Evidence | Effect |
|---|---|---|
| `/define`, `/build`, `/qa` don't load. They're flat files `.claude/skills/*.md`; skills must be `.claude/skills/<name>/SKILL.md` | https://code.claude.com/docs/en/skills.md: "Skills must be in a directory." | The BDD workflow CLAUDE.md describes as "enforced" is not running |
| The push reminder hook reads `$CLAUDE_TOOL_INPUT_command`; hooks receive tool input as JSON on stdin (`.tool_input.command`) | https://code.claude.com/docs/en/hooks.md | The "confirm /qa ran" reminder never fires |

## Proposed next work (needs Operator go-ahead, via /define → /build → /qa)

1. Move the skills into `<name>/SKILL.md` folders and fix the hook to parse stdin with `jq`.
2. Add a `/runbook` skill that applies rules 1–4 and 8.
3. Add `gitleaks` secret scanning.
4. First real use: the Supernote Private Cloud runbook.

## Open questions for the Operator

- Do you agree with the protocol, or want to change it?
- Which of the next-work items, and in what order?
