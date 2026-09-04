export function fmt(n, decimals = 0) {
  return n.toLocaleString("en-US", { maximumFractionDigits: decimals });
}

export function fmtRange(low, high, decimals = 0) {
  const f = n => fmt(n, decimals);
  return low === high ? f(low) : `${f(low)}–${f(high)}`;
}

export function fmtMillions(n) {
  if (n >= 1_000_000) return `${fmt(n / 1_000_000, 1)}M`;
  if (n >= 1_000) return `${fmt(n / 1_000, 0)}K`;
  return fmt(n);
}

export function fmtRangeMillions(low, high) {
  return `${fmtMillions(low)}–${fmtMillions(high)}`;
}
