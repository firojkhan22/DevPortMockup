// src/screens/business/CampaignViewModal.jsx
// Provides (global): CampaignViewModal
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Read-only view of everything submitted for one campaign,
// including the uploaded files — so anyone can check exactly what
// was entered without having to open it in edit mode (which is
// only available for Drafts anyway).
function CampaignViewModal({ campaign, onClose }) {
  const c = campaign;
  return (
    <Modal title={c.name} onClose={onClose} width={560}>
      <div className="d-flex justify-content-between align-items-start mb-3">
        <span className={"status-pill " + campaignStagePill(c.stage)}>
          {c.stage}
        </span>
        <span className="small text-secondary">
          {campaignValidityLabel(c)}
        </span>
      </div>
      {c.remarks && (c.stage === "Approved" || c.stage === "Rejected") && (
        <div className="small text-secondary mb-3">
          PAMS remarks: {c.remarks}
        </div>
      )}
      {c.stage === "Query Raised" && c.queryText && (
        <div className="alert alert-info small mb-3">
          <div className="fw-semibold mb-1">Query from BD:</div>
          {c.queryText}
        </div>
      )}
      {c.queryHistory && c.queryHistory.length > 0 && (
        <div className="small text-secondary mb-3">
          <div className="fw-semibold text-dark mb-1">
            Previous query & response
          </div>
          {c.queryHistory.map((h, i) => (
            <div key={i} className="mb-1">
              <b>BD asked:</b> {h.queryText}
              <br />
              <b>Developer responded:</b> {h.response}
            </div>
          ))}
        </div>
      )}
      <div className="row g-3 small">
        <div className="col-12 col-md-6">
          <div className="text-secondary">Applicable project(s)</div>
          <div className="fw-semibold">{(c.projects || []).join(", ") || "—"}</div>
        </div>
        <div className="col-12 col-md-6">
          <div className="text-secondary">Campaign applicable for</div>
          <div className="fw-semibold">{c.audience || "—"}</div>
        </div>
        <div className="col-6 col-md-4">
          <div className="text-secondary">Offer type</div>
          <div className="fw-semibold">{c.offerType || "—"}</div>
        </div>
        <div className="col-6 col-md-4">
          <div className="text-secondary">Campaign champion</div>
          <div className="fw-semibold">{c.championName || "—"}</div>
        </div>
        <div className="col-6 col-md-4">
          <div className="text-secondary">Champion contact</div>
          <div className="fw-semibold">{c.championContact || "—"}</div>
        </div>
        <div className="col-12">
          <div className="text-secondary">Offer description</div>
          <div className="fw-semibold">{c.details || "—"}</div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-top">
        <div className="text-secondary small mb-2">
          Uploaded files
        </div>
        <div className="d-flex flex-column gap-2">
          <div className="repeat-row p-2 d-flex align-items-start gap-2">
            <span>📎</span>
            <div className="flex-fill small">
              <div className="fw-semibold">
                Marketing material
                {c.marketingFiles && c.marketingFiles.length > 1
                  ? " (" + c.marketingFiles.length + " files)"
                  : ""}
              </div>
              {c.marketingFiles && c.marketingFiles.length > 0 ? (
                c.marketingFiles.map((f, i) => (
                  <div className="text-secondary" key={i}>
                    {f}
                  </div>
                ))
              ) : (
                <div className="text-secondary">Not attached</div>
              )}
            </div>
          </div>
          <div className="repeat-row p-2 d-flex align-items-center gap-2">
            <span>📎</span>
            <div className="flex-fill small">
              <div className="fw-semibold">Builder request letter</div>
              <div className="text-secondary">
                {c.builderLetterFile || "Not attached"}
              </div>
            </div>
          </div>
        </div>
        <div className="small text-secondary mt-2">
          This is a static prototype — uploaded files are referenced
          by name only, not actually stored, so there's nothing to
          open/download here.
        </div>
      </div>
    </Modal>
  );
}
