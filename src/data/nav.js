// src/data/nav.js
// Provides (global): NAV_LABEL_MAP, TOPBAR_ICONS, iconForTitle, ALWAYS_UNLOCKED_SCREENS, PENDING_UNLOCKED_SCREENS, isScreenLocked, lockedRedirectTarget, ENTRY_UPDATE_SCREENS
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


const NAV_LABEL_MAP = {
  home: { label: "Home", icon: "🏠" },
  dashboard: { label: "Dashboard", icon: "▦" },
  accessRevoked: { label: "Access Revoked", icon: "🚫" },
  projectNotifications: { label: "Notifications & Queries", icon: "🔔" },
  profile: { label: "My Profile", icon: "🙍" },
  companyListing: { label: "Company Listing", icon: "🏗️" },
  companyUsers: { label: "Company Users", icon: "🧑‍🤝‍🧑" },
  companyEntry: { label: "Company Entry", icon: "🏗️" },
  usersListing: { label: "User Management", icon: "👤" },
  userForm: { label: "Add / Edit User", icon: "👤" },
  passkey: { label: "Passkey Security", icon: "🔑" },
  allProjects: { label: "All Projects", icon: "📁" },
  newproject: { label: "Complete Project Lead", icon: "📁" },
  queries: { label: "Respond to Queries", icon: "💬" },
  myQueries: { label: "Queries I Raised", icon: "🗨️" },
  raiseQuery: { label: "Raise a Query", icon: "🗨️" },
  bankListing: { label: "Bank Accounts", icon: "🏦" },
  bankEntry: { label: "Bank Account Entry", icon: "🏦" },
  rera: { label: "RERA Detail Update", icon: "📋" },
  oc: { label: "OC Detail Update", icon: "🧾" },
  constructionFinance: { label: "Construction Finance", icon: "💰" },
  inventory: { label: "Inventory Update", icon: "🏢" },
  progress: { label: "Update Work Progress", icon: "📈" },
  unitdata: { label: "Unit Data Upload", icon: "📤" },
  leadsListing: { label: "Customer Leads", icon: "🧾" },
  leadsEntry: { label: "Customer Lead Entry", icon: "🧾" },
  campaignsListing: { label: "My Campaigns", icon: "📢" },
  campaignsEntry: { label: "Campaign Entry", icon: "📢" },
  bankcampaigns: { label: "HDFC Bank Campaigns", icon: "🏷️" },
  disbursementStatement: { label: "Disbursement Statement", icon: "📊" },
  disbursement: { label: "Project Disbursement", icon: "💳" },
  calculators: { label: "Calculators", icon: "🧮" },
  coordinators: { label: "Project Coordinators", icon: "👥" },
  issueListing: { label: "Issue Listing", icon: "🗂️" },
  raiseIssue: { label: "Raise Issue", icon: "🚩" },
};

const TOPBAR_ICONS = [
  ["My Profile", "🙍"],
  ["Home", "🏠"],
  ["Dashboard", "▦"],
  ["Company Listing", "🏗️"],
  ["Company Entry", "🏗️"],
  ["User Management", "👤"],
  ["Passkey", "🔑"],
  ["All Projects", "📁"],
  ["Complete Project Lead", "📁"],
  ["Respond to Queries", "💬"],
  ["Queries I Raised", "🗨️"],
  ["Raise a Query", "🗨️"],
  ["Bank Account", "🏦"],
  ["RERA", "📋"],
  ["OC Detail", "🧾"],
  ["Construction Finance", "💰"],
  ["Inventory", "🏢"],
  ["Work Progress", "📈"],
  ["Unit Data", "📤"],
  ["Customer Lead", "🧾"],
  ["Campaign", "📢"],
  ["HDFC Bank Campaigns", "🏷️"],
  ["Disbursement", "💳"],
  ["Calculators", "🧮"],
  ["Coordinators", "👥"],
  ["Issue Listing", "🗂️"],
  ["Raise Issue", "🚩"],
];
function iconForTitle(title) {
  const t = typeof title === "string" ? title : "";
  const found = TOPBAR_ICONS.find(([k]) => t.includes(k));
  return found ? found[1] : "▪";
}

/* Single source of truth for the onboarding access gate — used by
   AppShell's navigateTo (which guards every navigation path, no
   matter where it's triggered from) and by Sidebar (for the visual
   lock icon only). Keeping this in one place is the fix for the
   "Quick Actions bypasses the lock" bug: previously each place that
   could navigate (Sidebar clicks, Home's Quick Actions, +Add buttons
   on listing screens) had to remember to check this itself, and most
   of them didn't. */
const ALWAYS_UNLOCKED_SCREENS = [
  "home",
  "dashboard",
  "companyListing",
  "companyEntry",
  "companyUsers",
  "developerProfile",
  "profile",
  "usersListing",
  "userForm",
  "passkey",
];
const PENDING_UNLOCKED_SCREENS = [
  ...ALWAYS_UNLOCKED_SCREENS,
  "allProjects",
  "newproject",
  "projectSummary",
  "queries",
  "myQueries",
  "raiseQuery",
];
function isScreenLocked(id, verificationStage) {
  if (verificationStage === "approved") return false;
  if (verificationStage === "pending")
    return !PENDING_UNLOCKED_SCREENS.includes(id);
  return !ALWAYS_UNLOCKED_SCREENS.includes(id);
}
function lockedRedirectTarget(verificationStage) {
  return verificationStage === "incomplete" ? "companyEntry" : "allProjects";
}

// Screens that create or update a record — blocked for a user
// whose access has been revoked (review lapsed, nobody's re-
// reviewed them). Viewing/listing screens stay open; this set is
// specifically the "Project/Lead Entry, or any other entry/update"
// functionality that should be off-limits until an admin restores
// their access.
const ENTRY_UPDATE_SCREENS = new Set([
  "newproject",
  "leadsEntry",
  "campaignsEntry",
  "userForm",
  "bankEntry",
  "rera",
  "oc",
  "constructionFinance",
  "inventory",
  "progress",
  "unitdata",
  "raiseIssue",
  "raiseQuery",
]);
