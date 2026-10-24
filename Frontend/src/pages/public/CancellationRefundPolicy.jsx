import React from "react";
import { FiDollarSign, FiClock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

const CancellationRefundPolicy = () => {
  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <div className="card p-4 p-md-5 border-0 shadow-sm" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
        <div className="d-flex align-items-center gap-3 mb-4 border-bottom pb-3">
          <div className="p-3 rounded-circle" style={{ background: "var(--accent-champagne-light)" }}>
            <FiDollarSign size={24} style={{ color: "var(--accent-burgundy)" }} />
          </div>
          <div>
            <h2 className="fw-bold mb-1" style={{ fontFamily: "var(--font-serif)", color: "var(--text-main)" }}>
              Cancellation & Refund Policy
            </h2>
            <p className="text-muted small mb-0">Fair, transparent booking protection for guests and companions alike.</p>
          </div>
        </div>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">1. Advance Notice Cancellations</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-sm mt-2">
              <thead className="table-light">
                <tr>
                  <th>Time Prior to Scheduled Meeting</th>
                  <th>Refund to Client</th>
                  <th>Companion Reservation Fee</th>
                </tr>
              </thead>
              <tbody className="small">
                <tr>
                  <td>More than 6 hours prior</td>
                  <td>100% Full Refund</td>
                  <td>None</td>
                </tr>
                <tr>
                  <td>Between 2 to 6 hours prior</td>
                  <td>70% Refund</td>
                  <td>30% Preparation compensation</td>
                </tr>
                <tr>
                  <td>Less than 2 hours or No-Show</td>
                  <td>Non-refundable</td>
                  <td>100% Companion compensation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">2. Safety and Boundary Termination</h5>
          <p className="text-muted small" style={{ lineHeight: "1.7" }}>
            Either party may terminate a companion session immediately if personal boundaries, comfort, or safety protocols are compromised. If a session is terminated due to guest misconduct or violation of VELORA’s non-solicitation rules, no refund will be issued. If a companion fails to appear, the guest receives an immediate 100% refund.
          </p>
        </section>

        <section className="mb-4">
          <h5 className="fw-bold text-dark">3. Dispute Resolution Desk</h5>
          <p className="text-muted small" style={{ lineHeight: "1.7" }}>
            In the event of a disagreement regarding session duration or quality, members may submit a dispute within 24 hours of scheduled completion through their bookings dashboard. Our moderation team reviews chat logs and SafeTrack check-ins to arrive at an equitable decision within 48 hours.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CancellationRefundPolicy;
