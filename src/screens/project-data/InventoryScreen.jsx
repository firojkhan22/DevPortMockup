// src/screens/project-data/InventoryScreen.jsx
// Provides (global): InventoryScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 10. INVENTORY UPDATE ================= */
function InventoryScreen({ onMenuClick }) {
  const cats = ["Residential", "Commercial", "Plots"];
  const [invProject, setInvProject] = useState(BUILDER_PROJECT_NAMES[0]);
  return (
    <div>
      <TopBar
        title="Update Project Inventory"
        sub="Track sold/unsold units by category"
        onMenuClick={onMenuClick}
      />
      <FormCard>
        <div className="mb-3">
          <ProjectPickerField
            label="Select project"
            style={{ maxWidth: 320 }}
            value={invProject}
            onChange={setInvProject}
          />
        </div>
        {cats.map((c, i) => (
          <div className="repeat-row p-3 mb-2" key={i}>
            <div className="row g-2 align-items-end">
              <div className="col-12 col-md-3">
                <div className="fw-semibold small">{c}</div>
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small">Total units</label>
                <input
                  className="form-control form-control-sm"
                  type="number"
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small">Units sold</label>
                <input
                  className="form-control form-control-sm"
                  type="number"
                />
              </div>
              <div className="col-6 col-md-3">
                <label className="form-label small">Units unsold</label>
                <input
                  className="form-control form-control-sm"
                  type="number"
                />
              </div>
            </div>
          </div>
        ))}
        <div className="form-check mt-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="soldout"
          />
          <label className="form-check-label small" htmlFor="soldout">
            Mark project as sold out
          </label>
        </div>
        <FormActions onCancel={() => {}} />
      </FormCard>
    </div>
  );
}
