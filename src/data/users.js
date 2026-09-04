// src/data/users.js
// Provides (global): REVIEW_DEMO_TODAY, parseReviewDate, daysUntilReview, REVIEW_POLICY_DAYS, formatReviewDate, computeNextReviewDate, userReviewState, BUILDER_USERS_INITIAL, ALL_PROJECT_LEADS, ALL_COMPANIES, ALL_CITIES, toggleInArray, userMatchesAccessFilter, FILTER_PICKER_PAGE_SIZE, computeAccessSummary
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ---------------------------------------------------------------
   User access review — BRD's "User Management" section requires
   quarterly review of every builder user, with a dashboard task
   raised 20 days before the review is due. This extends that with
   an access-freeze on lapse (see the Review-feature note in
   UsersScreen for why), following standard periodic
   access-recertification practice.
   --------------------------------------------------------------- */

// Demo "today" — kept as a fixed reference date (matching the one
// already used for the quarterly-review dashboard task) so every
// review-date calculation in the app agrees with each other.
const REVIEW_DEMO_TODAY = new Date("2026-08-04");

function parseReviewDate(dateStr) {
  // Dates in this file are written "18-Aug-2026" — normalize to
  // something Date() parses reliably.
  return new Date(dateStr.replace(/-/g, " "));
}

function daysUntilReview(dateStr) {
  if (!dateStr) return null;
  return Math.ceil(
    (parseReviewDate(dateStr) - REVIEW_DEMO_TODAY) / 86400000,
  );
}

// Company policy: access review is due 180 days after the last
// review (or after account creation, for a brand-new user who
// hasn't had one yet). Next review date is therefore always
// system-derived, never something a user types in — matching
// "should be read only ... decided based on policy".
const REVIEW_POLICY_DAYS = 180;
function formatReviewDate(d) {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return d.getDate() + "-" + months[d.getMonth()] + "-" + d.getFullYear();
}
function computeNextReviewDate(fromDateStr) {
  const base = fromDateStr ? parseReviewDate(fromDateStr) : REVIEW_DEMO_TODAY;
  const next = new Date(base);
  next.setDate(next.getDate() + REVIEW_POLICY_DAYS);
  return formatReviewDate(next);
}

// Single source of truth for a user's access-review state, used by
// both the User Management grid and the notification bell so they
// never disagree with each other.
//   "frozen"   — review date has passed and nobody reviewed it;
//                access is suspended until re-reviewed.
//   "due_soon" — review date is within 20 days.
//   "current"  — reviewed recently, nothing due yet.
//   "inactive" — user is deactivated; review cycle is paused.
function userReviewState(u) {
  if (!u.isActive) return "inactive";
  const d = daysUntilReview(u.reviewDue);
  if (d === null) return "current";
  if (d < 0) return "frozen";
  if (d <= 20) return "due_soon";
  return "current";
}

const BUILDER_USERS_INITIAL = [
  {
    id: "u1",
    firstName: "Firoj",
    lastName: "Khan",
    email: "firoj.khan@safleworks.com",
    mobile: "9876543210",
    designation: "Admin",
    address: "4th Floor, Safleworks House, BKC, Mumbai",
    pan: "ABCPK1234F",
    dob: "1988-04-12",
    idProofType: "PAN Card",
    idProofName: "firoj-pan-card.pdf",
    role: "Developer Admin",
    access: "Full Access",
    isActive: true,
    firstAccess: true,
    lastLogin: "02-Aug-2026 09:41 AM",
    createdOn: "12-Jan-2026",
    modifiedOn: "02-Aug-2026",
    kyc: "done",
    reviewDue: "18-Aug-2026",
    lastReviewedOn: "18-May-2026",
  },
  {
    id: "u2",
    firstName: "Rahul",
    lastName: "Mehta",
    email: "rahul@safleworks.com",
    mobile: "9822011223",
    designation: "Site Engineer",
    address: "Green Valley Site Office, Pune",
    pan: "DEFPM5678K",
    dob: "1992-11-30",
    idProofType: "Aadhaar Card",
    idProofName: "rahul-aadhaar.pdf",
    role: "Developer User",
    access: "Project-specific",
    selProjects: ["p1", "p2"],
    isActive: true,
    firstAccess: false,
    lastLogin: "18-Jul-2026 06:12 PM",
    createdOn: "20-Jun-2026",
    modifiedOn: "20-Jun-2026",
    kyc: "pending",
    reviewDue: "05-Sep-2026",
    lastReviewedOn: "05-Jun-2026",
  },
  {
    // Demo case for the freeze behaviour: review date has already
    // passed with nobody having reviewed it yet, so this user's
    // access should show as frozen until an admin reviews them.
    id: "u3",
    firstName: "Sneha",
    lastName: "Patil",
    email: "sneha.patil@safleworks.com",
    mobile: "9890123456",
    designation: "Accounts Executive",
    address: "Riverside Heights Site Office, Mumbai",
    pan: "GHIPP9012L",
    dob: "1990-06-21",
    idProofType: "Passport",
    idProofName: "sneha-passport.pdf",
    role: "Developer User",
    access: "Project-specific",
    selProjects: ["p2"],
    // Demonstrates the "creator always has access" rule: Sneha
    // isn't manually assigned Riverside Heights, but she created
    // it, so she keeps access regardless of role/assignment until
    // an admin explicitly removes it (by unchecking it below, same
    // as any other project).
    creatorProjects: ["p1"],
    isActive: true,
    firstAccess: false,
    lastLogin: "11-Jul-2026 11:03 AM",
    createdOn: "10-Feb-2026",
    modifiedOn: "20-Apr-2026",
    kyc: "done",
    reviewDue: "20-Jul-2026",
    lastReviewedOn: "20-Apr-2026",
  },
];

/* ================= 3. USER MANAGEMENT (listing + entry modal) ================= */
// Demo data: all project leads / companies "under this developer
// admin" — hoisted to module scope so both the Add/Edit User form
// and the Review Access screen can share the exact same picker.
const ALL_PROJECT_LEADS = [
  { id: "p1", name: "Riverside Heights", company: "Safleworks Constructions Pvt Ltd", city: "Mumbai" },
  { id: "p2", name: "Green Valley Phase 2", company: "Safleworks Constructions Pvt Ltd", city: "Pune" },
  { id: "p3", name: "ASP(906773)", company: "Shri Siddhivinayak Developers", city: "Thane" },
  { id: "p4", name: "Palm Residency Phase 3", company: "Safleworks Riverside SPV LLP", city: "Mumbai" },
  { id: "p5", name: "Harbourline Towers", company: "Safleworks Riverside SPV LLP", city: "Thane" },
];
const ALL_COMPANIES = [
  { id: "c1", name: "Safleworks Constructions Pvt Ltd", city: "Mumbai" },
  { id: "c2", name: "Safleworks Riverside SPV LLP", city: "Mumbai" },
  { id: "c3", name: "Shri Siddhivinayak Developers", city: "Thane" },
];
const ALL_CITIES = [...new Set(ALL_PROJECT_LEADS.map((p) => p.city))];

function toggleInArray(arr, setArr, id) {
  setArr(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
}

// Does this user's effective access satisfy the chosen filter?
// "Full access" filter matches only full-access users. Otherwise a
// user matches a category (projects/companies/cities) if they hold
// full access (so they implicitly cover everything) OR their own
// assigned/created scope overlaps the selection. Categories combine
// with AND; choices within a category combine with OR. An empty
// filter (nothing picked anywhere) matches everyone.
function userMatchesAccessFilter(r, f) {
  if (!f) return true;
  const isFullAccess = !!r.fullAccess || r.access === "Full Access";
  if (f.fullAccessOnly) return isFullAccess;

  const hasAnyPicked =
    f.projects.length > 0 || f.companies.length > 0 || f.cities.length > 0;
  if (!hasAnyPicked) return true;

  if (isFullAccess) return true;

  const userProjectIds = [
    ...(r.selProjects || []),
    ...(r.creatorProjects || []),
  ];
  if (f.projects.length > 0) {
    if (!f.projects.some((id) => userProjectIds.includes(id))) return false;
  }
  if (f.companies.length > 0) {
    const userCompanyIds = r.selCompanies || [];
    if (!f.companies.some((id) => userCompanyIds.includes(id))) return false;
  }
  if (f.cities.length > 0) {
    const userCityIds = r.selCities || [];
    if (!f.cities.some((c) => userCityIds.includes(c))) return false;
  }
  return true;
}

// A single filter picker — pill-style trigger button that opens a
// modal with a searchable, paginated grid of selectable items.
// Selections live only in this component's draft state until "Done"
// is clicked, at which point onApply(draft) commits them all at
// once to the parent — so paging through results never loses a
// pick, and closing without "Done" discards the draft entirely.
// Used for Projects / Company / City so all three look and behave
// identically.
const FILTER_PICKER_PAGE_SIZE = 8;

// The Access level select plus all three checkable grids (Project /
// Company / City), each with a "Select all" shortcut — shared by
// the Add/Edit User form and the Review Access screen so they can
// never drift out of sync with each other.
function computeAccessSummary(fullAccess, selProjects, selCompanies, selCities) {
  if (fullAccess) return "Full Access";
  const parts = [];
  if (selProjects.length)
    parts.push(
      selProjects.length + " project" + (selProjects.length > 1 ? "s" : ""),
    );
  if (selCompanies.length)
    parts.push(
      selCompanies.length +
        " compan" +
        (selCompanies.length > 1 ? "ies" : "y"),
    );
  if (selCities.length)
    parts.push(
      selCities.length + " cit" + (selCities.length > 1 ? "ies" : "y"),
    );
  return parts.length ? parts.join(" + ") : "No access scope selected";
}
