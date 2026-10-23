# Supernote Manta — Rules for Claude Code

Scope: prepare the user's Supernote Manta (A5 X2) and Nomad (A6 X2) — both on
Supernote beta firmware, currently syncing to Supernote Cloud — for daily use — sideloading,
F-Droid, a file manager, KOReader, Kobo Books, and a self-hosted sync path.
The Kindle app is out of scope.

These rules apply to every session that works in this directory. They add to the
repo-root `CLAUDE.md`; where they are stricter, they win.

## Rules

1. Never run `adb install`, `adb uninstall`, `adb shell pm`, or any command that
   changes the device without printing the command and getting explicit
   confirmation from the user in that turn. `scripts/install_apk.sh` enforces this.
2. Never download an APK without first recording its source URL, version and
   SHA-256 in `manifest/apps.yaml`.
3. Never commit credentials, WebDAV passwords, Nextcloud app passwords, Kobo
   logins, server addresses, or device serials. Use `.env` (gitignored) and keep
   `.env.example` current. APK files are gitignored too.
4. Do not enable network exposure for any server. LAN or VPN only until TLS and
   authentication are verified.
5. Pin Docker images by tag **and** digest. Record the Private Cloud image tag in
   the manifest.
6. One commit per app or capability. Message format:
   `<capability>: <what changed> [scenario: <feature file>]`
7. Write or update the Gherkin scenario before the script that satisfies it.
   Record each run in `results/`.
8. Where a fact is marked **VERIFY** (see `README.md`), fetch the official
   Supernote page and cite it in the commit or ADR before acting on it.
9. If a step fails, stop and report. Never retry a destructive step automatically.
10. Devices run beta firmware. Record the exact build and channel in every result;
    do not assume stable-release behaviour or notes apply.
11. Do not change or sign out of the Supernote Cloud sync until a full export has
    been made and verified (`features/migration.feature`).

## Workflow

`/define` → `/build` → `/qa`, as for the rest of the repo. The feature files in
`features/` are the `/define` output; the scripts are `/build`; `results/` is `/qa`.
