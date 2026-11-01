import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiCheckCircle,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiShield,
  FiZap,
  FiCreditCard,
  FiDollarSign,
  FiCheck
} from "react-icons/fi";
import confetti from "canvas-confetti";
import { saveBooking, openOrCreateConversation } from "../../utils/mockStorage";
import NearbyPlaces from "../nearby/NearbyPlaces";

const OCCASIONS = [
  { id: "coffee", name: "Artisan Coffee & Conversation", defaultDuration: 2, icon: "☕" },
  { id: "dinner", name: "Romantic Fine Dining", defaultDuration: 2, icon: "🍷" },
  { id: "shopping", name: "Shopping & Fashion Styling", defaultDuration: 3, icon: "🛍️" },
  { id: "movie", name: "Movie Night & Popcorn", defaultDuration: 3, icon: "🎬" },
  { id: "event", name: "Wedding & Corporate Plus-One", defaultDuration: 4, icon: "🎟️" },
  { id: "travel", name: "City Tour & Day Trip", defaultDuration: 6, icon: "✈️" }
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
  const [venue, setVenue] = useState(companion?.area ? `${companion.area}, ${companion.city}` : "CyberHub, DLF Phase 2, Gurgaon");
  const [paymentMethod, setPaymentMethod] = useState("Velora Escrow Wallet");
  const [notes, setNotes] = useState("");
  const [agreedSafety, setAgreedSafety] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  if (!show || !companion) return null;

  const hourlyRate = companion.hourlyRate || 599;
  const basePrice = hourlyRate * duration;
  const platformFee = 149; // Escrow & 18+ safety monitoring fee
  const totalAmount = basePrice + platformFee;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedSafety) {
      alert("Please agree to the Safety & Public Venue guidelines to proceed.");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const selectedOccasionObj = OCCASIONS.find(o => o.id === occasion) || OCCASIONS[0];
      const newBooking = {
        id: "BK-" + Math.floor(1000 + Math.random() * 9000),
        companionId: companion.userId || companion.id,
        companionName: companion.firstName,
        companionAge: companion.age,
        companionPhoto: companion.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
        companionRate: hourlyRate,
        companionArea: companion.area || companion.city || "Delhi NCR",
        date,
        time,
        durationHours: duration,
        activityName: selectedOccasionObj.name,
        activityId: occasion,
        venue,
        notes,
        totalAmount,
        paymentMethod,
        status: "CONFIRMED",
        createdAt: new Date().toISOString()
      };

      // Save to mock database
      saveBooking(newBooking);
      // Open / initialize chat conversation
      openOrCreateConversation(companion);

      // Trigger Confetti
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (err) {
        console.log("Confetti trigger:", err);
      }

      setSubmitting(false);
      setBookingSuccess(newBooking);
      if (onSuccess) onSuccess(newBooking);
    }, 700);
  };

  const handleClose = () => {
    setBookingSuccess(null);
    onHide();
  };

  const handleGoToBookings = () => {
    handleClose();
    navigate("/bookings");
  };

  const handleGoToChat = () => {
    handleClose();
    navigate(`/messages?partnerId=${companion.userId || companion.id}`);
  };

  return (
    <div
      className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(18, 12, 14, 0.75)",
        backdropFilter: "blur(6px)",
        zIndex: 1060,
        overflowY: "auto"
      }}
      onClick={handleClose}
    >
      <div
        className="modal-dialog-custom bg-white shadow-lg overflow-hidden my-auto"
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "20px",
          position: "relative",
          animation: "modalFadeIn 0.25s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
          <div className="d-flex align-items-center gap-3">
            <img
              src={companion.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
              alt={companion.firstName}
              style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover", border: "2px solid #e11d48" }}
            />
            <div>
              <h5 className="fw-bold mb-0 text-dark">
                Rent {companion.firstName} ({companion.gender === "FEMALE" ? "Girlfriend" : "Boyfriend"})
              </h5>
              <div className="small text-muted d-flex align-items-center gap-1">
                <FiMapPin size={12} className="text-danger" />
                {companion.area || companion.city || "Delhi NCR"} • ₹{hourlyRate}/hr
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="btn btn-light rounded-circle shadow-sm"
            style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {bookingSuccess ? (
          /* SUCCESS CONFIRMATION VIEW */
          <div className="p-4 p-sm-5 text-center">
            <div
              className="badge bg-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow"
              style={{ width: "64px", height: "64px" }}
            >
              <FiCheck size={36} className="text-white" />
            </div>

            <h3 className="fw-bold mb-1 text-dark">Booking Confirmed! 🎉</h3>
            <p className="text-muted small mb-4">
              Your rental date with <strong>{companion.firstName}</strong> is locked in with Velora Escrow Protection.
            </p>

            <div className="card p-3 bg-light border-0 text-start rounded-4 mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Booking Reference:</span>
                <span className="fw-bold font-monospace text-danger">{bookingSuccess.id}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Date & Time:</span>
                <span className="fw-bold text-dark">{bookingSuccess.date} @ {bookingSuccess.time}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Duration:</span>
                <span className="fw-bold text-dark">{bookingSuccess.durationHours} Hours</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Venue:</span>
                <span className="fw-semibold text-truncate ms-2" style={{ maxWidth: "250px" }}>{bookingSuccess.venue}</span>
              </div>
              <div className="d-flex justify-content-between pt-2 border-top">
                <span className="fw-bold text-dark">Total Paid (Escrow):</span>
                <span className="fw-bold text-success">₹{bookingSuccess.totalAmount}</span>
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2">
              <button
                type="button"
                onClick={handleGoToChat}
                className="btn btn-outline-danger rounded-pill flex-grow-1 py-2 fw-semibold"
              >
                💬 Chat with {companion.firstName}
              </button>
              <button
                type="button"
                onClick={handleGoToBookings}
                className="btn btn-primary-custom rounded-pill flex-grow-1 py-2 fw-semibold text-white"
                style={{ background: "#e11d48" }}
              >
                📋 View My Bookings
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM */
          <form onSubmit={handleSubmit}>
            <div className="p-4" style={{ maxHeight: "calc(80vh - 140px)", overflowY: "auto" }}>
              {/* Select Occasion */}
              <div className="mb-4">
                <label className="fw-bold small text-dark mb-2 d-block">
                  1. Select Experience / Occasion
                </label>
                <div className="row g-2">
                  {OCCASIONS.map(occ => (
                    <div key={occ.id} className="col-6 col-sm-4">
                      <div
                        onClick={() => {
                          setOccasion(occ.id);
                          setDuration(occ.defaultDuration);
                        }}
                        className={`p-2.5 rounded-3 border text-center cursor-pointer transition-all ${
                          occasion === occ.id
                            ? "border-danger bg-light text-danger fw-bold shadow-sm"
                            : "bg-white text-secondary"
                        }`}
                        style={{ cursor: "pointer", fontSize: "0.82rem" }}
                      >
                        <div style={{ fontSize: "1.4rem" }}>{occ.icon}</div>
                        <div className="text-truncate mt-1">{occ.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="fw-bold small text-dark mb-1 d-flex align-items-center gap-1">
                    <FiCalendar size={13} className="text-danger" /> Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-control rounded-3"
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
                <div className="col-6">
                  <label className="fw-bold small text-dark mb-1 d-flex align-items-center gap-1">
                    <FiClock size={13} className="text-danger" /> Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="form-control rounded-3"
                    style={{ fontSize: "0.9rem" }}
                  />
                </div>
              </div>

              {/* Duration Pills */}
              <div className="mb-3">
                <label className="fw-bold small text-dark mb-1 d-block">
                  Duration (Hours)
                </label>
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 6, 8].map(hrs => (
                    <button
                      key={hrs}
                      type="button"
                      onClick={() => setDuration(hrs)}
                      className={`btn btn-sm flex-grow-1 rounded-pill ${
                        duration === hrs ? "btn-danger fw-bold shadow-sm" : "btn-outline-secondary"
                      }`}
                      style={{ fontSize: "0.82rem" }}
                    >
                      {hrs} hr{hrs > 1 ? "s" : ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue Selector */}
              <div className="mb-3">
                <label className="fw-bold small text-dark mb-1 d-flex align-items-center gap-1">
                  <FiMapPin size={13} className="text-danger" /> Public Meeting Venue
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CyberHub, DLF Phase 2, Gurgaon"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="form-control rounded-3 mb-2"
                  style={{ fontSize: "0.9rem" }}
                />
                <div className="d-flex flex-wrap gap-1">
                  {VENUE_PRESETS.slice(0, 4).map((p, idx) => (
                    <span
                      key={idx}
                      onClick={() => setVenue(p)}
                      className="badge bg-light text-muted border rounded-pill px-2 py-1 cursor-pointer"
                      style={{ cursor: "pointer", fontSize: "0.72rem" }}
                    >
                      📍 {p.split(",")[0]}
                    </span>
                  ))}
                </div>
              </div>

              {/* Nearby Places Component */}
              <NearbyPlaces
                venue={venue}
                onPlaceSelect={(place) => {
                  // Update venue with selected place
                  setVenue(`${place.name}, ${venue.split(",").slice(1).join(",")}`);
                }}
              />

              {/* Special Notes */}
              <div className="mb-3">
                <label className="fw-bold small text-dark mb-1 d-block">
                  Special Notes / Dress Code / Preferences
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Casual cafe meeting, table booked under Kabir."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="form-control rounded-3"
                  style={{ fontSize: "0.85rem" }}
                />
              </div>

              {/* Payment Method */}
              <div className="mb-3">
                <label className="fw-bold small text-dark mb-1 d-flex align-items-center gap-1">
                  <FiCreditCard size={13} className="text-danger" /> Payment Method
                </label>
                <div className="row g-2">
                  {[
                    { id: "Velora Escrow Wallet", label: "Velora Wallet (₹8,500)" },
                    { id: "UPI Instant", label: "UPI / GPay / PhonePe" },
                    { id: "Credit/Debit Card", label: "Credit / Debit Card" },
                    { id: "Cash on Meet", label: "Cash on Meet (Verified)" }
                  ].map(pm => (
                    <div key={pm.id} className="col-6">
                      <div
                        onClick={() => setPaymentMethod(pm.id)}
                        className={`p-2 rounded-3 border cursor-pointer ${
                          paymentMethod === pm.id
                            ? "border-danger bg-light text-danger fw-semibold"
                            : "bg-white text-muted"
                        }`}
                        style={{ cursor: "pointer", fontSize: "0.78rem" }}
                      >
                        ✓ {pm.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itemized Price Calculation */}
              <div className="card p-3 bg-light border-0 rounded-4 mb-3">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Rental Rate (₹{hourlyRate} × {duration} hrs):</span>
                  <span className="fw-semibold text-dark">₹{basePrice}</span>
                </div>
                <div className="d-flex justify-content-between small text-muted mb-2">
                  <span>SafeTrack & Escrow Verification Fee:</span>
                  <span className="fw-semibold text-dark">₹{platformFee}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold pt-2 border-top text-dark">
                  <span>Total Escrow Amount:</span>
                  <span className="text-danger h5 mb-0">₹{totalAmount}</span>
                </div>
              </div>

              {/* Safety Checkbox */}
              <div className="form-check small text-muted">
                <input
                  type="checkbox"
                  id="safetyCheck"
                  checked={agreedSafety}
                  onChange={(e) => setAgreedSafety(e.target.checked)}
                  className="form-check-input"
                  required
                />
                <label htmlFor="safetyCheck" className="form-check-label" style={{ fontSize: "0.78rem" }}>
                  I agree to Velora's strict 18+ Platonic Companionship policy & public-venue safety requirements.
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-top bg-light d-flex align-items-center justify-content-between">
              <div>
                <span className="small text-muted d-block" style={{ fontSize: "0.75rem" }}>Total to Pay</span>
                <span className="h5 fw-bold text-danger mb-0">₹{totalAmount}</span>
              </div>

              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline-secondary rounded-pill px-3"
                  style={{ fontSize: "0.88rem" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary-custom px-4 rounded-pill d-flex align-items-center gap-1 shadow"
                  style={{ background: "#e11d48", color: "#FFF", fontWeight: 600, fontSize: "0.88rem" }}
                >
                  <FiZap size={16} />
                  {submitting ? "Processing..." : `Confirm & Rent ₹${totalAmount}`}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanionBookingModal;
