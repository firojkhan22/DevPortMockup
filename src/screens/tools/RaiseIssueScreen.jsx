// src/screens/tools/RaiseIssueScreen.jsx
// Provides (global): RaiseIssueScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function RaiseIssueScreen({ onMenuClick }) {
  const [relatedProject, setRelatedProject] = useState("");
  return (
    <div>
      <TopBar
        title="Raise Issue"
        sub="Report any exception or issue experienced in the Developer Portal"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Subject *
            </label>
            <input className="form-control" />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label small fw-semibold">
              Category
            </label>
            <select className="form-select">
              <option>Technical issue</option>
              <option>Project query</option>
              <option>Disbursement query</option>
              <option>Other</option>
            </select>
          </div>
          <div className="col-12 col-md-6">
            <ProjectPickerField
              label="Related project"
              value={relatedProject}
              onChange={setRelatedProject}
              allowClear
              clearLabel="None"
            />
          </div>
          <div className="col-12">
            <label className="form-label small fw-semibold">
              Description *
            </label>
            <textarea className="form-control" rows="3"></textarea>
          </div>
          <div className="col-12">
            <label className="form-label small fw-semibold">
              Attach file
            </label>
            <input type="file" className="form-control" />
          </div>
        </div>
        <FormActions primary="Submit issue" onCancel={() => {}} />
      </FormCard>
      <div className="kpi-card p-3 mt-3 small text-secondary">
        Submitting here creates a ticket automatically and appears in your
        Issue Listing. You'll also get an email reply once it's resolved.
        Or write to us directly at{" "}
        <b>developerportal.support@hdfcbank.com</b>.
      </div>
    </div>
  );
}
