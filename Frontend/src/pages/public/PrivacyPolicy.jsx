import React, { useState } from "react";
import { FiCheckCircle, FiShield, FiFileText, FiDownload, FiTrash2, FiAlertCircle } from "react-icons/fi";
import { getStored, STORAGE_KEYS } from "../../utils/mockStorage";

const PrivacyPolicy = () => {
  const [exportLoading, setExportLoading] = useState(false);
  const [exportData, setExportData] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState("");

  const handleRequestDataExport = () => {
    setExportLoading(true);
    setTimeout(() => {
      const user = getStored(STORAGE_KEYS.USER, {});
      const profile = getStored(STORAGE_KEYS.PROFILE, {});
      const bookings = getStored(STORAGE_KEYS.BOOKINGS, []);
      const exportPayload = {
        exportMetadata: { requestDate: new Date().toLocaleDateString() },
        exportedAt: new Date().toISOString(),
        dpdpCompliance: "India Digital Personal Data Protection Act 2023",
        user,
        profile,
        bookings
      };
      setExportData(exportPayload);
      setExportLoading(false);
      alert("✓ Data export package prepared in compliance with DPDP Act 2023.");
    }, 400);
  };

  const handleAccountDeletion = () => {
    if (!window.confirm("Under DPDP Act 2023 Right to Erasure: Are you sure you want to permanently erase your profile and account? This action cannot be reversed.")) {
      return;
    }
    setDeleteStatus("Account erased successfully in compliance with the DPDP Act 2023. You will now be redirected to Home.");
    setTimeout(() => {
      localStorage.clear();
      window.location.href = "/";
    }, 2000);
  };

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <div className="card p-4 p-md-5 border-0 shadow-sm mb-4" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
        <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
          <div className="p-3 rounded-circle" style={{ background: "var(--accent-champagne-light)" }}>
            <FiShield size={24} style={{ color: "var(--accent-burgundy)" }} />
          </div>
          <div>
            <h2 className="fw-bold mb-1" style={{ fontFamily: "var(--font-serif)", color: "var(--text-main)" }}>
              Privacy Policy & DPDP Act 2023 Rights
            </h2>
            <p className="text-muted small mb-0">Commitment to Data Minimization & Digital Data Fiduciary Standards (India)</p>
          </div>
        </div>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">1. Data Fiduciary Commitment & Purpose Limitation</h5>
          <p className="text-muted small" style={{ lineHeight: "1.7" }}>
            VELORA collects only the minimum personal data required to authenticate identity, enforce 18+ eligibility, ensure personal safety during social appointments, and securely process bookings. We do not sell personal data, display raw residential addresses, or retain raw identity documents after verification is finalized.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">2. Rights of Data Principals under DPDP Act 2023</h5>
          <ul className="text-muted small" style={{ lineHeight: "1.7" }}>
            <li><strong>Right to Access Information:</strong> Summary of personal data processed, companion bookings, and verification records.</li>
            <li><strong>Right to Correction & Erasure:</strong> Rectification of inaccurate data and permanent erasure of personal data once purpose is fulfilled.</li>
            <li><strong>Right of Grievance Redressal:</strong> Rapid redressal of inquiries within statutory timelines.</li>
            <li><strong>Right to Nominate:</strong> Ability to designate a trusted contact in case of emergency or incapacitation.</li>
          </ul>
        </section>

        {/* DPDP Self-Service Privacy Desk */}
        <div className="p-4 rounded-3 mt-4" style={{ background: "var(--bg-primary)", border: "1px dashed var(--accent-burgundy)" }}>
          <h5 className="fw-bold text-dark d-flex align-items-center gap-2 mb-2">
            <FiFileText style={{ color: "var(--accent-burgundy)" }} /> DPDP Self-Service Privacy Desk
          </h5>
          <p className="text-muted small mb-3">
            Exercise your statutory rights under the Digital Personal Data Protection Act with instant 1-click execution.
          </p>

          <div className="d-flex flex-wrap gap-3">
            <button
              onClick={handleRequestDataExport}
              disabled={exportLoading}
              className="btn btn-sm btn-outline-dark d-flex align-items-center gap-2"
              style={{ borderRadius: "var(--radius-full)" }}
            >
              <FiDownload /> {exportLoading ? "Generating Dossier..." : "Download Personal Data Dossier"}
            </button>

            <button
              onClick={handleAccountDeletion}
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-2"
              style={{ borderRadius: "var(--radius-full)" }}
            >
              <FiTrash2 /> Right to Erasure (Delete Account)
            </button>
          </div>

          {deleteStatus && (
            <div className="alert alert-info mt-3 small mb-0">{deleteStatus}</div>
          )}

          {exportData && (
            <div className="mt-3 p-3 bg-white rounded border">
              <span className="fw-bold small text-success d-flex align-items-center gap-1 mb-2">
                <FiCheckCircle /> Dossier Generated ({exportData.exportMetadata.requestDate})
              </span>
              <pre className="small text-muted p-2 bg-light rounded" style={{ maxHeight: "200px", overflow: "auto" }}>
                {JSON.stringify(exportData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
