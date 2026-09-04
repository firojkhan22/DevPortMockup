// src/screens/business/BankCampaignsScreen.jsx
// Provides (global): BankCampaignsScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.

/* ================= 15. HDFC BANK CAMPAIGNS (view only) ================= */
function BankCampaignsScreen({ onMenuClick }) {
  const offers = [
    {
      t: "Festive rate special — Diwali 2026",
      d: "8.35% p.a. for salaried customers, all HDFC-approved projects",
      valid: "Till 30 Nov 2026",
      tag: "Rate offer",
    },
    {
      t: "Zero processing fee — new bookings",
      d: "Applicable on bookings above ₹75L in approved residential projects",
      valid: "Till 15 Sep 2026",
      tag: "Fee waiver",
    },
    {
      t: "CLSS awareness drive",
      d: "Marketing kit and eligibility calculator co-branding for eligible affordable-housing projects",
      valid: "Ongoing",
      tag: "Marketing kit",
    },
  ];
  return (
    <div>
      <TopBar
        title="HDFC Bank Campaigns"
        sub="Bank-initiated offers you can promote to your customers — view only"
        onMenuClick={onMenuClick}
      />
      <div className="row g-3">
        {offers.map((o, i) => (
          <div className="col-12 col-md-6" key={i}>
            <div className="kpi-card p-3 h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge badge-navy">{o.tag}</span>
                <span className="text-secondary small">{o.valid}</span>
              </div>
              <div className="fw-semibold mb-1">{o.t}</div>
              <div className="text-secondary small mb-3">{o.d}</div>
              <button className="btn btn-outline-navy btn-sm">
                Download marketing kit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
