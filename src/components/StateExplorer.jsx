import { fmtRange, fmtRangeMillions, fmt } from "../utils/formatters";

export default function StateExplorer({ states, selected, onSelect }) {
  const sorted = [...states].sort((a, b) => a.name.localeCompare(b.name));
  const stateData = selected ? states.find(s => s.state === selected) : null;

  return (
    <section className="state-explorer">
      <div className="section__header">
        <h2 className="section__title">Find Your State</h2>
        <p className="section__desc">
          Select a state to see how data centers are affecting your community.
          {states.length < 51 && (
            <> Data available for {states.length} states so far. <a href="https://github.com/tciamn/darkcenter/blob/main/CONTRIBUTING.md">Help us add more.</a></>
          )}
        </p>
      </div>

      <div className="state-select-row">
        <select
          className="state-select"
          value={selected || ""}
          onChange={e => onSelect(e.target.value || null)}
          aria-label="Select a state"
        >
          <option value="">— Select a state —</option>
          {sorted.map(s => (
            <option key={s.state} value={s.state}>{s.name}</option>
          ))}
        </select>
        {selected && (
          <button className="link-btn" onClick={() => onSelect(null)}>
            ← Back to all states
          </button>
        )}
      </div>

      {stateData ? (
        <StateDetail data={stateData} />
      ) : (
        <TopStates states={states} onSelect={onSelect} />
      )}
    </section>
  );
}

function StateDetail({ data }) {
  return (
    <div className="state-detail">
      <h3 className="state-detail__name">{data.name}</h3>
      <p className="state-detail__count">{fmt(data.count)} data center{data.count !== 1 ? "s" : ""} documented in this state</p>
      <div className="state-stats">
        <div className="state-stat state-stat--red">
          <div className="state-stat__value">{fmtRange(data.deaths_low, data.deaths_high)}</div>
          <div className="state-stat__label">premature deaths per year</div>
        </div>
        <div className="state-stat state-stat--red">
          <div className="state-stat__value">{fmtRangeMillions(data.asthma_low, data.asthma_high)}</div>
          <div className="state-stat__label">asthma attacks per year</div>
        </div>
        <div className="state-stat">
          <div className="state-stat__value">${fmtRange(data.health_cost_m_low, data.health_cost_m_high, 0)}M</div>
          <div className="state-stat__label">in health costs per year</div>
        </div>
        <div className="state-stat">
          <div className="state-stat__value">{fmtRange(data.capacity_mw_low, data.capacity_mw_high)} MW</div>
          <div className="state-stat__label">total power capacity</div>
        </div>
        <div className="state-stat">
          <div className="state-stat__value">{fmtRange(Math.round(data.co2_mt_low / 1e6), Math.round(data.co2_mt_high / 1e6))}M MT</div>
          <div className="state-stat__label">CO₂ emissions per year</div>
        </div>
      </div>
    </div>
  );
}

function TopStates({ states, onSelect }) {
  const top = [...states]
    .sort((a, b) => b.deaths_high - a.deaths_high)
    .slice(0, 8);

  return (
    <div className="top-states">
      <p className="top-states__title">States with highest documented health impacts</p>
      <div style={{ overflowX: "auto" }}>
        <table className="states-table">
          <thead>
            <tr>
              <th>State</th>
              <th>Data Centers</th>
              <th>Deaths/yr (est. range)</th>
              <th>Health Costs/yr</th>
              <th>Asthma Attacks/yr</th>
            </tr>
          </thead>
          <tbody>
            {top.map(s => (
              <tr key={s.state}>
                <td>
                  <button className="link-btn" onClick={() => onSelect(s.state)}>
                    {s.name}
                  </button>
                </td>
                <td>{fmt(s.count)}</td>
                <td>{fmtRange(s.deaths_low, s.deaths_high)}</td>
                <td>${fmtRange(s.health_cost_m_low, s.health_cost_m_high, 0)}M</td>
                <td>{fmtRangeMillions(s.asthma_low, s.asthma_high)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
