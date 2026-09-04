// src/components/common/TopBar.jsx
// Provides (global): Breadcrumb, TopBar
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function Breadcrumb({ title }) {
  if (title === "Home") return null;
  return (
    <div style={{ fontSize: 12.5 }}>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        style={{ color: "#5c6b80", textDecoration: "none" }}
      >
        Home
      </a>
      <span className="mx-1" style={{ color: "#c3cad6" }}>
        ›
      </span>
      <span className="fw-semibold" style={{ color: "var(--navy)" }}>
        {title}
      </span>
    </div>
  );
}

function TopBar({ title, sub, onMenuClick, action }) {
  return (
    <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-outline-secondary d-md-none"
          onClick={onMenuClick}
        >
          ☰
        </button>
        {title !== "Home" && (
          <div className="topbar-icon d-none d-sm-flex">
            {iconForTitle(title)}
          </div>
        )}
        <div>
          <Breadcrumb title={title} />
          {sub && <div className="text-secondary small mt-1">{sub}</div>}
        </div>
      </div>
      <div className="d-flex align-items-center gap-3">{action}</div>
    </div>
  );
}
