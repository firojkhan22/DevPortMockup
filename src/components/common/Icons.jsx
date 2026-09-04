// src/components/common/Icons.jsx
// Provides (global): IconEdit, IconReview, IconPersonSlash, IconPersonCheck, ExcelIcon, PdfIcon
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Small stroke-style action icons — plain SVG rather than emoji, for
// the same reason the map pin was switched over: emoji glyphs render
// inconsistently (or as tofu/plain shapes) across OS and fonts,
// which looks unprofessional in a dense admin grid. Every icon
// button using these still carries a `title` for a native tooltip.
function IconEdit({ size }) {
  size = size || 15;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ display: "block" }}
    >
      <path
        d="M11.4 1.6a1.6 1.6 0 0 1 2.3 0l0.7 0.7a1.6 1.6 0 0 1 0 2.3L5.9 13.1l-3.4 0.9 0.9-3.4 7.9-8.9 0.1-0.1z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M9.9 3.1l2.9 2.9"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function IconReview({ size }) {
  size = size || 15;
  // Fixed green regardless of the button's own text color, per
  // request — this one should always read as "review/verify".
  const green = "#198754";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ display: "block" }}
    >
      <rect
        x="3"
        y="1.5"
        width="10"
        height="13"
        rx="1.3"
        stroke={green}
        strokeWidth="1.2"
      />
      <path
        d="M5.7 1.5h4.6v1.3a0.6 0.6 0 0 1-0.6 0.6H6.3a0.6 0.6 0 0 1-0.6-0.6V1.5z"
        stroke={green}
        strokeWidth="1.2"
      />
      <path
        d="M5.4 8.4l1.6 1.6 3.4-3.6"
        stroke={green}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Bootstrap Icons "person-fill-slash" (official path data) — used
// for Deactivate. The icon is really two overlapping shapes: the
// person silhouette, and a circle-with-diagonal-slash badge. Kept
// as two separate <path> elements (rather than the single combined
// path Bootstrap ships) so the slash badge can be colored red on
// its own, independent of the person shape.
function IconPersonSlash({ size }) {
  size = size || 15;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ display: "block" }}
    >
      <path
        fill="currentColor"
        d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
      />
      <path
        fill="#dc3545"
        d="M13.879 10.414a2.501 2.501 0 0 0-3.465 3.465zm.707.707-3.465 3.465a2.501 2.501 0 0 0 3.465-3.465m-4.56-1.096a3.5 3.5 0 1 1 4.949 4.95 3.5 3.5 0 0 1-4.95-4.95Z"
      />
    </svg>
  );
}

// Bootstrap Icons "person-fill-check" (official path data) — used
// for Activate, as the natural green counterpart to the red
// person-fill-slash above.
function IconPersonCheck({ size }) {
  size = size || 15;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      style={{ display: "block" }}
    >
      <path
        fill="currentColor"
        d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"
      />
      <path
        fill="#198754"
        d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
      />
    </svg>
  );
}

// Small brand-style file-type icons (flat colour, no external font
// dependency) — used on export buttons so Excel vs PDF is
// recognisable at a glance rather than relying on a generic emoji.
function ExcelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" className="me-1">
      <rect x="1" y="1" width="18" height="18" rx="2" fill="#1D6F42" />
      <text x="10" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">X</text>
    </svg>
  );
}
function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" className="me-1">
      <rect x="1" y="1" width="18" height="18" rx="2" fill="#C0272D" />
      <text x="10" y="14" textAnchor="middle" fontSize="8" fontWeight="700" fontFamily="Arial, sans-serif" fill="#fff">PDF</text>
    </svg>
  );
}
