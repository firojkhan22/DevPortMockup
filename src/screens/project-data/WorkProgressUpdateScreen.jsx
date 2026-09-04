// src/screens/project-data/WorkProgressUpdateScreen.jsx
// Provides (global): WorkProgressUpdateScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


// Bulk-capable update form. Operating on 1+ rows at once (per the
// BRD's "simplified option to update the progress of one or more
// buildings together"). Stage-of-construction free text is
// pre-populated ("Copy / Same as") from the first selected row's
// last submission so the developer can adjust rather than retype.
function WorkProgressUpdateScreen({ rows, onMenuClick, onBack, onSubmit }) {
  const base = rows[0];
  const [stageStatus, setStageStatus] = useState(base.stageStatus);
  const [stages, setStages] = useState({ ...base.stages });
  const [remarks, setRemarks] = useState(base.remarks);
  const [progressDate, setProgressDate] = useState(base.progressDate);
  const [pctDue, setPctDue] = useState(base.pctDue);
  const [demandLetterDate, setDemandLetterDate] = useState(
    base.demandLetterDate,
  );
  const [photos, setPhotos] = useState([]);
  const [docs, setDocs] = useState([]);
  const [viewingFile, setViewingFile] = useState(null);
  const [formError, setFormError] = useState("");

  function handleSubmit() {
    if (!progressDate) {
      setFormError("Date of progress is required.");
      return;
    }
    if (stageStatus === "started" && photos.length < 2) {
      setFormError(
        "At least 2 photos or a video of the property are required.",
      );
      return;
    }
    setFormError("");
    onSubmit({
      stageStatus,
      stages,
      remarks,
      progressDate,
      pctDue,
      demandLetterDate,
      photos,
      docs,
    });
  }

  return (
    <div>
      <TopBar
        title="Update work progress"
        sub={
          rows.length === 1
            ? "Updating " + rows[0].name
            : "Updating " + rows.length + " selected rows together"
        }
        onMenuClick={onMenuClick}
        action={
          <button
            className="btn btn-outline-navy btn-sm"
            onClick={onBack}
          >
            ← Back to list
          </button>
        }
      />

      <div className="mb-3 d-flex flex-wrap gap-2">
        {rows.map((r) => (
          <span
            key={r.id}
            className="status-pill bg-secondary-subtle text-secondary"
          >
            {r.name}
          </span>
        ))}
      </div>

      <FormCard>
        <label className="form-label small fw-semibold d-block mb-2">
          Stage of construction
        </label>
        <div className="d-flex flex-wrap gap-3 mb-3">
          {[
            ["not_started", "Work Not Started"],
            ["open_plot", "Open Plot"],
            ["started", "Work Started"],
          ].map(([val, label]) => (
            <div className="form-check" key={val}>
              <input
                type="radio"
                className="form-check-input"
                id={"stage-" + val}
                checked={stageStatus === val}
                onChange={() => setStageStatus(val)}
              />
              <label
                className="form-check-label small"
                htmlFor={"stage-" + val}
              >
                {label}
              </label>
            </div>
          ))}
        </div>

        {stageStatus === "started" && (
          <div className="mb-3">
            <div className="small text-secondary mb-2">
              Pre-filled from the last submission — adjust whatever has
              changed.
            </div>
            <div className="row g-2">
              {CONSTRUCTION_STAGE_FIELDS.map(([key, label]) => (
                <div className="col-12 col-md-6" key={key}>
                  <label className="form-label small">{label}</label>
                  <input
                    className="form-control form-control-sm"
                    value={stages[key]}
                    onChange={(e) =>
                      setStages((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="row g-3 mb-3">
          <div className="col-12">
            <label className="form-label small fw-semibold">
              Progress remarks
            </label>
            <textarea
              className="form-control form-control-sm"
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label small fw-semibold">
              Date of progress <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={progressDate}
              onChange={(e) => setProgressDate(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-4">
            <label className="form-label small fw-semibold">
              % amount payable
            </label>
            <input
              className="form-control form-control-sm"
              value={pctDue}
              onChange={(e) => setPctDue(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold">
              Date demand letters will be issued
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={demandLetterDate}
              onChange={(e) => setDemandLetterDate(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <label className="form-label small fw-semibold">
              Property photos / video{" "}
              <span className="text-danger">
                * (min. 2 photos, or a video)
              </span>
            </label>
            <FileDropZone
              accept="image/*,video/*"
              multiple
              onFilesAdded={(f) =>
                setPhotos((prev) => [...prev, f])
              }
            />
            <AttachedFileList
              files={photos}
              category="Photos/video"
              onView={setViewingFile}
              onRemove={(id) =>
                setPhotos((prev) => prev.filter((f) => f.id !== id))
              }
            />
          </div>
          <div className="col-12 col-lg-6">
            <label className="form-label small fw-semibold">
              Supporting documents{" "}
              <span className="text-secondary fw-normal">
                (Architect certificate / Builder letter — optional)
              </span>
            </label>
            <FileDropZone
              accept="image/*,.pdf,.doc,.docx"
              multiple
              requireType
              onFilesAdded={(f) => setDocs((prev) => [...prev, f])}
            />
            <AttachedFileList
              files={docs}
              category="Documents"
              onView={setViewingFile}
              onRemove={(id) =>
                setDocs((prev) => prev.filter((f) => f.id !== id))
              }
            />
          </div>
        </div>

        {formError && (
          <div className="small text-danger mt-3">{formError}</div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-3">
          <button className="btn btn-outline-navy" onClick={onBack}>
            Cancel
          </button>
          <button className="btn btn-navy" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </FormCard>

      {viewingFile && (
        <WorkProgressFileViewModal
          file={viewingFile}
          onClose={() => setViewingFile(null)}
        />
      )}
    </div>
  );
}
