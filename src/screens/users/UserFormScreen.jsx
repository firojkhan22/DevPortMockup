// src/screens/users/UserFormScreen.jsx
// Provides (global): UserFormScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function UserFormScreen({ onMenuClick, onDone, editUser, onSave }) {
  const [firstName, setFirstName] = useState(editUser?.firstName || "");
  const [middleName, setMiddleName] = useState(editUser?.middleName || "");
  const [lastName, setLastName] = useState(editUser?.lastName || "");
  const [email, setEmail] = useState(editUser?.email || "");
  const [mobile, setMobile] = useState(editUser?.mobile || "");
  const [designation, setDesignation] = useState(
    editUser?.designation || "Site Engineer"
  );
  const [address, setAddress] = useState(editUser?.address || "");
  const [isActive, setIsActive] = useState(
    editUser ? editUser.isActive !== false : true
  );
  const [role, setRole] = useState(editUser?.role || "Developer Admin");
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

  function handleSubmit() {
    if (!accessValidTill) {
      setAccessValidTillError(
        "Set an access valid-till date before saving."
      );
      return;
    }
    setAccessValidTillError("");
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
      <div className="kpi-card p-3 mb-3 d-flex flex-wrap gap-4">
        {editUser && (
          <>
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
          </>
        )}
        <div>
          <div className="text-secondary small">Last review date</div>
          <div className="small fw-semibold">
            {(editUser && editUser.lastReviewedOn) || "Not yet reviewed"}
          </div>
        </div>
        <div>
          <div className="text-secondary small">
            Next review date{" "}
            <span className="fw-normal">(read-only — set by policy)</span>
          </div>
          <div className="small fw-semibold">
            {(editUser && editUser.reviewDue) ||
              computeNextReviewDate(editUser && editUser.lastReviewedOn)}
          </div>
        </div>
      </div>
      <div className="small text-secondary mb-3">
        Review dates aren't editable here — company policy reviews
        every user's access {REVIEW_POLICY_DAYS} days after their
        last review (or after account creation, for a new user).
      </div>
      <FormCard>
      <div className="row g-3 mb-3">
        <div className="col-12 col-md-4">
          <label className="form-label small fw-semibold">
            First name *
          </label>
          <input
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
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
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">
          Email ID *
        </label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Used to sign in to the Developer Portal"
        />
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">
          Contact number *
        </label>
        <input
          className="form-control"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
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
        <label className="form-label small fw-semibold">Role</label>
        <select
          className="form-select"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Developer Admin</option>
          <option>Developer User</option>
        </select>
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

      <div className="d-flex justify-content-end gap-2 mt-3">
        <button className="btn btn-outline-navy" onClick={onDone}>
          Cancel
        </button>
        <button className="btn btn-navy" onClick={handleSubmit}>
          {editUser ? "Save changes" : "Send invite"}
        </button>
      </div>
      </FormCard>
    </div>
  );
}
