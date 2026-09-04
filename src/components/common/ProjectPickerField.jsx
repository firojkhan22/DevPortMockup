// src/components/common/ProjectPickerField.jsx
// Provides (global): ProjectPickerField
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Reusable "Select project" field used everywhere a plain <select>
// used to be. Looks like a normal form-select, but clicking it opens
// a filterable grid of full project details (same idea as the
// project-lead picker grid in Role/Access and Complete Project
// Lead) instead of a bare list of names — so the user can search by
// project, location, developer firm, or status, and see status/docs/
// queries before picking.
function ProjectPickerField({
  label,
  value,
  onChange,
  projects,
  required,
  placeholder,
  wrapClassName,
  style,
  allowClear,
  clearLabel,
  small,
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const wrapRef = useRef(null);
  const list = projects || BUILDER_PROJECT_DETAILS;

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const q = filter.trim().toLowerCase();
  const filtered = !q
    ? list
    : list.filter((p) =>
        [p.n, p.loc, p.firm, p.status, projectStatusLabel(p.status)]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q))
      );

  return (
    <div
      ref={wrapRef}
      className={wrapClassName}
      style={{ position: "relative", ...style }}
    >
      {label && (
        <label className="form-label small fw-semibold">
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <button
        type="button"
        className={
          "form-select text-start d-flex align-items-center justify-content-between " +
          (small ? "form-select-sm" : "")
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={value ? "" : "text-secondary"}>
          {value || placeholder || (allowClear ? clearLabel || "All projects" : "Select the project…")}
        </span>
      </button>

      {open && (
        <div
          className="kpi-card p-2 shadow"
          style={{
            position: "absolute",
            zIndex: 1050,
            top: "100%",
            left: 0,
            marginTop: 4,
            width: 720,
            maxWidth: "92vw",
          }}
        >
          <input
            autoFocus
            className="form-control form-control-sm mb-2"
            placeholder="🔍 Search by project, location, firm, or status…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          {allowClear && (
            <div
              role="button"
              className={
                "repeat-row p-2 px-3 small mb-2 " + (!value ? "table-active" : "")
              }
              onClick={() => {
                onChange && onChange("");
                setOpen(false);
                setFilter("");
              }}
            >
              {clearLabel || "All projects"}
            </div>
          )}
          <div
            className="table-responsive"
            style={{ maxHeight: 320, overflowY: "auto" }}
          >
            <table className="table table-sm table-hover mb-0 align-middle">
              <thead className="sticky-top bg-white">
                <tr className="text-secondary small">
                  <th>Project</th>
                  <th>Location</th>
                  <th>Developer Name</th>
                  <th>Status</th>
                  <th>Doc. Status</th>
                  <th>Qry. Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-secondary small text-center py-3"
                    >
                      No projects match “{filter}”.
                    </td>
                  </tr>
                )}
                {filtered.map((p) => (
                  <tr
                    key={p.n}
                    role="button"
                    className={p.n === value ? "table-active" : ""}
                    onClick={() => {
                      onChange && onChange(p.n);
                      setOpen(false);
                      setFilter("");
                    }}
                  >
                    <td
                      className="fw-semibold small"
                      style={{ color: "var(--navy)" }}
                    >
                      {p.n}
                    </td>
                    <td className="small">{p.loc}</td>
                    <td className="small text-secondary">{p.firm}</td>
                    <td>
                      <span
                        className={
                          "status-pill " + projectStatusPill(p.status)
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="small">{p.doc}</td>
                    <td className="small">💬 {p.q}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
