#!/usr/bin/env bash
# Verify an APK against the manifest, print the install command, and run it only
# with --confirm AND a typed "yes". Never retries on failure (rule 9).
# Usage: scripts/install_apk.sh <app-id> <path/to/app.apk> --confirm
set -euo pipefail

here=$(cd "$(dirname "$0")" && pwd)
[ $# -ge 2 ] || { echo "usage: $0 <app-id> <apk> --confirm" >&2; exit 2; }
app_id=$1; apk=$2; confirm=${3:-}

"$here/verify_apk.sh" "$app_id" "$apk" || { echo "Verification failed — nothing installed." >&2; exit 1; }

cmd=(adb install "$apk")
echo "Will run: ${cmd[*]}"
if [ "$confirm" != "--confirm" ]; then
  echo "Dry run. Re-run with --confirm to install." ; exit 0
fi
read -r -p "Type yes to install $app_id on the connected device: " answer
[ "$answer" = "yes" ] || { echo "Not confirmed — nothing installed."; exit 1; }

"${cmd[@]}" || { echo "Install failed — stopping. Record the result in results/." >&2; exit 1; }
echo "Installed. Update status in manifest/apps.yaml and record the run in results/."
