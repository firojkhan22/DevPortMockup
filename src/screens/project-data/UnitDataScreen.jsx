// src/screens/project-data/UnitDataScreen.jsx
// Provides (global): UnitDataScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function UnitDataScreen({ onMenuClick, currentUserName }) {
  const me = currentUserName || "Firoj Khan";

  const [unitDataProject, setUnitDataProject] = useState(
    BUILDER_PROJECT_NAMES[0],
  );
  const buildingOptions = buildingsForProject(unitDataProject);

  // Select building is a multi-select — one, several, or all buildings.
  const [buildings, setBuildings] = useState([]);
  const [templateType, setTemplateType] = useState("");
  const [remark, setRemark] = useState("");

  const [projectError, setProjectError] = useState("");
  const [templateTypeError, setTemplateTypeError] = useState("");
  const [buildingError, setBuildingError] = useState("");
  const [fileError, setFileError] = useState("");

  const [parsedRows, setParsedRows] = useState(null);
  const [headerWarning, setHeaderWarning] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileExt, setFileExt] = useState("");
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  // Upload history grid (previously submitted files).
  const [uploads, setUploads] = useState(UNIT_DATA_UPLOADS_INITIAL);
  const [buildingsPopup, setBuildingsPopup] = useState(null);

  const columns = unitDataColumnsFor(templateType);

  function resetUpload() {
    setParsedRows(null);
    setFileName("");
    setFileExt("");
    setFileDataUrl(null);
    setHeaderWarning("");
    setFileError("");
    setSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFile(file) {
    if (!file) return;
    setSubmitted(false);
    setHeaderWarning("");
    setParsedRows(null);
    setFileName(file.name);
    const ext = unitUploadFileExt(file.name);
    setFileExt(ext);

    if (!unitUploadExtValid(file.name)) {
      setFileError(
        "Invalid file format. Please select a supported file type (.xlsx / .csv / .pdf).",
      );
      setFileDataUrl(null);
      return;
    }
    setFileError("");

    // Keep the raw file so the user can re-download it later.
    const urlReader = new FileReader();
    urlReader.onload = (e) => setFileDataUrl(e.target.result);
    urlReader.readAsDataURL(file);

    // Only CSV can be parsed / previewed / structure-checked in the
    // prototype — .xlsx and .pdf are accepted and left for the
    // server to validate.
    if (ext !== "csv") {
      setHeaderWarning(
        "Preview and row count aren't shown for ." +
          ext +
          " files here — structure will be validated on the server after upload.",
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const rows = parseCsv(String(e.target.result || ""));
      if (rows.length === 0) {
        setParsedRows([]);
        setFileError("The file appears to be empty.");
        return;
      }
      const header = rows[0].map((h) => h.trim());
      const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
      const structureOk =
        columns.length === header.length &&
        columns.every((col, i) => norm(header[i] || "") === norm(col));
      const dataRows = rows.slice(1);

      if (!structureOk) {
        setFileError(
          'Invalid file structure — the column headers don’t match the "' +
            templateType +
            '" template. Download the template above, fill it in, and upload it again.',
        );
        setParsedRows(null);
        return;
      }

      let warning = "";
      const selectedNames =
        buildings.length === 0 || buildings.length === buildingOptions.length
          ? null
          : buildings;
      if (selectedNames) {
        const other = dataRows.filter(
          (r) => (r[0] || "").trim() && !selectedNames.includes(r[0].trim()),
        );
        if (other.length > 0) {
          warning =
            other.length +
            " row(s) have a Building value outside your selected buildings — double-check before submitting.";
        }
      }
      setHeaderWarning(warning);
      setFileError("");
      setParsedRows(dataRows);
    };
    reader.readAsText(file);
  }

  function validate() {
    let ok = true;
    if (!unitDataProject) {
      setProjectError("Select a project.");
      ok = false;
    } else setProjectError("");

    if (!templateType) {
      setTemplateTypeError("Select a template type.");
      ok = false;
    } else setTemplateTypeError("");

    if (buildings.length === 0) {
      setBuildingError("Select at least one building (or choose All buildings).");
      ok = false;
    } else setBuildingError("");

    if (!fileName) {
      setFileError("Upload the completed template file.");
      ok = false;
    } else if (fileError) {
      ok = false;
    } else if (fileExt === "csv" && (!parsedRows || parsedRows.length === 0)) {
      setFileError("No unit rows were found in that file.");
      ok = false;
    }
    return ok;
  }

  function handleSubmit() {
    if (!validate()) return;
    const scoped =
      buildings.length === buildingOptions.length
        ? [...buildingOptions]
        : [...buildings];
    const record = {
      id: "ud" + Date.now(),
      fileName,
      templateType,
      buildings: scoped,
      projectName: unitDataProject,
      rowCount: parsedRows ? parsedRows.length : null,
      createdBy: me,
      updatedBy: me,
      uploadedOn: new Date()
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", ""),
      remark,
      csvText: null,
      dataUrl: fileDataUrl,
    };
    setUploads((prev) => [record, ...prev]);
    setSubmitted(true);
  }

  function exportComplete() {
    if (parsedRows && parsedRows.length > 0) {
      const rows = [columns, ...parsedRows.map((r) => columns.map((_, i) => r[i] || ""))];
      const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
      triggerDownload(
        new Blob([csv], { type: "text/csv;charset=utf-8;" }),
        (unitDataProject || "Project").replace(/[^a-z0-9]+/gi, "_") +
          "_unit_data_complete.csv",
      );
    } else if (fileDataUrl) {
      triggerDownloadHref(fileDataUrl, fileName);
    }
  }

  function downloadUploadFile(u) {
    if (u.dataUrl) {
      triggerDownloadHref(u.dataUrl, u.fileName);
    } else if (u.csvText) {
      triggerDownload(
        new Blob([u.csvText], { type: "text/csv;charset=utf-8;" }),
        u.fileName,
      );
    }
  }

  function triggerDownload(blob, name) {
    const url = URL.createObjectURL(blob);
    triggerDownloadHref(url, name);
    URL.revokeObjectURL(url);
  }
  function triggerDownloadHref(href, name) {
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const downloadLabel = templateType
    ? "📊 Download " + templateType + " template (Excel / CSV)"
    : "📊 Download template — select a Template Type first";

  return (
    <div>
      <TopBar
        title="Unit Data Upload"
        sub="Select project, buildings and template type, download the template, fill it in, and upload it back"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <ProjectPickerField
              label="Select project"
              required
              value={unitDataProject}
              onChange={(v) => {
                setUnitDataProject(v);
                setBuildings([]);
                setProjectError("");
                resetUpload();
              }}
            />
            {projectError && (
              <div className="invalid-feedback d-block">{projectError}</div>
            )}
          </div>
          <div className="col-12 col-md-6">
            <MultiSelectDropdown
              label="Select building"
              options={buildingOptions}
              value={buildings}
              onChange={(v) => {
                setBuildings(v);
                if (v.length) setBuildingError("");
                resetUpload();
              }}
              allLabel="All buildings"
              placeholder="--Select--"
              invalid={buildingError}
              help={
                buildings.length === 0
                  ? "Pick one, several, or All buildings — the template and upload are scoped to your selection."
                  : buildings.length === buildingOptions.length
                    ? "All buildings in this project are in scope."
                    : buildings.length + " building(s) in scope."
              }
            />
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Template Type *
            </label>
            <select
              className={
                "form-select" + (templateTypeError ? " is-invalid" : "")
              }
              value={templateType}
              onChange={(e) => {
                setTemplateType(e.target.value);
                setTemplateTypeError("");
                resetUpload();
              }}
            >
              <option value="">--Select--</option>
              {UNIT_DATA_TEMPLATE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {templateTypeError && (
              <div className="invalid-feedback d-block">
                {templateTypeError}
              </div>
            )}
            <div className="form-text">
              Drives the template columns and how the uploaded file is
              validated.
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-outline-navy btn-sm mb-2"
          disabled={!templateType}
          onClick={() =>
            downloadUnitDataTemplate(
              templateType,
              buildings,
              unitDataProject,
              buildingOptions,
            )
          }
        >
          {downloadLabel}
        </button>
        {templateType && (
          <details className="mb-3">
            <summary
              className="small text-secondary"
              style={{ cursor: "pointer" }}
            >
              What's included in the {templateType} template?
            </summary>
            <div className="small text-secondary mt-2">
              {columns.join(", ")}.
            </div>
          </details>
        )}

        <div className="mb-3">
          <label className="form-label small fw-semibold">
            📤 Upload template file *
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.pdf,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className={"form-control" + (fileError ? " is-invalid" : "")}
            disabled={!templateType}
            onChange={(e) => handleFile(e.target.files && e.target.files[0])}
          />
          <div className="form-text">
            Accepted formats: <b>.XLSX</b>, <b>.CSV</b>, <b>.PDF</b>.
            {!templateType && " Select a Template Type first."}
          </div>
          {fileError && (
            <div className="invalid-feedback d-block">{fileError}</div>
          )}
        </div>

        {headerWarning && (
          <div className="small text-warning mb-2">⚠ {headerWarning}</div>
        )}

        {fileName && !fileError && fileExt !== "csv" && (
          <div className="small text-secondary mb-3">
            📎 {fileName} attached — will be validated and imported on the
            server.
          </div>
        )}

        {parsedRows && parsedRows.length > 0 && (
          <div className="mb-3">
            <div className="small fw-semibold mb-2">
              {parsedRows.length} unit{parsedRows.length > 1 ? "s" : ""} found
              in {fileName} — preview:
            </div>
            <div
              className="table-responsive kpi-card p-0"
              style={{ maxHeight: 260, overflowY: "auto" }}
            >
              <table className="table table-sm mb-0">
                <thead>
                  <tr className="text-secondary small">
                    {columns.map((c, i) => (
                      <th key={i} style={{ whiteSpace: "nowrap" }}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 25).map((r, i) => (
                    <tr key={i} className="small">
                      {columns.map((c, j) => (
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
          <div className="alert alert-success d-flex align-items-start gap-2 py-2">
            <span style={{ fontSize: 18 }}>✅</span>
            <div className="flex-fill">
              <div className="small">
                <b>{fileName}</b> — The unit data has been uploaded and
                submitted successfully.
              </div>
              <button
                type="button"
                className="btn btn-outline-navy btn-sm mt-2"
                onClick={exportComplete}
              >
                ⬇ Export complete file (CSV / Excel)
              </button>
            </div>
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            type="button"
            className="btn btn-outline-navy"
            onClick={resetUpload}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-navy"
            onClick={handleSubmit}
          >
            Upload
          </button>
        </div>
      </FormCard>

      <div className="mt-4">
        <div className="fw-semibold small mb-2" style={{ color: "var(--navy)" }}>
          Uploaded unit data files
        </div>
        <div className="kpi-card p-0 table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr className="text-secondary small">
                <th>File Name</th>
                <th>Building Number</th>
                <th>Project Name</th>
                <th>Created By</th>
                <th>Updated By</th>
                <th style={{ whiteSpace: "nowrap" }}>Uploaded on</th>
              </tr>
            </thead>
            <tbody>
              {uploads.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-secondary py-4">
                    No unit data files uploaded yet.
                  </td>
                </tr>
              )}
              {uploads.map((u) => {
                const b = summariseBuildings(u.buildings);
                return (
                  <tr key={u.id}>
                    <td>
                      <button
                        type="button"
                        className="btn btn-link btn-sm p-0 text-start"
                        title={"Download " + u.fileName}
                        onClick={() => downloadUploadFile(u)}
                      >
                        {u.fileName}
                      </button>
                      <div className="text-secondary" style={{ fontSize: 11 }}>
                        {u.templateType}
                        {u.rowCount != null ? " · " + u.rowCount + " units" : ""}
                      </div>
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span
                        role="button"
                        className="text-decoration-underline"
                        title={b.full}
                        onClick={() =>
                          setBuildingsPopup({
                            fileName: u.fileName,
                            list: u.buildings,
                          })
                        }
                      >
                        {b.text}
                      </span>
                    </td>
                    <td>{u.projectName}</td>
                    <td>{u.createdBy}</td>
                    <td>{u.updatedBy}</td>
                    <td style={{ whiteSpace: "nowrap" }}>{u.uploadedOn}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {buildingsPopup && (
        <Modal
          title={"Buildings — " + buildingsPopup.fileName}
          onClose={() => setBuildingsPopup(null)}
          width={460}
        >
          {(!buildingsPopup.list || buildingsPopup.list.length === 0) && (
            <div className="small text-secondary">All buildings in project.</div>
          )}
          <ol className="small mb-0 ps-3">
            {(buildingsPopup.list || []).map((b, i) => (
              <li key={i} className="py-1">
                {b}
              </li>
            ))}
          </ol>
        </Modal>
      )}
    </div>
  );
}
