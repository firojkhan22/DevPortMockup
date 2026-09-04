// src/components/common/FilterDropdown.jsx
// Provides (global): FilterDropdown
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.

function FilterDropdown({ icon, label, options, selectedIds, onApply, disabled }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  // Draft selection — lives only inside this open popup. Nothing is
  // written back to the parent (and therefore nothing is actually
  // filtered) until "Done" is clicked. Closing via the × or the
  // backdrop just discards this draft.
  const [draft, setDraft] = useState(selectedIds);

  const visibleOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(
    1,
    Math.ceil(visibleOptions.length / FILTER_PICKER_PAGE_SIZE)
  );
  const pageOptions = visibleOptions.slice(
    (page - 1) * FILTER_PICKER_PAGE_SIZE,
    page * FILTER_PICKER_PAGE_SIZE
  );
  const count = selectedIds.length; // committed count, shown on the trigger
  const draftCount = draft.length;
  const allVisibleSelected =
    visibleOptions.length > 0 &&
    visibleOptions.every((o) => draft.includes(o.id));
  const someVisibleSelected = visibleOptions.some((o) =>
    draft.includes(o.id)
  );

  function openModal() {
    setSearch("");
    setPage(1);
    setDraft(selectedIds); // start the draft from what's actually applied
    setOpen(true);
  }
  function toggleDraft(id) {
    setDraft((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function toggleSelectAllVisible() {
    setDraft((prev) => {
      if (allVisibleSelected) {
        // Uncheck every currently-visible (filtered) item at once.
        const visibleIds = visibleOptions.map((o) => o.id);
        return prev.filter((id) => !visibleIds.includes(id));
      }
      // Check every currently-visible item at once — a single state
      // update, not one per item, so nothing gets dropped.
      const toAdd = visibleOptions
        .map((o) => o.id)
        .filter((id) => !prev.includes(id));
      return [...prev, ...toAdd];
    });
  }
  function handleDone() {
    onApply(draft);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        className={
          "btn btn-sm rounded-pill d-flex align-items-center gap-1 px-3 " +
          (count > 0 ? "btn-navy" : "btn-outline-navy")
        }
        style={disabled ? { opacity: 0.45 } : undefined}
        onClick={openModal}
      >
        <span>{icon}</span>
        <span>{label}</span>
        {count > 0 && (
          <span
            className="badge rounded-pill"
            style={{
              background: "rgba(255,255,255,.28)",
              color: "inherit",
              fontSize: 10.5,
            }}
          >
            {count}
          </span>
        )}
      </button>
      {open && (
        <Modal
          title={
            icon +
            " Select " +
            label +
            (draftCount > 0 ? " (" + draftCount + " selected)" : "")
          }
          onClose={() => setOpen(false)}
          width={560}
        >
          <input
            type="text"
            className="form-control form-control-sm mb-2"
            placeholder={"Search " + label.toLowerCase() + "…"}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            autoFocus
          />

          {/* Persistent selection tray — stays visible no matter which
              page of the grid you're browsing, so picks made earlier
              are never out of sight. Edits here are still draft-only. */}
          {draftCount > 0 && (
            <div
              className="d-flex flex-wrap gap-2 p-2 mb-2"
              style={{
                background: "#f2f6fc",
                borderRadius: 10,
                maxHeight: 90,
                overflowY: "auto",
              }}
            >
              {options
                .filter((o) => draft.includes(o.id))
                .map((o) => (
                  <span
                    key={o.id}
                    className="d-inline-flex align-items-center gap-1 small"
                    style={{
                      background: "#fff",
                      border: "1px solid #cfe0f5",
                      color: "var(--navy)",
                      borderRadius: 20,
                      padding: "2px 4px 2px 10px",
                    }}
                  >
                    {o.label}
                    <button
                      type="button"
                      aria-label={"Remove " + o.label}
                      onClick={() => toggleDraft(o.id)}
                      style={{
                        border: "none",
                        background: "rgba(11,61,122,.12)",
                        color: "var(--navy)",
                        borderRadius: "50%",
                        width: 16,
                        height: 16,
                        lineHeight: 1,
                        fontSize: 11,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
          )}

          {/* Grid of selectable items — a header row with its own
              "select all" checkbox (covering every filtered result,
              not just the current page), then one row per item. */}
          <div
            className="border rounded"
            style={{ borderColor: "#e3e7ee", overflow: "hidden" }}
          >
            <label
              className="d-flex align-items-center gap-2 px-2 py-2"
              style={{
                cursor: visibleOptions.length ? "pointer" : "default",
                fontSize: 12.5,
                fontWeight: 600,
                background: "#f7f9fc",
                borderBottom: "1px solid #e3e7ee",
                color: "#33415c",
              }}
            >
              <input
                className="form-check-input m-0"
                type="checkbox"
                disabled={visibleOptions.length === 0}
                checked={allVisibleSelected}
                ref={(el) => {
                  if (el)
                    el.indeterminate =
                      someVisibleSelected && !allVisibleSelected;
                }}
                onChange={toggleSelectAllVisible}
              />
              Select all {search ? "matching" : ""} (
              {visibleOptions.length})
            </label>
            {pageOptions.length === 0 ? (
              <div className="text-secondary small px-2 py-4 text-center">
                No matches.
              </div>
            ) : (
              pageOptions.map((o, idx) => {
                const checked = draft.includes(o.id);
                return (
                  <label
                    key={o.id}
                    className="d-flex align-items-center gap-2 px-2 py-2"
                    style={{
                      cursor: "pointer",
                      fontSize: 13,
                      background: checked ? "#eaf1fb" : "#fff",
                      borderBottom:
                        idx < pageOptions.length - 1
                          ? "1px solid #f0f2f6"
                          : "none",
                    }}
                  >
                    <input
                      className="form-check-input m-0"
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDraft(o.id)}
                    />
                    {o.label}
                  </label>
                );
              })
            )}
          </div>

          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
              <button
                type="button"
                className="btn btn-outline-navy btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ← Prev
              </button>
              <span className="small text-secondary">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-outline-navy btn-sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next →
              </button>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-navy btn-sm"
              onClick={handleDone}
            >
              Done{draftCount > 0 ? " (" + draftCount + " selected)" : ""}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
