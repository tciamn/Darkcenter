## Reflections — 2026-08-10-unXPs-jira-board-instructions-test.md

### Pickup Block
- STWD-28 complete — project instructions field loaded and tested ✓. All three turn-1 checks fired on `hello`. Protocol confirmed working.
- Jira board created — STWD-17 (workstream) + STWD-18 through STWD-28 (11 tasks). Kanban column config (Backlog → Ready → Claude Code → Claude Cowork → Design → Blocked → Done) is a Steward UI action — not yet done.
- Handoff brief v1.4 at handoffs/unXPs-infrastructure-handoff-brief_2026-08-10_v1.4.md — ready for Claude Code to pick up P1 tickets independently. (Note: file was v1.1 in this session log — updated to v1.4 in the continuation session same day. All open questions now resolved.)
- UPS model confirmed: CyberPower CST135XLU. OGMax travel confirmed: Scenario A — travels to Amsterdam, stays in room. STWD-21 (Scenario B) closed.
- Onyx model selection pre-authorized: Claude Code benchmarks hardware and proposes. Standing preference: qwen2.5:14b (primary) + qwen2.5:7b (GTD triage). Steward confirms or adjusts after proposal.
- Burnout signal — Steward named burnout explicitly. Keep sessions bounded. Surface solutions only when problem is clearly named and accepted.

### Architecture — Locked
- Sovereign pipeline: MacWhisper (on-device) → Ollama on Onyx → processed output only
- Raw meeting content never touches Anthropic or cloud infrastructure
- Email: Microsoft 365 only
- Files: .md source of truth, .docx distribution, no PDF unless explicitly instructed

### What To Tackle
P1 — Onyx Sovereign Stack is the priority.
You are running in a cloud container and cannot directly touch Onyx.
Produce scripts, configs, and step-by-step automation files the Steward runs on Onyx.

Start with:
1. Verify Whisper / MacWhisper pipeline is working end-to-end on Onyx
2. Install Ollama on Onyx (independent instance — not dependent on OGMax)
3. Benchmark Onyx hardware, propose models before downloading
4. External drive structure: 4TB (model files), 2TB (working content, audio, transcripts, outputs)
