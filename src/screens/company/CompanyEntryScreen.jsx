// src/screens/company/CompanyEntryScreen.jsx
// Provides (global): CompanyEntryScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function CompanyEntryScreen({ onMenuClick, onDone }) {
  const EXISTING_BUILDERS = [
    "Safleworks Constructions Pvt Ltd",
    "Safleworks Riverside SPV LLP",
    "Shri Siddhivinayak Developers",
  ];
  const EXISTING_GROUPS = ["Safleworks Group", "Shri Siddhivinayak Group"];
  const ROLE_OPTIONS = [
    { v: "Promoter", keyIndividual: true },
    { v: "Director", keyIndividual: true },
    { v: "Partner", keyIndividual: true },
    { v: "Proprietor", keyIndividual: true },
    { v: "Authorized Signatory", keyIndividual: true },
    { v: "CFO", keyIndividual: true },
    { v: "Architect", keyIndividual: false },
    { v: "Contractor", keyIndividual: false },
    { v: "Employee", keyIndividual: false },
  ];

  const [isExistingBuilder, setIsExistingBuilder] = useState(false);
  const [builderName, setBuilderName] = useState("");
  const [isExistingGroup, setIsExistingGroup] = useState(true);
  const [group, setGroup] = useState("Safleworks Group");

  const [entityType, setEntityType] = useState("LLP");
  const entityInfo = entityTypeInfo(entityType) || {
    cinApplicable: true,
    panApplicable: true,
  };
  const [pan, setPan] = useState("");
  const [panError, setPanError] = useState("");
  const [cinType, setCinType] = useState("CIN");
  const [cin, setCin] = useState("");
  const [cinError, setCinError] = useState("");
  const [lei, setLei] = useState("");
  const [leiError, setLeiError] = useState("");

  // Registered address (structured, not free text) and Address for
  // communication, which can be the same as the registered address.
  const blankAddress = () => ({
    line1: "",
    line2: "",
    line3: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [regAddress, setRegAddress] = useState(blankAddress());
  const [commSameAsReg, setCommSameAsReg] = useState(true);
  const [commAddress, setCommAddress] = useState(blankAddress());

  // GSTIN — a company can be registered under GST in more than one
  // state, so this is a repeatable list; each entry's state is
  // derived from the GSTIN's state-code prefix and validated
  // against it.
  const blankGstin = () => ({ gstin: "", error: "" });
  const [gstins, setGstins] = useState([blankGstin()]);
  function updateGstin(i, value) {
    setGstins((prev) =>
      prev.map((g, idx) =>
        idx === i ? { gstin: value.toUpperCase(), error: "" } : g
      )
    );
  }
  function validateGstinAt(i) {
    setGstins((prev) =>
      prev.map((g, idx) =>
        idx === i ? { ...g, error: validateGstin(g.gstin) } : g
      )
    );
  }

  const blankIndividual = () => ({
    userType: "Key Individual",
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    mobile: "",
    altMobile: "",
    email: "",
    emailError: "",
    altEmail: "",
    officePhone: "",
    pan: "",
    panError: "",
    panDoc: "",
    din: "",
    dinError: "",
    role: "Promoter",
    signatureDoc: "",
    shareholding: "",
  });
  const [individuals, setIndividuals] = useState([blankIndividual()]);
  const [submitted, setSubmitted] = useState(false);

  function updateIndividual(i, field, value) {
    setIndividuals((prev) =>
      prev.map((ind, idx) =>
        idx === i ? { ...ind, [field]: value } : ind
      )
    );
  }
  function isKeyIndividual(role) {
    const r = ROLE_OPTIONS.find((o) => o.v === role);
    return r ? r.keyIndividual : true;
  }

  // Validation helpers — plain-language format checks with inline errors
  function validatePan(value) {
    if (!value) return "PAN is required.";
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase()))
      return "Enter a valid PAN — 5 letters, 4 digits, 1 letter (e.g. AAAPL1234C).";
    return "";
  }
  function validateCin(value, type) {
    if (!value) return ""; // CIN/LLPIN itself is "as applicable", not always mandatory
    if (type === "CIN") {
      if (!/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(value.toUpperCase()))
        return "Enter a valid 21-character CIN (e.g. U45200MH2010PTC123456).";
    } else {
      if (!/^[A-Z]{3}-[0-9]{4}$/.test(value.toUpperCase()))
        return "Enter a valid LLPIN (e.g. AAA-1234).";
    }
    return "";
  }
  function validateLei(value) {
    if (!value) return ""; // non-mandatory
    if (!/^[A-Z0-9]{20}$/.test(value.toUpperCase()))
      return "LEI must be exactly 20 alphanumeric characters.";
    return "";
  }
  function validateDin(value) {
    if (!value) return "";
    if (!/^[1-9][0-9]{7}$/.test(value))
      return "DIN must be an 8-digit number.";
    return "";
  }
  function validateMobile(value) {
    if (!value) return "";
    if (!/^[6-9][0-9]{9}$/.test(value))
      return "Enter a valid 10-digit mobile number.";
    return "";
  }
  // New BRD: email address is mandatory for Key Individuals
  // (Promoter/Director/Partner/Proprietor/Authorized Signatory/CFO).
  function validateEmail(value, required) {
    if (!value) return required ? "Email is required for Key Individuals." : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "Enter a valid email address.";
    return "";
  }
  // New BRD: total shareholding across all key individuals must equal
  // exactly 100%.
  const totalShareholding = individuals.reduce(
    (sum, ind) => sum + (parseFloat(ind.shareholding) || 0),
    0
  );
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentDoc, setConsentDoc] = useState("");
  const anyKeyIndividual = individuals.some((ind) =>
    isKeyIndividual(ind.role)
  );

  if (submitted) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <div
            className="pk-icon mb-3"
            style={{ background: "#e2f5ec", color: "#1c9e6b" }}
          >
            ✓
          </div>
          <h5 className="fw-bold mb-2">Company submitted</h5>
          <p className="text-secondary small">
            Shubham Realty Developers Pvt. Ltd. has been submitted for
            PAMS approval. You'll see its status update on Company
            Listing once the BD team has reviewed it.
          </p>
          <button
            className="btn btn-navy w-100 fw-semibold mt-2"
            onClick={onDone}
          >
            Back to Company Listing
          </button>
        </div>
      </div>
    );
  }
  return (
    <div>
      <TopBar
        title="Company Entry"
        sub="Complete Builder KYC — submitted for PAMS approval"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="existingBuilderSwitch"
            checked={isExistingBuilder}
            onChange={(e) => setIsExistingBuilder(e.target.checked)}
          />
          <label
            className="form-check-label small"
            htmlFor="existingBuilderSwitch"
          >
            This is an existing developer already known to HDFC
          </label>
        </div>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Builder name *
            </label>
            {isExistingBuilder ? (
              <select
                className="form-select"
                value={builderName}
                onChange={(e) => setBuilderName(e.target.value)}
              >
                <option value="">Select existing builder…</option>
                {EXISTING_BUILDERS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            ) : (
              <input
                className="form-control"
                value={builderName}
                onChange={(e) => setBuilderName(e.target.value)}
              />
            )}
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Builder group name
            </label>
            {isExistingGroup ? (
              <select
                className="form-select"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              >
                {EXISTING_GROUPS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            ) : (
              <input
                className="form-control"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="New group name"
              />
            )}
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Company entity type *
            </label>
            <select
              className="form-select"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
            >
              {ENTITY_TYPES.map((e) => (
                <option key={e.type} value={e.type}>
                  {e.name}
                </option>
              ))}
            </select>
            <div className="form-text">
              Determines whether PAN and CIN/LLPIN apply below.
            </div>
          </div>
          {entityInfo.panApplicable && (
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                Company PAN *
              </label>
              <input
                className={
                  "form-control" + (panError ? " is-invalid" : "")
                }
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                onBlur={(e) => setPanError(validatePan(e.target.value))}
                placeholder="AAAPL1234C"
              />
              {panError && (
                <div className="invalid-feedback">{panError}</div>
              )}
            </div>
          )}
          {entityInfo.cinApplicable && (
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold">
                CIN / LLPIN *
              </label>
              <div className="d-flex gap-2 mb-1">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cinType"
                    checked={cinType === "CIN"}
                    onChange={() => setCinType("CIN")}
                  />
                  <label className="form-check-label small">CIN</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cinType"
                    checked={cinType === "LLPIN"}
                    onChange={() => setCinType("LLPIN")}
                  />
                  <label className="form-check-label small">LLPIN</label>
                </div>
              </div>
              <input
                className={
                  "form-control" + (cinError ? " is-invalid" : "")
                }
                value={cin}
                onChange={(e) => setCin(e.target.value.toUpperCase())}
                onBlur={(e) =>
                  setCinError(validateCin(e.target.value, cinType))
                }
                placeholder={
                  cinType === "CIN"
                    ? "U45200MH2010PTC123456"
                    : "AAA-1234"
                }
              />
              {cinError && (
                <div className="invalid-feedback">{cinError}</div>
              )}
            </div>
          )}
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Legal Entity Identifier (LEI)
            </label>
            <input
              className={
                "form-control" + (leiError ? " is-invalid" : "")
              }
              value={lei}
              onChange={(e) => setLei(e.target.value.toUpperCase())}
              onBlur={(e) => setLeiError(validateLei(e.target.value))}
              placeholder="20-character code (optional)"
              maxLength={20}
            />
            {leiError && (
              <div className="invalid-feedback">{leiError}</div>
            )}
            <div className="form-text">
              Non-mandatory — 20 alphanumeric characters if provided.
            </div>
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Website
            </label>
            <input className="form-control" />
            <div className="form-text">Non-mandatory</div>
          </div>
          <div className="col-12">
            <label className="form-label small fw-semibold">
              Remarks
            </label>
            <textarea className="form-control" rows="2"></textarea>
          </div>
        </div>
        <hr />
        <h6 className="mb-3">Registered address</h6>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Address line 1 *
            </label>
            <input
              className="form-control"
              value={regAddress.line1}
              onChange={(e) =>
                setRegAddress({ ...regAddress, line1: e.target.value })
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Address line 2
            </label>
            <input
              className="form-control"
              value={regAddress.line2}
              onChange={(e) =>
                setRegAddress({ ...regAddress, line2: e.target.value })
              }
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Address line 3
            </label>
            <input
              className="form-control"
              value={regAddress.line3}
              onChange={(e) =>
                setRegAddress({ ...regAddress, line3: e.target.value })
              }
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label small fw-semibold">
              City *
            </label>
            <input
              className="form-control"
              value={regAddress.city}
              onChange={(e) =>
                setRegAddress({ ...regAddress, city: e.target.value })
              }
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label small fw-semibold">
              State *
            </label>
            <input
              className="form-control"
              value={regAddress.state}
              onChange={(e) =>
                setRegAddress({ ...regAddress, state: e.target.value })
              }
            />
          </div>
          <div className="col-12 col-md-3">
            <label className="form-label small fw-semibold">
              Pincode *
            </label>
            <input
              className="form-control"
              maxLength={6}
              value={regAddress.pincode}
              onChange={(e) =>
                setRegAddress({
                  ...regAddress,
                  pincode: e.target.value,
                })
              }
            />
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Address for communication</h6>
          <div className="form-check mb-0">
            <input
              className="form-check-input"
              type="checkbox"
              id="commSameAsReg"
              checked={commSameAsReg}
              onChange={(e) => setCommSameAsReg(e.target.checked)}
            />
            <label
              className="form-check-label small"
              htmlFor="commSameAsReg"
            >
              Same as registered address
            </label>
          </div>
        </div>
        {!commSameAsReg && (
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Address line 1 *
              </label>
              <input
                className="form-control"
                value={commAddress.line1}
                onChange={(e) =>
                  setCommAddress({
                    ...commAddress,
                    line1: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Address line 2
              </label>
              <input
                className="form-control"
                value={commAddress.line2}
                onChange={(e) =>
                  setCommAddress({
                    ...commAddress,
                    line2: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Address line 3
              </label>
              <input
                className="form-control"
                value={commAddress.line3}
                onChange={(e) =>
                  setCommAddress({
                    ...commAddress,
                    line3: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold">
                City *
              </label>
              <input
                className="form-control"
                value={commAddress.city}
                onChange={(e) =>
                  setCommAddress({
                    ...commAddress,
                    city: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold">
                State *
              </label>
              <input
                className="form-control"
                value={commAddress.state}
                onChange={(e) =>
                  setCommAddress({
                    ...commAddress,
                    state: e.target.value,
                  })
                }
              />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold">
                Pincode *
              </label>
              <input
                className="form-control"
                maxLength={6}
                value={commAddress.pincode}
                onChange={(e) =>
                  setCommAddress({
                    ...commAddress,
                    pincode: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
        <hr />
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">GSTIN</h6>
          <button
            type="button"
            className="btn btn-outline-navy btn-sm"
            onClick={() => setGstins([...gstins, blankGstin()])}
          >
            + Add GSTIN
          </button>
        </div>
        <div className="text-secondary small mb-2">
          A company can be GST-registered in more than one state — add
          one row per registration. The state shown is derived from
          the GSTIN itself.
        </div>
        {gstins.map((g, i) => {
          const state = gstStateFor(g.gstin);
          return (
            <div className="row g-3 mb-2 align-items-start" key={i}>
              <div className="col-12 col-md-5">
                <label className="form-label small fw-semibold">
                  GSTIN {gstins.length > 1 ? i + 1 : ""}
                </label>
                <input
                  className={
                    "form-control" + (g.error ? " is-invalid" : "")
                  }
                  value={g.gstin}
                  onChange={(e) => updateGstin(i, e.target.value)}
                  onBlur={() => validateGstinAt(i)}
                  placeholder="27AAAPL1234C1ZV"
                  maxLength={15}
                />
                {g.error && (
                  <div className="invalid-feedback">{g.error}</div>
                )}
              </div>
              <div className="col-12 col-md-5">
                <label className="form-label small fw-semibold">
                  State
                </label>
                <input
                  className="form-control"
                  value={state}
                  disabled
                  placeholder="Auto-derived from GSTIN"
                />
              </div>
              <div className="col-12 col-md-2 d-flex align-items-end">
                {gstins.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm w-100"
                    onClick={() =>
                      setGstins(gstins.filter((_, idx) => idx !== i))
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <hr />
        <h6 className="mb-3">KYC documents</h6>
        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              PAN card copy *
            </label>
            <input type="file" className="form-control" />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              CIN / incorporation certificate *
            </label>
            <input type="file" className="form-control" />
          </div>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="mb-0">Key individuals / contact persons</h6>
          <button
            type="button"
            className="btn btn-outline-navy btn-sm"
            onClick={() =>
              setIndividuals([...individuals, blankIndividual()])
            }
          >
            + Add individual
          </button>
        </div>
        {individuals.map((ind, i) => {
          const keyInd = isKeyIndividual(ind.role);
          return (
            <div className="repeat-row p-3 mb-3" key={i}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold small">
                  Individual {i + 1}
                </span>
                {individuals.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() =>
                      setIndividuals(
                        individuals.filter((_, idx) => idx !== i)
                      )
                    }
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="row g-2 mb-2">
                <div className="col-12 col-md-3">
                  <label className="form-label small">
                    User type *
                  </label>
                  <div className="mt-1">
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={"userType" + i}
                        checked={ind.userType === "Key Individual"}
                        onChange={() =>
                          updateIndividual(
                            i,
                            "userType",
                            "Key Individual"
                          )
                        }
                      />
                      <label className="form-check-label small">
                        Key Individual
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={"userType" + i}
                        checked={ind.userType === "Contact Person"}
                        onChange={() =>
                          updateIndividual(
                            i,
                            "userType",
                            "Contact Person"
                          )
                        }
                      />
                      <label className="form-check-label small">
                        Contact Person
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label small">
                    Designation / role *
                  </label>
                  <select
                    className="form-select form-select-sm"
                    value={ind.role}
                    onChange={(e) =>
                      updateIndividual(i, "role", e.target.value)
                    }
                  >
                    {ROLE_OPTIONS.map((o) => (
                      <option key={o.v} value={o.v}>
                        {o.v}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label small">
                    % Shareholding
                  </label>
                  <input
                    className="form-control form-control-sm"
                    type="number"
                    min="0"
                    max="100"
                    value={ind.shareholding}
                    onChange={(e) =>
                      updateIndividual(i, "shareholding", e.target.value)
                    }
                  />
                  <div className="form-text">0–100; total across all individuals must be 100%.</div>
                </div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-12 col-md-4">
                  <label className="form-label small">
                    First name *
                  </label>
                  <input
                    className="form-control form-control-sm"
                    value={ind.firstName}
                    onChange={(e) =>
                      updateIndividual(i, "firstName", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small">
                    Middle name
                  </label>
                  <input
                    className="form-control form-control-sm"
                    value={ind.middleName}
                    onChange={(e) =>
                      updateIndividual(i, "middleName", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small">
                    Last name *
                  </label>
                  <input
                    className="form-control form-control-sm"
                    value={ind.lastName}
                    onChange={(e) =>
                      updateIndividual(i, "lastName", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-12 col-md-3">
                  <label className="form-label small">
                    Date of birth{keyInd ? " *" : ""}
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    value={ind.dob}
                    onChange={(e) =>
                      updateIndividual(i, "dob", e.target.value)
                    }
                  />
                  {keyInd && !ind.dob && (
                    <div className="form-text text-danger">
                      Required for Key Individuals.
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label small">
                    Mobile number{keyInd ? " *" : ""}
                  </label>
                  <input
                    className="form-control form-control-sm"
                    value={ind.mobile}
                    onChange={(e) =>
                      updateIndividual(i, "mobile", e.target.value)
                    }
                    onBlur={() => {
                      const err = validateMobile(ind.mobile);
                      if (err) alert(err);
                    }}
                    placeholder="10-digit mobile"
                  />
                  {keyInd && !ind.mobile && (
                    <div className="form-text text-danger">
                      Required for Key Individuals.
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label small">
                    Alternate mobile
                  </label>
                  <input
                    className="form-control form-control-sm"
                    value={ind.altMobile}
                    onChange={(e) =>
                      updateIndividual(i, "altMobile", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-3">
                  <label className="form-label small">
                    Office phone
                  </label>
                  <input
                    className="form-control form-control-sm"
                    value={ind.officePhone}
                    onChange={(e) =>
                      updateIndividual(i, "officePhone", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="row g-2 mb-2">
                <div className="col-12 col-md-4">
                  <label className="form-label small">
                    Email address{keyInd ? " *" : ""}
                  </label>
                  <input
                    type="email"
                    className={
                      "form-control form-control-sm" +
                      (ind.emailError ? " is-invalid" : "")
                    }
                    value={ind.email}
                    onChange={(e) =>
                      updateIndividual(i, "email", e.target.value)
                    }
                    onBlur={(e) =>
                      updateIndividual(
                        i,
                        "emailError",
                        validateEmail(e.target.value, keyInd)
                      )
                    }
                  />
                  {ind.emailError ? (
                    <div className="invalid-feedback d-block">
                      {ind.emailError}
                    </div>
                  ) : (
                    keyInd && (
                      <div className="form-text">
                        Mandatory for Key Individuals.
                      </div>
                    )
                  )}
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small">
                    Alternate email
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    value={ind.altEmail}
                    onChange={(e) =>
                      updateIndividual(i, "altEmail", e.target.value)
                    }
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small">
                    DIN (for directors)
                  </label>
                  <input
                    className={
                      "form-control form-control-sm" +
                      (ind.dinError ? " is-invalid" : "")
                    }
                    value={ind.din}
                    onChange={(e) =>
                      updateIndividual(i, "din", e.target.value)
                    }
                    onBlur={(e) =>
                      updateIndividual(
                        i,
                        "dinError",
                        validateDin(e.target.value)
                      )
                    }
                    placeholder="8-digit DIN"
                  />
                  {ind.dinError && (
                    <div className="invalid-feedback">
                      {ind.dinError}
                    </div>
                  )}
                </div>
              </div>
              <div className="row g-2">
                <div className="col-12 col-md-4">
                  <label className="form-label small">
                    PAN{keyInd ? " *" : ""}
                  </label>
                  <input
                    className={
                      "form-control form-control-sm" +
                      (ind.panError ? " is-invalid" : "")
                    }
                    value={ind.pan}
                    onChange={(e) =>
                      updateIndividual(
                        i,
                        "pan",
                        e.target.value.toUpperCase()
                      )
                    }
                    onBlur={(e) =>
                      updateIndividual(
                        i,
                        "panError",
                        keyInd || e.target.value
                          ? validatePan(e.target.value)
                          : ""
                      )
                    }
                    placeholder="AAAPL1234C"
                  />
                  {ind.panError && (
                    <div className="invalid-feedback">
                      {ind.panError}
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small">
                    PAN supporting document{keyInd ? " *" : ""}
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-sm"
                  />
                </div>
                <div className="col-12 col-md-4">
                  <label className="form-label small">
                    Signature specimen
                  </label>
                  <input
                    type="file"
                    className="form-control form-control-sm"
                  />
                  <div className="form-text">Non-mandatory</div>
                </div>
              </div>
            </div>
          );
        })}
        <div
          className={
            "d-flex justify-content-between align-items-center p-2 px-3 rounded mb-3 " +
            (totalShareholding === 100
              ? "bg-success-subtle text-success"
              : "bg-warning-subtle text-warning")
          }
        >
          <span className="small fw-semibold">
            Total shareholding across key individuals
          </span>
          <span className="fw-bold">{totalShareholding}%</span>
        </div>
        {totalShareholding !== 100 && (
          <div className="form-text text-danger mb-3">
            Total shareholding must add up to exactly 100% before this
            company can be submitted.
          </div>
        )}

        {anyKeyIndividual && (
          <>
            <hr />
            <h6 className="mb-2">KYC consent</h6>
            <p className="text-secondary small">
              Required wherever KYC is applicable for a Key Individual
              listed above. One common consent covers all key
              individuals on this company.
            </p>
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="kycConsent"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
              />
              <label
                className="form-check-label small"
                htmlFor="kycConsent"
              >
                I confirm that consent has been obtained from the
                developer / key individuals to collect and verify their
                KYC details, and that they agree to HDFC Bank's Terms &
                Conditions for the Developer Portal. *
              </label>
            </div>
            <div className="mb-3" style={{ maxWidth: 360 }}>
              <label className="form-label small fw-semibold">
                Attach consent document *
              </label>
              <input
                type="file"
                className="form-control form-control-sm"
                onChange={(e) =>
                  setConsentDoc(e.target.files?.[0]?.name || "")
                }
              />
              {!consentDoc && (
                <div className="form-text">
                  Signed consent covering all key individuals above.
                </div>
              )}
            </div>
          </>
        )}

        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
          <button className="btn btn-outline-navy" onClick={onDone}>
            Save as draft
          </button>
          <button
            className="btn btn-navy"
            disabled={
              totalShareholding !== 100 ||
              (anyKeyIndividual && (!consentGiven || !consentDoc))
            }
            title={
              totalShareholding !== 100
                ? "Shareholding must total 100%"
                : anyKeyIndividual && (!consentGiven || !consentDoc)
                ? "KYC consent and consent document are required"
                : ""
            }
            onClick={() => setSubmitted(true)}
          >
            Save
          </button>
        </div>
      </FormCard>
    </div>
  );
}
