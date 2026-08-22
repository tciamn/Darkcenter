/**
 * sheets-proxy.js — Netlify Function
 *
 * Proxies Google Sheets API requests so SHEETS_API_KEY stays server-side.
 * The browser never sees the key.
 *
 * Usage (client): GET /.netlify/functions/sheets-proxy?tab=TabName&range=A1:Z50
 *
 * Required server env vars (set in Netlify UI → Site settings → Environment variables):
 *   SHEETS_ID       — Google Sheets document ID  (NOT VITE_SHEETS_ID)
 *   SHEETS_API_KEY  — Google Sheets API key       (NOT VITE_SHEETS_API_KEY)
 */

const ALLOWED_TABS = new Set(["Total Estimates", "Impacts by State"]);
const ALLOWED_RANGE_PATTERN = /^[A-Z]+\d+:[A-Z]+\d+$/;

export const handler = async (event) => {
  const { tab, range } = event.queryStringParameters || {};

  // Validate inputs before forwarding — prevents the proxy from being used
  // to read arbitrary tabs or ranges from the sheet.
  if (!ALLOWED_TABS.has(tab)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid tab" }) };
  }
  if (!range || !ALLOWED_RANGE_PATTERN.test(range)) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid range" }) };
  }

  const SHEETS_ID  = process.env.SHEETS_ID;
  const API_KEY    = process.env.SHEETS_API_KEY;

  if (!SHEETS_ID || !API_KEY) {
    return { statusCode: 503, body: JSON.stringify({ error: "Sheets not configured" }) };
  }

  const encoded = encodeURIComponent(`'${tab}'!${range}`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_ID}/values/${encoded}?key=${API_KEY}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return {
        statusCode: res.status,
        body: JSON.stringify({ error: `Sheets API error: ${res.status}` }),
      };
    }
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // Cache for 5 minutes at the CDN — reduces Sheets API quota usage
        "Cache-Control": "public, s-maxage=300",
      },
      body: JSON.stringify({ values: data.values || [] }),
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: err.message }) };
  }
};
