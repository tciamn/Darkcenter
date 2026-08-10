# Onyx Sovereign Stack — Setup Scripts

Run these on **Onyx** in order. Read each script before running.

## Prerequisites
- Onyx is powered on with admin access
- 4TB and 2TB external drives are mounted
- MacWhisper already installed (confirmed in handoff)

## Execution order

| # | Script | Purpose | Gate |
|---|--------|---------|------|
| 01 | `01-verify-whisper.sh` | Confirm MacWhisper pipeline end-to-end | Pre-authorized |
| 02 | `02-install-ollama.sh` | Install Ollama — independent of OGMax | Pre-authorized |
| 03 | `03-benchmark-propose.sh` | Benchmark hardware, output model proposal | Pre-authorized — **STOP after output, await Steward confirmation before pulling models** |
| 04 | `04-setup-drives.sh` | Create folder structure on 4TB + 2TB drives | Pre-authorized |

## Sovereign pipeline (locked)
```
MacWhisper (on-device) → Ollama on Onyx → processed output only
```
Raw meeting content never touches cloud infrastructure.

## After Steward confirms models
```bash
OLLAMA_MODELS=/Volumes/<4TB>/ollama/models ollama pull qwen2.5:14b
OLLAMA_MODELS=/Volumes/<4TB>/ollama/models ollama pull qwen2.5:7b
```
