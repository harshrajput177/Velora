import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiDollarSign,
  FiStar,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiShield,
  FiZap,
  FiEdit2,
  FiUsers,
  FiTrendingUp,
  FiMapPin
} from "react-icons/fi";

const INITIAL_REQUESTS = [
  {
    id: "REQ-401",
    clientName: "Rohan V.",
    clientAge: 28,
    clientArea: "Golf Course Road, Gurgaon",
    activity: "Romantic Fine Dining",
    date: "2026-10-25",
    time: "20:00",
    duration: 3,
    venue: "Olive Bar & Kitchen, Mehrauli",
    payout: 2097,
    status: "PENDING"
  },
  {
    id: "REQ-402",
    clientName: "Sameer K.",
    clientAge: 26,
    clientArea: "Vasant Vihar, Delhi",
    activity: "Artisan Coffee & Deep Talks",
    date: "2026-10-26",
    time: "17:00",
    duration: 2,
    venue: "Blue Tokai Coffee Roasters, Khan Market",
    payout: 1398,
    status: "PENDING"
  }
];

const CompanionDashboard = () => {
  const [availableNow, setAvailableNow] = useState(true);
  const [hourlyRate, setHourlyRate] = useState(699);
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [totalEarnings, setTotalEarnings] = useState(48500);

  const handleAction = (id, action) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: action } : r))
    );
    if (action === "ACCEPTED") {
      alert("Booking request accepted! Client has been notified and funds locked in Escrow.");
    } else {
      alert("Booking request declined.");
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1100px" }}>
      {/* Header Banner */}
      <div className="card p-4 p-md-5 border-0 shadow-sm rounded-4 bg-white mb-4 position-relative overflow-hidden">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge rounded-pill bg-danger px-3 py-1 text-white">
                Companion Provider Console
              </span>
              <span className="badge rounded-pill bg-light text-dark border">
                <FiCheckCircle size={12} className="text-success me-1" /> 18+ KYC Verified
              </span>
            </div>
            <h2 className="fw-bold mb-1" style={{ fontFamily: "var(--font-serif)" }}>
              Welcome back, Partner
            </h2>
            <p className="text-muted small mb-0">
              Manage your availability, bookings, rental rates, and Velora Escrow payouts.
            </p>
          </div>

          {/* Available Now Toggle Switch */}
          <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-light border">
            <div>
              <div className="fw-bold small text-dark">Live Availability</div>
              <div className="small text-muted" style={{ fontSize: "0.78rem" }}>
                {availableNow ? "🟢 Visible in 'Available Now'" : "⚪ Offline"}
              </div>
            </div>
            <div className="form-check form-switch fs-4 mb-0">
              <input
                className="form-check-input cursor-pointer"
                type="checkbox"
                role="switch"
                checked={availableNow}
                onChange={(e) => setAvailableNow(e.target.checked)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card p-3 border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="small text-muted mb-1 d-flex align-items-center justify-content-between">
              Total Earnings
              <FiDollarSign className="text-success" />
            </div>
            <div className="h4 fw-bold text-dark mb-0">₹{totalEarnings.toLocaleString()}</div>
            <small className="text-success mt-1 d-block" style={{ fontSize: "0.75rem" }}>
              +₹4,200 this week
            </small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card p-3 border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="small text-muted mb-1 d-flex align-items-center justify-content-between">
              Completed Dates
              <FiCalendar className="text-danger" />
            </div>
            <div className="h4 fw-bold text-dark mb-0">28 Outings</div>
            <small className="text-muted mt-1 d-block" style={{ fontSize: "0.75rem" }}>
              100% 5-star rating
            </small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card p-3 border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="small text-muted mb-1 d-flex align-items-center justify-content-between">
              Satisfaction
              <FiStar className="text-warning fill-warning" />
            </div>
            <div className="h4 fw-bold text-dark mb-0">4.98 ★</div>
            <small className="text-muted mt-1 d-block" style={{ fontSize: "0.75rem" }}>
              Based on 44 reviews
            </small>
          </div>
        </div>

        <div className="col-6 col-md-3">
          <div className="card p-3 border-0 shadow-sm rounded-4 bg-white h-100">
            <div className="small text-muted mb-1 d-flex align-items-center justify-content-between">
              Hourly Rate
              <FiEdit2
                className="text-primary cursor-pointer"
                onClick={() => setIsEditingRate(!isEditingRate)}
                style={{ cursor: "pointer" }}
              />
            </div>
            {isEditingRate ? (
              <div className="d-flex align-items-center gap-1 mt-1">
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="form-control form-control-sm"
                  style={{ width: "90px" }}
                />
                <button
                  type="button"
                  onClick={() => setIsEditingRate(false)}
                  className="btn btn-sm btn-danger py-0 px-2"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="h4 fw-bold text-dark mb-0">
                ₹{hourlyRate}
                <span className="small text-muted fw-normal" style={{ fontSize: "0.8rem" }}> / hr</span>
              </div>
            )}
            <small className="text-muted mt-1 d-block" style={{ fontSize: "0.75rem" }}>
              Tap icon to edit
            </small>
          </div>
        </div>
      </div>

      {/* Incoming Requests Section */}
      <div className="card p-4 border-0 shadow-sm rounded-4 bg-white mb-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h5 className="fw-bold mb-0">Incoming Rental Invitations</h5>
            <small className="text-muted">Review client requests for social and dinner dates</small>
          </div>
          <span className="badge rounded-pill bg-danger px-3 py-1">
            {requests.filter(r => r.status === "PENDING").length} Pending
          </span>
        </div>

        <div className="row g-3">
          {requests.map(req => (
            <div key={req.id} className="col-12">
              <div className="p-3 rounded-4 border bg-light d-flex flex-column flex-md-row justify-content-between gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="fw-bold text-dark">{req.clientName}, {req.clientAge}</span>
                    <span className="badge bg-white text-muted border" style={{ fontSize: "0.72rem" }}>
                      {req.id}
                    </span>
                    <span
                      className={`badge rounded-pill ${
                        req.status === "PENDING"
                          ? "bg-warning text-dark"
                          : req.status === "ACCEPTED"
                          ? "bg-success text-white"
                          : "bg-secondary text-white"
                      }`}
                      style={{ fontSize: "0.72rem" }}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="fw-semibold text-danger small mb-2">
                    🎯 {req.activity}
                  </div>

                  <div className="d-flex flex-wrap gap-3 small text-muted">
                    <span className="d-flex align-items-center gap-1">
                      <FiCalendar size={13} className="text-danger" />
                      {req.date} @ {req.time} ({req.duration} hrs)
                    </span>
                    <span className="d-flex align-items-center gap-1">
                      <FiMapPin size={13} className="text-danger" />
                      {req.venue}
                    </span>
                  </div>
                </div>

                <div className="d-flex flex-column justify-content-between align-items-md-end">
                  <div className="text-md-end mb-2">
                    <div className="small text-muted">Estimated Payout</div>
                    <div className="h5 fw-bold text-success mb-0">₹{req.payout}</div>
                  </div>

                  {req.status === "PENDING" ? (
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAction(req.id, "ACCEPTED")}
                        className="btn btn-sm btn-success rounded-pill px-3 d-flex align-items-center gap-1 text-white shadow-sm"
                      >
                        <FiCheckCircle size={14} /> Accept Date
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(req.id, "DECLINED")}
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className="badge bg-light text-muted border px-3 py-2">
                      {req.status === "ACCEPTED" ? "✓ Accepted (Chat Opened)" : "✕ Declined"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Protocol Reminder */}
      <div className="p-3 rounded-4 bg-light border d-flex align-items-center gap-3">
        <FiShield size={28} className="text-danger flex-shrink-0" />
        <div className="small text-muted">
          <strong className="text-dark d-block">Velora Safety Escrow Guarantee</strong>
          All bookings require clients to meet in verified public places. Intimate physical contact is strictly prohibited under terms of service. For emergency assistance or SafeTrack help, call 112 or our 24/7 concierge.
        </div>
      </div>
    </div>
  );
};

export default CompanionDashboard;
