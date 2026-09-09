// src/screens/tools/ChunkUploadTestScreen.jsx
// Provides (global): ChunkUploadTestScreen
//
// ============================================================
//  TEST SCREEN — Resumable Chunked Upload (safe to remove)
// ============================================================
//  Standalone probe for the ASP.NET Core API in /resumable-upload.
//  To remove this feature entirely, delete:
//    1. this file
//    2. the <script> line for it in index.html
//    3. the `chunkUploadTest` entry in AppShell.jsx `screens`
//    4. the `chunkUploadTest` entries in nav.js (NAV_LABEL_MAP,
//       ALWAYS_UNLOCKED_SCREENS) and Sidebar.jsx ("Tools & Support")
//  Nothing else in the app references it.
// ============================================================

// --- config (point this at the running API) ---
const CHUNK_UPLOAD_TEST_CONFIG = {
  apiBaseUrl: "http://localhost:5080",
  chunkSize: 10 * 1024 * 1024,
  maxRetries: 5,
};

function chunkUploadFmtBytes(b) {
  if (!b) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(u.length - 1, Math.floor(Math.log(b) / Math.log(1024)));
  return (b / Math.pow(1024, i)).toFixed(i ? 1 : 0) + " " + u[i];
}

async function chunkUploadFileHash(f) {
  const bytes = new TextEncoder().encode(f.name + "|" + f.size + "|" + f.lastModified);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function ChunkUploadTestScreen({ onMenuClick }) {
  const cfg = CHUNK_UPLOAD_TEST_CONFIG;
  const [file, setFile] = useState(null);
  const [state, setState] = useState("idle"); // idle|hashing|uploading|paused|done|error
  const [uploaded, setUploaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const fileRef = useRef(null);
  const hashRef = useRef("");
  const pausedRef = useRef(false);
  const runRef = useRef(false);

  const busy = state === "uploading" || state === "hashing";
  const percent = total ? Math.min(100, Math.floor((uploaded / total) * 100)) : 0;
  const addLog = (m) => setLog((p) => [new Date().toLocaleTimeString() + "  " + m, ...p].slice(0, 200));

  async function getStatus(hash) {
    const r = await fetch(cfg.apiBaseUrl + "/status?hash=" + encodeURIComponent(hash));
    if (!r.ok) throw new Error("status " + r.status);
    return (await r.json()).offset || 0;
  }

  async function putChunk(f, hash, offset) {
    const blob = f.slice(offset, Math.min(offset + cfg.chunkSize, f.size));
    const fd = new FormData();
    fd.append("hash", hash);
    fd.append("fileName", f.name);
    fd.append("offset", String(offset));
    fd.append("totalSize", String(f.size));
    fd.append("chunk", blob, f.name);
    const r = await fetch(cfg.apiBaseUrl + "/chunk", { method: "POST", body: fd });
    if (r.status === 409) {
      const j = await r.json().catch(() => ({}));
      addLog("409 offset conflict — server at " + (j.offset || 0) + ", resyncing");
      return { conflict: true, offset: j.offset || 0 };
    }
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || "chunk " + r.status);
    const j = await r.json();
    return { conflict: false, offset: j.offset, done: !!j.done, file: j.file };
  }

  async function loop() {
    if (runRef.current) return;
    runRef.current = true;
    const f = fileRef.current;
    const hash = hashRef.current;
    try {
      setState("uploading");
      let offset = await getStatus(hash);
      setUploaded(offset);
      addLog("resuming from server offset " + offset + " / " + f.size);
      while (offset < f.size) {
        if (pausedRef.current) { setState("paused"); addLog("paused"); return; }
        let res, attempt = 0;
        for (;;) {
          try { res = await putChunk(f, hash, offset); break; }
          catch (e) {
            if (pausedRef.current) { setState("paused"); return; }
            if (++attempt > cfg.maxRetries) throw e;
            addLog("chunk failed (" + e.message + "), retry " + attempt);
            await new Promise((r) => setTimeout(r, 500 * attempt));
          }
        }
        offset = res.offset;
        setUploaded(offset);
        if (res.done) { setResult(res.file); setState("done"); addLog("done — stored as " + res.file); return; }
      }
      setState("done");
    } catch (e) {
      setError(String(e.message || e));
      setState("error");
      addLog("error: " + (e.message || e));
    } finally {
      runRef.current = false;
    }
  }

  async function start() {
    if (!file) return;
    setError(""); setResult(null); setUploaded(0); setTotal(file.size); setLog([]);
    setState("hashing");
    pausedRef.current = false;
    fileRef.current = file;
    hashRef.current = await chunkUploadFileHash(file);
    addLog("file identity hash " + hashRef.current.slice(0, 16) + "…");
    loop();
  }
  function pause() { pausedRef.current = true; }
  function resume() { if (!fileRef.current) return; pausedRef.current = false; loop(); }
  function reset() {
    pausedRef.current = true; runRef.current = false;
    fileRef.current = null; hashRef.current = "";
    setState("idle"); setUploaded(0); setTotal(0); setError(""); setResult(null); setLog([]);
  }

  return (
    <div>
      <TopBar
        title="Chunk Upload Test"
        sub="Resumable chunked upload probe — needs the API in /resumable-upload running"
        onMenuClick={onMenuClick}
      />

      <div className="alert alert-warning py-2 small">
        Test harness. Start the API first: <code>cd resumable-upload/server &amp;&amp; dotnet run</code>{" "}
        (expects <code>{cfg.apiBaseUrl}</code>). Remove this screen anytime — see the file header.
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-7">
          <div className="card">
            <div className="card-body">
              <input
                type="file"
                className="form-control mb-3"
                disabled={busy}
                onChange={(e) => { setFile(e.target.files[0] || null); reset(); }}
              />
              {file && (
                <div className="small text-secondary mb-2">
                  {file.name} · {chunkUploadFmtBytes(file.size)} · chunk {chunkUploadFmtBytes(cfg.chunkSize)}
                </div>
              )}

              <div className="progress mb-2" style={{ height: 22 }}>
                <div
                  className={
                    "progress-bar " +
                    (state === "error" ? "bg-danger " : state === "done" ? "bg-success " : "") +
                    (busy ? "progress-bar-striped progress-bar-animated" : "")
                  }
                  role="progressbar"
                  style={{ width: percent + "%" }}
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {percent}%
                </div>
              </div>
              <div className="small text-secondary mb-3">
                {chunkUploadFmtBytes(uploaded)} / {chunkUploadFmtBytes(total)} ·{" "}
                <span className="text-capitalize">{state}</span>
              </div>

              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-navy" disabled={!file || busy || state === "done"} onClick={start}>
                  Start
                </button>
                <button className="btn btn-outline-navy" disabled={state !== "uploading"} onClick={pause}>
                  Pause
                </button>
                <button className="btn btn-outline-navy" disabled={state !== "paused"} onClick={resume}>
                  Resume
                </button>
                <button className="btn btn-outline-danger" disabled={!file} onClick={reset}>
                  Reset
                </button>
              </div>

              {error && <div className="alert alert-danger mt-3 mb-0 py-2 small">{error}</div>}
              {result && (
                <div className="alert alert-success mt-3 mb-0 py-2 small">
                  Uploaded — server stored it as <code>{result}</code>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card h-100">
            <div className="card-body">
              <div className="fw-semibold small mb-2">Activity log</div>
              <pre
                className="small mb-0"
                style={{ maxHeight: 320, overflow: "auto", background: "#f7f9fc", padding: 10, borderRadius: 8 }}
              >
                {log.length ? log.join("\n") : "No activity yet."}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
