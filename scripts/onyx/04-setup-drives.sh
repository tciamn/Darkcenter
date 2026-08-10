#!/usr/bin/env bash
# Set up external drive folder structure on Onyx
# 4TB: Ollama model files + Whisper models
# 2TB: Working content — audio, transcripts, processed outputs
# Run this on Onyx directly
set -euo pipefail

echo "=== External Drive Structure Setup — Onyx ==="
echo ""

# --- List mounted external volumes ---
echo "--- Mounted external volumes ---"
VOLS=$(ls /Volumes/ 2>/dev/null | grep -v "^Macintosh HD$" | grep -v "^com.apple" || true)
if [ -z "$VOLS" ]; then
  echo "No external volumes detected. Mount your drives and re-run."
  exit 1
fi
echo "$VOLS" | while read -r vol; do
  SIZE=$(df -h "/Volumes/$vol" 2>/dev/null | awk 'NR==2 {print $2}' || echo "unknown")
  echo "  /Volumes/$vol  ($SIZE)"
done

echo ""

# --- Prompt for drive names ---
read -rp "Enter the name of the 4TB drive (from list above): " DRIVE_4TB
read -rp "Enter the name of the 2TB drive (from list above): " DRIVE_2TB

DRIVE_4TB_PATH="/Volumes/$DRIVE_4TB"
DRIVE_2TB_PATH="/Volumes/$DRIVE_2TB"

# --- Verify drives exist ---
echo ""
echo "--- Verifying drives ---"
for PATH_CHECK in "$DRIVE_4TB_PATH" "$DRIVE_2TB_PATH"; do
  if [ ! -d "$PATH_CHECK" ]; then
    echo "✗ Not found: $PATH_CHECK"
    exit 1
  fi
  echo "✓ $PATH_CHECK"
done

echo ""

# --- 4TB: model storage ---
echo "--- 4TB structure (model files) ---"
mkdir -p "$DRIVE_4TB_PATH/ollama/models"
mkdir -p "$DRIVE_4TB_PATH/whisper/models"
mkdir -p "$DRIVE_4TB_PATH/whisper/model-archive"
echo "✓ Created:"
find "$DRIVE_4TB_PATH" -type d | grep -v "^$DRIVE_4TB_PATH$" | sed "s|$DRIVE_4TB_PATH|  4TB:|" | sort

echo ""

# --- 2TB: working content ---
echo "--- 2TB structure (working content) ---"
mkdir -p "$DRIVE_2TB_PATH/audio/inbox"
mkdir -p "$DRIVE_2TB_PATH/audio/archive"
mkdir -p "$DRIVE_2TB_PATH/transcripts/raw"
mkdir -p "$DRIVE_2TB_PATH/transcripts/processed"
mkdir -p "$DRIVE_2TB_PATH/outputs"
mkdir -p "$DRIVE_2TB_PATH/projects"
echo "✓ Created:"
find "$DRIVE_2TB_PATH" -type d | grep -v "^$DRIVE_2TB_PATH$" | sed "s|$DRIVE_2TB_PATH|  2TB:|" | sort

echo ""

# --- Write Ollama env config ---
echo "--- Writing Ollama model path config ---"
ENV_FILE="$HOME/.config/onyx-sovereign/env.sh"
mkdir -p "$(dirname "$ENV_FILE")"
cat > "$ENV_FILE" <<EOF
# Onyx sovereign stack — environment config
# Source this in ~/.zshrc: source ~/.config/onyx-sovereign/env.sh

export OLLAMA_MODELS="$DRIVE_4TB_PATH/ollama/models"
export ONYX_AUDIO_INBOX="$DRIVE_2TB_PATH/audio/inbox"
export ONYX_AUDIO_ARCHIVE="$DRIVE_2TB_PATH/audio/archive"
export ONYX_TRANSCRIPTS_RAW="$DRIVE_2TB_PATH/transcripts/raw"
export ONYX_TRANSCRIPTS_PROCESSED="$DRIVE_2TB_PATH/transcripts/processed"
export ONYX_OUTPUTS="$DRIVE_2TB_PATH/outputs"
EOF
echo "✓ Env config written: $ENV_FILE"

echo ""

# --- Shell rc update prompt ---
ZSHRC="$HOME/.zshrc"
if grep -q "onyx-sovereign" "$ZSHRC" 2>/dev/null; then
  echo "✓ ~/.zshrc already sources onyx-sovereign env"
else
  echo "Add this line to ~/.zshrc to persist the config:"
  echo ""
  echo "  source ~/.config/onyx-sovereign/env.sh"
  echo ""
  read -rp "Add it automatically now? [y/N] " CONFIRM
  if [[ "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "" >> "$ZSHRC"
    echo "# Onyx sovereign stack" >> "$ZSHRC"
    echo "source ~/.config/onyx-sovereign/env.sh" >> "$ZSHRC"
    echo "✓ Added to ~/.zshrc"
    echo "  Reload with: source ~/.zshrc"
  fi
fi

echo ""
echo "=== Step 4 complete ==="
echo ""
echo "Summary:"
echo "  4TB ($DRIVE_4TB_PATH): model storage"
echo "  2TB ($DRIVE_2TB_PATH): working content pipeline"
echo "  Env config: $ENV_FILE"
echo ""
echo "Next: confirm model proposal from 03-benchmark-propose.sh with Steward, then pull models."
