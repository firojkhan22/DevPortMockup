const num = (v, d) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : d; };
const bool = (v, d) => (v == null ? d : String(v).toLowerCase() === "true");

export const config = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL || "http://localhost:5080").replace(/\/$/, ""),
  chunkSize: num(import.meta.env.VITE_UPLOAD_CHUNK_SIZE, 10 * 1024 * 1024),
  maxRetries: num(import.meta.env.VITE_UPLOAD_MAX_RETRIES, 5),
  syncChunkFromServer: bool(import.meta.env.VITE_UPLOAD_SYNC_CHUNK_FROM_SERVER, false)
};

export async function resolveChunkSize() {
  if (!config.syncChunkFromServer) return config.chunkSize;
  try {
    const r = await fetch(`${config.apiBaseUrl}/config`);
    if (r.ok) { const j = await r.json(); if (j.chunkSize > 0) return j.chunkSize; }
  } catch { /* fall back to local config */ }
  return config.chunkSize;
}
