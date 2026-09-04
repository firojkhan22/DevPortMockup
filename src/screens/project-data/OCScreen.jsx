// src/screens/project-data/OCScreen.jsx
// Provides (global): OCScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 9. OC UPDATE (new, split out) ================= */
function OCScreen({ onMenuClick }) {
  const blankOcRow = () => ({
    ocDate: "",
    ocFloors: "",
    ocAuthority: "",
    ocRemarks: "",
    ocDoc: "",
  });
  const [ocReceived, setOcReceived] = useState("Yes");
  const [ocRows, setOcRows] = useState([blankOcRow()]);
  const [ocProject, setOcProject] = useState(BUILDER_PROJECT_NAMES[0]);
  function updateOcRow(idx, field, value) {
    setOcRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );
  }
  return (
    <div>
      <TopBar
        title="OC Detail Update"
        sub="Occupation Certificate — standalone post-creation update, project-wise"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        <div className="row g-3 mb-2">
          <div className="col-12 col-md-4">
            <ProjectPickerField
              label="Select project"
              value={ocProject}
              onChange={setOcProject}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Building completion certificate received?
            </label>
            <select
              className="form-select"
              value={ocReceived}
              onChange={(e) => setOcReceived(e.target.value)}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
        </div>

        {ocReceived === "Yes" &&
          ocRows.map((row, i) => (
            <div className="repeat-row p-3 mb-3" key={i}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-semibold small">OC row {i + 1}</div>
                {ocRows.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setOcRows((prev) =>
                        prev.filter((_, j) => j !== i)
                      )
                    }
                  >
                    Remove row
                  </button>
                )}
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    OC issue date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={row.ocDate}
                    onChange={(e) =>
                      updateOcRow(i, "ocDate", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Floors / wings covered
                  </label>
                  <input
                    className="form-control"
                    placeholder="e.g. Wing A, Floors 1-12"
                    value={row.ocFloors}
                    onChange={(e) =>
                      updateOcRow(i, "ocFloors", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Issuing authority
                  </label>
                  <input
                    className="form-control"
                    placeholder="Development authority name"
                    value={row.ocAuthority}
                    onChange={(e) =>
                      updateOcRow(i, "ocAuthority", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-8">
                  <label className="form-label small fw-semibold">
                    Remarks
                  </label>
                  <input
                    className="form-control"
                    value={row.ocRemarks}
                    onChange={(e) =>
                      updateOcRow(i, "ocRemarks", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Upload OC document
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      updateOcRow(
                        i,
                        "ocDoc",
                        e.target.files?.[0]?.name || ""
                      )
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        {ocReceived === "Yes" && (
          <button
            type="button"
            className="btn btn-outline-navy btn-sm mb-3"
            onClick={() =>
              setOcRows((prev) => [...prev, blankOcRow()])
            }
          >
            + Add another OC row
          </button>
        )}
        <div className="form-text mb-3">
          One row per building/wing/phase — each covers the OC issued
          for that portion of the project. Add as many rows as needed;
          this mirrors the OC section in the project entry wizard.
        </div>

        <FormActions onCancel={() => {}} />
      </FormCard>
    </div>
  );
}
