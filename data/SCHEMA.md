# Data Schema

This document defines the structure of the data powering the tool.
All contributors updating `fallback.json` or the Google Sheet must follow this schema.

---

## Top-Level Structure (`fallback.json`)

```json
{
  "meta": { ... },
  "totals": { ... },
  "states": [ ... ],
  "facilities": [ ... ]
}
```

---

## `meta`

Metadata about the dataset.

| Field | Type | Description |
|-------|------|-------------|
| `last_updated` | string (ISO date) | When the data was last updated |
| `version` | string | Dataset version (e.g. `"2026-05"`) |
| `sources` | string[] | List of source organizations |
| `notes` | string | Any important caveats or methodology notes |

```json
"meta": {
  "last_updated": "2026-05-15",
  "version": "2026-05",
  "sources": [
    "FracTracker Alliance",
    "Oil & Gas Watch",
    "IM3",
    "U.S. EPA eGRID",
    "U.S. EIA",
    "EDGAR",
    "U.S. EPA COBRA"
  ],
  "notes": "All figures use low-scenario capacity factors. Health impacts use national model averages."
}
```

---

## `totals`

National aggregate figures. All values have `_low` and `_high` variants 
representing the low and high scenario estimates.

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `facilities` | integer | count | Total proposed + operational facilities |
| `capacity_gw_low` | number | GW | Total installed/proposed capacity, low estimate |
| `capacity_gw_high` | number | GW | Total installed/proposed capacity, high estimate |
| `co2_gt_low` | number | Gt CO₂e | Annual GHG emissions, low estimate |
| `co2_gt_high` | number | Gt CO₂e | Annual GHG emissions, high estimate |
| `deaths_low` | integer | people/yr | Premature deaths from air pollution, low estimate |
| `deaths_high` | integer | people/yr | Premature deaths from air pollution, high estimate |
| `health_cost_b_low` | number | $B | Total air pollution health costs, low estimate |
| `health_cost_b_high` | number | $B | Total air pollution health costs, high estimate |
| `grid_count` | integer | count | Grid-connected facilities |
| `btm_count` | integer | count | Behind-the-meter facilities |
| `comparable_country` | string | — | Country with comparable GHG footprint |

---

## `states`

Array of state-level aggregates. One object per state.

| Field | Type | Unit | Description |
|-------|------|------|-------------|
| `state` | string | 2-letter code | State abbreviation (e.g. `"TX"`) |
| `name` | string | — | Full state name |
| `count` | integer | count | Number of facilities in this state |
| `capacity_mw_low` | integer | MW | Total capacity, low estimate |
| `capacity_mw_high` | integer | MW | Total capacity, high estimate |
| `co2_mt_low` | integer | metric tonnes | Annual CO₂ emissions, low estimate |
| `co2_mt_high` | integer | metric tonnes | Annual CO₂ emissions, high estimate |
| `deaths_low` | integer | people/yr | Premature deaths, low estimate |
| `deaths_high` | integer | people/yr | Premature deaths, high estimate |
| `health_cost_m_low` | number | $M | Health costs, low estimate |
| `health_cost_m_high` | number | $M | Health costs, high estimate |
| `asthma_low` | integer | attacks/yr | Asthma attacks triggered, low estimate |
| `asthma_high` | integer | attacks/yr | Asthma attacks triggered, high estimate |

```json
{
  "state": "TX",
  "name": "Texas",
  "count": 286,
  "capacity_mw_low": 84633,
  "capacity_mw_high": 92000,
  "co2_mt_low": 230361413,
  "co2_mt_high": 307148551,
  "deaths_low": 484,
  "deaths_high": 1452,
  "health_cost_m_low": 7600,
  "health_cost_m_high": 22800,
  "asthma_low": 338624,
  "asthma_high": 1015872
}
```

---

## `facilities`

Array of individual facility records. Used for the top facilities table.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Facility name |
| `state` | string | 2-letter state code |
| `city` | string | City or region |
| `county` | string | County name |
| `type` | `"Grid"` or `"BTM"` | Connection type |
| `capacity_mw_low` | integer | Capacity in MW, low estimate |
| `capacity_mw_high` | integer | Capacity in MW, high estimate |
| `co2_mt_low` | integer | Annual CO₂ in metric tonnes, low |
| `co2_mt_high` | integer | Annual CO₂ in metric tonnes, high |
| `source` | string | Data source (e.g. `"FracTracker"`, `"Oil & Gas Watch"`) |
| `status` | string | `"operational"`, `"proposed"`, or `"under construction"` |

---

## Google Sheets Column Mapping

The sync script (`scripts/sync-data.js`) reads from the **Impacts by State** tab.
Column mapping:

| Sheet Column | JSON Field |
|---|---|
| A — State | `state` |
| C — Capacity Low (MW) | `capacity_mw_low` |
| D — Capacity High (MW) | `capacity_mw_high` |
| G — GHGs (MT) Low | `co2_mt_low` |
| H — GHGs (MT) High | `co2_mt_high` |
| Q — Total Health Costs (Low) | `health_cost_m_low` |
| R — Mortality (Low) | `deaths_low` |
| S — Asthma Attacks (Low) | `asthma_low` |
| U — Total Health Costs (High) | `health_cost_m_high` |
| V — Mortality (High) | `deaths_high` |
| W — Asthma Attacks (High) | `asthma_high` |

---

## Adding a New State or Updating Existing Data

1. Locate or add the state object in `data/fallback.json`
2. Add all required fields (partial records are not accepted)
3. Include source citation in your pull request
4. Reference the specific row/tab in the FracTracker spreadsheet

**Do not estimate or interpolate figures.** If data for a state is not available
from a primary source, omit that state rather than filling in approximate values.

---

## Versioning

Each release of `fallback.json` increments the `meta.version` field.
Format: `YYYY-MM` (year-month of the source data, not the code release).
