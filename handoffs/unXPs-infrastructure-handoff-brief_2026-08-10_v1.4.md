# Infrastructure Enablement Handoff Brief — unXPs
**Version:** 1.4
**Date:** 2026-08-10
**For:** Claude Code
**Steward:** Aasim (Awesome Sauce)
**Hard deadline:** September 9, 2026 (Amsterdam departure September 10)

## Goal
Build a sovereign, device-agnostic work continuity stack. Any device on the Tailscale mesh is a full work surface. Context, actions, and carry-forward travel with the Steward — not locked to a machine.

## Network Architecture
| Name | Device | Tailscale Hostname | Role | Status |
|---|---|---|---|---|
| OGMax | M1 MacBook Max 64GB | futureforward.tailcfc3ca.ts.net | Primary co-working station, Ollama host, KORE training machine | Operational |
| Onyx / Dark Matter | M3 MacBook Pro Max 36GB, 14" | — | Mobile co-working unit, travel machine | Operational |
| Pluto | Mac Mini | — | Always-on home server | Online — partially configured |

## P1 — Onyx Sovereign Stack (START HERE)
Build independent sovereign processing on Onyx — not dependent on OGMax.
Onyx already has Whisper installed and Claude running. Build on what's there:
- Confirm Whisper pipeline working end-to-end
- Install Ollama (independent instance, not dependent on OGMax)
- Model selection: benchmark hardware, then propose before downloading
  - Standing preference: qwen2.5:14b (primary) + qwen2.5:7b (GTD triage)
  - Steward confirms or adjusts after proposal
- External drive structure:
  - 4TB external: model files
  - 2TB external: working content, audio files, transcripts, processed outputs
- Verify Tailscale routing: Onyx ↔ OGMax ↔ Pluto ↔ M4 iPad

## Pre-Authorized Decisions
Claude Code can proceed without Steward input on:
- Confirming Whisper pipeline on Onyx
- Installing Ollama on Onyx
- Benchmarking hardware and proposing models (do not download until Steward confirms)
- Writing AppleScript / Shortcuts / launchd automations
- Configuring Pluto auto-restart setting
- Troubleshooting UPS via PowerPanel (read-only diagnostics)

## Architecture Decisions — Locked
- Sovereign pipeline: on-device transcription → Ollama local → processed output only
- Raw meeting content never touches Anthropic or cloud infrastructure
- Email: Microsoft 365 only
- Files: .md source of truth, .docx distribution, no PDF unless explicitly instructed

## P1 Completion Status — 2026-08-10
Onyx sovereign stack fully operational. Verified by Steward.

| Component | Status | Notes |
|---|---|---|
| whisper-cli | ✓ | GPU-accelerated, M3 Max Metal backend |
| MacWhisper | ✓ | App present |
| Ollama | ✓ | Independent instance, not dependent on OGMax |
| qwen2.5:14b | ✓ | Primary model |
| qwen2.5:7b | ✓ | GTD triage model |
| mlx venv (~/.venvs/mlx) | ✓ | mlx-lm 0.29.1 installed |
| llama3.1-8b-mlx base model | ✓ | 4.2GB, load-tested at 61 tok/sec |
| kore-v0.1 adapter | ✓ | Path-corrected for Onyx username |
| kore-v1.1 adapter | ✓ | Path-corrected for Onyx username; inference verified 42.5 tok/sec, 4.85 GB |
| External drives (4TB/2TB) | Deferred | Not a blocker |
| configs/kore-v1.1-train.json | ✓ | Path-corrected for Onyx username, verified 2026-08-11 |

## CW Warning — Do Not Trust Cross-Device Filesystem Reports
Claude Cowork reads the local machine it runs on. If open on OGMax, it reports OGMax's filesystem as if it were Onyx's. Confirmed during P1 session — CW reported OGMax models as being on Onyx.
Rule: never trust CW filesystem reports for a machine other than the one it is running on. CC holds the cross-device map.
