// src/screens/projects/QueryModals.jsx
// Provides (global): DocRequirementModal, QueryRespondModal
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 6. PENDING DOCUMENTS / RESPOND TO QUERIES =================
   BRD treats "pending documents raised by PAC" and "pending queries
   raised by PAC" as two distinct flows:
   - Documents: upload one or more files against the requirement, OR
     request a waiver with justification if the document isn't
     available.
   - Queries: respond with text, optionally attaching one or more
     documents.
   Both are kept separate below rather than sharing one generic
   "Respond" action. ================================================= */

function DocRequirementModal({ item, onClose }) {
  const [mode, setMode] = useState("upload"); // upload | waiver
  const [remark, setRemark] = useState("");
  const [waiverJustification, setWaiverJustification] = useState("");
  const [files, setFiles] = useState([]);
  return (
    <Modal title="Pending document" onClose={onClose} width={460}>
      <div className="text-secondary small mb-3">
        Raised by: {item.raisedBy} &nbsp;
        <span className="badge bg-warning-subtle text-warning">
          {item.category}
        </span>
        <div className="mt-1">{item.text}</div>
      </div>

      <div className="d-flex gap-2 mb-3">
        <button
          type="button"
          className={
            "btn btn-sm " +
            (mode === "upload" ? "btn-navy" : "btn-outline-navy")
          }
          onClick={() => setMode("upload")}
        >
          Upload document
        </button>
        <button
          type="button"
          className={
            "btn btn-sm " +
            (mode === "waiver" ? "btn-navy" : "btn-outline-navy")
          }
          onClick={() => setMode("waiver")}
        >
          Request waiver
        </button>
      </div>

      {mode === "upload" ? (
        <>
          <div className="mb-3">
            <label className="form-label small fw-semibold">
              Remark
            </label>
            <textarea
              className="form-control"
              rows="2"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label small fw-semibold">
              Attach document(s)
            </label>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={(e) =>
                setFiles(Array.from(e.target.files || []))
              }
            />
            <div className="form-text">
              One or more documents can be uploaded against this
              requirement.
            </div>
            {files.length > 0 && (
              <div className="small text-secondary mt-1">
                {files.length} file(s) selected: {files.map((f) => f.name).join(", ")}
              </div>
            )}
          </div>
          <button className="btn btn-navy w-100" onClick={onClose}>
            Submit documents
          </button>
        </>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label small fw-semibold">
              Justification for waiver *
            </label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Explain why this document isn't available…"
              value={waiverJustification}
              onChange={(e) => setWaiverJustification(e.target.value)}
            ></textarea>
          </div>
          <button
            className="btn btn-navy w-100"
            disabled={!waiverJustification.trim()}
            onClick={onClose}
          >
            Submit waiver request
          </button>
        </>
      )}
    </Modal>
  );
}

function QueryRespondModal({ item, onClose }) {
  const [response, setResponse] = useState("");
  const [files, setFiles] = useState([]);
  return (
    <Modal title="Respond to query" onClose={onClose} width={420}>
      <div className="text-secondary small mb-3">
        Raised by: {item.raisedBy} &nbsp;
        <span className="badge bg-warning-subtle text-warning">
          {item.category}
        </span>
        <div className="mt-1">{item.text}</div>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">
          Your response
        </label>
        <textarea
          className="form-control"
          rows="3"
          placeholder="Write your response..."
          value={response}
          onChange={(e) => setResponse(e.target.value)}
        ></textarea>
      </div>
      <div className="mb-3">
        <label className="form-label small fw-semibold">
          Attach document(s){" "}
          <span className="text-secondary fw-normal">(optional)</span>
        </label>
        <input
          type="file"
          className="form-control"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
        {files.length > 0 && (
          <div className="small text-secondary mt-1">
            {files.length} file(s) selected: {files.map((f) => f.name).join(", ")}
          </div>
        )}
      </div>
      <button className="btn btn-navy w-100" onClick={onClose}>
        Send response
      </button>
    </Modal>
  );
}
