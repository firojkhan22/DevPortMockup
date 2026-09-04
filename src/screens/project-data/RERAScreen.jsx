// src/screens/project-data/RERAScreen.jsx
// Provides (global): RERAScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 8. RERA UPDATE (split, RERA only) ================= */
function RERAScreen({ onMenuClick }) {
  // Mock of the project's existing RERA-registered rows (would come
  // from the project record in the real build). Under RERA law an
  // extension amends the SAME registration number's validity date —
  // it does not create a new certificate — so this screen offers two
  // distinct modes instead of one form that conflated them.
  const EXISTING_RERA_ROWS = [
    {
      id: "row1",
      project: "Riverside Heights",
      building: "Wing A",
      regNumber: "P51800012345",
      validFrom: "2022-01-15",
      validTo: "2025-06-30",
    },
    {
      id: "row2",
      project: "Riverside Heights",
      building: "Wing B",
      regNumber: "P51800012346",
      validFrom: "2022-01-15",
      validTo: "2024-12-31",
    },
  ];

  const [project, setProject] = useState("Riverside Heights");
  const [mode, setMode] = useState("extend"); // "extend" | "new"

  // --- Extension mode: pick an existing certificate, edit only
  // the fields RERA actually allows to change on extension.
  const projectRows = EXISTING_RERA_ROWS.filter(
    (r) => r.project === project
  );
  const [selectedRowId, setSelectedRowId] = useState(
    projectRows[0] ? projectRows[0].id : ""
  );
  const selectedRow = projectRows.find((r) => r.id === selectedRowId);
  const [newValidTo, setNewValidTo] = useState("");
  const [extensionAppDate, setExtensionAppDate] = useState("");
  const [extensionRemark, setExtensionRemark] = useState("");
  const [extensionDoc, setExtensionDoc] = useState("");
  const [touched, setTouched] = useState(false);

  const extensionError =
    selectedRow && newValidTo && newValidTo <= selectedRow.validTo
      ? "The new valid-to date must be later than the current valid-to date (" +
        selectedRow.validTo +
        ") — an extension order can only push the date forward."
      : !newValidTo
      ? "New valid-to date is required."
      : !extensionRemark.trim()
      ? "Remarks are required."
      : "";

  // --- New registration mode: reuses the same row model/validation
  // as project creation, for a building that genuinely has no RERA
  // record on this project yet.
  const [newRow, setNewRow] = useState({
    path: "registered",
    building: "",
    regNumber: "",
    validFrom: "",
    validTo: "",
    applicationNumber: "",
    applicationDate: "",
    expectedApprovalDate: "",
    remarks: "",
  });
  function updateNewRow(field, value) {
    setNewRow((prev) => ({ ...prev, [field]: value }));
  }
  const newRowErrors = validateReraRow(newRow);
  const newRowDup =
    newRow.path === "registered" &&
    newRow.regNumber &&
    projectRows.some(
      (r) =>
        r.regNumber.trim().toUpperCase() ===
        newRow.regNumber.trim().toUpperCase()
    );

  return (
    <div>
      <TopBar
        title="RERA Detail Update"
        sub="Standalone post-creation update, project-wise"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <ProjectPickerField
              label="Select project"
              value={project}
              onChange={(p) => {
                setProject(p);
                setSelectedRowId("");
              }}
            />
          </div>
          <div className="col-12 col-md-8">
            <label className="form-label small fw-semibold mb-1 d-block">
              What are you updating? *
            </label>
            <div className="d-flex gap-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rera-update-mode"
                  checked={mode === "extend"}
                  onChange={() => setMode("extend")}
                  disabled={projectRows.length === 0}
                />
                <label className="form-check-label small">
                  Extend / amend an existing certificate
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rera-update-mode"
                  checked={mode === "new"}
                  onChange={() => setMode("new")}
                />
                <label className="form-check-label small">
                  Register a building not yet on file
                </label>
              </div>
            </div>
          </div>
        </div>

        {mode === "extend" && (
          <>
            {projectRows.length === 0 ? (
              <div className="kpi-card p-3 mb-2 bg-light small text-secondary">
                No RERA certificate is on file for this project yet.
                Switch to "Register a building not yet on file".
              </div>
            ) : (
              <>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">
                      Existing RERA certificate *
                    </label>
                    <select
                      className="form-select"
                      value={selectedRowId}
                      onChange={(e) => {
                        setSelectedRowId(e.target.value);
                        setNewValidTo("");
                        setTouched(false);
                      }}
                    >
                      {projectRows.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.building} — {r.regNumber} (valid till{" "}
                          {r.validTo})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedRow && (
                  <div className="row g-3 mt-1">
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        RERA registration number
                      </label>
                      <input
                        className="form-control"
                        value={selectedRow.regNumber}
                        disabled
                      />
                      <div className="form-text">
                        Locked — an extension keeps the same
                        registration number.
                      </div>
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        Current valid-to date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={selectedRow.validTo}
                        disabled
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        New valid-to date *
                      </label>
                      <input
                        type="date"
                        className={
                          "form-control" +
                          (touched && extensionError
                            ? " is-invalid"
                            : "")
                        }
                        value={newValidTo}
                        min={selectedRow.validTo}
                        onChange={(e) => setNewValidTo(e.target.value)}
                        onBlur={() => setTouched(true)}
                      />
                      {touched && extensionError && (
                        <div className="invalid-feedback">
                          {extensionError}
                        </div>
                      )}
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        Extension application date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        value={extensionAppDate}
                        onChange={(e) =>
                          setExtensionAppDate(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-8">
                      <label className="form-label small fw-semibold">
                        Attach extension order / supporting document
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) =>
                          setExtensionDoc(
                            e.target.files && e.target.files[0]
                              ? e.target.files[0].name
                              : ""
                          )
                        }
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label small fw-semibold">
                        Remarks *
                      </label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={extensionRemark}
                        onChange={(e) =>
                          setExtensionRemark(e.target.value)
                        }
                      ></textarea>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {mode === "new" && (
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Building / wing
              </label>
              <input
                className="form-control"
                placeholder="e.g. Wing C"
                value={newRow.building}
                onChange={(e) => updateNewRow("building", e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                RERA status *
              </label>
              <select
                className="form-select"
                value={newRow.path}
                onChange={(e) => updateNewRow("path", e.target.value)}
              >
                <option value="registered">
                  Registered — certificate issued
                </option>
                <option value="applied">
                  Application submitted, not yet registered
                </option>
                <option value="na">Not applicable</option>
              </select>
            </div>
            {newRow.path === "registered" && (
              <>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    RERA registration number *
                  </label>
                  <input
                    className={
                      "form-control" + (newRowDup ? " is-invalid" : "")
                    }
                    value={newRow.regNumber}
                    onChange={(e) =>
                      updateNewRow("regNumber", e.target.value)
                    }
                  />
                  {newRowDup && (
                    <div className="invalid-feedback d-block">
                      This registration number is already on file for
                      this project.
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Valid from date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={newRow.validFrom}
                    onChange={(e) =>
                      updateNewRow("validFrom", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Valid to date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={newRow.validTo}
                    onChange={(e) =>
                      updateNewRow("validTo", e.target.value)
                    }
                  />
                </div>
              </>
            )}
            {newRow.path === "applied" && (
              <>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    RERA application number *
                  </label>
                  <input
                    className="form-control"
                    value={newRow.applicationNumber}
                    onChange={(e) =>
                      updateNewRow("applicationNumber", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    RERA application date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={newRow.applicationDate}
                    onChange={(e) =>
                      updateNewRow("applicationDate", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Expected RERA approval date *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={newRow.expectedApprovalDate}
                    onChange={(e) =>
                      updateNewRow(
                        "expectedApprovalDate",
                        e.target.value
                      )
                    }
                  />
                </div>
              </>
            )}
            <div className="col-12">
              <label className="form-label small fw-semibold">
                Remarks {newRow.path === "na" ? "*" : ""}
              </label>
              <textarea
                className="form-control"
                rows="2"
                value={newRow.remarks}
                onChange={(e) => updateNewRow("remarks", e.target.value)}
              ></textarea>
            </div>
          </div>
        )}

        <FormActions onCancel={() => {}} />
      </FormCard>
    </div>
  );
}
