// src/screens/projects/MyQueriesScreen.jsx
// Provides (global): MyQueriesScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Separate menu item, separate screen — the developer-initiated
// side of queries, kept fully apart from "Respond to Queries" so
// there's no toggle to parse before you even see the list. Not yet
// in the BRD; added from the discussion with the manager on
// General / Project related / Document related query categories.
// Same filter-row pattern as Respond to Queries, scoped to the
// fields relevant here: project, category, and who it's assigned
// to (since a developer with many open queries across projects and
// teams is exactly who needs to narrow this list fast).
function MyQueriesScreen({ onMenuClick, raisedQueries, onRaiseQuery }) {
  const [tab, setTab] = useState("open"); // open | resolved
  const [fProject, setFProject] = useState("");
  const [fCategory, setFCategory] = useState("All categories");
  const [fAssignTo, setFAssignTo] = useState("All teams");
  const [search, setSearch] = useState("");

  const openCount = raisedQueries.filter((q) => q.status === "Open").length;
  const resolvedCount = raisedQueries.filter(
    (q) => q.status === "Resolved"
  ).length;

  const assignToOptions = [
    "All teams",
    ...Array.from(new Set(raisedQueries.map((q) => q.assignTo))),
  ];

  const s = search.trim().toLowerCase();
  const items = raisedQueries.filter(
    (item) =>
      (tab === "open" ? item.status === "Open" : item.status === "Resolved") &&
      (!fProject || item.project === fProject) &&
      (fCategory === "All categories" || item.category === fCategory) &&
      (fAssignTo === "All teams" || item.assignTo === fAssignTo) &&
      (!s || item.subject.toLowerCase().includes(s))
  );
  const filtersActive =
    !!fProject ||
    fCategory !== "All categories" ||
    fAssignTo !== "All teams" ||
    !!s;

  function clearFilters() {
    setFProject("");
    setFCategory("All categories");
    setFAssignTo("All teams");
    setSearch("");
  }

  return (
    <div>
      <TopBar
        title="Queries I Raised"
        sub="Questions you've raised to the bank team, with their status"
        onMenuClick={onMenuClick}
        action={
          <button
            className="btn btn-navy btn-sm"
            onClick={onRaiseQuery}
          >
            + Raise a query
          </button>
        }
      />

      <div className="btn-group btn-group-sm mb-3">
        <button
          className={
            "btn " + (tab === "open" ? "btn-navy" : "btn-outline-secondary")
          }
          onClick={() => setTab("open")}
        >
          Open ({openCount})
        </button>
        <button
          className={
            "btn " +
            (tab === "resolved" ? "btn-navy" : "btn-outline-secondary")
          }
          onClick={() => setTab("resolved")}
        >
          Resolved ({resolvedCount})
        </button>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
        <input
          className="form-control form-control-sm"
          style={{ maxWidth: 220 }}
          placeholder="🔍 Search by subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ProjectPickerField
          value={fProject}
          onChange={setFProject}
          allowClear
          clearLabel="All projects"
          small
          style={{ maxWidth: 220 }}
        />
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 190 }}
          value={fCategory}
          onChange={(e) => setFCategory(e.target.value)}
        >
          <option>All categories</option>
          <option>General query</option>
          <option>Project related</option>
          <option>Document related</option>
        </select>
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 210 }}
          value={fAssignTo}
          onChange={(e) => setFAssignTo(e.target.value)}
        >
          {assignToOptions.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {filtersActive && (
          <button
            className="btn btn-link btn-sm text-secondary px-0"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="small text-secondary">
          {filtersActive
            ? "No queries match these filters."
            : tab === "open"
              ? "You have no open queries. Use \"+ Raise a query\" to ask the bank team something."
              : "No resolved queries yet."}
        </div>
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div className="col-12 col-md-6" key={item.id}>
              <div className="querycard p-3">
                <div className="d-flex justify-content-between fw-semibold small">
                  <span>{item.id}</span>
                  <span
                    className={
                      "badge " +
                      (item.status === "Resolved"
                        ? "bg-success-subtle text-success"
                        : "bg-warning-subtle text-warning")
                    }
                  >
                    {item.status}
                  </span>
                </div>
                <div className="small fw-semibold mt-2">{item.subject}</div>
                <div className="text-secondary small my-2">
                  <span className="badge bg-info-subtle text-info me-1">
                    {item.category}
                  </span>
                  {item.project && (
                    <span className="me-2">📁 {item.project}</span>
                  )}
                  {item.document && (
                    <span className="me-2">📄 {item.document}</span>
                  )}
                  <div className="mt-1">
                    Assigned to: {item.assignTo} · {item.age}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
