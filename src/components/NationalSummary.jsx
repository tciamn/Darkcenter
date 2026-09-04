import { fmtRange, fmtMillions, fmt } from "../utils/formatters";

export default function NationalSummary({ totals }) {
  return (
    <section className="section">
      <div className="section__header">
        <h2 className="section__title">The National Picture</h2>
        <p className="section__desc">
          These figures represent all {fmt(totals.facilities)} US data centers combined — grid-connected and behind-the-meter.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard
          number={fmt(totals.facilities)}
          label="data centers across the US"
          note={`${fmt(totals.grid_count)} grid-connected · ${fmt(totals.btm_count)} behind-the-meter`}
        />
        <StatCard
          number={`${fmtRange(totals.deaths_low, totals.deaths_high)}`}
          label="premature deaths every year"
          note="from air pollution linked to data center energy use"
          impact
        />
        <StatCard
          number={`$${fmtRange(totals.health_cost_b_low, totals.health_cost_b_high, 1)}B`}
          label="in health costs per year"
          note="absorbed by communities, not corporations"
          impact
        />
        <StatCard
          number={`${fmtMillions(totals.homes_equivalent_low)}+`}
          label="US homes powered by this energy demand"
          note={`${totals.capacity_gw_low}–${totals.capacity_gw_high} GW total installed capacity`}
        />
        <StatCard
          number={`${fmtRange(totals.co2_gt_low, totals.co2_gt_high, 2)} Gt`}
          label="CO₂ emissions per year"
          note={`Comparable to all of ${totals.comparable_country}'s annual emissions`}
        />
      </div>
    </section>
  );
}

function StatCard({ number, label, note, impact }) {
  return (
    <div className={`stat-card${impact ? " stat-card--impact" : ""}`}>
      <div className="stat-card__number">{number}</div>
      <div className="stat-card__label">{label}</div>
      {note && <div className="stat-card__note">{note}</div>}
    </div>
  );
}
