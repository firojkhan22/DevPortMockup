// src/components/common/AccessLevelPicker.jsx
// Provides (global): AccessLevelPicker
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function AccessLevelPicker({
  fullAccess,
  setFullAccess,
  selProjects,
  setSelProjects,
  selCompanies,
  setSelCompanies,
  selCities,
  setSelCities,
  gridFilter,
  setGridFilter,
  creatorProjectIds,
  accessValidTill,
  setAccessValidTill,
  accessValidTillError,
}) {
  const [activeTab, setActiveTab] = useState("project");
  const filteredProjects = ALL_PROJECT_LEADS.filter(
    (p) =>
      !gridFilter ||
      p.name.toLowerCase().includes(gridFilter.toLowerCase()) ||
      p.company.toLowerCase().includes(gridFilter.toLowerCase()) ||
      p.city.toLowerCase().includes(gridFilter.toLowerCase())
  );
  const filteredCompanies = ALL_COMPANIES.filter(
    (c) =>
      !gridFilter ||
      c.name.toLowerCase().includes(gridFilter.toLowerCase()) ||
      c.city.toLowerCase().includes(gridFilter.toLowerCase())
  );
  const filteredCities = ALL_CITIES.filter(
    (c) => !gridFilter || c.toLowerCase().includes(gridFilter.toLowerCase())
  );
  const creators = creatorProjectIds || [];

  const allProjectsSelected =
    filteredProjects.length > 0 &&
    filteredProjects.every((p) => selProjects.includes(p.id));
  const allCompaniesSelected =
    filteredCompanies.length > 0 &&
    filteredCompanies.every((c) => selCompanies.includes(c.id));
  const allCitiesSelected =
    filteredCities.length > 0 &&
    filteredCities.every((c) => selCities.includes(c));

  function toggleSelectAll(filtered, sel, setSel, keyFn) {
    const filteredKeys = filtered.map(keyFn);
    const allSelected = filteredKeys.every((k) => sel.includes(k));
    if (allSelected) {
      setSel(sel.filter((k) => !filteredKeys.includes(k)));
    } else {
      setSel([...new Set([...sel, ...filteredKeys])]);
    }
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setGridFilter("");
  }

  const scopeCount = selProjects.length + selCompanies.length + selCities.length;

  return (
    <>
      <div className="mb-3">
        <label className="form-label small fw-semibold">
          Access
        </label>
        <div className="repeat-row p-3 d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-semibold small">Full Access</div>
            <div className="text-secondary small">
              {fullAccess
                ? "This user can view and manage every project, company, and city."
                : "Off — pick from Project specific, Company specific, and/or City-wise below. You can combine all three."}
            </div>
          </div>
          <div className="form-check form-switch mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={fullAccess}
              onChange={(e) => setFullAccess(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">
          Access valid till <span className="text-danger">*</span>
        </label>
        <input
          type="date"
          className={
            "form-control" +
            (accessValidTillError ? " is-invalid" : "")
          }
          style={{ maxWidth: 220 }}
          value={accessValidTill || ""}
          onChange={(e) => setAccessValidTill(e.target.value)}
        />
        <div className="text-secondary small mt-1">
          One common expiry date applies to this user's access,
          whichever type is selected above — Full, Project-specific,
          Company-specific, and/or City-wise.
        </div>
        {accessValidTillError && (
          <div className="invalid-feedback d-block">
            {accessValidTillError}
          </div>
        )}
      </div>

      {!fullAccess && (
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <div className="btn-group btn-group-sm" role="group">
              <button
                type="button"
                className={
                  "btn " +
                  (activeTab === "project" ? "btn-navy" : "btn-outline-secondary")
                }
                onClick={() => switchTab("project")}
              >
                Project specific
                {selProjects.length > 0 ? " (" + selProjects.length + ")" : ""}
              </button>
              <button
                type="button"
                className={
                  "btn " +
                  (activeTab === "company" ? "btn-navy" : "btn-outline-secondary")
                }
                onClick={() => switchTab("company")}
              >
                Company specific
                {selCompanies.length > 0 ? " (" + selCompanies.length + ")" : ""}
              </button>
              <button
                type="button"
                className={
                  "btn " +
                  (activeTab === "city" ? "btn-navy" : "btn-outline-secondary")
                }
                onClick={() => switchTab("city")}
              >
                City-wise
                {selCities.length > 0 ? " (" + selCities.length + ")" : ""}
              </button>
            </div>
            <div className="small text-secondary">
              {scopeCount === 0
                ? "No access scope selected yet"
                : computeAccessSummary(false, selProjects, selCompanies, selCities) +
                  " selected"}
            </div>
          </div>

          {activeTab === "project" && (
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label small fw-semibold mb-0">
                  Select project leads ({selProjects.length} selected)
                </label>
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAllProjects"
                    checked={allProjectsSelected}
                    onChange={() =>
                      toggleSelectAll(
                        filteredProjects,
                        selProjects,
                        setSelProjects,
                        (p) => p.id,
                      )
                    }
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="selectAllProjects"
                  >
                    Select all
                  </label>
                </div>
              </div>
              {creators.length > 0 && (
                <div className="small text-secondary mb-2">
                  🔑 Projects marked <b>Creator</b> below are auto-granted
                  because this user created them — they keep access
                  regardless of role until you uncheck it here.
                </div>
              )}
              <input
                className="form-control form-control-sm mb-2"
                placeholder="🔍 Filter by project, company, or city…"
                value={gridFilter}
                onChange={(e) => setGridFilter(e.target.value)}
              />
              <div
                className="kpi-card p-0"
                style={{ maxHeight: 220, overflowY: "auto" }}
              >
                <table className="table table-sm mb-0 align-middle">
                  <thead className="sticky-top bg-white">
                    <tr className="text-secondary small">
                      <th style={{ width: 32 }}></th>
                      <th>Project lead</th>
                      <th>Company</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-secondary small text-center py-3">
                          No project leads match this filter.
                        </td>
                      </tr>
                    )}
                    {filteredProjects.map((p) => (
                      <tr
                        key={p.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleInArray(selProjects, setSelProjects, p.id)}
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selProjects.includes(p.id)}
                            onChange={() => toggleInArray(selProjects, setSelProjects, p.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="small">
                          {p.name}
                          {creators.includes(p.id) && (
                            <span className="badge bg-info-subtle text-info ms-1">
                              Creator
                            </span>
                          )}
                        </td>
                        <td className="small text-secondary">{p.company}</td>
                        <td className="small text-secondary">{p.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "company" && (
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label small fw-semibold mb-0">
                  Select companies ({selCompanies.length} selected)
                </label>
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAllCompanies"
                    checked={allCompaniesSelected}
                    onChange={() =>
                      toggleSelectAll(
                        filteredCompanies,
                        selCompanies,
                        setSelCompanies,
                        (c) => c.id,
                      )
                    }
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="selectAllCompanies"
                  >
                    Select all
                  </label>
                </div>
              </div>
              <input
                className="form-control form-control-sm mb-2 mt-2"
                placeholder="🔍 Filter by company or city…"
                value={gridFilter}
                onChange={(e) => setGridFilter(e.target.value)}
              />
              <div
                className="kpi-card p-0"
                style={{ maxHeight: 220, overflowY: "auto" }}
              >
                <table className="table table-sm mb-0 align-middle">
                  <thead className="sticky-top bg-white">
                    <tr className="text-secondary small">
                      <th style={{ width: 32 }}></th>
                      <th>Company</th>
                      <th>City</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.length === 0 && (
                      <tr>
                        <td colSpan={3} className="text-secondary small text-center py-3">
                          No companies match this filter.
                        </td>
                      </tr>
                    )}
                    {filteredCompanies.map((c) => (
                      <tr
                        key={c.id}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleInArray(selCompanies, setSelCompanies, c.id)}
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selCompanies.includes(c.id)}
                            onChange={() => toggleInArray(selCompanies, setSelCompanies, c.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="small">{c.name}</td>
                        <td className="small text-secondary">{c.city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "city" && (
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label small fw-semibold mb-0">
                  Select cities ({selCities.length} selected)
                </label>
                <div className="form-check mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="selectAllCities"
                    checked={allCitiesSelected}
                    onChange={() =>
                      toggleSelectAll(
                        filteredCities.map((c) => ({ id: c })),
                        selCities,
                        setSelCities,
                        (c) => c.id,
                      )
                    }
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="selectAllCities"
                  >
                    Select all
                  </label>
                </div>
              </div>
              <input
                className="form-control form-control-sm mb-2 mt-2"
                placeholder="🔍 Filter cities…"
                value={gridFilter}
                onChange={(e) => setGridFilter(e.target.value)}
              />
              <div
                className="kpi-card p-0"
                style={{ maxHeight: 220, overflowY: "auto" }}
              >
                <table className="table table-sm mb-0 align-middle">
                  <tbody>
                    {filteredCities.length === 0 && (
                      <tr>
                        <td className="text-secondary small text-center py-3">
                          No cities match this filter.
                        </td>
                      </tr>
                    )}
                    {filteredCities.map((city) => (
                      <tr
                        key={city}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleInArray(selCities, setSelCities, city)}
                      >
                        <td style={{ width: 32 }}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selCities.includes(city)}
                            onChange={() => toggleInArray(selCities, setSelCities, city)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="small">{city}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="form-text">
                Cities are drawn from project leads currently allocated to
                this admin.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
