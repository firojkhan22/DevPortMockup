// src/screens/project-data/BankEntryScreen.jsx
// Provides (global): BankEntryScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.

function BankEntryScreen({ onMenuClick, onDone, editingAccount }) {
  const projectOptions = BUILDER_PROJECT_NAMES;
  const savedAccounts = [
    {
      id: "acc1",
      label: "Riverside Heights — HDFC Current a/c ••4532",
      project: "Riverside Heights",
      payee: "Safleworks Constructions Pvt Ltd",
      bank: "HDFC Bank",
      acctFull: "50100234534532",
      ifsc: "HDFC0000123",
      branch: "Andheri East, Mumbai",
      accountType: "Current",
      rera: "Yes",
      paymentTypes: ["Sale consideration", "GST and Taxes"],
    },
    {
      id: "acc2",
      label: "Green Valley Phase 2 — ICICI Current a/c ••1187",
      project: "Green Valley Phase 2",
      payee: "Safleworks Constructions Pvt Ltd",
      bank: "ICICI Bank",
      acctFull: "601101187001187",
      ifsc: "ICIC0001234",
      branch: "Baner, Pune",
      accountType: "Current",
      rera: "No",
      paymentTypes: ["Sale consideration"],
    },
  ];
  const [mode, setMode] = useState("new");
  const [selectedProject, setSelectedProject] = useState("");
  const [acct, setAcct] = useState(savedAccounts[0].id);
  const [chequeFile, setChequeFile] = useState("");
  const [chequeFileObj, setChequeFileObj] = useState(null);
  const [chequePreview, setChequePreview] = useState("");
  const [autoFilled, setAutoFilled] = useState(false);
  const [reading, setReading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrError, setOcrError] = useState("");
  const [ocrMissing, setOcrMissing] = useState([]);
  const [branch, setBranch] = useState("");
  const [accountType, setAccountType] = useState("Current");
  const [reraAcct, setReraAcct] = useState("Yes");
  const [useVirtualAccount, setUseVirtualAccount] = useState(false);
  const [virtualPrefix, setVirtualPrefix] = useState("");
  const [virtualSupportDoc, setVirtualSupportDoc] = useState("");
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
  function togglePaymentType(t) {
    setPaymentTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  }
  const [fields, setFields] = useState({
    payee: "",
    bank: "",
    acctNo: "",
    ifsc: "",
  });

  // Editing an existing record from Bank Accounts Listing — prefill
  // every field from the row that was clicked.
  useEffect(() => {
    if (editingAccount) {
      setSelectedProject(editingAccount.label);
      setFields({
        payee: editingAccount.payee || "",
        bank: editingAccount.bank || "",
        acctNo: editingAccount.acctFull || editingAccount.acct || "",
        ifsc: editingAccount.ifsc || "",
      });
      setBranch(editingAccount.branch || "");
      setAccountType(editingAccount.accountType || "Current");
      setReraAcct(editingAccount.rera || "Yes");
      setPaymentTypes(editingAccount.paymentTypes || []);
    }
  }, [editingAccount]);

  // "Use one already on file" links this record to the project that
  // account already belongs to — the project field stays visible and
  // syncs automatically instead of disappearing. It also shows that
  // account's details (read-only) so the form isn't blank.
  useEffect(() => {
    if (!editingAccount && mode === "existing") {
      const found = savedAccounts.find((a) => a.id === acct);
      setSelectedProject(found ? found.project : "");
      if (found) {
        setFields({
          payee: found.payee || "",
          bank: found.bank || "",
          acctNo: found.acctFull || "",
          ifsc: found.ifsc || "",
        });
        setBranch(found.branch || "");
        setAccountType(found.accountType || "Current");
        setReraAcct(found.rera || "Yes");
        setPaymentTypes(found.paymentTypes || []);
      }
    }
  }, [mode, acct, editingAccount]);

  // Best-effort parser for whatever text the OCR engine pulls off a
  // cancelled cheque image. Cheque layouts vary a lot between banks,
  // so this only fills in fields it can find with reasonable
  // confidence and leaves the rest for manual entry.
  const KNOWN_BANKS = [
    "HDFC Bank",
    "ICICI Bank",
    "State Bank of India",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Bank of India",
    "Bank of Maharashtra",
    "IDBI Bank",
    "Yes Bank",
    "IndusInd Bank",
    "Canara Bank",
    "Union Bank of India",
    "Central Bank of India",
    "IDFC FIRST Bank",
    "RBL Bank",
    "Federal Bank",
    "South Indian Bank",
    "Karnataka Bank",
    "Karur Vysya Bank",
    "City Union Bank",
    "Tamilnad Mercantile Bank",
    "Indian Bank",
    "Indian Overseas Bank",
    "UCO Bank",
    "Punjab and Sind Bank",
    "Bandhan Bank",
    "DCB Bank",
    "CSB Bank",
    "Jammu and Kashmir Bank",
    "Dhanlaxmi Bank",
    "AU Small Finance Bank",
    "Equitas Small Finance Bank",
    "Ujjivan Small Finance Bank",
    "Standard Chartered Bank",
    "Citibank",
    "Deutsche Bank",
    "HSBC",
  ];
  // Words that signal a line belongs to a different printed field
  // (IFSC/MICR/account block etc.) rather than the branch address -
  // ported from the same list used in the ASP.NET reader.
  const ADDRESS_STOP_WORDS =
    /ifsc|code|micr|a\/c|ac no|account|payee|rupees|pay\b|bearer|signature|valid for|please sign|cheque|not negotiable|cts/i;
  function parseChequeText(rawText, words, imageHeight) {
    const text = (rawText || "").replace(/[|_]+/g, " ");
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const result = { ifsc: "", acctNo: "", bank: "", payee: "", address: "" };

    // IFSC: 4 letters, then a digit '0' - or the letter 'O', which OCR
    // very commonly confuses it with - then 6 alphanumeric. Ported from
    // the same tolerant pattern + normalization used in the ASP.NET
    // reader (real IFSC codes always have a literal zero here).
    const ifscMatch = text
      .toUpperCase()
      .match(/\b[A-Z]{4}[0O][A-Z0-9]{6}\b/);
    if (ifscMatch) {
      const chars = ifscMatch[0].split("");
      chars[4] = "0";
      result.ifsc = chars.join("");
    }

    // Bank name — match against the known-bank list first, since OCR
    // usually gets the printed bank header right even when it garbles
    // smaller text. Falls back to any line containing "bank" verbatim.
    let bankLineIndex = -1;
    for (const b of KNOWN_BANKS) {
      const re = new RegExp(b.replace(/\s+/g, "\\s+"), "i");
      if (re.test(text)) {
        result.bank = b;
        break;
      }
    }
    for (let i = 0; i < lines.length; i++) {
      if (/bank/i.test(lines[i])) {
        bankLineIndex = i;
        if (!result.bank && lines[i].length < 45) result.bank = lines[i];
        break;
      }
    }

    // Branch / address — ported from FindBankAddress in the ASP.NET
    // reader: take up to the next 3 lines after the bank name line,
    // stopping as soon as a line clearly belongs to a different
    // printed field (IFSC/MICR/account block) or is mostly digits.
    if (bankLineIndex > -1) {
      const addressLines = [];
      for (
        let i = bankLineIndex + 1;
        i < lines.length && addressLines.length < 3;
        i++
      ) {
        const line = lines[i];
        if (!line) continue;
        if (ADDRESS_STOP_WORDS.test(line)) break;
        if (/[A-Z]{4}0[A-Z0-9]{6}/i.test(line)) break;
        const digitCount = (line.match(/\d/g) || []).length;
        if (digitCount > line.length / 2) break;
        addressLines.push(line);
      }
      if (addressLines.length) result.address = addressLines.join(", ");
    }

    // Account number — prefer digits explicitly labelled "A/c No" /
    // "Account No". Otherwise, if word-level positions are available
    // (from Tesseract's word bounding boxes), pick the longest 9-18
    // digit WORD token that sits in the top ~80% of the image - this
    // is the same technique the ASP.NET reader uses to avoid picking
    // up digits from the MICR line at the very bottom of the cheque,
    // which is a completely different, unrelated number. Falls back
    // to a plain whole-text scan if word positions aren't available.
    let labelled = null;
    for (const line of lines) {
      const m = line.match(
        /(?:a\/?c\.?\s*no\.?|account\s*no\.?|a\/c)\s*[:\-]?\s*([0-9][0-9 ]{7,20}[0-9])/i
      );
      if (m) {
        labelled = m;
        break;
      }
    }
    if (labelled) {
      result.acctNo = labelled[1].replace(/\s+/g, "");
    } else if (words && words.length && imageHeight) {
      const exclusionY = imageHeight * 0.8; // bottom ~20% = MICR area
      let best = null;
      for (const w of words) {
        if (!w || !w.text || !w.bbox) continue;
        if (w.bbox.y0 >= exclusionY) continue; // skip the MICR zone
        const digitsOnly = w.text.replace(/\D/g, "");
        if (
          digitsOnly.length >= 9 &&
          digitsOnly.length <= 18 &&
          (!best || digitsOnly.length > best.length)
        ) {
          best = digitsOnly;
        }
      }
      if (best) result.acctNo = best;
    }
    if (!result.acctNo) {
      const digitRuns = (text.match(/\b[0-9]{9,18}\b/g) || []).filter(
        (d) => d !== result.ifsc
      );
      if (digitRuns.length) {
        result.acctNo = digitRuns.sort((a, b) => b.length - a.length)[0];
      }
    }

    // Payee / account-holder name — heuristic: the first line that
    // reads like a printed name (letters/spaces/punctuation only, no
    // digits) and isn't the bank line, a boilerplate cheque phrase,
    // or the MICR/IFSC line.
    const boilerplate =
      /bank|branch|ifsc|micr|cheque|payable|rupees|account|a\/c|not\s*negotiable|or\s*bearer|pay\b|signature|valid\s*for|date\b|for\s*account\s*payee|please\s*sign/i;
    const looksLikeGibberish = (line) => {
      const words = line.split(/\s+/).filter(Boolean);
      // OCR often renders illegible handwriting as runs of "x" or a
      // single repeated character per word — reject those rather
      // than presenting them as a real name.
      return (
        !words.length || words.every((w) => /^([A-Za-z])\1*$/.test(w))
      );
    };
    const nameCandidate = lines.find(
      (l) =>
        /^[A-Za-z][A-Za-z .&,'\-]{4,45}$/.test(l) &&
        !boilerplate.test(l) &&
        !looksLikeGibberish(l) &&
        l !== result.bank
    );
    if (nameCandidate) result.payee = nameCandidate;

    return result;
  }

  // Loads the uploaded file into a canvas, normalizing EXIF orientation
  // and upscaling small images. This is the browser-side equivalent of
  // the ASP.NET reader's FixOrientationAndSave + UpscaleForOcr steps:
  // phone photos are very often stored sideways with a rotation flag,
  // and small print (like an IFSC code) reads far more reliably once
  // upscaled. { imageOrientation: "from-image" } is what makes the
  // browser apply the photo's EXIF rotation instead of ignoring it.
  async function loadPreprocessedChequeCanvas(file) {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const targetWidth = Math.max(bitmap.width, 1500);
    const scale = targetWidth / bitmap.width;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  // Tesseract.js's output shape for word-level positions has varied
  // across versions - some return a flat data.words array directly,
  // others only return nested data.blocks (block -> paragraph -> line
  // -> word). This normalizes either shape into a flat array of
  // { text, bbox } so the account-number logic below doesn't care
  // which one the loaded version produced. Falls back to an empty
  // array (triggering the plain-text fallback) if neither is present.
  function flattenWords(data) {
    if (!data) return [];
    if (Array.isArray(data.words) && data.words.length) return data.words;
    const out = [];
    const blocks = data.blocks || [];
    for (const block of blocks) {
      for (const para of block.paragraphs || []) {
        for (const line of para.lines || []) {
          for (const word of line.words || []) {
            if (word && word.text) out.push(word);
          }
        }
      }
    }
    return out;
  }

  async function readCheque() {
    if (!chequeFileObj) return;
    if (!/^image\//.test(chequeFileObj.type)) {
      setOcrError(
        "Please upload the cheque as an image (JPG/PNG) — this reader can't scan PDFs yet."
      );
      return;
    }
    setReading(true);
    setOcrProgress(0);
    setOcrError("");
    setOcrMissing([]);
    let worker = null;
    try {
      if (!window.Tesseract) {
        throw new Error(
          "The OCR engine didn't load — check your internet connection and try again."
        );
      }
      const canvas = await loadPreprocessedChequeCanvas(chequeFileObj);

      // Using the documented createWorker/worker.recognize API rather
      // than the older global Tesseract.recognize(image, lang, options)
      // shorthand - that shorthand's exact handling of extra keys
      // beyond "logger" isn't reliably documented, and worker.recognize
      // has a clean, confirmed 3rd "output" argument specifically for
      // requesting word/block position data without touching anything
      // that could affect recognition quality itself.
      worker = await window.Tesseract.createWorker("eng", 1, {
        logger: (m) => {
          if (
            m.status === "recognizing text" &&
            typeof m.progress === "number"
          ) {
            setOcrProgress(Math.round(m.progress * 100));
          }
        },
      });
      const { data } = await worker.recognize(
        canvas,
        {},
        { text: true, blocks: true }
      );

      let parsed = parseChequeText(
        data && data.text,
        flattenWords(data),
        canvas.height
      );

      // Safety net: if the preprocessed pass came back without EITHER
      // the bank name or the IFSC code, re-run OCR on the ORIGINAL
      // file directly (no canvas resize/redraw at all) and use that
      // instead if it does better. Different cheque photos can react
      // differently to upscaling, so this hedges against the
      // preprocessing step itself hurting a given image rather than
      // helping it.
      if (!parsed.bank && !parsed.ifsc) {
        const rawResult = await worker.recognize(
          chequeFileObj,
          {},
          { text: true, blocks: true }
        );
        const bitmap = await createImageBitmap(chequeFileObj);
        const rawParsed = parseChequeText(
          rawResult.data && rawResult.data.text,
          flattenWords(rawResult.data),
          bitmap.height
        );
        if (rawParsed.bank || rawParsed.ifsc) {
          parsed = {
            payee: rawParsed.payee || parsed.payee,
            bank: rawParsed.bank || parsed.bank,
            acctNo: parsed.acctNo || rawParsed.acctNo,
            ifsc: rawParsed.ifsc || parsed.ifsc,
            address: rawParsed.address || parsed.address,
          };
        }
      }

      setFields((prev) => ({
        payee: parsed.payee || prev.payee,
        bank: parsed.bank || prev.bank,
        acctNo: parsed.acctNo || prev.acctNo,
        ifsc: parsed.ifsc || prev.ifsc,
      }));
      if (parsed.address) {
        setBranch((prev) => prev || parsed.address);
      }
      const missing = [];
      if (!parsed.payee) missing.push("payee name");
      if (!parsed.bank) missing.push("bank name");
      if (!parsed.acctNo) missing.push("account number");
      if (!parsed.ifsc) missing.push("IFSC code");
      setOcrMissing(missing);
      setAutoFilled(true);
    } catch (err) {
      setOcrError(
        (err && err.message) ||
          "Couldn't read this cheque image. Please enter the details manually."
      );
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch (termErr) {
          // Nothing useful to do if cleanup itself fails - not worth
          // surfacing to the user over a successful/failed read.
        }
      }
      setReading(false);
    }
  }
  return (
    <div>
      <TopBar
        title={
          editingAccount ? "Edit Bank Account" : "Bank Account Entry"
        }
        sub={
          editingAccount
            ? "Updating an on-file account — reason for change is required"
            : "Add or update — with reason required when editing an existing account"
        }
        onMenuClick={onMenuClick}
      />
      <FormCard>
        {editingAccount ? (
          <div className="kpi-card p-2 px-3 mb-3 bg-light d-inline-block">
            <span className="text-secondary small">Editing account for </span>
            <span className="fw-semibold small">{editingAccount.label}</span>
          </div>
        ) : (
          <>
            <div className="d-flex gap-3 mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="bam"
                  id="ban"
                  checked={mode === "new"}
                  onChange={() => setMode("new")}
                />
                <label className="form-check-label small" htmlFor="ban">
                  Add new account{" "}
                  <span className="badge badge-navy">Preferred</span>
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="bam"
                  id="bae"
                  checked={mode === "existing"}
                  onChange={() => setMode("existing")}
                />
                <label className="form-check-label small" htmlFor="bae">
                  Use one already on file for this builder
                </label>
              </div>
            </div>
            {mode === "existing" && (
              <select
                className="form-select mb-3"
                value={acct}
                onChange={(e) => setAcct(e.target.value)}
              >
                {savedAccounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
        {!editingAccount && mode === "new" && (
          <div className="mb-3" style={{ maxWidth: 420 }}>
            <ProjectPickerField
              label="Select project"
              required
              value={selectedProject}
              onChange={setSelectedProject}
              placeholder="Select the project this account is for…"
            />
            <div className="form-text">
              Every bank account is tied to a specific project. Pick the
              project before entering account details below.
            </div>
          </div>
        )}
        {!editingAccount && mode === "existing" && (
          <div className="mb-3" style={{ maxWidth: 420 }}>
            <label className="form-label small fw-semibold">
              Project
            </label>
            <select className="form-select" value={selectedProject} disabled>
              <option value={selectedProject}>
                {selectedProject || "—"}
              </option>
            </select>
            <div className="form-text">
              Determined by the account you selected above.
            </div>
          </div>
        )}
        {editingAccount && (
          <div className="mb-3" style={{ maxWidth: 420 }}>
            <label className="form-label small fw-semibold">
              Project
            </label>
            <select
              className="form-select"
              value={selectedProject}
              disabled
            >
              <option value={selectedProject}>{selectedProject}</option>
            </select>
            <div className="form-text">
              The project an account belongs to can't be changed once
              it's on file — add a new account if this needs to move to
              a different project.
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Upload cancelled cheque / passbook copy
          </label>
          <div className="d-flex gap-2 align-items-start flex-wrap">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              style={{ maxWidth: 320 }}
              disabled={mode === "existing" || !selectedProject}
              onChange={(e) => {
                const f = e.target.files?.[0] || null;
                setChequeFile(f ? f.name : "");
                setChequeFileObj(f);
                setChequePreview(
                  f && /^image\//.test(f.type)
                    ? URL.createObjectURL(f)
                    : ""
                );
                setAutoFilled(false);
                setOcrError("");
                setOcrMissing([]);
              }}
            />
            <button
              type="button"
              className="btn btn-outline-navy"
              disabled={
                mode === "existing" ||
                !selectedProject ||
                !chequeFile ||
                reading
              }
              onClick={readCheque}
            >
              {reading
                ? `Reading… ${ocrProgress}%`
                : "Auto-fill from cheque"}
            </button>
            {chequePreview && (
              <img
                src={chequePreview}
                alt="Cancelled cheque preview"
                style={{
                  height: 44,
                  borderRadius: 4,
                  border: "1px solid #dee2e6",
                }}
              />
            )}
          </div>
          <div className="form-text">
            Attach a clear photo or scan of the cancelled cheque —
            this reads it in your browser (no upload to a server) and
            fills in whatever it can recognize. Always verify against
            the physical cheque before submitting.
          </div>
          {ocrError && (
            <div className="form-text text-danger">{ocrError}</div>
          )}
          {autoFilled && !ocrError && (
            <div className="form-text text-success">
              ✓ Read the cheque image
              {ocrMissing.length
                ? ` — couldn't confidently make out ${ocrMissing.join(
                    ", "
                  )}; please fill ${
                    ocrMissing.length > 1 ? "those" : "that"
                  } in manually.`
                : "."}{" "}
              Review every field before submitting.
            </div>
          )}
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Payee name *
            </label>
            <input
              className="form-control"
              value={fields.payee}
              onChange={(e) =>
                setFields({ ...fields, payee: e.target.value })
              }
              disabled={mode === "existing" || !selectedProject}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Bank name *
            </label>
            <input
              className="form-control"
              value={fields.bank}
              onChange={(e) =>
                setFields({ ...fields, bank: e.target.value })
              }
              disabled={mode === "existing" || !selectedProject}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Account number *
            </label>
            <input
              className="form-control"
              value={fields.acctNo}
              onChange={(e) =>
                setFields({ ...fields, acctNo: e.target.value })
              }
              disabled={mode === "existing" || !selectedProject}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              IFSC code *
            </label>
            <input
              className="form-control"
              value={fields.ifsc}
              onChange={(e) =>
                setFields({ ...fields, ifsc: e.target.value })
              }
              disabled={mode === "existing" || !selectedProject}
            />
          </div>
          {autoFilled && mode === "new" && ocrMissing.length === 0 && (
            <div className="col-12">
              <div className="form-text text-success">
                ✓ Fields populated from the uploaded cheque above —
                scroll down to review them before submitting.
              </div>
            </div>
          )}
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Account type
            </label>
            <select
              className="form-select"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              disabled={mode === "existing" || !selectedProject}
            >
              <option>Current</option>
              <option>Savings</option>
              <option>ESCROW</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Branch</label>
            <input
              className="form-control"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              disabled={mode === "existing" || !selectedProject}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Is this a RERA collection account? *
            </label>
            <div className="mt-1">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rera-acct"
                  checked={reraAcct === "Yes"}
                  onChange={() => setReraAcct("Yes")}
                />
                <label className="form-check-label small">Yes</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="rera-acct"
                  checked={reraAcct === "No"}
                  onChange={() => setReraAcct("No")}
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
                      id={"ptype-" + t}
                      checked={paymentTypes.includes(t)}
                      onChange={() => togglePaymentType(t)}
                    />
                    <label
                      className="form-check-label small"
                      htmlFor={"ptype-" + t}
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
            <div
              className="alert alert-info py-2 px-3 small mb-2 d-flex gap-2"
              style={{ maxWidth: 640 }}
            >
              <span style={{ fontSize: 16, lineHeight: 1 }}>ℹ️</span>
              <div>
                <strong>What's a virtual account?</strong> A bank
                issues one virtual account number per unit/customer,
                but the initial 5–6 digits (the "prefix") are the same
                across every virtual account for this project. If the
                account number you entered above is one of these,
                check the box below and provide that shared prefix.
              </div>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="is-virtual-account"
                checked={useVirtualAccount}
                onChange={(e) => setUseVirtualAccount(e.target.checked)}
                disabled={mode === "existing" || !selectedProject}
              />
              <label
                className="form-check-label small fw-semibold"
                htmlFor="is-virtual-account"
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
                  disabled={mode === "existing" || !selectedProject}
                />
                <div className="form-text">
                  5–6 digits, common to all units of this project. The
                  account number entered above must start with this
                  prefix.
                </div>
                {virtualPrefix &&
                  !/^\d{5,6}$/.test(virtualPrefix.trim()) && (
                    <div className="invalid-feedback d-block">
                      Prefix must be 5–6 digits.
                    </div>
                  )}
                {virtualPrefix &&
                  /^\d{5,6}$/.test(virtualPrefix.trim()) &&
                  fields.acctNo &&
                  !fields.acctNo.trim().startsWith(virtualPrefix.trim()) && (
                    <div className="text-danger small mt-1">
                      The account number above doesn't start with this
                      prefix — check both fields.
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
                  disabled={mode === "existing" || !selectedProject}
                  onChange={(e) =>
                    setVirtualSupportDoc(e.target.files?.[0]?.name || "")
                  }
                />
              </div>
            </>
          )}
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button className="btn btn-outline-navy" onClick={onDone}>
            Save as draft
          </button>
          <button
            className="btn btn-navy"
            disabled={
              (mode === "new" && !editingAccount && !selectedProject) ||
              (useVirtualAccount &&
                (!/^\d{5,6}$/.test(virtualPrefix.trim()) ||
                  !virtualSupportDoc ||
                  !fields.acctNo.trim().startsWith(virtualPrefix.trim())))
            }
            title={
              mode === "new" && !editingAccount && !selectedProject
                ? "Select the project this account belongs to first"
                : useVirtualAccount &&
                  !/^\d{5,6}$/.test(virtualPrefix.trim())
                ? "Virtual account prefix must be 5–6 digits"
                : useVirtualAccount && !virtualSupportDoc
                ? "Supporting document for the virtual account is required"
                : useVirtualAccount &&
                  !fields.acctNo.trim().startsWith(virtualPrefix.trim())
                ? "The account number must start with the virtual account prefix"
                : ""
            }
            onClick={onDone}
          >
            Submit for approval
          </button>
        </div>
      </FormCard>
    </div>
  );
}
