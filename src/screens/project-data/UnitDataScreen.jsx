// src/screens/project-data/UnitDataScreen.jsx
// Provides (global): UnitDataScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function UnitDataScreen({ onMenuClick }) {
  const [unitDataProject, setUnitDataProject] = useState(
    BUILDER_PROJECT_NAMES[0],
  );
  // Select Building always cascades from Select Project — the BRD's
  // "using select project option" / "using select Building option"
  // are the two steps of one scoping flow, not separate modes.
  // Building defaults to "--Select--" (empty): leaving it unselected
  // means the template/upload covers every building in the project;
  // choosing one scopes it to just that building.
  const buildingOptions = buildingsForProject(unitDataProject);
  const [building, setBuilding] = useState("");
  const [remark, setRemark] = useState("");
  const [parsedRows, setParsedRows] = useState(null);
  const [headerWarning, setHeaderWarning] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    setSubmitted(false);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const rows = parseCsv(String(e.target.result || ""));
      if (rows.length === 0) {
        setParsedRows([]);
        setHeaderWarning("The file appears to be empty.");
        return;
      }
      const header = rows[0].map((h) => h.trim());
      const expected = UNIT_DATA_COLUMNS;
      const matches = expected.every(
        (col, i) => (header[i] || "").toLowerCase() === col.toLowerCase(),
      );
      const dataRows = rows.slice(1);
      let warning = matches
        ? ""
        : "Column headers don't exactly match the template — upload will still be attempted, but please double-check before submitting.";
      if (building) {
        const otherBuildings = dataRows.filter(
          (r) => (r[0] || "").trim() && r[0].trim() !== building,
        );
        if (otherBuildings.length > 0) {
          warning +=
            (warning ? " Also, " : "") +
            otherBuildings.length +
            " row(s) have a Building value other than " +
            building +
            ", which you selected above — double-check before submitting.";
        }
      }
      setHeaderWarning(warning);
      setParsedRows(dataRows);
    };
    reader.readAsText(file);
  }

  function handleSubmit() {
    if (!parsedRows || parsedRows.length === 0) return;
    setSubmitted(true);
  }

  function resetUpload() {
    setParsedRows(null);
    setFileName("");
    setHeaderWarning("");
    setSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      <TopBar
        title="Unit Data Upload"
        sub="Select project and building, download the template, fill it in, and upload it back"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <ProjectPickerField
              label="Select project"
              value={unitDataProject}
              onChange={(v) => {
                setUnitDataProject(v);
                setBuilding("");
                resetUpload();
              }}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Select building
            </label>
            <select
              className="form-select"
              value={building}
              onChange={(e) => {
                setBuilding(e.target.value);
                resetUpload();
              }}
            >
              <option value="">--Select--</option>
              {buildingOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <div className="form-text">
              {building
                ? "Template and upload will be scoped to " + building + "."
                : "Left as --Select--: the template covers every building in this project, and the upload can include units from any of them."}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline-navy btn-sm mb-2"
          onClick={() =>
            downloadUnitDataTemplate(building, unitDataProject, buildingOptions)
          }
        >
          📊 Download unit data template (.csv)
        </button>
        <details className="mb-3">
          <summary
            className="small text-secondary"
            style={{ cursor: "pointer" }}
          >
            What's included in the template?
          </summary>
          <div className="small text-secondary mt-2">
            {UNIT_DATA_COLUMNS.join(", ")}.
          </div>
        </details>

        <div className="mb-3">
          <label className="form-label small fw-semibold">
            📊 Upload completed template (CSV) *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="form-control"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <div className="form-text">
            Opens in Excel — save as CSV before uploading back here.
          </div>
        </div>

        {headerWarning && (
          <div className="small text-warning mb-2">
            ⚠ {headerWarning}
          </div>
        )}

        {parsedRows && parsedRows.length > 0 && (
          <div className="mb-3">
            <div className="small fw-semibold mb-2">
              {parsedRows.length} unit{parsedRows.length > 1 ? "s" : ""}{" "}
              found in {fileName} — preview:
            </div>
            <div
              className="table-responsive kpi-card p-0"
              style={{ maxHeight: 260, overflowY: "auto" }}
            >
              <table className="table table-sm mb-0">
                <thead>
                  <tr className="text-secondary small">
                    {UNIT_DATA_COLUMNS.map((c, i) => (
                      <th key={i} style={{ whiteSpace: "nowrap" }}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 25).map((r, i) => (
                    <tr key={i} className="small">
                      {UNIT_DATA_COLUMNS.map((c, j) => (
                        <td key={j} style={{ whiteSpace: "nowrap" }}>
                          {r[j] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length > 25 && (
              <div className="small text-secondary mt-1">
                Showing first 25 of {parsedRows.length} rows.
              </div>
            )}
          </div>
        )}

        {parsedRows && parsedRows.length === 0 && (
          <div className="small text-danger mb-3">
            No unit rows were found in that file — check it has data
            below the header row.
          </div>
        )}

        <div className="mb-3">
          <label className="form-label small fw-semibold">Remark</label>
          <input
            className="form-control"
            placeholder="e.g. Phase 1 units, tower A"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>

        {submitted && (
          <div className="alert alert-success small py-2">
            ✓ {parsedRows.length} unit{parsedRows.length > 1 ? "s" : ""}{" "}
            submitted for{" "}
            {building || "all buildings in " + unitDataProject}.
          </div>
        )}

        <FormActions
          primary="Upload"
          onPrimary={handleSubmit}
          onCancel={resetUpload}
        />
      </FormCard>
    </div>
  );
}
