// src/components/common/MultiSelectDropdown.jsx
// Provides (global): MultiSelectDropdown
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// A compact multi-select field: looks like a form-select, opens a
// checkbox list with a "Select all" row. Supports single, multiple,
// or all selections (used by Unit Data Upload's "Select building").
// `value` is an array of the selected option strings; selecting every
// option is how "All" is represented.
function MultiSelectDropdown({
  label,
  required,
  options,
  value,
  onChange,
  allLabel,
  placeholder,
  invalid,
  disabled,
  help,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const opts = options || [];
  const sel = value || [];

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const allSelected = opts.length > 0 && opts.every((o) => sel.includes(o));
  function toggle(o) {
    onChange(sel.includes(o) ? sel.filter((x) => x !== o) : [...sel, o]);
  }
  function toggleAll() {
    onChange(allSelected ? [] : [...opts]);
  }

  let triggerText;
  if (sel.length === 0) triggerText = placeholder || "--Select--";
  else if (allSelected) triggerText = allLabel || "All";
  else if (sel.length === 1) triggerText = sel[0];
  else triggerText = sel.length + " selected";

  return (
    <div ref={wrapRef} style={{ position: "relative" }}>
      {label && (
        <label className="form-label small fw-semibold">
          {label}
          {required ? " *" : ""}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        className={
          "form-select text-start d-flex align-items-center justify-content-between" +
          (invalid ? " is-invalid" : "")
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={sel.length ? "" : "text-secondary"}>
          {triggerText}
        </span>
      </button>

      {open && (
        <div
          className="kpi-card p-0 shadow"
          style={{
            position: "absolute",
            zIndex: 1050,
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          <label
            className="d-flex align-items-center gap-2 px-3 py-2 m-0"
            style={{
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 12.5,
              background: "#f7f9fc",
              borderBottom: "1px solid #e3e7ee",
            }}
          >
            <input
              type="checkbox"
              className="form-check-input m-0"
              checked={allSelected}
              ref={(el) => {
                if (el)
                  el.indeterminate = sel.length > 0 && !allSelected;
              }}
              onChange={toggleAll}
            />
            {allLabel || "Select all"} ({opts.length})
          </label>
          {opts.length === 0 && (
            <div className="text-secondary small px-3 py-3 text-center">
              No options.
            </div>
          )}
          {opts.map((o, i) => {
            const checked = sel.includes(o);
            return (
              <label
                key={o}
                className="d-flex align-items-center gap-2 px-3 py-2 m-0"
                style={{
                  cursor: "pointer",
                  fontSize: 13,
                  background: checked ? "#eaf1fb" : "#fff",
                  borderBottom:
                    i < opts.length - 1 ? "1px solid #f0f2f6" : "none",
                }}
              >
                <input
                  type="checkbox"
                  className="form-check-input m-0"
                  checked={checked}
                  onChange={() => toggle(o)}
                />
                {o}
              </label>
            );
          })}
        </div>
      )}

      {invalid && typeof invalid === "string" && (
        <div className="invalid-feedback d-block">{invalid}</div>
      )}
      {help && <div className="form-text">{help}</div>}
    </div>
  );
}
