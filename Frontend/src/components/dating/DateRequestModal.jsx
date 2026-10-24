import React, { useState } from "react";
import { FiCalendar, FiMapPin, FiClock, FiHeart, FiX, FiCheck } from "react-icons/fi";
import confetti from "canvas-confetti";
import { saveDate, openOrCreateConversation } from "../../utils/mockStorage";

const activities = [
  { id: "coffee", name: "Coffee & Cafe", desc: "Casual cafe hangout at Blue Tokai or CCD" },
  { id: "dinner", name: "Dinner & Food Walk", desc: "CyberHub or Hauz Khas dining" },
  { id: "movie", name: "Movie Companion", desc: "Catch new cinema releases together" },
  { id: "walk", name: "Night Walk & Talk", desc: "Peaceful scenic stroll in Lodhi/DLF" },
  { id: "shopping", name: "Shopping Companion", desc: "DLF Mall of India / Select Citywalk" },
  { id: "event", name: "Live Event / Gigs", desc: "Concerts, comedy shows and events" }
];

const DateRequestModal = ({ show, onHide, partner, onSuccess }) => {
  const [activity, setActivity] = useState("coffee");
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("18:30");
  const [area, setArea] = useState(partner?.area || "Connaught Place, Delhi");
  const [venue, setVenue] = useState("Cafe Coffee Day / Blue Tokai");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  if (!show || !partner) return null;

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
          area: partner.area || partner.city || area,
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
        confetti({ particleCount: 90, spread: 60 });
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
      alert(`🎉 Date invitation sent to ${partner.firstName}! Chat is now open.`);
      if (onSuccess) onSuccess(newDate);
      onHide();
    }, 500);
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
      onClick={onHide}
    >
      <div
        className="modal-dialog-custom bg-white shadow-lg overflow-hidden my-auto"
        style={{
          width: "100%",
          maxWidth: "520px",
          borderRadius: "20px",
          position: "relative",
          animation: "modalFadeIn 0.25s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
          <div className="d-flex align-items-center gap-2">
            <FiHeart className="text-danger" size={20} />
            <h5 className="fw-bold mb-0 text-dark">
              Pick a Plan with {partner?.firstName}
            </h5>
          </div>
          <button
            type="button"
            onClick={onHide}
            className="btn btn-light rounded-circle shadow-sm"
            style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-4" style={{ maxHeight: "calc(80vh - 120px)", overflowY: "auto" }}>
            {/* Activity Selector */}
            <div className="mb-3">
              <label className="fw-semibold small text-dark mb-2 d-block">Choose Date Experience</label>
              <div className="row g-2">
                {activities.map((act) => (
                  <div key={act.id} className="col-6">
                    <div
                      onClick={() => setActivity(act.id)}
                      className={`p-2.5 rounded-3 border cursor-pointer transition-all ${
                        activity === act.id
                          ? "border-danger bg-light text-danger fw-bold shadow-sm"
                          : "bg-white text-dark"
                      }`}
                      style={{ cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      {act.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="fw-semibold small text-dark mb-1 d-flex align-items-center gap-1">
                  <FiCalendar size={13} className="text-danger" /> Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control rounded-3"
                  required
                />
              </div>
              <div className="col-6">
                <label className="fw-semibold small text-dark mb-1 d-flex align-items-center gap-1">
                  <FiClock size={13} className="text-danger" /> Time
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="form-control rounded-3"
                  required
                />
              </div>
            </div>

            {/* Public Venue */}
            <div className="mb-3">
              <label className="fw-semibold small text-dark mb-1 d-flex align-items-center gap-1">
                <FiMapPin size={13} className="text-danger" /> Public Venue / Meeting Spot
              </label>
              <input
                type="text"
                placeholder="e.g. Blue Tokai Hauz Khas / CyberHub"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="form-control rounded-3"
                required
              />
            </div>

            {/* Notes */}
            <div className="mb-2">
              <label className="fw-semibold small text-dark mb-1 d-block">Notes or Vibe Preference</label>
              <textarea
                rows={2}
                placeholder="Let's grab a table outdoors..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control rounded-3"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-3 border-top bg-light d-flex align-items-center justify-content-end gap-2">
            <button
              type="button"
              onClick={onHide}
              className="btn btn-light rounded-pill px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary-custom rounded-pill px-4 text-white shadow"
              style={{ background: "#e11d48", fontWeight: 600 }}
            >
              {loading ? "Sending..." : "Send Date Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DateRequestModal;
