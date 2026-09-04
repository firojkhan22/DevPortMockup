// src/screens/tools/ProjectCoordinatorsScreen.jsx
// Provides (global): ProjectCoordinatorsScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 18. REACH US ================= */
function ProjectCoordinatorsScreen({ onMenuClick }) {
  const [selectedProject, setSelectedProject] = useState(
    BUILDER_PROJECT_DETAILS[0]?.n || "",
  );
  const coordinators = [
    {
      role: "HDFC Marketing Team",
      name: "Ananya Rao",
      mobile: "+91 98220 11223",
      email: "ananya.rao@hdfcbank.com",
    },
    {
      role: "HDFC Channel Partner Executive",
      name: "Vikram Shetty",
      mobile: "+91 98220 33445",
      email: "vikram.shetty@hdfcbank.com",
    },
    {
      role: "Technical Coordinator",
      name: "Priya Nair",
      mobile: "+91 98220 55667",
      email: "priya.nair@hdfcbank.com",
    },
    {
      role: "Legal Coordinator",
      name: "Rohan Desai",
      mobile: "+91 98220 77889",
      email: "rohan.desai@hdfcbank.com",
    },
    {
      role: "Business Development Coordinator",
      name: "Sneha Iyer",
      mobile: "+91 98220 99001",
      email: "sneha.iyer@hdfcbank.com",
    },
  ];
  return (
    <div>
      <TopBar
        title="Project Coordinators"
        sub="Assigned HDFC contacts for your selected project"
        onMenuClick={onMenuClick}
      />
      <div className="mb-3" style={{ maxWidth: 320 }}>
        <ProjectPickerField
          label="Project"
          value={selectedProject}
          onChange={setSelectedProject}
          placeholder="Select the project…"
        />
      </div>
      <div className="row g-3">
        {coordinators.map((c, i) => (
          <div className="col-12 col-md-6" key={i}>
            <div className="kpi-card p-3 h-100">
              <div className="text-secondary small mb-1">{c.role}</div>
              <div className="fw-semibold mb-1">{c.name}</div>
              <div className="small">📞 {c.mobile}</div>
              <div className="small">✉️ {c.email}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
