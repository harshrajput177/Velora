import React, { useState, useEffect } from "react";
import { FiX, FiCheckCircle, FiMapPin, FiStar, FiShield, FiLock, FiBriefcase } from "react-icons/fi";
import "./CompanionDetailModal.css";

const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600";

const DEFAULT_BIO =
  "Polite, articulate and easy to talk to. A great company for dinners, coffee chats, shopping and special social occasions.";

const SAFETY_POINTS = [
  "All meetings happen in verified public venues like cafes, malls and restaurants.",
  "Your payment stays in escrow and is released only after the outing is complete.",
  "18+ identity verification, with a SafeTrack live GPS link for emergencies."
];

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const CompanionDetailModal = ({ show, onHide, companion, onOpenBookModal }) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Start from the first photo whenever a different companion is opened
  useEffect(() => {
    setActivePhotoIdx(0);
  }, [companion?.id, companion?.userId]);

  // Close on Escape and lock background scroll while the modal is open
  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onHide();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onHide]);

  if (!show || !companion) return null;

  const photos =
    companion.photos && companion.photos.length > 0 ? companion.photos : [FALLBACK_PHOTO];
  const hourlyRate = companion.hourlyRate || 599;
  const locationText = `${companion.area ? `${companion.area}, ` : ""}${companion.city || "Delhi NCR"}`;

  const handleBook = () => {
    onHide();
    if (onOpenBookModal) onOpenBookModal(companion);
  };

  return (
    <div className="cd-overlay" onClick={onHide}>
      <div
        className="cd-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cd-name"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" onClick={onHide} className="cd-close" aria-label="Close">
          <FiX size={19} />
        </button>

        <div className="cd-scroll">
          {/* Hero */}
          <div className="cd-hero">
            <img
              src={photos[activePhotoIdx] || photos[0]}
              alt={`${companion.firstName}, photo ${activePhotoIdx + 1}`}
              className="cd-hero-img"
            />

            {photos.length > 1 && (
              <div className="cd-thumbs" role="group" aria-label="Photos">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhotoIdx(idx)}
                    aria-label={`Show photo ${idx + 1}`}
                    aria-pressed={activePhotoIdx === idx}
                    className={`cd-thumb ${activePhotoIdx === idx ? "is-active" : ""}`}
                  >
                    <img src={p} alt="" />
                  </button>
                ))}
              </div>
            )}

            <div className="cd-hero-info">
              <span className="cd-verified">
                <FiCheckCircle size={13} /> 18+ government ID verified
              </span>
              <div className="cd-hero-row">
                <div>
                  <h2 id="cd-name" className="cd-name">
                    {companion.firstName}, {companion.age}
                  </h2>
                  <p className="cd-location">
                    <FiMapPin size={14} /> {locationText}
                    {companion.distanceKm ? ` · ${companion.distanceKm} km away` : ""}
                  </p>
                </div>
                <div className="cd-rating" aria-label={`Rated ${companion.rating || 4.9} out of 5`}>
                  <FiStar size={14} />
                  <strong>{companion.rating || 4.9}</strong>
                  <span>({companion.reviewCount || 28})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="cd-body">
            <div className="cd-rate">
              <div>
                <span className="cd-rate-label">Standard rate</span>
                <span className="cd-rate-value">
                  {formatINR(hourlyRate)}
                  <small> / hour</small>
                </span>
              </div>
              <span className="cd-available">
                <span className="cd-dot" aria-hidden="true" /> Available to book
              </span>
            </div>

            <section className="cd-section">
              <h3 className="cd-section-title">About {companion.firstName}</h3>
              {companion.occupation && (
                <p className="cd-occupation">
                  <FiBriefcase size={14} /> {companion.occupation}
                </p>
              )}
              <p className="cd-bio">{companion.bio || DEFAULT_BIO}</p>
            </section>

            {companion.interests && companion.interests.length > 0 && (
              <section className="cd-section">
                <h3 className="cd-section-title">Interests</h3>
                <ul className="cd-tags">
                  {companion.interests.map((item, i) => (
                    <li key={i} className="cd-tag">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {companion.companionActivities && companion.companionActivities.length > 0 && (
              <section className="cd-section">
                <h3 className="cd-section-title">Available for</h3>
                <ul className="cd-tags">
                  {companion.companionActivities.map((act, i) => (
                    <li key={i} className="cd-tag cd-tag-rose">
                      {act}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="cd-safety">
              <h3 className="cd-safety-title">
                <FiShield size={16} /> How Velora keeps you safe
              </h3>
              <ul>
                {SAFETY_POINTS.map((point) => (
                  <li key={point}>
                    <FiCheckCircle size={14} /> <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="cd-footer">
          <div className="cd-footer-price">
            <span>From</span>
            <strong>{formatINR(hourlyRate)}/hr</strong>
          </div>
          <div className="cd-footer-actions">
            <button type="button" onClick={onHide} className="cd-btn cd-btn-outline">
              Close
            </button>
            <button type="button" onClick={handleBook} className="cd-btn cd-btn-primary">
              <FiLock size={14} /> Book {companion.firstName}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CompanionDetailModal;