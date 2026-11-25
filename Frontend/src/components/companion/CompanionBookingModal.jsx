import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiShield,
  FiCheck,
  FiMessageCircle,
  FiList,
  FiStar,
  FiZap
} from "react-icons/fi";
import confetti from "canvas-confetti";
import { saveBooking, openOrCreateConversation, getSubscription } from "../../utils/mockStorage";
import NearbyPlaces from "../nearby/NearbyPlaces";
import SubscriptionModal from "../subscription/SubscriptionModal";
import "./CompanionBookingModal.css";

const OCCASIONS = [
  { id: "coffee", name: "Coffee & conversation", fullName: "Artisan Coffee & Conversation", defaultDuration: 2, icon: "☕" },
  { id: "dinner", name: "Fine dining", fullName: "Romantic Fine Dining", defaultDuration: 2, icon: "🍷" },
  { id: "shopping", name: "Shopping & styling", fullName: "Shopping & Fashion Styling", defaultDuration: 3, icon: "🛍️" },
  { id: "movie", name: "Movie night", fullName: "Movie Night & Popcorn", defaultDuration: 3, icon: "🎬" },
  { id: "event", name: "Wedding / event plus-one", fullName: "Wedding & Corporate Plus-One", defaultDuration: 4, icon: "🎟️" },
  { id: "travel", name: "City tour & day trip", fullName: "City Tour & Day Trip", defaultDuration: 6, icon: "✈️" }
];

const VENUE_PRESETS = [
  "CyberHub, DLF Phase 2, Gurgaon",
  "Khan Market, Central Delhi",
  "DLF Mall of India, Sector 18 Noida",
  "Select Citywalk, Saket Delhi",
  "Worldmark Aerocity, Delhi",
  "Connaught Place (Inner Circle), Delhi",
  "Galleria Market, DLF Phase 4, Gurgaon"
];

const DURATIONS = [1, 2, 3, 4, 6, 8];

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const todayISO = () => new Date().toISOString().split("T")[0];

const CompanionBookingModal = ({ show, onHide, companion, onSuccess }) => {
  const navigate = useNavigate();

  const [occasion, setOccasion] = useState("dinner");
  const [duration, setDuration] = useState(2);
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("19:00");
  const [venue, setVenue] = useState(
    companion?.area ? `${companion.area}, ${companion.city}` : "CyberHub, DLF Phase 2, Gurgaon"
  );
  const [notes, setNotes] = useState("");
  const [agreedSafety, setAgreedSafety] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [currentSub, setCurrentSub] = useState(getSubscription());

  // Close on Escape and lock background scroll while the modal is open
  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setCurrentSub(getSubscription());
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show || !companion) return null;

  const photo =
    companion.photos?.[0] ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600";
  const hourlyRate = companion.hourlyRate || 599;
  const basePrice = hourlyRate * duration;
  const location = companion.area || companion.city || "Delhi NCR";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedSafety || submitting) return;

    setSubmitting(true);

    setTimeout(() => {
      const selected = OCCASIONS.find((o) => o.id === occasion) || OCCASIONS[0];
      const newBooking = {
        id: "BK-" + Math.floor(1000 + Math.random() * 9000),
        companionId: companion.userId || companion.id,
        companionName: companion.firstName,
        companionAge: companion.age,
        companionPhoto: photo,
        companionRate: hourlyRate,
        companionArea: location,
        date,
        time,
        durationHours: duration,
        activityName: selected.fullName,
        activityId: occasion,
        venue,
        notes,
        totalAmount: basePrice, // Companion's rental rate (Paid in hand directly)
        platformFee: 0,
        paymentMethod: "Direct Cash/UPI in Hand",
        status: "CONFIRMED",
        createdAt: new Date().toISOString()
      };

      saveBooking(newBooking);
      openOrCreateConversation(companion);

      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (err) {
        console.log("Confetti trigger:", err);
      }

      setSubmitting(false);
      setBookingSuccess(newBooking);
      if (onSuccess) onSuccess(newBooking);
    }, 600);
  };

  function handleClose() {
    setBookingSuccess(null);
    onHide();
  }

  const handleGoToBookings = () => {
    handleClose();
    navigate("/bookings");
  };

  const handleGoToChat = () => {
    handleClose();
    navigate(`/messages?partnerId=${companion.userId || companion.id}`);
  };

  return createPortal(
    <>
      <div className="bm-overlay" onClick={handleClose}>
        <div
          className="bm-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bm-title"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="bm-header">
            <img src={photo} alt={companion.firstName} className="bm-avatar" />
            <div className="bm-header-text">
              <h2 id="bm-title" className="bm-title">
                {bookingSuccess ? "Rental Booking Confirmed" : `Book ${companion.firstName} for Rent`}
              </h2>
              <div className="bm-subtitle">
                <FiMapPin size={13} /> {location} · {formatINR(hourlyRate)}/hr (Direct in-hand pay)
              </div>
            </div>
            <button type="button" onClick={handleClose} className="bm-close" aria-label="Close">
              <FiX size={18} />
            </button>
          </header>

          {bookingSuccess ? (
            /* ---------- Success view ---------- */
            <div className="bm-success">
              <div className="bm-success-icon">
                <FiCheck size={34} />
              </div>
              <h3>Rental Booking Confirmed! 🎉</h3>
              <p>
                Your meetup with <strong>{companion.firstName}</strong> is scheduled. Velora has connected you directly. Please pay <strong>{formatINR(bookingSuccess.totalAmount)}</strong> directly to {companion.firstName} in hand (Cash or UPI) when you meet at the venue.
              </p>

              <dl className="bm-receipt">
                <div>
                  <dt>Booking ID</dt>
                  <dd className="bm-mono">{bookingSuccess.id}</dd>
                </div>
                <div>
                  <dt>Companion</dt>
                  <dd>{companion.firstName} ({location})</dd>
                </div>
                <div>
                  <dt>Experience</dt>
                  <dd>{bookingSuccess.activityName}</dd>
                </div>
                <div>
                  <dt>Date &amp; time</dt>
                  <dd>
                    {bookingSuccess.date} at {bookingSuccess.time}
                  </dd>
                </div>
                <div>
                  <dt>Duration</dt>
                  <dd>{bookingSuccess.durationHours} hours</dd>
                </div>
                <div>
                  <dt>Meeting Venue</dt>
                  <dd>{bookingSuccess.venue}</dd>
                </div>
                <div>
                  <dt>Platform Booking Fee</dt>
                  <dd className="text-success">₹0 (Free with Membership)</dd>
                </div>
                <div className="bm-receipt-total">
                  <dt>Rental to pay in hand</dt>
                  <dd>{formatINR(bookingSuccess.totalAmount)}</dd>
                </div>
                <div className="bm-receipt-payment-note">
                  <dt>Payment Mode</dt>
                  <dd>🤝 Hand-to-hand Cash or UPI to {companion.firstName}</dd>
                </div>
              </dl>

              <div className="bm-success-actions">
                <button type="button" onClick={handleGoToChat} className="bm-btn bm-btn-outline">
                  <FiMessageCircle size={15} /> Chat with {companion.firstName}
                </button>
                <button type="button" onClick={handleGoToBookings} className="bm-btn bm-btn-primary">
                  <FiList size={15} /> View my bookings
                </button>
              </div>
            </div>
          ) : (
            /* ---------- Booking form ---------- */
            <form onSubmit={handleSubmit} className="bm-form">
              <div className="bm-body">
                {/* Active Membership Badge */}
                <div className="bm-membership-bar">
                  <div className="bm-membership-left">
                    <FiStar size={14} className="text-warning fill-warning" />
                    <span>
                      <strong>{currentSub?.planName || "Velora VIP Connect Pass"}</strong> Active
                    </span>
                    <span className="bm-zero-comm-pill">₹0 Booking Fees</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowSubModal(true)}
                    className="bm-membership-btn"
                  >
                    View Plans
                  </button>
                </div>

                {/* Experience */}
                <section className="bm-section">
                  <h3 className="bm-section-title">1. Choose an experience</h3>
                  <div className="bm-occasions" role="group" aria-label="Experience">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ.id}
                        type="button"
                        aria-pressed={occasion === occ.id}
                        onClick={() => {
                          setOccasion(occ.id);
                          setDuration(occ.defaultDuration);
                        }}
                        className={`bm-occasion ${occasion === occ.id ? "is-selected" : ""}`}
                      >
                        <span className="bm-occasion-icon">{occ.icon}</span>
                        <span className="bm-occasion-name">{occ.name}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* When */}
                <section className="bm-section">
                  <h3 className="bm-section-title">2. Date &amp; Duration</h3>
                  <div className="bm-grid-2">
                    <label className="bm-field">
                      <span className="bm-label">
                        <FiCalendar size={13} /> Date
                      </span>
                      <input
                        type="date"
                        required
                        min={todayISO()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="bm-input"
                      />
                    </label>
                    <label className="bm-field">
                      <span className="bm-label">
                        <FiClock size={13} /> Start time
                      </span>
                      <input
                        type="time"
                        required
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="bm-input"
                      />
                    </label>
                  </div>

                  <div className="bm-field">
                    <span className="bm-label">Duration</span>
                    <div className="bm-durations" role="group" aria-label="Duration in hours">
                      {DURATIONS.map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          aria-pressed={duration === hrs}
                          onClick={() => setDuration(hrs)}
                          className={`bm-chip ${duration === hrs ? "is-selected" : ""}`}
                        >
                          {hrs} hr{hrs > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Where */}
                <section className="bm-section">
                  <h3 className="bm-section-title">3. Public Meeting Venue</h3>
                  <label className="bm-field">
                    <span className="bm-label">
                      <FiMapPin size={13} /> Meeting venue in Delhi NCR
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CyberHub, DLF Phase 2, Gurgaon"
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="bm-input"
                    />
                  </label>
                  <div className="bm-presets" aria-label="Popular venues">
                    {VENUE_PRESETS.slice(0, 4).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setVenue(p)}
                        className={`bm-chip bm-chip-small ${venue === p ? "is-selected" : ""}`}
                      >
                        {p.split(",")[0]}
                      </button>
                    ))}
                  </div>

                  {/* OpenStreetMap Nearby Places Component */}
                  <div className="bm-nearby">
                    <NearbyPlaces
                      venue={venue}
                      companion={companion}
                      selectedPlaceName={venue}
                      onPlaceSelect={(place) => {
                        const areaPart = venue.includes(",")
                          ? venue.split(",").slice(1).join(",").trim()
                          : venue;
                        setVenue(`${place.name}, ${areaPart}`);
                      }}
                    />
                  </div>

                  <label className="bm-field">
                    <span className="bm-label">Notes for {companion.firstName} (optional)</span>
                    <textarea
                      rows={2}
                      placeholder="Dress code, table booking name, or preferences for the date"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bm-input bm-textarea"
                    />
                  </label>
                </section>

                {/* Direct In-Hand Rental Rate Summary (No app payment) */}
                <section className="bm-section">
                  <h3 className="bm-section-title">4. Rental Rate &amp; In-Hand Payment Terms</h3>
                  <div className="bm-rate-summary">
                    <div className="bm-rate-row">
                      <span>Companion Rental Rate ({formatINR(hourlyRate)} × {duration} hrs)</span>
                      <strong>{formatINR(basePrice)}</strong>
                    </div>
                    <div className="bm-rate-row">
                      <span>Velora Platform Commission</span>
                      <span className="bm-free-tag">₹0 (Free with Connect Pass)</span>
                    </div>
                    <div className="bm-rate-row bm-rate-app-charge">
                      <span>Amount charged on App today</span>
                      <span className="bm-zero-due">₹0 (No online payment)</span>
                    </div>

                    <div className="bm-hand-payment-card">
                      <div className="bm-hand-payment-header">
                        <span className="bm-hand-icon">🤝</span>
                        <div>
                          <strong>Pay directly in hand at meetup</strong>
                          <p>
                            Velora connects you both directly. You will pay <strong>{formatINR(basePrice)}</strong> directly in cash or UPI to <strong>{companion.firstName}</strong> when you meet at the public venue.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Safety Consent */}
                <label className="bm-consent">
                  <input
                    type="checkbox"
                    checked={agreedSafety}
                    onChange={(e) => setAgreedSafety(e.target.checked)}
                  />
                  <span>
                    <FiShield size={14} /> I agree to Velora’s 18+ platonic companionship policy, meeting strictly at verified public venues, and paying {companion.firstName} {formatINR(basePrice)} directly in hand.
                  </span>
                </label>
              </div>

              {/* Footer */}
              <footer className="bm-footer">
                <div className="bm-footer-total">
                  <span>Direct in-hand rental</span>
                  <strong>{formatINR(basePrice)}</strong>
                  <small className="bm-pay-hint">Pay {companion.firstName} in person (₹0 on app)</small>
                </div>
                <div className="bm-footer-actions">
                  <button type="button" onClick={handleClose} className="bm-btn bm-btn-outline">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!agreedSafety || submitting}
                    className="bm-btn bm-btn-primary"
                    title={!agreedSafety ? "Accept the terms & safety policy to continue" : undefined}
                  >
                    <FiCheck size={16} />
                    {submitting ? "Booking Rental…" : "Confirm & Book for Rent"}
                  </button>
                </div>
              </footer>
            </form>
          )}
        </div>
      </div>

      {/* Subscription / Membership Modal */}
      <SubscriptionModal
        show={showSubModal}
        onHide={() => setShowSubModal(false)}
        onSubscribed={(sub) => {
          setCurrentSub(sub);
          setShowSubModal(false);
        }}
      />
    </>,
    document.body
  );
};

export default CompanionBookingModal;
