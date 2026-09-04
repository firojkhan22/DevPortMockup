// src/screens/users/PasskeyScreen.jsx
// Provides (global): PasskeyScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 4. PASSKEY SECURITY ================= */
function PasskeyScreen({
  onMenuClick,
  storedCredId,
  setStoredCredId,
  passkeySignInEnabled,
  setPasskeySignInEnabled,
}) {
  const [status, setStatus] = useState("");
  const [errDetail, setErrDetail] = useState("");
  async function addPasskey() {
    setStatus("waiting");
    const res = await registerPasskey(DUMMY_USER);
    if (res.ok) {
      setStoredCredId(res.id);
      setStatus("added");
    } else if (res.reason === "insecure-context") {
      setStatus("insecure");
    } else {
      setErrDetail(
        (res.reason || "Error") + (res.message ? ": " + res.message : ""),
      );
      setStatus("error");
    }
  }
  return (
    <div>
      <TopBar
        title="Passkey Security"
        sub="Manage passkeys registered for this account"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        {!storedCredId && status !== "added" && (
          <div className="text-center py-4">
            <div className="pk-icon mb-3">🔑</div>
            <div className="fw-semibold mb-1">No passkeys registered</div>
            <p className="text-secondary small mb-3">
              Add a passkey to sign in with your device's fingerprint,
              face, or screen lock — no password needed.
            </p>
            <button className="btn btn-navy" onClick={addPasskey}>
              + Set up passkey
            </button>
            {status === "waiting" && (
              <p className="small text-secondary mt-2">
                Waiting for your device...
              </p>
            )}
            {status === "insecure" && (
              <p className="small text-danger mt-2">
                Real passkey creation needs https:// or localhost. This
                file was opened directly from disk, so the browser is
                blocking the WebAuthn API — this will work once hosted.
              </p>
            )}
            {status === "error" && (
              <div className="text-start small mt-2">
                <p className="text-danger mb-1">
                  <b>Couldn't create a passkey.</b> Browser said:{" "}
                  <code>{errDetail}</code>
                </p>
                <ul
                  className="text-secondary mb-0"
                  style={{ paddingLeft: "1.1rem" }}
                >
                  <li>
                    If viewed inside a preview/iframe, the browser blocks
                    passkey creation there — download and open the file
                    directly, or host it.
                  </li>
                  <li>
                    If opened as a downloaded <code>file://</code>{" "}
                    address, serve it over <code>http://localhost</code>{" "}
                    or a real <code>https://</code> URL instead.
                  </li>
                  <li>
                    Otherwise, your device may not have a passkey method
                    set up yet.
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
        {(storedCredId || status === "added") && (
          <div>
            <div className="repeat-row p-3 d-flex justify-content-between align-items-center mb-2">
              <div>
                <div className="fw-semibold small">Passkey sign-in</div>
                <div className="text-secondary small">
                  {passkeySignInEnabled
                    ? "Enabled — you can sign in with this passkey."
                    : "Disabled — credential stays saved, but won't be offered at login until turned back on."}
                </div>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  checked={passkeySignInEnabled}
                  onChange={(e) => setPasskeySignInEnabled(e.target.checked)}
                />
              </div>
            </div>
            {!passkeySignInEnabled && (
              <div className="alert alert-warning py-2 small">
                Passkey sign-in is off for your account. You'll sign in
                with password + OTP until you switch this back on — the
                saved passkey itself hasn't been deleted.
              </div>
            )}
            <div className="repeat-row p-3 d-flex justify-content-between align-items-center">
              <div>
                <div className="fw-semibold small">This device</div>
                <div className="text-secondary small">
                  Added just now · Saved to this browser's password
                  manager · Credential ID:{" "}
                  {(storedCredId || "").slice(0, 18)}...
                </div>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setStoredCredId(null);
                  setStatus("");
                  setPasskeySignInEnabled(true);
                }}
              >
                Remove
              </button>
            </div>
            <button
              className="btn btn-outline-navy btn-sm mt-3"
              onClick={addPasskey}
            >
              + Add another passkey
            </button>
          </div>
        )}
      </FormCard>
    </div>
  );
}
