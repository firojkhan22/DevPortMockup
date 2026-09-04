// src/screens/company/CompanyListingScreen.jsx
// Provides (global): CompanyListingScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 2. COMPANY LISTING + ENTRY ================= */
function CompanyListingScreen({
  onMenuClick,
  onAddCompany,
  onEditCompany,
  onViewUsers,
}) {
  const rows = [
    {
      n: "Safleworks Constructions Pvt Ltd",
      entityType: "PVT_LTD",
      pan: "AAAPL1234C",
      cin: "U45200MH2010PTC123456",
      city: "Mumbai",
      kyc: "Verified",
      status: "Approved",
    },
    {
      n: "Safleworks Riverside SPV LLP",
      entityType: "LLP",
      pan: "AAAPL5678D",
      cin: "AAA-1234",
      city: "Pune",
      kyc: "Pending",
      status: "Pending PAMS approval",
    },
    {
      n: "Shri Siddhivinayak Developers",
      entityType: "PARTNERSHIP",
      pan: "AACCS4321E",
      cin: "U45400MH2015PTC654321",
      city: "Bhandup",
      kyc: "Verified",
      status: "Approved",
    },
  ];
  function pill(status) {
    if (status === "Approved") return "bg-success-subtle text-success";
    if (status === "Blocked") return "bg-danger-subtle text-danger";
    return "bg-warning-subtle text-warning";
  }
  function kycPill(k) {
    return k === "Verified"
      ? "bg-success-subtle text-success"
      : "bg-warning-subtle text-warning";
  }
  const total = rows.length;
  const approved = rows.filter((r) => r.status === "Approved").length;
  const pending = rows.filter((r) => r.status !== "Approved").length;
  const kycPending = rows.filter((r) => r.kyc !== "Verified").length;
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useSortState("n");
  const filteredRows = sortRows(
    rows.filter(
      (r) =>
        filterMatch(r.n, filters.n) &&
        filterMatch(r.entityType, filters.entityType) &&
        filterMatch(r.pan, filters.pan) &&
        filterMatch(r.cin, filters.cin) &&
        filterMatch(r.city, filters.city) &&
        filterMatch(r.kyc, filters.kyc) &&
        filterMatch(r.status, filters.status),
    ),
    sort,
    {
      n: (r) => r.n,
      entityType: (r) => r.entityType,
      pan: (r) => r.pan,
      cin: (r) => r.cin,
      city: (r) => r.city,
      kyc: (r) => r.kyc,
      status: (r) => r.status,
    },
  );
  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  return (
    <div>
      <TopBar
        title="Company Listing"
        sub="All legal entities under Safleworks Group"
        onMenuClick={onMenuClick}
        action={
          <button className="btn btn-navy btn-sm" onClick={onAddCompany}>
            + Add New Company
          </button>
        }
      />
      <div className="row g-3 mb-3">
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Total companies</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              {total}
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Approved</div>
            <div className="fs-5 fw-bold text-success">{approved}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Pending approval</div>
            <div className="fs-5 fw-bold text-warning">{pending}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">KYC pending</div>
            <div className="fs-5 fw-bold text-danger">{kycPending}</div>
          </div>
        </div>
      </div>
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <select className="form-select" style={{ maxWidth: 180 }}>
          <option>All statuses</option>
          <option>Approved</option>
          <option>Pending PAMS approval</option>
          <option>Blocked</option>
        </select>
        <input
          className="form-control"
          style={{ maxWidth: 240 }}
          placeholder="Search company..."
        />
      </div>
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <SortableTh label="Company Name" sortKey="n" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Entity Type" sortKey="entityType" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="PAN" sortKey="pan" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="CIN / LLPIN" sortKey="cin" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="City" sortKey="city" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="KYC" sortKey="kyc" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Status" sortKey="status" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <th>Users</th>
              <th></th>
            </tr>
            <GridFilterRow
              columns={[
                {
                  value: filters.n || "",
                  onChange: (v) => setFilter("n", v),
                  placeholder: "Filter name…",
                },
                {
                  value: filters.entityType || "",
                  onChange: (v) => setFilter("entityType", v),
                  placeholder: "Filter…",
                },
                {
                  value: filters.pan || "",
                  onChange: (v) => setFilter("pan", v),
                  placeholder: "Filter PAN…",
                },
                {
                  value: filters.cin || "",
                  onChange: (v) => setFilter("cin", v),
                  placeholder: "Filter CIN…",
                },
                {
                  value: filters.city || "",
                  onChange: (v) => setFilter("city", v),
                  placeholder: "Filter city…",
                },
                {
                  value: filters.kyc || "",
                  onChange: (v) => setFilter("kyc", v),
                  placeholder: "Filter…",
                },
                {
                  value: filters.status || "",
                  onChange: (v) => setFilter("status", v),
                  placeholder: "Filter…",
                },
                null,
                null,
              ]}
            />
          </thead>
          <tbody>
            {filteredRows.map((r, i) => (
              <tr key={i}>
                <td className="fw-semibold">{r.n}</td>
                <td>
                  {(entityTypeInfo(r.entityType) &&
                    entityTypeInfo(r.entityType).name) ||
                    r.entityType}
                </td>
                <td>{maskPAN(r.pan)}</td>
                <td>{r.cin}</td>
                <td>{r.city}</td>
                <td>
                  <span className={"status-pill " + kycPill(r.kyc)}>
                    {r.kyc}
                  </span>
                </td>
                <td>
                  <span className={"status-pill " + pill(r.status)}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-navy"
                    onClick={() => onViewUsers && onViewUsers(r)}
                    title={"View users at " + r.n}
                  >
                    🧑‍🤝‍🧑 View
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={onEditCompany}
                    title={"Edit " + r.n}
                    aria-label={"Edit " + r.n}
                  >
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
