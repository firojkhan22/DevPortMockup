// src/screens/users/UsersScreen.jsx
// Provides (global): UsersScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function UsersScreen({
  onMenuClick,
  onAddUser,
  onEditUser,
  users,
  onReviewUser,
}) {
  const rows = users || [];
  const [reviewingUser, setReviewingUser] = useState(null);
  const [onlyNeedsReview, setOnlyNeedsReview] = useState(false);
  // A tile drill-down ("frozen" / "due_soon" / "active" / "all").
  // While set, the grid shows only that slice and every other search
  // criterion is cleared; applying any normal filter clears it.
  const [tileFilter, setTileFilter] = useState(null);

  const dueSoonCount = rows.filter(
    (r) => userReviewState(r) === "due_soon",
  ).length;
  const frozenCount = rows.filter(
    (r) => userReviewState(r) === "frozen",
  ).length;
  const activeCount = rows.filter(
    (r) => r.isActive && userReviewState(r) !== "frozen",
  ).length;

  const [filters, setFilters] = useState({});
  const EMPTY_ACCESS_FILTER = {
    fullAccessOnly: false,
    projects: [],
    companies: [],
    cities: [],
  };
  const [accessFilter, setAccessFilter] = useState(EMPTY_ACCESS_FILTER);

  // Any normal search criterion clears an active tile drill-down.
  function setFilter(key, value) {
    setTileFilter(null);
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  function changeAccessFilter(v) {
    setTileFilter(null);
    setAccessFilter(v);
  }
  function changeOnlyNeedsReview(checked) {
    setTileFilter(null);
    setOnlyNeedsReview(checked);
  }

  // A tile click: show only that slice, wiping every other filter.
  // Clicking the same tile again clears the drill-down.
  function applyTileFilter(key) {
    setTileFilter((cur) => (cur === key ? null : key));
    setFilters({});
    setAccessFilter(EMPTY_ACCESS_FILTER);
    setOnlyNeedsReview(false);
  }
  function matchesTile(r) {
    if (!tileFilter || tileFilter === "all") return true;
    const st = userReviewState(r);
    if (tileFilter === "active") return r.isActive && st !== "frozen";
    if (tileFilter === "frozen") return st === "frozen";
    if (tileFilter === "due_soon") return st === "due_soon";
    return true;
  }
  const [sort, setSort] = useSortState("name");
  const filteredRows = sortRows(
    rows
      .filter(
        (r) =>
          filterMatch(
            userFullName(r) + " " + r.email,
            filters.name,
          ) &&
          filterMatch(r.mobile, filters.mobile) &&
          filterMatch(r.designation, filters.designation) &&
          filterMatch(r.role, filters.role) &&
          userMatchesAccessFilter(r, accessFilter),
      )
      .filter(
        (r) =>
          !onlyNeedsReview ||
          ["due_soon", "frozen"].includes(userReviewState(r)),
      )
      .filter(matchesTile),
    sort,
    {
      name: (r) => userFullName(r),
      mobile: (r) => r.mobile,
      designation: (r) => r.designation,
      role: (r) => r.role,
      access: (r) => r.access,
      reviewDue: (r) => r.reviewDue,
    },
  );

  if (reviewingUser) {
    return (
      <ReviewUserPanel
        user={reviewingUser}
        onBack={() => setReviewingUser(null)}
        onReview={onReviewUser}
      />
    );
  }

  return (
    <div>
      <TopBar
        title="User Management"
        sub="Manage developer-portal users and access levels"
        onMenuClick={onMenuClick}
        action={
          <button
            className="btn btn-navy btn-sm"
            onClick={onAddUser}
          >
            + Add user
          </button>
        }
      />
      <div className="row g-2 mb-2">
        {[
          {
            key: "all",
            l: "Total users",
            v: rows.length,
            i: "👥",
            hint: "All developer-portal users on this account.",
          },
          {
            key: "active",
            l: "Active users",
            v: activeCount,
            i: "✅",
            hint: "Users who can currently sign in and use the portal.",
          },
          {
            key: "frozen",
            l: "Access frozen",
            v: frozenCount,
            i: "🔒",
            alarm: frozenCount > 0,
            tone: frozenCount > 0 ? "text-danger" : "",
            accent: "#dc3545",
            wash: "#f8d7da",
            hint:
              frozenCount > 0
                ? "🔒 Access frozen for " +
                  frozenCount +
                  " user" +
                  (frozenCount > 1 ? "s" : "") +
                  " — their quarterly review is overdue. They can't use the portal until reviewed. Click to view them."
                : "No users have frozen access.",
          },
          {
            key: "due_soon",
            l: "Periodic review due",
            v: dueSoonCount,
            i: "⏳",
            alarm: dueSoonCount > 0,
            tone: dueSoonCount > 0 ? "text-warning" : "",
            accent: "#ffc107",
            wash: "#fff3cd",
            hint:
              dueSoonCount > 0
                ? "⏳ Periodic review due for " +
                  dueSoonCount +
                  " user" +
                  (dueSoonCount > 1 ? "s" : "") +
                  " within 20 days — required quarterly for all builder users. Click to view them."
                : "No users are due for review in the next 20 days.",
          },
        ].map((k) => {
          const active = tileFilter === k.key;
          const style = {};
          if (k.alarm) {
            style.borderColor = k.accent;
            style.background = k.wash;
          }
          if (active) {
            style.borderColor = "var(--navy)";
            style.boxShadow = "0 0 0 2px var(--navy) inset";
          }
          return (
            <div className="col-6 col-lg-3" key={k.key}>
              <div
                className="kpi-card p-2 h-100"
                role="button"
                aria-pressed={active}
                title={k.hint}
                onClick={() => applyTileFilter(k.key)}
                style={Object.keys(style).length ? style : undefined}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-secondary" style={{ fontSize: 11.5 }}>
                    {k.l}
                  </span>
                  <span
                    className="icon-chip"
                    style={{ width: 22, height: 22, fontSize: 11 }}
                  >
                    {k.i}
                  </span>
                </div>
                <div className={"fs-6 fw-bold mt-1 " + (k.tone || "")}>
                  {k.v}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {tileFilter && (
        <div className="d-flex align-items-center gap-2 small mb-3">
          <span className="text-secondary">
            Showing{" "}
            <span className="fw-semibold">
              {tileFilter === "all"
                ? "all users"
                : tileFilter === "active"
                  ? "active users"
                  : tileFilter === "frozen"
                    ? "access-frozen users"
                    : "users with periodic review due"}
            </span>{" "}
            ({filteredRows.length}) — other filters cleared
          </span>
          <button
            className="btn btn-link btn-sm p-0"
            onClick={() => setTileFilter(null)}
          >
            Clear
          </button>
        </div>
      )}

      <AccessFilterBar value={accessFilter} onChange={changeAccessFilter} />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="onlyneedsreview"
            checked={onlyNeedsReview}
            onChange={(e) => changeOnlyNeedsReview(e.target.checked)}
          />
          <label
            className="form-check-label small"
            htmlFor="onlyneedsreview"
          >
            Show only users needing review (due soon or frozen)
          </label>
        </div>
      </div>

      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <SortableTh label="Name" sortKey="name" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Contact No." sortKey="mobile" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Designation" sortKey="designation" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Role" sortKey="role" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Access level" sortKey="access" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <th>Active</th>
              <SortableTh label="Next review" sortKey="reviewDue" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <th></th>
            </tr>
            <GridFilterRow
              columns={[
                {
                  value: filters.name || "",
                  onChange: (v) => setFilter("name", v),
                  placeholder: "Filter name/email…",
                },
                {
                  value: filters.mobile || "",
                  onChange: (v) => setFilter("mobile", v),
                  placeholder: "Filter contact…",
                },
                {
                  value: filters.designation || "",
                  onChange: (v) => setFilter("designation", v),
                  placeholder: "Filter…",
                },
                {
                  value: filters.role || "",
                  onChange: (v) => setFilter("role", v),
                  placeholder: "Filter…",
                },
                null,
                null,
                null,
                null,
              ]}
            />
          </thead>
          <tbody>
            {filteredRows.map((r, i) => {
              const state = userReviewState(r);
              return (
                <tr key={r.id || i}>
                  <td className="fw-semibold">
                    {userFullName(r)}
                    <div className="text-secondary" style={{ fontSize: 11 }}>
                      {r.email}
                    </div>
                  </td>
                  <td>{r.mobile || "—"}</td>
                  <td>{r.designation}</td>
                  <td>{r.role}</td>
                  <td>{r.access}</td>
                  <td>
                    <span
                      className={
                        "status-pill " +
                        (r.isActive && state !== "frozen"
                          ? "bg-success-subtle text-success"
                          : "bg-secondary-subtle text-secondary")
                      }
                    >
                      {r.isActive && state !== "frozen"
                        ? "Active"
                        : state === "frozen"
                          ? "Frozen"
                          : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        "status-pill " +
                        (state === "frozen"
                          ? "bg-danger-subtle text-danger"
                          : state === "due_soon"
                            ? "bg-warning-subtle text-warning"
                            : "bg-light text-secondary")
                      }
                    >
                      {r.reviewDue || "—"}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-sm btn-outline-navy icon-btn"
                      onClick={() => onEditUser(r)}
                      title={"Edit " + userFullName(r)}
                      aria-label={"Edit " + userFullName(r)}
                    >
                      <IconEdit />
                    </button>
                    <button
                      className={
                        "btn btn-sm icon-btn " +
                        (state === "frozen" || state === "due_soon"
                          ? "btn-navy"
                          : "btn-outline-secondary")
                      }
                      onClick={() => setReviewingUser(r)}
                      title={"Review access for " + userFullName(r)}
                      aria-label={"Review access for " + userFullName(r)}
                    >
                      <IconReview />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary icon-btn"
                      onClick={() =>
                        onReviewUser(
                          r.id,
                          r.isActive ? "revoke" : "confirm",
                        )
                      }
                      title={
                        (r.isActive ? "Deactivate " : "Activate ") +
                        userFullName(r)
                      }
                      aria-label={
                        (r.isActive ? "Deactivate " : "Activate ") +
                        userFullName(r)
                      }
                    >
                      {r.isActive ? <IconPersonSlash /> : <IconPersonCheck />}
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-secondary py-4">
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
