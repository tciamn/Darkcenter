# 0001 — Source for Kobo Books

- Status: **Proposed — awaiting user decision**
- Scenario: features/kobo_books.feature

## Context

Kobo Books is proprietary and not on F-Droid. The user has an existing Kobo
library, so the app is needed for DRM-protected purchases.

## Options

1. **Aurora Store** — anonymous front-end to Google Play. Gets in-app updates;
   adds a second store and a dependency on Google Play infrastructure.
2. **Verified APK** — single APK from a source the user trusts, with sha256 and
   signer recorded. No extra store; updates are manual and re-verified each time.

## Decision

_Pending._ Whichever is chosen, record the signer certificate digest in the
manifest; it must stay the same across updates.
