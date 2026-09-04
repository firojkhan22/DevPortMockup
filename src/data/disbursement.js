// src/data/disbursement.js
// Provides (global): DISBURSEMENT_STATEMENT_ROWS, STATEMENT_QUICK_PERIODS, quickPeriodRange, buildDisbursementLoanSummaries, disbursementMode, downloadReportCsv, printReportPdf, DISBURSEMENT_REPORT_LABELS, CF_STATUS_BY_PROJECT
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// BRD "Report option" section: view/reconcile disbursement details
// by Customer / Building / Project / Builder(Company) / Builder
// Group for a date range, and export to Excel. Filed under the new
// MIS menu, separate from the transaction-level "Project
// Disbursement" screen under Tools & Support.
const DISBURSEMENT_STATEMENT_ROWS = [
  {
    customer: "Mr Dileep Kumar Medharametla",
    file: "2009234",
    unit: "Flat 1405, Floor 14",
    building: "Tower A",
    project: "Riverside Heights",
    company: "Safleworks",
    group: "Safleworks Group",
    date: "2025-11-22",
    amount: 3687657,
    utr: "632027",
    status: "Disbursed",
    loanAmount: 3687657,
    payee: "Mr Dileep Kumar Medharametla",
    acct: "50100234567890",
    bank: "HDFC Bank",
    ifsc: "HDFC0001234",
    reqDate: "2025-11-20",
  },
  {
    customer: "Capt Aravind V",
    file: "2009201",
    unit: "Flat 1603, Floor 16, Jasmine",
    building: "Tower B",
    project: "Riverside Heights",
    company: "Safleworks",
    group: "Safleworks Group",
    date: "2025-02-03",
    amount: 2000000,
    utr: "UTR2209871",
    status: "Disbursed",
    loanAmount: 3200000,
    payee: "Capt Aravind V",
    acct: "50100987654321",
    bank: "ICICI Bank",
    ifsc: "ICIC0001122",
    reqDate: "2025-02-01",
  },
  {
    customer: "Capt Aravind V",
    file: "2009201",
    unit: "Flat 1603, Floor 16, Jasmine",
    building: "Tower B",
    project: "Riverside Heights",
    company: "Safleworks",
    group: "Safleworks Group",
    date: "2025-03-18",
    amount: 1200000,
    utr: "UTR2209872",
    status: "Disbursed",
    loanAmount: 3200000,
    payee: "Capt Aravind V",
    acct: "50100987654321",
    bank: "ICICI Bank",
    ifsc: "ICIC0001122",
    reqDate: "2025-03-15",
  },
  {
    customer: "Ms Ananya Iyer",
    file: "2009288",
    unit: "Flat 902, Floor 9",
    building: "Tower C",
    project: "Riverside Heights",
    company: "Safleworks",
    group: "Safleworks Group",
    date: "2026-01-10",
    amount: 2850000,
    utr: "UTR2209880",
    status: "Disbursed",
    loanAmount: 2850000,
    payee: "Ms Ananya Iyer",
    acct: "50100556677889",
    bank: "Axis Bank",
    ifsc: "UTIB0001234",
    reqDate: "2026-01-08",
  },
  {
    customer: "Mr Sanjay Rathod",
    file: "2009301",
    unit: "Flat 2104, Floor 21",
    building: "Tower D",
    project: "Riverside Heights",
    company: "Safleworks",
    group: "Safleworks Group",
    date: "2026-03-05",
    amount: 1800000,
    utr: "UTR2209902",
    status: "Disbursed",
    loanAmount: 5500000,
    payee: "Mr Sanjay Rathod",
    acct: "50100223344556",
    bank: "State Bank of India",
    ifsc: "SBIN0001234",
    reqDate: "2026-03-01",
  },
  {
    customer: "Mrs Neha Kulkarni",
    file: "3011045",
    unit: "Unit 5, Wing 1",
    building: "Green Valley Wing 1",
    project: "Green Valley Phase 2",
    company: "Safleworks",
    group: "Safleworks Group",
    date: "2026-06-12",
    amount: 950000,
    utr: "UTR3311045",
    status: "Disbursed",
    loanAmount: 1500000,
    payee: "Mrs Neha Kulkarni",
    acct: "50100778899001",
    bank: "HDFC Bank",
    ifsc: "HDFC0002345",
    reqDate: "2026-06-08",
  },
  {
    customer: "Mr Farhan Shaikh",
    file: "9067731",
    unit: "Shop 4, Ground Floor",
    building: "ASP Tower",
    project: "ASP(906773)",
    company: "Shri Siddhivinayak Developers",
    group: "Shri Siddhivinayak Group",
    date: "2026-05-20",
    amount: 1250000,
    utr: "UTR9067731",
    status: "Disbursed",
    loanAmount: 1250000,
    payee: "Mr Farhan Shaikh",
    acct: "50100990011223",
    bank: "Bank of Baroda",
    ifsc: "BARB0RAIGAD",
    reqDate: "2026-05-16",
  },
  // Pending disbursement requests — included in the same schema
  // (with status: "Pending") so the report's Loan Status filter
  // can show Disbursed vs Pending side by side, per the business
  // ask. "amount" holds the outstanding/pending amount and "date"
  // the expected disbursement date for these rows.
  {
    customer: "Mr Immanuel Rajkumar",
    file: "2009260",
    unit: "Flat 1208, Floor 13",
    building: "Tower A",
    project: "Riverside Heights",
    company: "Safleworks",
    group: "Safleworks Group",
    date: "2025-12-05",
    amount: 1850000,
    utr: "—",
    status: "Pending",
    loanAmount: 1850000,
    payee: "Mr Immanuel Rajkumar",
    acct: "50100112200334",
    bank: "HDFC Bank",
    ifsc: "HDFC0001234",
    reqDate: "2025-11-28",
  },
  {
    customer: "Mr Mahender Pandarirao Chitoor",
    file: "2009261",
    unit: "Flat 107, Floor 1",
    building: "Tower A",
    project: "Riverside Heights",
    company: "Safleworks",
    group: "Safleworks Group",
    date: "2025-12-10",
    amount: 920000,
    utr: "—",
    status: "Pending",
    loanAmount: 920000,
    payee: "Mr Mahender Pandarirao Chitoor",
    acct: "50100445566778",
    bank: "HDFC Bank",
    ifsc: "HDFC0001234",
    reqDate: "2025-12-02",
  },
];

const STATEMENT_QUICK_PERIODS = [
  "This month",
  "Last month",
  "This quarter",
  "Last quarter",
  "This FY",
  "Custom",
];

function quickPeriodRange(period, today) {
  const y = today.getFullYear();
  const m = today.getMonth();
  function iso(d) {
    return d.toISOString().slice(0, 10);
  }
  if (period === "This month") {
    return [iso(new Date(y, m, 1)), iso(new Date(y, m + 1, 0))];
  }
  if (period === "Last month") {
    return [iso(new Date(y, m - 1, 1)), iso(new Date(y, m, 0))];
  }
  if (period === "This quarter") {
    const qStart = Math.floor(m / 3) * 3;
    return [iso(new Date(y, qStart, 1)), iso(new Date(y, qStart + 3, 0))];
  }
  if (period === "Last quarter") {
    const qStart = Math.floor(m / 3) * 3 - 3;
    return [iso(new Date(y, qStart, 1)), iso(new Date(y, qStart + 3, 0))];
  }
  if (period === "This FY") {
    // Indian FY: Apr–Mar
    const fyStartYear = m >= 3 ? y : y - 1;
    return [iso(new Date(fyStartYear, 3, 1)), iso(new Date(fyStartYear + 1, 2, 31))];
  }
  return [null, null];
}

// Groups the flat DISBURSEMENT_STATEMENT_ROWS transaction rows by
// loan (file no.) into one summary object per loan — the shared
// building block for every one of the A–E disbursement reports
// below, so a loan's sanctioned amount, running disbursed amount,
// status, and full transaction list are computed in one place.
function buildDisbursementLoanSummaries(rows) {
  const byFile = {};
  rows.forEach((r) => {
    if (!byFile[r.file]) {
      byFile[r.file] = {
        file: r.file,
        customer: r.customer,
        unit: r.unit,
        building: r.building,
        project: r.project,
        company: r.company,
        group: r.group,
        loanAmount: r.loanAmount,
        disbAmount: 0,
        lastDisbDate: null,
        status: "Pending",
        txns: [],
      };
    }
    const g = byFile[r.file];
    if (r.status === "Disbursed") {
      g.disbAmount += r.amount;
      g.status = "Disbursed";
      if (!g.lastDisbDate || r.date > g.lastDisbDate) g.lastDisbDate = r.date;
      g.txns.push(r);
    }
  });
  return Object.values(byFile);
}

// The mock transaction data doesn't carry an explicit "mode of
// disbursement" field, but its UTR/Cheque-no. values already follow
// a recognisable convention (a "UTR…" reference vs. a plain cheque
// number) — reused here instead of inventing a separate data set.
function disbursementMode(utr) {
  if (!utr || utr === "—") return "—";
  return /^UTR/i.test(utr) ? "NEFT" : "Cheque";
}

// Generic CSV export — used by every one of the disbursement
// reports (A–E), each of which supplies its own headers/rows for
// the report currently on screen.
function downloadReportCsv(filename, headers, rows) {
  const csv = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generic print-to-PDF export, mirroring downloadReportCsv.
function printReportPdf(title, headers, rows) {
  const rowsHtml = rows
    .map(
      (row) =>
        "<tr>" +
        row.map((v) => "<td>" + (v === null || v === undefined ? "" : v) + "</td>").join("") +
        "</tr>"
    )
    .join("");
  const html =
    "<html><head><title>" + title + "</title><style>" +
    "body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#1a1a1a}" +
    "h1{font-size:18px;margin-bottom:4px}" +
    "p{font-size:12px;color:#555;margin-top:0}" +
    "table{width:100%;border-collapse:collapse;font-size:10px;margin-top:16px}" +
    "th,td{border:1px solid #ccc;padding:5px 6px;text-align:left}" +
    "th{background:#f2f2f2}" +
    "</style></head><body>" +
    "<h1>" + title + "</h1>" +
    "<p>Generated on " + formatDDMMMYYYY(new Date().toISOString().slice(0, 10)) + " · " + rows.length + " record" + (rows.length === 1 ? "" : "s") + "</p>" +
    "<table><thead><tr>" +
    headers.map((h) => "<th>" + h + "</th>").join("") +
    "</tr></thead><tbody>" +
    rowsHtml +
    "</tbody></table>" +
    "</body></html>";
  const win = window.open("", "_blank");
  if (!win) return;
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 250);
}

const DISBURSEMENT_REPORT_LABELS = {
  A: "Project Disbursement Summary",
  B: "Building Level Disbursement Summary",
  C: "Customer Level Disbursement Summary",
  D: "Customer Level Disbursement Details",
  E: "All Customers / Detailed Report",
};

/* ================= 9.5 CONSTRUCTION FINANCE (new, standalone) =================
   Standalone version of the "Construction finance details" section that
   already lives inside the project entry wizard (see the "yes/no
   availed" branch a few thousand lines up, and the read-only
   Construction Finance tab on the project summary screen). Same
   BRD-driven fields, same project-wise pattern as RERAScreen/OCScreen
   above, so a developer can update CF details or raise a CF
   requirement after the project has already been created — without
   re-opening the whole project entry wizard. */
const CF_STATUS_BY_PROJECT = {
  "Riverside Heights": {
    availed: "yes",
    lender: "HDFC Bank",
    amount: "45",
    hdfcLoanAc: "CFHL0092431",
    supportDoc: "cf_sanction_letter.pdf",
    mortgagedWith: "HDFC",
  },
  "Green Valley Phase 2": {
    availed: "no",
    needsFinance: "yes",
    projectCost: "60",
    needAmount: "40",
    contactName: "Rohit Deshmukh",
    mobile: "+91 98xxx xx045",
    email: "rohit.deshmukh@safleworks.com",
    mortgagedWith: "—",
  },
};
