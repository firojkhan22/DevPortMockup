// src/screens/project-data/WorkProgressHistoryScreen.jsx
// Provides (global): WorkProgressHistoryScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// "Option to view previously submitted details" from the BRD.
function WorkProgressHistoryScreen({ row, onMenuClick, onBack }) {
  return (
    <div>
      <TopBar
        title="Progress history"
        sub={row.name}
        onMenuClick={onMenuClick}
        action={
          <button
            className="btn btn-outline-navy btn-sm"
            onClick={onBack}
          >
            ← Back to list
          </button>
        }
      />
      {row.history.length === 0 ? (
        <div className="kpi-card p-4 text-center text-secondary small">
          No previous submissions for this{" "}
          {row.type === "tower" ? "building" : "unit"} yet.
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {row.history.map((h, i) => (
            <div className="kpi-card p-3" key={i}>
              <div className="d-flex justify-content-between flex-wrap gap-2">
                <div className="fw-semibold small">{h.date}</div>
                <span className="status-pill bg-secondary-subtle text-secondary">
                  {stageStatusLabel(h.stageStatus)}
                </span>
              </div>
              {h.remarks && (
                <div className="small text-secondary mt-1">
                  {h.remarks}
                </div>
              )}
              <div className="small text-secondary mt-1">
                % amount payable: {h.pctDue || "—"} · Demand letter by:{" "}
                {h.demandLetterDate || "—"}
              </div>
              <div className="small text-secondary mt-1">
                📷 {h.photosCount} photo/video · 📎 {h.docsCount}{" "}
                supporting document(s)
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-3">
        <button className="btn btn-outline-navy" onClick={onBack}>
          ← Back to list
        </button>
      </div>
    </div>
  );
}
