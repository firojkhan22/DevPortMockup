// src/screens/business/CampaignsListingScreen.jsx
// Provides (global): CampaignsListingScreen
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


function CampaignsListingScreen({ onMenuClick, onNewCampaign, onEditCampaign, campaigns }) {
  const rows = campaigns || [];
  const [filters, setFilters] = useState({});
  const [viewingCampaign, setViewingCampaign] = useState(null);
  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
  const [sort, setSort] = useSortState(null);
  const filteredRows = sortRows(
    rows.filter(
      (r) =>
        filterMatch(r.name, filters.n) &&
        filterMatch(r.projects.join(", "), filters.proj) &&
        filterMatch(r.stage, filters.stage) &&
        (filterMatch(r.validTo, filters.valid) ||
          filterMatch(campaignValidityLabel(r), filters.valid)),
    ),
    sort,
    {
      n: (r) => r.name,
      proj: (r) => r.projects.join(", "),
      stage: (r) => r.stage,
      valid: (r) => r.validFrom,
    },
  );
  return (
    <div>
      <TopBar
        title="Campaign Listing"
        sub="Campaigns you've submitted, with maker-checker approval stage"
        onMenuClick={onMenuClick}
        action={
          <button className="btn btn-navy btn-sm" onClick={onNewCampaign}>
            + New Campaign
          </button>
        }
      />
      <div className="small text-secondary mb-2">
        Once submitted, a campaign is reviewed and approved inside
        HDFC's PAMS system (BD team, BD Head, and Central BD
        Coordinator). The status shown here just reflects PAMS's
        latest decision — <b>In Process</b> while it's with them,{" "}
        <b>Query Raised</b> if they need something from you first,
        then <b>Approved</b> or <b>Rejected</b> once they've decided.
      </div>
      <div className="kpi-card p-0 table-responsive">
        <table className="table mb-0 align-middle">
          <thead>
            <tr className="text-secondary small">
              <SortableTh label="Campaign" sortKey="n" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Project(s)" sortKey="proj" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Stage" sortKey="stage" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <SortableTh label="Valid" sortKey="valid" sort={sort} onSort={(k) => toggleSort(sort, setSort, k)} />
              <th></th>
            </tr>
            <GridFilterRow
              columns={[
                {
                  value: filters.n || "",
                  onChange: (v) => setFilter("n", v),
                  placeholder: "Filter campaign…",
                },
                {
                  value: filters.proj || "",
                  onChange: (v) => setFilter("proj", v),
                  placeholder: "Filter project…",
                },
                {
                  value: filters.stage || "",
                  onChange: (v) => setFilter("stage", v),
                  placeholder: "Filter…",
                },
                {
                  value: filters.valid || "",
                  onChange: (v) => setFilter("valid", v),
                  placeholder: "Filter…",
                },
                null,
              ]}
            />
          </thead>
          <tbody>
            {filteredRows.map((r, i) => (
              <tr key={r.key || i}>
                <td className="fw-semibold">{r.name}</td>
                <td>{r.projects.join(", ")}</td>
                <td>
                  <span
                    className={"status-pill " + campaignStagePill(r.stage)}
                  >
                    {r.stage}
                  </span>
                  {r.remarks && (r.stage === "Approved" || r.stage === "Rejected") && (
                    <div className="small text-secondary mt-1">
                      PAMS remarks: {r.remarks}
                    </div>
                  )}
                </td>
                <td>
                  {campaignValidityLabel(r)}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-navy me-1"
                    onClick={() => setViewingCampaign(r)}
                  >
                    👁 View
                  </button>
                  {(r.stage === "Draft" || r.stage === "Query Raised") && (
                    <button
                      className={
                        "btn btn-sm icon-btn " +
                        (r.stage === "Query Raised"
                          ? "btn-navy"
                          : "btn-outline-navy")
                      }
                      title={
                        r.stage === "Query Raised"
                          ? "Respond to BD query on " + r.name
                          : "Edit draft campaign " + r.name
                      }
                      aria-label={
                        r.stage === "Query Raised"
                          ? "Respond to BD query on " + r.name
                          : "Edit draft campaign " + r.name
                      }
                      onClick={() => onEditCampaign(r)}
                    >
                      <IconEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-secondary py-4">
                  No campaigns match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {viewingCampaign && (
        <CampaignViewModal
          campaign={viewingCampaign}
          onClose={() => setViewingCampaign(null)}
        />
      )}
    </div>
  );
}
