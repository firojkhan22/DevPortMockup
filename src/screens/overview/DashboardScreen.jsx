// src/screens/overview/DashboardScreen.jsx
// Provides (global): DashboardScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function DashboardScreen({ onMenuClick }) {
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const convertedLeads = [3, 5, 4, 7, 6, 9]; // count of leads converted to approved projects
  const disbursementCr = [12, 18, 15, 25, 22, 31]; // ₹ Cr disbursed against those converted leads (YTD)
  const maxLeads = Math.max(...convertedLeads);
  const maxDisb = Math.max(...disbursementCr);
  const linePoints = disbursementCr
    .map((v, i) => {
      const x = (i / (disbursementCr.length - 1)) * 100;
      const y = 100 - (v / maxDisb) * 88; // leave headroom at top
      return x + "," + y;
    })
    .join(" ");

  const projects = [
    {
      n: "Riverside Heights",
      city: "Mumbai",
      status: "Approved",
      pct: 88,
    },
    {
      n: "Green Valley Phase 2",
      city: "Pune",
      status: "In-Progress",
      pct: 46,
    },
    { n: "ASP (906773)", city: "Bhandup", status: "Pending", pct: 8 },
  ];
  const statusClass = (s) =>
    s === "Approved"
      ? "bg-success-subtle text-success"
      : s === "In-Progress"
        ? "bg-warning-subtle text-warning"
        : "bg-secondary-subtle text-secondary";

  return (
    <div>
      <TopBar
        title="Dashboard"
        sub="Welcome, Firoj Khan"
        onMenuClick={onMenuClick}
      />

      <div className="row g-2 mb-2">
        {[
          { l: "Total Projects", v: "12", i: "📁" },
          { l: "Customer Leads Converted (YTD)", v: "34", i: "✅" },
          { l: "Customer Loan Disbursement YTD", v: "₹123 Cr", i: "₹" },
          { l: "Pending Actions", v: "7", i: "⏳" },
        ].map((k, idx) => (
          <div className="col-12 col-sm-6 col-lg-3" key={idx}>
            <div className="kpi-card p-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary" style={{ fontSize: 11.5 }}>{k.l}</span>
                <span className="icon-chip" style={{ width: 22, height: 22, fontSize: 11 }}>{k.i}</span>
              </div>
              <div className="fs-6 fw-bold mt-1">{k.v}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-2 mb-2">
        <div className="col-12 col-lg-8">
          <div className="kpi-card p-2 h-100">
            <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
              <div>
                <h6 className="mb-0" style={{ fontSize: 13 }}>Customer Loan Disbursement</h6>
                <div className="text-secondary" style={{ fontSize: 11 }}>
                  Customer leads converted (bars) vs. disbursement ₹ Cr
                  (line) — last 6 months
                </div>
              </div>
              <div className="d-flex gap-3" style={{ fontSize: 11 }}>
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      background: "var(--navy)",
                      borderRadius: 2,
                      marginRight: 4,
                    }}
                  ></span>
                  Customer leads converted
                </span>
                <span>
                  <span
                    style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      background: "var(--accent)",
                      borderRadius: 2,
                      marginRight: 4,
                    }}
                  ></span>
                  Disbursement (₹ Cr)
                </span>
              </div>
            </div>
            <div style={{ position: "relative", height: 150 }}>
              <div className="d-flex align-items-end gap-1 h-100">
                {convertedLeads.map((v, i) => (
                  <div
                    key={i}
                    className="flex-fill d-flex flex-column align-items-center justify-content-end h-100"
                  >
                    <div
                      className="bar-col"
                      style={{ height: (v / maxLeads) * 88 + "%", width: "58%" }}
                    ></div>
                  </div>
                ))}
              </div>
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                }}
              >
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="#c02b2b"
                  strokeWidth="1.6"
                  vectorEffect="non-scaling-stroke"
                />
                {disbursementCr.map((v, i) => {
                  const x = (i / (disbursementCr.length - 1)) * 100,
                    y = 100 - (v / maxDisb) * 88;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="1.0"
                      fill="#c02b2b"
                    />
                  );
                })}
              </svg>
            </div>
            <div className="d-flex gap-2 mt-1">
              {months.map((d, i) => (
                <span
                  key={i}
                  className="flex-fill text-center small text-secondary"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="kpi-card p-2 h-100">
            <h6 className="mb-2" style={{ fontSize: 13 }}>Needs your attention</h6>
            <div className="d-flex justify-content-between align-items-center py-1 border-bottom">
              <div>
                <div className="fw-semibold" style={{ fontSize: 12 }}>Pending queries</div>
                <div className="text-secondary" style={{ fontSize: 11 }}>
                  Raised by PAMS coordinators
                </div>
              </div>
              <span className="badge bg-danger-subtle text-danger">
                3
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-1 border-bottom">
              <div>
                <div className="fw-semibold" style={{ fontSize: 12 }}>Pending documents</div>
                <div className="text-secondary" style={{ fontSize: 11 }}>
                  Across active projects
                </div>
              </div>
              <span className="badge bg-warning-subtle text-warning">
                2
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center py-1">
              <div>
                <div className="fw-semibold" style={{ fontSize: 12 }}>Open issues</div>
                <div className="text-secondary" style={{ fontSize: 11 }}>Raised by you</div>
              </div>
              <span className="badge bg-secondary-subtle text-secondary">
                2
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="kpi-card p-2">
        <div className="d-flex justify-content-between mb-2">
          <h6 className="mb-0" style={{ fontSize: 13 }}>Top 3 Projects</h6>
          <a href="#" className="small text-decoration-none">
            View all ›
          </a>
        </div>
        <div className="row g-2">
          {projects.map((p, i) => (
            <div className="col-12 col-md-4" key={i}>
              <div className="topproj-box p-2 h-100">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <b>{p.n}</b>
                    <div className="text-secondary small">{p.city}</div>
                  </div>
                  <span className={"badge " + statusClass(p.status)}>
                    {p.status}
                  </span>
                </div>
                <div className="progress mt-3" style={{ height: 6 }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: p.pct + "%",
                      background: "var(--navy)",
                    }}
                  ></div>
                </div>
                <div className="small text-secondary mt-1">
                  {p.pct}% disbursed
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
