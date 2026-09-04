// src/data/campaigns.js
// Provides (global): formatDDMMMYYYY, maskAccountNo, toLakhs, campaignValidityLabel, CAMPAIGN_STAGES, campaignStagePill
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 14. CAMPAIGNS: LISTING + ENTRY ================= */
// Formats an ISO date ("2026-10-01", from a <input type="date">) as
// dd-MMM-yyyy ("01-Oct-2026"). Falls back to returning the input
// unchanged if it isn't a plain ISO date string.
function formatDDMMMYYYY(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return m[3] + "-" + months[parseInt(m[2], 10) - 1] + "-" + m[1];
}
// Shared disbursement-grid helpers — masking and lakh formatting are
// needed wherever account numbers or cumulative disbursement figures
// are shown (Loan Details tab drill-down, Disbursement Statement,
// Project Disbursement), so they live here rather than being
// duplicated per screen.
// Masks all but the last 4 digits of an account number, e.g.
// "50100234567890" -> "XXXXXXXXXX7890".
function maskAccountNo(acct) {
  if (!acct) return "";
  const s = String(acct);
  if (s.length <= 4) return s;
  return "X".repeat(s.length - 4) + s.slice(-4);
}
// Formats a rupee amount (number) as lakhs with 2 decimals, e.g.
// 3687657 -> "36.88". Business asked for cumulative disbursement
// "in lakhs" specifically, so this stays a plain number (no ₹ or
// "L" suffix baked in) — callers add units/currency as needed.
function toLakhs(amount) {
  if (amount == null || isNaN(amount)) return "0.00";
  return (amount / 100000).toFixed(2);
}
// Full validity-period display for a campaign — "Ongoing" instead
// of an end date when the campaign has none, matching how the
// bank's own campaigns already display an open-ended offer (see
// the "CLSS awareness drive" example in View HDFC Bank Campaigns).
function campaignValidityLabel(c) {
  const from = formatDDMMMYYYY(c.validFrom);
  if (c.isOngoing) return from + " – Ongoing";
  return from + " – " + formatDDMMMYYYY(c.validTo);
}
// The real approval workflow (BD team recommend -> BD Head + Central
// BD Coordinator approve -> ... ) runs entirely inside PAMS, not
// this portal — per the BRD, this portal's job is just to push the
// campaign over and then reflect whatever decision comes back.
// "Query Raised" covers BD asking for a clarification or missing
// document rather than an outright reject — the developer can
// respond (with only the flagged field(s) unlocked) and it goes
// back to In Process for another look.
const CAMPAIGN_STAGES = [
  "Draft",
  "In Process",
  "Query Raised",
  "Approved",
  "Rejected",
];
function campaignStagePill(stage) {
  if (stage === "Approved") return "bg-success-subtle text-success";
  if (stage === "Rejected") return "bg-danger-subtle text-danger";
  if (stage === "Query Raised") return "bg-info-subtle text-info";
  if (stage === "Draft") return "bg-secondary-subtle text-secondary";
  return "bg-warning-subtle text-warning"; // In Process
}
