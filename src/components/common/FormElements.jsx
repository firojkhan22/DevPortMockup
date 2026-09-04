// src/components/common/FormElements.jsx
// Provides (global): FormCard, FormActions
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function FormCard({ children }) {
  return <div className="kpi-card p-3 p-md-4">{children}</div>;
}
function FormActions({ primary, onCancel, onPrimary }) {
  return (
    <div className="d-flex justify-content-end gap-2 mt-3">
      <button className="btn btn-outline-navy" onClick={onCancel}>
        Save as draft
      </button>
      <button className="btn btn-navy" onClick={onPrimary}>
        {primary || "Save"}
      </button>
    </div>
  );
}
