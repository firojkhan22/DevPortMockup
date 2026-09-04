// src/screens/overview/AccessRevokedScreen.jsx
// Provides (global): AccessRevokedScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Shown instead of any entry/update screen once a user's own
// access has been revoked — explains why, and that only an admin
// can fix it.
function AccessRevokedScreen({ onMenuClick, onBack }) {
  return (
    <div>
      <TopBar title="Access Revoked" onMenuClick={onMenuClick} />
      <div className="kpi-card p-4 text-center" style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="fs-1 mb-2">🚫</div>
        <div className="fw-semibold mb-2">
          Your access has been revoked
        </div>
        <div className="text-secondary small mb-3">
          Your periodic access review is overdue, so most actions —
          creating or updating a project, lead, campaign, user, or any
          other record — are unavailable until it's reviewed again.
          Please contact your application administrator to request an
          extension.
        </div>
        <button className="btn btn-navy" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
}
