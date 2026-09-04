// src/screens/auth/ForgotPasswordScreen.jsx
// Provides (global): ForgotPasswordScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= FORGOT PASSWORD / RESET ================= */
function ForgotPasswordScreen({ onDone, onCancel }) {
  const [step, setStep] = useState(0); // 0 email, 1 otp, 2 new password, 3 done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const RESET_OTP = "123456";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState("");

  function submitEmail(e) {
    e.preventDefault();
    if (email.trim()) setStep(1);
  }
  function handleOtpChange(i, val) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) {
      document.getElementById("fpotp-" + (i + 1))?.focus();
    }
  }
  function verifyOtp() {
    if (otp.join("") === RESET_OTP) {
      setOtpError("");
      setStep(2);
    } else {
      setOtpError("Incorrect OTP. Demo OTP is 123456.");
    }
  }
  function submitNewPassword() {
    if (!checkPasswordPolicy(password).valid) {
      setPwError("Password doesn't meet the policy requirements above.");
      return;
    }
    if (password !== confirmPassword) {
      setPwError("Passwords don't match.");
      return;
    }
    setPwError("");
    setStep(3);
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 p-4"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="bg-white rounded-4 shadow-sm p-4 p-md-5"
        style={{ width: "100%", maxWidth: 480 }}
      >
        <div className="d-flex align-items-center gap-2 mb-4">
          <img
            className="brand-logo"
            src={LOGO_DATA_URI}
            alt="HDFC Bank"
          />
          <span className="fw-bold">Reset password</span>
        </div>

        {step === 0 && (
          <form onSubmit={submitEmail}>
            <p className="text-secondary small">
              Enter your registered email ID and we'll send an OTP to
              your registered mobile number to verify it's you.
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
              Send OTP
            </button>
            <button
              type="button"
              className="btn btn-link w-100 mt-2"
              onClick={onCancel}
            >
              Back to login
            </button>
          </form>
        )}

        {step === 1 && (
          <div>
            <p className="text-secondary small">
              Enter the 6-digit OTP sent to your registered mobile
              number.
            </p>
            {otpError && (
              <div className="alert alert-danger py-2 small">
                {otpError}
              </div>
            )}
            <div className="d-flex gap-2 mb-3">
              {otp.map((v, i) => (
                <input
                  key={i}
                  id={"fpotp-" + i}
                  className="form-control otp-box"
                  maxLength="1"
                  value={v}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                />
              ))}
            </div>
            <p className="small text-secondary mb-3">Demo OTP: 123456</p>
            <button
              className="btn btn-navy w-100 fw-semibold"
              onClick={verifyOtp}
            >
              Verify
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="text-secondary small">
              Set a new password for your account.
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
              onClick={submitNewPassword}
            >
              Reset password
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-3">
            <div
              className="pk-icon mb-3"
              style={{ background: "#e2f5ec", color: "#1c9e6b" }}
            >
              ✓
            </div>
            <h5 className="fw-bold mb-2">Password reset</h5>
            <p className="text-secondary small">
              Your password has been changed. Log in below with your
              new password.
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
    </div>
  );
}
