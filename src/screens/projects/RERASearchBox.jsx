// src/screens/projects/RERASearchBox.jsx
// Provides (global): RERASearchBox
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Inline "Search by RERA registration number" — rendered directly on
// the page (no popup). Clicking Search reveals a results table below
// the box; picking a project fills the form, hides the table, and
// clears the search box again. The results panel scrolls and paginates
// internally so it stays easy to scan even if a search legitimately
// matches hundreds or thousands of records.
function RERASearchBox({ builderCompanyName, unclaimedProjects, onImport }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | results | notfound
  const [results, setResults] = useState([]);
  const [narrow, setNarrow] = useState("");
  const [page, setPage] = useState(0);

  async function handleSearch() {
    if (!query.trim()) return;
    setStatus("loading");
    setResults([]);
    setNarrow("");
    setPage(0);
    const matches = await searchReraAuthorityRecords(
      query,
      unclaimedProjects
    );
    if (matches.length === 0) {
      setStatus("notfound");
    } else {
      setResults(matches);
      setStatus("results");
    }
  }

  function handleSelect(p) {
    onImport(p);
    // Selecting a result hides the table and empties the search box.
    setResults([]);
    setStatus("idle");
    setQuery("");
    setNarrow("");
    setPage(0);
  }

  const nq = narrow.trim().toLowerCase();
  const filteredResults = !nq
    ? results
    : results.filter(
        (p) =>
          p.name.toLowerCase().includes(nq) ||
          p.reraNo.toLowerCase().includes(nq) ||
          p.city.toLowerCase().includes(nq)
      );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredResults.length / RERA_RESULTS_PAGE_SIZE)
  );
  const currentPage = Math.min(page, totalPages - 1);
  const pageStart = currentPage * RERA_RESULTS_PAGE_SIZE;
  const pageRows = filteredResults.slice(
    pageStart,
    pageStart + RERA_RESULTS_PAGE_SIZE
  );
  const rangeStart = filteredResults.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(
    filteredResults.length,
    pageStart + RERA_RESULTS_PAGE_SIZE
  );

  return (
    <div>
      <label className="form-label small fw-semibold mb-1">
        Search by RERA registration number
      </label>
      <div className="d-flex gap-2">
        <input
          className="form-control form-control-sm"
          placeholder="e.g. P51800012345, or part of a project name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          type="button"
          className="btn btn-navy btn-sm text-nowrap"
          disabled={!query.trim() || status === "loading"}
          onClick={handleSearch}
        >
          {status === "loading" ? "Searching…" : "🔍 Search"}
        </button>
      </div>

      {status === "loading" && (
        <div className="repeat-row p-3 small text-secondary text-center mt-3">
          Fetching details from the RERA authority API…
        </div>
      )}
      {status === "notfound" && (
        <div className="repeat-row p-3 small text-danger text-center mt-3">
          No project found for "{query}". Double-check the
          registration number and try again.
        </div>
      )}
      {status === "results" && (
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
            <div className="small text-secondary">
              <b>{filteredResults.length.toLocaleString()}</b>{" "}
              {filteredResults.length === 1 ? "project" : "projects"}{" "}
              found for "{query}"
            </div>
            {results.length > RERA_RESULTS_PAGE_SIZE && (
              <input
                className="form-control form-control-sm"
                style={{ maxWidth: 220 }}
                placeholder="Narrow these results…"
                value={narrow}
                onChange={(e) => {
                  setNarrow(e.target.value);
                  setPage(0);
                }}
              />
            )}
          </div>

          <div className="kpi-card p-0">
            <div
              className="table-responsive"
              style={{ maxHeight: 320, overflowY: "auto" }}
            >
              <table className="table table-sm mb-0 align-middle">
                <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr className="text-secondary small">
                    <th>Project</th>
                    <th>RERA no.</th>
                    <th>City, State</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((p) => (
                    <tr
                      key={p.id}
                      role="button"
                      onClick={() => handleSelect(p)}
                    >
                      <td>
                        <div className="fw-semibold small">
                          {p.name}
                        </div>
                        {p.fromAuthority && (
                          <span className="badge bg-success-subtle text-success">
                            Fetched from RERA authority
                          </span>
                        )}
                      </td>
                      <td className="small">{p.reraNo}</td>
                      <td className="small">
                        {p.city}, {p.state}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-outline-navy btn-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(p);
                          }}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                  {pageRows.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center text-secondary small py-3"
                      >
                        No matches for that filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-2">
            <div className="small text-secondary">
              Showing {rangeStart}-{rangeEnd} of{" "}
              {filteredResults.length.toLocaleString()}
            </div>
            {totalPages > 1 && (
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-outline-navy btn-sm"
                  disabled={currentPage === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  ← Prev
                </button>
                <span className="small text-secondary text-nowrap">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-navy btn-sm"
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage >= totalPages - 1}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
