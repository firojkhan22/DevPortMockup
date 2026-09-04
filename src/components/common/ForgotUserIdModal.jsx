// src/components/common/ForgotUserIdModal.jsx
// Provides (global): ForgotUserIdModal
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Popup for the login screen's "Forgot User ID?" link. Two distinct
// paths with two different disclosure strengths:
//  - Registered mobile number: OTP-verified, so the full login ID
//    (email) is revealed once the OTP checks out.
//  - Company PAN/CIN: not proof of live possession, so this only
//    ever shows partially-masked mobile/email plus the company name
//    — never the full login ID.
function ForgotUserIdModal({ onClose }) {
  const [tab, setTab] = useState("mobile"); // "mobile" | "pan"
  const RESET_OTP = "123456";

  // -- mobile + OTP path (identifies one person directly) --
  const [mobile, setMobile] = useState("");
  const [mobileStep, setMobileStep] = useState(0); // 0 enter, 1 otp, 2 result
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [mobileMatch, setMobileMatch] = useState(null);

  // -- PAN/CIN path (a company can have several users) --
  // 0 enter PAN/CIN, 1 pick a user from the list, 2 choose OTP
  // channel, 3 enter OTP, 4 result
  const [panQuery, setPanQuery] = useState("");
  const [panStep, setPanStep] = useState(0);
  const [panMatches, setPanMatches] = useState([]);
  const [selectedPanUser, setSelectedPanUser] = useState(null);
  const [panOtpChannel, setPanOtpChannel] = useState(""); // "mobile" | "email"
  const [panOtp, setPanOtp] = useState(["", "", "", "", "", ""]);
  const [panOtpError, setPanOtpError] = useState("");

  function switchTab(t) {
    setTab(t);
    setMobile("");
    setMobileStep(0);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setMobileMatch(null);
    resetPanFlow();
  }

  function resetPanFlow() {
    setPanQuery("");
    setPanStep(0);
    setPanMatches([]);
    setSelectedPanUser(null);
    setPanOtpChannel("");
    setPanOtp(["", "", "", "", "", ""]);
    setPanOtpError("");
  }

  function handleOtpChange(i, val, arr, setArr, prefix) {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...arr];
    next[i] = val;
    setArr(next);
    if (val && i < 5) {
      document.getElementById(prefix + (i + 1))?.focus();
    }
  }

  function verifyMobileOtp() {
    if (otp.join("") !== RESET_OTP) {
      setOtpError("Incorrect OTP. Demo OTP is 123456.");
      return;
    }
    setOtpError("");
    setMobileMatch(findByMobile(mobile));
    setMobileStep(2);
  }

  function handlePanSearch() {
    const matches = findAllByPanOrCin(panQuery);
    setPanMatches(matches);
    setPanStep(matches.length > 0 ? 1 : -1); // -1 = not found
  }

  function pickPanUser(user) {
    setSelectedPanUser(user);
    setPanOtpChannel("");
    setPanOtp(["", "", "", "", "", ""]);
    setPanOtpError("");
    setPanStep(2);
  }

  function sendPanOtp(channel) {
    setPanOtpChannel(channel);
    setPanOtp(["", "", "", "", "", ""]);
    setPanOtpError("");
    setPanStep(3);
  }

  function verifyPanOtp() {
    if (panOtp.join("") !== RESET_OTP) {
      setPanOtpError("Incorrect OTP. Demo OTP is 123456.");
      return;
    }
    setPanOtpError("");
    setPanStep(4);
  }

  return (
    <Modal title="Forgot User ID" onClose={onClose} width={480}>
      <div className="d-flex gap-2 mb-3">
        <button
          className={
            "btn btn-sm flex-fill " +
            (tab === "mobile" ? "btn-navy" : "btn-outline-navy")
          }
          onClick={() => switchTab("mobile")}
        >
          Registered mobile
        </button>
        <button
          className={
            "btn btn-sm flex-fill " +
            (tab === "pan" ? "btn-navy" : "btn-outline-navy")
          }
          onClick={() => switchTab("pan")}
        >
          Company PAN / CIN
        </button>
      </div>

      {tab === "mobile" && (
        <div>
          {mobileStep === 0 && (
            <>
              <p className="text-secondary small">
                We'll send an OTP to your registered mobile number.
                Once verified, we'll show your login ID right here.
              </p>
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Registered mobile number *
                </label>
                <input
                  className="form-control"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </div>
              <button
                className="btn btn-navy w-100 fw-semibold"
                disabled={!mobile.trim()}
                onClick={() => setMobileStep(1)}
              >
                Send OTP
              </button>
            </>
          )}
          {mobileStep === 1 && (
            <>
              <p className="text-secondary small">
                Enter the 6-digit OTP sent to {mobile}.
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
                    id={"fuidotp-" + i}
                    className="form-control otp-box"
                    maxLength="1"
                    value={v}
                    onChange={(e) =>
                      handleOtpChange(i, e.target.value, otp, setOtp, "fuidotp-")
                    }
                  />
                ))}
              </div>
              <p className="small text-secondary mb-3">
                Demo OTP: 123456
              </p>
              <button
                className="btn btn-navy w-100 fw-semibold"
                onClick={verifyMobileOtp}
              >
                Verify OTP
              </button>
            </>
          )}
          {mobileStep === 2 &&
            (mobileMatch ? (
              <div className="repeat-row p-3">
                <div className="small text-secondary mb-1">
                  Your login ID is
                </div>
                <div
                  className="fw-bold"
                  style={{ color: "var(--navy)", fontSize: 16 }}
                >
                  {mobileMatch.email}
                </div>
                <div className="small text-secondary mt-2">
                  Verified via OTP — use this to sign in below.
                </div>
              </div>
            ) : (
              <div className="alert alert-danger py-2 small">
                No account found for this mobile number. Please check
                and try again, or contact your BD relationship
                manager.
              </div>
            ))}
        </div>
      )}

      {tab === "pan" && (
        <div>
          {panStep === 0 && (
            <>
              <p className="text-secondary small">
                A company can have more than one registered user, so
                we'll show everyone at that company — pick your name,
                then verify with an OTP before we reveal your login
                ID.
              </p>
              <div className="mb-3">
                <label className="form-label small fw-semibold">
                  Company PAN or CIN *
                </label>
                <input
                  className="form-control"
                  value={panQuery}
                  onChange={(e) => setPanQuery(e.target.value)}
                  placeholder="e.g. AAAPL1234C"
                />
              </div>
              <button
                className="btn btn-navy w-100 fw-semibold"
                disabled={!panQuery.trim()}
                onClick={handlePanSearch}
              >
                Find users at this company
              </button>
            </>
          )}

          {panStep === -1 && (
            <div className="alert alert-danger py-2 small">
              No company found matching that PAN or CIN. Please check
              and try again, or contact your BD relationship manager.
            </div>
          )}

          {panStep === 1 && (
            <>
              <p className="text-secondary small mb-2">
                <b>{panMatches[0]?.company}</b> — {panMatches.length}{" "}
                registered user{panMatches.length === 1 ? "" : "s"}.
                Select your name to continue.
              </p>
              <div
                className="d-flex flex-column gap-2 mb-2"
                style={{ maxHeight: 260, overflowY: "auto" }}
              >
                {panMatches.map((u, i) => (
                  <div
                    key={i}
                    role="button"
                    className="repeat-row p-2"
                    onClick={() => pickPanUser(u)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-semibold small">
                          {u.name}
                        </div>
                        <div className="text-secondary small">
                          {u.role} · {maskMobilePartial(u.mobile)} ·{" "}
                          {maskEmail(u.email)}
                        </div>
                      </div>
                      <span
                        className="small fw-semibold"
                        style={{ color: "var(--navy)" }}
                      >
                        Select →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {panStep === 2 && selectedPanUser && (
            <>
              <p className="text-secondary small">
                Verify it's you, {selectedPanUser.name.split(" ")[0]}{" "}
                — send an OTP to your registered mobile or email.
              </p>
              <div className="d-flex flex-column gap-2">
                <button
                  className="btn btn-outline-navy text-start"
                  onClick={() => sendPanOtp("mobile")}
                >
                  Send OTP to mobile{" "}
                  {maskMobilePartial(selectedPanUser.mobile)}
                </button>
                <button
                  className="btn btn-outline-navy text-start"
                  onClick={() => sendPanOtp("email")}
                >
                  Send OTP to email{" "}
                  {maskEmail(selectedPanUser.email)}
                </button>
              </div>
              <button
                className="btn btn-link text-secondary mt-2 p-0"
                onClick={() => setPanStep(1)}
              >
                ← Not {selectedPanUser.name.split(" ")[0]}? Pick
                someone else
              </button>
            </>
          )}

          {panStep === 3 && (
            <>
              <p className="text-secondary small">
                Enter the 6-digit OTP sent to your registered{" "}
                {panOtpChannel}.
              </p>
              {panOtpError && (
                <div className="alert alert-danger py-2 small">
                  {panOtpError}
                </div>
              )}
              <div className="d-flex gap-2 mb-3">
                {panOtp.map((v, i) => (
                  <input
                    key={i}
                    id={"panotp-" + i}
                    className="form-control otp-box"
                    maxLength="1"
                    value={v}
                    onChange={(e) =>
                      handleOtpChange(
                        i,
                        e.target.value,
                        panOtp,
                        setPanOtp,
                        "panotp-"
                      )
                    }
                  />
                ))}
              </div>
              <p className="small text-secondary mb-3">
                Demo OTP: 123456
              </p>
              <button
                className="btn btn-navy w-100 fw-semibold"
                onClick={verifyPanOtp}
              >
                Verify OTP
              </button>
            </>
          )}

          {panStep === 4 && selectedPanUser && (
            <div className="repeat-row p-3">
              <div className="small text-secondary mb-1">
                Your login ID is
              </div>
              <div
                className="fw-bold"
                style={{ color: "var(--navy)", fontSize: 16 }}
              >
                {selectedPanUser.email}
              </div>
              <div className="small text-secondary mt-2">
                Verified via OTP — use this to sign in below.
              </div>
            </div>
          )}
        </div>
      )}

      <button
        className="btn btn-outline-navy w-100 mt-3"
        onClick={onClose}
      >
        Close
      </button>
    </Modal>
  );
}
