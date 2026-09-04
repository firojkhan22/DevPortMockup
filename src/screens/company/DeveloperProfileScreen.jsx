// src/screens/company/DeveloperProfileScreen.jsx
// Provides (global): DeveloperProfileScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 2a-2. DEVELOPER CATEGORIZATION ================= */
// New BRD: "Update Builder Group Profile details" — non-mandatory at
// the time a new project is submitted, but a task is raised by
// BD/Tech from PAMS asking the developer to complete it. Data is
// captured at Builder Group level; once submitted it is locked for
// editing until BD/Tech conclude their review (accepted/rejected).
function DeveloperProfileScreen({ onMenuClick }) {
  const blankRow = () => ({ city: "", projects: "", units: "", area: "" });
  const [experience, setExperience] = useState("");
  const [completedRows, setCompletedRows] = useState([blankRow()]);
  const [ongoingRows, setOngoingRows] = useState([blankRow()]);
  const [ongoingCount, setOngoingCount] = useState("");
  const [delayedCount, setDelayedCount] = useState("");
  const [litigationCount, setLitigationCount] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviewStatus] = useState("Not yet submitted");

  function updateRow(setter, i, field, value) {
    setter((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r))
    );
  }

  return (
    <div>
      <TopBar
        title="Builder Group Profile"
        sub="Developer categorization details — optional, but may be requested as a task by BD/Tech"
        onMenuClick={onMenuClick}
      />
      <div
        className="kpi-card p-3 mb-3"
        style={{ background: "#eef4fc", border: "1px solid #c8d9f0" }}
      >
        <div className="small text-secondary">
          This is non-mandatory while submitting a new project. BD or
          Tech may raise a task from PAMS asking you to complete it.
          Data is captured at Builder Group level. Once submitted, it
          cannot be resubmitted until BD/Tech conclude their review
          (accepted or rejected).
        </div>
        <div className="small fw-semibold mt-2">
          Review status: {reviewStatus}
        </div>
      </div>
      <FormCard>
        <h6 className="mb-3">Group profile</h6>
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Years of experience in real estate business
            </label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              disabled={submitted}
            />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Projects completed</h6>
          {!submitted && (
            <button
              type="button"
              className="btn btn-outline-navy btn-sm"
              onClick={() =>
                setCompletedRows([...completedRows, blankRow()])
              }
            >
              + Add more
            </button>
          )}
        </div>
        <div className="table-responsive mb-4">
          <table className="table table-sm align-middle">
            <thead>
              <tr className="text-secondary small">
                <th>City</th>
                <th>No. of projects</th>
                <th>No. of units delivered</th>
                <th>Total area delivered (Sqft)</th>
              </tr>
            </thead>
            <tbody>
              {completedRows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={r.city}
                      disabled={submitted}
                      onChange={(e) =>
                        updateRow(setCompletedRows, i, "city", e.target.value)
                      }
                    >
                      <option value="">Select…</option>
                      <option>Mumbai</option>
                      <option>Pune</option>
                      <option>Thane</option>
                      <option>Bhandup</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="form-control form-control-sm"
                      type="number"
                      disabled={submitted}
                      value={r.projects}
                      onChange={(e) =>
                        updateRow(setCompletedRows, i, "projects", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control form-control-sm"
                      type="number"
                      disabled={submitted}
                      value={r.units}
                      onChange={(e) =>
                        updateRow(setCompletedRows, i, "units", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control form-control-sm"
                      type="number"
                      disabled={submitted}
                      value={r.area}
                      onChange={(e) =>
                        updateRow(setCompletedRows, i, "area", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Under construction / ongoing projects</h6>
          {!submitted && (
            <button
              type="button"
              className="btn btn-outline-navy btn-sm"
              onClick={() =>
                setOngoingRows([...ongoingRows, blankRow()])
              }
            >
              + Add more
            </button>
          )}
        </div>
        <div className="table-responsive mb-4">
          <table className="table table-sm align-middle">
            <thead>
              <tr className="text-secondary small">
                <th>City</th>
                <th>No. of projects</th>
                <th>No. of units proposed / under construction</th>
                <th>Under-construction area (Sqft)</th>
              </tr>
            </thead>
            <tbody>
              {ongoingRows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <select
                      className="form-select form-select-sm"
                      value={r.city}
                      disabled={submitted}
                      onChange={(e) =>
                        updateRow(setOngoingRows, i, "city", e.target.value)
                      }
                    >
                      <option value="">Select…</option>
                      <option>Mumbai</option>
                      <option>Pune</option>
                      <option>Thane</option>
                      <option>Bhandup</option>
                    </select>
                  </td>
                  <td>
                    <input
                      className="form-control form-control-sm"
                      type="number"
                      disabled={submitted}
                      value={r.projects}
                      onChange={(e) =>
                        updateRow(setOngoingRows, i, "projects", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control form-control-sm"
                      type="number"
                      disabled={submitted}
                      value={r.units}
                      onChange={(e) =>
                        updateRow(setOngoingRows, i, "units", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-control form-control-sm"
                      type="number"
                      disabled={submitted}
                      value={r.area}
                      onChange={(e) =>
                        updateRow(setOngoingRows, i, "area", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              No. of projects ongoing
            </label>
            <input
              className="form-control"
              type="number"
              disabled={submitted}
              value={ongoingCount}
              onChange={(e) => setOngoingCount(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              No. of projects delayed &gt; 12 months
            </label>
            <input
              className="form-control"
              type="number"
              disabled={submitted}
              value={delayedCount}
              onChange={(e) => setDelayedCount(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              No. of projects where litigation is ongoing
            </label>
            <input
              className="form-control"
              type="number"
              disabled={submitted}
              value={litigationCount}
              onChange={(e) => setLitigationCount(e.target.value)}
            />
          </div>
        </div>

        {submitted ? (
          <div className="alert alert-success small mb-0">
            Submitted for BD review. This form is locked until the
            review is concluded (accepted or rejected).
          </div>
        ) : (
          <div className="d-flex justify-content-end gap-2 mt-2 pt-3 border-top">
            <button className="btn btn-outline-navy">Save as draft</button>
            <button
              className="btn btn-navy"
              onClick={() => setSubmitted(true)}
            >
              Submit for BD review
            </button>
          </div>
        )}
      </FormCard>
    </div>
  );
}
