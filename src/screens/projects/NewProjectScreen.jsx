// src/screens/projects/NewProjectScreen.jsx
// Provides (global): NewProjectScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function NewProjectScreen({ onMenuClick, onDone, editingProject }) {
  const wizardRef = useRef(null);
  const [submitErrors, setSubmitErrors] = useState(null);
  const sections = [
    "Project details",
    "Address",
    "Features",
    "Pricing",
    "RERA",
    "Amenities",
    "Payment schedule",
    "Bank a/c",
    "Documents",
    "Review & Submit",
  ];
  const REVIEW_TAB_INDEX = sections.length - 1;
  const tabsScrollRef = useRef(null);
  const [tabScroll, setTabScroll] = useState({ canLeft: false, canRight: false });
  function updateTabScroll() {
    const el = tabsScrollRef.current;
    if (!el) return;
    setTabScroll({
      canLeft: el.scrollLeft > 4,
      canRight: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }
  function scrollTabsBy(delta) {
    const el = tabsScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }
  useEffect(() => {
    updateTabScroll();
    window.addEventListener("resize", updateTabScroll);
    return () => window.removeEventListener("resize", updateTabScroll);
  }, []);
  function goToSection(i) {
    setActiveSection(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const savedAccounts = [
    {
      id: "acc1",
      label: "Riverside Heights — HDFC Current a/c ••4532",
      payee: "Safleworks Constructions",
      bank: "HDFC Bank",
      acct: "••••••4532",
    },
    {
      id: "acc2",
      label: "Green Valley Phase 2 — ICICI Current a/c ••1187",
      payee: "Safleworks Constructions",
      bank: "ICICI Bank",
      acct: "••••••1187",
    },
  ];
  const [template, setTemplate] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [bankMode, setBankMode] = useState("new");
  const [existingAcct, setExistingAcct] = useState(savedAccounts[0].id);
  // BRD: Construction finance details — "availed" branch captures the
  // existing lender/amount/support doc/HDFC loan a/c; the "not
  // availed" branch separately asks whether financing is *needed*,
  // and if so captures the lead details BD would need to follow up.
  const [cfAvailed, setCfAvailed] = useState("");
  const [cfLender, setCfLender] = useState("");
  const [cfAmount, setCfAmount] = useState("");
  const [cfSupportDoc, setCfSupportDoc] = useState("");
  const [cfHdfcLoanAc, setCfHdfcLoanAc] = useState("");
  const [needsFinance, setNeedsFinance] = useState("");
  const [cfNeedProjectCost, setCfNeedProjectCost] = useState("");
  const [cfNeedAmount, setCfNeedAmount] = useState("");
  const [cfNeedContactName, setCfNeedContactName] = useState("");
  const [cfNeedMobile, setCfNeedMobile] = useState("");
  const [cfNeedEmail, setCfNeedEmail] = useState("");
  // BRD: "Type of payment to be disbursed in the accounts" — one or
  // multiple checkbox selection allowed.
  const PAYMENT_TYPES = [
    "Sale consideration",
    "GST and Taxes",
    "Amenities",
    "Others",
  ];
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [othersSpecify, setOthersSpecify] = useState("");
  const [useVirtualAccount, setUseVirtualAccount] = useState(false);
  const [virtualPrefix, setVirtualPrefix] = useState("");
  const [virtualSupportDoc, setVirtualSupportDoc] = useState("");
  const [bankAcctNo, setBankAcctNo] = useState("");
  function togglePaymentType(t) {
    setPaymentTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }

  // New BRD: per-property-type pricing with master-based "other
  // charges" dropdown and an add-row option for each type.
  const OTHER_CHARGE_TYPES = [
    "Open Parking",
    "Covered Parking",
    "PLC (Preferential Location Charge)",
    "Club House Charges",
    "Legal Charges",
    "Infrastructure Charges",
    "Maintenance Deposit",
    "Power Backup Charges",
  ];
  const blankCharge = () => ({ type: OTHER_CHARGE_TYPES[0], label: "", amount: "" });
  const [resPricing, setResPricing] = useState({ rate: "", floorRise: "", charges: [blankCharge()] });
  const [comPricing, setComPricing] = useState({ rate: "", floorRise: "", charges: [blankCharge()] });
  const [plotPricing, setPlotPricing] = useState({ rate: "", charges: [blankCharge()] });

  // New BRD: Amenities & Proximity — Y/N checklist grouped by category.
  const AMENITY_GROUPS = [
    {
      label: "Marketability of the project",
      items: [
        "Piped water supply availability",
        "Drainage infra-availability",
        "Public transport within radius of 5 kms",
        "Proximity to civic amenities within radius of 3 kms",
        "Healthcare facility within a radius of 5 kms",
        "Distance to the nearest developed area (within 3 kms radius)",
        "No. of projects likely to come up in the locality (at least 3 projects)",
        "Proposed govt infra projects — E-way, metro, etc. in nearby locality",
        "Presence of Cat A developer",
      ],
    },
    {
      label: "Project amenities",
      items: [
        "Lift",
        "Car parking",
        "Swimming pool",
        "Club house",
        "Power back up",
        "Gated system",
      ],
    },
    {
      label: "Flat amenities",
      items: [
        "Modular kitchen",
        "Gas pipeline",
        "Electrical fixtures",
        "Sanitary fixtures",
        "Security system",
        "Intercom",
        "Air-conditioning",
      ],
    },
  ];
  const [amenities, setAmenities] = useState({});
  function toggleAmenity(item, val) {
    setAmenities((prev) => ({ ...prev, [item]: val }));
  }
  const [accessRoad, setAccessRoad] = useState("");
  const [priceVsNearby, setPriceVsNearby] = useState("");

  // New BRD: Payment schedule — one or more stage-wise schedules,
  // building/unit-group wise, with a remark per stage and total %
  // that must equal exactly 100%.
  const blankStage = () => ({ stage: "", pct: "", remark: "" });
  const [paymentSchedules, setPaymentSchedules] = useState([
    { appliesToTowers: [], stages: [blankStage()] },
  ]);
  function updateStage(schedIdx, stageIdx, field, value) {
    setPaymentSchedules((prev) =>
      prev.map((s, i) =>
        i !== schedIdx
          ? s
          : {
              ...s,
              stages: s.stages.map((st, j) =>
                j === stageIdx ? { ...st, [field]: value } : st
              ),
            }
      )
    );
  }
  function scheduleTotal(sched) {
    return sched.stages.reduce((sum, st) => sum + (parseFloat(st.pct) || 0), 0);
  }

  // Fields the "Select from RERA" import can pre-fill
  const [projectName, setProjectName] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [stageOfConstruction, setStageOfConstruction] = useState("");
  // BRD: "Type of Project" case codes, keyed off land transaction
  // type — this drives which project-document types get
  // prepopulated in the Documents tab further down the wizard.
  const [landTransactionType, setLandTransactionType] = useState("");
  const [landTransactionOther, setLandTransactionOther] = useState("");

  // BRD: document types prepopulated in the Documents step, driven
  // by the case code selected above. Kept as a reasonable per-case
  // default list since the BRD specifies "basis case code selected"
  // without enumerating the exact set per code.
  const CASE_CODE_DOC_TYPES = {
    "Project land allotted by Development authority": [
      "Allotment letter",
      "Layout approval",
      "NOC from allotting authority",
    ],
    "Project land purchased from Landowner": [
      "Sale deed",
      "Title search report",
      "7/12 extract / property card",
    ],
    "Joint development between Landowner and Developer": [
      "Joint development agreement (JDA)",
      "Power of attorney",
      "Landowner NOC",
    ],
    "Self-owned land": ["Title deed", "Property card"],
    "Redevelopment of existing Property": [
      "Redevelopment agreement",
      "Society NOC",
      "Existing building plan",
    ],
    "Slum rehabilitation project": [
      "SRA approval",
      "Slum survey eligibility list",
    ],
    "Any other": [],
  };
  // Document types that apply regardless of case code.
  const COMMON_PROJECT_DOC_TYPES = [
    "RERA certificate",
    "Sanctioned plan",
    "NOC / clearances",
    "Other",
  ];
  const [docSearch, setDocSearch] = useState("");
  const [establishmentCert, setEstablishmentCert] = useState("");
  // Key individuals list — mirrors what's captured during builder
  // KYC, since project-document upload needs an Address proof /
  // Photo ID proof pair per individual with portal access.
  const PROJECT_KEY_INDIVIDUALS = [
    { name: "Parag Mofatraj Munot", role: "Director" },
    { name: "Priya Sharma", role: "Authorized Signatory" },
  ];
  const [keyIndividualDocs, setKeyIndividualDocs] = useState({});
  function setKeyIndividualDoc(name, field, fileName) {
    setKeyIndividualDocs((prev) => ({
      ...prev,
      [name]: { ...prev[name], [field]: fileName },
    }));
  }
  const [projectRemark, setProjectRemark] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [popularLandmark, setPopularLandmark] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // New BRD: Features step — Plot area and Total units need to be
  // re-displayed (read-only) inside the RERA step for context, so
  // these have to be lifted into real state instead of plain
  // uncontrolled inputs.
  const [plotArea, setPlotArea] = useState("");
  const [noOfBuildings, setNoOfBuildings] = useState("");
  const [totalBuiltUpArea, setTotalBuiltUpArea] = useState("");
  const [projectCost, setProjectCost] = useState("");
  const [unitsResidential, setUnitsResidential] = useState("");
  const [unitsCommercial, setUnitsCommercial] = useState("");
  const [unitsBungalows, setUnitsBungalows] = useState("");
  const [unitsToLandowner, setUnitsToLandowner] = useState("");
  const totalUnitsCount =
    (parseInt(unitsResidential, 10) || 0) +
    (parseInt(unitsCommercial, 10) || 0) +
    (parseInt(unitsBungalows, 10) || 0);
  const buildingCount = parseInt(noOfBuildings, 10) || 0;

  // New BRD-accurate RERA data model. Each row is independently
  // Registered / Applied / Not-Applicable (the BRD's three
  // mutually exclusive paths) rather than one flat form that
  // conflated all three. Rows are repeatable per building/phase.
  const blankReraRow = () => ({
    path: "registered", // "registered" | "applied" | "na"
    building: "",
    regNumber: "",
    validFrom: "",
    validTo: "",
    applicationNumber: "",
    applicationDate: "",
    expectedApprovalDate: "",
    remarks: "",
  });
  const [reraRows, setReraRows] = useState([blankReraRow()]);
  const [reraTouched, setReraTouched] = useState({});
  function updateReraRow(idx, field, value) {
    setReraRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );
  }
  function touchReraField(idx, field) {
    setReraTouched((prev) => ({ ...prev, [idx + ":" + field]: true }));
  }
  const reraRowErrors = reraRows.map(validateReraRow);
  const reraDuplicateNumbers = findDuplicateReraNumbers(reraRows);
  const reraAllValid = reraRowErrors.every(
    (e) => Object.keys(e).length === 0
  ) && reraDuplicateNumbers.size === 0;

  // New BRD: Occupation / building completion certificate details,
  // captured as part of the same RERA details step, repeatable
  // per building.
  const [ocReceived, setOcReceived] = useState("No");
  const blankOcRow = () => ({
    ocDate: "",
    ocFloors: "",
    ocAuthority: "",
    ocRemarks: "",
    ocDoc: "",
  });
  const [ocRows, setOcRows] = useState([blankOcRow()]);
  function updateOcRow(idx, field, value) {
    setOcRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );
  }

  // Manager-requested addition, not in the BRD: let the builder pick from
  // their own RERA-registered projects (not yet in this system) instead
  // of typing everything from scratch.
  const reraProjects = [
    { id: "rera1", name: "Sunrise Meadows", reraNo: "P51800012345", city: "Pune", state: "Maharashtra" },
    { id: "rera2", name: "Palm Residency Phase 3", reraNo: "P51900054321", city: "Mumbai", state: "Maharashtra" },
    { id: "rera3", name: "Harbourline Towers", reraNo: "P52000098765", city: "Thane", state: "Maharashtra" },
  ];
  const builderCompanyName = "Safleworks Group";

  function importFromRera(p) {
    if (!p) return;
    setProjectName(p.name);
    setCity(p.city);
    setStateField(p.state);
    setReraRows([
      {
        ...blankReraRow(),
        path: "registered",
        regNumber: p.reraNo,
        remarks: "Imported from RERA authority search.",
      },
    ]);
    setSameAddress(false);
    setActiveSection(0);
  }

  function applyTemplate() {
    if (!template) return;
    setSameAddress(true);
    setBankMode("existing");
    setExistingAcct(template === "Riverside Heights" ? "acc1" : "acc2");
  }

  // Which of the 6 tabs is currently shown. Only that tab's fields are
  // rendered — switching tabs never loses what was already typed
  // elsewhere, since all fields stay in state.
  const [activeSection, setActiveSection] = useState(0);

  // Keep the active tab scrolled into view — otherwise on narrower
  // screens later tabs (like "Review & Submit") can sit past the
  // visible edge of the horizontally-scrolling tab strip with only a
  // thin scrollbar as a hint, easy to miss entirely.
  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const activeBtn = el.querySelector(
      '[data-section-tab="' + activeSection + '"]'
    );
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    }
    setTimeout(updateTabScroll, 300);
  }, [activeSection]);

  // Editing an existing project lead reuses this exact wizard instead
  // of a separate read-only form — this just prefills the same state
  // every field above already uses, once, when the screen opens with
  // a project to edit.
  useEffect(() => {
    if (!editingProject) return;
    const isRiverside = editingProject.n === "Riverside Heights";
    setProjectName(editingProject.n || "");
    setProjectCategory("Residential");
    setStageOfConstruction(
      isRiverside ? "Under construction" : "Ready"
    );
    setProjectRemark("Existing project lead — details loaded for edit.");
    setSameAddress(false);
    setAddressLine1(
      isRiverside
        ? "Plot 14, Bandra Kurla Complex"
        : "Survey No. 212, Baner Road"
    );
    setPopularLandmark(isRiverside ? "Near BKC Metro Station" : "Near Baner IT Park");
    setProjectLocation(editingProject.loc || "");
    setStateField("Maharashtra");
    setCity(editingProject.loc || "");
    setPinCode(isRiverside ? "400051" : "411045");
    setLatitude(isRiverside ? "19.0662" : "18.5590");
    setLongitude(isRiverside ? "72.8697" : "73.7868");
    setPlotArea(isRiverside ? "8500" : "6200");
    setNoOfBuildings(isRiverside ? "4" : "2");
    setTotalBuiltUpArea(isRiverside ? "620000" : "410000");
    setProjectCost(isRiverside ? "185" : "110");
    setUnitsResidential(isRiverside ? "320" : "180");
    setUnitsCommercial(isRiverside ? "12" : "6");
    setUnitsBungalows(isRiverside ? "0" : "8");
    setUnitsToLandowner(isRiverside ? "24" : "10");
    setCfAvailed("no");
    setNeedsFinance("no");
    setReraRows([
      {
        path: "registered",
        building: "Wing A",
        regNumber: isRiverside ? "P51800012345" : "P52100034567",
        validFrom: "2023-04-01",
        validTo: "2027-03-31",
        applicationNumber: "",
        applicationDate: "",
        expectedApprovalDate: "",
        remarks: "Loaded from existing project record.",
      },
    ]);
    setPaymentSchedules([
      {
        // Imported schedule applies project-wide — no specific
        // towers pre-selected; developer can tag towers after import.
        appliesToTowers: [],
        stages: [
          { stage: "On booking", pct: "20", remark: "" },
          { stage: "On plinth completion", pct: "30", remark: "" },
          { stage: "On slab completion", pct: "30", remark: "" },
          { stage: "On possession", pct: "20", remark: "" },
        ],
      },
    ]);
    setBankMode("existing");
    setExistingAcct(isRiverside ? "acc1" : "acc2");
    setActiveSection(0);
  }, [editingProject]);

  // Scans every tab (all of them stay mounted, just hidden via CSS, so
  // this sees fields on tabs the user isn't currently looking at) for
  // anything tagged data-mandatory-label and still empty. Combined
  // with the RERA/Payment-schedule/virtual-account checks that already
  // had their own validation logic.
  function readFieldEmpty(container) {
    const radios = container.querySelectorAll('input[type="radio"]');
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    const fileInput = container.querySelector('input[type="file"]');
    const select = container.querySelector("select");
    const textarea = container.querySelector("textarea");
    const textInput = container.querySelector(
      'input:not([type="radio"]):not([type="checkbox"]):not([type="file"])'
    );
    if (radios.length) return ![...radios].some((r) => r.checked);
    if (checkboxes.length === 1) return !checkboxes[0].checked;
    if (fileInput) return !(fileInput.files && fileInput.files.length);
    if (select) return !select.value;
    if (textarea) return !textarea.value.trim();
    if (textInput) return !textInput.value.trim();
    return false;
  }

  function validateWizard() {
    const problems = [];
    const root = wizardRef.current;
    if (root) {
      const tabEls = root.querySelectorAll("[data-tab-index]");
      tabEls.forEach((tabEl) => {
        const tabIndex = parseInt(
          tabEl.getAttribute("data-tab-index"),
          10
        );
        const tabLabel = tabEl.getAttribute("data-tab-label");
        const fieldEls = tabEl.querySelectorAll(
          "[data-mandatory-label]"
        );
        fieldEls.forEach((fieldEl) => {
          // Only check fields belonging to this exact tab — nested
          // repeat-rows don't have their own data-tab-index, so this
          // naturally still finds them.
          if (fieldEl.closest("[data-tab-index]") !== tabEl) return;
          if (readFieldEmpty(fieldEl)) {
            problems.push({
              tabIndex,
              tabLabel,
              field: fieldEl.getAttribute("data-mandatory-label"),
            });
          }
        });
      });
    }
    if (!reraAllValid) {
      problems.push({
        tabIndex: 4,
        tabLabel: "RERA",
        field:
          "Required RERA fields are incomplete, or a registration number is duplicated",
      });
    }
    if (!paymentSchedules.every((s) => scheduleTotal(s) === 100)) {
      problems.push({
        tabIndex: 6,
        tabLabel: "Payment schedule",
        field: "Each payment schedule must total exactly 100%",
      });
    }
    if (
      useVirtualAccount &&
      (!/^\d{5,6}$/.test(virtualPrefix.trim()) ||
        !virtualSupportDoc ||
        (bankAcctNo && !bankAcctNo.trim().startsWith(virtualPrefix.trim())))
    ) {
      problems.push({
        tabIndex: 7,
        tabLabel: "Bank a/c",
        field:
          "Virtual account needs a 5–6 digit prefix that matches the start of the account number, plus a supporting document",
      });
    }
    return problems;
  }

  function handleSubmitClick() {
    const problems = validateWizard();
    if (problems.length) {
      setSubmitErrors(problems);
      setActiveSection(problems[0].tabIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setSubmitErrors(null);
    onDone();
  }

  return (
    <div>
      <TopBar
        title={editingProject ? "Edit Project Lead" : "Complete Project Lead"}
        sub={
          editingProject
            ? `Update any tab below for ${editingProject.n} — same wizard, your existing details are pre-filled`
            : "Submit details & documents against your assigned lead — one page, one submit"
        }
        onMenuClick={onMenuClick}
      />
      {editingProject && (
        <div className="alert alert-info small mb-3">
          ✏️ You're editing <b>{editingProject.n}</b>'s project lead.
          Existing details are pre-filled across every tab below —
          update whatever's changed and submit.
        </div>
      )}
      {!editingProject && (
        <div className="small text-secondary mb-3">
          As the creator of this project, you'll automatically keep
          access to it once submitted — regardless of your assigned
          role or access scope — until an admin explicitly removes
          that mapping in User Management.
        </div>
      )}
      {!editingProject && (
      <div
        className="kpi-card p-3 mb-3"
        style={{ background: "#eef4fc", border: "1px solid #c8d9f0" }}
      >
        <div className="d-flex align-items-center gap-2 mb-1">
          <span className="badge badge-navy">New</span>
          <span className="fw-semibold small">
            Have a RERA-registered project that isn't in this
            system yet?
          </span>
        </div>
        <p className="text-secondary small mb-3">
          Search {builderCompanyName}'s RERA-registered projects by
          registration number and import one straight into this
          lead — instead of typing everything from scratch.
        </p>
        <RERASearchBox
          builderCompanyName={builderCompanyName}
          unclaimedProjects={reraProjects}
          onImport={importFromRera}
        />
      </div>
      )}

      {!editingProject && (
      <div className="kpi-card p-3 mb-3 bg-light">
        <div className="row g-2 align-items-end">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold mb-1">
              Same builder as an existing project? Reuse its details
            </label>
            <select
              className="form-select form-select-sm"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            >
              <option value="">Don't reuse — start blank</option>
              <option>Riverside Heights</option>
              <option>Green Valley Phase 2</option>
            </select>
          </div>
          <div className="col-12 col-md-3">
            <button
              className="btn btn-navy btn-sm w-100"
              disabled={!template}
              onClick={applyTemplate}
            >
              Apply address &amp; bank details
            </button>
          </div>
        </div>
      </div>
      )}
      <div className="section-tabs-wrap mb-3">
        {tabScroll.canLeft && (
          <button
            type="button"
            aria-label="Scroll tabs left"
            className="section-tabs-scroll-btn section-tabs-scroll-btn-left"
            onClick={() => scrollTabsBy(-160)}
          >
            ‹
          </button>
        )}
        <div
          className="section-tabs"
          role="tablist"
          ref={tabsScrollRef}
          onScroll={updateTabScroll}
        >
          {sections.map((s, i) => {
            const tabHasError =
              submitErrors &&
              submitErrors.some((p) => p.tabIndex === i);
            const isReview = i === REVIEW_TAB_INDEX;
            return (
              <button
                key={i}
                type="button"
                role="tab"
                data-section-tab={i}
                aria-selected={activeSection === i}
                className={
                  "section-tab" +
                  (activeSection === i ? " active" : "") +
                  (isReview ? " section-tab-review" : "")
                }
                onClick={() => setActiveSection(i)}
                style={
                  tabHasError
                    ? { boxShadow: "inset 0 -2px 0 var(--danger, #dc3545)" }
                    : undefined
                }
              >
                <span className="section-tab-num">{isReview ? "✓" : i + 1}</span>
                <span className="section-tab-label">{s}</span>
                {tabHasError && (
                  <span
                    className="ms-1"
                    style={{ color: "#dc3545", fontWeight: "bold" }}
                    title="Missing required fields on this tab"
                  >
                    ●
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {tabScroll.canRight && (
          <button
            type="button"
            aria-label="Scroll tabs right — Review & Submit"
            className="section-tabs-scroll-btn section-tabs-scroll-btn-right"
            onClick={() => scrollTabsBy(160)}
          >
            ›
          </button>
        )}
      </div>

      {submitErrors && submitErrors.length > 0 && (
        <div
          className="alert alert-danger mb-3"
          role="alert"
          style={{ borderLeft: "4px solid #dc3545" }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <div className="fw-semibold mb-2">
              Please fill in {submitErrors.length} required{" "}
              {submitErrors.length === 1 ? "field" : "fields"} before
              submitting:
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Dismiss"
              onClick={() => setSubmitErrors(null)}
            ></button>
          </div>
          {Object.entries(
            submitErrors.reduce((groups, p) => {
              (groups[p.tabLabel] = groups[p.tabLabel] || []).push(p);
              return groups;
            }, {})
          ).map(([tabLabel, items]) => (
            <div key={tabLabel} className="mb-2">
              <button
                type="button"
                className="btn btn-link btn-sm p-0 fw-semibold text-danger text-decoration-underline"
                onClick={() =>
                  setActiveSection(items[0].tabIndex)
                }
              >
                {tabLabel} tab
              </button>
              <ul className="mb-0 small">
                {items.map((p, idx) => (
                  <li key={idx}>{p.field}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <FormCard>
        <div ref={wizardRef}>
        <div
          data-tab-index={0}
          data-tab-label="Project details"
          style={{ display: activeSection === 0 ? "block" : "none" }}
        >
        <h6 className="mb-3">
          1. Project details
        </h6>
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6" data-mandatory-label="Project name">
            <label className="form-label small fw-semibold">
              Project name *
            </label>
            <input
              className="form-control"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Project No.
            </label>
            <input
              className="form-control"
              disabled
              value={
                editingProject && editingProject.status === "Approved"
                  ? editingProject.projNo
                  : ""
              }
              placeholder={
                editingProject && editingProject.status === "Approved"
                  ? ""
                  : "Assigned by PAMS once this project is approved"
              }
            />
            <div className="form-text">
              Not entered here — PAMS generates this automatically
              once the project lead is fully approved.
            </div>
          </div>
          <div className="col-12 col-md-6" data-mandatory-label="Project category">
            <label className="form-label small fw-semibold">
              Project category *
            </label>
            <select
              className="form-select"
              value={projectCategory}
              onChange={(e) => setProjectCategory(e.target.value)}
            >
              <option value="">Select…</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Residential cum Commercial</option>
            </select>
          </div>
          <div className="col-12 col-md-6" data-mandatory-label="Case code (land transaction type)">
            <label className="form-label small fw-semibold">
              Case code (land transaction type) *
            </label>
            <select
              className="form-select"
              value={landTransactionType}
              onChange={(e) => setLandTransactionType(e.target.value)}
            >
              <option value="">Select…</option>
              <option>Project land allotted by Development authority</option>
              <option>Project land purchased from Landowner</option>
              <option>Joint development between Landowner and Developer</option>
              <option>Self-owned land</option>
              <option>Redevelopment of existing Property</option>
              <option>Slum rehabilitation project</option>
              <option>Any other</option>
            </select>
            <div className="form-text">
              Drives which project document types are prepopulated in
              the Documents step.
            </div>
            {landTransactionType === "Any other" && (
              <input
                className="form-control mt-2"
                placeholder="Please specify"
                value={landTransactionOther}
                onChange={(e) => setLandTransactionOther(e.target.value)}
              />
            )}
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Project branch
            </label>
            <input className="form-control" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Project location
            </label>
            <input className="form-control" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Project type
            </label>
            <select className="form-select">
              <option>Builder / Society</option>
              <option>Landowner</option>
              <option>Joint Development</option>
            </select>
          </div>
          <div className="col-12 col-md-4" data-mandatory-label="Stage of construction">
            <label className="form-label small fw-semibold">
              Stage of construction *
            </label>
            <select
              className="form-select"
              value={stageOfConstruction}
              onChange={(e) => setStageOfConstruction(e.target.value)}
            >
              <option value="">Select…</option>
              <option>Ready</option>
              <option>Under construction</option>
            </select>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Project launch date
            </label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Work commencement date
            </label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Expected completion date
            </label>
            <input type="date" className="form-control" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Developer name
            </label>
            <input className="form-control" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Website
            </label>
            <input className="form-control" />
          </div>
          <div className="col-12" data-mandatory-label="Remark">
            <label className="form-label small fw-semibold">
              Remark *
            </label>
            <textarea
              className="form-control"
              rows="2"
              value={projectRemark}
              onChange={(e) => setProjectRemark(e.target.value)}
            ></textarea>
          </div>
        </div>
        </div>

        <div
          data-tab-index={1}
          data-tab-label="Address"
          style={{ display: activeSection === 1 ? "block" : "none" }}
        >
        <h6 className="mb-3 pt-2">
          2. Address
        </h6>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="sameaddr"
            checked={sameAddress}
            onChange={(e) => setSameAddress(e.target.checked)}
          />
          <label className="form-check-label small" htmlFor="sameaddr">
            Same as builder's registered office address (Safleworks Group,
            Mumbai)
          </label>
        </div>
        {sameAddress ? (
          <div className="repeat-row p-3 mb-4 small text-secondary">
            Prefilled: 4th Floor, Safleworks House, Bandra Kurla Complex,
            Mumbai, Maharashtra — 400051.{" "}
            <a href="#" onClick={() => setSameAddress(false)}>
              Edit manually instead
            </a>
          </div>
        ) : (
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                S. No. / CTS No.
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Plot No.
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Street
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-6" data-mandatory-label="Address line 1">
              <label className="form-label small fw-semibold">
                Address line 1 *
              </label>
              <input
                className="form-control"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Address line 2
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Address line 3
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Address line 4
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Address line 5
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-4" data-mandatory-label="Popular landmark">
              <label className="form-label small fw-semibold">
                Popular landmark *
              </label>
              <input
                className="form-control"
                value={popularLandmark}
                onChange={(e) => setPopularLandmark(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4" data-mandatory-label="Location">
              <label className="form-label small fw-semibold">
                Location *
              </label>
              <input
                className="form-control"
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4" data-mandatory-label="State">
              <label className="form-label small fw-semibold">
                State *
              </label>
              <input
                className="form-control"
                value={stateField}
                onChange={(e) => setStateField(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4" data-mandatory-label="City">
              <label className="form-label small fw-semibold">
                City *
              </label>
              <input
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4" data-mandatory-label="Pin code">
              <label className="form-label small fw-semibold">
                Pin code *
              </label>
              <input
                className="form-control"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4" data-mandatory-label="Latitude">
              <label className="form-label small fw-semibold">
                Latitude *
              </label>
              <input
                className="form-control"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4" data-mandatory-label="Longitude">
              <label className="form-label small fw-semibold">
                Longitude *
              </label>
              <input
                className="form-control"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
          </div>
        )}
        </div>

        <div
          data-tab-index={2}
          data-tab-label="Features"
          style={{ display: activeSection === 2 ? "block" : "none" }}
        >
        <h6 className="mb-3 pt-2">
          3. Features
        </h6>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-3" data-mandatory-label="Plot area (sqmt)">
            <label className="form-label small fw-semibold">
              Plot area (sqmt) *
            </label>
            <input
              className="form-control"
              value={plotArea}
              onChange={(e) => setPlotArea(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3" data-mandatory-label="No. of buildings">
            <label className="form-label small fw-semibold">
              No. of buildings *
            </label>
            <input
              className="form-control"
              type="number"
              value={noOfBuildings}
              onChange={(e) => setNoOfBuildings(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label small fw-semibold">
              Total built-up area
            </label>
            <input
              className="form-control"
              value={totalBuiltUpArea}
              onChange={(e) => setTotalBuiltUpArea(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label small fw-semibold">
              Project cost (Cr.)
            </label>
            <input
              className="form-control"
              value={projectCost}
              onChange={(e) => setProjectCost(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label small fw-semibold mb-1 d-block">
              Total number of units
            </label>
            <div className="row g-2">
              <div className="col-4">
                <label className="form-label small">Residential</label>
                <input
                  className="form-control form-control-sm"
                  type="number"
                  value={unitsResidential}
                  onChange={(e) => setUnitsResidential(e.target.value)}
                />
              </div>
              <div className="col-4">
                <label className="form-label small">Commercial</label>
                <input
                  className="form-control form-control-sm"
                  type="number"
                  value={unitsCommercial}
                  onChange={(e) => setUnitsCommercial(e.target.value)}
                />
              </div>
              <div className="col-4">
                <label className="form-label small">Bungalows</label>
                <input
                  className="form-control form-control-sm"
                  type="number"
                  value={unitsBungalows}
                  onChange={(e) => setUnitsBungalows(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Plan approval authority name
            </label>
            <input className="form-control" />
          </div>
          <div className="col-12 col-md-3" data-mandatory-label="Units allotted to landowner / development authority">
            <label className="form-label small fw-semibold">
              Units allotted to landowner / development authority (no.) *
            </label>
            <input
              className="form-control"
              value={unitsToLandowner}
              onChange={(e) => setUnitsToLandowner(e.target.value)}
            />
          </div>
          <div className="col-12">
            <label className="form-label small fw-semibold">
              Details of flats allotted to landowners / development
              authority
            </label>
            <input className="form-control" />
          </div>
        </div>

        <div className="repeat-row p-3 mb-4">
          <div className="fw-semibold small mb-2">
            Construction finance details
          </div>
          <div className="row g-3">
            <div className="col-12 col-md-6" data-mandatory-label="Project construction finance availed">
              <label className="form-label small fw-semibold">
                Project construction finance availed *
              </label>
              <div className="mt-1">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cfavailed"
                    checked={cfAvailed === "yes"}
                    onChange={() => setCfAvailed("yes")}
                  />
                  <label className="form-check-label small">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cfavailed"
                    checked={cfAvailed === "no"}
                    onChange={() => setCfAvailed("no")}
                  />
                  <label className="form-check-label small">No</label>
                </div>
              </div>
            </div>

            {cfAvailed === "yes" && (
              <>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Name of the financing institution
                  </label>
                  <input
                    className="form-control"
                    value={cfLender}
                    onChange={(e) => setCfLender(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Amount of CF (Rs. in crs){" "}
                    <span className="text-secondary fw-normal">
                      — non-mandatory
                    </span>
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    value={cfAmount}
                    onChange={(e) => setCfAmount(e.target.value)}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Upload supporting documentation{" "}
                    <span className="text-secondary fw-normal">
                      (if any)
                    </span>
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setCfSupportDoc(e.target.files?.[0]?.name || "")
                    }
                  />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    CF Loan a/c no.{" "}
                    <span className="text-secondary fw-normal">
                      (if CF is from HDFC Bank)
                    </span>
                  </label>
                  <input
                    className="form-control"
                    value={cfHdfcLoanAc}
                    onChange={(e) => setCfHdfcLoanAc(e.target.value)}
                  />
                </div>
              </>
            )}

            {cfAvailed === "no" && (
              <>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Any requirement for construction finance?
                  </label>
                  <div className="mt-1">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="needsfinance"
                        checked={needsFinance === "yes"}
                        onChange={() => setNeedsFinance("yes")}
                      />
                      <label className="form-check-label small">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="needsfinance"
                        checked={needsFinance === "no"}
                        onChange={() => setNeedsFinance("no")}
                      />
                      <label className="form-check-label small">
                        No
                      </label>
                    </div>
                  </div>
                </div>

                {needsFinance === "yes" && (
                  <>
                    <div className="col-12">
                      <div className="small text-secondary">
                        This will be pushed as a construction finance
                        lead to the Business Development Head of the
                        respective branch (with CC to BBH, RBH) for
                        review.
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">
                        Project cost
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        value={cfNeedProjectCost}
                        onChange={(e) =>
                          setCfNeedProjectCost(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label small fw-semibold">
                        Approx. CF loan amount required
                      </label>
                      <input
                        className="form-control"
                        type="number"
                        value={cfNeedAmount}
                        onChange={(e) =>
                          setCfNeedAmount(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        Contact person name
                      </label>
                      <input
                        className="form-control"
                        value={cfNeedContactName}
                        onChange={(e) =>
                          setCfNeedContactName(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        Mobile number
                      </label>
                      <input
                        className="form-control"
                        value={cfNeedMobile}
                        onChange={(e) =>
                          setCfNeedMobile(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label small fw-semibold">
                        Email address
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        value={cfNeedEmail}
                        onChange={(e) =>
                          setCfNeedEmail(e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        </div>

        <div
          data-tab-index={3}
          data-tab-label="Pricing"
          style={{ display: activeSection === 3 ? "block" : "none" }}
        >
        <h6 className="mb-3 pt-2">4. Pricing</h6>
        <p className="text-secondary small">
          Other charges use master-based dropdown values. Use "+ Add
          charge" to add as many as apply for each property type.
        </p>

        {[
          { key: "res", title: "Residential property", state: resPricing, setState: setResPricing, showFloorRise: true },
          { key: "com", title: "Commercial property", state: comPricing, setState: setComPricing, showFloorRise: true },
          { key: "plot", title: "Plots", state: plotPricing, setState: setPlotPricing, showFloorRise: false },
        ].map(({ key, title, state, setState, showFloorRise }) => (
          <div className="repeat-row p-3 mb-3" key={key}>
            <div className="fw-semibold small mb-2">{title}</div>
            <div className="row g-2 mb-3">
              <div className="col-12 col-md-3">
                <label className="form-label small">Rate/sqft</label>
                <input
                  className="form-control form-control-sm"
                  type="number"
                  value={state.rate}
                  onChange={(e) => setState({ ...state, rate: e.target.value })}
                />
              </div>
              {showFloorRise && (
                <div className="col-12 col-md-3">
                  <label className="form-label small">Floor rise</label>
                  <input
                    className="form-control form-control-sm"
                    type="number"
                    value={state.floorRise}
                    onChange={(e) => setState({ ...state, floorRise: e.target.value })}
                  />
                </div>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="small fw-semibold">Other charges (if any)</span>
              <button
                type="button"
                className="btn btn-outline-navy btn-sm"
                onClick={() =>
                  setState({ ...state, charges: [...state.charges, blankCharge()] })
                }
              >
                + Add charge
              </button>
            </div>
            {state.charges.map((c, i) => (
              <div className="row g-2 mb-2" key={i}>
                <div className="col-12 col-md-4">
                  <select
                    className="form-select form-select-sm"
                    value={c.type}
                    onChange={(e) => {
                      const charges = state.charges.map((ch, idx) =>
                        idx === i ? { ...ch, type: e.target.value } : ch
                      );
                      setState({ ...state, charges });
                    }}
                  >
                    {OTHER_CHARGE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <input
                    className="form-control form-control-sm"
                    placeholder="Field name (user input)"
                    value={c.label}
                    onChange={(e) => {
                      const charges = state.charges.map((ch, idx) =>
                        idx === i ? { ...ch, label: e.target.value } : ch
                      );
                      setState({ ...state, charges });
                    }}
                  />
                </div>
                <div className="col-10 col-md-3">
                  <input
                    className="form-control form-control-sm"
                    type="number"
                    placeholder="Amount"
                    value={c.amount}
                    onChange={(e) => {
                      const charges = state.charges.map((ch, idx) =>
                        idx === i ? { ...ch, amount: e.target.value } : ch
                      );
                      setState({ ...state, charges });
                    }}
                  />
                </div>
                {state.charges.length > 1 && (
                  <div className="col-2 col-md-1">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() =>
                        setState({
                          ...state,
                          charges: state.charges.filter((_, idx) => idx !== i),
                        })
                      }
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        </div>

        <div
          data-tab-index={4}
          data-tab-label="RERA"
          style={{ display: activeSection === 4 ? "block" : "none" }}
        >
        <h6 className="mb-3 pt-2">
          5. RERA details
        </h6>

        {/* BRD: Plot area & total units re-displayed here for context
            — plot area is editable (mirrors Features), total units is
            read-only, sourced from the Features step. */}
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Plot area (sqmt)
            </label>
            <input
              className="form-control"
              value={plotArea}
              onChange={(e) => setPlotArea(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-8">
            <label className="form-label small fw-semibold mb-1 d-block">
              Total units (from project details)
            </label>
            <div className="repeat-row p-2 small text-secondary">
              {totalUnitsCount > 0
                ? `${totalUnitsCount} total — Residential ${unitsResidential || 0}, Commercial ${unitsCommercial || 0}, Bungalows ${unitsBungalows || 0}`
                : "Not entered yet — update in the Features step."}
            </div>
          </div>
        </div>

        <p className="text-secondary small mb-2">
          Each row below covers one building/phase and is independently
          Registered, Applied (application submitted, registration
          pending), or Not applicable — matching how RERA is actually
          filed per building. Don't add a new row to extend an existing
          certificate's validity; use <b>RERA Detail Update</b> after
          the project is created for that.
        </p>

        {reraRows.map((row, i) => {
          const errs = reraRowErrors[i];
          const isTouched = (field) => reraTouched[i + ":" + field];
          const showErr = (field) => isTouched(field) && errs[field];
          const isDup =
            row.path === "registered" &&
            row.regNumber &&
            reraDuplicateNumbers.has(row.regNumber.trim().toUpperCase());
          const formatWarning =
            row.path === "registered"
              ? reraNumberFormatWarning(row.regNumber, stateField)
              : "";
          return (
            <div className="repeat-row p-3 mb-3" key={i}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-semibold small">Row {i + 1}</div>
                {reraRows.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setReraRows((prev) => prev.filter((_, j) => j !== i))
                    }
                  >
                    Remove row
                  </button>
                )}
              </div>
              <div className="row g-3">
                {buildingCount > 1 && (
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      Building / wing
                    </label>
                    <input
                      className="form-control"
                      placeholder="e.g. Wing A"
                      value={row.building}
                      onChange={(e) =>
                        updateReraRow(i, "building", e.target.value)
                      }
                    />
                  </div>
                )}
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    RERA status *
                  </label>
                  <select
                    className="form-select"
                    value={row.path}
                    onChange={(e) =>
                      updateReraRow(i, "path", e.target.value)
                    }
                  >
                    <option value="registered">
                      Registered — certificate issued
                    </option>
                    <option value="applied">
                      Application submitted, not yet registered
                    </option>
                    <option value="na">Not applicable</option>
                  </select>
                </div>
              </div>

              {row.path === "registered" && (
                <div className="row g-3 mt-1">
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      RERA registration number *
                    </label>
                    <input
                      className={
                        "form-control" +
                        (showErr("regNumber") || isDup
                          ? " is-invalid"
                          : "")
                      }
                      value={row.regNumber}
                      onChange={(e) =>
                        updateReraRow(i, "regNumber", e.target.value)
                      }
                      onBlur={() => touchReraField(i, "regNumber")}
                    />
                    {showErr("regNumber") && (
                      <div className="invalid-feedback">
                        {errs.regNumber}
                      </div>
                    )}
                    {!showErr("regNumber") && isDup && (
                      <div className="invalid-feedback d-block">
                        This registration number is already used in
                        another row — different buildings need
                        different numbers. If this is an extension of
                        an existing certificate, use RERA Detail Update
                        after the project is created instead.
                      </div>
                    )}
                    {!showErr("regNumber") && !isDup && formatWarning && (
                      <div className="form-text text-warning">
                        {formatWarning}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      Valid from date *
                    </label>
                    <input
                      type="date"
                      className={
                        "form-control" +
                        (showErr("validFrom") ? " is-invalid" : "")
                      }
                      value={row.validFrom}
                      onChange={(e) =>
                        updateReraRow(i, "validFrom", e.target.value)
                      }
                      onBlur={() => touchReraField(i, "validFrom")}
                    />
                    {showErr("validFrom") && (
                      <div className="invalid-feedback">
                        {errs.validFrom}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      Valid to date *
                    </label>
                    <input
                      type="date"
                      className={
                        "form-control" +
                        (showErr("validTo") ? " is-invalid" : "")
                      }
                      value={row.validTo}
                      onChange={(e) =>
                        updateReraRow(i, "validTo", e.target.value)
                      }
                      onBlur={() => touchReraField(i, "validTo")}
                    />
                    {showErr("validTo") && (
                      <div className="invalid-feedback">
                        {errs.validTo}
                      </div>
                    )}
                    {!showErr("validTo") &&
                      row.validTo &&
                      row.validTo < todayIso() && (
                        <div className="form-text text-warning">
                          This certificate's validity has already
                          lapsed — file for extension via RERA Detail
                          Update once the project is created.
                        </div>
                      )}
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Remarks (applicable for buildings) *
                    </label>
                    <input
                      className={
                        "form-control" +
                        (showErr("remarks") ? " is-invalid" : "")
                      }
                      value={row.remarks}
                      onChange={(e) =>
                        updateReraRow(i, "remarks", e.target.value)
                      }
                      onBlur={() => touchReraField(i, "remarks")}
                    />
                    {showErr("remarks") && (
                      <div className="invalid-feedback">
                        {errs.remarks}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {row.path === "applied" && (
                <div className="row g-3 mt-1">
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      RERA application number *
                    </label>
                    <input
                      className={
                        "form-control" +
                        (showErr("applicationNumber")
                          ? " is-invalid"
                          : "")
                      }
                      value={row.applicationNumber}
                      onChange={(e) =>
                        updateReraRow(
                          i,
                          "applicationNumber",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        touchReraField(i, "applicationNumber")
                      }
                    />
                    {showErr("applicationNumber") && (
                      <div className="invalid-feedback">
                        {errs.applicationNumber}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      RERA application date *
                    </label>
                    <input
                      type="date"
                      className={
                        "form-control" +
                        (showErr("applicationDate") ? " is-invalid" : "")
                      }
                      value={row.applicationDate}
                      onChange={(e) =>
                        updateReraRow(
                          i,
                          "applicationDate",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        touchReraField(i, "applicationDate")
                      }
                    />
                    {showErr("applicationDate") && (
                      <div className="invalid-feedback">
                        {errs.applicationDate}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="form-label small fw-semibold">
                      Expected RERA approval date *
                    </label>
                    <input
                      type="date"
                      className={
                        "form-control" +
                        (showErr("expectedApprovalDate")
                          ? " is-invalid"
                          : "")
                      }
                      value={row.expectedApprovalDate}
                      onChange={(e) =>
                        updateReraRow(
                          i,
                          "expectedApprovalDate",
                          e.target.value
                        )
                      }
                      onBlur={() =>
                        touchReraField(i, "expectedApprovalDate")
                      }
                    />
                    {showErr("expectedApprovalDate") && (
                      <div className="invalid-feedback">
                        {errs.expectedApprovalDate}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Remarks
                    </label>
                    <input
                      className="form-control"
                      value={row.remarks}
                      onChange={(e) =>
                        updateReraRow(i, "remarks", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              {row.path === "na" && (
                <div className="row g-3 mt-1">
                  <div className="col-12">
                    <label className="form-label small fw-semibold">
                      Remarks — reason RERA is not applicable *
                    </label>
                    <input
                      className={
                        "form-control" +
                        (showErr("remarks") ? " is-invalid" : "")
                      }
                      value={row.remarks}
                      onChange={(e) =>
                        updateReraRow(i, "remarks", e.target.value)
                      }
                      onBlur={() => touchReraField(i, "remarks")}
                    />
                    {showErr("remarks") && (
                      <div className="invalid-feedback">
                        {errs.remarks}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <button
          type="button"
          className="btn btn-outline-navy btn-sm"
          onClick={() =>
            setReraRows((prev) => [...prev, blankReraRow()])
          }
        >
          + Add another RERA row
        </button>
        <div className="form-text mb-4">
          One row per building/phase — each registered row needs its
          own registration number.
        </div>

        <h6 className="mb-3 pt-2">
          Occupation certificate / building completion certificate
        </h6>
        <div className="row g-3 mb-2">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Building completion certificate received? *
            </label>
            <select
              className="form-select"
              value={ocReceived}
              onChange={(e) => setOcReceived(e.target.value)}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>
        </div>
        {ocReceived === "Yes" &&
          ocRows.map((row, i) => (
            <div className="repeat-row p-3 mb-3" key={i}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="fw-semibold small">OC row {i + 1}</div>
                {ocRows.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setOcRows((prev) => prev.filter((_, j) => j !== i))
                    }
                  >
                    Remove row
                  </button>
                )}
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    OC date
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={row.ocDate}
                    onChange={(e) =>
                      updateOcRow(i, "ocDate", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    OC received till floors
                  </label>
                  <input
                    className="form-control"
                    placeholder="e.g. Wing A, Floors 1-12"
                    value={row.ocFloors}
                    onChange={(e) =>
                      updateOcRow(i, "ocFloors", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    OC issuing authority
                  </label>
                  <input
                    className="form-control"
                    placeholder="Development authority name"
                    value={row.ocAuthority}
                    onChange={(e) =>
                      updateOcRow(i, "ocAuthority", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-8">
                  <label className="form-label small fw-semibold">
                    OC remarks
                  </label>
                  <input
                    className="form-control"
                    value={row.ocRemarks}
                    onChange={(e) =>
                      updateOcRow(i, "ocRemarks", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small fw-semibold">
                    Attach copy of occupation certificate
                  </label>
                  <input type="file" className="form-control" />
                </div>
              </div>
            </div>
          ))}
        {ocReceived === "Yes" && (
          <button
            type="button"
            className="btn btn-outline-navy btn-sm mb-4"
            onClick={() =>
              setOcRows((prev) => [...prev, blankOcRow()])
            }
          >
            + Add another OC row
          </button>
        )}

        <div className="kpi-card p-3 mb-2 bg-light small text-secondary">
          Once the project is created or approved, use{" "}
          <b>RERA Detail Update</b> or <b>OC Detail Update</b> from the
          sidebar any time there is a change — no need to redo this
          wizard. Documents submitted there are routed to the HDFC
          coordinator's dashboard by type (Legal / Tech / BD).
        </div>
        </div>

        <div
          data-tab-index={5}
          data-tab-label="Amenities"
          style={{ display: activeSection === 5 ? "block" : "none" }}
        >
        <h6 className="mb-3 pt-2">6. Amenities &amp; proximity details</h6>
        <p className="text-secondary small">
          Once submitted, this data is populated in the technical
          section in PAMS if the project is already created.
        </p>

        {AMENITY_GROUPS.map((group) => (
          <div className="repeat-row p-3 mb-3" key={group.label}>
            <div className="fw-semibold small mb-2">{group.label}</div>
            <div className="row g-2">
              {group.items.map((item) => (
                <div className="col-12 col-md-6" key={item}>
                  <div className="d-flex justify-content-between align-items-center py-1">
                    <span className="small">{item}</span>
                    <div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={"amn-" + item}
                          checked={amenities[item] === "Y"}
                          onChange={() => toggleAmenity(item, "Y")}
                        />
                        <label className="form-check-label small">Y</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={"amn-" + item}
                          checked={amenities[item] === "N"}
                          onChange={() => toggleAmenity(item, "N")}
                        />
                        <label className="form-check-label small">N</label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Access of the project
            </label>
            <select
              className="form-select"
              value={accessRoad}
              onChange={(e) => setAccessRoad(e.target.value)}
            >
              <option value="">Select…</option>
              <option>&lt; 30 feet wide road</option>
              <option>30–60 feet wide road</option>
              <option>&gt; 60 feet wide road</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Price of the property w.r.t nearest developed location
            </label>
            <select
              className="form-select"
              value={priceVsNearby}
              onChange={(e) => setPriceVsNearby(e.target.value)}
            >
              <option value="">Select…</option>
              <option>100%</option>
              <option>80%</option>
              <option>60%</option>
              <option>40%</option>
              <option>20%</option>
            </select>
          </div>
        </div>
        </div>

        <div
          data-tab-index={6}
          data-tab-label="Payment schedule"
          style={{ display: activeSection === 6 ? "block" : "none" }}
        >
        <h6 className="mb-3 pt-2">7. Payment schedule</h6>
        <p className="text-secondary small">
          Submit the payment schedule applicable for the buildings /
          units in the project. Each schedule can be tagged to one or
          more towers, and a tower can have more than one schedule
          applied to it — add as many schedules as needed.
        </p>
        {paymentSchedules.map((sched, si) => {
          const total = scheduleTotal(sched);
          const towerOptions = buildingsForProject(projectName);
          return (
            <div className="repeat-row p-3 mb-3" key={si}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="flex-fill me-3">
                  <label className="form-label small fw-semibold mb-1">
                    Applies to tower(s)
                  </label>
                  <div className="d-flex flex-wrap gap-3">
                    {towerOptions.map((t) => (
                      <div className="form-check" key={t}>
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={"sched" + si + "-" + t}
                          checked={sched.appliesToTowers.includes(t)}
                          onChange={() => {
                            setPaymentSchedules((prev) =>
                              prev.map((s, i) =>
                                i !== si
                                  ? s
                                  : {
                                      ...s,
                                      appliesToTowers: s.appliesToTowers.includes(t)
                                        ? s.appliesToTowers.filter((x) => x !== t)
                                        : [...s.appliesToTowers, t],
                                    },
                              ),
                            );
                          }}
                        />
                        <label
                          className="form-check-label small"
                          htmlFor={"sched" + si + "-" + t}
                        >
                          {t}
                        </label>
                      </div>
                    ))}
                  </div>
                  {sched.appliesToTowers.length === 0 && (
                    <div className="small text-secondary mt-1">
                      No towers selected — applies project-wide by
                      default.
                    </div>
                  )}
                </div>
                {paymentSchedules.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setPaymentSchedules((prev) => prev.filter((_, i) => i !== si))
                    }
                  >
                    Remove schedule
                  </button>
                )}
              </div>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-2">
                  <thead>
                    <tr className="text-secondary small">
                      <th>Stage of construction</th>
                      <th style={{ width: 110 }}>% payable</th>
                      <th>Intermediate stage remarks</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sched.stages.map((st, sti) => (
                      <tr key={sti}>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            placeholder="e.g. On booking, At RCC 5th slab"
                            value={st.stage}
                            onChange={(e) => updateStage(si, sti, "stage", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            type="number"
                            value={st.pct}
                            onChange={(e) => updateStage(si, sti, "pct", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            className="form-control form-control-sm"
                            placeholder="e.g. BW up to 2 floors over, Plaster up to 1 floor over"
                            value={st.remark}
                            onChange={(e) => updateStage(si, sti, "remark", e.target.value)}
                          />
                        </td>
                        <td>
                          {sched.stages.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() =>
                                setPaymentSchedules((prev) =>
                                  prev.map((s, i) =>
                                    i !== si
                                      ? s
                                      : { ...s, stages: s.stages.filter((_, j) => j !== sti) }
                                  )
                                )
                              }
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                type="button"
                className="btn btn-outline-navy btn-sm"
                onClick={() =>
                  setPaymentSchedules((prev) =>
                    prev.map((s, i) =>
                      i !== si ? s : { ...s, stages: [...s.stages, blankStage()] }
                    )
                  )
                }
              >
                + Add stage
              </button>
              <div
                className={
                  "small fw-semibold mt-2 " +
                  (total === 100 ? "text-success" : "text-danger")
                }
              >
                Total: {total}% {total !== 100 && "(must equal exactly 100%)"}
              </div>
            </div>
          );
        })}
        <button
          type="button"
          className="btn btn-outline-navy btn-sm"
          onClick={() =>
            setPaymentSchedules((prev) => [
              ...prev,
              { appliesToTowers: [], stages: [blankStage()] },
            ])
          }
        >
          + Add another schedule
        </button>
        </div>

        <div
          data-tab-index={7}
          data-tab-label="Bank a/c"
          style={{ display: activeSection === 7 ? "block" : "none" }}
        >
        <h6 className="mb-3 pt-2">
          8. Builder's bank a/c
        </h6>
        <div className="d-flex gap-3 mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="bankmode"
              id="bnew"
              checked={bankMode === "new"}
              onChange={() => setBankMode("new")}
            />
            <label className="form-check-label small" htmlFor="bnew">
              Add new bank account{" "}
              <span className="badge badge-navy">Preferred</span>
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="bankmode"
              id="bexisting"
              checked={bankMode === "existing"}
              onChange={() => setBankMode("existing")}
            />
            <label className="form-check-label small" htmlFor="bexisting">
              Use an existing account from another project
            </label>
          </div>
        </div>
        {bankMode === "existing" ? (
          <div className="mb-4">
            <select
              className="form-select mb-2"
              value={existingAcct}
              onChange={(e) => setExistingAcct(e.target.value)}
            >
              {savedAccounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </select>
            {(() => {
              const a = savedAccounts.find((x) => x.id === existingAcct);
              return (
                <div className="repeat-row p-3 small">
                  <div>
                    <b>Payee:</b> {a.payee}
                  </div>
                  <div>
                    <b>Bank:</b> {a.bank}
                  </div>
                  <div>
                    <b>Account:</b> {a.acct}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Upload cancelled cheque
              </label>
              <input type="file" className="form-control" />
              <div className="form-text">
                Cancelled cheque / bank passbook copy showing a/c holder
                details
              </div>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Payee name
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Bank name
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Bank account no.
              </label>
              <input
                className="form-control"
                value={bankAcctNo}
                onChange={(e) => setBankAcctNo(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold">
                Account type
              </label>
              <select className="form-select">
                <option>Current</option>
                <option>Savings</option>
                <option>ESCROW</option>
              </select>
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold">
                IFSC code
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold">
                Bank branch
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold">
                Payment for
              </label>
              <input className="form-control" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                RERA collection account
              </label>
              <div className="mt-1">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reracollacct"
                    defaultChecked
                  />
                  <label className="form-check-label small">Yes</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="reracollacct"
                  />
                  <label className="form-check-label small">No</label>
                </div>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label small fw-semibold">
                Type of payment to be disbursed in the account
              </label>
              <div className="form-text mb-2">
                One or multiple selection allowed.
              </div>
              <div className="row g-2">
                {PAYMENT_TYPES.map((t) => (
                  <div className="col-12 col-md-3" key={t}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={"nptype-" + t}
                        checked={paymentTypes.includes(t)}
                        onChange={() => togglePaymentType(t)}
                      />
                      <label
                        className="form-check-label small"
                        htmlFor={"nptype-" + t}
                      >
                        {t}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {paymentTypes.includes("Others") && (
                <input
                  className="form-control form-control-sm mt-2"
                  style={{ maxWidth: 360 }}
                  placeholder="Please specify"
                  value={othersSpecify}
                  onChange={(e) => setOthersSpecify(e.target.value)}
                />
              )}
            </div>
            <div className="col-12">
              <div className="alert alert-info py-2 px-3 small mb-2 d-flex gap-2">
                <span style={{ fontSize: 16, lineHeight: 1 }}>ℹ️</span>
                <div>
                  <strong>What's a virtual account?</strong> A bank
                  issues one virtual account number per unit/customer,
                  but the initial 5–6 digits (the "prefix") are the
                  same across every virtual account for this project.
                  If the account number entered above is one of
                  these, check the box below and provide that shared
                  prefix.
                </div>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="wizard-is-virtual-account"
                  checked={useVirtualAccount}
                  onChange={(e) => setUseVirtualAccount(e.target.checked)}
                />
                <label
                  className="form-check-label small fw-semibold"
                  htmlFor="wizard-is-virtual-account"
                >
                  This account is a Virtual Account
                </label>
              </div>
            </div>
            {useVirtualAccount && (
              <>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Prefix of virtual bank account number *
                  </label>
                  <input
                    className={
                      "form-control" +
                      (virtualPrefix &&
                      !/^\d{5,6}$/.test(virtualPrefix.trim())
                        ? " is-invalid"
                        : "")
                    }
                    placeholder="e.g. 50100"
                    value={virtualPrefix}
                    onChange={(e) => setVirtualPrefix(e.target.value)}
                  />
                  <div className="form-text">
                    5–6 digits, common to all units of this project.
                    The account number entered above must start with
                    this prefix.
                  </div>
                  {virtualPrefix &&
                    !/^\d{5,6}$/.test(virtualPrefix.trim()) && (
                      <div className="invalid-feedback d-block">
                        Prefix must be 5–6 digits.
                      </div>
                    )}
                  {virtualPrefix &&
                    /^\d{5,6}$/.test(virtualPrefix.trim()) &&
                    bankAcctNo &&
                    !bankAcctNo.trim().startsWith(virtualPrefix.trim()) && (
                      <div className="text-danger small mt-1">
                        The account number above doesn't start with
                        this prefix — check both fields.
                      </div>
                    )}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label small fw-semibold">
                    Supporting document justifying the virtual account *
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setVirtualSupportDoc(e.target.files?.[0]?.name || "")
                    }
                  />
                </div>
              </>
            )}
          </div>
        )}
        </div>

        <div
          data-tab-index={8}
          data-tab-label="Documents"
          style={{ display: activeSection === 8 ? "block" : "none" }}
        >
        <h6 className="mb-3 pt-2">
          9. Documents
        </h6>
        <p className="text-secondary small">
          Upload everything now — no separate step needed.
        </p>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="reusekyc"
            defaultChecked
          />
          <label className="form-check-label small" htmlFor="reusekyc">
            Reuse builder KYC documents already on file (PAN, CIN,
            incorporation certificate) — no need to re-upload
          </label>
        </div>

        <div className="mb-2">
          <label className="form-label small fw-semibold">
            Document type
          </label>
          <input
            className="form-control form-control-sm mb-1"
            placeholder="Search document type, or type a new one…"
            value={docSearch}
            onChange={(e) => setDocSearch(e.target.value)}
          />
          <select className="form-select">
            <option value="">
              Select document type…
            </option>
            {(CASE_CODE_DOC_TYPES[landTransactionType] || [])
              .filter((t) =>
                t.toLowerCase().includes(docSearch.toLowerCase()),
              )
              .map((t, i) => (
                <option key={"cc" + i}>{t}</option>
              ))}
            {COMMON_PROJECT_DOC_TYPES.filter((t) =>
              t.toLowerCase().includes(docSearch.toLowerCase()),
            ).map((t, i) => (
              <option key={"common" + i}>{t}</option>
            ))}
          </select>
          <div className="form-text">
            {landTransactionType && landTransactionType !== "Any other"
              ? "List prepopulated for case code: " + landTransactionType + ". "
              : "Select a case code in Project details to prepopulate this list. "}
            If what you need isn't listed, search above or type a new
            document type.
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Label this document{" "}
              <span className="text-secondary fw-normal">
                (optional)
              </span>
            </label>
            <input className="form-control" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Remark</label>
            <input className="form-control" />
          </div>
          <div className="col-12">
            <input type="file" className="form-control" multiple />
            <div className="form-text">
              Up to 1GB per document. Accepted: Word, Excel, PDF, CSV,
              JPEG, PNG, property video (MP4). Add more than one
              document against the same type using the field above,
              or attach another type below.
            </div>
          </div>
        </div>

        <div className="repeat-row p-3 mb-3">
          <div className="fw-semibold small mb-1">
            Company establishment certificate
          </div>
          <div className="small text-secondary mb-2">
            Certificate of incorporation / establishment for the
            builder entity.
          </div>
          <input
            type="file"
            className="form-control"
            onChange={(e) =>
              setEstablishmentCert(e.target.files?.[0]?.name || "")
            }
          />
          {establishmentCert && (
            <div className="small text-secondary mt-1">
              Attached: {establishmentCert}
            </div>
          )}
        </div>

        <div className="repeat-row p-3">
          <div className="fw-semibold small mb-1">
            Builder key individuals — KYC documents
          </div>
          <div className="small text-secondary mb-3">
            Address proof and Photo ID proof for every key individual
            of the developer and every user with developer portal
            access.
          </div>
          {PROJECT_KEY_INDIVIDUALS.map((k, i) => (
            <div
              className="row g-2 align-items-end mb-2 pb-2 border-bottom"
              key={i}
            >
              <div className="col-12 col-md-4">
                <div className="fw-semibold small">{k.name}</div>
                <div className="small text-secondary">{k.role}</div>
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label small">
                  Address proof
                </label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  onChange={(e) =>
                    setKeyIndividualDoc(
                      k.name,
                      "addressProof",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                />
              </div>
              <div className="col-6 col-md-4">
                <label className="form-label small">
                  Photo ID proof
                </label>
                <input
                  type="file"
                  className="form-control form-control-sm"
                  onChange={(e) =>
                    setKeyIndividualDoc(
                      k.name,
                      "photoId",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>
        </div>
        </div>

        <div
          data-tab-index={REVIEW_TAB_INDEX}
          data-tab-label="Review & Submit"
          style={{
            display: activeSection === REVIEW_TAB_INDEX ? "block" : "none",
          }}
        >
        <h6 className="mb-1">10. Review &amp; Submit</h6>
        <p className="text-secondary small mb-3">
          Check every section below before submitting. Use{" "}
          <b>Edit</b> on any card to jump back and make changes —
          nothing is submitted until you press{" "}
          <b>{editingProject ? "Save changes" : "Save &amp; Submit"}</b>{" "}
          at the bottom.
        </p>

        {submitErrors && (
          <div className="alert alert-danger small py-2 mb-3">
            <div className="fw-semibold mb-1">
              {submitErrors.length} field
              {submitErrors.length > 1 ? "s" : ""} still need
              {submitErrors.length > 1 ? "" : "s"} attention:
            </div>
            <ul className="mb-0 ps-3">
              {submitErrors.map((p, i) => (
                <li key={i}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goToSection(p.tabIndex);
                    }}
                  >
                    {p.tabLabel}
                  </a>
                  {" — " + p.field}
                </li>
              ))}
            </ul>
          </div>
        )}

        <ReviewGroup title="1. Project details" tabIndex={0} onEdit={goToSection}>
          <ReviewRow label="Project name" value={projectName} />
          <ReviewRow label="Project category" value={projectCategory} />
          <ReviewRow
            label="Case code (land transaction type)"
            value={
              landTransactionType === "Any other"
                ? landTransactionOther
                  ? "Any other — " + landTransactionOther
                  : "Any other"
                : landTransactionType
            }
          />
          <ReviewRow label="Stage of construction" value={stageOfConstruction} />
          <ReviewRow label="Remark" value={projectRemark} />
        </ReviewGroup>

        <ReviewGroup title="2. Address" tabIndex={1} onEdit={goToSection}>
          {sameAddress ? (
            <ReviewRow
              label="Address"
              value="Same as builder's registered office (Safleworks Group, Mumbai)"
            />
          ) : (
            <>
              <ReviewRow label="Address line 1" value={addressLine1} />
              <ReviewRow label="Popular landmark" value={popularLandmark} />
              <ReviewRow label="Location" value={projectLocation} />
              <ReviewRow label="State" value={stateField} />
              <ReviewRow label="City" value={city} />
              <ReviewRow label="Pin code" value={pinCode} />
              <ReviewRow label="Latitude" value={latitude} />
              <ReviewRow label="Longitude" value={longitude} />
            </>
          )}
        </ReviewGroup>

        <ReviewGroup title="3. Features" tabIndex={2} onEdit={goToSection}>
          <ReviewRow label="Plot area (sqmt)" value={plotArea} />
          <ReviewRow label="No. of buildings" value={noOfBuildings} />
          <ReviewRow label="Total built-up area" value={totalBuiltUpArea} />
          <ReviewRow label="Project cost (Cr.)" value={projectCost} />
          <ReviewRow
            label="Total units (Residential / Commercial / Bungalows)"
            value={
              totalUnitsCount > 0
                ? `${totalUnitsCount} total — ${unitsResidential || 0} / ${unitsCommercial || 0} / ${unitsBungalows || 0}`
                : ""
            }
          />
          <ReviewRow
            label="Units allotted to landowner / development authority"
            value={unitsToLandowner}
          />
          <ReviewRow
            label="Construction finance availed"
            value={
              cfAvailed === "yes" ? "Yes" : cfAvailed === "no" ? "No" : ""
            }
          />
          {cfAvailed === "yes" && (
            <>
              <ReviewRow label="Financing institution" value={cfLender} />
              <ReviewRow label="Amount of CF (Rs. in crs)" value={cfAmount} />
              <ReviewRow label="Supporting documentation" value={cfSupportDoc} />
              <ReviewRow label="CF loan a/c no. (HDFC)" value={cfHdfcLoanAc} />
            </>
          )}
          {cfAvailed === "no" && (
            <>
              <ReviewRow
                label="Requirement for construction finance"
                value={
                  needsFinance === "yes"
                    ? "Yes"
                    : needsFinance === "no"
                    ? "No"
                    : ""
                }
              />
              {needsFinance === "yes" && (
                <>
                  <ReviewRow label="Project cost" value={cfNeedProjectCost} />
                  <ReviewRow
                    label="Approx. CF loan amount required"
                    value={cfNeedAmount}
                  />
                  <ReviewRow label="Contact person name" value={cfNeedContactName} />
                  <ReviewRow label="Mobile number" value={cfNeedMobile} />
                  <ReviewRow label="Email address" value={cfNeedEmail} />
                </>
              )}
            </>
          )}
        </ReviewGroup>

        <ReviewGroup title="4. Pricing" tabIndex={3} onEdit={goToSection}>
          {[
            { title: "Residential property", state: resPricing, showFloorRise: true },
            { title: "Commercial property", state: comPricing, showFloorRise: true },
            { title: "Plots", state: plotPricing, showFloorRise: false },
          ].map(({ title, state, showFloorRise }) => (
            <div key={title} className="mb-2">
              <div className="small fw-semibold mt-2 mb-1">{title}</div>
              <ReviewRow label="Rate/sqft" value={state.rate} />
              {showFloorRise && (
                <ReviewRow label="Floor rise" value={state.floorRise} />
              )}
              {state.charges
                .filter((c) => c.label || c.amount)
                .map((c, i) => (
                  <ReviewRow
                    key={i}
                    label={"Other charge — " + c.type}
                    value={
                      (c.label ? c.label + ": " : "") +
                      (c.amount ? "₹" + c.amount : "")
                    }
                  />
                ))}
            </div>
          ))}
        </ReviewGroup>

        <ReviewGroup title="5. RERA details" tabIndex={4} onEdit={goToSection}>
          {reraRows.map((row, i) => (
            <div key={i} className="mb-2">
              <div className="small fw-semibold mt-2 mb-1">
                Row {i + 1}
                {row.building ? " — " + row.building : ""}
              </div>
              <ReviewRow
                label="RERA status"
                value={
                  row.path === "registered"
                    ? "Registered — certificate issued"
                    : row.path === "applied"
                    ? "Application submitted, not yet registered"
                    : "Not applicable"
                }
              />
              {row.path === "registered" && (
                <>
                  <ReviewRow label="RERA registration number" value={row.regNumber} />
                  <ReviewRow label="Valid from" value={row.validFrom} />
                  <ReviewRow label="Valid to" value={row.validTo} />
                </>
              )}
              {row.path === "applied" && (
                <>
                  <ReviewRow label="Application number" value={row.applicationNumber} />
                  <ReviewRow label="Application date" value={row.applicationDate} />
                  <ReviewRow
                    label="Expected approval date"
                    value={row.expectedApprovalDate}
                  />
                </>
              )}
              {row.remarks && <ReviewRow label="Remarks" value={row.remarks} />}
            </div>
          ))}
          <div className="small fw-semibold mt-2 mb-1">
            Occupation / completion certificate
          </div>
          <ReviewRow label="OC received" value={ocReceived} />
          {ocReceived === "Yes" &&
            ocRows.map((r, i) => (
              <div key={i} className="mb-2">
                <ReviewRow
                  label={"OC row " + (i + 1) + " — date"}
                  value={r.ocDate}
                />
                <ReviewRow label="Floors covered" value={r.ocFloors} />
                <ReviewRow label="Issuing authority" value={r.ocAuthority} />
              </div>
            ))}
        </ReviewGroup>

        <ReviewGroup title="6. Amenities & proximity" tabIndex={5} onEdit={goToSection}>
          {AMENITY_GROUPS.map((group) => (
            <div key={group.label} className="mb-2">
              <div className="small fw-semibold mt-2 mb-1">{group.label}</div>
              {group.items.map((item) => (
                <ReviewRow key={item} label={item} value={amenities[item] || ""} />
              ))}
            </div>
          ))}
          <ReviewRow label="Access of the project" value={accessRoad} />
          <ReviewRow
            label="Price w.r.t. nearest developed location"
            value={priceVsNearby}
          />
        </ReviewGroup>

        <ReviewGroup title="7. Payment schedule" tabIndex={6} onEdit={goToSection}>
          {paymentSchedules.map((sched, si) => (
            <div key={si} className="mb-2">
              <div className="small fw-semibold mt-2 mb-1">
                Schedule {si + 1}
              </div>
              <ReviewRow
                label="Applies to tower(s)"
                value={
                  sched.appliesToTowers.length
                    ? sched.appliesToTowers.join(", ")
                    : "Project-wide (no towers selected)"
                }
              />
              {sched.stages
                .filter((st) => st.stage || st.pct)
                .map((st, sti) => (
                  <ReviewRow
                    key={sti}
                    label={st.stage || "Stage " + (sti + 1)}
                    value={st.pct ? st.pct + "%" : ""}
                  />
                ))}
              <ReviewRow
                label="Schedule total"
                value={scheduleTotal(sched) + "%"}
              />
            </div>
          ))}
        </ReviewGroup>

        <ReviewGroup title="8. Builder's bank a/c" tabIndex={7} onEdit={goToSection}>
          <ReviewRow
            label="Account source"
            value={
              bankMode === "existing"
                ? "Existing account from another project"
                : "New bank account"
            }
          />
          {bankMode === "existing" ? (
            (() => {
              const a = savedAccounts.find((x) => x.id === existingAcct);
              return (
                <>
                  <ReviewRow label="Payee" value={a && a.payee} />
                  <ReviewRow label="Bank" value={a && a.bank} />
                  <ReviewRow label="Account" value={a && a.acct} />
                </>
              );
            })()
          ) : (
            <>
              <ReviewRow
                label="Type of payment to be disbursed"
                value={
                  paymentTypes.length
                    ? paymentTypes
                        .map((t) =>
                          t === "Others" && othersSpecify
                            ? t + " (" + othersSpecify + ")"
                            : t
                        )
                        .join(", ")
                    : ""
                }
              />
              <ReviewRow
                label="Is this a Virtual Account"
                value={useVirtualAccount ? "Yes" : "No"}
              />
              {useVirtualAccount && (
                <>
                  <ReviewRow
                    label="Virtual account prefix"
                    value={virtualPrefix}
                  />
                  <ReviewRow
                    label="Supporting document"
                    value={virtualSupportDoc}
                  />
                </>
              )}
            </>
          )}
        </ReviewGroup>

        <ReviewGroup title="9. Documents" tabIndex={8} onEdit={goToSection}>
          <ReviewRow
            label="Company establishment certificate"
            value={establishmentCert}
          />
          {PROJECT_KEY_INDIVIDUALS.map((k) => (
            <React.Fragment key={k.name}>
              <ReviewRow
                label={k.name + " — Address proof"}
                value={keyIndividualDocs[k.name]?.addressProof}
              />
              <ReviewRow
                label={k.name + " — Photo ID proof"}
                value={keyIndividualDocs[k.name]?.photoId}
              />
            </React.Fragment>
          ))}
        </ReviewGroup>
        </div>

        <div className="d-flex justify-content-between align-items-center gap-2 mt-4 pt-3 border-top flex-wrap">
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-navy btn-sm"
              disabled={activeSection === 0}
              onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
            >
              ← Back
            </button>
            {activeSection < sections.length - 1 && (
              <button
                className="btn btn-outline-navy btn-sm"
                onClick={() =>
                  setActiveSection((s) =>
                    Math.min(sections.length - 1, s + 1)
                  )
                }
              >
                {activeSection === sections.length - 2
                  ? "Review & Submit →"
                  : "Next →"}
              </button>
            )}
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-navy" onClick={onDone}>
              {editingProject ? "Cancel" : "Save as draft"}
            </button>
            {activeSection === REVIEW_TAB_INDEX && (
              <button
                className="btn btn-navy"
                onClick={handleSubmitClick}
              >
                {editingProject ? "Save changes" : "Save & Submit"}
              </button>
            )}
          </div>
        </div>
      </FormCard>
    </div>
  );
}
