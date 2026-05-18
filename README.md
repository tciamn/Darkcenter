# Data Center Impact Tool

**Who's Paying the Price for the AI Boom?**

An open source, community-facing tool that translates data center energy demand, 
emissions, and health impacts into plain language for everyday people.

Built from independent research. Owned by the community. Free to use, adapt, and redistribute.

---

## What This Is

A React-based interactive tool covering **2,820 data centers** across the US, showing:

- Premature deaths and asthma attacks from air pollution
- Energy demand (translated into homes, not gigawatts)
- CO₂ emissions compared to countries people recognize
- Health costs absorbed by communities, not corporations
- State-by-state breakdown with a personal "find your state" selector

**Data sources:** FracTracker Alliance · Oil & Gas Watch · IM3 · U.S. EPA eGRID · U.S. EIA · EDGAR · COBRA Health Model

---

## Live Data — No Rebuild Required

Data lives in **two places** so updates never require a code change:

### 1. Google Sheets (primary source of truth)
The research team at FracTracker updates a public Google Sheet.
The tool fetches fresh data on every page load.

Set the Sheet ID in your environment:
```
VITE_SHEETS_ID=your_google_sheet_id_here
VITE_SHEETS_API_KEY=your_api_key_here
```

### 2. `data/fallback.json` (backup)
If the Sheets API is unavailable, the tool falls back to a local JSON snapshot.
This file should be updated whenever significant data changes are published.

To refresh the fallback manually:
```bash
npm run sync-data
```

This fetches the latest from Google Sheets and writes to `data/fallback.json`.

---

## Quickstart

```bash
# Clone
git clone https://github.com/your-org/datacenter-impact-tool.git
cd datacenter-impact-tool

# Install
npm install

# Add environment variables (copy and fill in)
cp .env.example .env

# Run locally
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
datacenter-impact-tool/
├── src/
│   ├── App.jsx              # Main component
│   ├── components/          # Reusable UI pieces
│   ├── hooks/
│   │   └── useImpactData.js # Data fetching — Sheets + fallback
│   └── utils/
│       └── formatters.js    # Number formatting helpers
├── data/
│   └── fallback.json        # Local data snapshot (auto-updated by sync script)
├── scripts/
│   └── sync-data.js         # Fetch from Sheets → write fallback.json
├── public/
│   └── embed.html           # Standalone iframe-embeddable build
├── .github/
│   └── workflows/
│       └── sync-data.yml    # Auto-sync data weekly via GitHub Actions
├── .env.example
├── LICENSE
└── README.md
```

---

## Updating the Data

### If you're on the research team (FracTracker / OGW)

You don't need to touch code. Update the Google Sheet and the tool will reflect 
changes on the next page load. The Sheet structure is documented in `data/SCHEMA.md`.

### If you're a contributor

1. Update `data/fallback.json` directly, following the schema in `data/SCHEMA.md`
2. Open a pull request with a description of what changed and a source citation
3. For state-level additions, include the source spreadsheet row reference

### Automated weekly sync

A GitHub Action runs every Monday at 06:00 UTC, fetching the latest from Google 
Sheets and committing an updated `fallback.json` if data has changed.

---

## Embedding in Your Site

### iframe (works on any platform)

```html
<iframe 
  src="https://your-deployment-url.netlify.app" 
  width="100%" 
  height="900px" 
  frameborder="0"
  title="Data Center Impact Tool">
</iframe>
```

### Squarespace
Paste the iframe code into a **Code Block** on any page.

### Substack (paid plans)
Substack supports iframe embeds on paid publications. Paste the iframe code 
in an embed block.

### Newsletter (HTML email)
React can't run in email. Use the static newsletter snapshot instead:
```bash
npm run build:newsletter
```
This generates `dist/newsletter.html` — a self-contained HTML email with 
key stats and a CTA linking to the live tool.

---

## Contributing

We welcome contributions from researchers, developers, journalists, and 
community advocates.

**Before contributing:**
- Read `CONTRIBUTING.md`
- Data changes require a source citation
- Design changes should preserve plain-language framing for a general audience
- The tool is for working class people, not analysts — keep jargon out

**Good first contributions:**
- Add missing state data to `data/fallback.json`
- Translate the tool into Spanish (`src/i18n/`)
- Improve mobile layout
- Add county-level data when available

---

## Data Schema

See `data/SCHEMA.md` for full documentation of the data structure.

---

## License

MIT License — see `LICENSE` for full text.

**Note:** The MIT license covers the software. The underlying data remains 
subject to the original research organizations' terms. Attribution is required 
when redistributing. See the DATA ATTRIBUTION NOTICE in `LICENSE`.

---

## Maintainers

This tool was developed in collaboration with:
- [FracTracker Alliance](https://www.fractracker.org)
- [Oil & Gas Watch](https://oilandgaswatch.org)
- [Twin Cities Innovation Alliance (TCIA)](https://tcia.us) — D4PG Stewardship

Community stewardship model: issues and PRs are reviewed by a rotating 
group of community maintainers. No single organization controls the tool.

---

*The future is brighter than any one contributor to building it.*
