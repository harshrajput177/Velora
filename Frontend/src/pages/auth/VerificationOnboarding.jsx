import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiUpload, FiShield, FiAlertTriangle, FiClock, FiFileText } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const VerificationOnboarding = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState("approved");
  const [verification, setVerification] = useState({
    id: "verif-101",
    documentType: "government_id",
    status: "approved",
    reviewedAt: new Date().toISOString()
  });
  const [formData, setFormData] = useState({
    documentType: "government_id",
    idNumber: "XXXX-XXXX-4819",
    age: "24",
    selfieUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
    documentUrl: "https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?w=500"
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Number(formData.age) < 18) {
      alert("You must be 18+ to submit verification on VELORA.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setMessage("✓ Verification approved by compliance system! You are 18+ verified.");
      setStatus("approved");
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="container py-5" style={{ maxWidth: "800px" }}>
      <div className="card p-4 p-md-5 border-0 shadow-sm" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: "var(--accent-champagne-light)" }}>
            <FiShield size={36} style={{ color: "var(--accent-burgundy)" }} />
          </div>
          <h2 className="fw-bold" style={{ fontFamily: "var(--font-serif)", color: "var(--text-main)" }}>
            Identity & Age Verification (18+)
          </h2>
          <p className="text-muted small mx-auto" style={{ maxWidth: "550px" }}>
            To preserve privacy, safety, and compliance with Indian regulations, VELORA maintains an independent, vetted verification standard.
          </p>
        </div>

        {/* Status Alert */}
        {status === "verified" && (
          <div className="alert alert-success d-flex align-items-center gap-3 p-3 rounded-3 mb-4">
            <FiCheckCircle size={24} />
            <div>
              <strong className="d-block">Account Verified & Active</strong>
              <span className="small">Your identity and 18+ adult age eligibility have been verified. You can book companions and accept requests.</span>
            </div>
          </div>
        )}

        {status === "pending" && (
          <div className="alert alert-warning d-flex align-items-center gap-3 p-3 rounded-3 mb-4">
            <FiClock size={24} />
            <div>
              <strong className="d-block">Verification In Review</strong>
              <span className="small">Your credentials are currently in the compliance review queue. Reference ID: {verification?.id?.slice(0, 8)}</span>
            </div>
          </div>
        )}

        {status === "rejected" && (
          <div className="alert alert-danger d-flex align-items-center gap-3 p-3 rounded-3 mb-4">
            <FiAlertTriangle size={24} />
            <div>
              <strong className="d-block">Verification Rejected</strong>
              <span className="small">{verification?.reviewerNotes || "Document details did not match or age requirement was not met. Please resubmit."}</span>
            </div>
          </div>
        )}

        {message && <div className="alert alert-info small">{message}</div>}

        {status !== "verified" && (
          <form onSubmit={handleSubmit} className="mt-3">
            <h5 className="fw-bold mb-3 border-bottom pb-2">Verification Submission</h5>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Government Document Type</label>
                <select
                  className="form-select"
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                >
                  <option value="government_id">National ID / Aadhaar / Voter ID</option>
                  <option value="passport">Passport</option>
                  <option value="driving_license">Driving License</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Declared Age (Must be 18+)</label>
                <input
                  type="number"
                  min="18"
                  max="99"
                  required
                  className="form-control"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold">ID / Document Number (Redacted on server)</label>
              <input
                type="text"
                required
                placeholder="E.g. XXXX-XXXX-4589"
                className="form-control"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              />
              <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                Under DPDP guidelines, only the last 4 digits are retained in audit records. Raw document images are purged following verification.
              </span>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Live Selfie Verification URL</label>
                <input
                  type="url"
                  required
                  className="form-control form-control-sm"
                  value={formData.selfieUrl}
                  onChange={(e) => setFormData({ ...formData, selfieUrl: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-semibold">Document Image URL</label>
                <input
                  type="url"
                  required
                  className="form-control form-control-sm"
                  value={formData.documentUrl}
                  onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="form-check mb-4">
              <input type="checkbox" required className="form-check-input" id="termsCheck" defaultChecked />
              <label className="form-check-label small text-muted" htmlFor="termsCheck">
                I formally confirm that I am at least 18 years of age and agree to VELORA's Terms of Service and Anti-Solicitation policy.
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-dark w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
              style={{ background: "var(--accent-burgundy)", borderColor: "var(--accent-burgundy)", borderRadius: "var(--radius-full)" }}
            >
              <FiUpload /> {submitting ? "Submitting Securely..." : "Submit for Verification"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default VerificationOnboarding;
