// src/data/company.js
// Provides (global): ENTITY_TYPES, entityTypeInfo, GST_STATE_CODES, validateGstin, gstStateFor, COMPANY_USERS_DATA, DEFAULT_COMPANY_NAME
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Entity type master — replaces the old free-text "Category" field.
// CIN/PAN applicability drives which of those fields are required
// (or hidden) on the Company Master entry form for the selected
// entity type.
const ENTITY_TYPES = [
  { type: "LLP", name: "LLP", cinApplicable: true, panApplicable: true },
  {
    type: "PVT_LTD",
    name: "PRIVATE LIMITED",
    cinApplicable: true,
    panApplicable: true,
  },
  {
    type: "PROPRIETORY_INDIVIDUAL",
    name: "PROPRIETORY / INDIVIDUAL",
    cinApplicable: false,
    panApplicable: true,
  },
  {
    type: "PUBLIC_LTD",
    name: "PUBLIC LIMITED",
    cinApplicable: true,
    panApplicable: true,
  },
  {
    type: "PARTNERSHIP",
    name: "PARTNERSHIP",
    cinApplicable: false,
    panApplicable: true,
  },
  {
    type: "INDIVIDUAL",
    name: "INDIVIDUAL",
    cinApplicable: false,
    panApplicable: true,
  },
  { type: "HUF", name: "HUF", cinApplicable: false, panApplicable: true },
  {
    type: "COOP_SOCIETY_AOP",
    name: "CO-OP SOCIETY / AOP",
    cinApplicable: false,
    panApplicable: true,
  },
  {
    type: "TRUST",
    name: "TRUST",
    cinApplicable: false,
    panApplicable: true,
  },
  {
    type: "DEVELOPMENT_AUTHORITY",
    name: "DEVELOPMENT AUTHORITY",
    cinApplicable: false,
    panApplicable: false,
  },
];
function entityTypeInfo(type) {
  return ENTITY_TYPES.find((e) => e.type === type) || null;
}

// GSTIN state-code lookup — the first two digits of a GSTIN are the
// GST state code. Used to auto-derive/validate the state entered
// against each GSTIN.
const GST_STATE_CODES = {
  "01": "Jammu and Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra and Nagar Haveli and Daman and Diu",
  "27": "Maharashtra",
  "28": "Andhra Pradesh (Old)",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman and Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
};
function validateGstin(value) {
  if (!value) return "GSTIN is required.";
  const v = value.toUpperCase();
  if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}$/.test(v))
    return "Enter a valid 15-character GSTIN (e.g. 27AAAPL1234C1ZV).";
  if (!GST_STATE_CODES[v.slice(0, 2)])
    return "GSTIN state code isn't recognized.";
  return "";
}
function gstStateFor(value) {
  const v = (value || "").toUpperCase();
  return GST_STATE_CODES[v.slice(0, 2)] || "";
}

/* ================= 2b. COMPANY USERS (team directory) ================= */
// "Who else at my company has portal access?" — scoped to the
// logged-in user's own company, styled like a team directory rather
// than a plain admin table (Project Summary's card-and-tab treatment
// was the inspiration). This is deliberately separate from the
// global, admin-focused "User Management" screen: that one is for
// provisioning access across the whole builder group; this one is
// "who's on my team."
// Distinct demo team per company, keyed by company name, so clicking
// into different company records from Company Listing shows that
// company's own people rather than repeating the same list.
const COMPANY_USERS_DATA = {
  "Safleworks Constructions Pvt Ltd": [
    {
      name: "Firoj Khan",
      role: "Developer Admin",
      designation: "Finance Head",
      email: "firoj.khan@safleworks.com",
      mobile: "+91 98xxx xx101",
      status: "Active",
      lastActive: "Today",
    },
    {
      name: "Rahul Mehta",
      role: "Developer User",
      designation: "Finance Executive",
      email: "rahul@safleworks.com",
      mobile: "+91 98xxx xx102",
      status: "Active",
      lastActive: "Yesterday",
    },
    {
      name: "Suresh Patil",
      role: "Developer User",
      designation: "Site Engineer",
      email: "suresh@safleworks.com",
      mobile: "+91 98xxx xx103",
      status: "Active",
      lastActive: "2 days ago",
    },
    {
      name: "Ananya Kulkarni",
      role: "Developer User",
      designation: "Accounts Assistant",
      email: "ananya@safleworks.com",
      mobile: "+91 98xxx xx104",
      status: "Blocked",
      lastActive: "3 weeks ago",
    },
  ],
  "Safleworks Riverside SPV LLP": [
    {
      name: "Priya Nair",
      role: "Developer Admin",
      designation: "Compliance Head",
      email: "priya.nair@safleworksriverside.com",
      mobile: "+91 98xxx xx201",
      status: "Active",
      lastActive: "Today",
    },
    {
      name: "Karan Shah",
      role: "Developer User",
      designation: "Site Supervisor",
      email: "karan.shah@safleworksriverside.com",
      mobile: "+91 98xxx xx202",
      status: "Active",
      lastActive: "4 days ago",
    },
  ],
  "Shri Siddhivinayak Developers": [
    {
      name: "Manoj Deshmukh",
      role: "Developer Admin",
      designation: "Proprietor",
      email: "manoj@siddhivinayakdev.com",
      mobile: "+91 98xxx xx301",
      status: "Active",
      lastActive: "Today",
    },
    {
      name: "Vaishali Joshi",
      role: "Developer User",
      designation: "Accounts Executive",
      email: "vaishali@siddhivinayakdev.com",
      mobile: "+91 98xxx xx302",
      status: "Active",
      lastActive: "1 week ago",
    },
  ],
};
const DEFAULT_COMPANY_NAME = "Safleworks Constructions Pvt Ltd";
