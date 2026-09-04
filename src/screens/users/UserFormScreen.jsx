// src/screens/users/UserFormScreen.jsx
// Provides (global): UserFormScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function UserFormScreen({ onMenuClick, onDone, editUser, onSave }) {
  const [firstName, setFirstName] = useState(editUser?.firstName || "");
  const [firstNameError, setFirstNameError] = useState("");
  const [middleName, setMiddleName] = useState(editUser?.middleName || "");
  const [lastName, setLastName] = useState(editUser?.lastName || "");
  const [lastNameError, setLastNameError] = useState("");
  const [email, setEmail] = useState(editUser?.email || "");
  const [emailError, setEmailError] = useState("");
  const [mobile, setMobile] = useState(editUser?.mobile || "");
  const [mobileError, setMobileError] = useState("");
  const [pan, setPan] = useState(editUser?.pan || "");
  const [panError, setPanError] = useState("");
  const [dob, setDob] = useState(editUser?.dob || "");
  const [dobError, setDobError] = useState("");
  // ID-proof documents — at least one is mandatory. Each entry is
  // { id, type, name, size, date, dataUrl }. Seeded users carry a
  // single { idProofType, idProofName }; normalise that to the list.
  const [idProofs, setIdProofs] = useState(() => {
    if (Array.isArray(editUser?.idProofs)) return editUser.idProofs;
    if (editUser?.idProofName)
      return [
        {
          id: "seed",
          type: editUser.idProofType || "",
          name: editUser.idProofName,
          date: editUser.modifiedOn || editUser.createdOn || "",
          dataUrl: null,
        },
      ];
    return [];
  });
  const [pendingIdType, setPendingIdType] = useState("");
  const [idProofError, setIdProofError] = useState("");
  const [viewingDoc, setViewingDoc] = useState(null);
  const idProofInputRef = useRef(null);

  function addIdProof(fileList) {
    const file = (fileList || [])[0];
    if (!file) return;
    if (!pendingIdType) {
      setIdProofError("Select the ID type before uploading.");
      return;
    }
    setIdProofError("");
    // Read every file type (image / PDF) as a data URL so it can be
    // previewed inline in the viewer without ever leaving the browser
    // or being written to disk — the secure-by-default posture for a
    // KYC document. A Download option is still offered in the viewer.
    const reader = new FileReader();
    reader.onload = (e) => {
      setIdProofs((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          type: pendingIdType,
          name: file.name,
          size: file.size,
          mime: file.type || "",
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
          dataUrl: e.target.result,
        },
      ]);
      setPendingIdType("");
    };
    reader.readAsDataURL(file);
    if (idProofInputRef.current) idProofInputRef.current.value = "";
  }
  function removeIdProof(id) {
    setIdProofs((prev) => prev.filter((d) => d.id !== id));
  }
  const [designation, setDesignation] = useState(
    editUser?.designation || "Site Engineer"
  );
  const [address, setAddress] = useState(editUser?.address || "");
  const [isActive, setIsActive] = useState(
    editUser ? editUser.isActive !== false : true
  );
  const [role, setRole] = useState(editUser?.role || "Developer Admin");
  const [roleError, setRoleError] = useState("");
  const [fullAccess, setFullAccess] = useState(
    editUser ? editUser.access === "Full Access" : true
  );
  // Projects auto-granted because this user created them — merged
  // into the checkable list below (so they show pre-checked), kept
  // separately here just to drive the "Creator" badge. Unchecking
  // one is exactly how an admin removes that automatic mapping.
  const creatorProjectIds = editUser?.creatorProjects || [];
  const [selProjects, setSelProjects] = useState(
    [...new Set([...(editUser?.selProjects || []), ...creatorProjectIds])]
  );
  const [selCompanies, setSelCompanies] = useState(
    editUser?.selCompanies || []
  );
  const [selCities, setSelCities] = useState(editUser?.selCities || []);
  const [accessValidTill, setAccessValidTill] = useState(
    editUser?.accessValidTill || ""
  );
  const [accessValidTillError, setAccessValidTillError] = useState("");
  const [gridFilter, setGridFilter] = useState("");
  const [saved, setSaved] = useState(false);
  const [saveSummary, setSaveSummary] = useState("");
  const [formError, setFormError] = useState("");

  function handleSubmit() {
    let hasError = false;

    if (!firstName.trim()) {
      setFirstNameError("First name is mandatory.");
      hasError = true;
    } else {
      setFirstNameError("");
    }

    if (!lastName.trim()) {
      setLastNameError("Last name is mandatory.");
      hasError = true;
    } else {
      setLastNameError("");
    }

    if (!email.trim()) {
      setEmailError("Email ID is mandatory.");
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (!mobile.trim()) {
      setMobileError("Contact number is mandatory.");
      hasError = true;
    } else if (!/^[0-9]{10}$/.test(mobile.replace(/\D/g, ""))) {
      setMobileError("Enter a valid 10-digit contact number.");
      hasError = true;
    } else {
      setMobileError("");
    }

    const panOk = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(pan.trim());
    if (!pan.trim()) {
      setPanError("PAN number is mandatory.");
      hasError = true;
    } else if (!panOk) {
      setPanError("Enter a valid 10-character PAN (e.g. ABCPK1234F).");
      hasError = true;
    } else {
      setPanError("");
    }

    if (!dob) {
      setDobError("Date of birth is mandatory.");
      hasError = true;
    } else {
      setDobError("");
    }

    if (idProofs.length === 0) {
      setIdProofError(
        "Upload at least one ID-proof document before saving."
      );
      hasError = true;
    } else {
      setIdProofError("");
    }

    if (!role) {
      setRoleError("Role is mandatory.");
      hasError = true;
    } else {
      setRoleError("");
    }

    if (!accessValidTill) {
      setAccessValidTillError(
        "Set an access valid-till date before saving."
      );
      hasError = true;
    } else {
      setAccessValidTillError("");
    }

    if (hasError) {
      setFormError(
        "Please fill in all mandatory fields (marked *) before saving."
      );
      return;
    }
    setFormError("");
    const summary = computeAccessSummary(
      fullAccess,
      selProjects,
      selCompanies,
      selCities,
    );
    setSaveSummary(summary);
    setSaved(true);
    onSave &&
      onSave(
        {
          firstName,
          middleName,
          lastName,
          email,
          mobile,
          pan: pan.trim().toUpperCase(),
          dob,
          idProofs,
          idProofType: idProofs[0] ? idProofs[0].type : "",
          idProofName: idProofs[0] ? idProofs[0].name : "",
          designation,
          address,
          isActive,
          role,
          access: computeAccessSummary(
            fullAccess,
            selProjects,
            selCompanies,
            selCities,
          ),
          selProjects,
          selCompanies,
          selCities,
          accessValidTill,
          // Only keep creator-granted projects that weren't just
          // unchecked — that's how an admin actually removes the
          // automatic mapping.
          creatorProjects: creatorProjectIds.filter((id) =>
            selProjects.includes(id),
          ),
        },
        editUser ? editUser.id : null,
      );
  }

  return (
    <div>
      <TopBar
        title={editUser ? "Update User" : "Add New User"}
        sub={
          editUser
            ? "Editing " + userFullName(editUser) + "'s account and access"
            : "Invite a new user to your Developer Portal account"
        }
        onMenuClick={onMenuClick}
      />
      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-3">
          <span style={{ fontSize: 18 }}>✅</span>
          <div>
            <div className="fw-semibold small">
              {editUser
                ? [firstName, middleName, lastName].filter(Boolean).join(" ") + "'s access has been updated."
                : "Invite sent to " + [firstName, middleName, lastName].filter(Boolean).join(" ") + "."}
            </div>
            <div className="text-secondary small">
              Access scope saved: {saveSummary}.
            </div>
          </div>
          <button
            className="btn btn-outline-navy btn-sm ms-auto"
            onClick={onDone}
          >
            Back to Users
          </button>
        </div>
      )}
      {/* Account history + review-date panel is only meaningful for an
          existing user — a brand-new user has no created/login/review
          history yet, so it's hidden on the "Add New User" form. */}
      {editUser && (
        <>
          <div className="kpi-card p-3 mb-3 d-flex flex-wrap gap-4">
            <div>
              <div className="text-secondary small">Created on</div>
              <div className="small fw-semibold">
                {editUser.createdOn || "—"}
              </div>
            </div>
            <div>
              <div className="text-secondary small">Last modified</div>
              <div className="small fw-semibold">
                {editUser.modifiedOn || "—"}
              </div>
            </div>
            <div>
              <div className="text-secondary small">First login</div>
              <div className="small fw-semibold">
                {editUser.firstAccess
                  ? "Already logged in"
                  : "Not logged in yet"}
              </div>
            </div>
            <div>
              <div className="text-secondary small">Last login</div>
              <div className="small fw-semibold">
                {editUser.lastLogin || "Never logged in"}
              </div>
            </div>
            <div>
              <div className="text-secondary small">Last review date</div>
              <div className="small fw-semibold">
                {editUser.lastReviewedOn || "Not yet reviewed"}
              </div>
            </div>
            <div>
              <div className="text-secondary small">
                Next review date{" "}
                <span className="fw-normal">
                  (read-only — set by policy)
                </span>
              </div>
              <div className="small fw-semibold">
                {editUser.reviewDue ||
                  computeNextReviewDate(editUser.lastReviewedOn)}
              </div>
            </div>
          </div>
          <div className="small text-secondary mb-3">
            Review dates aren't editable here — company policy reviews
            every user's access {REVIEW_POLICY_DAYS} days after their
            last review (or after account creation, for a new user).
          </div>
        </>
      )}
      <FormCard>
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <label className="form-label small fw-semibold">
            First name *
          </label>
          <input
            className={"form-control" + (firstNameError ? " is-invalid" : "")}
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              if (firstNameError) setFirstNameError("");
            }}
          />
          {firstNameError && (
            <div className="invalid-feedback d-block">{firstNameError}</div>
          )}
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small fw-semibold">
            Middle name
          </label>
          <input
            className="form-control"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small fw-semibold">
            Last name *
          </label>
          <input
            className={"form-control" + (lastNameError ? " is-invalid" : "")}
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              if (lastNameError) setLastNameError("");
            }}
          />
          {lastNameError && (
            <div className="invalid-feedback d-block">{lastNameError}</div>
          )}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">
          Email ID *
        </label>
        <input
          type="email"
          className={"form-control" + (emailError ? " is-invalid" : "")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          placeholder="Used to sign in to the Developer Portal"
        />
        {emailError && (
          <div className="invalid-feedback d-block">{emailError}</div>
        )}
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">
          Contact number *
        </label>
        <input
          className={"form-control" + (mobileError ? " is-invalid" : "")}
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value);
            if (mobileError) setMobileError("");
          }}
        />
        {mobileError && (
          <div className="invalid-feedback d-block">{mobileError}</div>
        )}
      </div>
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label small fw-semibold">
            PAN number *
          </label>
          <input
            className={"form-control text-uppercase" + (panError ? " is-invalid" : "")}
            value={pan}
            maxLength={10}
            placeholder="ABCPK1234F"
            onChange={(e) => {
              setPan(e.target.value);
              if (panError) setPanError("");
            }}
          />
          {panError && (
            <div className="invalid-feedback d-block">{panError}</div>
          )}
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label small fw-semibold">
            Date of birth *
          </label>
          <input
            type="date"
            className={"form-control" + (dobError ? " is-invalid" : "")}
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              if (dobError) setDobError("");
            }}
          />
          {dobError && (
            <div className="invalid-feedback d-block">{dobError}</div>
          )}
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">
          ID-proof document *
        </label>
        <div className="alert alert-info small py-2 mb-2">
          📌 At least one ID-proof document is mandatory. Pick the ID
          type, then upload the file (PDF or image). Uploaded documents
          appear in the grid below — click <b>View</b> to open one
          full-screen.
        </div>
        <div className="row g-2">
          <div className="col-12 col-md-5">
            <select
              className={"form-select" + (idProofError ? " is-invalid" : "")}
              value={pendingIdType}
              onChange={(e) => {
                setPendingIdType(e.target.value);
                if (idProofError) setIdProofError("");
              }}
            >
              <option value="">Select ID type…</option>
              <option>Aadhaar Card</option>
              <option>PAN Card</option>
              <option>Passport</option>
              <option>Driving License</option>
              <option>Voter ID</option>
            </select>
          </div>
          <div className="col-12 col-md-7">
            <input
              ref={idProofInputRef}
              type="file"
              className={"form-control" + (idProofError ? " is-invalid" : "")}
              accept="image/*,application/pdf"
              onChange={(e) => addIdProof(e.target.files)}
            />
          </div>
        </div>
        {idProofError && (
          <div className="invalid-feedback d-block">{idProofError}</div>
        )}
        <div className="kpi-card p-0 table-responsive mt-2">
          <table className="table table-sm mb-0 align-middle">
            <thead>
              <tr className="text-secondary small">
                <th style={{ width: 40 }}>#</th>
                <th>ID type</th>
                <th>File name</th>
                <th>Uploaded</th>
                <th style={{ width: 150 }}></th>
              </tr>
            </thead>
            <tbody>
              {idProofs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center text-secondary small py-3"
                  >
                    No ID-proof document uploaded yet.
                  </td>
                </tr>
              )}
              {idProofs.map((d, i) => (
                <tr key={d.id}>
                  <td className="small">{i + 1}</td>
                  <td className="small">
                    {docTypeIcon(d.name)} {d.type || "—"}
                  </td>
                  <td className="small fw-semibold text-truncate" title={d.name}>
                    {d.name}
                  </td>
                  <td className="small text-secondary">
                    {d.date || "—"}
                    {d.size ? " · " + formatBytes(d.size) : ""}
                  </td>
                  <td className="text-end text-nowrap">
                    <button
                      type="button"
                      className="btn btn-outline-navy btn-sm py-0 px-2 me-1"
                      style={{ fontSize: 11 }}
                      onClick={() => setViewingDoc(d)}
                    >
                      👁 View
                    </button>
                    {d.dataUrl && (
                      <a
                        href={d.dataUrl}
                        download={d.name}
                        className="btn btn-outline-navy btn-sm py-0 px-2 me-1"
                        style={{ fontSize: 11 }}
                      >
                        ⬇
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm py-0 px-2"
                      style={{ fontSize: 11 }}
                      onClick={() => removeIdProof(d.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-6">
          <label className="form-label small fw-semibold">
            Designation
          </label>
          <select
            className="form-select"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            <option>Site Engineer</option>
            <option>Accounts Manager</option>
            <option>Sales Coordinator</option>
            <option>Admin</option>
            <option>Other</option>
          </select>
        </div>
        <div className="col-12 col-md-6">
          <label className="form-label small fw-semibold">
            Profile picture
          </label>
          <input type="file" className="form-control" accept="image/*" />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Address</label>
        <textarea
          className="form-control"
          rows="2"
          maxLength={200}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3 form-check form-switch">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="userActiveSwitch"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        <label
          className="form-check-label small fw-semibold"
          htmlFor="userActiveSwitch"
        >
          {isActive ? "Active" : "Inactive"}
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">Role *</label>
        <select
          className={"form-select" + (roleError ? " is-invalid" : "")}
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            if (roleError) setRoleError("");
          }}
        >
          <option value="">Select role…</option>
          <option>Developer Admin</option>
          <option>Developer User</option>
        </select>
        {roleError && (
          <div className="invalid-feedback d-block">{roleError}</div>
        )}
      </div>
      <AccessLevelPicker
        fullAccess={fullAccess}
        setFullAccess={setFullAccess}
        selProjects={selProjects}
        setSelProjects={setSelProjects}
        selCompanies={selCompanies}
        setSelCompanies={setSelCompanies}
        selCities={selCities}
        setSelCities={setSelCities}
        gridFilter={gridFilter}
        setGridFilter={setGridFilter}
        creatorProjectIds={creatorProjectIds}
        accessValidTill={accessValidTill}
        setAccessValidTill={(v) => {
          setAccessValidTill(v);
          if (v) setAccessValidTillError("");
        }}
        accessValidTillError={accessValidTillError}
      />

      {formError && (
        <div className="alert alert-danger small py-2 mt-3 mb-0">
          {formError}
        </div>
      )}
      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-outline-navy" onClick={onDone}>
          Cancel
        </button>
        <button className="btn btn-navy" onClick={handleSubmit}>
          {editUser ? "Save changes" : "Send invite"}
        </button>
      </div>
      </FormCard>
      {viewingDoc && (() => {
        const url = viewingDoc.dataUrl || "";
        const nameLc = (viewingDoc.name || "").toLowerCase();
        const isImage =
          url.startsWith("data:image") ||
          /\.(png|jpe?g|gif|webp|bmp)$/.test(nameLc);
        const isPdf =
          url.startsWith("data:application/pdf") ||
          (viewingDoc.mime === "application/pdf") ||
          nameLc.endsWith(".pdf");
        return (
          <Modal
            title={
              (viewingDoc.type ? viewingDoc.type + " — " : "") +
              viewingDoc.name
            }
            width="96vw"
            onClose={() => setViewingDoc(null)}
          >
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <div className="small text-secondary">
                {docTypeIcon(viewingDoc.name)} {viewingDoc.name}
                {viewingDoc.size ? " · " + formatBytes(viewingDoc.size) : ""}
                {viewingDoc.date ? " · uploaded " + viewingDoc.date : ""}
              </div>
              {url && (
                <a
                  href={url}
                  download={viewingDoc.name}
                  className="btn btn-outline-navy btn-sm"
                >
                  ⬇ Download
                </a>
              )}
            </div>
            {isImage && url ? (
              <img
                src={url}
                alt={viewingDoc.name}
                style={{
                  width: "100%",
                  maxHeight: "76vh",
                  objectFit: "contain",
                  display: "block",
                }}
                className="rounded-3 border"
              />
            ) : isPdf && url ? (
              <iframe
                title={viewingDoc.name}
                src={url}
                style={{
                  width: "100%",
                  height: "76vh",
                  border: "1px solid #dee2e6",
                  borderRadius: 8,
                }}
              />
            ) : (
              <div className="kpi-card p-5 text-center">
                <div className="fs-1 mb-2">
                  {docTypeIcon(viewingDoc.name)}
                </div>
                <div className="fw-semibold">{viewingDoc.name}</div>
                <div className="small text-secondary mt-1 mb-3">
                  {url
                    ? "This file type can't be previewed in the browser. Use Download to open it."
                    : "This document was saved in an earlier session — the file itself isn't held in the prototype, so there's nothing to preview or download here."}
                </div>
                {url && (
                  <a
                    href={url}
                    download={viewingDoc.name}
                    className="btn btn-navy btn-sm"
                  >
                    ⬇ Download {viewingDoc.name}
                  </a>
                )}
              </div>
            )}
            <div className="small text-secondary mt-2">
              🔒 ID-proof documents are shown inline and are not stored on
              this device. Downloads are logged and should only be taken
              when required for verification.
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
