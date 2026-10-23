# Supernote Manta — Sideload and Sync

Auditable setup for a Supernote Manta (A5 X2): sideloading, verified app installs,
and a sync path that keeps notes and ebooks on hardware we control.

**Status:** scaffold only. Nothing has been run against the device. All facts
marked VERIFY are unconfirmed.

## Principles

- **Sustainability** — long-lived, repairable, open components; no recurring cloud fees; reuse existing hardware.
- **Duty of care** — nothing is installed, wiped or reconfigured without explicit confirmation at each step.
- **Data and privacy** — no credentials, tokens, account details or personal files in git.
- **Digital sovereignty** — F-Droid first. Aurora Store (draws from Google Play) is a documented exception for proprietary apps only.
- **Validate** — every APK is checked for source, version, signer and SHA-256 before install.
- **Version control + BDD** — every capability has a Gherkin scenario and a recorded result.

## Layout

| Path | Purpose |
|---|---|
| `CLAUDE.md` | Rules for Claude Code in this directory |
| `manifest/apps.yaml` | Every app: source, version, sha256, signer, status |
| `scripts/device_check.sh` | Read-only: model, firmware, Android version |
| `scripts/verify_apk.sh` | Checks an APK's SHA-256 and signer against the manifest |
| `scripts/install_apk.sh` | Verifies, then `adb install` only with `--confirm` + typed yes |
| `features/*.feature` | BDD scenarios, one per capability |
| `results/` | One log per run, firmware recorded |
| `docs/decisions/` | ADRs |

Requirements on the operator's computer: `adb` and `apksigner` (Android SDK
platform-tools / build-tools), `python3`, `sha256sum` or `shasum`.

## Order of work

1. `device_check.sh` + `sideloading.feature`. Record firmware.
2. F-Droid (verified). Confirm in-app updates work.
3. File manager + KOReader. Run `koreader.feature`.
4. Kobo Books. Run `kobo_books.feature`. Decide source in ADR 0001.
5. Sync path. Decide Private Cloud / WebDAV / both in ADR 0002.
6. Network-egress check for the sync scenarios.

## Facts to VERIFY before acting

| Topic | Claim | Source so far |
|---|---|---|
| Enable sideloading | Settings → Security & Privacy → Sideloading → On | Nomad docs (same X2 family) |
| Kobo Books | Works; one report of blank screen at login | Community |
| Kobo purchases | Need Kobo app; DRM-free files work in KOReader | General knowledge |
| Private Cloud | Self-hosted Docker, launched as beta, needs recent firmware | Supernote support |
| Private Cloud image | Tag 26.02.23 fixed important security issues — pin it or newer; HTTPS auto-sync behind reverse proxy from 25.12.17 | Supernote changelog |

Known, lower risk: install via ADB or INBOX + file manager; F-Droid does not scan
for malware; Supernote warns third-party apps are not guaranteed on its E-Ink
kernel; Manta system updates guaranteed to at least December 2028.

## Relationship to TCIA Supernote Private Cloud

The repo-root `CLAUDE.md` tracks a TCIA-hosted Supernote Private Cloud (blocked on
VPS choice, proposed `cloud.tciamn.org`). This device setup can use that server
once it exists, or a LAN-only server. ADR 0002 records which.
