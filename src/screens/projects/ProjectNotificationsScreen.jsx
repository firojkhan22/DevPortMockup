// src/screens/projects/ProjectNotificationsScreen.jsx
// Provides (global): ProjectNotificationsScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// BRD feedback: "Notifications and Queries / Actionable to be
// separate" — kept as two distinct, clearly-labeled sections here
// (not tabs merged into one list), AND this whole screen is its own
// route reached from Project Summary via a button, rather than
// being embedded as a tab inside Project Summary itself.
function ProjectNotificationsScreen({ onMenuClick }) {
  // Reached from its own sidebar menu entry — select a project
  // first, same pattern as Bank Accounts / Unit Data Upload, rather
  // than being tied to arriving from a specific project's page.
  const [projectName, setProjectName] = useState(BUILDER_PROJECT_NAMES[0]);
  const p =
    BUILDER_PROJECT_DETAILS.find((x) => x.n === projectName) ||
    BUILDER_PROJECT_DETAILS[0];
  const [activeItem, setActiveItem] = useState(null);
  const [activeKind, setActiveKind] = useState(null);

  // Read-only — informational, nothing to action here.
  const NOTIFICATIONS = [
    {
      icon: "✅",
      text: "RERA extension approved for " + p.n,
      age: "2 days ago",
    },
    {
      icon: "💰",
      text: "Disbursement of ₹28.5L processed for a customer in " + p.n,
      age: "4 days ago",
    },
    {
      icon: "📈",
      text: "Work progress update accepted for this project",
      age: "1 week ago",
    },
  ];

  // Actionable — the developer needs to do something here, split
  // the same way the global Pending Documents / Queries screen
  // does, just scoped to this one project.
  const PENDING_DOCS = [
    {
      raisedBy: "Technical Team",
      category: "Document",
      text: "RERA certificate copy missing for Wing B",
      age: "2 days ago",
    },
  ];
  const PENDING_QUERIES = [
    {
      raisedBy: "Legal Team",
      category: "General",
      text: "Please confirm the current stage of construction for Wing B.",
      age: "1 day ago",
    },
  ];

  return (
    <div>
      <TopBar
        title="Notifications & Queries"
        sub="Select a project to view its notifications and actionable items"
        onMenuClick={onMenuClick}
      />

      <div className="mb-4" style={{ maxWidth: 360 }}>
        <ProjectPickerField
          label="Select project"
          value={projectName}
          onChange={setProjectName}
        />
      </div>

      <div className="fw-semibold mb-2">Notifications</div>
      <div className="d-flex flex-column gap-2 mb-4">
        {NOTIFICATIONS.map((n, i) => (
          <div key={i} className="repeat-row p-3 d-flex align-items-start gap-2">
            <span className="fs-5">{n.icon}</span>
            <div className="flex-fill small">
              <div>{n.text}</div>
              <div className="text-secondary">{n.age}</div>
            </div>
          </div>
        ))}
        {NOTIFICATIONS.length === 0 && (
          <div className="small text-secondary">
            No notifications for this project yet.
          </div>
        )}
      </div>

      <div className="fw-semibold mb-2">
        Queries &amp; Actionable ({PENDING_DOCS.length + PENDING_QUERIES.length})
      </div>
      <div className="row g-3">
        {PENDING_DOCS.map((item, i) => (
          <div className="col-12 col-md-6" key={"doc" + i}>
            <div className="querycard p-3">
              <div className="d-flex justify-content-between fw-semibold small">
                <span>Raised by: {item.raisedBy}</span>
                <span className="badge bg-warning-subtle text-warning">
                  Document
                </span>
              </div>
              <div className="text-secondary small my-2">
                {item.text} · {item.age}
              </div>
              <button
                className="btn btn-outline-navy btn-sm"
                onClick={() => {
                  setActiveItem(item);
                  setActiveKind("documents");
                }}
              >
                Upload / Request waiver
              </button>
            </div>
          </div>
        ))}
        {PENDING_QUERIES.map((item, i) => (
          <div className="col-12 col-md-6" key={"query" + i}>
            <div className="querycard p-3">
              <div className="d-flex justify-content-between fw-semibold small">
                <span>Raised by: {item.raisedBy}</span>
                <span className="badge bg-warning-subtle text-warning">
                  {item.category}
                </span>
              </div>
              <div className="text-secondary small my-2">
                {item.text} · {item.age}
              </div>
              <button
                className="btn btn-outline-navy btn-sm"
                onClick={() => {
                  setActiveItem(item);
                  setActiveKind("queries");
                }}
              >
                Respond
              </button>
            </div>
          </div>
        ))}
        {PENDING_DOCS.length + PENDING_QUERIES.length === 0 && (
          <div className="col-12 small text-secondary">
            Nothing actionable on this project right now.
          </div>
        )}
      </div>

      {activeItem && activeKind === "documents" && (
        <DocRequirementModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      )}
      {activeItem && activeKind === "queries" && (
        <QueryRespondModal
          item={activeItem}
          onClose={() => setActiveItem(null)}
        />
      )}
    </div>
  );
}
