// src/screens/project-data/WorkProgressScreen.jsx
// Provides (global): WorkProgressScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function WorkProgressScreen({ onMenuClick }) {
  const [mode, setMode] = useState("tower"); // tower | bungalow
  const [towerRows, setTowerRows] = useState(INITIAL_TOWER_ROWS);
  const [bungalowRows, setBungalowRows] = useState(INITIAL_BUNGALOW_ROWS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [screen, setScreen] = useState("list"); // list | update | history
  const [viewingFile, setViewingFile] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState("");

  const rows = mode === "tower" ? towerRows : bungalowRows;
  const setRows = mode === "tower" ? setTowerRows : setBungalowRows;

  const [colFilters, setColFilters] = useState({});
  function setColFilter(key, value) {
    setColFilters((prev) => ({ ...prev, [key]: value }));
  }

  const [sort, setSort] = useSortState("name");
  const filteredRows = sortRows(
    rows.filter(
      (r) =>
        filterMatch(r.name, colFilters.name) &&
        filterMatch(
          mode === "tower" ? r.floors + " Floors" : (r.exposure ? "HDFC exposure" : "No exposure"),
          colFilters.secondCol,
        ) &&
        filterMatch(r.progressDate, colFilters.progressDate),
    ),
    sort,
    {
      name: (r) => r.name,
      secondCol: (r) =>
        mode === "tower" ? r.floors : r.exposure ? 1 : 0,
      progressDate: (r) => r.progressDate,
      completion: (r) => computeCompletion(r),
    },
  );

  function toggleSelected(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function updateRowsByIds(ids, patch) {
    setRows((prev) =>
      prev.map((r) =>
        ids.includes(r.id)
          ? typeof patch === "function"
            ? { ...r, ...patch(r) }
            : { ...r, ...patch }
          : r,
      ),
    );
  }

  function switchMode(m) {
    setMode(m);
    setSelectedIds([]);
    setScreen("list");
  }

  if (screen === "update" && selectedIds.length > 0) {
    return (
      <div>
        <WorkProgressUpdateScreen
          rows={rows.filter((r) => selectedIds.includes(r.id))}
          onMenuClick={onMenuClick}
          onBack={() => setScreen("list")}
          onSubmit={(formState) => {
            const today = new Date().toISOString().slice(0, 10);
            updateRowsByIds(selectedIds, (r) => ({
              stageStatus: formState.stageStatus,
              stages: formState.stages,
              remarks: formState.remarks,
              progressDate: formState.progressDate,
              pctDue: formState.pctDue,
              demandLetterDate: formState.demandLetterDate,
              photos: [...formState.photos, ...r.photos],
              docs: [...formState.docs, ...r.docs],
              history: [
                {
                  date: formState.progressDate || today,
                  stageStatus: formState.stageStatus,
                  remarks: formState.remarks,
                  pctDue: formState.pctDue,
                  demandLetterDate: formState.demandLetterDate,
                  photosCount: formState.photos.length + r.photos.length,
                  docsCount: formState.docs.length + r.docs.length,
                },
                ...r.history,
              ],
            }));
            setScreen("list");
            setSelectedIds([]);
            setConfirmMsg(
              "Progress submitted and routed to the Technical Appraisal team for review.",
            );
            setTimeout(() => setConfirmMsg(""), 5000);
          }}
        />
        {viewingFile && (
          <WorkProgressFileViewModal
            file={viewingFile}
            onClose={() => setViewingFile(null)}
          />
        )}
      </div>
    );
  }

  if (screen === "history" && selectedIds.length === 1) {
    const row = rows.find((r) => r.id === selectedIds[0]);
    return (
      <WorkProgressHistoryScreen
        row={row}
        onMenuClick={onMenuClick}
        onBack={() => setScreen("list")}
      />
    );
  }

  return (
    <div>
      <TopBar
        title="Update Work Progress"
        sub="Track construction progress per building or unit, and submit to HDFC"
        onMenuClick={onMenuClick}
      />

      {confirmMsg && (
        <div className="alert alert-success py-2 small">
          ✓ {confirmMsg}
        </div>
      )}

      <div className="mb-3">
        <select className="form-select" style={{ maxWidth: 300 }}>
          <option>Alliance Orchid Springs (54217)</option>
        </select>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="d-flex gap-2">
          <button
            type="button"
            className={
              "btn btn-sm " +
              (mode === "tower" ? "btn-navy" : "btn-outline-navy")
            }
            onClick={() => switchMode("tower")}
          >
            Tower
          </button>
          <button
            type="button"
            className={
              "btn btn-sm " +
              (mode === "bungalow" ? "btn-navy" : "btn-outline-navy")
            }
            onClick={() => switchMode("bungalow")}
          >
            Bungalow / Plot
          </button>
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <button
            type="button"
            className="btn btn-outline-navy btn-sm"
            disabled={selectedIds.length !== 1}
            title={
              selectedIds.length !== 1
                ? "Select exactly one row to view its history"
                : ""
            }
            onClick={() => setScreen("history")}
          >
            History
          </button>
          <button
            type="button"
            className="btn btn-navy btn-sm"
            disabled={selectedIds.length === 0}
            onClick={() => setScreen("update")}
          >
            Update{selectedIds.length > 1 ? " (" + selectedIds.length + ")" : ""}
          </button>
        </div>
      </div>

      <div className="small text-secondary mb-2">
        Select one or more rows to update their progress together, or
        select a single row to view its history.
      </div>

      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <th style={{ width: 36 }}></th>
              <SortableTh label="Name" sortKey="name" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label={mode === "tower" ? "Total floors" : "Exposure"} sortKey="secondCol" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Progress date" sortKey="progressDate" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Completion status" sortKey="completion" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} style={{ minWidth: 220 }} />
              <th></th>
            </tr>
            <GridFilterRow
              columns={[
                null,
                {
                  value: colFilters.name || "",
                  onChange: (v) => setColFilter("name", v),
                  placeholder: "Filter name…",
                },
                {
                  value: colFilters.secondCol || "",
                  onChange: (v) => setColFilter("secondCol", v),
                  placeholder: "Filter…",
                },
                {
                  value: colFilters.progressDate || "",
                  onChange: (v) => setColFilter("progressDate", v),
                  placeholder: "Filter date…",
                },
                null,
                null,
              ]}
            />
          </thead>
          <tbody>
            {filteredRows.map((r) => {
              const pct = computeCompletion(r);
              return (
                <tr key={r.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(r.id)}
                      onChange={() => toggleSelected(r.id)}
                    />
                  </td>
                  <td>
                    <div className="fw-semibold">{r.name}</div>
                    <div className="small text-secondary">
                      {stageStatusLabel(r.stageStatus)}
                    </div>
                  </td>
                  <td>
                    {mode === "tower" ? (
                      r.floors + " Floors"
                    ) : r.exposure ? (
                      <span className="status-pill bg-success-subtle text-success">
                        HDFC exposure
                      </span>
                    ) : (
                      <span className="status-pill bg-secondary-subtle text-secondary">
                        No exposure
                      </span>
                    )}
                  </td>
                  <td>{r.progressDate || "—"}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="flex-fill rounded-pill"
                        style={{
                          height: 8,
                          background: "#e5e9f0",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: pct + "%",
                            height: "100%",
                            background: "var(--navy)",
                          }}
                        />
                      </div>
                      <div
                        className="small text-secondary"
                        style={{ minWidth: 62, textAlign: "right" }}
                      >
                        {pct}/100%
                      </div>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-navy btn-sm icon-btn position-relative"
                      title={"Upload documents for " + r.name}
                      aria-label={"Upload documents for " + r.name}
                      onClick={() => {
                        setSelectedIds([r.id]);
                        setScreen("update");
                      }}
                    >
                      ☁️
                      {(r.docs.length > 0 || r.photos.length > 0) && (
                        <span
                          className="badge rounded-pill position-absolute top-0 start-100 translate-middle"
                          style={{ fontSize: 10, backgroundColor: "var(--navy)" }}
                        >
                          {r.docs.length + r.photos.length}
                        </span>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-secondary py-4">
                  No {mode === "tower" ? "buildings" : "units"} match
                  your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
