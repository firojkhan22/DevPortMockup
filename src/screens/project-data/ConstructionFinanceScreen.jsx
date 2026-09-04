// src/screens/project-data/ConstructionFinanceScreen.jsx
// Provides (global): ConstructionFinanceScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function ConstructionFinanceScreen({ onMenuClick }) {
  const [project, setProject] = useState(BUILDER_PROJECT_NAMES[0]);
  const existing = CF_STATUS_BY_PROJECT[project] || {};

  const [cfAvailed, setCfAvailed] = useState(existing.availed || "");
  const [cfLender, setCfLender] = useState(existing.lender || "");
  const [cfAmount, setCfAmount] = useState(existing.amount || "");
  const [cfSupportDoc, setCfSupportDoc] = useState(
    existing.supportDoc || ""
  );
  const [cfHdfcLoanAc, setCfHdfcLoanAc] = useState(
    existing.hdfcLoanAc || ""
  );
  const [needsFinance, setNeedsFinance] = useState(
    existing.needsFinance || ""
  );
  const [cfNeedProjectCost, setCfNeedProjectCost] = useState(
    existing.projectCost || ""
  );
  const [cfNeedAmount, setCfNeedAmount] = useState(
    existing.needAmount || ""
  );
  const [cfNeedContactName, setCfNeedContactName] = useState(
    existing.contactName || ""
  );
  const [cfNeedMobile, setCfNeedMobile] = useState(existing.mobile || "");
  const [cfNeedEmail, setCfNeedEmail] = useState(existing.email || "");

  // Re-seed the form from the mock record whenever a different
  // project is picked, same behaviour as switching the RERA
  // certificate dropdown in RERAScreen.
  function selectProject(p) {
    setProject(p);
    const rec = CF_STATUS_BY_PROJECT[p] || {};
    setCfAvailed(rec.availed || "");
    setCfLender(rec.lender || "");
    setCfAmount(rec.amount || "");
    setCfSupportDoc(rec.supportDoc || "");
    setCfHdfcLoanAc(rec.hdfcLoanAc || "");
    setNeedsFinance(rec.needsFinance || "");
    setCfNeedProjectCost(rec.projectCost || "");
    setCfNeedAmount(rec.needAmount || "");
    setCfNeedContactName(rec.contactName || "");
    setCfNeedMobile(rec.mobile || "");
    setCfNeedEmail(rec.email || "");
  }

  return (
    <div>
      <TopBar
        title="Construction Finance"
        sub="Standalone post-creation update, project-wise — mirrors the Construction finance section in the project entry wizard"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <ProjectPickerField
              label="Select project"
              value={project}
              onChange={selectProject}
            />
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-6 col-md-4">
            <div className="kpi-card p-3">
              <div className="text-secondary small">Mortgaged with</div>
              <div className="fw-bold" style={{ color: "var(--navy)" }}>
                {existing.mortgagedWith || "—"}
              </div>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <div className="kpi-card p-3">
              <div className="text-secondary small">
                Construction finance
              </div>
              <div className="fw-bold" style={{ color: "var(--navy)" }}>
                {cfAvailed === "yes"
                  ? "Availed"
                  : cfAvailed === "no" && needsFinance === "yes"
                  ? "Required"
                  : cfAvailed === "no"
                  ? "Not availed"
                  : "Not updated"}
              </div>
            </div>
          </div>
        </div>


        <div className="repeat-row p-3 mb-2">
          <div className="fw-semibold small mb-2">
            Construction finance details
          </div>
          <div className="row g-3">
            <div
              className="col-12 col-md-6"
              data-mandatory-label="Project construction finance availed"
            >
              <label className="form-label small fw-semibold">
                Project construction finance availed *
              </label>
              <div className="mt-1">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="standalone-cfavailed"
                    checked={cfAvailed === "yes"}
                    onChange={() => setCfAvailed("yes")}
                  />
                  <label className="form-check-label small">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="standalone-cfavailed"
                    checked={cfAvailed === "no"}
                    onChange={() => setCfAvailed("no")}
                  />
                  <label className="form-check-label small">No</label>
                </div>
              </div>
            </div>

            {cfAvailed === "yes" && (
              <>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Name of the financing institution
                  </label>
                  <input
                    className="form-control"
                    value={cfLender}
                    onChange={(e) => setCfLender(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Amount of CF (Rs. in crs){" "}
                    <span className="text-secondary fw-normal">
                      — non-mandatory
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    value={cfAmount}
                    onChange={(e) => setCfAmount(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Upload supporting documentation{" "}
                    <span className="text-secondary fw-normal">
                      (if any)
                    </span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setCfSupportDoc(e.target.files?.[0]?.name || "")
                    }
                  />
                  {cfSupportDoc && (
                    <div className="form-text">
                      Current file: {cfSupportDoc}
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    CF Loan a/c no.{" "}
                    <span className="text-secondary fw-normal">
                      (if CF is from HDFC Bank)
                    </span>
                  </label>
                  <input
                    className="form-control"
                    value={cfHdfcLoanAc}
                    onChange={(e) => setCfHdfcLoanAc(e.target.value)}
                  />
                </div>
              </>
            )}

            {cfAvailed === "no" && (
              <>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Any requirement for construction finance?
                  </label>
                  <div className="mt-1">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="standalone-needsfinance"
                        checked={needsFinance === "yes"}
                        onChange={() => setNeedsFinance("yes")}
                      />
                      <label className="form-check-label small">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="standalone-needsfinance"
                        checked={needsFinance === "no"}
                        onChange={() => setNeedsFinance("no")}
                      />
                      <label className="form-check-label small">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {needsFinance === "yes" && (
                  <>
                    <div className="col-12">
                      <div className="small text-secondary">
                        This will be pushed as a construction finance
                        lead to the Business Development Head of the
                        respective branch (with CC to BBH, RBH) for
                        review.
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">
                        Project cost
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        value={cfNeedProjectCost}
                        onChange={(e) =>
                          setCfNeedProjectCost(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">
                        Approx. CF loan amount required
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        value={cfNeedAmount}
                        onChange={(e) =>
                          setCfNeedAmount(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        Contact person name
                      </label>
                      <input
                        className="form-control"
                        value={cfNeedContactName}
                        onChange={(e) =>
                          setCfNeedContactName(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        Mobile number
                      </label>
                      <input
                        className="form-control"
                        value={cfNeedMobile}
                        onChange={(e) =>
                          setCfNeedMobile(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        Email address
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        value={cfNeedEmail}
                        onChange={(e) =>
                          setCfNeedEmail(e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="form-text mb-3">
          This mirrors the Construction finance section of the project
          entry wizard, updatable any time after the project has been
          created — same as RERA and OC standalone updates.
        </div>

        <FormActions onCancel={() => {}} />
      </FormCard>
    </div>
  );
}
