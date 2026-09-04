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

  const dueSoonCount = rows.filter(
    (r) => userReviewState(r) === "due_soon",
  ).length;
  const frozenCount = rows.filter(
    (r) => userReviewState(r) === "frozen",
  ).length;

  const [filters, setFilters] = useState({});
  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  const [accessFilter, setAccessFilter] = useState({
    fullAccessOnly: false,
    projects: [],
    companies: [],
    cities: [],
  });
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
      ),
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
      {frozenCount > 0 && (
        <div className="alert alert-danger small py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>
            🔒 Access frozen for {frozenCount} user
            {frozenCount > 1 ? "s" : ""} — their quarterly review is
            overdue. They can't use the portal until reviewed.
          </span>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={() => setOnlyNeedsReview(true)}
          >
            Show these users
          </button>
        </div>
      )}
      {dueSoonCount > 0 && (
        <div className="alert alert-warning small py-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span>
            ⏳ Periodic review due for {dueSoonCount} user
            {dueSoonCount > 1 ? "s" : ""} within 20 days — required
            quarterly for all builder users.
          </span>
          <button
            className="btn btn-outline-navy btn-sm"
            onClick={() => setOnlyNeedsReview(true)}
          >
            Show these users
          </button>
        </div>
      )}

      <AccessFilterBar value={accessFilter} onChange={setAccessFilter} />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="onlyneedsreview"
            checked={onlyNeedsReview}
            onChange={(e) => setOnlyNeedsReview(e.target.checked)}
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
