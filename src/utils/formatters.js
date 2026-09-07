export function fmtInt(n) {
  return Math.round(n).toLocaleString("en-US");
}

export function fmtDeaths(low, high) {
  return `${fmtInt(low)}–${fmtInt(high)}`;
}

export function fmtCost(millions) {
  if (millions >= 1000) return `$${(millions / 1000).toFixed(1)}B`;
  return `$${fmtInt(millions)}M`;
}

export function fmtCostRange(low_m, high_m) {
  return `${fmtCost(low_m)}–${fmtCost(high_m)}`;
}

export function fmtMW(mw) {
  if (mw >= 1000) return `${(mw / 1000).toFixed(1)} GW`;
  return `${fmtInt(mw)} MW`;
}

export function fmtMWRange(low, high) {
  return `${fmtMW(low)}–${fmtMW(high)}`;
}

export function fmtCO2mt(mt) {
  if (mt >= 1e9) return `${(mt / 1e9).toFixed(2)} Gt`;
  if (mt >= 1e6) return `${(mt / 1e6).toFixed(1)} Mt`;
  return `${fmtInt(mt)} t`;
}

export function fmtCO2Range(low, high) {
  return `${fmtCO2mt(low)}–${fmtCO2mt(high)}`;
}

export function fmtHomes(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  return fmtInt(n);
}
