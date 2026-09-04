// src/components/common/ChatbotWidget.jsx
// Provides (global): ChatbotWidget
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-navy rounded-circle shadow"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          zIndex: 1040,
          fontSize: 22,
        }}
      >
        💬
      </button>
      {open && (
        <div
          className="bg-white rounded-4 shadow-lg"
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 300,
            zIndex: 1040,
            border: "1px solid #e3e7ee",
          }}
        >
          <div
            className="p-3 text-white rounded-top-4"
            style={{ background: "var(--navy)" }}
          >
            <div className="fw-semibold small">
              Developer Portal Assistant
            </div>
            <div className="small" style={{ opacity: 0.85 }}>
              Ask a question or raise an issue
            </div>
          </div>
          <div
            className="p-3"
            style={{ maxHeight: 220, overflowY: "auto" }}
          >
            <div className="repeat-row p-2 px-3 small mb-2">
              Hi! I can help with project status, document requirements,
              or connect you to your BD coordinator. What do you need?
            </div>
          </div>
          <div className="p-2 border-top d-flex gap-2">
            <input
              className="form-control form-control-sm"
              placeholder="Type a message..."
            />
            <button className="btn btn-navy btn-sm">Send</button>
          </div>
        </div>
      )}
    </>
  );
}
