#!/usr/bin/env bash
# Verify MacWhisper / Whisper pipeline on Onyx — run this on Onyx directly
set -euo pipefail

echo "=== Whisper Pipeline Verification — Onyx ==="
echo ""

# 1. Check MacWhisper app
echo "--- MacWhisper app ---"
if [ -d "/Applications/MacWhisper.app" ]; then
  echo "✓ MacWhisper.app present"
else
  echo "✗ MacWhisper.app not found in /Applications"
  echo "  Download: https://goodsnooze.gumroad.com/l/macwhisper"
  exit 1
fi
echo ""

# 2. Check for any CLI whisper tool (optional but enables automated test)
echo "--- CLI whisper tools ---"
WHISPER_CLI=""
if command -v whisper &>/dev/null; then
  echo "✓ whisper (openai-whisper) found: $(which whisper)"
  WHISPER_CLI="openai-whisper"
elif command -v whisper-cli &>/dev/null; then
  echo "✓ whisper-cli (whisper.cpp) found: $(which whisper-cli)"
  WHISPER_CLI="whisper-cli"
else
  echo "  No CLI whisper found — will use MacWhisper GUI for final verification"
fi
echo ""

# 3. Generate test audio via macOS text-to-speech
echo "--- Generating test audio ---"
TEST_AUDIO="$TMPDIR/whisper-pipeline-test.aiff"
TEST_TEXT="Onyx sovereign pipeline test. The quick brown fox jumps over the lazy dog."
say -o "$TEST_AUDIO" "$TEST_TEXT"
echo "✓ Test audio: $TEST_AUDIO"
echo ""

# 4. CLI transcription test if available
if [ -n "$WHISPER_CLI" ]; then
  echo "--- Running CLI transcription (tiny model for speed) ---"
  OUTPUT_DIR="$TMPDIR/whisper-test-output"
  mkdir -p "$OUTPUT_DIR"

  if [ "$WHISPER_CLI" = "openai-whisper" ]; then
    whisper "$TEST_AUDIO" --model tiny --output_dir "$OUTPUT_DIR" --output_format txt --language en
    echo ""
    echo "--- Transcript ---"
    cat "$OUTPUT_DIR"/*.txt 2>/dev/null || echo "(no output — check whisper install)"
  elif [ "$WHISPER_CLI" = "whisper-cli" ]; then
    whisper-cli -f "$TEST_AUDIO" -otxt -of "$OUTPUT_DIR/output"
    echo ""
    echo "--- Transcript ---"
    cat "$OUTPUT_DIR/output.txt" 2>/dev/null || echo "(no output)"
  fi
else
  echo "--- MacWhisper GUI verification ---"
  echo "Drag this file into MacWhisper to transcribe:"
  echo "  $TEST_AUDIO"
  echo ""
  echo "Expected output (roughly):"
  echo "  \"$TEST_TEXT\""
  echo ""
  echo "If MacWhisper produces that transcript, the pipeline is operational."
fi

echo ""
echo "=== Step 1 complete ==="
echo "Next: run 02-install-ollama.sh"
