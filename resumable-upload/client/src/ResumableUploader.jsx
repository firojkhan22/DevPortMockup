import { useState } from "react";
import { useResumableUpload } from "./useResumableUpload";

function fmtBytes(b) {
  if (!b) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(b) / Math.log(1024)));
  return `${(b / 1024 ** i).toFixed(i ? 1 : 0)} ${u[i]}`;
}

const BAR_CLASS = { error: "bg-danger", done: "bg-success" };

export default function ResumableUploader() {
  const [file, setFile] = useState(null);
  const up = useResumableUpload();
  const busy = up.state === "uploading" || up.state === "hashing";

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Resumable Chunked Upload</h5>

        <input
          type="file"
          className="form-control mb-3"
          disabled={busy}
          onChange={(e) => { setFile(e.target.files[0] || null); up.reset(); }}
        />

        {file && <div className="small text-muted mb-2">{file.name} · {fmtBytes(file.size)}</div>}

        <div className="progress mb-2" style={{ height: 22 }}>
          <div
            className={`progress-bar ${BAR_CLASS[up.state] || ""} ${busy ? "progress-bar-striped progress-bar-animated" : ""}`}
            role="progressbar"
            style={{ width: `${up.percent}%` }}
            aria-valuenow={up.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {up.percent}%
          </div>
        </div>

        <div className="small text-muted mb-3">
          {fmtBytes(up.uploaded)} / {fmtBytes(up.total)} · <span className="text-capitalize">{up.state}</span>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-primary" disabled={!file || busy || up.state === "done"} onClick={() => up.start(file)}>Start</button>
          <button className="btn btn-outline-secondary" disabled={up.state !== "uploading"} onClick={up.pause}>Pause</button>
          <button className="btn btn-outline-primary" disabled={up.state !== "paused"} onClick={up.resume}>Resume</button>
          <button className="btn btn-outline-danger" disabled={!file} onClick={up.reset}>Reset</button>
        </div>

        {up.error && <div className="alert alert-danger mt-3 mb-0 py-2 small">{up.error}</div>}
        {up.result && <div className="alert alert-success mt-3 mb-0 py-2 small">Stored as <code>{up.result}</code></div>}
      </div>
    </div>
  );
}
