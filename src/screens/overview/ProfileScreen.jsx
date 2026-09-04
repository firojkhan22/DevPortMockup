// src/screens/overview/ProfileScreen.jsx
// Provides (global): ProfileScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function ProfileScreen({ onMenuClick, onViewCompanyUsers }) {
  const [name, setName] = useState("Firoj Khan");
  const [mobile, setMobile] = useState("+91 98765 43210");
  const [address, setAddress] = useState(
    "4th Floor, Safleworks House, Bandra Kurla Complex, Mumbai, Maharashtra \u2014 400051",
  );
  const [savedMsg, setSavedMsg] = useState(false);

  return (
    <div>
      <TopBar
        title="My Profile"
        sub="View and update your personal details"
        onMenuClick={onMenuClick}
      />
      {savedMsg && (
        <div className="alert alert-success py-2 small">
          Profile updated successfully.
        </div>
      )}
      <FormCard>
        <div className="d-flex align-items-center gap-3 mb-4">
          <div
            className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center"
            style={{
              width: 64,
              height: 64,
              background: "var(--navy)",
              fontSize: 22,
            }}
          >
            FK
          </div>
          <div>
            <div className="fw-bold">{name}</div>
            <span className="status-pill bg-success-subtle text-success">
              Approved
            </span>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Full name
            </label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Mobile number
            </label>
            <div className="input-group">
              <input
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              <span className="input-group-text bg-success-subtle text-success small">
                Verified ✓
              </span>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Email address
            </label>
            <div className="input-group">
              <input
                className="form-control"
                value="firoj.khan@safleworks.com"
                disabled
              />
              <span className="input-group-text bg-success-subtle text-success small">
                Verified ✓
              </span>
            </div>
            <div className="form-text">
              Locked since it's your verified login ID. Contact support to
              change it.
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">Role</label>
            <input
              className="form-control"
              value="Developer Admin"
              disabled
            />
          </div>
          <div className="col-12">
            <label className="form-label small fw-semibold">
              Address
            </label>
            <textarea
              className="form-control"
              rows="2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Access level
            </label>
            <input className="form-control" value="Full Access" disabled />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Linked builder company
            </label>
            <div className="input-group">
              <input
                className="form-control"
                value="Safleworks Constructions"
                disabled
              />
              <span className="input-group-text bg-success-subtle text-success small">
                Approved
              </span>
            </div>
            <div className="form-text">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onViewCompanyUsers();
                }}
                style={{ color: "var(--navy)" }}
              >
                🧑‍🤝‍🧑 View my company's users →
              </a>
            </div>
          </div>
        </div>
        <FormActions
          primary="Save changes"
          onCancel={() => setSavedMsg(true)}
        />
      </FormCard>
    </div>
  );
}
