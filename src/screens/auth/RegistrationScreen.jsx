// src/screens/auth/RegistrationScreen.jsx
// Provides (global): RegistrationScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= REGISTRATION ================= */
function RegistrationScreen({
  onDone,
  onCancel,
  onForgotPassword,
  storedCredId,
  setStoredCredId,
  passkeyEnabled,
}) {
  const [step, setStep] = useState(0); // 0 email,1 verify,2 password,3 passkey,4 terms,5 done,-1 disagreed,-2 already registered
  const [email, setEmail] = useState("");
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileSent, setMobileSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [mobileOtp, setMobileOtp] = useState(["", "", "", "", "", ""]);
  const [emailOtp, setEmailOtp] = useState(["", "", "", "", "", ""]);
  const [mobileOtpError, setMobileOtpError] = useState("");
  const [emailOtpError, setEmailOtpError] = useState("");
  // Additional details captured alongside contact verification —
  // DOB and PAN for KYC, plus a supporting document upload.
  const [regDob, setRegDob] = useState("");
  const [regPan, setRegPan] = useState("");
  const [regDoc, setRegDoc] = useState(null);
  const [regDetailsError, setRegDetailsError] = useState("");
  const REG_OTP = "123456";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [passkeyStatus, setPasskeyStatus] = useState("");
  const [agreeChecked, setAgreeChecked] = useState(false);
  const [showDisagreeConfirm, setShowDisagreeConfirm] = useState(false);

  const fullSteps = [
    "Verify identity",
    "Confirm contact",
    "Set password",
    "Passkey (optional)",
    "Terms & consent",
  ];
  const steps = passkeyEnabled
    ? fullSteps
    : fullSteps.filter((_, i) => i !== 3);
  const stepIndex =
    step < 0
      ? steps.length - 1
      : passkeyEnabled
        ? step
        : step >= 4
          ? step - 1
          : step;

  function submitEmail(e) {
    e.preventDefault();
    if (!email.trim()) return;
    if (isEmailRegistered(email)) {
      setStep(-2);
      return;
    }
    setStep(1);
  }

  function handleOtpBoxChange(setArr, arr, i, val, prefix) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...arr];
    next[i] = val;
    setArr(next);
    if (val && i < 5) {
      document.getElementById(prefix + (i + 1))?.focus();
    }
  }
  function verifyMobileOtp() {
    if (mobileOtp.join("") === REG_OTP) {
      setMobileOtpError("");
      setMobileVerified(true);
    } else {
      setMobileOtpError("Incorrect OTP. Demo OTP is 123456.");
    }
  }
  function verifyEmailOtp() {
    if (emailOtp.join("") === REG_OTP) {
      setEmailOtpError("");
      setEmailVerified(true);
    } else {
      setEmailOtpError("Incorrect OTP. Demo OTP is 123456.");
    }
  }
  function confirmDisagree() {
    setShowDisagreeConfirm(false);
    setStep(-1);
  }
  async function setupPasskey() {
    setPasskeyStatus("waiting");
    const res = await registerPasskey(email || DUMMY_USER);
    if (res.ok) {
      setStoredCredId(res.id);
      setPasskeyStatus("added");
    } else if (res.reason === "insecure-context") {
      setPasskeyStatus("insecure");
    } else {
      setPasskeyStatus("error");
    }
  }

  if (step === -1) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
        <div className="text-center" style={{ maxWidth: 420 }}>
          <div
            className="pk-icon mb-3"
            style={{ background: "#fdeaea", color: "#c02b2b" }}
          >
            ✕
          </div>
          <h4 className="fw-bold mb-2">
            Your response has been recorded
          </h4>
          <p className="text-secondary small">
            Since you didn't agree to the Developer Portal's terms and
            conditions, we can't set up your account right now. This has
            been logged for internal review and is visible to your BD
            relationship manager in PAMS, who will reach out to you.
          </p>
          <button
            className="btn btn-outline-navy mt-2"
            onClick={onCancel}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Dedicated "you already have an account" screen — reached from the
  // email step whenever that address is already on file. A full
  // screen (rather than a small inline error) so the next steps are
  // unmistakable: sign in, or recover the password, using this exact
  // account.
  if (step === -2) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100 p-4">
        <div className="text-center" style={{ maxWidth: 440 }}>
          <div
            className="pk-icon mb-3"
            style={{ background: "#eaf1fb", color: "var(--navy)" }}
          >
            ℹ
          </div>
          <h4 className="fw-bold mb-2">You're already registered</h4>
          <p className="text-secondary small">
            An account already exists on the HDFC Developer Portal for
          </p>
          <p className="fw-semibold mb-3">{maskEmail(email)}</p>
          <p className="text-secondary small">
            Please sign in instead — use your existing password, or the
            Passkey tab if you've set one up on this device.
          </p>
          <button
            className="btn btn-navy w-100 fw-semibold mt-2"
            onClick={onCancel}
          >
            Go to login
          </button>
          <button
            className="btn btn-outline-navy w-100 fw-semibold mt-2"
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>
          <button
            className="btn btn-link text-secondary mt-1"
            onClick={() => setStep(0)}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-4"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="bg-white rounded-4 shadow-sm p-4 p-md-5"
        style={{ width: "100%", maxWidth: 560 }}
      >
        <div className="mb-4">
          <img
            className="brand-logo mb-3"
            src={LOGO_DATA_URI}
            alt="HDFC Bank"
            style={{ display: "block" }}
          />
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h5 className="fw-bold mb-0">
              Developer Portal Registration
            </h5>
            {step < 5 && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCancel();
                }}
                className="small text-secondary"
                style={{ textDecoration: "none" }}
              >
                ← Back to login
              </a>
            )}
          </div>
        </div>

        {step < 5 && (
          <div className="d-flex justify-content-between position-relative mb-4 flex-wrap gap-2">
            {steps.map((s, i) => (
              <div
                key={i}
                className="d-flex flex-column align-items-center gap-1"
                style={{ minWidth: 90 }}
              >
                <div
                  className={
                    "stepper-dot " +
                    (i < stepIndex
                      ? "done"
                      : i === stepIndex
                        ? "now"
                        : "")
                  }
                >
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className="step-label text-center">{s}</span>
              </div>
            ))}
          </div>
        )}

        {step === 0 && (
          <form onSubmit={submitEmail}>
            <p className="text-secondary small">
              Enter the email address that was registered at the time of
              your empanelment with the bank.
            </p>
            <div className="mb-3">
              <label className="form-label small fw-semibold">
                Registered email address *
              </label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-navy w-100 fw-semibold"
            >
              Continue
            </button>
            <p className="text-center small text-secondary mt-3">
              Not empanelled yet? Contact your BD relationship manager.
            </p>
          </form>
        )}

        {step === 1 && (
          <div>
            <p className="text-secondary small">
              We found a matching empanelment record. For your security,
              we're showing masked details — verify both with an OTP
              before continuing.
            </p>

            <div className="repeat-row p-3 mb-3">
              <div className="fw-semibold small mb-3">
                Additional details
              </div>
              {regDetailsError && (
                <div className="alert alert-danger py-2 small">
                  {regDetailsError}
                </div>
              )}
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={regDob}
                  onChange={(e) => setRegDob(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  PAN No *
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={regPan}
                  onChange={(e) =>
                    setRegPan(e.target.value.toUpperCase())
                  }
                  placeholder="XXXXXXXXXX"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="form-label small fw-semibold">
                  Document Upload *
                </label>
                <div className="small text-secondary mb-1">
                  Upload relevant documents for KYC verification (PDF,
                  JPG, PNG)
                </div>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setRegDoc(
                      e.target.files && e.target.files[0]
                        ? e.target.files[0].name
                        : null
                    )
                  }
                />
              </div>
            </div>

            <div className="repeat-row p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold small">Mobile number</div>
                  <div className="text-secondary small">
                    {maskMobile(EMPANELLED_MOBILE)}
                  </div>
                </div>
                {mobileVerified ? (
                  <span className="status-pill bg-success-subtle text-success">
                    Verified ✓
                  </span>
                ) : !mobileSent ? (
                  <button
                    className="btn btn-outline-navy btn-sm"
                    onClick={() => setMobileSent(true)}
                  >
                    Send OTP
                  </button>
                ) : (
                  <span className="text-secondary small">OTP sent</span>
                )}
              </div>
              {mobileSent && !mobileVerified && (
                <div className="mt-3">
                  {mobileOtpError && (
                    <div className="alert alert-danger py-2 small">
                      {mobileOtpError}
                    </div>
                  )}
                  <div className="d-flex gap-2 mb-2">
                    {mobileOtp.map((v, i) => (
                      <input
                        key={i}
                        id={"regmob-" + i}
                        className="form-control otp-box"
                        maxLength="1"
                        value={v}
                        onChange={(e) =>
                          handleOtpBoxChange(
                            setMobileOtp,
                            mobileOtp,
                            i,
                            e.target.value,
                            "regmob-",
                          )
                        }
                      />
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <a
                      href="#"
                      className="small"
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileOtp(["", "", "", "", "", ""]);
                      }}
                    >
                      Resend OTP
                    </a>
                    <button
                      className="btn btn-navy btn-sm"
                      onClick={verifyMobileOtp}
                    >
                      Verify
                    </button>
                  </div>
                  <p className="small text-secondary mt-2 mb-0">
                    Demo OTP: 123456
                  </p>
                </div>
              )}
            </div>
            <div className="repeat-row p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold small">Email address</div>
                  <div className="text-secondary small">
                    {maskEmail(email)}
                  </div>
                </div>
                {emailVerified ? (
                  <span className="status-pill bg-success-subtle text-success">
                    Verified ✓
                  </span>
                ) : !emailSent ? (
                  <button
                    className="btn btn-outline-navy btn-sm"
                    onClick={() => setEmailSent(true)}
                  >
                    Send OTP
                  </button>
                ) : (
                  <span className="text-secondary small">OTP sent</span>
                )}
              </div>
              {emailSent && !emailVerified && (
                <div className="mt-3">
                  {emailOtpError && (
                    <div className="alert alert-danger py-2 small">
                      {emailOtpError}
                    </div>
                  )}
                  <div className="d-flex gap-2 mb-2">
                    {emailOtp.map((v, i) => (
                      <input
                        key={i}
                        id={"regmail-" + i}
                        className="form-control otp-box"
                        maxLength="1"
                        value={v}
                        onChange={(e) =>
                          handleOtpBoxChange(
                            setEmailOtp,
                            emailOtp,
                            i,
                            e.target.value,
                            "regmail-",
                          )
                        }
                      />
                    ))}
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <a
                      href="#"
                      className="small"
                      onClick={(e) => {
                        e.preventDefault();
                        setEmailOtp(["", "", "", "", "", ""]);
                      }}
                    >
                      Resend OTP
                    </a>
                    <button
                      className="btn btn-navy btn-sm"
                      onClick={verifyEmailOtp}
                    >
                      Verify
                    </button>
                  </div>
                  <p className="small text-secondary mt-2 mb-0">
                    Demo OTP: 123456
                  </p>
                </div>
              )}
            </div>
            <button
              className="btn btn-navy w-100 fw-semibold"
              disabled={!mobileVerified || !emailVerified}
              onClick={() => {
                if (!regDob || !regPan.trim() || !regDoc) {
                  setRegDetailsError(
                    "Please fill in Date of Birth, PAN No, and upload a supporting document."
                  );
                  return;
                }
                if (
                  !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(regPan.trim())
                ) {
                  setRegDetailsError(
                    "Enter a valid PAN — 5 letters, 4 digits, 1 letter (e.g. AAAPL1234C)."
                  );
                  return;
                }
                setRegDetailsError("");
                setStep(2);
              }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-secondary small">
              Choose a password to use alongside OTP each time you log in.
            </p>
            {pwError && (
              <div className="alert alert-danger py-2 small">
                {pwError}
              </div>
            )}
            <div className="mb-3">
              <label className="form-label small fw-semibold">
                New password *
              </label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">
                Confirm password *
              </label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <PasswordPolicyChecklist password={password} />
            <button
              className="btn btn-navy w-100 fw-semibold"
              onClick={() => {
                if (!checkPasswordPolicy(password).valid) {
                  setPwError(
                    "Password doesn't meet the policy requirements above."
                  );
                  return;
                }
                if (password !== confirmPassword) {
                  setPwError("Passwords don't match.");
                  return;
                }
                setPwError("");
                setStep(passkeyEnabled ? 3 : 4);
              }}
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && passkeyEnabled && (
          <div className="text-center py-2">
            <div className="pk-icon mb-3">🔐</div>
            <h6 className="fw-bold mb-1">
              Set up a passkey for this device?
            </h6>
            <p className="text-secondary small mb-3">
              With a passkey, you can log in using this device's
              fingerprint, face, or screen lock — combined with OTP for
              additional due diligence. If you skip this, you'll log in
              with password + OTP instead, which still satisfies the
              bank's two-factor requirement.
            </p>
            {passkeyStatus === "added" && (
              <div className="alert alert-success py-2 small">
                Passkey added for this device.
              </div>
            )}
            {passkeyStatus === "insecure" && (
              <div className="alert alert-warning py-2 small">
                Real passkey setup needs https:// or localhost — this file
                was opened directly, so this step is simulated for the
                demo.
              </div>
            )}
            {passkeyStatus === "error" && (
              <div className="alert alert-warning py-2 small">
                Passkey setup wasn't completed on this device/browser —
                you can still continue with password + OTP.
              </div>
            )}
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-navy flex-fill"
                onClick={() => setStep(4)}
              >
                Skip — use password + OTP
              </button>
              <button
                className="btn btn-navy flex-fill"
                onClick={setupPasskey}
                disabled={passkeyStatus === "waiting"}
              >
                {passkeyStatus === "waiting"
                  ? "Waiting for device..."
                  : "Set up passkey"}
              </button>
            </div>
            {(passkeyStatus === "added" ||
              passkeyStatus === "insecure") && (
              <button
                className="btn btn-navy w-100 fw-semibold mt-3"
                onClick={() => setStep(4)}
              >
                Continue
              </button>
            )}
          </div>
        )}

        {step === 4 && (
          <div>
            <div
              className="repeat-row p-3 mb-3"
              style={{ maxHeight: 160, overflow: "auto" }}
            >
              <p className="small text-secondary mb-2">
                <b>Developer Portal — Terms &amp; Conditions (summary)</b>
              </p>
              <p className="small text-secondary">
                By using the Developer Portal you confirm the details you
                submit are accurate, consent to HDFC Bank verifying them
                against RERA and other regulatory sources, and agree to
                the bank's data-privacy and communication policies. Full
                terms are available via the links below.
              </p>
            </div>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="agreecheck"
                checked={agreeChecked}
                onChange={(e) => setAgreeChecked(e.target.checked)}
              />
              <label
                className="form-check-label small"
                htmlFor="agreecheck"
              >
                I have read and agree to the Terms &amp; Conditions,
                Privacy Policy, and consents of the Developer Portal.
              </label>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-navy flex-fill"
                onClick={() => setShowDisagreeConfirm(true)}
              >
                I do not agree
              </button>
              <button
                className="btn btn-navy flex-fill"
                disabled={!agreeChecked}
                onClick={() => {
                  addRegisteredEmail(email);
                  setStep(5);
                }}
              >
                Agree &amp; continue
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center py-3">
            <div
              className="pk-icon mb-3"
              style={{ background: "#e2f5ec", color: "#1c9e6b" }}
            >
              ✓
            </div>
            <h5 className="fw-bold mb-2">Registration complete</h5>
            <p className="text-secondary small">
              Your password{storedCredId ? " and passkey are" : " is"} set
              up. Log in below whenever you're ready.
            </p>
            <button
              className="btn btn-navy w-100 fw-semibold mt-2"
              onClick={onDone}
            >
              Continue to login
            </button>
          </div>
        )}
      </div>

      {showDisagreeConfirm && (
        <Modal
          title="Confirm"
          onClose={() => setShowDisagreeConfirm(false)}
          width={380}
        >
          <p className="small text-secondary">
            If you don't agree, we can't set up your Developer Portal
            account. This will be logged for internal review and made
            visible to your BD relationship manager in PAMS.
          </p>
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-navy flex-fill"
              onClick={() => setShowDisagreeConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-navy flex-fill"
              onClick={confirmDisagree}
            >
              Yes, I do not agree
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
