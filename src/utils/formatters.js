export function fmtNum(n, decimals = 0) {
  if (n == null || isNaN(n)) return "—";
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function fmtRange(low, high, decimals = 0) {
  return `${fmtNum(low, decimals)} – ${fmtNum(high, decimals)}`;
}

export function fmtBillion(n) {
  return `$${fmtNum(n, 1)}B`;
}

export function fmtGT(n) {
  return `${fmtNum(n, 3)} GT`;
}
