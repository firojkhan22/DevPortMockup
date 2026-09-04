// src/screens/business/LeadsEntryScreen.jsx
// Provides (global): LeadsEntryScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function LeadsEntryScreen({
  onMenuClick,
  onDone,
  initialMode,
  editingLead,
  onSaveDraft,
  onSubmitToBank,
  onBulkSubmit,
}) {
  const [mode, setMode] = useState(initialMode || "single");

  // ---- Single lead ----
  const [leadType, setLeadType] = useState(
    editingLead ? editingLead.leadType : "Non-BSA",
  );
  const [bsaCode, setBsaCode] = useState(
    editingLead ? editingLead.bsaCode : "",
  );
  const [leadProject, setLeadProject] = useState(
    editingLead ? editingLead.project : "",
  );
  const [leadBuilding, setLeadBuilding] = useState(
    editingLead ? editingLead.building : "",
  );
  const [unitNumber, setUnitNumber] = useState(
    editingLead ? editingLead.unitNumber : "",
  );
  const [propertyNumber, setPropertyNumber] = useState(
    editingLead ? editingLead.propertyNumber : "",
  );
  const [firstName, setFirstName] = useState(
    editingLead ? editingLead.firstName : "",
  );
  const [middleName, setMiddleName] = useState(
    editingLead ? editingLead.middleName : "",
  );
  const [surname, setSurname] = useState(
    editingLead ? editingLead.surname : "",
  );
  const [email, setEmail] = useState(editingLead ? editingLead.email : "");
  const [mobile, setMobile] = useState(
    editingLead ? editingLead.mobile : "",
  );
  const [employment, setEmployment] = useState(
    editingLead ? editingLead.employment : "",
  );
  const [submittedLead, setSubmittedLead] = useState(null);
  const [savedDraft, setSavedDraft] = useState(false);
  const [formError, setFormError] = useState("");

  const buildingOptionsForLead = leadProject
    ? buildingsForProject(leadProject)
    : [];

  function currentFormData() {
    return {
      leadType,
      bsaCode,
      project: leadProject,
      building: leadBuilding,
      unitNumber,
      propertyNumber,
      firstName,
      middleName,
      surname,
      email,
      mobile,
      employment,
    };
  }

  function validate() {
    if (
      !leadProject ||
      !propertyNumber.trim() ||
      !firstName.trim() ||
      !surname.trim() ||
      !mobile.trim()
    ) {
      setFormError(
        "Project, property number, customer first name, surname, and mobile number are required.",
      );
      return false;
    }
    if (leadType === "BSA" && !bsaCode) {
      setFormError("Select a BSA code, or switch to Non-BSA.");
      return false;
    }
    setFormError("");
    return true;
  }

  function handleSaveDraft() {
    if (!validate()) return;
    onSaveDraft(currentFormData(), editingLead ? editingLead.key : null);
    setSavedDraft(true);
  }

  function handleSubmitToBank() {
    if (!validate()) return;
    const result = onSubmitToBank(
      currentFormData(),
      editingLead ? editingLead.key : null,
    );
    setSubmittedLead(result);
  }

  // ---- Bulk upload ----
  const [bulkProject, setBulkProject] = useState("");
  const [bulkRows, setBulkRows] = useState(null);
  const [bulkFileName, setBulkFileName] = useState("");
  const [bulkWarning, setBulkWarning] = useState("");
  const [bulkSubmitted, setBulkSubmitted] = useState(false);
  const bulkFileInputRef = useRef(null);

  function handleBulkFile(file) {
    if (!file) return;
    setBulkSubmitted(false);
    setBulkFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const rows = parseCsv(String(e.target.result || ""));
      if (rows.length === 0) {
        setBulkRows([]);
        setBulkWarning("The file appears to be empty.");
        return;
      }
      const header = rows[0].map((h) => h.trim());
      const matches = LEAD_DATA_COLUMNS.every(
        (col, i) => (header[i] || "").toLowerCase() === col.toLowerCase(),
      );
      setBulkWarning(
        matches
          ? ""
          : "Column headers don't exactly match the template — upload will still be attempted, but please double-check before submitting.",
      );
      setBulkRows(rows.slice(1));
    };
    reader.readAsText(file);
  }

  function resetBulkUpload() {
    setBulkRows(null);
    setBulkFileName("");
    setBulkWarning("");
    setBulkSubmitted(false);
    if (bulkFileInputRef.current) bulkFileInputRef.current.value = "";
  }

  function handleBulkSubmit() {
    if (!bulkProject || !bulkRows || bulkRows.length === 0) return;
    onBulkSubmit(bulkProject, bulkRows);
    setBulkSubmitted(true);
  }

  return (
    <div>
      <TopBar
        title="Customer Lead Entry"
        sub={
          editingLead
            ? "Editing draft lead — save again, or submit to the bank"
            : "Single entry, or switch to bulk upload below"
        }
        onMenuClick={onMenuClick}
      />
      {!editingLead && (
        <div className="btn-group btn-group-sm mb-3">
          <button
            className={
              "btn " +
              (mode === "single" ? "btn-navy" : "btn-outline-secondary")
            }
            onClick={() => setMode("single")}
          >
            Single lead
          </button>
          <button
            className={
              "btn " +
              (mode === "bulk" ? "btn-navy" : "btn-outline-secondary")
            }
            onClick={() => setMode("bulk")}
          >
            Bulk upload
          </button>
        </div>
      )}
      <FormCard>
        {mode === "single" ? (
          <div>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Lead type *
                </label>
                <select
                  className="form-select"
                  value={leadType}
                  onChange={(e) => {
                    setLeadType(e.target.value);
                    setBsaCode("");
                  }}
                >
                  <option>Non-BSA</option>
                  <option>BSA</option>
                </select>
              </div>
              {leadType === "BSA" && (
                <div className="col-12 col-md-8">
                  <label className="form-label small fw-semibold">
                    BSA code *
                  </label>
                  <select
                    className="form-select"
                    value={bsaCode}
                    onChange={(e) => setBsaCode(e.target.value)}
                  >
                    <option value="">Select…</option>
                    {BUILDER_BSA_CODES.map((b) => (
                      <option key={b.code} value={b.code}>
                        {b.label}
                      </option>
                    ))}
                  </select>
                  <div className="form-text">
                    Only BSA codes mapped to this builder / builder
                    group are shown.
                  </div>
                </div>
              )}
              <div className="col-12 col-md-4">
                <ProjectPickerField
                  label="Project / project lead"
                  required
                  value={leadProject}
                  onChange={(v) => {
                    setLeadProject(v);
                    setLeadBuilding("");
                  }}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Building{" "}
                  <span className="text-secondary fw-normal">
                    (optional)
                  </span>
                </label>
                <select
                  className="form-select"
                  value={leadBuilding}
                  onChange={(e) => setLeadBuilding(e.target.value)}
                  disabled={!leadProject}
                >
                  <option value="">--Select--</option>
                  {buildingOptionsForLead.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Project city
                </label>
                <input
                  className="form-control"
                  value={leadProject ? cityFor(leadProject) : ""}
                  disabled
                  placeholder="Auto-filled from project"
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Unit number
                </label>
                <input
                  className="form-control"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Property number *
                </label>
                <input
                  className="form-control"
                  value={propertyNumber}
                  onChange={(e) => setPropertyNumber(e.target.value)}
                  placeholder="As per the sale agreement / allotment letter"
                />
              </div>
            </div>

            <div className="row g-3 mt-0">
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Customer first name *
                </label>
                <input
                  className="form-control"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Middle name
                </label>
                <input
                  className="form-control"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Surname *
                </label>
                <input
                  className="form-control"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
            </div>

            <div className="row g-3 mt-0">
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Mobile number *
                </label>
                <input
                  className="form-control"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Email{" "}
                  <span className="text-secondary fw-normal">
                    (optional)
                  </span>
                </label>
                <input
                  className="form-control"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">
                  Employed / Self-employed{" "}
                  <span className="text-secondary fw-normal">
                    (optional)
                  </span>
                </label>
                <select
                  className="form-select"
                  value={employment}
                  onChange={(e) => setEmployment(e.target.value)}
                >
                  <option value="">--Select--</option>
                  <option>Employed</option>
                  <option>Self-employed</option>
                </select>
              </div>
            </div>

            {leadProject && (
              <div className="kpi-card p-3 mt-3 small">
                <div className="fw-semibold mb-1">
                  System-derived fields (filled in automatically —
                  nothing to type here)
                </div>
                <div className="row g-2 text-secondary">
                  <div className="col-6 col-md-4">
                    Submitted by
                    <div className="fw-semibold text-dark">
                      Firoj Khan
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    Today's date
                    <div className="fw-semibold text-dark">
                      11 Aug 2026
                    </div>
                  </div>
                  <div className="col-6 col-md-4">
                    Project number
                    <div className="fw-semibold text-dark">
                      {projectNumberFor(leadProject)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {formError && (
              <div className="small text-danger mt-3">{formError}</div>
            )}

            {savedDraft && !submittedLead && (
              <div className="alert alert-warning small mt-3">
                ✓ Saved as <b>Draft</b> — this lead is only visible
                inside the developer portal so far. It hasn't been
                shared with the bank yet. Come back and hit "Submit to
                bank" when it's ready.
              </div>
            )}

            {submittedLead && (
              <div className="alert alert-success small mt-3">
                ✓ Lead <b>{submittedLead.leadId}</b> submitted — status:{" "}
                <b>In process</b>. Pushed to the bank's lead-management
                system under project number {submittedLead.projNo}.
                Channel-partner executives mapped to{" "}
                {submittedLead.project} have been notified by email.
              </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-3">
              <button className="btn btn-outline-navy" onClick={onDone}>
                {editingLead ? "Back to list" : "Cancel"}
              </button>
              <button
                className="btn btn-outline-navy"
                onClick={handleSaveDraft}
              >
                Save as Draft
              </button>
              <button className="btn btn-navy" onClick={handleSubmitToBank}>
                Submit to Bank
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <ProjectPickerField
                  label="Project"
                  required
                  value={bulkProject}
                  onChange={(v) => {
                    setBulkProject(v);
                    resetBulkUpload();
                  }}
                />
                <div className="form-text">
                  Every lead in the uploaded file is stamped with this
                  project's number, builder number, and city.
                </div>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline-navy btn-sm mb-3"
              onClick={() => downloadLeadTemplate(bulkProject)}
            >
              📊 Download bulk lead template (.csv)
            </button>
            <details className="mb-3">
              <summary
                className="small text-secondary"
                style={{ cursor: "pointer" }}
              >
                What's included in the template?
              </summary>
              <div className="small text-secondary mt-2">
                {LEAD_DATA_COLUMNS.join(", ")}.
              </div>
            </details>
            <div className="mb-3">
              <label className="form-label small fw-semibold">
                📊 Upload completed template (CSV) *
              </label>
              <input
                ref={bulkFileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="form-control"
                disabled={!bulkProject}
                onChange={(e) => handleBulkFile(e.target.files?.[0])}
              />
              {!bulkProject && (
                <div className="form-text">
                  Select a project above first.
                </div>
              )}
            </div>

            {bulkWarning && (
              <div className="small text-warning mb-2">
                ⚠ {bulkWarning}
              </div>
            )}

            {bulkRows && bulkRows.length > 0 && (
              <div className="mb-3">
                <div className="small fw-semibold mb-2">
                  {bulkRows.length} lead{bulkRows.length > 1 ? "s" : ""}{" "}
                  found in {bulkFileName} — preview:
                </div>
                <div
                  className="table-responsive kpi-card p-0"
                  style={{ maxHeight: 260, overflowY: "auto" }}
                >
                  <table className="table table-sm mb-0">
                    <thead>
                      <tr className="text-secondary small">
                        {LEAD_DATA_COLUMNS.map((c, i) => (
                          <th key={i} style={{ whiteSpace: "nowrap" }}>
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bulkRows.slice(0, 25).map((r, i) => (
                        <tr key={i} className="small">
                          {LEAD_DATA_COLUMNS.map((c, j) => (
                            <td key={j} style={{ whiteSpace: "nowrap" }}>
                              {r[j] || ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {bulkSubmitted && (
              <div className="alert alert-success small">
                ✓ {bulkRows.length} lead{bulkRows.length > 1 ? "s" : ""}{" "}
                submitted for {bulkProject} — status <b>In process</b> —
                project number {projectNumberFor(bulkProject)}, city{" "}
                {cityFor(bulkProject)}. Pushed to the bank's
                lead-management system; channel-partner executives
                mapped to this project have been notified by email.
              </div>
            )}

            <FormActions
              primary="Upload"
              onPrimary={handleBulkSubmit}
              onCancel={onDone}
            />
          </div>
        )}
      </FormCard>
    </div>
  );
}
