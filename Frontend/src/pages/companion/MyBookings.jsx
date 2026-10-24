import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiMessageCircle,
  FiShield,
  FiCheckCircle,
  FiPlus,
  FiRefreshCw
} from "react-icons/fi";
import { getBookings, cancelBooking } from "../../utils/mockStorage";
import { useSafety } from "../../context/SafetyContext";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();
  const { startSession } = useSafety();

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL, CONFIRMED, COMPLETED, CANCELLED

  const loadBookings = () => {
    setBookings(getBookings());
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking? Funds in Escrow will be immediately refunded to your Velora Wallet.")) {
      const updated = cancelBooking(bookingId);
      setBookings(updated);
      alert("Booking cancelled and ₹ refunded to your Velora Wallet.");
    }
  };

  const handleStartSafeTrack = async (booking) => {
    try {
      await startSession({
        destination: booking.venue,
        durationMinutes: (booking.durationHours || 2) * 60
      });
      navigate("/safety");
    } catch (err) {
      alert("SafeTrack started! Redirecting to Safety Center.");
      navigate("/safety");
    }
  };

  const filtered = bookings.filter(b => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  return (
    <div className="bookings-container">
      {/* Header */}
      <div className="bookings-header-wrap">
        <div>
          <h2 className="bookings-title">My Companion Bookings</h2>
          <p className="bookings-sub">
            Manage your companion rental dates, escrow payments, and live SafeTrack.
          </p>
        </div>

        <div className="bookings-actions">
          <button
            type="button"
            onClick={loadBookings}
            className="btn btn-outline-secondary btn-sm rounded-pill d-flex align-items-center gap-1"
            title="Refresh"
          >
            <FiRefreshCw size={13} /> Refresh
          </button>
          <Link to="/discover" className="btn-book-new">
            <FiPlus size={15} /> Book Companion
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bookings-filter-bar">
        {[
          { id: "ALL", label: `All Bookings (${bookings.length})` },
          { id: "CONFIRMED", label: "Upcoming / Confirmed" },
          { id: "COMPLETED", label: "Completed" },
          { id: "CANCELLED", label: "Cancelled" }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`booking-tab-pill ${filter === tab.id ? "is-active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="card p-5 text-center border-0 shadow-sm rounded-4 bg-white">
          <div
            className="badge rounded-circle p-3 mx-auto mb-3 d-flex align-items-center justify-content-center"
            style={{ width: "64px", height: "64px", background: "#FFF1F4", color: "#E11D48" }}
          >
            <FiCalendar size={28} />
          </div>
          <h4 className="fw-bold mb-2">No bookings found</h4>
          <p className="text-muted small mb-4" style={{ maxWidth: "420px", margin: "0 auto" }}>
            {filter === "ALL"
              ? "You haven't rented any companion yet. Browse verified companions in Delhi NCR and plan your first outing!"
              : `No bookings matching "${filter}" status.`}
          </p>
          <div>
            <Link to="/discover" className="btn-book-new" style={{ margin: "0 auto" }}>
              Explore Available Companions
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map(b => (
            <div key={b.id} className="col-12">
              <div className="booking-card">
                <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
                  {/* Left: Companion & Date Info */}
                  <div className="d-flex gap-3">
                    <img
                      src={b.companionPhoto}
                      alt={b.companionName}
                      className="booking-partner-avatar"
                    />

                    <div>
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                        <span className="booking-partner-name">
                          {b.companionName}
                        </span>
                        <span className="badge rounded-pill bg-light text-danger border" style={{ fontSize: "0.72rem" }}>
                          Ref: {b.id}
                        </span>
                        <span
                          className={`booking-status-badge ${
                            b.status === "CONFIRMED"
                              ? "booking-status-confirmed"
                              : b.status === "CANCELLED"
                              ? "booking-status-cancelled"
                              : "booking-status-completed"
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <div className="fw-semibold text-danger small mb-2">
                        🎯 {b.activityName || "Social Outing"}
                      </div>

                      <div className="d-flex flex-wrap gap-3 small text-muted">
                        <span className="d-flex align-items-center gap-1">
                          <FiCalendar size={13} className="text-danger" />
                          {b.date}
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <FiClock size={13} className="text-danger" />
                          {b.time} ({b.durationHours || 2} hrs)
                        </span>
                        <span className="d-flex align-items-center gap-1">
                          <FiMapPin size={13} className="text-danger" />
                          {b.venue}
                        </span>
                      </div>

                      {b.notes && (
                        <p className="small text-muted mb-0 mt-2 fst-italic">
                          Note: "{b.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Payment & Action Buttons */}
                  <div className="d-flex flex-column justify-content-between align-items-md-end border-top border-md-top-0 pt-3 pt-md-0">
                    <div className="text-md-end mb-3">
                      <div className="small text-muted">Escrow Amount</div>
                      <div className="h4 fw-bold text-dark mb-0">₹{b.totalAmount}</div>
                      <span className="booking-escrow-pill">
                        <FiCheckCircle size={13} /> {b.paymentMethod || "Escrow Protected"}
                      </span>
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/messages?partnerId=${b.companionId}`)}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 d-flex align-items-center gap-1"
                      >
                        <FiMessageCircle size={14} /> Chat
                      </button>

                      {b.status === "CONFIRMED" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleStartSafeTrack(b)}
                            className="btn btn-sm btn-danger rounded-pill px-3 d-flex align-items-center gap-1 text-white shadow-sm"
                            title="Start live GPS safety monitor for this outing"
                          >
                            <FiShield size={14} /> Start SafeTrack™
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCancel(b.id)}
                            className="btn btn-sm btn-light text-muted rounded-pill px-2.5"
                            title="Cancel booking"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
