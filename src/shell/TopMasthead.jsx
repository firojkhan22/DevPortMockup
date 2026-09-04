// src/shell/TopMasthead.jsx
// Provides (global): TopMasthead
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function TopMasthead({
  onLogout,
  onNav,
  passkeyEnabled,
  setPasskeyEnabled,
  sidebarHidden,
  onToggleSidebar,
  active,
  verificationStage,
  setVerificationStage,
  builderUsers,
  demoLoggedInUserId,
  setDemoLoggedInUserId,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const usersForBell = builderUsers || [];
  const currentBellUser = usersForBell.find((u) => u.id === demoLoggedInUserId);
  const currentUserIsFrozen =
    currentBellUser && userReviewState(currentBellUser) === "frozen";
  const frozenUsers = usersForBell.filter(
    (u) => userReviewState(u) === "frozen" && u.id !== demoLoggedInUserId,
  );
  const dueSoonUsers = usersForBell.filter(
    (u) => userReviewState(u) === "due_soon",
  );
  // Demo: the logged-in identity's own password expiry — proactive
  // warning, distinct from the reactive "password already expired"
  // block that exists at login. Fixed reference date so this
  // agrees with every other date calc in the app.
  const DEMO_PASSWORD_EXPIRES_ON = "20-Aug-2026";
  const daysUntilPasswordExpiry = daysUntilReview(DEMO_PASSWORD_EXPIRES_ON);
  const passwordExpiringSoon =
    daysUntilPasswordExpiry !== null &&
    daysUntilPasswordExpiry >= 0 &&
    daysUntilPasswordExpiry <= 14;
  const reviewNotificationCount =
    frozenUsers.length +
    dueSoonUsers.length +
    (passwordExpiringSoon ? 1 : 0) +
    (currentUserIsFrozen ? 1 : 0);
  return (
    <div className="d-flex justify-content-between align-items-center px-3 px-md-4 py-2 bg-white border-bottom">
      <div
        className="d-flex align-items-center gap-2"
        style={{ flex: 1 }}
      >
        <button
          className={
            "masthead-menu-btn d-none d-md-flex " +
            (sidebarHidden ? "attention" : "")
          }
          title={sidebarHidden ? "Show menu" : "Toggle menu"}
          onClick={onToggleSidebar}
        >
          ☰
        </button>
        {NAV_LABEL_MAP[active] && (
          <span
            className="d-flex align-items-center gap-1 fw-semibold"
            style={{ color: "var(--navy)", fontSize: 14 }}
          >
            {NAV_LABEL_MAP[active].icon} {NAV_LABEL_MAP[active].label}
          </span>
        )}
      </div>
      <div className="d-flex align-items-center gap-2 ms-auto">
        <button
          className="btn btn-light rounded-circle border"
          style={{ width: 36, height: 36 }}
          title="System Settings (Demo)"
          onClick={() => setShowSettings(true)}
        >
          ⚙
        </button>
        <div className="dropdown">
          <button
            className="btn btn-light rounded-circle border position-relative"
            style={{ width: 36, height: 36 }}
            data-bs-toggle="dropdown"
          >
            🔔
            {(reviewNotificationCount > 0 || true) && (
              <span
                className="position-absolute bg-danger rounded-circle"
                style={{ width: 7, height: 7, top: 6, right: 7 }}
              ></span>
            )}
          </button>
          <ul
            className="dropdown-menu dropdown-menu-end shadow-sm"
            style={{ width: 300 }}
          >
            <li className="dropdown-header">Notifications</li>
            {currentUserIsFrozen && (
              <li>
                <a
                  className="dropdown-item small py-2 bg-danger-subtle text-danger fw-semibold"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNav && onNav("accessRevoked");
                  }}
                >
                  🚫 Your own access is revoked — review overdue
                  since {currentBellUser.reviewDue || "an earlier date"}.
                  Contact your admin to extend it.
                </a>
              </li>
            )}
            {passwordExpiringSoon && (
              <li>
                <a
                  className="dropdown-item small py-2"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNav && onNav("passkey");
                  }}
                >
                  🔑 Your password expires in {daysUntilPasswordExpiry}{" "}
                  day(s) — change it before {DEMO_PASSWORD_EXPIRES_ON}
                </a>
              </li>
            )}
            {frozenUsers.map((u) => (
              <li key={"frozen-" + u.id}>
                <a
                  className="dropdown-item small py-2"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNav && onNav("usersListing");
                  }}
                >
                  🔒 {u.firstName} {u.lastName}'s access is frozen —
                  review overdue since {u.reviewDue}
                </a>
              </li>
            ))}
            {dueSoonUsers.map((u) => (
              <li key={"due-" + u.id}>
                <a
                  className="dropdown-item small py-2"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNav && onNav("usersListing");
                  }}
                >
                  ⏳ {u.firstName} {u.lastName}'s access review is due
                  in {daysUntilReview(u.reviewDue)} day(s)
                </a>
              </li>
            ))}
            {reviewNotificationCount > 0 && (
              <li>
                <hr className="dropdown-divider" />
              </li>
            )}
            <li>
              <a className="dropdown-item small py-2" href="#">
                Query raised on Green Valley Phase 2
              </a>
            </li>
            <li>
              <a className="dropdown-item small py-2" href="#">
                RERA extension approved — Riverside Heights
              </a>
            </li>
            <li>
              <a className="dropdown-item small py-2" href="#">
                2 documents pending — ASP(906773)
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item small text-center text-secondary"
                href="#"
              >
                View all
              </a>
            </li>
          </ul>
        </div>
        <div className="dropdown">
          <button
            className="btn btn-light rounded-circle border-0 text-white fw-bold small d-flex align-items-center justify-content-center"
            style={{ width: 36, height: 36, background: "var(--navy)" }}
            data-bs-toggle="dropdown"
          >
            FK
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            <li className="dropdown-header">Firoj Khan · NB3572</li>
            <li>
              <a
                className="dropdown-item small"
                href="#"
                onClick={() => onNav("profile")}
              >
                👤 My Profile
              </a>
            </li>
            {passkeyEnabled && (
              <li>
                <a
                  className="dropdown-item small"
                  href="#"
                  onClick={() => onNav("passkey")}
                >
                  🔑 Passkey Security
                </a>
              </li>
            )}
            <li>
              <a
                className="dropdown-item small"
                href="#"
                onClick={() => onNav("usersListing")}
              >
                👥 Manage Users
              </a>
            </li>
            <li>
              <a
                className="dropdown-item small"
                href="#"
                onClick={() => onNav("raiseIssue")}
              >
                🚩 Raise Issue
              </a>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <a
                className="dropdown-item small text-danger"
                href="#"
                onClick={onLogout}
              >
                ⎋ Log out
              </a>
            </li>
          </ul>
        </div>
      </div>
      {showSettings && (
        <DemoSettingsModal
          onClose={() => setShowSettings(false)}
          passkeyEnabled={passkeyEnabled}
          setPasskeyEnabled={setPasskeyEnabled}
          verificationStage={verificationStage}
          setVerificationStage={setVerificationStage}
          builderUsers={builderUsers}
          demoLoggedInUserId={demoLoggedInUserId}
          setDemoLoggedInUserId={setDemoLoggedInUserId}
        />
      )}
    </div>
  );
}
