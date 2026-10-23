#!/usr/bin/env bash
# Verify an APK against manifest/apps.yaml: SHA-256 of the file and SHA-256 of
# the signing certificate must both match. Exits non-zero on any mismatch.
# Usage: scripts/verify_apk.sh <app-id> <path/to/app.apk>
set -euo pipefail

here=$(cd "$(dirname "$0")/.." && pwd)
manifest="$here/manifest/apps.yaml"
[ $# -eq 2 ] || { echo "usage: $0 <app-id> <apk>" >&2; exit 2; }
app_id=$1; apk=$2
[ -f "$apk" ] || { echo "APK not found: $apk" >&2; exit 2; }
command -v apksigner >/dev/null || { echo "apksigner not found — install Android build-tools" >&2; exit 2; }

# Read one field for one app from the flat manifest format.
field() {
  python3 -I - "$manifest" "$app_id" "$1" <<'PY'
import sys
path, app, key = sys.argv[1:]
cur = None
for line in open(path, encoding="utf-8"):
    s = line.split("#", 1)[0].strip()
    if s.startswith("- id:"):
        cur = s.split(":", 1)[1].strip()
    elif cur == app and s.startswith(key + ":"):
        print(s.split(":", 1)[1].strip())
        break
PY
}

want_sha=$(field sha256)
want_signer=$(field signer_sha256)
[ -n "$want_sha" ] || { echo "No sha256 recorded for '$app_id' in manifest — record it first (rule 2)." >&2; exit 4; }
[ -n "$want_signer" ] || { echo "No signer_sha256 recorded for '$app_id' in manifest." >&2; exit 4; }

if command -v sha256sum >/dev/null; then got_sha=$(sha256sum "$apk" | cut -d' ' -f1)
else got_sha=$(shasum -a 256 "$apk" | cut -d' ' -f1); fi

got_signer=$(apksigner verify --print-certs "$apk" \
  | sed -n 's/.*certificate SHA-256 digest: //p' | head -n1)

fail=0
if [ "${got_sha,,}" = "${want_sha,,}" ]; then echo "sha256  OK"
else echo "sha256  MISMATCH  want $want_sha  got $got_sha" >&2; fail=1; fi
if [ "${got_signer,,}" = "${want_signer,,}" ]; then echo "signer  OK"
else echo "signer  MISMATCH  want $want_signer  got ${got_signer:-<none>}" >&2; fail=1; fi
exit $fail
