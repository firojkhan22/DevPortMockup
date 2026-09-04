// src/components/common/Modal.jsx
// Provides (global): Modal
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function Modal({ title, onClose, children, width }) {
  // Rendered straight into <body> via a portal — this guarantees the
  // popup is always centered on the visible viewport and on top of
  // everything else, no matter where in the page it was triggered
  // from, and regardless of scroll position or any ancestor styling.
  return ReactDOM.createPortal(
    <div className="modal-backdrop-custom" onClick={onClose}>
      <div
        className="bg-white rounded-4 p-4"
        style={{
          width: width || 420,
          maxWidth: "100%",
          maxHeight: "85vh",
          overflow: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="mb-0">{title}</h5>
          <span
            role="button"
            onClick={onClose}
            className="text-secondary fs-5"
          >
            &times;
          </span>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
