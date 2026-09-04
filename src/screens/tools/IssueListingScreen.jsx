// src/screens/tools/IssueListingScreen.jsx
// Provides (global): IssueListingScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function IssueListingScreen({ onMenuClick, onRaise }) {
  const rows = [
    {
      id: "ISS-1042",
      subject: "Unable to upload OC document",
      category: "Technical issue",
      project: "Riverside Heights",
      status: "Open",
      date: "18 Jul 2026",
    },
    {
      id: "ISS-1039",
      subject: "Disbursement amount mismatch",
      category: "Disbursement query",
      project: "Green Valley Phase 2",
      status: "In Progress",
      date: "14 Jul 2026",
    },
    {
      id: "ISS-1021",
      subject: "RERA number not accepted",
      category: "Project query",
      project: "Riverside Heights",
      status: "Resolved",
      date: "02 Jul 2026",
    },
  ];
  const statusClass = (s) =>
    s === "Resolved"
      ? "bg-success-subtle text-success"
      : s === "In Progress"
        ? "bg-warning-subtle text-warning"
        : "bg-danger-subtle text-danger";
  const [filters, setFilters] = useState({});
  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  const [projectFilter, setProjectFilter] = useState("");
  const [sort, setSort] = useSortState(null);
  const filteredRows = sortRows(
    rows.filter(
      (r) =>
        filterMatch(r.id, filters.id) &&
        filterMatch(r.subject, filters.subject) &&
        filterMatch(r.category, filters.category) &&
        (!projectFilter || r.project === projectFilter) &&
        filterMatch(r.status, filters.status) &&
        filterMatch(r.date, filters.date),
    ),
    sort,
    {
      id: (r) => r.id,
      subject: (r) => r.subject,
      category: (r) => r.category,
      project: (r) => r.project,
      status: (r) => r.status,
      date: (r) => r.date,
    },
  );
  return (
    <div>
      <TopBar
        title="Issue Listing"
        sub="All issues you've raised, with current status"
        onMenuClick={onMenuClick}
        action={
          <button className="btn btn-navy btn-sm" onClick={onRaise}>
            + Raise Issue
          </button>
        }
      />
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <select className="form-select" style={{ maxWidth: 160 }}>
          <option>All statuses</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
        <select className="form-select" style={{ maxWidth: 200 }}>
          <option>All categories</option>
          <option>Technical issue</option>
          <option>Project query</option>
          <option>Disbursement query</option>
          <option>Other</option>
        </select>
        <ProjectPickerField
          value={projectFilter}
          onChange={setProjectFilter}
          allowClear
          clearLabel="All projects"
          style={{ maxWidth: 220 }}
        />
        <input
          type="date"
          className="form-control"
          style={{ maxWidth: 170 }}
        />
      </div>
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <SortableTh label="Issue ID" sortKey="id" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Subject" sortKey="subject" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Category" sortKey="category" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Project" sortKey="project" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Status" sortKey="status" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Raised on" sortKey="date" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
            </tr>
            <GridFilterRow
              columns={[
                {
                  value: filters.id || "",
                  onChange: (v) => setFilter("id", v),
                  placeholder: "Filter ID…",
                },
                {
                  value: filters.subject || "",
                  onChange: (v) => setFilter("subject", v),
                  placeholder: "Filter subject…",
                },
                {
                  value: filters.category || "",
                  onChange: (v) => setFilter("category", v),
                  placeholder: "Filter…",
                },
                null,
                {
                  value: filters.status || "",
                  onChange: (v) => setFilter("status", v),
                  placeholder: "Filter…",
                },
                {
                  value: filters.date || "",
                  onChange: (v) => setFilter("date", v),
                  placeholder: "Filter date…",
                },
              ]}
            />
          </thead>
          <tbody>
            {filteredRows.map((r, i) => (
              <tr key={i}>
                <td className="fw-semibold">{r.id}</td>
                <td>{r.subject}</td>
                <td>{r.category}</td>
                <td>{r.project}</td>
                <td>
                  <span
                    className={"status-pill " + statusClass(r.status)}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
