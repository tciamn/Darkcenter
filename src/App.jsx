import { useState } from "react";
import { useImpactData } from "./hooks/useImpactData.js";
import { fmtNum, fmtRange, fmtBillion, fmtGT } from "./utils/formatters.js";

const STATE_LIST = [
  "AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN",
  "KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ",
  "NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA",
  "WI","WV","WY",
];

export default function App() {
  const { data, source, loading } = useImpactData();
  const [selectedState, setSelectedState] = useState("");

  const stateData = selectedState
    ? data.states.find((s) => s.state === selectedState)
    : null;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>Who's Paying the Price for the AI Boom?</h1>
        <p style={styles.subtitle}>
          {fmtNum(data.totals.facilities)} data centers across the US — their energy
          demand, emissions, and health impacts in plain language.
        </p>
        {source === "sheets" && (
          <span style={styles.badge}>Live data</span>
        )}
        {loading && <span style={styles.badge}>Loading live data…</span>}
      </header>

      <section style={styles.grid}>
        <StatCard
          label="Premature deaths per year"
          value={fmtRange(data.totals.deaths_low, data.totals.deaths_high)}
        />
        <StatCard
          label="Asthma attacks (TX example)"
          value={
            data.states.find((s) => s.state === "TX")
              ? fmtRange(
                  data.states.find((s) => s.state === "TX").asthma_low,
                  data.states.find((s) => s.state === "TX").asthma_high
                )
              : "—"
          }
        />
        <StatCard
          label="CO₂ emissions"
          value={fmtRange(data.totals.co2_gt_low, data.totals.co2_gt_high, 2) + " GT"}
          note={`Comparable to ${data.totals.comparable_country}`}
        />
        <StatCard
          label="Health costs absorbed by communities"
          value={fmtRange(data.totals.health_cost_b_low, data.totals.health_cost_b_high)}
          prefix="$"
          suffix="B"
        />
        <StatCard
          label="Homes equivalent (energy demand)"
          value={
            fmtRange(
              data.totals.homes_equivalent_low / 1e6,
              data.totals.homes_equivalent_high / 1e6,
              1
            ) + "M homes"
          }
        />
        <StatCard
          label="Total facilities tracked"
          value={fmtNum(data.totals.facilities)}
        />
      </section>

      <section style={styles.stateSection}>
        <h2 style={styles.sectionTitle}>Find your state</h2>
        <select
          style={styles.select}
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">— Select a state —</option>
          {STATE_LIST.map((code) => {
            const s = data.states.find((x) => x.state === code);
            return (
              <option key={code} value={code}>
                {s ? s.name : code}
              </option>
            );
          })}
        </select>

        {stateData && (
          <div style={styles.stateCard}>
            <h3 style={styles.stateName}>{stateData.name}</h3>
            <div style={styles.grid}>
              <StatCard
                label="Data centers"
                value={fmtNum(stateData.count)}
              />
              <StatCard
                label="Premature deaths / yr"
                value={fmtRange(stateData.deaths_low, stateData.deaths_high)}
              />
              <StatCard
                label="Asthma attacks / yr"
                value={fmtRange(stateData.asthma_low, stateData.asthma_high)}
              />
              <StatCard
                label="Health costs"
                value={"$" + fmtRange(stateData.health_cost_m_low, stateData.health_cost_m_high) + "M"}
              />
            </div>
          </div>
        )}
      </section>

      <footer style={styles.footer}>
        <p>
          Data: FracTracker Alliance · Oil & Gas Watch · IM3 · U.S. EPA eGRID ·
          U.S. EIA · EDGAR · COBRA Health Model
        </p>
        <p>
          Last updated: {data.meta.last_updated} · Source:{" "}
          {source === "sheets" ? "Google Sheets (live)" : "Local snapshot"}
        </p>
      </footer>
    </div>
  );
}

function StatCard({ label, value, note, prefix = "", suffix = "" }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardValue}>
        {prefix}{value}{suffix}
      </div>
      <div style={styles.cardLabel}>{label}</div>
      {note && <div style={styles.cardNote}>{note}</div>}
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "system-ui, sans-serif",
    maxWidth: 960,
    margin: "0 auto",
    padding: "2rem 1rem",
    color: "#1a1a1a",
    background: "#f9f9f7",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "2rem",
    borderBottom: "2px solid #1a1a1a",
    paddingBottom: "1.5rem",
  },
  title: {
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
    fontWeight: 800,
    lineHeight: 1.2,
    margin: "0 0 0.5rem",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#444",
    margin: "0 0 0.75rem",
  },
  badge: {
    display: "inline-block",
    fontSize: "0.75rem",
    background: "#1a1a1a",
    color: "#f9f9f7",
    padding: "2px 8px",
    borderRadius: 4,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },
  card: {
    background: "#fff",
    border: "1.5px solid #ddd",
    borderRadius: 8,
    padding: "1.25rem 1rem",
  },
  cardValue: {
    fontSize: "1.4rem",
    fontWeight: 700,
    marginBottom: "0.25rem",
  },
  cardLabel: {
    fontSize: "0.85rem",
    color: "#555",
  },
  cardNote: {
    fontSize: "0.75rem",
    color: "#888",
    marginTop: "0.25rem",
    fontStyle: "italic",
  },
  stateSection: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
  },
  select: {
    fontSize: "1rem",
    padding: "0.5rem 0.75rem",
    borderRadius: 6,
    border: "1.5px solid #aaa",
    marginBottom: "1rem",
    minWidth: 220,
  },
  stateCard: {
    background: "#fff",
    border: "1.5px solid #ddd",
    borderRadius: 8,
    padding: "1.5rem",
  },
  stateName: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "1rem",
  },
  footer: {
    borderTop: "1px solid #ddd",
    paddingTop: "1rem",
    fontSize: "0.8rem",
    color: "#888",
    lineHeight: 1.8,
  },
};
