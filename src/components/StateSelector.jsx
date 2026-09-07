import { useState } from "react";
import { fmtInt, fmtMWRange, fmtCO2Range, fmtCostRange } from "../utils/formatters.js";
import styles from "./StateSelector.module.css";

function StateCard({ state }) {
  if (!state) return null;
  const { name, count, capacity_mw_low, capacity_mw_high,
          co2_mt_low, co2_mt_high, deaths_low, deaths_high,
          health_cost_m_low, health_cost_m_high, asthma_low, asthma_high } = state;

  return (
    <div className={styles.stateCard}>
      <h3 className={styles.stateName}>{name}</h3>
      <p className={styles.facilityCount}>{fmtInt(count)} data center{count !== 1 ? "s" : ""} tracked</p>
      <div className={styles.metrics}>
        <Metric label="Premature deaths / year" value={`${fmtInt(deaths_low)}–${fmtInt(deaths_high)}`} hot />
        <Metric label="Asthma attacks / year" value={`${fmtInt(asthma_low)}–${fmtInt(asthma_high)}`} hot />
        <Metric label="Health costs (annual)" value={`$${health_cost_m_low}M–$${health_cost_m_high}M`} hot />
        <Metric label="Total capacity" value={fmtMWRange(capacity_mw_low, capacity_mw_high)} />
        <Metric label="CO₂ emissions / year" value={fmtCO2Range(co2_mt_low, co2_mt_high)} />
      </div>
      <p className={styles.note}>Low–high scenario range. Source: FracTracker Alliance / Oil & Gas Watch via COBRA.</p>
    </div>
  );
}

function Metric({ label, value, hot }) {
  return (
    <div className={`${styles.metric} ${hot ? styles.hot : ""}`}>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );
}

export default function StateSelector({ states }) {
  const [selected, setSelected] = useState("");
  const sorted = [...states].sort((a, b) => a.name.localeCompare(b.name));
  const stateData = sorted.find(s => s.state === selected) || null;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Find Your State</h2>
        <p className={styles.lead}>
          Select a state to see local data center energy demand, emissions, and health costs.
        </p>
        <select
          value={selected}
          onChange={e => setSelected(e.target.value)}
          className={styles.select}
          aria-label="Select a state"
        >
          <option value="">— Choose a state —</option>
          {sorted.map(s => (
            <option key={s.state} value={s.state}>{s.name}</option>
          ))}
        </select>
        {selected && stateData && <StateCard state={stateData} />}
        {selected && !stateData && (
          <p className={styles.noData}>Data not yet available for this state. Check back as the dataset grows.</p>
        )}
      </div>
    </section>
  );
}
