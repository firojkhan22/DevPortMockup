// src/screens/project-data/WorkProgressFileViewModal.jsx
// Provides (global): WorkProgressFileViewModal
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Preview modal for a single attached file (property photo/video or
// supporting document). Images render inline; everything else (PDF,
// Excel, Word, video, ...) shows a summary card with a download
// link, since a static prototype has no server to stream arbitrary
// file types back for in-browser preview.
function WorkProgressFileViewModal({ file, onClose }) {
  const isImage = file.dataUrl && file.dataUrl.startsWith("data:image");
  return (
    <Modal title={file.name} onClose={onClose} width={520}>
      <div className="small text-secondary mb-2">
        <div>
          <span className="fw-semibold text-dark">Category:</span>{" "}
          {file.category}
        </div>
        {file.type && (
          <div>
            <span className="fw-semibold text-dark">Document type:</span>{" "}
            {file.type}
          </div>
        )}
        {file.remark && (
          <div>
            <span className="fw-semibold text-dark">Remark:</span>{" "}
            {file.remark}
          </div>
        )}
        <div>
          <span className="fw-semibold text-dark">Uploaded:</span>{" "}
          {file.date} · {formatBytes(file.size)}
        </div>
      </div>
      {isImage ? (
        <img
          src={file.dataUrl}
          alt={file.name}
          className="w-100 rounded-3 border"
        />
      ) : (
        <div className="kpi-card p-4 text-center">
          <div className="fs-1 mb-2">{docTypeIcon(file.name)}</div>
          <div className="small text-secondary">
            Preview isn't available for this file type in the
            prototype.
          </div>
          {file.dataUrl && (
            <a
              href={file.dataUrl}
              download={file.name}
              className="btn btn-outline-navy btn-sm mt-2"
            >
              Download {file.name}
            </a>
          )}
        </div>
      )}
    </Modal>
  );
}
