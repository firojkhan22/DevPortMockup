// src/screens/business/LeadsListingScreen.jsx
// Provides (global): LeadsListingScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function LeadsListingScreen({
  onMenuClick,
  onNewLead,
  onBulkUpload,
  onEditLead,
  leads,
}) {
  const rows = leads || [];
  const [filters, setFilters] = useState({});
  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  const [sort, setSort] = useSortState(null);
  const filteredRows = sortRows(
    rows.filter(
      (r) =>
        filterMatch(r.leadId || "Draft", filters.leadId) &&
        filterMatch(leadFullName(r), filters.n) &&
        filterMatch(r.project, filters.proj) &&
        filterMatch(r.status, filters.status) &&
        filterMatch(r.date, filters.date),
    ),
    sort,
    {
      leadId: (r) => r.leadId || "",
      n: (r) => leadFullName(r),
      proj: (r) => r.project,
      status: (r) => r.status,
      date: (r) => r.date,
    },
  );
  return (
    <div>
      <TopBar
        title="Customer Lead Listing"
        sub="All customer leads submitted for your projects"
        onMenuClick={onMenuClick}
        action={
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-navy btn-sm"
              onClick={onBulkUpload}
            >
              Bulk Upload
            </button>
            <button className="btn btn-navy btn-sm" onClick={onNewLead}>
              + New Lead
            </button>
          </div>
        }
      />
      <div className="small text-secondary mb-2">
        <b>Draft</b>: saved here, not yet shared with the bank. <b>In
        process</b>: submitted to the bank's lead system. <b>Converted
        </b> / <b>Closed</b>: set by the bank once they've worked the
        lead.
      </div>
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <SortableTh label="Lead ID" sortKey="leadId" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Customer" sortKey="n" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Project" sortKey="proj" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Status" sortKey="status" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Date" sortKey="date" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <th></th>
            </tr>
            <GridFilterRow
              columns={[
                {
                  value: filters.leadId || "",
                  onChange: (v) => setFilter("leadId", v),
                  placeholder: "Filter ID…",
                },
                {
                  value: filters.n || "",
                  onChange: (v) => setFilter("n", v),
                  placeholder: "Filter customer…",
                },
                {
                  value: filters.proj || "",
                  onChange: (v) => setFilter("proj", v),
                  placeholder: "Filter project…",
                },
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
                null,
              ]}
            />
          </thead>
          <tbody>
            {filteredRows.map((r, i) => (
              <tr key={r.key || i}>
                <td className="text-secondary small">
                  {r.leadId || (
                    <span className="fst-italic">Not yet submitted</span>
                  )}
                </td>
                <td className="fw-semibold">{leadFullName(r)}</td>
                <td>{r.project}</td>
                <td>
                  <span
                    className={"status-pill " + leadStatusPill(r.status)}
                  >
                    {r.status}
                  </span>
                </td>
                <td>{r.date}</td>
                <td>
                  {r.status === "Draft" && (
                    <button
                      className="btn btn-sm btn-outline-navy icon-btn"
                      title={"Edit draft lead for " + leadFullName(r)}
                      aria-label={"Edit draft lead for " + leadFullName(r)}
                      onClick={() => onEditLead(r)}
                    >
                      <IconEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-secondary py-4">
                  No leads match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
