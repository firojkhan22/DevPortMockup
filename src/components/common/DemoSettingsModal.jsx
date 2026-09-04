// src/components/common/DemoSettingsModal.jsx
// Provides (global): DemoSettingsModal
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= SYSTEM SETTINGS (DEMO) ================= */
function DemoSettingsModal({
  onClose,
  passkeyEnabled,
  setPasskeyEnabled,
  verificationStage,
  setVerificationStage,
  builderUsers,
  demoLoggedInUserId,
  setDemoLoggedInUserId,
}) {
  return (
    <Modal title="System Settings (Demo)" onClose={onClose} width={380}>
      <p className="text-secondary small">
        These are system-level toggles a bank system admin controls —
        not something any developer/user can change. Exposed here so
        you can demo both states.
      </p>
      {builderUsers && setDemoLoggedInUserId && (
        <div className="repeat-row p-3 mb-3">
          <div className="fw-semibold small mb-1">
            Logged in as (demo)
          </div>
          <div className="text-secondary small mb-2">
            This prototype only has one real login, so switch identity
            here to see what a different user — e.g. one whose access
            review has lapsed — experiences after logging in.
          </div>
          <select
            className="form-select form-select-sm"
            value={demoLoggedInUserId}
            onChange={(e) => setDemoLoggedInUserId(e.target.value)}
          >
            {builderUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {userFullName(u)}
                {userReviewState(u) === "frozen" ? " — access frozen" : ""}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="repeat-row p-3 d-flex justify-content-between align-items-center">
        <div>
          <div className="fw-semibold small">
            Passkey login (system admin only)
          </div>
          <div className="text-secondary small">
            Off: no user can register a new passkey or use an existing
            one — password + OTP only, everywhere. On: each user can
            then register a passkey and separately choose to enable or
            disable it for their own account.
          </div>
        </div>
        <div className="form-check form-switch mb-0">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            checked={passkeyEnabled}
            onChange={(e) => setPasskeyEnabled(e.target.checked)}
          />
        </div>
      </div>
      {verificationStage && setVerificationStage && (
        <div className="repeat-row p-3 mt-3">
          <div className="fw-semibold small mb-1">
            PAMS verification stage
          </div>
          <div className="text-secondary small mb-2">
            Mirrors the onboarding flowchart — controls what's locked
            in the sidebar and which banner shows.
          </div>
          {[
            { v: "incomplete", l: "Company KYC incomplete" },
            { v: "pending", l: "KYC complete, PAMS approval pending" },
            { v: "approved", l: "Builder & user approved (full access)" },
          ].map((opt) => (
            <div className="form-check" key={opt.v}>
              <input
                className="form-check-input"
                type="radio"
                name="verifystage"
                id={"vs-" + opt.v}
                checked={verificationStage === opt.v}
                onChange={() => setVerificationStage(opt.v)}
              />
              <label
                className="form-check-label small"
                htmlFor={"vs-" + opt.v}
              >
                {opt.l}
              </label>
            </div>
          ))}
        </div>
      )}
      <button className="btn btn-navy w-100 mt-3" onClick={onClose}>
        Close
      </button>
    </Modal>
  );
}
