# Future Labs — Mac Dev Box Setup

**Machine:** interstellar's MacBook Pro (Apple Silicon, arm64)  
**OS:** macOS (Golden Gate)  
**Last updated:** 2026-10-19

---

## What's Installed

### Package Manager
- **Homebrew** — pre-existing

### Dev Tools (installed this session)
- **Python 3.15** — `brew install python` → installed at `/opt/homebrew/bin/python3`
- **Starship** — smart terminal prompt → `brew install starship`
- **VSCodium** — pre-existing (VS Code without Microsoft telemetry, Open VSX marketplace)
- **Remote SSH extension** — `jeanp413.open-remote-ssh` v0.4.0 (VSCodium-compatible)

### Pre-existing Tools
- `git` — version control
- `node` — JavaScript/Node.js runtime
- `android-platform-tools` — ADB for LineageOS device
- `whisper-cpp` — local AI transcription
- `tesseract` — OCR
- `pandoc` — document conversion
- `logseq` — local-first notes (Cask)
- `firefox` — browser (Cask)

---

## Terminal Prompt (Starship)

Starship is active. It shows git branch, error codes, and language versions in the prompt.

Configured in `~/.zshrc`:
```bash
eval "$(starship init zsh)"
```

---

## VSCodium Remote SSH

Connects VSCodium on the Mac to the Future Labs VPS so you can edit server files locally.

**SSH config** (`~/.ssh/config`):
```
Host futurelabs-ma-1
  HostName 2.29.7.30
  User root
  IdentityFile ~/.ssh/hetzner_futurelabs
```

**To connect:**
1. `Cmd+Shift+P` → `Remote-SSH: Connect to Host`
2. Select `futurelabs-ma-1`
3. Open folder `/opt/mastodon`

---

## SSH Key

- Key: `~/.ssh/hetzner_futurelabs` (ed25519)
- Generated on this Mac — never regenerate in a cloud session
- Grants root access to `2.29.7.30` (futurelabs-ma-1, Hetzner Helsinki)

---

## Homebrew Outdated Formulae

As of 2026-10-19, `brew list` showed 39 outdated formulae and 2 outdated casks.  
These were not upgraded to avoid breaking existing tools.

To upgrade when ready:
```bash
brew upgrade
```

Run `brew doctor` first to check for conflicts.

---

## Apple Platform Development

This machine is also configured for:
- **macOS** app development
- **iPad** (iPadOS) app development
- **iOS** app development

- **Xcode 27.1** installed

---

## LineageOS Device

- Android device running LineageOS (open-source Android)
- `android-platform-tools` (ADB) installed for direct device access
- Used for development and testing
