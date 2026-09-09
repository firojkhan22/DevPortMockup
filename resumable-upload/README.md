# Resumable Chunked Upload (React + ASP.NET Core)

Resumable, chunked upload for any file type (1 GB+). The browser slices the file with
`Blob.slice()` and uploads fixed-size chunks sequentially; the API appends each chunk to
disk with `FileStream` using offset verification, then promotes the finished file to a
permanent folder under a new `Guid`.

## Layout

| Path | What |
|---|---|
| `server/` | ASP.NET Core 8 minimal API (`GET /status`, `POST /chunk`, `GET /config`) |
| `server/appsettings.json` | Connection string **and** upload settings (`Upload:ChunkSizeBytes`, buffers, blacklists, CORS origin) |
| `server/web.config` | IIS `maxAllowedContentLength` (30 MB) |
| `client/` | React 18 + Vite + Bootstrap 5 |
| `client/.env` | App connection + `VITE_UPLOAD_CHUNK_SIZE` (defaults to 10 MB) |

## Run

```bash
# API  -> http://localhost:5080
cd server
dotnet run

# Client -> http://localhost:5173
cd client
cp .env.example .env
npm install
npm run dev
```

## Protocol

1. Client builds a file identity hash: `SHA-256(name | size | lastModified)`.
2. `GET /status?hash=` → `{ offset }` = bytes already on disk (0 if new).
3. Loop: `POST /chunk` as `multipart/form-data` with `hash`, `fileName`, `offset`,
   `totalSize`, `chunk`.
   - `200 { offset, done }` — chunk appended; `done:true` returns `{ file }` (the Guid name).
   - `409 { offset }` — server/client offset drift; client adopts the returned offset and continues.
   - `415` — extension/MIME blacklisted (`.exe .bat .sh .vbs .js` …).
4. Pause stops after the in-flight chunk; Resume re-queries `/status` and continues.

## Security

- Extension + MIME blacklist, configurable in `appsettings.json`.
- Filenames reduced to their base name; temp/final paths verified to stay inside their roots (no `..` traversal).
- Chunk size capped server-side at `Upload:ChunkSizeBytes`.
- Kestrel `MaxRequestBodySize` + IIS `maxAllowedContentLength` = 30 MB (3× a 10 MB chunk).
- Explicit CORS policy: React origin only, `GET`/`POST` only.
