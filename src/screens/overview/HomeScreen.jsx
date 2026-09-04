// src/screens/overview/HomeScreen.jsx
// Provides (global): HomeScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 1. DASHBOARD ================= */
function HomeScreen({ onMenuClick, onNav }) {
  const [query, setQuery] = useState("");
  const [activePill, setActivePill] = useState("Dashboard");
  const [showPromo, setShowPromo] = useState(true);
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : "Good evening";

  const pills = [
    { label: "Dashboard", nav: "dashboard", icon: "▦" },
    { label: "My Pending Projects", nav: "allProjects", icon: "📁" },
    { label: "My Pending Queries", nav: "queries", icon: "💬" },
    { label: "Recent Projects", nav: "allProjects", icon: "🕓" },
  ];
  const quickActions = [
    {
      label: "Create Project (Lead)",
      desc: "Start a new project submission",
      icon: "📁",
      nav: "newproject",
    },
    {
      label: "Create Customer Lead",
      desc: "Add a single customer lead",
      icon: "🧾",
      nav: "leadsEntry",
    },
    {
      label: "Update Inventory",
      desc: "Sold/unsold units by category",
      icon: "🏢",
      nav: "inventory",
    },
    {
      label: "Raise Issue",
      desc: "Report a problem you're facing",
      icon: "🚩",
      nav: "raiseIssue",
    },
  ];
  const recentActivity = [
    {
      t: "Query answered on Riverside Heights",
      d: "2 hours ago",
      icon: "💬",
    },
    { t: "RERA extension approved", d: "Yesterday", icon: "✅" },
    {
      t: "₹1.2 Cr disbursed — Green Valley Phase 2",
      d: "2 days ago",
      icon: "₹",
    },
  ];

  return (
    <div>
      <TopBar title="Home" sub={null} onMenuClick={onMenuClick} />

      {showPromo && (
        <div className="promo-banner mb-3">
          <span>
            New Construction Finance Scheme for Developers: Special
            interest rates and faster approvals!{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onNav("bankcampaigns");
              }}
            >
              Learn More
            </a>
          </span>
          <span
            role="button"
            onClick={() => setShowPromo(false)}
            style={{ opacity: 0.8 }}
          >
            &times;
          </span>
        </div>
      )}

      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="home-hero">
            <div className="hero-blob"></div>
            <div className="text-secondary small mb-1 position-relative">
              {greeting}, Firoj 👋
            </div>
            <h3 className="fw-bold mb-1 position-relative">
              What are you looking for today?
            </h3>
            <div className="text-secondary small mb-4 position-relative">
              12 active projects · 3 pending queries · 2 open issues
            </div>
            <div className="home-search mb-4 position-relative">
              <span className="search-icon">🔍</span>
              <input
                className="form-control"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search using project name, project ID, customer name etc."
              />
            </div>
            <div className="d-flex gap-2 justify-content-center flex-wrap position-relative">
              {pills.map((p, i) => (
                <button
                  key={i}
                  className={
                    "home-pill " +
                    (activePill === p.label ? "active" : "")
                  }
                  onClick={() => {
                    setActivePill(p.label);
                    onNav(p.nav);
                  }}
                >
                  <span className="me-1">{p.icon}</span>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="kpi-card p-3 mt-3">
            <h6 className="fw-bold mb-3">Recent Activity</h6>
            {recentActivity.map((a, i) => (
              <div
                key={i}
                className={
                  "d-flex align-items-center gap-3 py-2 " +
                  (i < recentActivity.length - 1 ? "border-bottom" : "")
                }
              >
                <div className="icon-chip" style={{ fontSize: 14 }}>
                  {a.icon}
                </div>
                <div className="flex-fill small">{a.t}</div>
                <div
                  className="text-secondary"
                  style={{ fontSize: 11.5 }}
                >
                  {a.d}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="kpi-card p-3">
            <h6 className="fw-bold mb-3">Quick Actions</h6>
            <div className="d-flex flex-column gap-2">
              {quickActions.map((a, i) => (
                <button
                  key={i}
                  className="quick-action-btn"
                  onClick={() => onNav(a.nav)}
                >
                  <span className="quick-action-icon">{a.icon}</span>
                  <span>
                    <span className="d-block">{a.label}</span>
                    <span
                      className="d-block fw-normal"
                      style={{ fontSize: 11, color: "#5c6b80" }}
                    >
                      {a.desc}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
