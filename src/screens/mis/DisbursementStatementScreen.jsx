// src/screens/mis/DisbursementStatementScreen.jsx
// Provides (global): DisbursementStatementScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function DisbursementStatementScreen({ onMenuClick, initialProject }) {
  // Arriving from another screen's "Open Disbursement Statement
  // report" button pre-fills the project and jumps straight to the
  // customer-level summary (report C) for it; otherwise the screen
  // opens on the project-level summary (report A) with nothing
  // searched yet.
  const [reportType, setReportType] = useState(initialProject ? "C" : "A");
  const [project, setProject] = useState(initialProject || "");
  const [building, setBuilding] = useState("");
  const [company, setCompany] = useState("");
  const [group, setGroup] = useState("");
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("");
  // Selected loan (file no.) — used only by report D, to identify
  // exactly which customer's disbursement history to show.
  const [selectedFile, setSelectedFile] = useState("");
  // Grid stays empty until Search is pressed — any filter change
  // afterwards clears the result set again so what's on screen
  // always matches a filter combination the user explicitly asked
  // for, never a half-edited one.
  const [hasSearched, setHasSearched] = useState(!!initialProject);

  function withFilterReset(setter) {
    return (value) => {
      setter(value);
      setHasSearched(false);
    };
  }
  const updateProject = withFilterReset(setProject);
  const updateBuilding = withFilterReset(setBuilding);
  const updateCompany = withFilterReset(setCompany);
  const updateGroup = withFilterReset(setGroup);
  const updateCustomer = withFilterReset(setCustomer);
  const updateStatus = withFilterReset(setStatus);
  const updateSelectedFile = withFilterReset(setSelectedFile);

  // Switching the report resets the fields below it, since each
  // report has its own relevant set of search fields (per the
  // BRD screenshots) and a leftover value from a different report
  // could otherwise silently narrow the next search.
  function updateReportType(value) {
    setReportType(value);
    setProject("");
    setBuilding("");
    setCompany("");
    setGroup("");
    setCustomer("");
    setStatus("");
    setSelectedFile("");
    setHasSearched(false);
  }

  // Drill-down navigation from a "View Details" link in one report
  // straight into the next (A → B → C → D), carrying the row's
  // project/building/file forward and running the search
  // immediately, so the "View Details" buttons in the results
  // tables actually work rather than just being decorative.
  function drillTo(type, overrides) {
    setReportType(type);
    setProject(overrides.project !== undefined ? overrides.project : project);
    setBuilding(overrides.building !== undefined ? overrides.building : "");
    setSelectedFile(overrides.selectedFile !== undefined ? overrides.selectedFile : "");
    setCustomer("");
    setStatus("");
    setHasSearched(true);
  }

  function resetFilters() {
    setProject("");
    setBuilding("");
    setCompany("");
    setGroup("");
    setCustomer("");
    setStatus("");
    setSelectedFile("");
    setHasSearched(false);
  }

  const projectOptions = [...new Set(DISBURSEMENT_STATEMENT_ROWS.map((r) => r.project))];
  const companyOptions = [...new Set(DISBURSEMENT_STATEMENT_ROWS.map((r) => r.company))];
  const groupOptions = [...new Set(DISBURSEMENT_STATEMENT_ROWS.map((r) => r.group))];
  const buildingOptions = [...new Set(
    DISBURSEMENT_STATEMENT_ROWS.filter((r) => !project || r.project === project).map((r) => r.building)
  )];

  // One row per loan (file no.), with its running disbursed total
  // and full transaction list — the shared base every report below
  // filters/aggregates from.
  const loanSummaries = buildDisbursementLoanSummaries(DISBURSEMENT_STATEMENT_ROWS);

  // Loan options for report D's customer/file picker, narrowed by
  // whatever project/building is currently selected.
  const fileOptions = loanSummaries.filter(
    (l) => (!project || l.project === project) && (!building || l.building === building)
  );

  function loanAggregate(loans) {
    const approvedAmount = loans.reduce((s, l) => s + l.loanAmount, 0);
    const disbursedAmount = loans.reduce((s, l) => s + l.disbAmount, 0);
    return {
      underprocessLoans: 0,
      approvedLoans: loans.length,
      approvedAmount,
      disbursedLoansCount: loans.filter((l) => l.disbAmount > 0).length,
      disbursedAmount,
      pctDisbursed: approvedAmount ? (disbursedAmount / approvedAmount) * 100 : 0,
    };
  }

  // ---- Report A: Project Disbursement Summary ----
  // One row per project (or just the selected one), rolling up
  // every loan under it.
  const projectsForA = project ? [project] : projectOptions;
  const rowsA = projectsForA.map((p) => {
    const loans = loanSummaries.filter(
      (l) => l.project === p && (!company || l.company === company) && (!group || l.group === group)
    );
    return { project: p, ...loanAggregate(loans) };
  });

  // ---- Report B: Building Level Disbursement Summary ----
  // One row per building within the selected project (or across
  // all projects if none is selected).
  const buildingsForB = [...new Set(
    loanSummaries.filter((l) => !project || l.project === project).map((l) => l.building)
  )];
  const rowsB = buildingsForB.map((b) => {
    const loans = loanSummaries.filter(
      (l) =>
        l.building === b &&
        (!project || l.project === project) &&
        (!company || l.company === company) &&
        (!group || l.group === group)
    );
    return {
      building: b,
      project: (loans[0] && loans[0].project) || project || "",
      ...loanAggregate(loans),
    };
  });

  // ---- Report C: Customer Level Disbursement Summary ----
  // One row per loan/customer matching the selected project,
  // building, customer-name search, and loan status.
  const rowsC = loanSummaries.filter(
    (l) =>
      (!project || l.project === project) &&
      (!building || l.building === building) &&
      (!customer || l.customer.toLowerCase().includes(customer.toLowerCase())) &&
      (!status || l.status === status)
  );

  // ---- Report D: Customer Level Disbursement Details ----
  // A single loan's header info plus its full transaction history.
  const loanD = selectedFile ? loanSummaries.find((l) => l.file === selectedFile) : null;
  const txnsD = loanD
    ? loanD.txns.slice().sort((a, b) => (a.date < b.date ? -1 : 1))
    : [];

  // ---- Report E: All Customers / Detailed Report ----
  // Every loan, joined out to one row per disbursement transaction
  // (loans with no transaction yet still get a single blank row).
  const loansE = loanSummaries.filter(
    (l) =>
      (!project || l.project === project) &&
      (!building || l.building === building) &&
      (!status || l.status === status)
  );
  const rowsE = [];
  loansE.forEach((l) => {
    if (l.txns.length === 0) {
      rowsE.push({ loan: l, txn: null });
      return;
    }
    l.txns.forEach((t) => {
      rowsE.push({ loan: l, txn: t });
    });
  });

  const hasResults =
    (reportType === "A" && rowsA.length > 0) ||
    (reportType === "B" && rowsB.length > 0) ||
    (reportType === "C" && rowsC.length > 0) ||
    (reportType === "D" && !!loanD) ||
    (reportType === "E" && rowsE.length > 0);

  function pctStr(disb, approved) {
    return (approved ? ((disb / approved) * 100).toFixed(2) : "0.00") + "%";
  }

  // Builds the {filename, title, headers, rows} for whichever
  // report is currently selected — feeding both Export CSV and
  // Export PDF, so an export always contains exactly the columns
  // and data of the report on screen, never anything else.
  function getExport() {
    if (reportType === "A") {
      return {
        filename: "Project_Disbursement_Summary",
        title: "Project Disbursement Summary",
        headers: [
          "Project Name", "Underprocess Loans (Nos.)", "Approved Loans (Nos.)",
          "Approved Loan Amount", "Disbursed Loans (Nos.)", "Disbursed Loan Amount",
          "% Amount Disbursed",
        ],
        rows: rowsA.map((r) => [
          r.project, r.underprocessLoans, r.approvedLoans, r.approvedAmount,
          r.disbursedLoansCount, r.disbursedAmount, pctStr(r.disbursedAmount, r.approvedAmount),
        ]),
      };
    }
    if (reportType === "B") {
      return {
        filename: "Building_Level_Disbursement_Summary",
        title: "Building Level Disbursement Summary",
        headers: [
          "Project Name", "Building Name", "Underprocess Loans (Nos.)", "Approved Loans (Nos.)",
          "Approved Loan Amount", "Disbursed Loans", "Disbursed Loan Amount", "% Amount Disbursed",
        ],
        rows: rowsB.map((r) => [
          r.project, r.building, r.underprocessLoans, r.approvedLoans, r.approvedAmount,
          r.disbursedLoansCount, r.disbursedAmount, pctStr(r.disbursedAmount, r.approvedAmount),
        ]),
      };
    }
    if (reportType === "C") {
      return {
        filename: "Customer_Level_Disbursement_Summary",
        title: "Customer Level Disbursement Summary",
        headers: [
          "Customer Name", "Unit Number", "File Number", "Loan Status",
          "Loan Amount", "Disbursed Amount", "% Amount Disbursed", "Last Disbursement Date",
        ],
        rows: rowsC.map((l) => [
          l.customer, l.unit, l.file, l.status, l.loanAmount, l.disbAmount,
          pctStr(l.disbAmount, l.loanAmount), l.lastDisbDate ? formatDDMMMYYYY(l.lastDisbDate) : "—",
        ]),
      };
    }
    if (reportType === "D") {
      const headers = [
        "Project Name", "Building Name", "Customer Name", "Unit Number", "File Number",
        "Loan Status", "Total Loan Amount", "Disb Amount", "% Amount Disbursed", "Last Disb Date",
        "Sr No", "Disb Date", "Disb Amount", "Mode of Disbursement",
        "Transaction Reference Number (UTR No/Chq No)", "Fund Transfer Date",
        "Payee Name", "Bank Name", "Account Number (Partially Masked)",
      ];
      if (!loanD) return { filename: "Customer_Level_Disbursement_Details", title: "Customer Level Disbursement Details", headers, rows: [] };
      const head = [
        loanD.project, loanD.building, loanD.customer, loanD.unit, loanD.file, loanD.status,
        loanD.loanAmount, loanD.disbAmount, pctStr(loanD.disbAmount, loanD.loanAmount),
        loanD.lastDisbDate ? formatDDMMMYYYY(loanD.lastDisbDate) : "—",
      ];
      const rows = txnsD.length
        ? txnsD.map((t, i) => [
            ...head, i + 1, formatDDMMMYYYY(t.date), t.amount, disbursementMode(t.utr),
            t.utr, formatDDMMMYYYY(t.date), t.payee, t.bank, maskAccountNo(t.acct),
          ])
        : [[...head, "", "", "", "", "", "", "", "", ""]];
      return { filename: "Customer_Level_Disbursement_Details", title: "Customer Level Disbursement Details", headers, rows };
    }
    // Report E
    const headers = [
      "Sr No", "Building Name", "Customer Name", "Unit Number", "File Number", "Loan Status",
      "Loan Amount", "Total Disb Amount", "Disb Date", "Disb Amount", "Mode of Disbursement",
      "Transaction Reference Number", "Fund Transfer Date", "Payee Name", "Bank Name",
      "Account Number (Partially Masked)",
    ];
    const rows = rowsE.map((row, i) => {
      const l = row.loan, t = row.txn;
      return [
        i + 1, l.building, l.customer, l.unit, l.file, l.status, l.loanAmount, l.disbAmount,
        t ? formatDDMMMYYYY(t.date) : "—", t ? t.amount : "", t ? disbursementMode(t.utr) : "—",
        t ? t.utr : "—", t ? formatDDMMMYYYY(t.date) : "—", t ? t.payee : "—", t ? t.bank : "—",
        t ? maskAccountNo(t.acct) : "—",
      ];
    });
    return { filename: "All_Customers_Detailed_Report", title: "All Customers - Detailed Report", headers, rows };
  }

  const exportData = getExport();

  return (
    <div>
      <TopBar
        title="Disbursement Statement"
        sub="Project, building, and customer-level disbursement reports for a project, building, or group"
        onMenuClick={onMenuClick}
      />

      {/* ===== Search filters — a clearly separate card from the
          results below, so it reads as "the query" rather than
          blending into the grid. The fields shown here change
          depending on the report selected. ===== */}
      <FormCard>
        <div className="fw-semibold mb-3 d-flex align-items-center gap-2">
          <span>🔍</span> Search filters
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">Select Report</label>
            <select
              className="form-select"
              value={reportType}
              onChange={(e) => updateReportType(e.target.value)}
            >
              <option value="A">A - Project Disbursement Summary</option>
              <option value="B">B - Building Level Disbursement Summary</option>
              <option value="C">C - Customer Level Disbursement Summary</option>
              <option value="D">D - Customer Level Disbursement Details</option>
              <option value="E">E - All Customers / Detailed Report</option>
            </select>
          </div>
        </div>

        <div className="row g-3 mb-3">
          {(reportType === "A" || reportType === "B") && (
            <>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">Project</label>
                <select className="form-select" value={project} onChange={(e) => updateProject(e.target.value)}>
                  <option value="">All Projects</option>
                  {projectOptions.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label small fw-semibold">Company</label>
                <select className="form-select" value={company} onChange={(e) => updateCompany(e.target.value)}>
                  <option value="">All</option>
                  {companyOptions.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label small fw-semibold">Group</label>
                <select className="form-select" value={group} onChange={(e) => updateGroup(e.target.value)}>
                  <option value="">All</option>
                  {groupOptions.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
            </>
          )}

          {reportType === "C" && (
            <>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Project</label>
                <select className="form-select" value={project} onChange={(e) => updateProject(e.target.value)}>
                  <option value="">All Projects</option>
                  {projectOptions.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Building</label>
                <select className="form-select" value={building} onChange={(e) => updateBuilding(e.target.value)}>
                  <option value="">All Buildings</option>
                  {buildingOptions.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small fw-semibold">Customer</label>
                <input
                  className="form-control"
                  placeholder="Search by customer name…"
                  value={customer}
                  onChange={(e) => updateCustomer(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-3">
                <label className="form-label small fw-semibold">Loan Status</label>
                <select className="form-select" value={status} onChange={(e) => updateStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </>
          )}

          {reportType === "D" && (
            <>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Project</label>
                <select
                  className="form-select"
                  value={project}
                  onChange={(e) => { updateProject(e.target.value); updateSelectedFile(""); }}
                >
                  <option value="">All Projects</option>
                  {projectOptions.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small fw-semibold">Building</label>
                <select
                  className="form-select"
                  value={building}
                  onChange={(e) => { updateBuilding(e.target.value); updateSelectedFile(""); }}
                >
                  <option value="">All Buildings</option>
                  {buildingOptions.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label small fw-semibold">Customer / File No.</label>
                <select
                  className="form-select"
                  value={selectedFile}
                  onChange={(e) => updateSelectedFile(e.target.value)}
                >
                  <option value="">Select a customer…</option>
                  {fileOptions.map((l) => (
                    <option key={l.file} value={l.file}>
                      {l.customer} — {l.unit} (File {l.file})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {reportType === "E" && (
            <>
              <div className="col-6 col-md-4">
                <label className="form-label small fw-semibold">Project</label>
                <select
                  className="form-select"
                  value={project}
                  onChange={(e) => updateProject(e.target.value)}
                >
                  <option value="">All Projects</option>
                  {projectOptions.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label small fw-semibold">Building</label>
                <select className="form-select" value={building} onChange={(e) => updateBuilding(e.target.value)}>
                  <option value="">All Buildings</option>
                  {buildingOptions.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label small fw-semibold">Loan Status</label>
                <select className="form-select" value={status} onChange={(e) => updateStatus(e.target.value)}>
                  <option value="">All</option>
                  <option value="Disbursed">Disbursed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="d-flex justify-content-end gap-2 pt-2 border-top">
          <button
            type="button"
            className="btn btn-outline-navy"
            onClick={resetFilters}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn btn-navy px-4"
            onClick={() => setHasSearched(true)}
            disabled={reportType === "D" && !selectedFile}
          >
            🔍 Search
          </button>
        </div>
      </FormCard>

      {/* ===== Results — separate card, only populated after
          Search is pressed. Layout and columns follow exactly the
          report format currently selected above. ===== */}
      <FormCard>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div className="fw-semibold d-flex align-items-center gap-2">
            <span>📋</span> Results — {DISBURSEMENT_REPORT_LABELS[reportType]}
          </div>
          {hasSearched && hasResults && (
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-navy btn-sm d-flex align-items-center justify-content-center"
                onClick={() => downloadReportCsv(exportData.filename, exportData.headers, exportData.rows)}
              >
                <ExcelIcon /> Export CSV
              </button>
              <button
                type="button"
                className="btn btn-outline-navy btn-sm d-flex align-items-center justify-content-center"
                onClick={() => printReportPdf(exportData.title, exportData.headers, exportData.rows)}
              >
                <PdfIcon /> Export PDF
              </button>
            </div>
          )}
        </div>

        {!hasSearched ? (
          <div className="repeat-row p-5 text-center text-secondary">
            <div style={{ fontSize: 28 }} className="mb-2">🔍</div>
            {reportType === "D"
              ? <>Select a customer above and click <span className="fw-semibold">Search</span> to view their disbursement details.</>
              : <>Set the filters above and click <span className="fw-semibold">Search</span> to view the report.</>}
          </div>
        ) : !hasResults ? (
          <div className="repeat-row p-5 text-center text-secondary">
            No records match these filters.
          </div>
        ) : reportType === "A" ? (
          <div className="kpi-card p-0 table-responsive">
            <table className="table table-sm mb-0 align-middle">
              <thead>
                <tr className="text-secondary small">
                  <th>Project Name</th>
                  <th>Underprocess Loans (Nos.)</th>
                  <th>Approved Loans (Nos.)</th>
                  <th>Approved Loan Amount</th>
                  <th>Disbursed Loans (Nos.)</th>
                  <th>Disbursed Loan Amount</th>
                  <th>% Amount Disbursed</th>
                  <th>View Details (B)</th>
                </tr>
              </thead>
              <tbody>
                {rowsA.map((r) => (
                  <tr key={r.project} className="small">
                    <td className="fw-semibold">{r.project}</td>
                    <td>{r.underprocessLoans}</td>
                    <td>{r.approvedLoans}</td>
                    <td>₹{r.approvedAmount.toLocaleString("en-IN")}</td>
                    <td>{r.disbursedLoansCount}</td>
                    <td>₹{r.disbursedAmount.toLocaleString("en-IN")}</td>
                    <td>{pctStr(r.disbursedAmount, r.approvedAmount)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-navy btn-sm"
                        onClick={() => drillTo("B", { project: r.project })}
                      >
                        Click to view Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : reportType === "B" ? (
          <div className="kpi-card p-0 table-responsive">
            <table className="table table-sm mb-0 align-middle">
              <thead>
                <tr className="text-secondary small">
                  <th>Project Name</th>
                  <th>Building Name</th>
                  <th>Underprocess Loans (Nos.)</th>
                  <th>Approved Loans (Nos.)</th>
                  <th>Approved Loan Amount</th>
                  <th>Disbursed Loans</th>
                  <th>Disbursed Loan Amount</th>
                  <th>% Amount Disbursed</th>
                  <th>View Details (C)</th>
                </tr>
              </thead>
              <tbody>
                {rowsB.map((r) => (
                  <tr key={r.building} className="small">
                    <td>{r.project}</td>
                    <td className="fw-semibold">{r.building}</td>
                    <td>{r.underprocessLoans}</td>
                    <td>{r.approvedLoans}</td>
                    <td>₹{r.approvedAmount.toLocaleString("en-IN")}</td>
                    <td>{r.disbursedLoansCount}</td>
                    <td>₹{r.disbursedAmount.toLocaleString("en-IN")}</td>
                    <td>{pctStr(r.disbursedAmount, r.approvedAmount)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-navy btn-sm"
                        onClick={() => drillTo("C", { project: r.project, building: r.building })}
                      >
                        Click to view Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : reportType === "C" ? (
          <div className="kpi-card p-0 table-responsive">
            <table className="table table-sm mb-0 align-middle">
              <thead>
                <tr className="text-secondary small">
                  <th>Customer Name</th>
                  <th>Unit Number</th>
                  <th>File Number</th>
                  <th>Loan Status</th>
                  <th>Loan Amount</th>
                  <th>Disbursed Amount</th>
                  <th>% Amount Disbursed</th>
                  <th>Last Disbursement Date</th>
                  <th>View Details (D)</th>
                </tr>
              </thead>
              <tbody>
                {rowsC.map((l) => (
                  <tr key={l.file} className="small">
                    <td className="fw-semibold">{l.customer}</td>
                    <td>{l.unit}</td>
                    <td>{l.file}</td>
                    <td>
                      <span className={"status-pill " + loanDisbStatusPill(l.status === "Disbursed" ? "Fully disbursed" : "Pending")}>
                        {l.status}
                      </span>
                    </td>
                    <td>₹{l.loanAmount.toLocaleString("en-IN")}</td>
                    <td>₹{l.disbAmount.toLocaleString("en-IN")}</td>
                    <td>{pctStr(l.disbAmount, l.loanAmount)}</td>
                    <td>{l.lastDisbDate ? formatDDMMMYYYY(l.lastDisbDate) : "—"}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-navy btn-sm"
                        onClick={() => drillTo("D", { project: l.project, building: l.building, selectedFile: l.file })}
                      >
                        Click to view Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : reportType === "D" ? (
          <div>
            <div className="repeat-row p-3 mb-3">
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">Project Name</div>
                  <div className="fw-semibold">{loanD.project}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">Building Name</div>
                  <div className="fw-semibold">{loanD.building}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">Customer Name</div>
                  <div className="fw-semibold">{loanD.customer}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">Unit Number</div>
                  <div className="fw-semibold">{loanD.unit}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">File Number</div>
                  <div className="fw-semibold">{loanD.file}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">Loan Status</div>
                  <span className={"status-pill " + loanDisbStatusPill(loanD.status === "Disbursed" ? "Fully disbursed" : "Pending")}>
                    {loanD.status}
                  </span>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">Total Loan Amt</div>
                  <div className="fw-semibold">₹{loanD.loanAmount.toLocaleString("en-IN")}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">Disb Amount</div>
                  <div className="fw-semibold">₹{loanD.disbAmount.toLocaleString("en-IN")}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">% Amount Disbursed</div>
                  <div className="fw-semibold">{pctStr(loanD.disbAmount, loanD.loanAmount)}</div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="small text-secondary">Last Disb Date</div>
                  <div className="fw-semibold">{loanD.lastDisbDate ? formatDDMMMYYYY(loanD.lastDisbDate) : "—"}</div>
                </div>
              </div>
            </div>

            <div className="kpi-card p-0 table-responsive">
              <table className="table table-sm mb-0 align-middle">
                <thead>
                  <tr className="text-secondary small">
                    <th>Sr. No.</th>
                    <th>Disb Date</th>
                    <th>Disb Amount</th>
                    <th>Mode of Disbursement</th>
                    <th>Transaction Reference Number (UTR No/Chq No)</th>
                    <th>Fund Transfer Date</th>
                    <th>Payee Name</th>
                    <th>Bank Name</th>
                    <th>Account Number (Partially Masked)</th>
                  </tr>
                </thead>
                <tbody>
                  {txnsD.map((t, i) => (
                    <tr key={i} className="small">
                      <td>{i + 1}</td>
                      <td>{formatDDMMMYYYY(t.date)}</td>
                      <td>₹{t.amount.toLocaleString("en-IN")}</td>
                      <td>{disbursementMode(t.utr)}</td>
                      <td>{t.utr}</td>
                      <td>{formatDDMMMYYYY(t.date)}</td>
                      <td>{t.payee}</td>
                      <td>{t.bank}</td>
                      <td>{maskAccountNo(t.acct)}</td>
                    </tr>
                  ))}
                  {txnsD.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center text-secondary py-4">
                        No disbursement transactions yet for this loan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="kpi-card p-0 table-responsive">
            <table className="table table-sm mb-0 align-middle">
              <thead>
                <tr className="text-secondary small">
                  <th>Sr. No.</th>
                  <th>Building Name</th>
                  <th>Customer Name</th>
                  <th>Unit Number</th>
                  <th>File Number</th>
                  <th>Loan Status</th>
                  <th>Loan Amount</th>
                  <th>Total Disb Amount</th>
                  <th>Disb Date</th>
                  <th>Disb Amount</th>
                  <th>Mode of Disbursement</th>
                  <th>Transaction Reference Number</th>
                  <th>Fund Transfer Date</th>
                  <th>Payee Name</th>
                  <th>Bank Name</th>
                  <th>Account Number (Partially Masked)</th>
                </tr>
              </thead>
              <tbody>
                {rowsE.map((row, i) => {
                  const l = row.loan, t = row.txn;
                  return (
                    <tr key={l.file + "-" + i} className="small">
                      <td>{i + 1}</td>
                      <td>{l.building}</td>
                      <td className="fw-semibold">{l.customer}</td>
                      <td>{l.unit}</td>
                      <td>{l.file}</td>
                      <td>
                        <span className={"status-pill " + loanDisbStatusPill(l.status === "Disbursed" ? "Fully disbursed" : "Pending")}>
                          {l.status}
                        </span>
                      </td>
                      <td>₹{l.loanAmount.toLocaleString("en-IN")}</td>
                      <td>₹{l.disbAmount.toLocaleString("en-IN")}</td>
                      <td>{t ? formatDDMMMYYYY(t.date) : "—"}</td>
                      <td>{t ? "₹" + t.amount.toLocaleString("en-IN") : "—"}</td>
                      <td>{t ? disbursementMode(t.utr) : "—"}</td>
                      <td>{t ? t.utr : "—"}</td>
                      <td>{t ? formatDDMMMYYYY(t.date) : "—"}</td>
                      <td>{t ? t.payee : "—"}</td>
                      <td>{t ? t.bank : "—"}</td>
                      <td>{t ? maskAccountNo(t.acct) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </FormCard>
    </div>
  );
}
