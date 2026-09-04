// src/screens/projects/ProjectsScreen.jsx
// Provides (global): ProjectsScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function ProjectsScreen({
  onMenuClick,
  onAddProject,
  onOpenProject,
  onEditProject,
  onOpenQueries,
  verificationStage,
}) {
  const rows = BUILDER_PROJECT_DETAILS;
  const pillClass = projectStatusPill;
  const [projectsView, setProjectsView] = useState("list"); // list | map
  // Per onboarding flowchart: while PAMS approval is pending, the
  // developer may have only one project lead. Since the demo data
  // above already shows 3 rows, cap creation once pending.
  const projectCapped =
    verificationStage === "pending" && rows.length >= 1;
  const [filters, setFilters] = useState({});
  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  const [sort, setSort] = useSortState("n");
  const filteredRows = sortRows(
    rows.filter(
      (r) =>
        filterMatch(r.projNo, filters.projNo) &&
        filterMatch(r.n, filters.n) &&
        filterMatch(r.loc, filters.loc) &&
        filterMatch(r.firm, filters.firm) &&
        filterMatch(projectStatusLabel(r.status), filters.status) &&
        filterMatch(r.doc, filters.doc) &&
        filterMatch(r.q, filters.q),
    ),
    sort,
    {
      projNo: (r) => r.projNo,
      n: (r) => r.n,
      loc: (r) => r.loc,
      firm: (r) => r.firm,
      status: (r) => projectStatusLabel(r.status),
      doc: (r) => r.doc,
      q: (r) => r.q,
    },
  );
  return (
    <div>
      <TopBar
        title="All Projects"
        sub={
          <span>
            All projects submitted by your builder company{" "}
            <span className="badge badge-navy">12</span>
          </span>
        }
        onMenuClick={onMenuClick}
        action={
          <button
            className="btn btn-navy btn-sm"
            onClick={onAddProject}
            disabled={projectCapped}
            title={
              projectCapped
                ? "Only 1 project lead allowed until your company/account is approved by PAMS"
                : ""
            }
          >
            + Add Project
          </button>
        }
      />
      {projectCapped && (
        <div className="alert alert-warning py-2 small mb-3">
          ⏳ Pending PAMS approval — you can update your existing
          project lead, but can't create another until your company
          and account are approved.
        </div>
      )}            <div className="d-flex justify-content-between gap-2 mb-3 flex-wrap">
        <div className="d-flex gap-2 flex-wrap">
          <select className="form-select" style={{ maxWidth: 220 }}>
            <option>All statuses</option>
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {projectStatusLabel(s)}
              </option>
            ))}
          </select>
          <input
            className="form-control"
            style={{ maxWidth: 240 }}
            placeholder="Search project..."
          />
        </div>
        <div className="btn-group btn-group-sm">
          <button
            className={
              "btn " +
              (projectsView === "list" ? "btn-navy" : "btn-outline-secondary")
            }
            onClick={() => setProjectsView("list")}
          >
            List
          </button>
          <button
            className={
              "btn " +
              (projectsView === "map" ? "btn-navy" : "btn-outline-secondary")
            }
            onClick={() => setProjectsView("map")}
          >
            Map
          </button>
        </div>
      </div>
      {projectsView === "map" ? (
        <ProjectsMapView rows={filteredRows} onOpenProject={onOpenProject} />
      ) : (
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <SortableTh label="Project No" sortKey="projNo" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Project Name" sortKey="n" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Location" sortKey="loc" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Developer Name" sortKey="firm" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Approval Status" sortKey="status" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Doc. Status" sortKey="doc" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Qry. Status" sortKey="q" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <th></th>
            </tr>
            <GridFilterRow
              columns={[
                {
                  value: filters.projNo || "",
                  onChange: (v) => setFilter("projNo", v),
                  placeholder: "Filter no…",
                },
                {
                  value: filters.n || "",
                  onChange: (v) => setFilter("n", v),
                  placeholder: "Filter name…",
                },
                {
                  value: filters.loc || "",
                  onChange: (v) => setFilter("loc", v),
                  placeholder: "Filter location…",
                },
                {
                  value: filters.firm || "",
                  onChange: (v) => setFilter("firm", v),
                  placeholder: "Filter firm…",
                },
                {
                  value: filters.status || "",
                  onChange: (v) => setFilter("status", v),
                  placeholder: "Filter…",
                },
                {
                  value: filters.doc || "",
                  onChange: (v) => setFilter("doc", v),
                  placeholder: "Filter…",
                },
                {
                  value: filters.q || "",
                  onChange: (v) => setFilter("q", v),
                  placeholder: "Filter…",
                },
                null,
              ]}
            />
          </thead>
          <tbody>
            {filteredRows.map((r, i) => (
              <tr
                key={i}
                role="button"
                onClick={() => onOpenProject && onOpenProject(r)}
              >
                <td className="text-secondary small">{r.projNo}</td>
                <td className="fw-semibold" style={{ color: "var(--navy)" }}>
                  {r.n}
                </td>
                <td>{r.loc}</td>
                <td>{r.firm}</td>
                <td>
                  <span className={"status-pill " + pillClass(r.status)}>
                    {projectStatusLabel(r.status)}
                  </span>
                </td>
                <td>{r.doc}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQueries && onOpenQueries(r);
                    }}
                    title={
                      r.q > 0
                        ? "View " + r.q + " quer" + (r.q === 1 ? "y" : "ies") + " for " + r.n
                        : "Go to Respond to Queries"
                    }
                  >
                    💬 {r.q}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProject && onEditProject(r);
                    }}
                    title={"Edit " + r.n}
                    aria-label={"Edit " + r.n}
                  >
                    ✏️ Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
