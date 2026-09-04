// src/screens/projects/QueriesScreen.jsx
// Provides (global): QueriesScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Two directions live under one "Queries" menu entry, same idea as
// a helpdesk splitting "assigned to me" vs "raised by me" off one
// ticket list rather than two disconnected screens:
// - "respond": PAC (Technical/Legal/BD) raised something FOR the
//   developer to act on — pending documents or queries, unchanged
//   from the original screen below.
// - "raised": the developer raised something TO the bank team —
//   new, not explicit in the BRD yet (from discussion with
//   manager) — general/project/document queries with their own
//   status tracker and a "+ Raise a query" action.
// Type badge is now a column on ONE list instead of a second
// "Documents / Queries" toggle stacked on top of "Pending /
// Responded" — two independent toggle rows reading as nested tabs
// was the confusing part. One tab row (Pending/Responded), one
// list, Type shown per-row. Filters (project, type, raised by,
// free text) sit above the list so a developer juggling several
// projects can narrow straight to what they came for — same
// filter-row pattern as Issue Listing elsewhere in the portal.
function QueriesScreen({ onMenuClick, initialProject }) {
  const [tab, setTab] = useState("pending");
  const [activeItem, setActiveItem] = useState(null);
  const [fProject, setFProject] = useState(initialProject || "");
  const [fType, setFType] = useState("All types");
  const [fRaisedBy, setFRaisedBy] = useState("All teams");
  const [search, setSearch] = useState("");

  const PENDING_ITEMS = [
    {
      type: "Document",
      project: "Riverside Heights",
      raisedBy: "Technical Team",
      category: "Document",
      text: "RERA certificate copy missing for Wing B",
      age: "2 days ago",
    },
    {
      type: "Document",
      project: "Green Valley Phase 2",
      raisedBy: "Legal Team",
      category: "Document",
      text: "Occupation certificate not uploaded",
      age: "5 days ago",
    },
    {
      type: "Query",
      project: "Riverside Heights",
      raisedBy: "Legal Team",
      category: "General",
      text: "Please confirm the current stage of construction for Wing B.",
      age: "1 day ago",
    },
    {
      type: "Query",
      project: "ASP(906773)",
      raisedBy: "Business Development Team",
      category: "General",
      text: "Share updated inventory sheet for the current phase.",
      age: "3 days ago",
    },
  ];

  const teamOptions = [
    "All teams",
    ...Array.from(new Set(PENDING_ITEMS.map((i) => i.raisedBy))),
  ];

  // Opened from a project's Qry. Status link on All Projects — jump
  // straight to that project's first pending item instead of
  // leaving the developer to find it in the list themselves. If
  // that project has nothing pending, this simply falls through
  // and the (already-filtered) empty state is shown.
  useEffect(() => {
    if (!initialProject) return;
    const match = PENDING_ITEMS.find((i) => i.project === initialProject);
    if (match) setActiveItem(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const q = search.trim().toLowerCase();
  const filteredItems = PENDING_ITEMS.filter(
    (i) =>
      (!fProject || i.project === fProject) &&
      (fType === "All types" || i.type === fType) &&
      (fRaisedBy === "All teams" || i.raisedBy === fRaisedBy) &&
      (!q || i.text.toLowerCase().includes(q))
  );
  const filtersActive =
    !!fProject ||
    fType !== "All types" ||
    fRaisedBy !== "All teams" ||
    !!q;

  function clearFilters() {
    setFProject("");
    setFType("All types");
    setFRaisedBy("All teams");
    setSearch("");
  }

  return (
    <div>
      <TopBar
        title="Respond to Queries"
        sub="Document requirements and queries raised by PAC — respond to each below"
        onMenuClick={onMenuClick}
      />

      <div className="btn-group btn-group-sm mb-3">
        <button
          className={
            "btn " +
            (tab === "pending" ? "btn-navy" : "btn-outline-secondary")
          }
          onClick={() => setTab("pending")}
        >
          Pending ({PENDING_ITEMS.length})
        </button>
        <button
          className={
            "btn " +
            (tab === "responded" ? "btn-navy" : "btn-outline-secondary")
          }
          onClick={() => setTab("responded")}
        >
          Responded (9)
        </button>
      </div>

      {tab === "pending" && (
        <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
          <input
            className="form-control form-control-sm"
            style={{ maxWidth: 220 }}
            placeholder="🔍 Search queries…"
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
            style={{ maxWidth: 150 }}
            value={fType}
            onChange={(e) => setFType(e.target.value)}
          >
            <option>All types</option>
            <option>Document</option>
            <option>Query</option>
          </select>
          <select
            className="form-select form-select-sm"
            style={{ maxWidth: 210 }}
            value={fRaisedBy}
            onChange={(e) => setFRaisedBy(e.target.value)}
          >
            {teamOptions.map((t) => (
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
      )}

      {tab === "pending" ? (
        filteredItems.length === 0 ? (
          <div className="small text-secondary">
            No pending items match these filters.
          </div>
        ) : (
          <div className="row g-3">
            {filteredItems.map((item, i) => (
              <div className="col-12 col-md-6" key={i}>
                <div className="querycard p-3">
                  <div className="d-flex justify-content-between fw-semibold small">
                    <span>Raised by: {item.raisedBy}</span>
                    <span
                      className={
                        "badge " +
                        (item.type === "Document"
                          ? "bg-warning-subtle text-warning"
                          : "bg-info-subtle text-info")
                      }
                    >
                      {item.type}
                    </span>
                  </div>
                  <div className="text-secondary small my-2">
                    📁 {item.project}
                    <br />
                    {item.text} · {item.age}
                  </div>
                  <button
                    className="btn btn-outline-navy btn-sm"
                    onClick={() => setActiveItem(item)}
                  >
                    {item.type === "Document"
                      ? "Upload / Request waiver"
                      : "Respond"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="small text-secondary">
          Responded items and any waiver requests, with their status,
          are visible here once PAC has reviewed them.
        </div>
      )}

      {activeItem && activeItem.type === "Document" && (
        <DocRequirementModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      )}
      {activeItem && activeItem.type === "Query" && (
        <QueryRespondModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      )}
    </div>
  );
}
