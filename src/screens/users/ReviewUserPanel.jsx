// src/screens/users/ReviewUserPanel.jsx
// Provides (global): ReviewUserPanel
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// "Reviewing" a user means checking whether their role/access level
// is still relevant — confirming leaves their access as-is and
// pushes the next review out a quarter; revoking deactivates them.
// Shown for any user, but most relevant once their review is due
// soon or already overdue (frozen).
// Inline review panel — replaces the list (not a popup), matching
// how other screens in this app do a full-content swap with a
// "Back" action rather than an overlay.
function ReviewUserPanel({ user, onBack, onReview }) {
  const [fullAccess, setFullAccess] = useState(user.access === "Full Access");
  const creatorProjectIds = user.creatorProjects || [];
  const [selProjects, setSelProjects] = useState(
    [...new Set([...(user.selProjects || []), ...creatorProjectIds])]
  );
  const [selCompanies, setSelCompanies] = useState(user.selCompanies || []);
  const [selCities, setSelCities] = useState(user.selCities || []);
  const [gridFilter, setGridFilter] = useState("");
  const [accessValidTill, setAccessValidTill] = useState(
    user.accessValidTill || ""
  );
  const [accessValidTillError, setAccessValidTillError] = useState("");

  function accessData() {
    return {
      access: computeAccessSummary(fullAccess, selProjects, selCompanies, selCities),
      selProjects,
      selCompanies,
      selCities,
      accessValidTill,
      creatorProjects: creatorProjectIds.filter((id) =>
        selProjects.includes(id),
      ),
    };
  }

  function requireValidTill(next) {
    if (!accessValidTill) {
      setAccessValidTillError(
        "Set an access valid-till date before continuing."
      );
      return;
    }
    setAccessValidTillError("");
    next();
  }

  return (
    <div>
      <TopBar
        title={"Review access — " + userFullName(user)}
        sub="Confirm whether this access is still relevant for this user — adjust it below if needed — or revoke it entirely."
        action={
          <button className="btn btn-outline-navy btn-sm" onClick={onBack}>
            ← Back to list
          </button>
        }
      />
      <div className="kpi-card p-3 mb-3 small" style={{ maxWidth: 520 }}>
        <div className="row g-2">
          <div className="col-6">
            <div className="text-secondary">Role</div>
            <div className="fw-semibold">{user.role}</div>
          </div>
          <div className="col-6">
            <div className="text-secondary">Designation</div>
            <div className="fw-semibold">{user.designation}</div>
          </div>
          <div className="col-6">
            <div className="text-secondary">Last reviewed</div>
            <div className="fw-semibold">
              {user.lastReviewedOn || "Never"}
            </div>
          </div>
          <div className="col-6">
            <div className="text-secondary">Email</div>
            <div className="fw-semibold">{user.email}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760 }}>
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
      </div>

      <div className="d-flex gap-2" style={{ maxWidth: 760 }}>
        <button
          className="btn btn-navy flex-fill"
          onClick={() =>
            requireValidTill(() => {
              onReview(user.id, "confirm", accessData());
              onBack();
            })
          }
        >
          ✓ Confirm{" "}
          {JSON.stringify(accessData()) !==
          JSON.stringify({
            access: user.access,
            selProjects: user.selProjects || [],
            selCompanies: user.selCompanies || [],
            selCities: user.selCities || [],
            accessValidTill: user.accessValidTill || "",
            creatorProjects: user.creatorProjects || [],
          })
            ? "with updated access"
            : "— still relevant"}
        </button>
        <button
          className="btn btn-outline-danger flex-fill"
          onClick={() =>
            requireValidTill(() => {
              onReview(user.id, "revoke", accessData());
              onBack();
            })
          }
        >
          Revoke access
        </button>
      </div>
      <div className="small text-secondary mt-2">
        Either action sends a confirmation email to the user and
        admin, and updates their status here immediately.
      </div>
    </div>
  );
}
