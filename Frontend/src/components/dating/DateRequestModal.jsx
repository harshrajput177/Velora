import React, { useState } from "react";
import { FiCalendar, FiMapPin, FiClock, FiX, FiCheck } from "react-icons/fi";
import confetti from "canvas-confetti";
import { saveDate, openOrCreateConversation } from "../../utils/mockStorage";
import "./DateRequestModal.css";

const activities = [
  { id: "coffee", name: "☕ Coffee & Cafe", emoji: "☕", desc: "Casual cafe hangout" },
  { id: "dinner", name: "🍽️ Dinner & Food", emoji: "🍽️", desc: "Fine dining experience" },
  { id: "movie", name: "🎬 Movie Night", emoji: "🎬", desc: "Cinema together" },
  { id: "walk", name: "🌙 Night Walk", emoji: "🌙", desc: "Scenic stroll" },
  { id: "shopping", name: "🛍️ Shopping", emoji: "🛍️", desc: "Mall companion" },
  { id: "event", name: "🎵 Live Event", emoji: "🎵", desc: "Concerts & shows" }
];

const DateRequestModal = ({ show, onHide, partner, onSuccess }) => {
  const [activity, setActivity] = useState("coffee");
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("18:30");
  const [venue, setVenue] = useState("Blue Tokai Cafe");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show || !partner) return null;

  const selectedActivity = activities.find(a => a.id === activity);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const selectedAct = activities.find(a => a.id === activity)?.name || "Cafe Outing";
      const newDate = {
        id: "DATE-" + Math.floor(100 + Math.random() * 900),
        recipientId: partner.userId || partner.id,
        partner: {
          id: partner.userId || partner.id,
          firstName: partner.firstName,
          area: partner.area || partner.city,
          photos: partner.photos || []
        },
        activity: selectedAct,
        venue,
        date,
        time,
        notes,
        status: "REQUESTED",
        createdAt: new Date().toISOString()
      };

      saveDate(newDate);
      openOrCreateConversation(partner);

      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
      alert(`✨ Date invitation sent to ${partner.firstName}! Open chat to confirm.`);
      if (onSuccess) onSuccess(newDate);
      onHide();
    }, 500);
  };

  return (
    <div className="date-modal-overlay" onClick={onHide}>
      <div className="date-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="date-modal-header">
          <div className="header-content">
            <div className="header-avatar">
              <img src={partner?.photos?.[0] || "https://via.placeholder.com/60"} alt={partner?.firstName} />
            </div>
            <div className="header-info">
              <h2 className="header-title">Plan a date with {partner?.firstName}</h2>
              <p className="header-subtitle">Let's make it special ✨</p>
            </div>
          </div>
          <button className="close-btn" onClick={onHide} aria-label="Close">
            <FiX size={24} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="date-form">
          <div className="form-body">
            {/* ACTIVITY SELECTION */}
            <div className="form-section">
              <label className="section-label">
                <span className="emoji">💝</span>
                Choose an Experience
              </label>
              <div className="activity-grid">
                {activities.map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivity(act.id)}
                    className={`activity-card ${activity === act.id ? "active" : ""}`}
                  >
                    <div className="activity-emoji">{act.emoji}</div>
                    <div className="activity-name">{act.name.split(" ")[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* DATE & TIME */}
            <div className="form-section">
              <label className="section-label">
                <span className="emoji">📅</span>
                When & Where
              </label>
              <div className="datetime-grid">
                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>
              </div>
            </div>

            {/* VENUE */}
            <div className="form-section">
              <label className="section-label">
                <span className="emoji">📍</span>
                Public Venue
              </label>
              <input
                type="text"
                placeholder="e.g., Blue Tokai Cafe, CyberHub"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="input-field"
                required
              />
              <p className="input-hint">Always meet at public, busy venues for safety</p>
            </div>

            {/* NOTES */}
            <div className="form-section">
              <label className="section-label">
                <span className="emoji">💬</span>
                Message (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Share what you're looking forward to..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field textarea"
              />
            </div>

            {/* SAFETY INFO */}
            <div className="safety-box">
              <div className="safety-item">
                <FiCheck size={18} />
                <span>100% public venue verified</span>
              </div>
              <div className="safety-item">
                <FiCheck size={18} />
                <span>SafeTrack GPS enabled automatically</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="form-footer">
            <button type="button" className="btn-cancel" onClick={onHide}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-submit">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <span>✈️</span>
                  Send Invitation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DateRequestModal;
