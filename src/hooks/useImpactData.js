/**
 * useImpactData.js
 *
 * Fetches impact data with a two-layer strategy:
 *   1. Google Sheets (live, primary source of truth)
 *   2. data/fallback.json (local snapshot, always available)
 *
 * The fallback is shown immediately so the tool is never blank.
 * If Sheets loads successfully and differs from the fallback,
 * the UI updates automatically.
 */

import { useState, useEffect } from "react";
import fallbackData from "../../data/fallback.json";

const SHEETS_ID  = import.meta.env.VITE_SHEETS_ID;
const API_KEY    = import.meta.env.VITE_SHEETS_API_KEY;

function parseNum(val) {
  if (!val) return 0;
  const n = parseFloat(String(val).replace(/[$,\s%]/g, ""));
  return isNaN(n) ? 0 : n;
}

async function fetchSheetTab(tabName, range) {
  const encoded = encodeURIComponent(`'${tabName}'!${range}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encoded}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets API ${res.status}: ${tabName}`);
  const data = await res.json();
  return data.values || [];
}

async function loadFromSheets() {
  if (!SHEETS_ID || !API_KEY) {
    throw new Error("Sheets credentials not configured");
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalsRows = await fetchSheetTab("Total Estimates", "A1:Z50");
  const allRow = totalsRows.find(r => r[0]?.includes("All Data Centers"));
  if (!allRow) throw new Error('Could not find "All Data Centers" row');

  const totals = {
    facilities:         parseNum(allRow[2]),
    capacity_gw_low:    +(parseNum(allRow[3]) / 1000).toFixed(1),
    capacity_gw_high:   +(parseNum(allRow[4]) / 1000).toFixed(1),
    co2_gt_low:         +(parseNum(allRow[6]) / 1e9).toFixed(3),
    co2_gt_high:        +(parseNum(allRow[12]) / 1e9).toFixed(3),
    deaths_low:         parseNum(allRow[18]),
    deaths_high:        parseNum(allRow[20]),
    health_cost_b_low:  +(parseNum(allRow[16]) / 1e9).toFixed(1),
    health_cost_b_high: +(parseNum(allRow[17]) / 1e9).toFixed(1),
    grid_count:         fallbackData.totals.grid_count,
    btm_count:          fallbackData.totals.btm_count,
    comparable_country: fallbackData.totals.comparable_country,
    homes_equivalent_low:  fallbackData.totals.homes_equivalent_low,
    homes_equivalent_high: fallbackData.totals.homes_equivalent_high,
  };

  // ── States ────────────────────────────────────────────────────────────────
  const stateRows = await fetchSheetTab("Impacts by State", "A1:X500");
  const STATE_ABBREVS = new Set([
    "AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN",
    "KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ",
    "NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA",
    "WI","WV","WY",
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
    WA:"Washington",WI:"Wisconsin",WV:"West Virginia",WY:"Wyoming",
  };

  const states = [];
  for (const row of stateRows) {
    const code = String(row[0] || "").trim().toUpperCase();
    if (!STATE_ABBREVS.has(code) || !row[2] || parseNum(row[2]) === 0) continue;
    states.push({
      state: code,
      name:  STATE_NAMES[code] || code,
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

  return { meta: fallbackData.meta, totals, states };
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useImpactData() {
  const [data,   setData]   = useState(fallbackData);   // instant render
  const [source, setSource] = useState("fallback");     // "fallback" | "sheets"
  const [error,  setError]  = useState(null);
  const [loading,setLoading]= useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const live = await loadFromSheets();
        if (!cancelled) {
          setData(live);
          setSource("sheets");
        }
      } catch (err) {
        if (!cancelled) {
          // Fallback already shown — just note the error silently
          setError(err.message);
          setSource("fallback");
          console.warn("⚠️  Sheets unavailable, using fallback data:", err.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return { data, source, loading, error };
}
