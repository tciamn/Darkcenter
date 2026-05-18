/**
 * sync-data.js
 * 
 * Fetches the latest data from the FracTracker Google Sheets source
 * and writes it to data/fallback.json.
 * 
 * Run manually:   node scripts/sync-data.js
 * Runs weekly:    .github/workflows/sync-data.yml
 * 
 * Required environment variables:
 *   VITE_SHEETS_ID       — Google Sheets document ID
 *   VITE_SHEETS_API_KEY  — Google Sheets API key (read-only)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../data/fallback.json");
const EXISTING = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));

const SHEETS_ID = process.env.VITE_SHEETS_ID;
const API_KEY = process.env.VITE_SHEETS_API_KEY;

if (!SHEETS_ID || !API_KEY) {
  console.error("❌  Missing VITE_SHEETS_ID or VITE_SHEETS_API_KEY environment variables.");
  console.error("    Copy .env.example to .env and fill in your credentials.");
  process.exit(1);
}

// ── Sheet tab names (must match exact tab names in the spreadsheet) ──────────
const TABS = {
  totals:  "Total Estimates",
  states:  "Impacts by State",
};

async function fetchSheet(tabName, range) {
  const encodedTab = encodeURIComponent(`'${tabName}'!${range}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encodedTab}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Sheets API error for tab "${tabName}": ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.values || [];
}

function parseNum(val) {
  if (!val) return 0;
  const cleaned = String(val).replace(/[$,\s%]/g, "");
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

// ── Parse Totals tab ─────────────────────────────────────────────────────────
async function parseTotals() {
  // Reads the summary rows from "Total Estimates" tab
  // Adjust the range to match the actual spreadsheet layout
  const rows = await fetchSheet(TABS.totals, "A1:Z50");

  // Find the "All Data Centers (Confirmed + Estimated)" row
  const allRow = rows.find(r => r[0]?.includes("All Data Centers"));
  // Find the "Behind The Meter" confirmed row
  const btmRow = rows.find(r => r[0]?.includes("Behind The Meter Data Centers") && !r[0]?.includes("Estimated"));
  // Find the "Grid Connected" confirmed row
  const gridRow = rows.find(r => r[0]?.includes("Grid Connected Data Centers") && !r[0]?.includes("Estimated"));

  if (!allRow) {
    throw new Error('Could not find "All Data Centers" row in Total Estimates tab. Check tab name and layout.');
  }

  // Column indices from SCHEMA.md — adjust if sheet layout changes
  return {
    facilities:        parseNum(allRow[2]),
    capacity_gw_low:   +(parseNum(allRow[3]) / 1000).toFixed(1),
    capacity_gw_high:  +(parseNum(allRow[4]) / 1000).toFixed(1),
    co2_gt_low:        +(parseNum(allRow[6]) / 1e9).toFixed(3),
    co2_gt_high:       +(parseNum(allRow[12]) / 1e9).toFixed(3),
    deaths_low:        parseNum(allRow[18]),
    deaths_high:       parseNum(allRow[20]),
    health_cost_b_low: +(parseNum(allRow[16]) / 1e9).toFixed(1),
    health_cost_b_high:+(parseNum(allRow[17]) / 1e9).toFixed(1),
    grid_count:        gridRow ? parseNum(gridRow[2]) : EXISTING.totals.grid_count,
    btm_count:         btmRow  ? parseNum(btmRow[2])  : EXISTING.totals.btm_count,
    comparable_country: EXISTING.totals.comparable_country, // manual field
    homes_equivalent_low:  EXISTING.totals.homes_equivalent_low,
    homes_equivalent_high: EXISTING.totals.homes_equivalent_high,
  };
}

// ── Parse States tab ─────────────────────────────────────────────────────────
async function parseStates() {
  // Reads the "Impacts by State" pivot table
  // Skips header rows, reads all state total rows
  const rows = await fetchSheet(TABS.states, "A1:X500");

  const states = [];
  const STATE_ABBREVS = new Set([
    "AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN",
    "KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ",
    "NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA",
    "WI","WV","WY"
  ]);
  const STATE_NAMES = {
    AK:"Alaska",AL:"Alabama",AR:"Arkansas",AZ:"Arizona",CA:"California",CO:"Colorado",
    CT:"Connecticut",DC:"Washington D.C.",DE:"Delaware",FL:"Florida",GA:"Georgia",HI:"Hawaii",
    IA:"Iowa",ID:"Idaho",IL:"Illinois",IN:"Indiana",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",
    MA:"Massachusetts",MD:"Maryland",ME:"Maine",MI:"Michigan",MN:"Minnesota",MO:"Missouri",
    MS:"Mississippi",MT:"Montana",NC:"North Carolina",ND:"North Dakota",NE:"Nebraska",
    NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NV:"Nevada",NY:"New York",OH:"Ohio",
    OK:"Oklahoma",OR:"Oregon",PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",
    SD:"South Dakota",TN:"Tennessee",TX:"Texas",UT:"Utah",VA:"Virginia",VT:"Vermont",
    WA:"Washington",WI:"Wisconsin",WV:"West Virginia",WY:"Wyoming"
  };

  for (const row of rows) {
    const code = String(row[0] || "").trim().toUpperCase();
    // Only process state total rows (2-letter state code in col A, "Total" implied by pivot structure)
    if (!STATE_ABBREVS.has(code)) continue;
    // Skip rows that don't have enough data
    if (!row[2] || parseNum(row[2]) === 0) continue;

    states.push({
      state: code,
      name: STATE_NAMES[code] || code,
      count: parseNum(row[1]) || 0,
      capacity_mw_low:    parseNum(row[2]),
      capacity_mw_high:   parseNum(row[3]),
      co2_mt_low:         parseNum(row[6]),
      co2_mt_high:        parseNum(row[7]),
      deaths_low:         parseNum(row[17]),
      deaths_high:        parseNum(row[21]),
      health_cost_m_low:  +(parseNum(row[16]) / 1e6).toFixed(1),
      health_cost_m_high: +(parseNum(row[20]) / 1e6).toFixed(1),
      asthma_low:         parseNum(row[18]),
      asthma_high:        parseNum(row[22]),
    });
  }

  if (states.length < 10) {
    console.warn(`⚠️  Only ${states.length} states parsed. Expected 40+. Check tab name and column mapping.`);
  }

  return states;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🔄  Fetching data from Google Sheets...");
  console.log(`    Sheet ID: ${SHEETS_ID.slice(0, 8)}...`);

  let totals, states;

  try {
    totals = await parseTotals();
    console.log(`✅  Totals parsed — ${totals.facilities.toLocaleString()} facilities`);
  } catch (err) {
    console.error("❌  Failed to parse totals:", err.message);
    console.log("    Keeping existing totals from fallback.json");
    totals = EXISTING.totals;
  }

  try {
    states = await parseStates();
    console.log(`✅  States parsed — ${states.length} states`);
  } catch (err) {
    console.error("❌  Failed to parse states:", err.message);
    console.log("    Keeping existing states from fallback.json");
    states = EXISTING.states;
  }

  const updated = {
    meta: {
      ...EXISTING.meta,
      last_updated: new Date().toISOString().split("T")[0],
      version: new Date().toISOString().slice(0, 7), // YYYY-MM
    },
    totals,
    states,
  };

  // Only write if something actually changed
  const existing_str = JSON.stringify(EXISTING, null, 2);
  const updated_str  = JSON.stringify(updated,  null, 2);

  if (existing_str === updated_str) {
    console.log("✔️   No changes detected. fallback.json is up to date.");
    return;
  }

  fs.writeFileSync(OUTPUT_PATH, updated_str, "utf8");
  console.log(`✅  fallback.json updated → ${OUTPUT_PATH}`);
  console.log(`    Totals: ${totals.facilities} facilities, ${totals.deaths_low}–${totals.deaths_high} deaths`);
  console.log(`    States: ${states.length} entries`);
}

main().catch(err => {
  console.error("❌  Sync failed:", err);
  process.exit(1);
});
