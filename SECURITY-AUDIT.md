# Security Audit — Data Center Impact Tool

**Date:** 2026-08-22  
**Auditor:** Claude Code (automated)  
**Scope:** Full codebase — `src/`, `scripts/`, `data/`, project configuration and documentation  
**Branch:** `claude/audit-run-irfu75`

---

## Summary

| Severity | Count |
|----------|-------|
| High     | 1     |
| Medium   | 4     |
| Low      | 3     |
| Info     | 2     |

No critical (RCE, auth bypass, data exfiltration) issues found. The primary risk is API key exposure through the client bundle, which is an accepted trade-off for many read-only Google Sheets integrations but should be explicitly mitigated.

---

## Findings

---

### [HIGH] API Key Bundled in Client-Side JavaScript

**File:** `src/hooks/useImpactData.js:17`, `vite.config` (implied by `VITE_` prefix)

Vite automatically inlines any `VITE_*` environment variable into the built JavaScript bundle. `VITE_SHEETS_API_KEY` will therefore be visible in plaintext to any user who opens DevTools or downloads the JS bundle.

**Impact:**
- Anyone can extract the key and exhaust the project's Google Sheets API quota (60 requests/min, 300 requests/min per project on free tier)
- If the key was ever granted write permissions, data could be modified
- Key cannot be rotated without a full rebuild and redeploy

**Recommendation:**
1. Restrict the key in Google Cloud Console: limit it to the Sheets API and add HTTP referrer restrictions (allowed referrers = your deployment domain only)
2. Set up a lightweight proxy endpoint (Cloudflare Worker, Netlify Function, Vercel Edge) that holds the key server-side and proxies only approved ranges. The client calls the proxy, not the Sheets API directly.
3. Document clearly in README that this key is intentionally public-facing and must be read-only with referrer restrictions.

---

### [MEDIUM] `VITE_FORCE_FALLBACK` Documented but Not Implemented

**File:** `CONTRIBUTING.md:51`

The setup guide tells contributors to set `VITE_FORCE_FALLBACK=true` to skip Sheets credentials, but neither `useImpactData.js` nor any other file checks this variable. Contributors following the guide will find that Sheets fetches still attempt (and fail silently), making the dev experience confusing.

**Recommendation:** Either implement the flag in `useImpactData.js`:

```js
const FORCE_FALLBACK = import.meta.env.VITE_FORCE_FALLBACK === "true";

async function loadFromSheets() {
  if (FORCE_FALLBACK || !SHEETS_ID || !API_KEY) {
    throw new Error("Sheets credentials not configured");
  }
  // ...
}
```

Or remove the reference from CONTRIBUTING.md.

---

### [MEDIUM] Missing `.env.example` File

**Files:** `README.md:38-39`, `CONTRIBUTING.md:50`

Both documents instruct contributors to run `cp .env.example .env`, but no `.env.example` file exists in the repository. New contributors cannot follow the setup guide and may commit a `.env` file with real credentials if they create one without a template.

**Recommendation:** Create `.env.example` at the project root:

```
# Google Sheets data source
VITE_SHEETS_ID=your_google_sheet_id_here
VITE_SHEETS_API_KEY=your_api_key_here

# Set to "true" to skip Sheets and always use data/fallback.json
VITE_FORCE_FALLBACK=false
```

Verify `.env` is in `.gitignore` (no `.gitignore` exists; one should be created).

---

### [MEDIUM] Missing `.gitignore` — Credentials Could Be Committed

**File:** Project root (absent)

There is no `.gitignore` file. If a contributor creates a `.env` file with real API credentials, `git add .` will stage and commit it.

**Recommendation:** Add `.gitignore` at minimum containing:

```
.env
.env.local
node_modules/
dist/
```

---

### [MEDIUM] Automated Sync Workflow Referenced but Missing

**File:** `README.md:117`

The README describes a weekly GitHub Action at `.github/workflows/sync-data.yml` that syncs data automatically. This file does not exist. The automated sync will never run, `fallback.json` will go stale, and contributors may not realize the automation is missing.

**Recommendation:** Create `.github/workflows/sync-data.yml`:

```yaml
name: Sync Data

on:
  schedule:
    - cron: "0 6 * * 1"  # Mondays 06:00 UTC
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: node scripts/sync-data.js
        env:
          VITE_SHEETS_ID: ${{ secrets.VITE_SHEETS_ID }}
          VITE_SHEETS_API_KEY: ${{ secrets.VITE_SHEETS_API_KEY }}
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: auto-sync fallback.json [skip ci]"
          file_pattern: data/fallback.json
```

---

### [LOW] Sheet Row Column Access Without Bounds Checking

**Files:** `src/hooks/useImpactData.js:89-99`, `scripts/sync-data.js:124-138`

Both files access specific array indices on sheet rows (e.g., `row[22]`) without verifying the row has enough columns. If the sheet layout changes or a row is shorter than expected, `row[N]` returns `undefined`, which `parseNum` silently converts to `0`. Health and emissions figures could silently become zero with no warning.

**Impact:** Silent data corruption in the displayed statistics.

**Recommendation:** Add a row length check before processing, or add a post-parse validation that flags implausibly low values:

```js
if (row.length < 23) {
  console.warn(`Skipping short row for state ${code}: only ${row.length} columns`);
  continue;
}
```

---

### [LOW] External Data Written Directly to File Without Schema Validation

**File:** `scripts/sync-data.js:192`

`sync-data.js` writes parsed data from the Google Sheets API directly to `data/fallback.json` without validating that the resulting structure conforms to the expected schema. If the sheet is misconfigured or compromised, the file could be overwritten with zeros or negative values.

**Impact:** Bad data written to the committed fallback snapshot; Sheets unavailability would then serve wrong figures to all users.

**Recommendation:** Add a sanity check before writing:

```js
if (totals.facilities < 100 || totals.deaths_low < 1 || states.length < 20) {
  console.error("❌  Sanity check failed — data looks implausible. Aborting write.");
  process.exit(1);
}
```

---

### [LOW] Incomplete Fallback Dataset — 21 States Missing

**File:** `data/fallback.json`

`fallback.json` contains data for 30 of 51 US states and territories. When the Google Sheets API is unavailable, users in states like California, Wisconsin, Kansas, Oklahoma, and others see no state-level data at all. For a tool designed to reach affected communities, silent blank state panels are a reliability issue.

**Missing states:** AK, AR, CA, CT, DC, DE, HI, ID, KS, LA, ME, MS, MT, ND, NE, NH, OK, RI, SD, VT, WI

**Recommendation:** Populate the missing states from the FracTracker spreadsheet using `npm run sync-data` once credentials are in place, and commit the result before launch.

---

### [INFO] Documentation References Non-Existent Files

Several files referenced throughout the docs do not exist:

| Reference | Found? |
|-----------|--------|
| `MAINTAINERS.md` | No |
| `src/i18n/` directory | No |
| `public/embed.html` | No |
| `src/App.jsx` | No |
| `src/components/` | No |
| `src/utils/formatters.js` | No |

The project appears to be at an early stage. Stale documentation creates confusion for contributors and misrepresents the project's completeness.

---

### [INFO] Google Sheets API Key Partially Logged

**File:** `scripts/sync-data.js:151`

```js
console.log(`    Sheet ID: ${SHEETS_ID.slice(0, 8)}...`);
```

Only the Sheet ID (document identifier, not the API key) is partially logged, which is acceptable. The API key is not logged anywhere. This is fine.

---

## Recommended Priority Order

1. Create `.gitignore` immediately — prevents accidental credential commits
2. Create `.env.example` — unblocks contributors
3. Implement `VITE_FORCE_FALLBACK` or remove its documentation
4. Add API key referrer restrictions in Google Cloud Console
5. Create `.github/workflows/sync-data.yml`
6. Populate missing state data in `fallback.json`
7. Add row bounds checking in both data-parsing files
8. Add sanity validation before writing `fallback.json` in sync script

---

## Files Audited

- `src/hooks/useImpactData.js`
- `scripts/sync-data.js`
- `data/fallback.json`
- `data/SCHEMA.md`
- `package.json`
- `README.md`
- `CONTRIBUTING.md`
- `LICENSE`
