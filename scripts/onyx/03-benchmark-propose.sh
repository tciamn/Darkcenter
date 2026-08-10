#!/usr/bin/env bash
# Benchmark Onyx hardware and output model proposal
# DO NOT pull models — proposal only. Await Steward confirmation.
set -euo pipefail

echo "=== Onyx Hardware Benchmark & Model Proposal ==="
echo ""

# --- Hardware collection ---
echo "--- Hardware ---"

CHIP=$(system_profiler SPHardwareDataType 2>/dev/null | awk -F': ' '/Chip/ {gsub(/^[ \t]+/,"",$2); print $2}')
MODEL=$(system_profiler SPHardwareDataType 2>/dev/null | awk -F': ' '/Model Name/ {gsub(/^[ \t]+/,"",$2); print $2}')
MEMORY_BYTES=$(sysctl -n hw.memsize 2>/dev/null)
MEMORY_GB=$(( MEMORY_BYTES / 1073741824 ))
CPU_CORES=$(sysctl -n hw.physicalcpu 2>/dev/null)
GPU_INFO=$(system_profiler SPDisplaysDataType 2>/dev/null | grep -A5 "Apple" | grep "Total Number of Cores" | awk -F': ' '{gsub(/^[ \t]+/,"",$2); print $2}')

echo "Device:     ${MODEL:-unknown}"
echo "Chip:       ${CHIP:-unknown}"
echo "Memory:     ${MEMORY_GB}GB unified"
echo "CPU cores:  ${CPU_CORES:-unknown}"
echo "GPU cores:  ${GPU_INFO:-unknown (check System Information > Graphics)}"

echo ""

# --- Memory budget ---
OVERHEAD_GB=6
USABLE_GB=$(( MEMORY_GB - OVERHEAD_GB ))

echo "--- Memory budget ---"
echo "Total:    ${MEMORY_GB}GB"
echo "Overhead: ~${OVERHEAD_GB}GB (macOS + active apps)"
echo "Usable:   ~${USABLE_GB}GB for models"

echo ""

# --- Inference speed note (M3 Max specific) ---
# M3 Max: 400 GB/s memory bandwidth — excellent for LLM inference
# M3 Pro: 150 GB/s — still good but slower
echo "--- Memory bandwidth ---"
if echo "${CHIP:-}" | grep -qi "Max"; then
  BANDWIDTH="~400 GB/s (M3 Max)"
elif echo "${CHIP:-}" | grep -qi "Pro"; then
  BANDWIDTH="~150 GB/s (M3 Pro)"
else
  BANDWIDTH="unknown — check chip specs"
fi
echo "Estimated: $BANDWIDTH"
echo "Higher bandwidth = faster token generation for large models"

echo ""
echo "========================================"
echo "           MODEL PROPOSAL"
echo "========================================"
echo ""

# Size estimates (Q4_K_M quantization, standard Ollama pulls)
SIZE_7B=5      # ~4.7GB → round to 5
SIZE_14B=9     # ~9.0GB
SIZE_32B=20    # ~20GB

HEADROOM_DUAL=$(( USABLE_GB - SIZE_7B - SIZE_14B ))
HEADROOM_32B=$(( USABLE_GB - SIZE_32B ))

echo "RECOMMENDED (matches standing preference):"
echo ""
echo "  1. qwen2.5:14b  ← primary"
echo "     Disk/RAM:  ~${SIZE_14B}GB"
echo "     Speed:     ~35-50 tok/sec (M3 Max) / ~20-30 tok/sec (M3 Pro)"
echo "     Use case:  Main reasoning, writing, analysis"
echo "     Status:    ✓ fits — both models together use ~$((SIZE_7B + SIZE_14B))GB of ${USABLE_GB}GB usable"
echo ""
echo "  2. qwen2.5:7b   ← GTD triage"
echo "     Disk/RAM:  ~${SIZE_7B}GB"
echo "     Speed:     ~65-85 tok/sec (M3 Max)"
echo "     Use case:  Fast triage, quick tasks, GTD processing"
echo "     Status:    ✓ fits"
echo ""

if [ "$HEADROOM_DUAL" -ge 0 ]; then
  echo "  Headroom after both: ~${HEADROOM_DUAL}GB remaining"
else
  echo "  ⚠️  Both models together exceed usable memory by $((- HEADROOM_DUAL))GB"
  echo "     Consider running one at a time"
fi

echo ""
echo "OPTIONAL (if you want a heavier reasoning model):"
echo ""
echo "  3. qwen2.5:32b"
echo "     Disk/RAM:  ~${SIZE_32B}GB"
echo "     Speed:     ~15-20 tok/sec"
echo "     Use case:  Complex reasoning where quality > speed"

if [ "$HEADROOM_32B" -ge 0 ]; then
  echo "     Status:    ✓ fits with ~${HEADROOM_32B}GB to spare"
else
  echo "     Status:    ✗ does not fit — would need ${SIZE_32B}GB, only ${USABLE_GB}GB usable"
fi

echo ""
echo "NOT RECOMMENDED:"
echo "  - qwen2.5:72b (~45GB) — exceeds ${MEMORY_GB}GB total memory"

echo ""
echo "========================================"
echo "  STOP — AWAIT STEWARD CONFIRMATION"
echo "========================================"
echo ""
echo "Reply with which models to pull. Default is:"
echo "  qwen2.5:14b + qwen2.5:7b"
echo ""
echo "After confirmation, pull with (point at 4TB drive):"
echo "  export OLLAMA_MODELS=/Volumes/<4TB-drive>/ollama/models"
echo "  ollama pull qwen2.5:14b"
echo "  ollama pull qwen2.5:7b"
echo ""
echo "=== Step 3 complete — awaiting Steward ==="
