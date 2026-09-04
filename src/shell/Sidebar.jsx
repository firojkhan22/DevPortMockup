// src/shell/Sidebar.jsx
// Provides (global): Sidebar
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= SHELL: SIDEBAR / TOPBAR / MASTHEAD ================= */
function Sidebar({
  active,
  setActive,
  onLogout,
  passkeyEnabled,
  collapsed,
  onToggleCollapse,
  verificationStage,
}) {
  // Visual lock icon only — actual navigation guarding happens once,
  // centrally, in AppShell's navigateTo (via the shared isScreenLocked).
  function isLocked(id) {
    return isScreenLocked(id, verificationStage);
  }
  const sections = [
    {
      label: "Overview",
      items: [
        { id: "home", label: "Home", icon: "🏠" },
        { id: "dashboard", label: "Dashboard", icon: "▦" },
      ],
    },
    {
      label: "Builder / Company",
      items: [
        { id: "companyListing", label: "Company Listing", icon: "🏗️" },
        { id: "developerProfile", label: "Builder Group Profile", icon: "📊" },
      ],
    },
    {
      label: "Account",
      items: [
        { id: "profile", label: "My Profile", icon: "🙍" },
        { id: "usersListing", label: "User Management", icon: "👤" },
        ...(passkeyEnabled
          ? [{ id: "passkey", label: "Passkey Security", icon: "🔑" }]
          : []),
      ],
    },
    {
      label: "Projects",
      items: [
        { id: "allProjects", label: "All Projects", icon: "📁" },
        { id: "queries", label: "Respond to Queries", icon: "💬" },
        { id: "myQueries", label: "Queries I Raised", icon: "🗨️" },
      ],
    },
    {
      label: "Project data",
      items: [
        { id: "bankListing", label: "Bank Accounts", icon: "🏦" },
        { id: "rera", label: "RERA Detail Update", icon: "📋" },
        { id: "oc", label: "OC Detail Update", icon: "🧾" },
        { id: "constructionFinance", label: "Construction Finance", icon: "💰" },
        { id: "inventory", label: "Inventory Update", icon: "🏢" },
        { id: "progress", label: "Update Work Progress", icon: "📈" },
        { id: "unitdata", label: "Unit Data Upload", icon: "📤" },
        { id: "projectNotifications", label: "Notifications & Queries", icon: "🔔" },
      ],
    },
    {
      label: "Business",
      items: [
        { id: "leadsListing", label: "Customer Leads", icon: "🧾" },
        { id: "campaignsListing", label: "My Campaigns", icon: "📢" },
        { id: "bankcampaigns", label: "HDFC Bank Campaigns", icon: "🏷️" },
      ],
    },
    {
      label: "MIS",
      items: [
        { id: "disbursementStatement", label: "Disbursement Statement", icon: "📊" },
      ],
    },
    {
      label: "Tools & Support",
      items: [
        { id: "disbursement", label: "Project Disbursement", icon: "💳" },
        { id: "calculators", label: "Calculators", icon: "🧮" },
        { id: "coordinators", label: "Project Coordinators", icon: "👥" },
        { id: "issueListing", label: "Issue Listing", icon: "🗂️" },
        { id: "raiseIssue", label: "Raise Issue", icon: "🚩" },
      ],
    },
  ];
  return (
    <div
      className={
        "sidebar d-flex flex-column py-3 " +
        (collapsed ? "collapsed" : "")
      }
      style={{ width: 230 }}
    >
      <div className="d-flex align-items-center gap-2 px-3 pb-3">
        <img
          className="brand-logo"
          src={LOGO_DATA_URI}
          alt="HDFC Bank"
          style={{ height: 26 }}
        />
        <button
          className="sidebar-toggle-btn ms-auto"
          title={collapsed ? "Expand menu" : "Collapse menu"}
          onClick={onToggleCollapse}
        >
          {collapsed ? "\u00bb" : "\u00ab"}
        </button>
      </div>
      <div
        className="sidebar-id px-3 pb-3 small border-bottom"
        style={{
          color: "#c8d6ea",
          borderColor: "rgba(255,255,255,.15) !important",
        }}
      >
        finance@safleworks.com
        <br />
        Safleworks Constructions
      </div>
      {sections.map((sec, si) => (
        <div key={si}>
          <div className="nav-section">{sec.label}</div>
          {sec.items.map((it) => {
            const locked = isLocked(it.id);
            return (
              <div
                key={it.id}
                className={
                  "nav-item-custom " +
                  (active === it.id ? "active " : "") +
                  (locked ? "nav-item-locked" : "")
                }
                onClick={() => setActive(it.id)}
                title={
                  collapsed
                    ? it.label
                    : locked
                    ? it.label + " — locked until approved"
                    : ""
                }
              >
                <span className="me-2">{it.icon}</span>
                <span className="nav-label">{it.label}</span>
                {locked && (
                  <span className="ms-auto nav-lock-icon">🔒</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
      <div className="flex-fill"></div>
      <div
        className="nav-item-custom border-top mt-2"
        style={{ borderColor: "rgba(255,255,255,.15) !important" }}
        onClick={onLogout}
        title={collapsed ? "Log out" : ""}
      >
        <span className="me-2">⎋</span>
        <span className="nav-label">Log out</span>
      </div>
    </div>
  );
}
