// src/data/leads.js
// Provides (global): leadStatusPill, leadFullName, LEAD_DATA_COLUMNS, downloadLeadTemplate
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 13. CUSTOMER LEADS: LISTING + ENTRY ================= */
function leadStatusPill(s) {
  if (s === "Converted") return "bg-success-subtle text-success";
  if (s === "In process") return "bg-primary-subtle text-primary";
  if (s === "Closed") return "bg-secondary-subtle text-secondary";
  return "bg-warning-subtle text-warning"; // Draft
}

function leadFullName(r) {
  return [r.firstName, r.middleName, r.surname].filter(Boolean).join(" ");
}

// Building + Unit/Flat Number added beyond the BRD's literal bulk
// column list — without a property identifier, a bulk-uploaded row
// can't be tied to a specific unit the way the single-entry form
// requires (which has both fields). Matches the single-entry form's
// own fields for parity.
const LEAD_DATA_COLUMNS = [
  "Building (optional)",
  "Unit / Flat Number",
  "Property Number",
  "Customer First Name",
  "Customer Middle Name",
  "Customer Surname",
  "Email",
  "Mobile number",
  "Employed / Self-employed",
  "BSA code",
];

function downloadLeadTemplate(projectName) {
  const sampleRow = [
    "",
    "A-101",
    "P51800012345-A-101",
    "Amit",
    "",
    "Sharma",
    "amit.sharma@example.com",
    "9876543210",
    "Employed",
    "",
  ];
  const rows = [LEAD_DATA_COLUMNS, sampleRow];
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    "Customer_Leads_Template_" +
    (projectName || "Project").replace(/[^a-z0-9]+/gi, "_") +
    ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
