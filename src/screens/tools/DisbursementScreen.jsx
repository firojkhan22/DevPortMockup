// src/screens/tools/DisbursementScreen.jsx
// Provides (global): DisbursementScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.



function DisbursementScreen({ onMenuClick }) {
  const [view, setView] = useState("disbursed"); // disbursed | pending
  const [detail, setDetail] = useState(null);

  const disbursedRows = [
    {
      name: "Mr Dileep Kumar Medharametla",
      file: "2009234",
      unit: "Flat 1405, Floor 14",
      lastDate: "22 Nov 2025",
      status: "Fully disbursed",
      payee: "Mr Dileep Kumar Medharametla",
      acct: "50100234567890",
      bank: "HDFC Bank",
      ifsc: "HDFC0001234",
      reqDate: "20 Nov 2025",
      txns: [
        { no: 1, mode: "Cheque", ref: "632027", date: "22 Nov 2025", amt: 3687657 },
      ],
    },
    {
      name: "Capt Aravind V",
      file: "2009201",
      unit: "Flat 1603, Floor 16, Jasmine",
      lastDate: "18 Mar 2025",
      status: "Partially disbursed",
      payee: "Capt Aravind V",
      acct: "50100987654321",
      bank: "ICICI Bank",
      ifsc: "ICIC0001122",
      reqDate: "01 Feb 2025",
      txns: [
        { no: 1, mode: "NEFT", ref: "UTR2209871", date: "03 Feb 2025", amt: 2000000 },
        { no: 2, mode: "NEFT", ref: "UTR2209872", date: "18 Mar 2025", amt: 1200000 },
      ],
    },
    {
      name: "Mrs Vidya Balasubramanian",
      file: "2009250",
      unit: "Flat 1209, Floor 8",
      lastDate: "—",
      status: "Confirmation pending",
      payee: "Mrs Vidya Balasubramanian",
      acct: "50100112233445",
      bank: "HDFC Bank",
      ifsc: "HDFC0001234",
      reqDate: "25 Nov 2025",
      txns: [],
    },
  ];

  const pendingRows = [
    {
      name: "Mr Immanuel Rajkumar",
      file: "2009260",
      unit: "Flat 1208, Floor 13",
      due: "₹18,50,000",
      expected: "05 Dec 2025",
    },
    {
      name: "Mr Mahender Pandarirao Chitoor",
      file: "2009261",
      unit: "Flat 107, Floor 1",
      due: "₹9,20,000",
      expected: "10 Dec 2025",
    },
  ];

  function pill(status) {
    if (status === "Fully disbursed") return "bg-success-subtle text-success";
    if (status === "Partially disbursed") return "bg-primary-subtle text-primary";
    return "bg-warning-subtle text-warning";
  }

  const [disbFilters, setDisbFilters] = useState({});
  function setDisbFilter(key, value) {
    setDisbFilters((prev) => ({ ...prev, [key]: value }));
  }
  const [disbSort, setDisbSort] = useSortState(null);
  const filteredDisbursedRows = sortRows(
    disbursedRows.filter(
      (r) =>
        filterMatch(r.name, disbFilters.name) &&
        filterMatch(r.file, disbFilters.file) &&
        filterMatch(r.unit, disbFilters.unit) &&
        filterMatch(r.lastDate, disbFilters.lastDate) &&
        filterMatch(r.status, disbFilters.status),
    ),
    disbSort,
    {
      name: (r) => r.name,
      file: (r) => r.file,
      unit: (r) => r.unit,
      lastDate: (r) => r.lastDate,
      status: (r) => r.status,
    },
  );

  const [pendingFilters, setPendingFilters] = useState({});
  function setPendingFilter(key, value) {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  }
  const [pendingSort, setPendingSort] = useSortState(null);
  const filteredPendingRows = sortRows(
    pendingRows.filter(
      (r) =>
        filterMatch(r.name, pendingFilters.name) &&
        filterMatch(r.file, pendingFilters.file) &&
        filterMatch(r.unit, pendingFilters.unit) &&
        filterMatch(r.due, pendingFilters.due) &&
        filterMatch(r.expected, pendingFilters.expected),
    ),
    pendingSort,
    {
      name: (r) => r.name,
      file: (r) => r.file,
      unit: (r) => r.unit,
      due: (r) => r.due,
      expected: (r) => r.expected,
    },
  );

  return (
    <div>
      <TopBar
        title="Project Disbursement"
        sub="Processed in PAMS — shown here read-only"
        onMenuClick={onMenuClick}
      />
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <select className="form-select" style={{ maxWidth: 260 }}>
          <option>Alliance Orchid Springs (54217)</option>
        </select>
        <select className="form-select" style={{ maxWidth: 220 }}>
          <option>Orchid Springs Pearl</option>
        </select>
        <input
          className="form-control"
          style={{ maxWidth: 220 }}
          placeholder="Search customer..."
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6 col-md-4">
          <div className="kpi-card p-3">
            <div className="text-secondary small">
              Total disbursement
            </div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              ₹2.23 Cr{" "}
              <span className="fs-6 fw-normal text-secondary">
                of ₹4.30 Cr
              </span>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Balance amount</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              ₹2.07 Cr
            </div>
          </div>
        </div>
        <div className="col-6 col-md-4">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Total loans</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              119
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <button
          className={
            "btn btn-sm " +
            (view === "disbursed" ? "btn-navy" : "btn-outline-navy")
          }
          onClick={() => setView("disbursed")}
        >
          Disbursed list
        </button>
        <button
          className={
            "btn btn-sm " +
            (view === "pending" ? "btn-navy" : "btn-outline-navy")
          }
          onClick={() => setView("pending")}
        >
          Pending disbursement requests
        </button>
      </div>

      {view === "disbursed" ? (
        <div className="kpi-card p-0 table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr className="text-secondary small">
                <SortableTh label="Customer name" sortKey="name" sort={disbSort} onSort={(k) => toggleSort(disbSort, setDisbSort, k)} />
                <SortableTh label="File no." sortKey="file" sort={disbSort} onSort={(k) => toggleSort(disbSort, setDisbSort, k)} />
                <SortableTh label="Flat no." sortKey="unit" sort={disbSort} onSort={(k) => toggleSort(disbSort, setDisbSort, k)} />
                <SortableTh label="Last disb. date" sortKey="lastDate" sort={disbSort} onSort={(k) => toggleSort(disbSort, setDisbSort, k)} />
                <SortableTh label="Loan status" sortKey="status" sort={disbSort} onSort={(k) => toggleSort(disbSort, setDisbSort, k)} />
                <th></th>
              </tr>
              <GridFilterRow
                columns={[
                  {
                    value: disbFilters.name || "",
                    onChange: (v) => setDisbFilter("name", v),
                    placeholder: "Filter name…",
                  },
                  {
                    value: disbFilters.file || "",
                    onChange: (v) => setDisbFilter("file", v),
                    placeholder: "Filter file no…",
                  },
                  {
                    value: disbFilters.unit || "",
                    onChange: (v) => setDisbFilter("unit", v),
                    placeholder: "Filter flat…",
                  },
                  {
                    value: disbFilters.lastDate || "",
                    onChange: (v) => setDisbFilter("lastDate", v),
                    placeholder: "Filter date…",
                  },
                  {
                    value: disbFilters.status || "",
                    onChange: (v) => setDisbFilter("status", v),
                    placeholder: "Filter…",
                  },
                  null,
                ]}
              />
            </thead>
            <tbody>
              {filteredDisbursedRows.map((r, i) => (
                <tr key={i} role="button" onClick={() => setDetail(r)}>
                  <td className="fw-semibold">{r.name}</td>
                  <td>{r.file}</td>
                  <td>{r.unit}</td>
                  <td>{r.lastDate}</td>
                  <td>
                    <span className={"status-pill " + pill(r.status)}>
                      {r.status}
                    </span>
                  </td>
                  <td className="text-end">
                    <span style={{ color: "var(--navy)" }}>
                      👁 View
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="kpi-card p-0 table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr className="text-secondary small">
                <SortableTh label="Customer name" sortKey="name" sort={pendingSort} onSort={(k) => toggleSort(pendingSort, setPendingSort, k)} />
                <SortableTh label="File no." sortKey="file" sort={pendingSort} onSort={(k) => toggleSort(pendingSort, setPendingSort, k)} />
                <SortableTh label="Flat no." sortKey="unit" sort={pendingSort} onSort={(k) => toggleSort(pendingSort, setPendingSort, k)} />
                <SortableTh label="Pending amount" sortKey="due" sort={pendingSort} onSort={(k) => toggleSort(pendingSort, setPendingSort, k)} />
                <SortableTh label="Expected date" sortKey="expected" sort={pendingSort} onSort={(k) => toggleSort(pendingSort, setPendingSort, k)} />
              </tr>
              <GridFilterRow
                columns={[
                  {
                    value: pendingFilters.name || "",
                    onChange: (v) => setPendingFilter("name", v),
                    placeholder: "Filter name…",
                  },
                  {
                    value: pendingFilters.file || "",
                    onChange: (v) => setPendingFilter("file", v),
                    placeholder: "Filter file no…",
                  },
                  {
                    value: pendingFilters.unit || "",
                    onChange: (v) => setPendingFilter("unit", v),
                    placeholder: "Filter flat…",
                  },
                  {
                    value: pendingFilters.due || "",
                    onChange: (v) => setPendingFilter("due", v),
                    placeholder: "Filter amount…",
                  },
                  {
                    value: pendingFilters.expected || "",
                    onChange: (v) => setPendingFilter("expected", v),
                    placeholder: "Filter date…",
                  },
                ]}
              />
            </thead>
            <tbody>
              {filteredPendingRows.map((r, i) => (
                <tr key={i}>
                  <td className="fw-semibold">{r.name}</td>
                  <td>{r.file}</td>
                  <td>{r.unit}</td>
                  <td>{r.due}</td>
                  <td>{r.expected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detail && (
        <DisbursementDetailModal
          row={detail}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}
