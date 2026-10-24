import React, { useState, useEffect } from "react";
import { FiUsers, FiShield, FiAlertOctagon, FiCheck, FiX, FiFileText } from "react-icons/fi";

const MOCK_ADMIN_DATA = {
  stats: {
    totalUsers: 1420,
    activeCompanions: 68,
    escrowVolume: 845000,
    openReports: 2,
    pendingKYC: 3
  },
  users: [
    { id: "u-1", email: "kabir@example.com", role: "CLIENT", isVerified: true, createdAt: "2026-01-15" },
    { id: "u-2", email: "ananya@example.com", role: "COMPANION", isVerified: true, createdAt: "2026-02-10" },
    { id: "u-3", email: "tanya@example.com", role: "COMPANION", isVerified: true, createdAt: "2026-02-18" },
    { id: "u-4", email: "aryan@example.com", role: "COMPANION", isVerified: true, createdAt: "2026-03-01" },
    { id: "u-5", email: "rohan@example.com", role: "CLIENT", isVerified: false, createdAt: "2026-03-12" }
  ],
  verifications: [
    {
      id: "v-1",
      userId: "u-5",
      userName: "Rohan V.",
      documentType: "Aadhaar Card",
      status: "PENDING",
      submittedAt: "2026-10-21T08:30:00.000Z"
    },
    {
      id: "v-2",
      userId: "u-6",
      userName: "Priya S.",
      documentType: "Passport",
      status: "PENDING",
      submittedAt: "2026-10-21T09:15:00.000Z"
    }
  ],
  reports: [
    {
      id: "rep-1",
      reporter: "Kabir M.",
      target: "Late Arrival (10m)",
      reason: "Companion was 10 mins late due to CyberHub traffic",
      status: "OPEN",
      createdAt: "2026-10-20"
    }
  ],
  auditLogs: [
    { id: "log-1", action: "ESCROW_RELEASE", details: "Released ₹1,547 to Ananya (BK-9842)", timestamp: "2026-10-21 11:20" },
    { id: "log-2", action: "KYC_APPROVED", details: "Approved Tanya 18+ Government ID", timestamp: "2026-10-20 18:45" },
    { id: "log-3", action: "SAFETRACK_END", details: "SafeTrack session completed normally", timestamp: "2026-10-20 22:30" }
  ]
};

const AdminDashboard = () => {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(MOCK_ADMIN_DATA.stats);
  const [users, setUsers] = useState(MOCK_ADMIN_DATA.users);
  const [verifications, setVerifications] = useState(MOCK_ADMIN_DATA.verifications);
  const [reports, setReports] = useState(MOCK_ADMIN_DATA.reports);
  const [auditLogs, setAuditLogs] = useState(MOCK_ADMIN_DATA.auditLogs);
  const [loading, setLoading] = useState(false);

  const handleReviewVerification = (userId, action) => {
    setVerifications(prev => prev.filter(v => v.userId !== userId));
    alert(`Verification ${action}ed for user ${userId}`);
  };

  const handleResolveReport = (reportId, status) => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    alert(`Report marked as ${status}`);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h2 className="fw-bold mb-0" style={{ fontFamily: "var(--font-serif)" }}>VELORA Administrative Console</h2>
          <span className="text-muted small">Restricted Moderation, Compliance & Grievance Desk</span>
        </div>
        <button onClick={fetchData} className="btn btn-sm btn-outline-dark" style={{ borderRadius: "var(--radius-full)" }}>
          Refresh Data
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        {["overview", "verifications", "reports", "users", "audit-logs"].map((t) => (
          <li className="nav-item" key={t}>
            <button
              className={`nav-link text-capitalize ${tab === t ? "active" : ""}`}
              style={{
                borderRadius: "var(--radius-full)",
                background: tab === t ? "var(--accent-burgundy)" : "transparent",
                color: tab === t ? "#fff" : "var(--text-main)"
              }}
              onClick={() => setTab(t)}
            >
              {t.replace("-", " ")}
            </button>
          </li>
        ))}
      </ul>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-danger" role="status"></div></div>
      ) : (
        <>
          {/* OVERVIEW TAB */}
          {tab === "overview" && stats && (
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card p-3 border-0 shadow-sm" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <span className="text-muted small">Total Members</span>
                  <h3 className="fw-bold my-1">{stats.totalUsers}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 border-0 shadow-sm" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <span className="text-muted small">Pending Verifications</span>
                  <h3 className="fw-bold my-1 text-warning">{stats.pendingVerifications}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 border-0 shadow-sm" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <span className="text-muted small">Pending Incident Reports</span>
                  <h3 className="fw-bold my-1 text-danger">{stats.pendingReports}</h3>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 border-0 shadow-sm" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
                  <span className="text-muted small">Total Bookings Executed</span>
                  <h3 className="fw-bold my-1 text-success">{stats.totalBookings}</h3>
                </div>
              </div>
            </div>
          )}

          {/* VERIFICATIONS TAB */}
          {tab === "verifications" && (
            <div className="card border-0 shadow-sm p-3" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
              <h5 className="fw-bold mb-3">Verification Review Queue</h5>
              {verifications.length === 0 ? (
                <p className="text-muted small">No verification requests found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle small">
                    <thead className="table-light">
                      <tr>
                        <th>User ID</th>
                        <th>Document Type</th>
                        <th>Redacted ID</th>
                        <th>Declared Age</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifications.map((v) => (
                        <tr key={v.id}>
                          <td><code>{v.userId.slice(0, 8)}</code></td>
                          <td className="text-capitalize">{v.documentType}</td>
                          <td>{v.idNumberRedacted}</td>
                          <td>{v.verifiedAge} yrs</td>
                          <td>
                            <span className={`badge ${v.status === 'verified' ? 'bg-success' : v.status === 'pending' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                              {v.status}
                            </span>
                          </td>
                          <td>
                            {v.status === "pending" && (
                              <div className="d-flex gap-2">
                                <button onClick={() => handleReviewVerification(v.userId, "verify")} className="btn btn-sm btn-success py-0 px-2">Approve</button>
                                <button onClick={() => handleReviewVerification(v.userId, "reject")} className="btn btn-sm btn-danger py-0 px-2">Reject</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* REPORTS TAB */}
          {tab === "reports" && (
            <div className="card border-0 shadow-sm p-3" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
              <h5 className="fw-bold mb-3">Safety & Grievance Incident Reports</h5>
              {reports.length === 0 ? (
                <p className="text-muted small">No incident reports filed.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle small">
                    <thead className="table-light">
                      <tr>
                        <th>Report ID</th>
                        <th>Reporter</th>
                        <th>Reported User</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.map((r) => (
                        <tr key={r.id}>
                          <td><code>{r.id.slice(0, 8)}</code></td>
                          <td>{r.reporterId.slice(0, 8)}</td>
                          <td><span className="text-danger fw-bold">{r.reportedUserId.slice(0, 8)}</span></td>
                          <td>{r.reason}</td>
                          <td><span className="badge bg-secondary">{r.status}</span></td>
                          <td>
                            {r.status === "PENDING" && (
                              <div className="d-flex gap-1">
                                <button onClick={() => handleResolveReport(r.id, "RESOLVED")} className="btn btn-sm btn-outline-success py-0 px-2">Resolve</button>
                                <button onClick={() => handleResolveReport(r.id, "DISMISSED")} className="btn btn-sm btn-outline-secondary py-0 px-2">Dismiss</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* AUDIT LOGS TAB */}
          {tab === "audit-logs" && (
            <div className="card border-0 shadow-sm p-3" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
              <h5 className="fw-bold mb-3">Administrative & Compliance Audit Logs</h5>
              <div className="table-responsive">
                <table className="table table-sm table-striped small">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Actor</th>
                      <th>Action</th>
                      <th>Target</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td>{new Date(log.timestamp).toLocaleString()}</td>
                        <td><code>{log.actorId ? log.actorId.slice(0, 8) : 'SYSTEM'}</code></td>
                        <td><span className="badge bg-dark">{log.action}</span></td>
                        <td>{log.targetType}: {log.targetId ? log.targetId.slice(0, 8) : '-'}</td>
                        <td><pre className="mb-0 small">{JSON.stringify(log.details)}</pre></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {tab === "users" && (
            <div className="card border-0 shadow-sm p-3" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)" }}>
              <h5 className="fw-bold mb-3">Platform Members & Companions</h5>
              <div className="table-responsive">
                <table className="table table-hover small">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td><code>{u.id.slice(0, 8)}</code></td>
                        <td>{u.email}</td>
                        <td><span className="badge bg-light text-dark border">{u.role}</span></td>
                        <td><span className="badge bg-success">{u.status}</span></td>
                        <td>{u.identityVerified ? "✅ Yes" : "⏳ No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
