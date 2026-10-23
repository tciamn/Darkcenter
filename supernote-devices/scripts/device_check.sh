#!/usr/bin/env bash
# Read-only device report. Changes nothing on the device.
# Prints model, firmware and Android version. Never prints the serial.
# Scenario: features/sideloading.feature
set -euo pipefail

command -v adb >/dev/null || { echo "adb not found — install Android platform-tools" >&2; exit 2; }

state=$(adb get-state 2>&1 || true)
case "$state" in
  device) ;;
  *"more than one"*) echo "More than one device connected — connect one, or set ANDROID_SERIAL in your shell (never commit it)." >&2; exit 3 ;;
  *unauthorized*) echo "Device not authorised — accept the USB debugging prompt on the device, then re-run." >&2; exit 3 ;;
  *) echo "No device found (adb: $state)" >&2; exit 3 ;;
esac

prop() { adb shell getprop "$1" | tr -d '\r'; }

echo "date:      $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "model:     $(prop ro.product.model)"
echo "firmware:  $(prop ro.build.display.id)"
echo "android:   $(prop ro.build.version.release) (sdk $(prop ro.build.version.sdk))"
echo
# VERIFY: Supernote's Sideloading toggle is vendor-specific and has no documented
# property. Confirm it on the device (Settings > Security & Privacy > Sideloading)
# and record the result by hand in results/.
echo "sideloading: confirm on device and record in results/"
