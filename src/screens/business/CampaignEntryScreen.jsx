// src/screens/business/CampaignEntryScreen.jsx
// Provides (global): CampaignEntryScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function CampaignEntryScreen({ onMenuClick, onDone, editingCampaign, onSaveDraft, onSubmitForApproval, onRespondToQuery }) {
  // Two genuinely different reasons this screen opens with an
  // existing campaign: (1) a Draft the developer is still putting
  // together — every field is open; (2) BD raised a query on a
  // submitted campaign — only the field(s) BD actually flagged
  // (plus a required response note) are editable, everything else
  // is locked so the developer can't quietly change the campaign
  // BD already reviewed.
  const isQueryMode = !!(editingCampaign && editingCampaign.stage === "Query Raised");
  const unlockedFields = (editingCampaign && editingCampaign.queryFields) || [];
  function locked(fieldKey) {
    return isQueryMode && !unlockedFields.includes(fieldKey);
  }

  const [name, setName] = useState(editingCampaign ? editingCampaign.name : "");
  const [projects, setProjects] = useState(
    editingCampaign ? editingCampaign.projects : [],
  );
  const [audience, setAudience] = useState(
    editingCampaign ? editingCampaign.audience : "",
  );
  const [offerType, setOfferType] = useState(
    editingCampaign ? editingCampaign.offerType : "Rate discount",
  );
  const [validFrom, setValidFrom] = useState(
    editingCampaign ? editingCampaign.validFrom : "",
  );
  const [validTo, setValidTo] = useState(
    editingCampaign ? editingCampaign.validTo : "",
  );
  const [isOngoing, setIsOngoing] = useState(
    editingCampaign ? !!editingCampaign.isOngoing : false,
  );
  const [championName, setChampionName] = useState(
    editingCampaign ? editingCampaign.championName : "",
  );
  const [championContact, setChampionContact] = useState(
    editingCampaign ? editingCampaign.championContact : "",
  );
  const [details, setDetails] = useState(
    editingCampaign ? editingCampaign.details : "",
  );
  const [marketingFiles, setMarketingFiles] = useState(
    editingCampaign ? editingCampaign.marketingFiles || [] : [],
  );
  const [builderLetterFile, setBuilderLetterFile] = useState(
    editingCampaign ? editingCampaign.builderLetterFile : "",
  );
  const [queryResponse, setQueryResponse] = useState("");
  const [formError, setFormError] = useState("");
  const [savedDraft, setSavedDraft] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [responded, setResponded] = useState(false);

  function toggleProject(p) {
    if (locked("projects")) return;
    setProjects((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }

  function currentFormData() {
    return {
      name,
      projects,
      audience,
      offerType,
      validFrom,
      validTo: isOngoing ? "" : validTo,
      isOngoing,
      championName,
      championContact,
      details,
      marketingFiles,
      builderLetterFile,
    };
  }

  function validate() {
    if (!validFrom) {
      setFormError("Valid from date is required.");
      return false;
    }
    if (!isOngoing && !validTo) {
      setFormError(
        "Valid to date is required, unless this is an ongoing campaign with no end date.",
      );
      return false;
    }
    if (!name.trim() || projects.length === 0 || !details.trim()) {
      setFormError(
        "Campaign name, at least one project, and offer details are required.",
      );
      return false;
    }
    if (!audience) {
      setFormError("Select who the campaign is applicable for.");
      return false;
    }
    if (marketingFiles.length === 0) {
      setFormError(
        "At least one marketing material file (PDF/Image) is required.",
      );
      return false;
    }
    if (audience === "HDFC Bank customers" && !builderLetterFile) {
      setFormError(
        "A signed builder letter is required to host a campaign for HDFC Bank customers.",
      );
      return false;
    }
    setFormError("");
    return true;
  }

  function handleSaveDraft() {
    if (!name.trim()) {
      setFormError("At least a campaign name is needed to save a draft.");
      return;
    }
    setFormError("");
    onSaveDraft(currentFormData(), editingCampaign ? editingCampaign.key : null);
    setSavedDraft(true);
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmitForApproval(
      currentFormData(),
      editingCampaign ? editingCampaign.key : null,
    );
    setSubmitted(true);
  }

  function handleRespondToQuery() {
    if (!queryResponse.trim()) {
      setFormError("Enter a response to BD's query before resubmitting.");
      return;
    }
    setFormError("");
    onRespondToQuery(currentFormData(), editingCampaign.key, queryResponse);
    setResponded(true);
  }

  return (
    <div>
      <TopBar
        title="Campaign Entry"
        sub={
          isQueryMode
            ? "BD has a query on this campaign — respond below and resubmit"
            : "Attach marketing material and a description — submitted for BD maker-checker approval"
        }
        onMenuClick={onMenuClick}
      />
      {isQueryMode && !responded && (
        <div className="alert alert-info small">
          <div className="fw-semibold mb-1">Query from BD:</div>
          {editingCampaign.queryText}
          <div className="text-secondary mt-2">
            Only the field(s) BD flagged below are editable — everything
            else from your original submission is locked. Add your
            response and resubmit for review.
          </div>
        </div>
      )}
      <FormCard>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Campaign name * <span className="text-secondary fw-normal">({name.length}/100)</span>
            </label>
            <input
              className="form-control"
              maxLength={100}
              value={name}
              disabled={locked("name")}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Applicable project(s) * <span className="text-secondary fw-normal">(select one or more)</span>
            </label>
            <div
              className="border rounded-3 p-2"
              style={{
                maxHeight: 110,
                overflowY: "auto",
                opacity: locked("projects") ? 0.6 : 1,
              }}
            >
              {BUILDER_PROJECT_NAMES.map((p) => (
                <div className="form-check" key={p}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={"proj-" + p}
                    checked={projects.includes(p)}
                    disabled={locked("projects")}
                    onChange={() => toggleProject(p)}
                  />
                  <label className="form-check-label small" htmlFor={"proj-" + p}>
                    {p}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Campaign applicable for *
            </label>
            <select
              className="form-select"
              value={audience}
              disabled={locked("audience")}
              onChange={(e) => setAudience(e.target.value)}
            >
              <option value="">Select…</option>
              <option>All customers</option>
              <option>HDFC Bank customers</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Offer type
            </label>
            <select
              className="form-select"
              value={offerType}
              disabled={locked("offerType")}
              onChange={(e) => setOfferType(e.target.value)}
            >
              <option>Rate discount</option>
              <option>Fee waiver</option>
              <option>Cashback</option>
            </select>
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small fw-semibold">
              Valid from *
            </label>
            <input
              type="date"
              className="form-control"
              value={validFrom}
              disabled={locked("validFrom")}
              onChange={(e) => setValidFrom(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-2">
            <label className="form-label small fw-semibold">
              Valid to {!isOngoing && <span className="text-danger">*</span>}
            </label>
            <input
              type="date"
              className="form-control"
              value={validTo}
              disabled={locked("validTo") || isOngoing}
              onChange={(e) => setValidTo(e.target.value)}
            />
            <div className="form-check mt-1">
              <input
                className="form-check-input"
                type="checkbox"
                id="ongoing-campaign"
                checked={isOngoing}
                disabled={locked("validTo")}
                onChange={(e) => {
                  setIsOngoing(e.target.checked);
                  if (e.target.checked) setValidTo("");
                }}
              />
              <label
                className="form-check-label small"
                htmlFor="ongoing-campaign"
              >
                No end date — ongoing until withdrawn
              </label>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Campaign champion name
            </label>
            <input
              className="form-control"
              value={championName}
              disabled={locked("championName")}
              onChange={(e) => setChampionName(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Champion contact number
            </label>
            <input
              className="form-control"
              value={championContact}
              disabled={locked("championContact")}
              onChange={(e) => setChampionContact(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label small fw-semibold">
              Offer description * <span className="text-secondary fw-normal">({details.length}/500)</span>
              {isQueryMode && !locked("details") && (
                <span className="badge bg-info-subtle text-info ms-2">
                  BD asked about this
                </span>
              )}
            </label>
            <textarea
              className="form-control"
              rows="3"
              maxLength={500}
              value={details}
              disabled={locked("details")}
              onChange={(e) => setDetails(e.target.value)}
            ></textarea>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Upload marketing material * <span className="text-secondary fw-normal">(PDF/Image — one or more)</span>
              {isQueryMode && !locked("marketingFiles") && (
                <span className="badge bg-info-subtle text-info ms-2">
                  BD asked about this
                </span>
              )}
            </label>
            <input
              type="file"
              className="form-control"
              accept=".pdf,image/*"
              multiple
              disabled={locked("marketingFiles")}
              onChange={(e) => {
                const names = Array.from(e.target.files || []).map(
                  (f) => f.name,
                );
                if (names.length > 0) {
                  setMarketingFiles((prev) => [...prev, ...names]);
                }
                e.target.value = "";
              }}
            />
            {marketingFiles.length > 0 && (
              <div className="mt-1">
                {marketingFiles.map((f, i) => (
                  <div
                    key={i}
                    className="small text-secondary d-flex align-items-center gap-2"
                  >
                    <span>📎 {f}</span>
                    {!locked("marketingFiles") && (
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 text-danger"
                        style={{ fontSize: 11 }}
                        onClick={() =>
                          setMarketingFiles((prev) =>
                            prev.filter((_, idx) => idx !== i),
                          )
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Upload builder request letter{" "}
              {audience === "HDFC Bank customers" && (
                <span className="text-danger">*</span>
              )}
              {isQueryMode && !locked("builderLetterFile") && (
                <span className="badge bg-info-subtle text-info ms-2">
                  BD asked about this
                </span>
              )}
            </label>
            <input
              type="file"
              className="form-control"
              disabled={locked("builderLetterFile")}
              onChange={(e) =>
                setBuilderLetterFile(e.target.files?.[0]?.name || "")
              }
            />
            <div className="form-text">
              Required only if this campaign is being hosted for{" "}
              <b>HDFC Bank customers</b> — a signed letter from the
              builder requesting HDFC to host the campaign for its own
              customers. Not needed for a campaign open to all
              customers.
            </div>
            {builderLetterFile && (
              <div className="small text-secondary mt-1">
                Attached: {builderLetterFile}
              </div>
            )}
          </div>
          {isQueryMode && (
            <div className="col-12">
              <label className="form-label small fw-semibold">
                Response to BD's query *
              </label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Explain what you've changed, or answer BD's question…"
                value={queryResponse}
                onChange={(e) => setQueryResponse(e.target.value)}
              ></textarea>
            </div>
          )}
        </div>

        {formError && (
          <div className="small text-danger mt-3">{formError}</div>
        )}

        {savedDraft && !submitted && (
          <div className="alert alert-warning small mt-3">
            ✓ Saved as <b>Draft</b> — not yet sent to any BD team.
            Come back and hit "Submit for approval" when it's ready.
          </div>
        )}

        {submitted && (
          <div className="alert alert-success small mt-3">
            ✓ Submitted — status is now <b>In Process</b>. Pushed to
            the BD team dashboard(s) for {projects.join(", ")} in
            HDFC's PAMS system, with an automatic email notification.
            This screen will show <b>Approved</b> or{" "}
            <b>Rejected</b> here once PAMS records a decision.
          </div>
        )}

        {responded && (
          <div className="alert alert-success small mt-3">
            ✓ Response sent to BD — status is back to{" "}
            <b>In Process</b> for another review.
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button className="btn btn-outline-navy" onClick={onDone}>
            {editingCampaign ? "Back to list" : "Cancel"}
          </button>
          {isQueryMode ? (
            <button className="btn btn-navy" onClick={handleRespondToQuery}>
              Resubmit response
            </button>
          ) : (
            <>
              <button className="btn btn-outline-navy" onClick={handleSaveDraft}>
                Save as draft
              </button>
              <button className="btn btn-navy" onClick={handleSubmit}>
                Submit for approval
              </button>
            </>
          )}
        </div>
      </FormCard>
    </div>
  );
}
