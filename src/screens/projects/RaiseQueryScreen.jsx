// src/screens/projects/RaiseQueryScreen.jsx
// Provides (global): RaiseQueryScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.

function RaiseQueryScreen({ onMenuClick, onDone, onSubmit }) {
  const [category, setCategory] = useState("general"); // general | project | document
  const [project, setProject] = useState("");
  const [document, setDocument] = useState("");
  const [assignTo, setAssignTo] = useState("Not sure / general");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const needsProject = category === "project" || category === "document";
  const needsDocument = category === "document";

  function handleSubmit() {
    if (!subject.trim() || !description.trim()) {
      setError("Enter a subject and description before submitting.");
      return;
    }
    if (needsProject && !project) {
      setError("Select a project for this query.");
      return;
    }
    if (needsDocument && !document) {
      setError("Select the related document.");
      return;
    }
    setError("");
    onSubmit &&
      onSubmit({
        category,
        project: needsProject ? project : null,
        document: needsDocument ? document : null,
        assignTo,
        subject,
        description,
        files,
      });
    onDone && onDone();
  }

  const categoryOptions = [
    { key: "general", label: "General query" },
    { key: "project", label: "Project related" },
    { key: "document", label: "Document related" },
  ];

  return (
    <div>
      <TopBar
        title="Raise a Query"
        sub="Ask HDFC Bank a question that isn't already tied to a pending document or query raised by PAC"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        <div className="mb-3">
          <label className="form-label small fw-semibold">
            Query category
          </label>
          <div className="d-flex gap-2 flex-wrap">
            {categoryOptions.map((c) => (
              <button
                key={c.key}
                type="button"
                className={
                  "btn btn-sm " +
                  (category === c.key ? "btn-navy" : "btn-outline-navy")
                }
                onClick={() => {
                  setCategory(c.key);
                  if (c.key === "general") {
                    setProject("");
                    setDocument("");
                  }
                  if (c.key === "project") setDocument("");
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div className="row g-3">
          {needsProject && (
            <div className="col-12 col-md-6">
              <ProjectPickerField
                label="Project"
                required
                value={project}
                onChange={setProject}
                placeholder="Select project number / name…"
              />
            </div>
          )}

          {needsDocument && (
            <div className="col-12 col-md-6">
              <label className="form-label small fw-semibold">
                Document *
              </label>
              <select
                className="form-select"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
              >
                <option value="">Select document…</option>
                {QUERY_DOCUMENT_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Assign to
            </label>
            <select
              className="form-select"
              value={assignTo}
              onChange={(e) => setAssignTo(e.target.value)}
            >
              <option>Not sure / general</option>
              <option>Business Development Team</option>
              <option>Technical Team</option>
              <option>Legal Team</option>
            </select>
            <div className="form-text">
              Not sure who owns this? Leave it as "Not sure / general"
              and the coordinator team will route it for you.
            </div>
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold">
              Subject *
            </label>
            <input
              className="form-control"
              placeholder="Brief title for your query"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold">
              Description *
            </label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Describe your query in detail"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="col-12">
            <label className="form-label small fw-semibold">
              Attach document(s){" "}
              <span className="text-secondary fw-normal">
                (optional)
              </span>
            </label>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={(e) =>
                setFiles(Array.from(e.target.files || []))
              }
            />
            {files.length > 0 && (
              <div className="small text-secondary mt-1">
                {files.length} file(s) selected:{" "}
                {files.map((f) => f.name).join(", ")}
              </div>
            )}
          </div>
        </div>

        {error && <div className="text-danger small mt-3">{error}</div>}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-outline-navy" onClick={onDone}>
            Cancel
          </button>
          <button className="btn btn-navy" onClick={handleSubmit}>
            Submit query
          </button>
        </div>
      </FormCard>
    </div>
  );
}
