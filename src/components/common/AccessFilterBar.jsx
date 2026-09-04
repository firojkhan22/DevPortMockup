// src/components/common/AccessFilterBar.jsx
// Provides (global): AccessFilterBar
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// The full "Filter by access" bar shown above the User Management
// grid — three pill dropdowns (Projects / Company / City) that
// combine as an AND-across-categories, OR-within-category filter,
// plus a Full Access shortcut. Every active choice also shows as a
// removable chip below, so a combination like "2 projects + 1 city"
// stays visible and easy to adjust at a glance.
function AccessFilterBar({ value, onChange }) {
  const activeCount =
    (value.fullAccessOnly ? 1 : 0) +
    value.projects.length +
    value.companies.length +
    value.cities.length;

  function setKey(key, ids) {
    onChange({ ...value, [key]: ids });
  }
  function removeChip(key, id) {
    onChange({ ...value, [key]: value[key].filter((x) => x !== id) });
  }
  function clearAll() {
    onChange({ fullAccessOnly: false, projects: [], companies: [], cities: [] });
  }

  const projectOptions = ALL_PROJECT_LEADS.map((p) => ({ id: p.id, label: p.name }));
  const companyOptions = ALL_COMPANIES.map((c) => ({ id: c.id, label: c.name }));
  const cityOptions = ALL_CITIES.map((city) => ({ id: city, label: city }));

  const chips = [];
  if (value.fullAccessOnly) {
    chips.push({ key: "fullAccessOnly", text: "⭐ Full access only" });
  }
  value.projects.forEach((id) => {
    const p = projectOptions.find((o) => o.id === id);
    chips.push({ key: "projects", id, text: "📁 " + (p ? p.label : id) });
  });
  value.companies.forEach((id) => {
    const c = companyOptions.find((o) => o.id === id);
    chips.push({ key: "companies", id, text: "🏢 " + (c ? c.label : id) });
  });
  value.cities.forEach((id) => {
    chips.push({ key: "cities", id, text: "🏙️ " + id });
  });

  return (
    <div className="kpi-card p-3 mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="fw-semibold small" style={{ color: "var(--navy)" }}>
          Filter by access
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            className="btn btn-link btn-sm text-secondary p-0"
            onClick={clearAll}
          >
            Clear all filters
          </button>
        )}
      </div>
      <div className="text-secondary small mb-2">
        Combine any of these — e.g. two projects and one city — to
        find users with matching access. Full-access users always
        match, since they can already see everything.
      </div>
      <div className="d-flex flex-wrap gap-2">
        <button
          type="button"
          className={
            "btn btn-sm rounded-pill px-3 " +
            (value.fullAccessOnly ? "btn-navy" : "btn-outline-navy")
          }
          onClick={() =>
            onChange({ ...value, fullAccessOnly: !value.fullAccessOnly })
          }
        >
          ⭐ Full access only
        </button>
        <FilterDropdown
          icon="📁"
          label="Projects"
          options={projectOptions}
          selectedIds={value.projects}
          onApply={(ids) => setKey("projects", ids)}
          disabled={value.fullAccessOnly}
        />
        <FilterDropdown
          icon="🏢"
          label="Company"
          options={companyOptions}
          selectedIds={value.companies}
          onApply={(ids) => setKey("companies", ids)}
          disabled={value.fullAccessOnly}
        />
        <FilterDropdown
          icon="🏙️"
          label="City"
          options={cityOptions}
          selectedIds={value.cities}
          onApply={(ids) => setKey("cities", ids)}
          disabled={value.fullAccessOnly}
        />
      </div>
      {chips.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-3 pt-3 border-top">
          {chips.map((chip, i) => (
            <span
              key={i}
              className="d-inline-flex align-items-center gap-2 small"
              style={{
                background: "#eaf1fb",
                color: "var(--navy)",
                borderRadius: 20,
                padding: "4px 6px 4px 12px",
              }}
            >
              {chip.text}
              <button
                type="button"
                aria-label={"Remove filter " + chip.text}
                onClick={() =>
                  chip.key === "fullAccessOnly"
                    ? onChange({ ...value, fullAccessOnly: false })
                    : removeChip(chip.key, chip.id)
                }
                style={{
                  border: "none",
                  background: "rgba(11,61,122,.12)",
                  color: "var(--navy)",
                  borderRadius: "50%",
                  width: 18,
                  height: 18,
                  lineHeight: 1,
                  fontSize: 12,
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
    </div>
  );
}
