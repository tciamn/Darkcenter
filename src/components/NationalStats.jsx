import { fmtInt, fmtDeaths, fmtCostRange, fmtHomes, fmtCO2Range } from "../utils/formatters.js";
import styles from "./NationalStats.module.css";

function StatCard({ label, value, sub, highlight }) {
  return (
    <div className={`${styles.card} ${highlight ? styles.highlight : ""}`}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </div>
  );
}

export default function NationalStats({ totals }) {
  const { facilities, deaths_low, deaths_high, health_cost_b_low, health_cost_b_high,
          homes_equivalent_low, homes_equivalent_high, co2_gt_low, co2_gt_high,
          comparable_country, grid_count, btm_count } = totals;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>National Picture</h2>
      <div className={styles.grid}>
        <StatCard
          label="Data centers tracked"
          value={fmtInt(facilities)}
          sub={`${fmtInt(grid_count)} grid-connected · ${fmtInt(btm_count)} behind-the-meter`}
        />
        <StatCard
          label="Premature deaths per year"
          value={fmtDeaths(deaths_low, deaths_high)}
          sub="From air pollution. Low–high estimate range."
          highlight
        />
        <StatCard
          label="Annual health costs absorbed by communities"
          value={`$${health_cost_b_low}B–$${health_cost_b_high}B`}
          sub="Not paid by the corporations that built these facilities."
          highlight
        />
        <StatCard
          label="Homes powered (equivalent capacity)"
          value={`${fmtHomes(homes_equivalent_low)}–${fmtHomes(homes_equivalent_high)}`}
          sub="Low–high scenario. Average US household consumption."
        />
        <StatCard
          label="Annual CO₂ emissions"
          value={`${co2_gt_low}–${co2_gt_high} Gt`}
          sub={`Comparable to the annual emissions of ${comparable_country}.`}
          highlight
        />
      </div>
    </section>
  );
}
