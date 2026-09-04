// src/screens/auth/LoginScreen.jsx
// Provides (global): LoginScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= LOGIN ================= */
function LoginScreen({
  onLoginSuccess,
  onGoRegister,
  onForgotPassword,
  storedCredId,
  setStoredCredId,
  passkeyEnabled,
  setPasskeyEnabled,
  passkeySignInEnabled,
}) {
  const [tab, setTab] = useState("password");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [showFirstTimePasskey, setShowFirstTimePasskey] = useState(false);
  const [firstTimePasskeyStatus, setFirstTimePasskeyStatus] = useState("");
  const [pkStatus, setPkStatus] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [passwordExpired, setPasswordExpired] = useState(false);
  const [showForgotUserId, setShowForgotUserId] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [expiredPwError, setExpiredPwError] = useState("");
  const CORRECT_OTP = "123456";
  const effectiveTab =
    tab === "passkey" && !passkeyEnabled ? "password" : tab;

  function handlePasswordLogin(e) {
    e.preventDefault();
    if (!consentChecked) {
      setError(
        "Please provide your consent to data processing before continuing.",
      );
      return;
    }
    if (
      userId.trim() === EXPIRED_DEMO_USER &&
      password === EXPIRED_DEMO_PASS
    ) {
      setError("");
      setPasswordExpired(true);
      return;
    }
    if (userId.trim() === DUMMY_USER && password === DUMMY_PASS) {
      setError("");
      setShowOtp(true);
    } else {
      setError(
        "Invalid customer ID or password. Try the demo credentials below.",
      );
    }
  }
  function submitExpiredPasswordReset() {
    if (!checkPasswordPolicy(newPassword).valid) {
      setExpiredPwError(
        "Password doesn't meet the policy requirements above."
      );
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setExpiredPwError("Passwords don't match.");
      return;
    }
    setExpiredPwError("");
    setPasswordExpired(false);
    setShowOtp(true);
  }
  function handleOtpChange(i, val) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById("otp-" + (i + 1)).focus();
    }
  }
  function verifyOtp() {
    if (otp.join("") === CORRECT_OTP) {
      setShowOtp(false);
      if (!storedCredId && passkeyEnabled) {
        setFirstTimePasskeyStatus("");
        setShowFirstTimePasskey(true);
        return;
      }
      onLoginSuccess();
    } else {
      setOtpError("Incorrect OTP. Demo OTP is 123456.");
    }
  }
  async function setupFirstTimePasskey() {
    setFirstTimePasskeyStatus("waiting");
    const res = await registerPasskey(userId || DUMMY_USER);
    if (res.ok) {
      setStoredCredId(res.id);
      setFirstTimePasskeyStatus("added");
    } else if (res.reason === "insecure-context") {
      setFirstTimePasskeyStatus("insecure");
    } else {
      setFirstTimePasskeyStatus("error");
    }
  }
  async function handlePasskeyLogin() {
    setShowPasskey(true);
    setPkStatus("waiting");
    const res = await loginWithPasskey(storedCredId);
    if (res.ok) {
      setPkStatus("success");
      setTimeout(() => {
        setShowPasskey(false);
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        setShowOtp(true);
      }, 500);
    } else if (res.reason === "insecure-context") {
      setPkStatus("fallback");
      setTimeout(() => {
        setShowPasskey(false);
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        setShowOtp(true);
      }, 1400);
    } else if (res.reason === "NotAllowedError") {
      setPkStatus("cancelled");
    } else {
      setPkStatus("fallback");
      setTimeout(() => {
        setShowPasskey(false);
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        setShowOtp(true);
      }, 1400);
    }
  }

  return (
    <div
      className="row g-0"
      style={{ height: "100vh", overflowY: "auto" }}
    >
      <div
        className="gear-btn"
        onClick={() => setShowSettings(true)}
        title="System Settings (Demo)"
      >
        ⚙
      </div>
      <div
        className="col-12 d-md-none d-flex align-items-center gap-2 px-4 py-3"
        style={{ background: "var(--navy)" }}
      >
        <img className="brand-logo" src={LOGO_DATA_URI} alt="HDFC Bank" />
      </div>
      <div className="col-md-5 login-left p-0 d-none d-md-flex flex-column">
        <div
          className="login-watermark"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,.93) 0%, rgba(255,255,255,.85) 38%, rgba(11,61,122,.92) 100%), url(" +
              CONSTRUCTION_PHOTO_URI +
              ")",
          }}
        ></div>
        <div className="login-left-content d-flex flex-column h-100 p-4 p-md-5">
          <img
            className="brand-logo"
            src={LOGO_DATA_URI}
            alt="HDFC Bank"
            style={{ height: 45, width: "auto", alignSelf: "flex-start" }}
          />
          <div className="mt-5">
            <div className="mb-3">
              <span className="login-hero-tag">Developer Portal</span>
            </div>
            <h1 className="login-hero-title">
              Built for builders.
              <br />
              Backed by HDFC Bank.
            </h1>
            <p className="login-hero-sub">
              Submit projects, track approvals, and manage disbursements —
              all in one place.
            </p>
          </div>
          <div className="flex-fill"></div>
        </div>
      </div>
      <div
        className="col-12 col-md-7 d-flex align-items-center justify-content-center p-4 p-md-4"
        style={{ overflowY: "auto", maxHeight: "100vh" }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h3 className="fw-bold mb-1">Developer Portal Login</h3>
          <p className="text-secondary small mb-3">
            Sign in to access your Developer Portal.
          </p>
          {passkeyEnabled && (
            <ul className="nav nav-tabs login-tabs mb-3">
              <li className="nav-item flex-fill text-center">
                <button
                  className={
                    "nav-link w-100 border-0 " +
                    (effectiveTab === "password" ? "active" : "")
                  }
                  onClick={() => setTab("password")}
                >
                  Password
                </button>
              </li>
              <li className="nav-item flex-fill text-center">
                <button
                  className={
                    "nav-link w-100 border-0 " +
                    (effectiveTab === "passkey" ? "active" : "")
                  }
                  onClick={() => setTab("passkey")}
                >
                  Passkey
                </button>
              </li>
            </ul>
          )}

          {effectiveTab === "password" && (
            <form onSubmit={handlePasswordLogin}>
              {error && (
                <div className="alert alert-danger py-2 small">
                  {error}
                </div>
              )}
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <label className="form-label small fw-semibold">
                    Email ID
                  </label>
                  <a
                    href="#"
                    className="small text-danger text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowForgotUserId(true);
                    }}
                  >
                    Forgot User ID?
                  </a>
                </div>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email ID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <label className="form-label small fw-semibold">
                    Password
                  </label>
                  <a
                    href="#"
                    className="small text-danger text-decoration-none"
                    onClick={(e) => {
                      e.preventDefault();
                      onForgotPassword();
                    }}
                  >
                    Forgot Password
                  </a>
                </div>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-check mb-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="consentcheck"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                />
                <label
                  className="form-check-label small"
                  htmlFor="consentcheck"
                >
                  I hereby consent to collection and processing of my data
                  for availing Developer Portal services in the manner
                  described in the notice{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowConsent(true);
                    }}
                  >
                    here
                  </a>
                  .
                </label>
              </div>
              <button
                type="submit"
                className="btn btn-navy w-100 fw-semibold py-2"
              >
                Login Securely →
              </button>
              <p className="text-center text-secondary small mt-2 mb-0">
                Demo: {DUMMY_USER} / {DUMMY_PASS}
              </p>
              <p className="text-center text-secondary small mb-0">
                Password expired demo: {EXPIRED_DEMO_USER} /{" "}
                {EXPIRED_DEMO_PASS}
              </p>
              {passkeyEnabled && (
                <p className="text-center text-secondary small mb-0">
                  First login registers a real passkey for this device (if
                  supported), so you can try the Passkey tab next time.
                </p>
              )}
            </form>
          )}

          {effectiveTab === "passkey" && passkeyEnabled && (
            <div className="text-center py-2">
              <div className="pk-icon mb-2">🔐</div>
              {storedCredId && !passkeySignInEnabled ? (
                <>
                  <div className="fw-semibold mb-1">
                    Passkey sign-in is turned off
                  </div>
                  <p className="text-secondary small mb-3">
                    You've disabled passkey sign-in for this account in
                    Passkey Security. Use your password below, or turn
                    it back on after logging in.
                  </p>
                  <button
                    className="btn btn-outline-navy w-100 fw-semibold py-2"
                    onClick={() => setTab("password")}
                  >
                    Use password instead
                  </button>
                </>
              ) : (
                <>
                  <div className="fw-semibold mb-1">
                    Sign in with your passkey
                  </div>
                  <p className="text-secondary small mb-3">
                    Use your device's fingerprint, face, or screen lock to
                    continue.
                  </p>
                  <button
                    className="btn btn-navy w-100 fw-semibold py-2"
                    onClick={handlePasskeyLogin}
                  >
                    Continue with Passkey →
                  </button>
                  {!storedCredId && (
                    <p className="text-center text-secondary small mt-2">
                      No passkey registered yet in this session — log in with
                      password first, or this will use a one-time demo prompt.
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          <p className="text-center small mt-3 mb-1">
            New Developer Portal user?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onGoRegister();
              }}
            >
              Register with your empanelment email
            </a>
          </p>
          <p className="text-center small text-secondary mt-1">
            Privacy Policy | Disclaimer | User Agreement
          </p>
        </div>
      </div>

      {showForgotUserId && (
        <ForgotUserIdModal onClose={() => setShowForgotUserId(false)} />
      )}

      {passwordExpired && (
        <Modal
          title="Your password has expired"
          onClose={() => setPasswordExpired(false)}
          width={400}
        >
          <p className="text-secondary small">
            As per policy, passwords must be changed every{" "}
            {PASSWORD_POLICY.expiryDays} days. Please set a new password
            to continue.
          </p>
          {expiredPwError && (
            <div className="alert alert-danger py-2 small">
              {expiredPwError}
            </div>
          )}
          <div className="mb-3">
            <label className="form-label small fw-semibold">
              New password *
            </label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">
              Confirm password *
            </label>
            <input
              type="password"
              className="form-control"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
            />
          </div>
          <PasswordPolicyChecklist password={newPassword} />
          <button
            className="btn btn-navy w-100 fw-semibold"
            onClick={submitExpiredPasswordReset}
          >
            Set new password &amp; continue
          </button>
        </Modal>
      )}

      {showOtp && (
        <Modal
          title="Verify OTP"
          onClose={() => setShowOtp(false)}
          width={360}
        >
          <p className="text-secondary small">
            Sent to your registered mobile ending **34
          </p>
          {otpError && (
            <div className="alert alert-danger py-2 small">
              {otpError}
            </div>
          )}
          <div className="d-flex gap-2 justify-content-center my-3">
            {otp.map((v, i) => (
              <input
                key={i}
                id={"otp-" + i}
                className="form-control otp-box"
                maxLength="1"
                value={v}
                onChange={(e) => handleOtpChange(i, e.target.value)}
              />
            ))}
          </div>
          <p className="text-center small text-secondary">
            Time remaining: 04:35 &nbsp;|&nbsp; <a href="#">Resend OTP</a>
          </p>
          <button
            className="btn btn-navy w-100 fw-semibold"
            onClick={verifyOtp}
          >
            Verify and login
          </button>
          <p className="text-center small text-secondary mt-2">
            Demo OTP: 123456
          </p>
        </Modal>
      )}

      {showFirstTimePasskey && (
        <Modal
          title=""
          onClose={() => {
            setShowFirstTimePasskey(false);
            onLoginSuccess();
          }}
          width={360}
        >
          <div className="text-center py-2">
            <div className="pk-icon mb-3">🔐</div>
            <h6 className="fw-bold mb-1">
              Set up a passkey for this device?
            </h6>
            <p className="text-secondary small mb-3">
              First-time sign-in offer: with a passkey, you can log in
              using this device's fingerprint, face, or screen lock
              instead of password + OTP next time.
            </p>
            {firstTimePasskeyStatus === "added" && (
              <div className="alert alert-success py-2 small">
                Passkey added for this device.
              </div>
            )}
            {firstTimePasskeyStatus === "insecure" && (
              <div className="alert alert-warning py-2 small">
                Real passkey setup needs https:// or localhost — this
                file was opened directly, so this step is simulated
                for the demo.
              </div>
            )}
            {firstTimePasskeyStatus === "error" && (
              <div className="alert alert-warning py-2 small">
                Passkey setup wasn't completed on this device/browser
                — you can still continue with password + OTP.
              </div>
            )}
            {firstTimePasskeyStatus === "added" ||
            firstTimePasskeyStatus === "insecure" ||
            firstTimePasskeyStatus === "error" ? (
              <button
                className="btn btn-navy w-100 fw-semibold"
                onClick={() => {
                  setShowFirstTimePasskey(false);
                  onLoginSuccess();
                }}
              >
                Continue
              </button>
            ) : (
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-navy flex-fill"
                  onClick={() => {
                    setShowFirstTimePasskey(false);
                    onLoginSuccess();
                  }}
                >
                  Not now
                </button>
                <button
                  className="btn btn-navy flex-fill"
                  onClick={setupFirstTimePasskey}
                  disabled={firstTimePasskeyStatus === "waiting"}
                >
                  {firstTimePasskeyStatus === "waiting"
                    ? "Waiting for device..."
                    : "Set up passkey"}
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {showPasskey && (
        <Modal title="" onClose={() => setShowPasskey(false)} width={340}>
          <div className="text-center py-2">
            <div className="pk-icon mb-3">🖐️</div>
            {pkStatus === "waiting" && (
              <>
                <div className="fw-semibold mb-1">
                  Waiting for your device
                </div>
                <p className="text-secondary small">
                  Follow the prompt from your browser or operating system
                  to confirm it's you.
                </p>
              </>
            )}
            {pkStatus === "success" && (
              <>
                <div className="fw-semibold mb-1 text-success">
                  Verified
                </div>
                <p className="text-secondary small">Signing you in...</p>
              </>
            )}
            {pkStatus === "cancelled" && (
              <>
                <div className="fw-semibold mb-1 text-danger">
                  Cancelled
                </div>
                <p className="text-secondary small">
                  The passkey prompt was dismissed. Try again or use your
                  password.
                </p>
                <button
                  className="btn btn-outline-navy btn-sm mt-2"
                  onClick={() => setShowPasskey(false)}
                >
                  Close
                </button>
              </>
            )}
            {pkStatus === "fallback" && (
              <>
                <div className="fw-semibold mb-1">
                  Simulated demo prompt
                </div>
                <p className="text-secondary small">
                  Real WebAuthn needs an https:// or localhost address —
                  this file was opened directly, so we're simulating the
                  device confirmation for the demo.
                </p>
              </>
            )}
          </div>
        </Modal>
      )}

      {showConsent && (
        <Modal
          title="Notice and request for consent"
          onClose={() => setShowConsent(false)}
          width={680}
        >
          <div
            style={{ maxHeight: "60vh", overflow: "auto" }}
            className="small pe-2"
          >
            <p>
              HDFC Bank Limited ("Bank", "us", "we") respects your privacy
              and is committed to protecting your personal data.
            </p>
            <p>
              This notice explains how the Bank collects, uses, stores,
              discloses and transfers ("Processes") your personal data in
              connection with your use of the Developer Portal and related
              project-financing services ("Requested Service").
            </p>
            <p className="fw-semibold mb-1">
              1. Categories of personal data we process
            </p>
            <table className="table table-sm table-bordered">
              <tbody>
                <tr>
                  <td className="fw-semibold" style={{ width: "35%" }}>
                    Identity &amp; contact data
                  </td>
                  <td>Name, mobile number, email address, designation</td>
                </tr>
                <tr>
                  <td className="fw-semibold">Official identifiers</td>
                  <td>
                    PAN, CIN/LLPIN, GSTIN, other KYC documents of the
                    builder entity and key individuals
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold">
                    Project &amp; property data
                  </td>
                  <td>
                    Project address, RERA registration details,
                    construction stage, inventory, sale/disbursement
                    records
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold">
                    Financial &amp; account data
                  </td>
                  <td>
                    Bank account details, disbursement and payment
                    records, loan/finance references
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold">Device &amp; usage data</td>
                  <td>
                    IP address, device ID, login timestamps, approximate
                    location
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold">Authentication data</td>
                  <td>
                    Login credentials, OTP records, registered passkeys
                  </td>
                </tr>
                <tr>
                  <td className="fw-semibold">Communication data</td>
                  <td>
                    Queries, responses, support tickets, uploaded
                    documents and remarks
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="fw-semibold mb-1">
              2. Why we process this data
            </p>
            <p>
              To onboard and verify your project and builder details,
              process project approvals, disbursements and related banking
              services, meet KYC/AML and other regulatory obligations,
              prevent fraud, respond to queries and support requests, and
              send you service communications and applicable marketing
              offers.
            </p>
            <p className="fw-semibold mb-1">
              3. Who we may share it with
            </p>
            <p>
              Regulators and statutory authorities (e.g. RBI, tax
              authorities), auditors and legal advisors, technology and
              infrastructure service providers who support the Developer
              Portal, and fraud-prevention or credit-information agencies
              — each strictly for the purposes above and subject to
              applicable law.
            </p>
            <p className="fw-semibold mb-1">4. Your rights</p>
            <p>
              Under the Digital Personal Data Protection Act (DPDPA), you
              may access, correct, or request erasure of your personal
              data, nominate someone to act on your behalf in case of
              incapacity, and raise grievances — write to{" "}
              <a href="#">privacy@hdfc.bank.in</a> for any of these.
            </p>
            <p className="fw-semibold mb-1">5. Withdrawing consent</p>
            <p>
              You may withdraw consent at any time via your account
              settings. Processing carried out before withdrawal remains
              valid. Withdrawing consent may mean we're no longer able to
              provide some or all Developer Portal services, and related
              terms for discontinuation would then apply.
            </p>
            <p className="fw-semibold mb-1">6. Grievances</p>
            <p>
              If you have concerns about how we process your data, contact
              our Data Protection Officer at{" "}
              <a href="#">privacy@hdfc.bank.in</a>. If unresolved, you may
              escalate to the Data Protection Board of India.
            </p>
            <p className="text-secondary" style={{ fontSize: 11 }}>
              This is a summary notice for the Developer Portal. It does
              not reproduce the Bank's deposit-product consent notice; the
              full, authoritative privacy policy governs in case of any
              difference.
            </p>
          </div>
          <div className="d-flex gap-2 mt-3 pt-3 border-top">
            <button
              className="btn btn-outline-navy flex-fill"
              onClick={() => setShowConsent(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-navy flex-fill"
              onClick={() => {
                setConsentChecked(true);
                setShowConsent(false);
              }}
            >
              Accept
            </button>
          </div>
        </Modal>
      )}

      {showSettings && (
        <DemoSettingsModal
          onClose={() => setShowSettings(false)}
          passkeyEnabled={passkeyEnabled}
          setPasskeyEnabled={setPasskeyEnabled}
        />
      )}
    </div>
  );
}
