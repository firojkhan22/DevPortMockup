// src/screens/company/CompanyUsersScreen.jsx
// Provides (global): CompanyUsersScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function CompanyUsersScreen({ onMenuClick, onBack, backLabel, company }) {
  const companyName = (company && company.n) || DEFAULT_COMPANY_NAME;
  const isOwnCompany = !company;
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");

  const members =
    COMPANY_USERS_DATA[companyName] ||
    COMPANY_USERS_DATA[DEFAULT_COMPANY_NAME];

  function roleColor(role) {
    return role === "Developer Admin"
      ? { bg: "var(--navy)", fg: "#fff" }
      : { bg: "#0f766e", fg: "#fff" };
  }
  function statusPill(status) {
    return status === "Active"
      ? "bg-success-subtle text-success"
      : "bg-danger-subtle text-danger";
  }
  function initials(name) {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  const filtered = members.filter((m) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q);
    const matchesRole =
      roleFilter === "All roles" || m.role === roleFilter;
    return matchesQuery && matchesRole;
  });

  const total = members.length;
  const adminCount = members.filter(
    (m) => m.role === "Developer Admin"
  ).length;
  const userCount = members.filter(
    (m) => m.role === "Developer User"
  ).length;

  return (
    <div>
      {onBack && (
        <div className="d-flex align-items-center gap-2 mb-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="text-secondary small"
            style={{ textDecoration: "none" }}
          >
            ← {backLabel || "Back"}
          </a>
        </div>
      )}
      <TopBar
        title={isOwnCompany ? "My Company's Users" : "Company Users"}
        sub={"Everyone from " + companyName + " with portal access"}
        onMenuClick={onMenuClick}
      />

      <div className="row g-3 mb-3">
        <div className="col-6 col-md-4">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Team members</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              {total}
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Developer Admin</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              {adminCount}
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Developer User</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              {userCount}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3 flex-wrap">
        <input
          className="form-control"
          style={{ maxWidth: 240 }}
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="form-select"
          style={{ maxWidth: 200 }}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option>All roles</option>
          <option>Developer Admin</option>
          <option>Developer User</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="repeat-row p-4 text-center text-secondary small">
          No team members match that search.
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((m, i) => {
            const rc = roleColor(m.role);
            return (
              <div className="col-12 col-md-6 col-lg-3" key={i}>
                <div className="kpi-card p-3 h-100 d-flex flex-column">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: 48,
                        height: 48,
                        background: rc.bg,
                        color: rc.fg,
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {initials(m.name)}
                    </div>
                    <div className="overflow-hidden">
                      <div className="fw-semibold text-truncate">
                        {m.name}
                      </div>
                      <div className="text-secondary small text-truncate">
                        {m.designation}
                      </div>
                    </div>
                  </div>
                  <span
                    className="badge mb-2 align-self-start"
                    style={{ background: rc.bg, color: rc.fg }}
                  >
                    {m.role}
                  </span>
                  <div className="small text-secondary text-truncate mb-1">
                    ✉ {m.email}
                  </div>
                  <div className="small text-secondary mb-2">
                    📞 {m.mobile}
                  </div>
                  <div className="mt-auto d-flex align-items-center justify-content-between">
                    <span className={"status-pill " + statusPill(m.status)}>
                      {m.status}
                    </span>
                    <span className="small text-secondary">
                      {m.lastActive}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
