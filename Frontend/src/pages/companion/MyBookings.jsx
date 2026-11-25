import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiMessageCircle,
  FiShield,
  FiCheckCircle,
  FiPlus,
  FiRefreshCw,
  FiX,
  FiAlertTriangle,
  FiStar
} from "react-icons/fi";
import { getBookings, cancelBooking } from "../../utils/mockStorage";
import { useSafety } from "../../context/SafetyContext";
import RateMeetupModal from "../../components/reviews/RateMeetupModal";
import "./MyBookings.css";

const TABS = [
  { id: "ALL", label: "All" },
  { id: "CONFIRMED", label: "Upcoming" },
  { id: "COMPLETED", label: "Completed" },
  { id: "CANCELLED", label: "Cancelled" }
];

const STATUS_LABEL = {
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const getDateParts = (value) => {
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return {
    day: d.getDate(),
    month: d.toLocaleString("en-IN", { month: "short" }),
    weekday: d.toLocaleString("en-IN", { weekday: "short" })
  };
};

const MyBookings = () => {
  const navigate = useNavigate();
  const { startSession } = useSafety();

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [ratingTarget, setRatingTarget] = useState(null);
  const [toast, setToast] = useState("");

  const loadBookings = () => setBookings(getBookings());

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const counts = useMemo(() => {
    const c = { ALL: bookings.length, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0 };
    bookings.forEach((b) => {
      if (c[b.status] !== undefined) c[b.status] += 1;
    });
    return c;
  }, [bookings]);

  const escrowHeld = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "CONFIRMED")
        .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0),
    [bookings]
  );

  const confirmCancel = () => {
    const updated = cancelBooking(cancelTarget.id);
    setBookings(updated);
    setCancelTarget(null);
    setToast("Rental booking cancelled successfully.");
  };

  const handleStartSafeTrack = async (booking) => {
    try {
      await startSession({
        destination: booking.venue,
        durationMinutes: (booking.durationHours || 2) * 60
      });
    } catch (err) {
      // continue to Safety Center even if the session could not start automatically
    }
    navigate("/safety");
  };

  const filtered = bookings.filter((b) => filter === "ALL" || b.status === filter);

  return (
    <div className="mb-page">
      {/* Header */}
      <header className="mb-header">
        <div>
          <h1 className="mb-title">My bookings</h1>
          <p className="mb-sub">
            Track your upcoming companion outings, scheduled meetups and SafeTrack™ safety in one place.
          </p>
        </div>
        <div className="mb-header-actions">
          <button type="button" onClick={loadBookings} className="mb-btn mb-btn-ghost">
            <FiRefreshCw size={14} /> Refresh
          </button>
          <Link to="/discover" className="mb-btn mb-btn-primary">
            <FiPlus size={16} /> Book a companion
          </Link>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-stats" aria-label="Booking summary">
        <div className="mb-stat">
          <span className="mb-stat-label">Upcoming</span>
          <span className="mb-stat-value">{counts.CONFIRMED}</span>
        </div>
        <div className="mb-stat">
          <span className="mb-stat-label">Completed</span>
          <span className="mb-stat-value">{counts.COMPLETED}</span>
        </div>
        <div className="mb-stat mb-stat-accent">
          <span className="mb-stat-label">Estimated Rental</span>
          <span className="mb-stat-value">{formatINR(escrowHeld)}</span>
          <span className="mb-stat-note">Pay in hand directly to companion</span>
        </div>
      </section>

      {/* Tabs */}
      <nav className="mb-tabs" role="tablist" aria-label="Filter bookings">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={filter === tab.id}
            onClick={() => setFilter(tab.id)}
            className={`mb-tab ${filter === tab.id ? "is-active" : ""}`}
          >
            {tab.label}
            <span className="mb-tab-count">{counts[tab.id]}</span>
          </button>
        ))}
      </nav>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="mb-empty">
          <div className="mb-empty-icon">
            <FiCalendar size={28} />
          </div>
          <h3>{filter === "ALL" ? "No bookings yet" : `No ${STATUS_LABEL[filter].toLowerCase()} bookings`}</h3>
          <p>
            {filter === "ALL"
              ? "Browse verified companions in Delhi NCR and plan your first outing."
              : "Bookings with this status will show up here."}
          </p>
          <Link to="/discover" className="mb-btn mb-btn-primary">
            Find a companion
          </Link>
        </div>
      ) : (
        <ul className="mb-list">
          {filtered.map((b) => {
            const parts = getDateParts(b.date);
            const status = (b.status || "").toLowerCase();
            return (
              <li key={b.id} className={`mb-card is-${status}`}>
                {/* Date block */}
                <div className="mb-date" aria-hidden="true">
                  {parts ? (
                    <>
                      <span className="mb-date-month">{parts.month}</span>
                      <span className="mb-date-day">{parts.day}</span>
                      <span className="mb-date-week">{parts.weekday}</span>
                    </>
                  ) : (
                    <FiCalendar size={22} />
                  )}
                </div>

                {/* Main info */}
                <div className="mb-main">
                  <div className="mb-person">
                    <img src={b.companionPhoto} alt={b.companionName} className="mb-avatar" />
                    <div className="mb-person-text">
                      <div className="mb-name-row">
                        <span className="mb-name">{b.companionName}</span>
                        <span className={`mb-status mb-status-${status}`}>
                          {STATUS_LABEL[b.status] || b.status}
                        </span>
                      </div>
                      <div className="mb-activity">{b.activityName || "Social outing"}</div>
                    </div>
                  </div>

                  <div className="mb-meta">
                    <span>
                      <FiCalendar size={14} /> {b.date}
                    </span>
                    <span>
                      <FiClock size={14} /> {b.time} · {b.durationHours || 2} hrs
                    </span>
                    <span>
                      <FiMapPin size={14} /> {b.venue}
                    </span>
                  </div>

                  {b.notes && <p className="mb-note">Your note: “{b.notes}”</p>}
                  <div className="mb-ref">Booking ID: {b.id}</div>
                </div>

                {/* Payment + actions */}
                <div className="mb-side">
                  <div className="mb-amount">
                    <span className="mb-amount-label">
                      {b.status === "CANCELLED" ? "Cancelled" : "Rental (In-Hand)"}
                    </span>
                    <span className="mb-amount-value">{formatINR(b.totalAmount)}</span>
                    <span className="mb-escrow">
                      <FiCheckCircle size={13} /> {b.paymentMethod || "Direct Pay in Hand"}
                    </span>
                  </div>

                  <div className="mb-actions">
                    {b.status === "CONFIRMED" && (
                      <button
                        type="button"
                        onClick={() => handleStartSafeTrack(b)}
                        className="mb-btn mb-btn-primary mb-btn-block"
                        title="Start live GPS safety monitoring for this outing"
                      >
                        <FiShield size={15} /> Start SafeTrack
                      </button>
                    )}
                    {b.status === "COMPLETED" && (
                      b.isRated ? (
                        <div className="mb-rated-pill">
                          <FiStar size={13} className="text-warning fill-warning" />
                          <span>Outing Rated {b.userRating ? `${b.userRating}.0` : "5.0"} ★</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setRatingTarget(b)}
                          className="mb-btn mb-btn-rate mb-btn-block"
                          title="Rate your friend after meetup"
                        >
                          <FiStar size={14} /> Rate Outing
                        </button>
                      )
                    )}
                    <div className="mb-actions-row">
                      <button
                        type="button"
                        onClick={() => navigate(`/messages?partnerId=${b.companionId}`)}
                        className="mb-btn mb-btn-outline"
                      >
                        <FiMessageCircle size={14} /> Chat
                      </button>
                      {b.status === "CONFIRMED" && (
                        <button
                          type="button"
                          onClick={() => setCancelTarget(b)}
                          className="mb-btn mb-btn-quiet"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Rate Meetup Modal */}
      {ratingTarget && (
        <RateMeetupModal
          show={Boolean(ratingTarget)}
          onHide={() => setRatingTarget(null)}
          booking={ratingTarget}
          onReviewSubmitted={() => {
            loadBookings();
            setToast("🎉 Thank you! Your friendly rating has been submitted.");
          }}
        />
      )}

      {/* Cancel modal */}
      {cancelTarget && (
        <div className="mb-overlay" onClick={() => setCancelTarget(null)}>
          <div
            className="mb-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="mb-modal-close"
              onClick={() => setCancelTarget(null)}
              aria-label="Close"
            >
              <FiX size={18} />
            </button>
            <div className="mb-modal-icon">
              <FiAlertTriangle size={24} />
            </div>
            <h3 id="cancel-title">Cancel this booking?</h3>
            <p>
              Your booking with <strong>{cancelTarget.companionName}</strong> on{" "}
              <strong>{cancelTarget.date}</strong> will be cancelled. The{" "}
              <strong>{formatINR(cancelTarget.totalAmount)}</strong> held in escrow will be
              refunded to your Velora Wallet right away.
            </p>
            <div className="mb-modal-actions">
              <button
                type="button"
                className="mb-btn mb-btn-outline"
                onClick={() => setCancelTarget(null)}
              >
                Keep booking
              </button>
              <button type="button" className="mb-btn mb-btn-danger" onClick={confirmCancel}>
                Cancel booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="mb-toast" role="status">
          <FiCheckCircle size={18} /> {toast}
        </div>
      )}
    </div>
  );
};

export default MyBookings;