export default function DataBanner({ source, meta, error }) {
  const isLive = source === "sheets";

  return (
    <footer className="footer">
      <div className="container">
        <div
          className={`source-badge${isLive ? "" : " source-badge--fallback"}`}
          aria-label={isLive ? "Using live data from Google Sheets" : "Using cached local snapshot"}
        >
          <span className="source-badge__dot" />
          {isLive ? "Live data" : "Cached snapshot"}
          {" · "}Last updated {meta.last_updated}
          {error && <span style={{ color: "var(--accent)" }}> · Live data temporarily unavailable</span>}
        </div>

        <p className="footer__sources">
          <strong>Data sources:</strong>{" "}
          {meta.sources.join(" · ")}
        </p>

        <p className="footer__notes">{meta.notes}</p>

        <div className="footer__orgs">
          <span>Built with</span>
          <a href="https://www.fractracker.org" target="_blank" rel="noopener noreferrer">FracTracker Alliance</a>
          <a href="https://oilandgaswatch.org" target="_blank" rel="noopener noreferrer">Oil &amp; Gas Watch</a>
          <a href="https://tcia.us" target="_blank" rel="noopener noreferrer">TCIA — D4PG Stewardship</a>
          <a href="https://github.com/tciamn/darkcenter" target="_blank" rel="noopener noreferrer">Open Source on GitHub</a>
        </div>
      </div>
    </footer>
  );
}
