// src/components/common/PasswordPolicyChecklist.jsx
// Provides (global): PasswordPolicyChecklist
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function PasswordPolicyChecklist({ password, policy }) {
  policy = policy || PASSWORD_POLICY;
  const { checks } = checkPasswordPolicy(password || "", policy);
  const rows = [
    [checks.length, policy.minLength + "–" + policy.maxLength + " characters"],
    policy.requireUpper && [checks.upper, "At least one uppercase letter"],
    policy.requireLower && [checks.lower, "At least one lowercase letter"],
    policy.requireNumber && [checks.number, "At least one number"],
    policy.requireSpecial && [checks.special, "At least one special character"],
  ].filter(Boolean);
  return (
    <div className="small mb-3">
      {rows.map(([ok, label], i) => (
        <div
          key={i}
          className={
            "d-flex align-items-center gap-2 " +
            (password ? (ok ? "text-success" : "text-danger") : "text-secondary")
          }
        >
          <span>{password ? (ok ? "✓" : "✕") : "○"}</span>
          <span>{label}</span>
        </div>
      ))}
      <div className="text-secondary mt-1">
        Can't reuse your last {policy.historyCount} passwords · expires
        every {policy.expiryDays} days
      </div>
    </div>
  );
}
