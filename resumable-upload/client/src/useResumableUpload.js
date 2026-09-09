import { useCallback, useRef, useState } from "react";
import { config, resolveChunkSize } from "./config";

const identity = (f) => `${f.name}|${f.size}|${f.lastModified}`;

async function fileHash(f) {
  const bytes = new TextEncoder().encode(identity(f));
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function getStatus(hash) {
  const r = await fetch(`${config.apiBaseUrl}/status?hash=${encodeURIComponent(hash)}`);
  if (!r.ok) throw new Error(`status ${r.status}`);
  return (await r.json()).offset ?? 0;
}

async function putChunk(file, hash, offset, chunkSize) {
  const blob = file.slice(offset, Math.min(offset + chunkSize, file.size));
  const fd = new FormData();
  fd.append("hash", hash);
  fd.append("fileName", file.name);
  fd.append("offset", String(offset));
  fd.append("totalSize", String(file.size));
  fd.append("chunk", blob, file.name);
  const r = await fetch(`${config.apiBaseUrl}/chunk`, { method: "POST", body: fd });
  if (r.status === 409) return { conflict: true, offset: (await r.json().catch(() => ({}))).offset ?? 0 };
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || `chunk ${r.status}`);
  const j = await r.json();
  return { conflict: false, offset: j.offset, done: !!j.done, file: j.file };
}

export function useResumableUpload() {
  const [state, setState] = useState("idle");
  const [uploaded, setUploaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const fileRef = useRef(null);
  const hashRef = useRef("");
  const chunkRef = useRef(config.chunkSize);
  const pausedRef = useRef(false);
  const runRef = useRef(false);

  const loop = useCallback(async () => {
    if (runRef.current) return;
    runRef.current = true;
    const file = fileRef.current;
    const hash = hashRef.current;
    try {
      setState("uploading");
      let offset = await getStatus(hash);
      setUploaded(offset);
      while (offset < file.size) {
        if (pausedRef.current) { setState("paused"); return; }
        let res, attempt = 0;
        for (;;) {
          try { res = await putChunk(file, hash, offset, chunkRef.current); break; }
          catch (e) {
            if (pausedRef.current) { setState("paused"); return; }
            if (++attempt > config.maxRetries) throw e;
            await new Promise((r) => setTimeout(r, 500 * attempt));
          }
        }
        offset = res.offset;
        setUploaded(offset);
        if (res.done) { setResult(res.file); setState("done"); return; }
      }
      setState("done");
    } catch (e) {
      setError(String(e.message || e));
      setState("error");
    } finally {
      runRef.current = false;
    }
  }, []);

  const start = useCallback(async (file) => {
    setError(""); setResult(null); setUploaded(0); setTotal(file.size);
    setState("hashing");
    pausedRef.current = false;
    fileRef.current = file;
    chunkRef.current = await resolveChunkSize();
    hashRef.current = await fileHash(file);
    loop();
  }, [loop]);

  const pause = useCallback(() => { pausedRef.current = true; }, []);
  const resume = useCallback(() => {
    if (!fileRef.current) return;
    pausedRef.current = false;
    loop();
  }, [loop]);
  const reset = useCallback(() => {
    pausedRef.current = true; runRef.current = false;
    fileRef.current = null; hashRef.current = "";
    setState("idle"); setUploaded(0); setTotal(0); setError(""); setResult(null);
  }, []);

  const percent = total ? Math.min(100, Math.floor((uploaded / total) * 100)) : 0;
  return { state, uploaded, total, percent, error, result, start, pause, resume, reset };
}
