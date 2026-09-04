// src/screens/project-data/BankListingScreen.jsx
// Provides (global): BankListingScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 7. BANK ACCOUNTS: LISTING + ENTRY ================= */
function BankListingScreen({ onMenuClick, onAddAccount, onEditAccount }) {
  const rows = [
    {
      label: "Riverside Heights",
      payee: "Safleworks Constructions Pvt Ltd",
      bank: "HDFC Bank",
      acct: "••••••4532",
      acctFull: "50100234534532",
      ifsc: "HDFC0000123",
      branch: "Andheri East, Mumbai",
      accountType: "Current",
      rera: "Yes",
      paymentTypes: ["Sale consideration", "GST and Taxes"],
    },
    {
      label: "Green Valley Phase 2",
      payee: "Safleworks Constructions Pvt Ltd",
      bank: "ICICI Bank",
      acct: "••••••1187",
      acctFull: "601101187001187",
      ifsc: "ICIC0001234",
      branch: "Baner, Pune",
      accountType: "Current",
      rera: "No",
      paymentTypes: ["Sale consideration"],
    },
  ];
  const [filters, setFilters] = useState({});
  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  const [sort, setSort] = useSortState("label");
  const filteredRows = sortRows(
    rows.filter(
      (r) =>
        filterMatch(r.label, filters.label) &&
        filterMatch(r.bank, filters.bank) &&
        filterMatch(r.acct, filters.acct) &&
        filterMatch(r.rera, filters.rera),
    ),
    sort,
    {
      label: (r) => r.label,
      bank: (r) => r.bank,
      acct: (r) => r.acct,
      rera: (r) => r.rera,
    },
  );
  return (
    <div>
      <TopBar
        title="Bank Accounts Listing"
        sub="Accounts on file for this builder"
        onMenuClick={onMenuClick}
        action={
          <button className="btn btn-navy btn-sm" onClick={onAddAccount}>
            + Add New Account
          </button>
        }
      />
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <SortableTh label="Project" sortKey="label" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Bank" sortKey="bank" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Account" sortKey="acct" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="RERA collection a/c" sortKey="rera" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <th></th>
            </tr>
            <GridFilterRow
              columns={[
                {
                  value: filters.label || "",
                  onChange: (v) => setFilter("label", v),
                  placeholder: "Filter project…",
                },
                {
                  value: filters.bank || "",
                  onChange: (v) => setFilter("bank", v),
                  placeholder: "Filter bank…",
                },
                {
                  value: filters.acct || "",
                  onChange: (v) => setFilter("acct", v),
                  placeholder: "Filter account…",
                },
                {
                  value: filters.rera || "",
                  onChange: (v) => setFilter("rera", v),
                  placeholder: "Filter…",
                },
                null,
              ]}
            />
          </thead>
          <tbody>
            {filteredRows.map((r, i) => (
              <tr key={i}>
                <td className="fw-semibold">{r.label}</td>
                <td>{r.bank}</td>
                <td>{r.acct}</td>
                <td>{r.rera}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => onEditAccount(r)}
                  >
                    Edit
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
