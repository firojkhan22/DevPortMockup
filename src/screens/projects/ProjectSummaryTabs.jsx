// src/screens/projects/ProjectSummaryTabs.jsx
// Provides (global): SummaryTab, ProgressTab, LoanDetailsTab, ConstructionFinanceTab, InventoryTab, CustomerManagementTab
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function SummaryTab({ p }) {
  return (
    <div className="row g-3">
      <div className="col-12">
        <div className="kpi-card p-3 mb-3">
          <div className="fw-semibold mb-3">Project details</div>
          <div className="row g-3 small">
            <div className="col-6 col-md-4">
              <div className="text-secondary">Location</div>
              <div className="fw-semibold">{p.loc}</div>
            </div>
            <div className="col-6 col-md-4">
              <div className="text-secondary">RERA no.</div>
              <div className="fw-semibold">P51800012345</div>
            </div>
            <div className="col-6 col-md-4">
              <div className="text-secondary">Launch date</div>
              <div className="fw-semibold">26 Aug 2024</div>
            </div>
            <div className="col-6 col-md-4">
              <div className="text-secondary">Stage of construction</div>
              <div className="fw-semibold">Under construction</div>
            </div>
            <div className="col-6 col-md-4">
              <div className="text-secondary">Category</div>
              <div className="fw-semibold">Residential</div>
            </div>
            <div className="col-6 col-md-4">
              <div className="text-secondary">Developer Name</div>
              <div className="fw-semibold">{p.firm}</div>
            </div>
          </div>
        </div>
        <div className="kpi-card p-3">
          <div className="fw-semibold mb-3">Contact person</div>
          <div className="row g-3 small">
            <div className="col-6 col-md-3">
              <div className="text-secondary">Name</div>
              <div className="fw-semibold">Suresh Patil</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-secondary">Designation</div>
              <div className="fw-semibold">Site Engineer</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-secondary">Mobile</div>
              <div className="fw-semibold">+91 98xxx xx766</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-secondary">Email</div>
              <div className="fw-semibold">contact@safleworks.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressTab() {
  const rows = [
    { n: "Tower A", floors: 12, date: "28 Feb 2026", pct: 30 },
    { n: "Tower B", floors: 12, date: "28 Feb 2026", pct: 50 },
    { n: "Tower C", floors: 12, date: "28 Feb 2026", pct: 97 },
    { n: "Tower D", floors: 12, date: "28 Feb 2026", pct: 70 },
  ];
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div className="small text-secondary">
          Building / Tower level progress
        </div>
        <select
          className="form-select form-select-sm"
          style={{ maxWidth: 160 }}
        >
          <option>Tower</option>
          <option>Bungalow</option>
        </select>
        <button className="btn btn-navy btn-sm">+ Add update</button>
      </div>
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <th>Building</th>
              <th>Total floors</th>
              <th>Progress date</th>
              <th>Completion</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="fw-semibold">{r.n}</td>
                <td>{r.floors} floors</td>
                <td>{r.date}</td>
                <td style={{ minWidth: 160 }}>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="progress flex-grow-1"
                      style={{ height: 6 }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: r.pct + "%",
                          background: "var(--navy)",
                        }}
                      ></div>
                    </div>
                    <span className="small text-secondary">
                      {r.pct}%
                    </span>
                  </div>
                </td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="small"
                    style={{ color: "var(--navy)" }}
                  >
                    Update
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LoanDetailsTab({ p, onViewStatement }) {
  const rows = [
    { t: "Tower A", loans: 109, pct: 33 },
    { t: "Tower B", loans: 109, pct: 41 },
    { t: "Tower C", loans: 109, pct: 55 },
    { t: "Tower D", loans: 109, pct: 62 },
  ];
  // Demo customer-level records per tower, for the inline
  // drill-down. Each has its own disbursement trail so "View
  // disbursement" has something real to show. Amounts are numeric
  // (paise-free rupees) so cumulative-per-file and status can be
  // computed rather than hard-coded, and each transaction now
  // carries the payee/account/bank/IFSC/request-date detail the
  // business asked to see at transaction level.
  const CUSTOMERS_BY_TOWER = {
    "Tower A": [
      {
        name: "Mr Dileep Kumar Medharametla",
        file: "2009234",
        unit: "Flat 1405, Floor 14",
        loanAmount: 3690000,
        disbAmount: 3690000,
        status: "Fully disbursed",
        disb: [
          {
            date: "2025-11-22", amt: 3690000, fundDate: "2025-11-22",
            utr: "UTR2209871", payee: "Mr Dileep Kumar Medharametla",
            acct: "50100234567890", bank: "HDFC Bank", ifsc: "HDFC0001234",
            reqDate: "2025-11-20",
          },
        ],
      },
      {
        name: "Mrs Vidya Balasubramanian",
        file: "2009250",
        unit: "Flat 1209, Floor 8",
        loanAmount: 4200000,
        disbAmount: 0,
        status: "Pending",
        disb: [],
      },
    ],
    "Tower B": [
      {
        name: "Capt Aravind V",
        file: "2009201",
        unit: "Flat 1603, Floor 16, Jasmine",
        loanAmount: 3200000,
        disbAmount: 3200000,
        status: "Fully disbursed",
        disb: [
          {
            date: "2025-02-03", amt: 2000000, fundDate: "2025-02-04",
            utr: "UTR2209872", payee: "Capt Aravind V",
            acct: "50100987654321", bank: "ICICI Bank", ifsc: "ICIC0001122",
            reqDate: "2025-02-01",
          },
          {
            date: "2025-03-18", amt: 1200000, fundDate: "2025-03-19",
            utr: "UTR2209873", payee: "Capt Aravind V",
            acct: "50100987654321", bank: "ICICI Bank", ifsc: "ICIC0001122",
            reqDate: "2025-03-15",
          },
        ],
      },
    ],
    "Tower C": [
      {
        name: "Ms Ananya Iyer",
        file: "2009288",
        unit: "Flat 902, Floor 9",
        loanAmount: 2850000,
        disbAmount: 2850000,
        status: "Fully disbursed",
        disb: [
          {
            date: "2026-01-10", amt: 2850000, fundDate: "2026-01-11",
            utr: "UTR2209880", payee: "Ms Ananya Iyer",
            acct: "50100556677889", bank: "Axis Bank", ifsc: "UTIB0001234",
            reqDate: "2026-01-08",
          },
        ],
      },
    ],
    "Tower D": [
      {
        name: "Mr Sanjay Rathod",
        file: "2009301",
        unit: "Flat 2104, Floor 21",
        loanAmount: 5500000,
        disbAmount: 1800000,
        status: "Partially disbursed",
        disb: [
          {
            date: "2026-03-05", amt: 1800000, fundDate: "2026-03-06",
            utr: "UTR2209902", payee: "Mr Sanjay Rathod",
            acct: "50100223344556", bank: "State Bank of India", ifsc: "SBIN0001234",
            reqDate: "2026-03-01",
          },
        ],
      },
    ],
  };
  const ALL_TOWERS = "__ALL__";

  // screen: "towers" | "customers" | "disbursement"
  const [screen, setScreen] = useState("towers");
  const [activeTower, setActiveTower] = useState(null);
  const [activeCustomer, setActiveCustomer] = useState(null);

  // Filters + export controls for the customer-level grid — shared
  // by the single-tower view and the new project-level (all towers)
  // view below.
  const [statusFilter, setStatusFilter] = useState("");
  const [quickPeriod, setQuickPeriod] = useState("This FY");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  // Export always mirrors what's visible in this grid — one row
  // per customer/file — matching the on-screen table rather than
  // exposing a separate summary/detail toggle.
  const exportDetail = false;

  const today = new Date("2026-08-04");
  const [rangeFrom, rangeTo] =
    quickPeriod === "Custom" ? [customFrom, customTo] : quickPeriodRange(quickPeriod, today);

  if (screen === "customers" && activeTower) {
    const isProjectLevel = activeTower === ALL_TOWERS;
    const customers = isProjectLevel
      ? Object.entries(CUSTOMERS_BY_TOWER).flatMap(([t, list]) =>
          list.map((c) => ({ ...c, tower: t })),
        )
      : (CUSTOMERS_BY_TOWER[activeTower] || []).map((c) => ({
          ...c,
          tower: activeTower,
        }));

    const filteredCustomers = customers.filter(
      (c) => !statusFilter || c.status === statusFilter,
    );

    function inRange(iso) {
      return (!rangeFrom || iso >= rangeFrom) && (!rangeTo || iso <= rangeTo);
    }

    // Summary export: one row per customer/file, with the
    // cumulative disbursement figure the business asked for.
    // Detail export: one row per disbursement transaction
    // (business requirement "customer level detail also to
    // export"), filtered to the selected date range.
    function buildExportRows() {
      if (!exportDetail) {
        return filteredCustomers.map((c) => ({
          tower: c.tower, name: c.name, file: c.file, unit: c.unit,
          loanAmount: c.loanAmount, disbAmount: c.disbAmount,
          modeOfTransaction: c.disbAmount > 0 ? "NEFT" : "—",
          status: c.status,
        }));
      }
      const out = [];
      filteredCustomers.forEach((c) => {
        c.disb.filter((d) => inRange(d.date)).forEach((d) => {
          out.push({
            tower: c.tower, name: c.name, file: c.file, unit: c.unit,
            loanAmount: c.loanAmount, status: c.status,
            date: d.date, amt: d.amt, utr: d.utr, payee: d.payee,
            acct: maskAccountNo(d.acct), bank: d.bank, ifsc: d.ifsc,
            reqDate: d.reqDate,
          });
        });
      });
      return out;
    }

    function exportHeaders() {
      return exportDetail
        ? ["Tower", "Customer", "File No", "Unit", "Loan Amount", "Loan Status",
           "Disbursement Date", "Amount Disbursed", "UTR No.", "Payee Name",
           "Account No.", "Bank", "IFSC Code", "Request Date"]
        : ["Tower", "Customer", "File No", "Unit", "Loan Amount",
           "Disbursed Amount", "Mode of Transaction", "Loan Status"];
    }
    function exportRowToArray(r) {
      return exportDetail
        ? [r.tower, r.name, r.file, r.unit, r.loanAmount, r.status,
           formatDDMMMYYYY(r.date), r.amt, r.utr, r.payee, r.acct, r.bank,
           r.ifsc, formatDDMMMYYYY(r.reqDate)]
        : [r.tower, r.name, r.file, r.unit, r.loanAmount, r.disbAmount,
           r.modeOfTransaction, r.status];
    }

    function handleExportExcel() {
      const headers = exportHeaders();
      const dataRows = buildExportRows().map(exportRowToArray);
      const csv = [headers, ...dataRows]
        .map((row) => row.map(csvCell).join(","))
        .join("\r\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Loan_Details_Disbursement.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    function handleExportPdf() {
      const headers = exportHeaders();
      const dataRows = buildExportRows().map(exportRowToArray);
      const rowsHtml = dataRows
        .map((row) => "<tr>" + row.map((v) => "<td>" + v + "</td>").join("") + "</tr>")
        .join("");
      const html =
        "<html><head><title>Loan Details — Disbursement</title><style>" +
        "body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#1a1a1a}" +
        "h1{font-size:18px;margin-bottom:4px}p{font-size:12px;color:#555;margin-top:0}" +
        "table{width:100%;border-collapse:collapse;font-size:11px;margin-top:16px}" +
        "th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}th{background:#f2f2f2}" +
        "</style></head><body>" +
        "<h1>Loan Details — Disbursement" + (p && p.n ? " · " + p.n : "") + "</h1>" +
        "<p>Generated on " + formatDDMMMYYYY(new Date().toISOString().slice(0, 10)) +
        (rangeFrom && rangeTo ? " · Period " + formatDDMMMYYYY(rangeFrom) + " – " + formatDDMMMYYYY(rangeTo) : "") +
        " · " + dataRows.length + " record" + (dataRows.length === 1 ? "" : "s") + "</p>" +
        "<table><thead><tr>" + headers.map((h) => "<th>" + h + "</th>").join("") +
        "</tr></thead><tbody>" + rowsHtml + "</tbody></table></body></html>";
      const win = window.open("", "_blank");
      if (!win) return;
      win.document.open();
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 250);
    }

    return (
      <div>
        <button
          className="btn btn-outline-navy btn-sm mb-3"
          onClick={() => setScreen("towers")}
        >
          ← Back to {isProjectLevel ? "project overview" : "towers"}
        </button>
        <div className="fw-semibold mb-2">
          {isProjectLevel
            ? "All towers — project-level disbursement"
            : activeTower + " — customers"}
        </div>

        <div className="kpi-card p-3 mb-3">
          <div className="row g-3 align-items-end">
            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold">
                Loan status
              </label>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="Fully disbursed">Disbursed — fully</option>
                <option value="Partially disbursed">Disbursed — partially</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div className="col-6 col-md-3">
              <label className="form-label small fw-semibold">
                Period (for export)
              </label>
              <select
                className="form-select form-select-sm"
                value={quickPeriod}
                onChange={(e) => setQuickPeriod(e.target.value)}
              >
                {STATEMENT_QUICK_PERIODS.map((qp) => (
                  <option key={qp}>{qp}</option>
                ))}
              </select>
            </div>
            {quickPeriod === "Custom" ? (
              <>
                <div className="col-6 col-md-2">
                  <label className="form-label small fw-semibold">
                    From date
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                  />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label small fw-semibold">
                    To date
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="col-12 col-md-4">
                <div className="small text-secondary">
                  {rangeFrom && rangeTo
                    ? formatDDMMMYYYY(rangeFrom) + " – " + formatDDMMMYYYY(rangeTo)
                    : "Select a period"}
                </div>
              </div>
            )}
            <div className="col-12 col-md-4 d-flex gap-2">
              <button
                type="button"
                className="btn btn-navy btn-sm w-100 d-flex align-items-center justify-content-center"
                onClick={handleExportExcel}
                disabled={filteredCustomers.length === 0}
              >
                <ExcelIcon /> Export to CSV
              </button>
              <button
                type="button"
                className="btn btn-outline-navy btn-sm w-100 d-flex align-items-center justify-content-center"
                onClick={handleExportPdf}
                disabled={filteredCustomers.length === 0}
              >
                <PdfIcon /> Export PDF
              </button>
            </div>
          </div>
        </div>

        <div className="kpi-card p-0 table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr className="text-secondary small">
                {isProjectLevel && <th>Tower</th>}
                <th>Customer Name</th>
                <th>File No</th>
                <th>Unit No</th>
                <th>Loan Amount</th>
                <th>Disbursed Amount</th>
                <th>Mode of Transaction</th>
                <th>Loan Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c, i) => (
                <tr key={i}>
                  {isProjectLevel && <td>{c.tower}</td>}
                  <td className="fw-semibold">{c.name}</td>
                  <td>{c.file}</td>
                  <td>{c.unit}</td>
                  <td>₹{c.loanAmount.toLocaleString("en-IN")}</td>
                  <td>₹{c.disbAmount.toLocaleString("en-IN")}</td>
                  <td>{c.disbAmount > 0 ? "NEFT" : "—"}</td>
                  <td>
                    <span className={"status-pill " + loanDisbStatusPill(c.status)}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-navy"
                      onClick={() => {
                        setActiveCustomer(c);
                        setScreen("disbursement");
                      }}
                    >
                      View disbursement
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={isProjectLevel ? 9 : 8} className="text-center text-secondary py-4">
                    No customer loans match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (screen === "disbursement" && activeCustomer) {
    const c = activeCustomer;
    return (
      <div>
        <button
          className="btn btn-outline-navy btn-sm mb-3"
          onClick={() => setScreen("customers")}
        >
          ← Back to {activeTower === ALL_TOWERS ? "all towers" : activeTower + " customers"}
        </button>
        <div className="kpi-card p-3 mb-3">
          <div className="fw-semibold">{c.name}</div>
          <div className="small text-secondary">
            File No {c.file} · Unit {c.unit}
          </div>
          <div className="row g-3 mt-1 small">
            <div className="col-6 col-md-3">
              <div className="text-secondary">Loan Amount</div>
              <div className="fw-semibold">₹{c.loanAmount.toLocaleString("en-IN")}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-secondary">Disbursed Amount</div>
              <div className="fw-semibold">₹{c.disbAmount.toLocaleString("en-IN")}</div>
            </div>
            <div className="col-6 col-md-3">
              <div className="text-secondary">Loan Status</div>
              <span className={"status-pill " + loanDisbStatusPill(c.status)}>
                {c.status}
              </span>
            </div>
          </div>
        </div>
        <div className="fw-semibold mb-2">Disbursement history</div>
        <div className="kpi-card p-0 table-responsive">
          <table className="table mb-0 align-middle">
            <thead>
              <tr className="text-secondary small">
                <th>Disbursement Date</th>
                <th>Amount Disbursed</th>
                <th>Fund Transferred Date</th>
                <th>UTR No.</th>
                <th>Payee Name</th>
                <th>Account No.</th>
                <th>Bank / IFSC</th>
                <th>Request Date</th>
              </tr>
            </thead>
            <tbody>
              {c.disb.map((d, i) => (
                <tr key={i}>
                  <td>{formatDDMMMYYYY(d.date)}</td>
                  <td>₹{d.amt.toLocaleString("en-IN")}</td>
                  <td>{formatDDMMMYYYY(d.fundDate)}</td>
                  <td>{d.utr}</td>
                  <td>{d.payee}</td>
                  <td>{maskAccountNo(d.acct)}</td>
                  <td>{d.bank} / {d.ifsc}</td>
                  <td>{formatDDMMMYYYY(d.reqDate)}</td>
                </tr>
              ))}
              {c.disb.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-secondary py-4">
                    No disbursements recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Total Loan Amount</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              ₹88 Cr
            </div>
            <div className="small text-secondary">119 loan accounts</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3 h-100">
            <div className="text-secondary small">Customer Leads</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              230
            </div>
            <div className="small text-secondary">38 converted</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3 h-100">
            <div className="text-secondary small">Customer Loan Sanctioned</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              ₹38 Cr
            </div>
            <div className="small text-secondary">230 approvals</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3 h-100">
            <div className="text-secondary small">Amount Disbursed</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              ₹60 Cr
            </div>
            <div className="small text-secondary">of ₹88 Cr · 68%</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3 h-100">
            <div className="text-secondary small">Work progress</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              38%
            </div>
            <div className="small text-secondary">Project level</div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
        <div className="small text-secondary">
          Click a tower to see customer-level loan details, or view disbursement
          across the whole project at once.
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-navy btn-sm"
            onClick={() => {
              setActiveTower(ALL_TOWERS);
              setScreen("customers");
            }}
          >
            🏢 View project-level disbursement
          </button>
          {onViewStatement && (
            <button
              type="button"
              className="btn btn-outline-navy btn-sm"
              onClick={() => onViewStatement(p && p.n)}
            >
              📊 Open Disbursement Statement report
            </button>
          )}
        </div>
      </div>
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <th>Tower</th>
              <th>Loans</th>
              <th>Loan status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                role="button"
                onClick={() => {
                  setActiveTower(r.t);
                  setScreen("customers");
                }}
              >
                <td className="fw-semibold" style={{ color: "var(--navy)" }}>
                  {r.t}
                </td>
                <td>{r.loans}</td>
                <td style={{ minWidth: 160 }}>
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="progress flex-grow-1"
                      style={{ height: 6 }}
                    >
                      <div
                        className="progress-bar bg-success"
                        style={{ width: r.pct + "%" }}
                      ></div>
                    </div>
                    <span className="small text-secondary text-nowrap">
                      {r.pct}/100Cr
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function ConstructionFinanceTab() {
  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Mortgaged with</div>
            <div className="fw-bold" style={{ color: "var(--navy)" }}>
              HDFC
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">NOC pending</div>
            <div className="fs-5 fw-bold text-danger">85</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">
              Construction finance
            </div>
            <div className="fw-bold" style={{ color: "var(--navy)" }}>
              Required
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end mb-2">
        <button className="btn btn-navy btn-sm">Request NOC</button>
      </div>
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <th>Tower</th>
              <th>HDFC LPS no.</th>
              <th>NOC status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-semibold">Tower A</td>
              <td>23132442322</td>
              <td>
                <span className="status-pill bg-warning-subtle text-warning">
                  Pending
                </span>
              </td>
            </tr>
            <tr>
              <td className="fw-semibold">Tower B</td>
              <td>23132442323</td>
              <td>
                <span className="status-pill bg-success-subtle text-success">
                  Issued
                </span>
              </td>
            </tr>
            <tr>
              <td className="fw-semibold">Tower C</td>
              <td>23132442324</td>
              <td>
                <span className="status-pill bg-warning-subtle text-warning">
                  Pending
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InventoryTab() {
  return (
    <div>
      <div className="row g-3 mb-3">
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Total units</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              1,000
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Sold</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              600
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Available</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              400
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="kpi-card p-3">
            <div className="text-secondary small">Avg. rate / sqft</div>
            <div className="fs-5 fw-bold" style={{ color: "var(--navy)" }}>
              ₹20,000
            </div>
          </div>
        </div>
      </div>
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <th>Category</th>
              <th>Total</th>
              <th>Sold</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-semibold">Residential</td>
              <td>800</td>
              <td>500</td>
              <td>300</td>
            </tr>
            <tr>
              <td className="fw-semibold">Commercial</td>
              <td>150</td>
              <td>80</td>
              <td>70</td>
            </tr>
            <tr>
              <td className="fw-semibold">Plots</td>
              <td>50</td>
              <td>20</td>
              <td>30</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-secondary small mt-2">
        Total value of unsold inventory: ₹20,00,000
      </div>
    </div>
  );
}

function CustomerManagementTab() {
  const rows = [
    {
      n: "Madhumita Francis",
      unit: "Tower A / 302",
      mobile: "+91 98xxxx xx01",
      status: "Confirmation pending",
    },
    {
      n: "Pradip Sangha",
      unit: "Tower B / 108",
      mobile: "+91 98xxxx xx02",
      status: "Sanctioned",
    },
    {
      n: "Jagriti Dixit",
      unit: "Tower C / 214",
      mobile: "+91 98xxxx xx03",
      status: "Disbursed",
    },
  ];
  function pill(s) {
    if (s === "Disbursed") return "bg-success-subtle text-success";
    if (s === "Sanctioned") return "bg-primary-subtle text-primary";
    return "bg-warning-subtle text-warning";
  }
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <input
          className="form-control form-control-sm"
          style={{ maxWidth: 220 }}
          placeholder="Search customer..."
        />
        <button className="btn btn-navy btn-sm">+ Add lead</button>
      </div>
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <th>Customer</th>
              <th>Unit</th>
              <th>Mobile</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td className="fw-semibold">{r.n}</td>
                <td>{r.unit}</td>
                <td>{r.mobile}</td>
                <td>
                  <span className={"status-pill " + pill(r.status)}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
