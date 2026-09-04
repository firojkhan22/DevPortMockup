// src/screens/mis/DisbursementDetailModal.jsx
// Provides (global): DisbursementDetailModal
// Split from the original single-file mockup — loaded as a classic
// <script type="text/babel"> via Babel Standalone (see index.html),
// so these top-level declarations become shared globals, same as before.


/* ================= 16. PROJECT DISBURSEMENT (view only) ================= */
// Read-only modal: full disbursement transaction history for one
// customer/unit — bank details plus every individual payout, with a
// total. Nothing here is editable; it mirrors what PAMS has already
// processed.
function DisbursementDetailModal({ row, onClose }) {
  const txns = row.txns || [];
  const total = txns.reduce((s, t) => s + t.amt, 0);
  return (
    <Modal
      title={row.name + " — " + row.unit}
      onClose={onClose}
      width={640}
    >
      <div className="row g-3 small mb-3">
        <div className="col-6 col-md-3">
          <div className="text-secondary">File no.</div>
          <div className="fw-semibold">{row.file}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-secondary">Unit no.</div>
          <div className="fw-semibold">{row.unit}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-secondary">Payee name</div>
          <div className="fw-semibold">{row.payee}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-secondary">Account no.</div>
          <div className="fw-semibold">{row.acct}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-secondary">Bank</div>
          <div className="fw-semibold">{row.bank}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-secondary">IFSC code</div>
          <div className="fw-semibold">{row.ifsc}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-secondary">Request date</div>
          <div className="fw-semibold">{row.reqDate}</div>
        </div>
        <div className="col-6 col-md-3">
          <div className="text-secondary">Loan status</div>
          <div className="fw-semibold">{row.status}</div>
        </div>
      </div>
      {txns.length === 0 ? (
        <div className="repeat-row p-3 small text-secondary text-center">
          No disbursements processed yet for this customer.
        </div>
      ) : (
        <div className="kpi-card p-0 table-responsive">
          <table className="table table-sm mb-0 align-middle">
            <thead>
              <tr className="text-secondary small">
                <th>Disbmt no.</th>
                <th>Mode</th>
                <th>Cheque / UTR no.</th>
                <th>Disbmt date</th>
                <th className="text-end">Amount</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t, i) => (
                <tr key={i}>
                  <td>{t.no}</td>
                  <td>{t.mode}</td>
                  <td>{t.ref}</td>
                  <td>{t.date}</td>
                  <td className="text-end">
                    ₹{t.amt.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="fw-semibold">
                <td colSpan="4" className="text-end">
                  Total disbursed
                </td>
                <td className="text-end">
                  ₹{total.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
      <div className="d-flex justify-content-end mt-3">
        <button className="btn btn-outline-navy btn-sm" onClick={onClose}>
          Close
        </button>
      </div>
    </Modal>
  );
}
