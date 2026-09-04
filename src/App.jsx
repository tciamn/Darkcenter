import { useState } from "react";
import { useImpactData } from "./hooks/useImpactData";
import NationalSummary from "./components/NationalSummary";
import StateExplorer from "./components/StateExplorer";
import DataBanner from "./components/DataBanner";

export default function App() {
  const { data, source, loading, error } = useImpactData();
  const [selectedState, setSelectedState] = useState(null);

  return (
    <div>
      <header className="hero">
        <div className="container">
          <div className="hero__eyebrow">Open Data · Community Research</div>
          <h1 className="hero__title">Who's Paying the Price<br />for the AI Boom?</h1>
          <p className="hero__subtitle">
            {data.totals.facilities.toLocaleString()} US data centers. Real costs.
            Your community.
          </p>
        </div>
      </header>

      <main>
        <div className="container">
          {loading && <p className="loading">Loading latest data…</p>}

          <NationalSummary totals={data.totals} />

          <StateExplorer
            states={data.states}
            selected={selectedState}
            onSelect={setSelectedState}
          />
        </div>
      </main>

      <DataBanner source={source} meta={data.meta} error={error} />
    </div>
  );
}
