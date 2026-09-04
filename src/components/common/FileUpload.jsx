// src/components/common/FileUpload.jsx
// Provides (global): docTypeIcon, formatBytes, FileDropZone, AttachedFileList
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function docTypeIcon(fileName) {
  const ext = (fileName || "").split(".").pop().toLowerCase();
  if (ext === "pdf") return "📄";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "🖼️";
  if (["xls", "xlsx", "csv"].includes(ext)) return "📊";
  if (["doc", "docx"].includes(ext)) return "📝";
  return "📎";
}

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

// Reusable drag-and-drop upload zone used for both the mandatory
// property photos/video and the optional supporting documents.
// `requireType`, when set, shows a document-type dropdown above the
// dropzone (used for supporting documents, which the BRD ties to a
// type like "Architect certificate / Builder letter").
function FileDropZone({
  accept,
  multiple,
  requireType,
  onFilesAdded,
}) {
  const [dragOver, setDragOver] = useState(false);
  const [docType, setDocType] = useState("");
  const [pendingError, setPendingError] = useState("");
  const fileInputRef = useRef(null);

  function readAndAdd(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;
    if (requireType && !docType) {
      setPendingError("Select a document type before uploading.");
      return;
    }
    setPendingError("");
    files.forEach((f) => {
      const finish = (dataUrl) => {
        onFilesAdded({
          id: Date.now() + Math.random(),
          name: f.name,
          size: f.size,
          type: requireType ? docType : "",
          remark: "",
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
          dataUrl: dataUrl,
        });
      };
      if (f.type && f.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => finish(e.target.result);
        reader.readAsDataURL(f);
      } else {
        finish(null);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div>
      {requireType && (
        <select
          className="form-select form-select-sm mb-2"
          value={docType}
          onChange={(e) => setDocType(e.target.value)}
        >
          <option value="">Select document type…</option>
          {WORK_PROGRESS_DOC_TYPES.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>
      )}
      <div
        className="text-center p-3 rounded-3"
        style={{
          border: "2px dashed " + (dragOver ? "var(--navy)" : "#c8d0dc"),
          background: dragOver ? "#eef1f8" : "#fafbfd",
          transition: "background 120ms, border-color 120ms",
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          readAndAdd(e.dataTransfer.files);
        }}
      >
        <div className="fs-4 mb-1">☁️</div>
        <div className="small text-secondary mb-2">
          Drag and drop {multiple ? "files" : "a file"} here, or
        </div>
        <button
          type="button"
          className="btn btn-outline-navy btn-sm"
          onClick={() => fileInputRef.current.click()}
        >
          Browse files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="d-none"
          onChange={(e) => readAndAdd(e.target.files)}
        />
      </div>
      {pendingError && (
        <div className="small text-danger mt-1">{pendingError}</div>
      )}
    </div>
  );
}

function AttachedFileList({ files, category, onView, onRemove }) {
  if (!files.length)
    return (
      <div className="small text-secondary mt-2">
        No {category.toLowerCase()} attached yet.
      </div>
    );
  return (
    <div className="row g-2 mt-1">
      {files.map((f) => (
        <div className="col-12 col-sm-6" key={f.id}>
          <div className="repeat-row p-2 d-flex align-items-start gap-2">
            <div className="fs-5">{docTypeIcon(f.name)}</div>
            <div className="flex-fill" style={{ minWidth: 0 }}>
              <div
                className="small fw-semibold text-truncate"
                title={f.name}
              >
                {f.name}
              </div>
              {f.type && (
                <div className="small text-secondary text-truncate">
                  {f.type}
                </div>
              )}
              <div className="d-flex gap-2 mt-1">
                <button
                  type="button"
                  className="btn btn-outline-navy btn-sm py-0 px-2"
                  style={{ fontSize: 11 }}
                  onClick={() => onView(f)}
                >
                  👁 View
                </button>
                {onRemove && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm py-0 px-2"
                    style={{ fontSize: 11 }}
                    onClick={() => onRemove(f.id)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
