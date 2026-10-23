#!/usr/bin/env bash
# SessionStart: show where recorded context lives before any work starts.
# Read-only. Never fails the session.
cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git fetch -q origin 2>/dev/null || echo "(fetch failed — branch list may be stale)"
echo "── LOOK FIRST, ASK SECOND ──"
echo "Recorded context lives on these branches. Search them before asking the Steward:"
echo "  git grep -i <term> \$(git branch -r)"
git for-each-ref --sort=-committerdate refs/remotes/origin \
  --format='  %(committerdate:short)  %(refname:lstrip=3)  — %(subject)' 2>/dev/null \
  | grep -v ' HEAD ' | head -15
echo "Also: handoffs/  .claude/projects/  deploy/  docs/ on those branches."
echo "────────────────────────────"
exit 0
