// src/data/unit-data.js
// Provides (global): UNIT_DATA_COLUMNS, csvCell, downloadUnitDataTemplate, parseCsv
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// BRD's exact Unit Data column set, in the exact order listed.
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

function csvCell(v) {
  const s = v == null ? "" : String(v);
  return '"' + s.replace(/"/g, '""') + '"';
}

// Builds and triggers a real client-side CSV download — this is a
// genuine file the developer can open in Excel, fill in, and
// re-upload through this same screen; there's no server involved,
// so a Blob + object URL is the standard way to do this from a
// static prototype.
// `building` is "" when "--Select--" is chosen — meaning the
// template covers every building in the project (one example row
// per building, so it's clear the Building column must be filled
// per unit). Otherwise the template is scoped to that one building,
// pre-filled.
function downloadUnitDataTemplate(building, projectName, allBuildings) {
  const sampleRowFor = (b) => [
    b || "",
    "A-101",
    "1",
    "",
    "",
    "Residential",
    "Flat",
    "2BHK",
    "650",
    "720",
    "810",
    "",
    "9500",
    "Unsold",
  ];
  const sampleRows = building
    ? [sampleRowFor(building)]
    : allBuildings.map((b) => sampleRowFor(b));
  const rows = [UNIT_DATA_COLUMNS, ...sampleRows];
  const csv = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const nameBit = building || projectName || "Project";
  a.href = url;
  a.download =
    "Unit_Data_Template_" + nameBit.replace(/[^a-z0-9]+/gi, "_") + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
