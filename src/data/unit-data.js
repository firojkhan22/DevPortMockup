// src/data/unit-data.js
// Provides (global): UNIT_DATA_COLUMNS, UNIT_DATA_TEMPLATE_TYPES,
//   unitDataColumnsFor, csvCell, downloadUnitDataTemplate, parseCsv,
//   UNIT_UPLOAD_ALLOWED_EXTS, unitUploadFileExt, unitUploadExtValid,
//   UNIT_DATA_UPLOADS_INITIAL, summariseBuildings
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// BRD's exact Unit Data column set, in the exact order listed. Kept
// as the master list — the per-template-type column sets below are
// ordered subsets of this.
const UNIT_DATA_COLUMNS = [
  "Building",
  "Flat / Unit / Shop Number",
  "Floor Number",
  "Bungalow / Row House Number",
  "Plot Number",
  "Unit category (Residential / Commercial / Plot)",
  "Type of unit",
  "Unit configuration (1BHK/2BHK/3BHK/Shop/Office/Duplex/Triplex/Penthouse/etc.)",
  "Carpet area (Sqft)",
  "Built-up area (Sqft)",
  "Super Built-up area (Sqft)",
  "Plot Area (Sqft)",
  "Rate/sqft",
  "Sold / Unsold / Not launched",
];

// The three template types the developer picks before downloading a
// sample / uploading — each drives its own column set and its own
// "Download <type> template" button label.
const UNIT_DATA_TEMPLATE_TYPES = [
  "Multi Storey Buildings",
  "Bungalow / Row Houses",
  "Plotted Layout",
];

const UNIT_DATA_COLUMNS_BY_TYPE = {
  "Multi Storey Buildings": [
    "Building",
    "Flat / Unit / Shop Number",
    "Floor Number",
    "Unit category (Residential / Commercial / Plot)",
    "Type of unit",
    "Unit configuration (1BHK/2BHK/3BHK/Shop/Office/Duplex/Triplex/Penthouse/etc.)",
    "Carpet area (Sqft)",
    "Built-up area (Sqft)",
    "Super Built-up area (Sqft)",
    "Rate/sqft",
    "Sold / Unsold / Not launched",
  ],
  "Bungalow / Row Houses": [
    "Building",
    "Bungalow / Row House Number",
    "Unit category (Residential / Commercial / Plot)",
    "Type of unit",
    "Unit configuration (1BHK/2BHK/3BHK/Shop/Office/Duplex/Triplex/Penthouse/etc.)",
    "Carpet area (Sqft)",
    "Built-up area (Sqft)",
    "Super Built-up area (Sqft)",
    "Plot Area (Sqft)",
    "Rate/sqft",
    "Sold / Unsold / Not launched",
  ],
  "Plotted Layout": [
    "Building",
    "Plot Number",
    "Plot Area (Sqft)",
    "Unit category (Residential / Commercial / Plot)",
    "Rate/sqft",
    "Sold / Unsold / Not launched",
  ],
};

// Column set for the currently-selected template type — falls back to
// the full BRD list until a type is chosen.
function unitDataColumnsFor(templateType) {
  return UNIT_DATA_COLUMNS_BY_TYPE[templateType] || UNIT_DATA_COLUMNS;
}

// One representative sample value per column, so a template of any
// column subset can be filled with a plausible example row.
const UNIT_DATA_SAMPLE_VALUE = {
  "Building": "",
  "Flat / Unit / Shop Number": "A-101",
  "Floor Number": "1",
  "Bungalow / Row House Number": "RH-12",
  "Plot Number": "P-045",
  "Unit category (Residential / Commercial / Plot)": "Residential",
  "Type of unit": "Flat",
  "Unit configuration (1BHK/2BHK/3BHK/Shop/Office/Duplex/Triplex/Penthouse/etc.)": "2BHK",
  "Carpet area (Sqft)": "650",
  "Built-up area (Sqft)": "720",
  "Super Built-up area (Sqft)": "810",
  "Plot Area (Sqft)": "1200",
  "Rate/sqft": "9500",
  "Sold / Unsold / Not launched": "Unsold",
};

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return '"' + s.replace(/"/g, '""') + '"';
}

// Builds and triggers a real client-side CSV download — a genuine
// file the developer can open in Excel, fill in, and re-upload
// through this same screen; there's no server involved, so a Blob +
// object URL is the standard way to do this from a static prototype.
//
// The template is type-aware (Multi Storey / Bungalow-Row House /
// Plotted Layout — different column sets) and building-scope-aware:
// `buildings` is the array of buildings picked in the multi-select.
// Empty / ["All"] means one sample row per building in the project.
function downloadUnitDataTemplate(templateType, buildings, projectName, allBuildings) {
  const columns = unitDataColumnsFor(templateType);
  const scopeBuildings =
    !buildings || buildings.length === 0 || buildings.includes("All")
      ? allBuildings
      : buildings;

  const sampleRowFor = (b) =>
    columns.map((c) => (c === "Building" ? b || "" : UNIT_DATA_SAMPLE_VALUE[c] || ""));

  const rows = [columns, ...scopeBuildings.map((b) => sampleRowFor(b))];
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const typeBit = (templateType || "Unit_Data").replace(/[^a-z0-9]+/gi, "_");
  const nameBit = (projectName || "Project").replace(/[^a-z0-9]+/gi, "_");
  a.href = url;
  a.download = "Unit_Data_Template_" + typeBit + "_" + nameBit + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Upload accepts Excel / CSV / PDF. Only CSV can be parsed and
// previewed in a static prototype; the other two are accepted,
// stored, and left for server-side structure validation.
const UNIT_UPLOAD_ALLOWED_EXTS = ["csv", "xlsx", "xls", "pdf"];
function unitUploadFileExt(name) {
  return (name || "").split(".").pop().toLowerCase();
}
function unitUploadExtValid(name) {
  return UNIT_UPLOAD_ALLOWED_EXTS.includes(unitUploadFileExt(name));
}

// Minimal CSV parser — good enough for a template we control the
// shape of (handles quoted fields with embedded commas/quotes,
// which is all Excel-exported CSV needs).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      // skip
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

// "Building Number" grid cell: a single-line summary that shows the
// first few and folds the rest behind "+ More" (full list available
// on hover / click). Mirrors the BRD example "1, 2, 3, 5 + More".
function summariseBuildings(buildings, shown) {
  const clean = (buildings || []).map((b) => String(b).trim()).filter(Boolean);
  const n = shown || 4;
  if (clean.length === 0) return { text: "All buildings", full: "All buildings", more: 0 };
  if (clean.length <= n)
    return { text: clean.join(", "), full: clean.join(", "), more: 0 };
  return {
    text: clean.slice(0, n).join(", ") + " + More",
    full: clean.join(", "),
    more: clean.length - n,
  };
}

// Demo "previously uploaded" rows for the Unit Data Upload history
// grid. `csvText` lets the prototype rebuild a downloadable file when
// the user clicks the file name (a real deployment would stream the
// stored original).
const UNIT_DATA_UPLOADS_INITIAL = [
  {
    id: "ud1",
    fileName: "RiversideHeights_MultiStorey_Units.csv",
    templateType: "Multi Storey Buildings",
    buildings: ["Riverside Heights Tower A", "Riverside Heights Tower B"],
    projectName: "Riverside Heights",
    rowCount: 128,
    createdBy: "Sneha Patil",
    updatedBy: "Sneha Patil",
    uploadedOn: "28-Aug-2026 11:20 AM",
    csvText:
      "Building,Flat / Unit / Shop Number,Floor Number,Sold / Unsold / Not launched\r\n" +
      "Riverside Heights Tower A,A-101,1,Sold\r\nRiverside Heights Tower B,B-204,2,Unsold",
  },
  {
    id: "ud2",
    fileName: "GreenValley_Ph2_PlottedLayout.csv",
    templateType: "Plotted Layout",
    buildings: ["Green Valley Wing 1"],
    projectName: "Green Valley Phase 2",
    rowCount: 44,
    createdBy: "Rahul Mehta",
    updatedBy: "Firoj Khan",
    uploadedOn: "31-Aug-2026 04:05 PM",
    csvText:
      "Building,Plot Number,Plot Area (Sqft),Sold / Unsold / Not launched\r\n" +
      "Green Valley Wing 1,P-045,1200,Not launched",
  },
  {
    id: "ud3",
    fileName: "OrchidSprings_Bungalows.csv",
    templateType: "Bungalow / Row Houses",
    buildings: [
      "Orchid Springs Pearl",
      "Orchid Springs Hibiscus",
      "Orchid Springs Lotus",
      "Orchid Springs Jasmine",
      "Orchid Springs Marigold",
    ],
    projectName: "Alliance Orchid Springs (54217)",
    rowCount: 60,
    createdBy: "Firoj Khan",
    updatedBy: "Firoj Khan",
    uploadedOn: "02-Sep-2026 09:48 AM",
    csvText:
      "Building,Bungalow / Row House Number,Plot Area (Sqft),Sold / Unsold / Not launched\r\n" +
      "Orchid Springs Pearl,RH-12,1500,Unsold",
  },
];
