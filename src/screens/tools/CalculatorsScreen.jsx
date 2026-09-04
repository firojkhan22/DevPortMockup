// src/screens/tools/CalculatorsScreen.jsx
// Provides (global): CalculatorsScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 17. CALCULATORS ================= */
function CalculatorsScreen({ onMenuClick }) {
  const items = [
    { n: "EMI Calculator", i: "%", c: "primary" },
    { n: "Affordability Calculator", i: "💰", c: "success" },
    { n: "Eligibility Calculator", i: "✅", c: "warning" },
    { n: "CLSS Calculator", i: "🏠", c: "info" },
  ];
  return (
    <div>
      <TopBar
        title="Calculators"
        sub="EMI, affordability, eligibility, and CLSS calculators"
        onMenuClick={onMenuClick}
      />
      <div className="row g-3">
        {items.map((it, i) => (
          <div className="col-12 col-sm-6" key={i}>
            <div
              className={
                "kpi-card p-4 text-center bg-" + it.c + "-subtle"
              }
            >
              <div className="fs-2 mb-2">{it.i}</div>
              <div className="fw-semibold">{it.n}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
