// src/data/auth.js
// Provides (global): DUMMY_USER, DUMMY_PASS, EXPIRED_DEMO_USER, EXPIRED_DEMO_PASS, randomBytes, webAuthnSupported, registerPasskey, loginWithPasskey, REGISTERED_EMAILS_KEY, getRegisteredEmails, isEmailRegistered, addRegisteredEmail, PASSWORD_POLICY, checkPasswordPolicy, maskEmail, EMPANELLED_MOBILE, maskMobile, maskName, maskPAN, USER_ID_RECOVERY_DB, findByMobile, findAllByPanOrCin, maskMobilePartial
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


const DUMMY_USER = "finance@safleworks.com";
const DUMMY_PASS = "Hdfc@1234";
// A second demo account purely to demonstrate the "password expired,
// please set a new one" forced flow — logging in with this pair
// triggers it instead of a normal sign-in.
const EXPIRED_DEMO_USER = "expired@safleworks.com";
const EXPIRED_DEMO_PASS = "Hdfc@1234";

function randomBytes(len) {
  const a = new Uint8Array(len);
  crypto.getRandomValues(a);
  return a;
}
function webAuthnSupported() {
  return (
    window.isSecureContext &&
    window.PublicKeyCredential &&
    navigator.credentials
  );
}

async function registerPasskey(username) {
  if (!webAuthnSupported())
    return { ok: false, reason: "insecure-context" };
  try {
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge: randomBytes(32),
        rp: { name: "Developer Portal" },
        user: {
          id: randomBytes(16),
          name: username,
          displayName: username,
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          userVerification: "preferred",
          residentKey: "preferred",
        },
        timeout: 60000,
        attestation: "none",
      },
    });
    return { ok: true, id: cred.id };
  } catch (err) {
    return {
      ok: false,
      reason: err.name || "error",
      message: err.message,
    };
  }
}

async function loginWithPasskey(credentialId) {
  if (!webAuthnSupported())
    return { ok: false, reason: "insecure-context" };
  try {
    const opts = {
      challenge: randomBytes(32),
      timeout: 60000,
      userVerification: "preferred",
    };
    if (credentialId) {
      opts.allowCredentials = [
        {
          id: Uint8Array.from(
            atob(credentialId.replace(/-/g, "+").replace(/_/g, "/")),
            (c) => c.charCodeAt(0),
          ),
          type: "public-key",
        },
      ];
    }
    const assertion = await navigator.credentials.get({
      publicKey: opts,
    });
    return { ok: true, id: assertion.id };
  } catch (err) {
    return {
      ok: false,
      reason: err.name || "error",
      message: err.message,
    };
  }
}

// A static HTML/JS prototype has no backend and can't write a file to
// disk on its own — the browser won't allow that without the user
// manually choosing a save location every time. localStorage is the
// closest practical stand-in: it's a small record that persists in
// this browser across visits, which is enough to demo "you're already
// registered" without a real database. finance@safleworks.com is
// pre-seeded since it's the existing demo login account.
const REGISTERED_EMAILS_KEY = "devportal_registered_emails";
function getRegisteredEmails() {
  let arr = [];
  try {
    const raw = localStorage.getItem(REGISTERED_EMAILS_KEY);
    arr = raw ? JSON.parse(raw) : [];
  } catch (e) {
    arr = [];
  }
  if (!arr.some((e) => e.toLowerCase() === "finance@safleworks.com")) {
    arr.push("finance@safleworks.com");
  }
  return arr;
}
function isEmailRegistered(email) {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return false;
  return getRegisteredEmails().some(
    (e) => e.toLowerCase() === normalized
  );
}
function addRegisteredEmail(email) {
  const trimmed = (email || "").trim();
  if (!trimmed) return;
  try {
    const arr = getRegisteredEmails();
    if (!arr.some((e) => e.toLowerCase() === trimmed.toLowerCase())) {
      arr.push(trimmed);
      localStorage.setItem(REGISTERED_EMAILS_KEY, JSON.stringify(arr));
    }
  } catch (e) {
    // localStorage unavailable (e.g. private browsing) — fail silently,
    // this is a demo convenience, not a critical path.
  }
}

// Password policy — modelled on HDFC Bank's own publicly published
// NetBanking password rules (hdfc.bank.in): 8–15 characters, a mix of
// upper/lower-case letters, numbers and special characters, and a
// 180-day expiry (accounts also lock after 5 failed attempts). In the
// real system this would be one row in a security-policy table that
// an admin can edit; here it's a single object so every password
// screen reads from the same configurable source rather than having
// its own hardcoded rules.
const PASSWORD_POLICY = {
  minLength: 8,
  maxLength: 15,
  requireUpper: true,
  requireLower: true,
  requireNumber: true,
  requireSpecial: true,
  historyCount: 3, // can't reuse the last N passwords
  expiryDays: 180,
  maxFailedAttempts: 5,
};

function checkPasswordPolicy(pw, policy) {
  policy = policy || PASSWORD_POLICY;
  const checks = {
    length: pw.length >= policy.minLength && pw.length <= policy.maxLength,
    upper: !policy.requireUpper || /[A-Z]/.test(pw),
    lower: !policy.requireLower || /[a-z]/.test(pw),
    number: !policy.requireNumber || /[0-9]/.test(pw),
    special: !policy.requireSpecial || /[^A-Za-z0-9]/.test(pw),
  };
  return { checks, valid: Object.values(checks).every(Boolean) };
}

function maskEmail(email) {
  const [name, domain] = (email || "").split("@");
  if (!name || !domain) return "••••••@••••.com";
  const visible = name.slice(0, 2);
  return (
    visible + "•".repeat(Math.max(3, name.length - 2)) + "@" + domain
  );
}
const EMPANELLED_MOBILE = "+91 98765 43210";
function maskMobile(m) {
  return m.slice(0, 3) + " " + m.slice(3, 5) + "•••• " + m.slice(-3);
}
function maskName(name) {
  return (name || "")
    .split(" ")
    .map((w) =>
      w.length <= 1 ? w : w[0] + "•".repeat(Math.max(2, w.length - 1))
    )
    .join(" ");
}
// Wherever a PAN number is shown read-only (not an entry field the
// user is actively filling in), mask everything but the last 3
// characters — e.g. AAAPL1234C -> •••••••34C.
function maskPAN(pan) {
  const p = (pan || "").trim();
  if (p.length <= 3) return p;
  return "•".repeat(p.length - 3) + p.slice(-3);
}

// Demo records for "Forgot User ID" — in the real system this would
// look up the builder-company record by PAN/CIN or the individual by
// registered mobile number. A company can have several registered
// users, so PAN/CIN naturally matches more than one person — these
// are the same people already used on the Company Users screen, for
// consistency end to end.
const USER_ID_RECOVERY_DB = [
  {
    pan: "AAAPL1234C",
    cin: "U45201MH2015PTC267541",
    company: "Safleworks Constructions Pvt Ltd",
    name: "Firoj Khan",
    role: "Developer Admin",
    mobile: "9876543101",
    email: "firoj.khan@safleworks.com",
  },
  {
    pan: "AAAPL1234C",
    cin: "U45201MH2015PTC267541",
    company: "Safleworks Constructions Pvt Ltd",
    name: "Rahul Mehta",
    role: "Developer User",
    mobile: "9876543102",
    email: "rahul@safleworks.com",
  },
  {
    pan: "AAAPL1234C",
    cin: "U45201MH2015PTC267541",
    company: "Safleworks Constructions Pvt Ltd",
    name: "Suresh Patil",
    role: "Developer User",
    mobile: "9876543103",
    email: "suresh@safleworks.com",
  },
  {
    pan: "AAAPL5678D",
    cin: "U45201MH2015PTC267542",
    company: "Safleworks Riverside SPV LLP",
    name: "Priya Nair",
    role: "Developer Admin",
    mobile: "9876543201",
    email: "priya.nair@safleworksriverside.com",
  },
  {
    pan: "AAAPL5678D",
    cin: "U45201MH2015PTC267542",
    company: "Safleworks Riverside SPV LLP",
    name: "Karan Shah",
    role: "Developer User",
    mobile: "9876543202",
    email: "karan.shah@safleworksriverside.com",
  },
  {
    pan: "AACCS4321E",
    cin: "U45201MH2015PTC267543",
    company: "Shri Siddhivinayak Developers",
    name: "Manoj Deshmukh",
    role: "Developer Admin",
    mobile: "9876543301",
    email: "manoj@siddhivinayakdev.com",
  },
  {
    pan: "AACCS4321E",
    cin: "U45201MH2015PTC267543",
    company: "Shri Siddhivinayak Developers",
    name: "Vaishali Joshi",
    role: "Developer User",
    mobile: "9876543302",
    email: "vaishali@siddhivinayakdev.com",
  },
];
// Mobile path: OTP-verified against one specific person, so this only
// ever matches on the mobile number itself — never on PAN/CIN.
function findByMobile(mobile) {
  const q = (mobile || "").trim().replace(/\D/g, "");
  if (!q) return null;
  return USER_ID_RECOVERY_DB.find((u) => u.mobile === q) || null;
}
// PAN/CIN path: identifies the COMPANY, not a specific person — a
// company can have several registered users, so this returns every
// matching user. The caller still requires an OTP (to that person's
// own mobile or email) before revealing their login ID.
function findAllByPanOrCin(query) {
  const q = (query || "").trim().toUpperCase().replace(/\s/g, "");
  if (!q) return [];
  return USER_ID_RECOVERY_DB.filter(
    (u) => u.pan.toUpperCase() === q || u.cin.toUpperCase() === q
  );
}
// Partial mask for a raw 10-digit mobile number — keep first 2 and
// last 2 digits, mask the rest (used before OTP is verified).
function maskMobilePartial(m) {
  const digits = (m || "").replace(/\D/g, "");
  if (digits.length < 4) return "••••••••••";
  return digits.slice(0, 2) + "•".repeat(digits.length - 4) + digits.slice(-2);
}
