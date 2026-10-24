import React from "react";
import { FiFileText, FiShield, FiLock, FiCheck } from "react-icons/fi";

const LegalTerms = () => {
  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <div className="card p-4 p-md-5 border-0 shadow-sm" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
        <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
          <div className="p-3 rounded-circle" style={{ background: "var(--accent-burgundy-light)" }}>
            <FiFileText size={24} style={{ color: "var(--accent-burgundy)" }} />
          </div>
          <div>
            <h2 className="fw-bold mb-1" style={{ fontFamily: "var(--font-serif)", color: "var(--text-main)" }}>
              Terms of Service & Code of Conduct
            </h2>
            <p className="text-muted small mb-0">VELORA Private Concierge Technologies Ltd. • Updated for India Intermediary Guidelines</p>
          </div>
        </div>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">1. Strict 18+ Eligibility & Age Verification</h5>
          <p className="text-muted small" style={{ lineHeight: "1.7" }}>
            VELORA is strictly reserved for individuals who are at least 18 years of age. By creating an account, you legally attest that you are an adult under Indian law. Any misrepresentation of age will result in immediate permanent banning and potential referral to authorities where applicable.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">2. Scope of Social Companionship Services</h5>
          <p className="text-muted small" style={{ lineHeight: "1.7" }}>
            VELORA facilitates consensual, lawful, public social companionship (such as dining, theater, conferences, cafe conversations, and verified online audio/video interactions). Under no circumstances does VELORA permit, facilitate, promote, or tolerate commercial sexual services, prostitution, coercion, physical solicitation, or illegal activities. Any violation constitutes a material breach resulting in account termination without refund.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">3. Mutual Consent & Boundary Setting</h5>
          <p className="text-muted small" style={{ lineHeight: "1.7" }}>
            Companions and members retain complete bodily autonomy and the unconditional right to establish personal boundaries and decline any activity or interaction that induces discomfort. Public venue guidelines must be honored for all in-person appointments.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">4. Grievance Officer & Intermediary Obligations (IT Act 2000)</h5>
          <p className="text-muted small" style={{ lineHeight: "1.7" }}>
            In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021:
            <br />
            <strong>Grievance Officer:</strong> Legal & Compliance Desk, VELORA Technologies
            <br />
            <strong>Email:</strong> grievance-officer@velora.luxury
            <br />
            <strong>Response Time:</strong> Acknowledgement within 24 hours, resolution within 15 days.
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalTerms;
