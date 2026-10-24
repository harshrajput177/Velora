import React, { useState } from "react";
import {
  FiX,
  FiCheckCircle,
  FiMapPin,
  FiStar,
  FiShield,
  FiZap,
  FiHeart,
  FiClock,
  FiAward,
  FiCalendar
} from "react-icons/fi";

const CompanionDetailModal = ({ show, onHide, companion, onOpenBookModal }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!show || !companion) return null;

  const photos = companion.photos && companion.photos.length > 0
    ? companion.photos
    : ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"];

  const isFemale = companion.gender === "FEMALE";

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
          maxWidth: "680px",
          borderRadius: "20px",
          animation: "modalFadeIn 0.25s ease-out",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onHide}
          className="btn btn-light rounded-circle shadow-sm position-absolute"
          style={{
            top: "16px",
            right: "16px",
            width: "38px",
            height: "38px",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255, 255, 255, 0.9)"
          }}
          aria-label="Close"
        >
          <FiX size={20} />
        </button>

        {/* Hero Photo Carousel / Viewer */}
        <div className="position-relative" style={{ height: "340px", backgroundColor: "#1e1e24" }}>
          <img
            src={photos[activePhotoIdx] || photos[0]}
            alt={companion.firstName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          <div
            className="position-absolute bottom-0 start-0 end-0 p-3"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
              color: "#FFF"
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="badge rounded-pill bg-danger px-3 py-1" style={{ fontSize: "0.75rem" }}>
                {isFemale ? "💖 Rent Girlfriend" : "👔 Rent Boyfriend"}
              </span>
              <span className="badge rounded-pill bg-dark bg-opacity-75 text-white border border-light border-opacity-25 px-2.5 py-1" style={{ fontSize: "0.75rem" }}>
                <FiCheckCircle size={12} className="text-warning me-1" /> 18+ Government ID Verified
              </span>
            </div>

            <div className="d-flex align-items-end justify-content-between">
              <div>
                <h3 className="fw-bold mb-0 text-white">
                  {companion.firstName}, {companion.age}
                </h3>
                <p className="small mb-0 text-white-50 d-flex align-items-center gap-1">
                  <FiMapPin size={13} className="text-danger" />
                  {companion.area ? `${companion.area}, ` : ""}{companion.city || "Delhi NCR"}
                  {companion.distanceKm ? ` • ${companion.distanceKm} km away` : ""}
                </p>
              </div>

              <div className="text-end">
                <div className="d-flex align-items-center gap-1 bg-white bg-opacity-20 px-2.5 py-1 rounded-pill text-white fw-bold">
                  <FiStar className="text-warning fill-warning" size={14} />
                  <span>{companion.rating || 4.9}</span>
                  <span className="text-white-50 small fw-normal">({companion.reviewCount || 28})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo thumbnails if multiple */}
          {photos.length > 1 && (
            <div className="position-absolute top-0 start-0 p-3 d-flex gap-2">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`btn p-0 rounded-3 overflow-hidden border-2 ${activePhotoIdx === idx ? "border-danger" : "border-white"}`}
                  style={{ width: "42px", height: "42px", opacity: activePhotoIdx === idx ? 1 : 0.7 }}
                >
                  <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4" style={{ maxHeight: "calc(85vh - 380px)", overflowY: "auto" }}>
          {/* Rate & Availability Highlight Banner */}
          <div className="d-flex flex-wrap align-items-center justify-content-between p-3 rounded-4 mb-4" style={{ background: "var(--companion-rose-soft, #fdf2f4)", border: "1px solid rgba(120, 61, 75, 0.15)" }}>
            <div>
              <div className="small text-muted fw-semibold">Standard Rental Rate</div>
              <div className="h4 fw-bold mb-0" style={{ color: "var(--accent-burgundy, #783D4B)" }}>
                ₹{companion.hourlyRate || 599}
                <span className="small text-muted fw-normal" style={{ fontSize: "0.85rem" }}> / hour</span>
              </div>
            </div>

            <div className="text-end">
              <span className="badge rounded-pill bg-success px-3 py-2 text-white d-inline-flex align-items-center gap-1 shadow-sm">
                <span className="pulse-dot" style={{ width: "8px", height: "8px", background: "#FFF", borderRadius: "50%", display: "inline-block" }}></span>
                Ready to Book Now
              </span>
            </div>
          </div>

          {/* Occupation & Bio */}
          <div className="mb-4">
            <h6 className="fw-bold text-dark text-uppercase small tracking-wide mb-2" style={{ letterSpacing: "0.5px" }}>
              About {companion.firstName}
            </h6>
            {companion.occupation && (
              <p className="fw-semibold text-muted small mb-2">
                💼 {companion.occupation}
              </p>
            )}
            <p className="text-secondary" style={{ lineHeight: 1.6, fontSize: "0.95rem" }}>
              {companion.bio || "Polite, articulate and charismatic companion. Great conversation partner for dinner outings, coffee talks, shopping styling, and special social occasions."}
            </p>
          </div>

          {/* Interests Chips */}
          {companion.interests && companion.interests.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-dark text-uppercase small tracking-wide mb-2">
                Passions & Interests
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {companion.interests.map((int, i) => (
                  <span
                    key={i}
                    className="badge bg-light text-dark border px-3 py-2 rounded-pill fw-medium"
                    style={{ fontSize: "0.82rem" }}
                  >
                    ✨ {int}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Companion Activities */}
          {companion.companionActivities && companion.companionActivities.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-dark text-uppercase small tracking-wide mb-2">
                Available Date Activities
              </h6>
              <div className="d-flex flex-wrap gap-2">
                {companion.companionActivities.map((act, i) => (
                  <span
                    key={i}
                    className="badge rounded-pill px-3 py-2"
                    style={{
                      background: "rgba(225, 29, 72, 0.08)",
                      color: "#e11d48",
                      border: "1px solid rgba(225, 29, 72, 0.2)",
                      fontSize: "0.82rem",
                      textTransform: "capitalize"
                    }}
                  >
                    🎯 {act}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Velora Safety Guarantee */}
          <div className="p-3 rounded-4 bg-light border mb-2">
            <div className="d-flex align-items-center gap-2 mb-2 text-dark fw-bold small">
              <FiShield className="text-danger" size={16} /> Velora 100% Public & Safe Protocol
            </div>
            <ul className="list-unstyled small text-muted mb-0 ps-1" style={{ fontSize: "0.8rem", lineHeight: 1.6 }}>
              <li>✓ All meetings take place in verified public venues (cafes, malls, restaurants).</li>
              <li>✓ Protected Escrow payment: funds are only released after successful date completion.</li>
              <li>✓ 18+ strict identity verification & SafeTrack emergency GPS link available.</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 border-top bg-light d-flex align-items-center justify-content-between gap-3">
          <button
            type="button"
            onClick={onHide}
            className="btn btn-outline-secondary rounded-pill px-4"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onHide();
              if (onOpenBookModal) onOpenBookModal(companion);
            }}
            className="btn btn-primary-custom px-4 py-2.5 d-flex align-items-center gap-2 shadow"
            style={{
              background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
              color: "#FFF",
              fontWeight: 600,
              fontSize: "0.95rem"
            }}
          >
            <FiZap size={18} /> Rent {companion.firstName} Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanionDetailModal;
