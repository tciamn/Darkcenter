#!/usr/bin/env bash
# Install Ollama on Onyx — independent instance, not dependent on OGMax
# Run this on Onyx directly
set -euo pipefail

echo "=== Ollama Installation — Onyx ==="
echo ""

# Check if already installed
if command -v ollama &>/dev/null; then
  INSTALLED_VERSION=$(ollama --version 2>/dev/null | head -1)
  echo "✓ Ollama already installed: $INSTALLED_VERSION"
else
  echo "Installing Ollama..."
  echo ""

  if ! [[ "$OSTYPE" == "darwin"* ]]; then
    echo "✗ This script is for macOS. Exiting."
    exit 1
  fi

  if command -v brew &>/dev/null; then
    echo "Using Homebrew..."
    brew install ollama
  else
    echo "Homebrew not found. Install it first:"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "Or download Ollama directly from https://ollama.com/download"
    exit 1
  fi
fi

echo ""

# Verify service is not accidentally pointing at OGMax
echo "--- Checking for OGMax dependency ---"
if env | grep -i "OLLAMA_HOST" | grep -v "localhost" | grep -v "127.0.0.1" | grep -v "^$"; then
  echo "⚠️  OLLAMA_HOST is set to a remote address — this would use OGMax, not Onyx."
  echo "   Unset it: unset OLLAMA_HOST"
  echo "   Or add to ~/.zshrc: unset OLLAMA_HOST"
  echo "   Exiting — fix this before continuing."
  exit 1
else
  echo "✓ No remote OLLAMA_HOST detected — Onyx will run independently"
fi

echo ""

# Start Ollama
echo "--- Starting Ollama service ---"
if pgrep -x "ollama" &>/dev/null; then
  echo "✓ Ollama already running"
else
  ollama serve &>/dev/null &
  sleep 3
  if pgrep -x "ollama" &>/dev/null; then
    echo "✓ Ollama started"
  else
    echo "✗ Ollama failed to start — check logs with: journalctl -u ollama or Console.app"
    exit 1
  fi
fi

echo ""

# Confirm API responds
echo "--- API check ---"
if curl -s http://localhost:11434/api/tags &>/dev/null; then
  echo "✓ Ollama API responding at http://localhost:11434"
else
  echo "✗ API not responding — wait 5s and retry, or check: ps aux | grep ollama"
fi

echo ""
echo "--- Current models on Onyx ---"
ollama list

echo ""
echo "=== Step 2 complete ==="
echo "Ollama is running independently on Onyx."
echo "DO NOT pull models yet — run 03-benchmark-propose.sh first."
