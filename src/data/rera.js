// src/data/rera.js
// Provides (global): RERA_STATE_PATTERNS, reraNumberFormatWarning, todayIso, validateReraRow, findDuplicateReraNumbers, RERA_AUTHORITY_BULK_POOL, searchReraAuthorityRecords, RERA_RESULTS_PAGE_SIZE
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// ---- RERA validation helpers -------------------------------------
// RERA registration numbers are issued by each STATE authority in
// its own format (there is no single national pattern under the
// RERA Act, 2016). We keep a best-effort map for the states we see
// most often on this portal and fall back to a soft, non-blocking
// warning for any state not yet mapped — format is a secondary
// concern next to uniqueness, which is a hard rule everywhere.
const RERA_STATE_PATTERNS = {
  maharashtra: {
    re: /^P5\d{10}$/,
    example: "P51800012345",
  },
  karnataka: {
    re: /^PRM\/KA\/RERA\/\d{4}\/\d{3}\/PR\/\d{6}\/\d{6}$/,
    example: "PRM/KA/RERA/1251/446/PR/171021/004401",
  },
  delhi: {
    re: /^DLRERA\d{4}[A-Z]\d{4,5}$/,
    example: "DLRERA2019P0001",
  },
  "uttar pradesh": {
    re: /^UPRERAPRJ\d{5,8}$/,
    example: "UPRERAPRJ123456",
  },
};

function reraNumberFormatWarning(regNumber, stateName) {
  if (!regNumber) return "";
  const key = (stateName || "").trim().toLowerCase();
  const pattern = RERA_STATE_PATTERNS[key];
  if (!pattern) {
    // State not mapped yet — don't block, just flag for manual check.
    return "";
  }
  if (!pattern.re.test(regNumber.trim().toUpperCase())) {
    return (
      "Doesn't match the usual " +
      (stateName || "state") +
      " RERA format (e.g. " +
      pattern.example +
      "). Double-check before submitting."
    );
  }
  return "";
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

// Validates a single RERA row against the BRD's three mutually
// exclusive paths. Returns a map of field -> error message.
function validateReraRow(row) {
  const errors = {};
  if (row.path === "registered") {
    if (!row.regNumber || !row.regNumber.trim())
      errors.regNumber = "RERA registration number is required.";
    if (!row.validFrom)
      errors.validFrom = "Valid-from date is required.";
    if (!row.validTo) errors.validTo = "Valid-to date is required.";
    if (row.validFrom && row.validTo && row.validTo <= row.validFrom)
      errors.validTo = "Valid-to date must be after valid-from date.";
    if (!row.remarks || !row.remarks.trim())
      errors.remarks = "Remarks are required for a registered building.";
  } else if (row.path === "applied") {
    if (!row.applicationNumber || !row.applicationNumber.trim())
      errors.applicationNumber = "RERA application number is required.";
    if (!row.applicationDate)
      errors.applicationDate = "Application date is required.";
    if (row.applicationDate && row.applicationDate > todayIso())
      errors.applicationDate = "Application date can't be in the future.";
    if (!row.expectedApprovalDate)
      errors.expectedApprovalDate = "Expected approval date is required.";
    if (
      row.applicationDate &&
      row.expectedApprovalDate &&
      row.expectedApprovalDate <= row.applicationDate
    )
      errors.expectedApprovalDate =
        "Expected approval date must be after the application date.";
  } else if (row.path === "na") {
    if (!row.remarks || !row.remarks.trim())
      errors.remarks = "Remarks are mandatory when RERA is not applicable.";
  }
  return errors;
}

// A registration number must be unique across every "registered"
// row in the project — different buildings/phases get different
// numbers; the SAME number reappearing means someone is trying to
// re-add a cert that should instead go through the RERA extension
// flow, which amends the existing row rather than duplicating it.
function findDuplicateReraNumbers(rows) {
  const seen = {};
  const dupes = new Set();
  rows.forEach((r) => {
    if (r.path !== "registered" || !r.regNumber) return;
    const key = r.regNumber.trim().toUpperCase();
    if (!key) return;
    if (seen[key]) dupes.add(key);
    seen[key] = true;
  });
  return dupes;
}


// (every field stays editable afterwards).
// Stands in for the state RERA authorities' public search APIs
// (e.g. MahaRERA) — in the real build this would be a network call
// keyed off the RERA registration number. A short delay is simulated
// so the loading state in the UI is easy to demo.
// Stands in for the state RERA authorities' public search APIs (e.g.
// MahaRERA) — in the real build this would be a network call keyed
// off the RERA registration number / project name. A short delay is
// simulated so the loading state in the UI is easy to demo.
//
// A large synthetic pool is generated once (module load) purely so
// this prototype can demonstrate what happens when a search legitimately
// matches hundreds or thousands of records — the UI below is built to
// stay fast and usable at that scale (pagination + a narrow-results
// filter), not just for the 3-5 handpicked demo projects.
const RERA_AUTHORITY_BULK_POOL = (function buildBulkPool() {
  const prefixes = [
    "Sunrise", "Green", "Palm", "Silver", "Golden", "Royal", "Emerald",
    "Crystal", "Maple", "Orchid", "Lake", "Hill", "River", "Ocean",
    "Star", "Blue", "White", "Amber", "Cedar", "Pearl",
  ];
  const suffixes = [
    "Meadows", "Residency", "Heights", "Towers", "Enclave", "Gardens",
    "Vista", "Bay View", "Park", "Greens", "Homes", "Chambers",
    "Square", "Court", "Villas",
  ];
  const cities = [
    "Pune", "Mumbai", "Thane", "Nashik", "Nagpur", "Navi Mumbai",
    "Aurangabad", "Kolhapur", "Solapur", "Amravati",
  ];
  const list = [];
  const COUNT = 1600;
  for (let i = 0; i < COUNT; i++) {
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[Math.floor(i / prefixes.length) % suffixes.length];
    const phase = (i % 4) + 1;
    list.push({
      id: "rera-bulk-" + i,
      name: prefix + " " + suffix + (i % 3 === 0 ? " Phase " + phase : ""),
      reraNo: "P5" + (1700000000 + i * 137).toString().slice(0, 10),
      city: cities[i % cities.length],
      state: "Maharashtra",
    });
  }
  return list;
})();

function searchReraAuthorityRecords(query, unclaimedProjects) {
  const AUTHORITY_DB = [
    ...unclaimedProjects,
    {
      id: "rera-auth-1",
      name: "Lakeview Enclave",
      reraNo: "P52100011223",
      city: "Nashik",
      state: "Maharashtra",
    },
    {
      id: "rera-auth-2",
      name: "Orchid Business Bay",
      reraNo: "P51700076543",
      city: "Navi Mumbai",
      state: "Maharashtra",
    },
    ...RERA_AUTHORITY_BULK_POOL,
  ];
  const q = query.trim().toLowerCase();
  const unclaimedIds = new Set(unclaimedProjects.map((p) => p.id));
  return new Promise((resolve) => {
    setTimeout(() => {
      const matches = AUTHORITY_DB.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.reraNo.toLowerCase().includes(q)
      ).map((p) => ({ ...p, fromAuthority: !unclaimedIds.has(p.id) }));
      resolve(matches);
    }, 700);
  });
}

const RERA_RESULTS_PAGE_SIZE = 8;
