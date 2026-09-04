// src/data/work-progress.js
// Provides (global): WORK_PROGRESS_DOC_TYPES, CONSTRUCTION_STAGE_FIELDS, emptyStageValues, computeCompletion, stageStatusLabel, seedRow, INITIAL_TOWER_ROWS, INITIAL_BUNGALOW_ROWS
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 11. WORK PROGRESS ================= */
// Document types offered when uploading a work-progress document.
// Kept as a flat list (rather than per-row) since the legacy system's
// upload panel offers one shared dropdown for whatever is being
// attached, independent of which building row it relates to.
const WORK_PROGRESS_DOC_TYPES = [
  "Architect letter",
  "Progress photographs",
  "Engineer certificate",
  "Site inspection report",
  "RCC / slab completion certificate",
  "Other",
];

// The 13 named construction stages from the BRD, used once "Work
// started" is selected. Each is a free-text update, matching the
// BRD's "Free text" spec for every stage rather than a percentage
// or dropdown.
const CONSTRUCTION_STAGE_FIELDS = [
  ["initialWork", "Initial work"],
  ["excavation", "Excavation"],
  ["foundation", "Foundation / Piling works"],
  ["basementSlabs", "Basement slabs"],
  ["plinthWork", "Plinth work"],
  ["rccWork", "RCC work (number of slabs)"],
  ["brickWork", "Brick work / Wall construction"],
  ["internalPlaster", "Internal Plaster work"],
  ["externalPlaster", "External Plaster work"],
  ["flooring", "Flooring Work"],
  ["plumbing", "Plumbing works"],
  ["finishing", "Finishing work"],
  ["possession", "Possession activities"],
];

function emptyStageValues() {
  const v = {};
  CONSTRUCTION_STAGE_FIELDS.forEach(([k]) => (v[k] = ""));
  return v;
}

// Rough visual completion estimate for the progress bar on the list
// screen — not part of the BRD spec itself (which doesn't define a
// formula), just a reasonable derivation so the mockup's completion
// bar has something meaningful to show: 0% while not started, a
// small nominal amount for an open plot, otherwise the fraction of
// the 13 stages that have any text entered.
function computeCompletion(row) {
  if (row.stageStatus === "not_started") return 0;
  if (row.stageStatus === "open_plot") return 5;
  const filled = CONSTRUCTION_STAGE_FIELDS.filter(
    ([k]) => (row.stages[k] || "").trim().length > 0,
  ).length;
  return Math.round((filled / CONSTRUCTION_STAGE_FIELDS.length) * 100);
}

function stageStatusLabel(s) {
  if (s === "not_started") return "Work Not Started";
  if (s === "open_plot") return "Open Plot";
  return "Work Started";
}

/* ---------------------------------------------------------------
   Update Work Progress — rebuilt against the PAMS 2.0 BRD:
   - Tower (building) vs Bungalow/Plot (unit) modes, matching the
     reference mockup's filter chips
   - Searchable, multi-select list with a completion bar per row
   - Bulk "Update" across one or more selected rows at once
   - Full stage-of-construction breakdown once "Work started" is
     selected, pre-populated from the last submission
   - Mandatory property photos/video (min 2) kept separate from
     optional supporting documents
   - Date progress + % amount due + date demand letters will be
     issued, all as explicit fields
   - "History" to view previously submitted details
   --------------------------------------------------------------- */

function seedRow(overrides) {
  return Object.assign(
    {
      stageStatus: "not_started",
      stages: emptyStageValues(),
      remarks: "",
      progressDate: "",
      pctDue: "",
      demandLetterDate: "",
      photos: [],
      docs: [],
      history: [],
    },
    overrides,
  );
}

const INITIAL_TOWER_ROWS = [
  seedRow({
    id: "t1",
    type: "tower",
    name: "Orchid Springs Pearl",
    floors: 12,
    stageStatus: "started",
    stages: Object.assign(emptyStageValues(), {
      initialWork: "Complete",
      excavation: "Complete",
      foundation: "Complete",
      basementSlabs: "Complete",
      plinthWork: "Complete",
      rccWork: "8 of 12 slabs cast",
    }),
    remarks: "Q1 progress certification received from architect.",
    progressDate: "2026-03-15",
    pctDue: "20",
    demandLetterDate: "2026-04-10",
    docs: [
      {
        id: 1,
        name: "Architect_Letter_Mar2026.pdf",
        type: "Architect letter",
        remark: "Q1 progress certification",
        date: "2026-03-15 11:20",
        size: 812000,
        dataUrl: null,
      },
    ],
    photos: [
      {
        id: 2,
        name: "Site_Photos_Feb2026.jpg",
        type: "",
        remark: "Slab casting — 8th floor",
        date: "2026-02-27 09:05",
        size: 2150000,
        dataUrl: null,
      },
    ],
    history: [
      {
        date: "2026-02-27",
        stageStatus: "started",
        remarks: "7th floor slab cast.",
        pctDue: "15",
        demandLetterDate: "2026-03-10",
        photosCount: 2,
        docsCount: 1,
      },
    ],
  }),
  seedRow({
    id: "t2",
    type: "tower",
    name: "Orchid Springs Hibiscus",
    floors: 12,
    stageStatus: "open_plot",
    progressDate: "",
    pctDue: "",
  }),
];

const INITIAL_BUNGALOW_ROWS = [
  seedRow({
    id: "b1",
    type: "bungalow",
    name: "Bungalow 5",
    exposure: true,
    stageStatus: "not_started",
  }),
  seedRow({
    id: "b2",
    type: "bungalow",
    name: "Bungalow 12",
    exposure: true,
    stageStatus: "started",
    stages: Object.assign(emptyStageValues(), {
      initialWork: "Complete",
      excavation: "Complete",
    }),
    progressDate: "2026-03-01",
    pctDue: "10",
  }),
  seedRow({
    id: "b3",
    type: "bungalow",
    name: "Bungalow 18",
    exposure: false,
    stageStatus: "not_started",
  }),
];
