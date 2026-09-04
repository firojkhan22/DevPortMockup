// src/components/common/ReviewHelpers.jsx
// Provides (global): ReviewRow, ReviewGroup
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Small read-only presentational helpers for the wizard's final
// "Review & Submit" step — one row per field, grouped per section,
// with an Edit action that jumps the wizard back into that section.
function ReviewRow({ label, value }) {
  return (
    <div
      className="d-flex justify-content-between gap-3 py-1 small border-bottom"
      style={{ borderColor: "#eef1f6" }}
    >
      <span className="text-secondary">{label}</span>
      <span className="fw-semibold text-end">
        {value === "" || value === null || value === undefined ? (
          <span className="text-secondary fw-normal">Not entered</span>
        ) : (
          value
        )}
      </span>
    </div>
  );
}

function ReviewGroup({ title, tabIndex, onEdit, children }) {
  return (
    <div className="kpi-card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="fw-semibold small" style={{ color: "var(--navy)" }}>
          {title}
        </div>
        <button
          type="button"
          className="btn btn-outline-navy btn-sm"
          onClick={() => onEdit(tabIndex)}
        >
          ✏️ Edit
        </button>
      </div>
      {children}
    </div>
  );
}
