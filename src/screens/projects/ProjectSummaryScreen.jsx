// src/screens/projects/ProjectSummaryScreen.jsx
// Provides (global): ProjectSummaryScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function ProjectSummaryScreen({ onMenuClick, onBack, project, onEdit, onViewStatement }) {
  const [tab, setTab] = useState(0);
  const p = project || BUILDER_PROJECT_DETAILS[0];
  const tabs = [
    "Summary",
    "Progress",
    "Loan Details",
    "Construction Finance",
    "Inventory",
    "Customer Management",
  ];
  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-2">
        <button
          className="btn btn-outline-secondary d-md-none"
          onClick={onMenuClick}
        >
          ☰
        </button>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="text-secondary small"
          style={{ textDecoration: "none" }}
        >
          ← All Projects
        </a>
      </div>
      <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
        <div className="topbar-icon d-none d-sm-flex">🏗️</div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h4
              className="mb-0 fw-bold"
              style={{ color: "var(--navy)" }}
            >
              {p.n}
            </h4>
            <span className="badge badge-navy">Residential</span>
            <span
              className={"status-pill " + projSummaryPill(p.status)}
            >
              {projectStatusLabel(p.status)}
            </span>
          </div>
          <div className="text-secondary small mt-1">
            📍 {p.loc} · {p.firm}
          </div>
        </div>
        <button
          className="btn btn-outline-navy btn-sm"
          onClick={() => onEdit && onEdit(p)}
        >
          ✏️ Edit project lead
        </button>
      </div>

      <div className="section-tabs-wrap mb-3">
        <div className="section-tabs" role="tablist">
          {tabs.map((t, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={tab === i}
              className={"section-tab" + (tab === i ? " active" : "")}
              onClick={() => setTab(i)}
            >
              <span className="section-tab-num">{i + 1}</span>
              <span className="section-tab-label">{t}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 0 && <SummaryTab p={p} />}
      {tab === 1 && <ProgressTab />}
      {tab === 2 && <LoanDetailsTab p={p} onViewStatement={onViewStatement} />}
      {tab === 3 && <ConstructionFinanceTab />}
      {tab === 4 && <InventoryTab />}
      {tab === 5 && <CustomerManagementTab />}
    </div>
  );
}
