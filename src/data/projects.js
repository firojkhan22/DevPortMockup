// src/data/projects.js
// Provides (global): PROJECT_STATUSES, projectStatusLabel, projectStatusPill, BUILDER_PROJECT_DETAILS, BUILDER_PROJECT_NAMES, projectNumberFor, cityFor, BUILDER_BSA_CODES, PROJECT_BUILDINGS, buildingsForProject, projSummaryPill, loanDisbStatusPill, QUERY_DOCUMENT_OPTIONS
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.

// Single source of truth for the builder's project/lead list — every
// "Select project" field across the app (RERA/OC/Bank/Inventory/
// Work Progress/Unit Data updates, All Projects, etc.) reads from
// this instead of each screen hardcoding its own options, so they
// can never drift out of sync with each other.
//
// A project/lead's status is always exactly one of these four —
// nothing else is a valid value anywhere in the app:
//   Draft | Pending (In-Progress) | Approved | Query Raised
// ("Query Raised" == "Document Query Raised" — used interchangeably
// in labels, but the stored value is always "Query Raised").
// Mockup-stage status list per business feedback (6 Aug 2026):
// Draft, Pending, WIP (Work In Progress), Approved, Query Raised.
// No formal triggers/validation messages defined yet — business
// confirmed this is just the label set for now, not a rules engine.
const PROJECT_STATUSES = [
  "Draft",
  "Pending",
  "WIP",
  "Approved",
  "Query Raised",
];
function projectStatusLabel(s) {
  if (s === "Pending") return "Pending (In-Progress)";
  if (s === "WIP") return "WIP (Work In Progress)";
  if (s === "Query Raised") return "Query Raised / Document Query Raised";
  return s;
}
function projectStatusPill(s) {
  if (s === "Approved") return "bg-success-subtle text-success";
  if (s === "Draft") return "bg-secondary-subtle text-secondary";
  if (s === "WIP") return "bg-primary-subtle text-primary";
  if (s === "Query Raised") return "bg-danger-subtle text-danger";
  return "bg-warning-subtle text-warning"; // Pending
}
const BUILDER_PROJECT_DETAILS = [
  {
    n: "Riverside Heights",
    projNo: "54217",
    loc: "Mumbai",
    firm: "Safleworks",
    status: "Approved",
    doc: "12/12",
    q: 0,
    // Whoever created a project keeps access to it regardless of
    // their assigned role/access-scope, until an admin explicitly
    // removes that mapping — see Sneha Patil in BUILDER_USERS_INITIAL
    // for the corresponding user-side demonstration.
    createdBy: "Sneha Patil",
    // BRD: map-pin details — total units, total loans, and total
    // business (loan + disbursed) with HDFC. lat/lng are real
    // coordinates (approximate, city-level) used to plot this
    // project on the live OpenStreetMap view in the Map tab.
    units: 240,
    totalLoans: 86,
    loanAmount: "₹42.5 Cr",
    disbAmount: "₹28.1 Cr",
    approvalCount: "8/10",
    mapPos: { x: 22, y: 62 },
    lat: 19.0596,
    lng: 72.8656,
  },
  {
    n: "Green Valley Phase 2",
    projNo: "54233",
    loc: "Pune",
    firm: "Safleworks",
    status: "Draft",
    doc: "4 pending",
    q: 2,
    units: 180,
    totalLoans: 34,
    loanAmount: "₹18.2 Cr",
    disbAmount: "₹6.4 Cr",
    approvalCount: "5/9",
    mapPos: { x: 58, y: 70 },
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    n: "ASP(906773)",
    projNo: "906773",
    loc: "Bhandup",
    firm: "Shri Siddhivinayak Developers",
    status: "Query Raised",
    doc: "Doc. pending",
    q: 1,
    units: 96,
    totalLoans: 21,
    loanAmount: "₹9.8 Cr",
    disbAmount: "₹3.2 Cr",
    approvalCount: "3/6",
    mapPos: { x: 30, y: 48 },
    lat: 19.1436,
    lng: 72.9345,
  },
  {
    n: "Emerald Enclave",
    projNo: "54260",
    loc: "Thane",
    firm: "Safleworks",
    status: "Pending",
    doc: "8 pending",
    q: 0,
    units: 120,
    totalLoans: 12,
    loanAmount: "₹5.5 Cr",
    disbAmount: "₹0 Cr",
    approvalCount: "0/4",
    mapPos: { x: 40, y: 36 },
    lat: 19.2183,
    lng: 72.9781,
  },
];
const BUILDER_PROJECT_NAMES = BUILDER_PROJECT_DETAILS.map((p) => p.n);

/* ---------------------------------------------------------------
   Customer Leads — supporting lookups per the BRD:
   - BSA codes are the "fetch builder-BSA mapping in ILPS/FYNDNA"
     bit — a static prototype can't call those systems, so this
     stands in for what that lookup would return: only the BSA
     codes actually linked to this builder/builder group.
   - Property Number and Builder Number are not collected on this
     form at all, per the latest requirement — this differs from
     the BRD's original "system to derive" wording for both.
   --------------------------------------------------------------- */
function projectNumberFor(projectName) {
  const p = BUILDER_PROJECT_DETAILS.find((x) => x.n === projectName);
  return (p && p.projNo) || "—";
}
function cityFor(projectName) {
  const p = BUILDER_PROJECT_DETAILS.find((x) => x.n === projectName);
  return (p && p.loc) || "—";
}
const BUILDER_BSA_CODES = [
  {
    code: "BSA1024",
    label: "BSA1024 — Rajesh Kumar (Individual)",
  },
  {
    code: "BSA1025",
    label: "BSA1025 — Metro Realty Associates (Entity)",
  },
  {
    code: "BSA1041",
    label: "BSA1041 — Safleworks Constructions (Mapped builder company)",
  },
];

/* ================= 12. UNIT DATA UPLOAD (new) ================= */
// BRD: buildings available per project, for the building-wise
// upload scope. Falls back to a generic pair of building names for
// any project not explicitly listed here.
const PROJECT_BUILDINGS = {
  "Alliance Orchid Springs (54217)": [
    "Orchid Springs Pearl",
    "Orchid Springs Hibiscus",
  ],
  "Riverside Heights": ["Riverside Heights Tower A", "Riverside Heights Tower B"],
  "Green Valley Phase 2": ["Green Valley Wing 1", "Green Valley Wing 2"],
};
function buildingsForProject(projectName) {
  return PROJECT_BUILDINGS[projectName] || ["Tower A", "Tower B"];
}

// ============= PROJECT SUMMARY (new — inspired by client BRD mockup) =============
// A single project-centric hub: click a project in "All Projects" to land
// here instead of hopping between separate global screens. Reuses our
// existing kpi-card / status-pill / section-tab / table components so it
// matches the rest of the app, while covering the tab set the client's
// AI-generated mockup showed (Summary, Progress, Loan Details,
// Construction Finance, Inventory, Customer Management).
const projSummaryPill = projectStatusPill;

// Status-pill colour mapping shared by every disbursement grid
// (Loan Details tab, Project Disbursement, Disbursement Statement)
// so "Pending" vs "Partially disbursed" vs "Fully disbursed" always
// reads the same way regardless of which screen it's shown on.
function loanDisbStatusPill(status) {
  if (status === "Fully disbursed") return "bg-success-subtle text-success";
  if (status === "Partially disbursed") return "bg-primary-subtle text-primary";
  return "bg-warning-subtle text-warning"; // Pending
}

// New (not yet in BRD, confirm with BD/manager before final sign-off):
// developer-initiated queries — separate from "respond to queries"
// above, where PAC raises something FOR the developer. Here the
// developer raises something TO the bank team. Category drives which
// fields are shown: General has no project/document context; Project
// related asks which project (same searchable grid used on Bank
// Accounts); Document related narrows further to a specific
// document against that project. "Assign to" lets the developer
// route it themselves, or leave it unassigned if they're not sure
// which team owns it.
//
// This is its own full-page screen (TopBar + FormCard), not a modal
// popup — same pattern as Raise Issue — reached from "+ Raise a
// query" on Queries I Raised, and returns there on submit/cancel.
const QUERY_DOCUMENT_OPTIONS = [
  "RERA certificate",
  "Occupation certificate",
  "Approved building plan",
  "Title deed",
  "NOC",
  "Sale / construction agreement",
  "Other",
];
