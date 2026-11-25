import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiStar,
  FiCheckCircle,
  FiAlertTriangle,
  FiShield,
  FiHeart,
  FiCalendar,
  FiMapPin
} from "react-icons/fi";
import confetti from "canvas-confetti";
import { checkProfanity } from "../../utils/profanityFilter";
import { addReview } from "../../utils/mockStorage";
import { useAuth } from "../../context/AuthContext";
import "./RateMeetupModal.css";

const COMPLIMENT_TAGS = [
  "Punctual & Polite",
  "Great Conversationalist",
  "Respectful & Safe",
  "Warm & Engaging Vibe",
  "Elegant & Well-Dressed",
  "Fun & Relaxing Company"
];

const STAR_LABELS = {
  1: "Needs Improvement",
  2: "Fair",
  3: "Good Outing",
  4: "Very Friendly & Fun",
  5: "Outstanding Friend & Companion!"
};

const RateMeetupModal = ({ show, onHide, booking, targetCompanion, onReviewSubmitted }) => {
  const { user, profile } = useAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(["Punctual & Polite", "Great Conversationalist"]);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const companion = targetCompanion || (booking ? {
    id: booking.companionId,
    firstName: booking.companionName,
    photos: [booking.companionPhoto],
    area: booking.companionArea || booking.venue
  } : null);

  // Close on Escape & background scroll lock
  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onHide();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setErrorMsg("");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onHide]);

  if (!show || !companion) return null;

  // Real-time profanity validation
  const profanityStatus = checkProfanity(comment);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMsg("Please write a few words about your friendly meetup.");
      return;
    }

    if (profanityStatus.hasProfanity) {
      setErrorMsg(profanityStatus.message);
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const authorName = profile?.firstName
        ? `${profile.firstName} ${profile.lastName || ""}`.trim()
        : user?.name || "Client Friend";
      const authorPhoto = profile?.photos?.[0] || user?.photoURL || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200";

      const newRev = addReview({
        targetUserId: companion.userId || companion.id,
        targetName: companion.firstName || "Companion",
        authorId: user?.id || "user-client-01",
        authorName,
        authorPhoto,
        authorRole: "CLIENT",
        rating,
        tags: selectedTags,
        comment,
        bookingId: booking?.id || null,
        activity: booking?.activityName || "Companion Outing"
      });

      try {
        confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 } });
      } catch (err) {
        // ignore
      }

      setSubmitting(false);
      if (onReviewSubmitted) onReviewSubmitted(newRev);
      onHide();
    } catch (err) {
      setSubmitting(false);
      setErrorMsg(err.message || "Could not submit review.");
    }
  };

  const activeStar = hoverRating || rating;

  return createPortal(
    <div className="vrate-overlay" onClick={onHide}>
      <div
        className="vrate-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vrate-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator */}
        <div className="vrate-handle d-md-none" onClick={onHide} />

        {/* Modal Header */}
        <header className="vrate-header">
          <div className="vrate-header-meta">
            <span className="vrate-badge">
              <FiHeart size={12} className="text-danger" /> Friend Rating
            </span>
            <h2 id="vrate-title" className="vrate-title">
              Rate your outing with {companion.firstName}
            </h2>
            <p className="vrate-subtitle">
              Share respectful feedback after your meetup. Your rating helps build a safe, trusted community.
            </p>
          </div>
          <button type="button" onClick={onHide} className="vrate-close-btn" aria-label="Close">
            <FiX size={18} />
          </button>
        </header>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="vrate-body">
          {/* Meetup Info Card */}
          <div className="vrate-companion-card">
            <img
              src={companion.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
              alt={companion.firstName}
              className="vrate-avatar"
            />
            <div className="vrate-comp-info">
              <strong className="vrate-comp-name">{companion.firstName}</strong>
              <div className="vrate-comp-sub">
                <FiMapPin size={12} /> {companion.area || "Delhi NCR"}
              </div>
              {booking && (
                <div className="vrate-booking-ref">
                  <FiCalendar size={11} /> {booking.activityName || "Social Meetup"} · {booking.date}
                </div>
              )}
            </div>
            <span className="vrate-verified-pill">
              <FiCheckCircle size={12} /> Verified Meetup
            </span>
          </div>

          {/* Star Rating Selector */}
          <div className="vrate-section">
            <label className="vrate-label">Overall Friendship Rating</label>
            <div className="vrate-stars-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`vrate-star-btn ${star <= activeStar ? "is-filled" : ""}`}
                  aria-label={`${star} star`}
                >
                  <FiStar size={28} />
                </button>
              ))}
              <span className="vrate-star-text">{STAR_LABELS[activeStar]}</span>
            </div>
          </div>

          {/* Compliment Tags */}
          <div className="vrate-section">
            <label className="vrate-label">Friendship Compliments (Select any that apply)</label>
            <div className="vrate-tags-grid">
              {COMPLIMENT_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`vrate-tag-chip ${isSelected ? "is-selected" : ""}`}
                  >
                    {isSelected ? <FiCheckCircle size={13} /> : null}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Text Area */}
          <div className="vrate-section">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label htmlFor="vrate-comment-input" className="vrate-label mb-0">
                Your Review (Polite &amp; Clean Feedback)
              </label>
              <span className="vrate-char-count">{comment.length} / 500</span>
            </div>
            <textarea
              id="vrate-comment-input"
              rows={3}
              maxLength={500}
              placeholder={`Write a polite, friendly note about your meetup with ${companion.firstName} (e.g. punctuality, pleasant conversation, safety)...`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`vrate-textarea ${profanityStatus.hasProfanity ? "is-invalid" : ""}`}
            />

            {/* Real-time Safety / Profanity Alert Banner */}
            {profanityStatus.hasProfanity ? (
              <div className="vrate-profanity-alert">
                <FiAlertTriangle size={16} className="text-danger flex-shrink-0" />
                <div>
                  <strong>Inappropriate word detected:</strong>{" "}
                  <span>"{profanityStatus.flaggedWords.join(", ")}"</span>
                  <p className="vrate-alert-desc">
                    Velora strictly forbids vulgar, abusive, sexual, or derogatory language. Only respectful friendly feedback is permitted.
                  </p>
                </div>
              </div>
            ) : (
              <div className="vrate-clean-badge">
                <FiShield size={13} className="text-success" />
                <span>Protected by Velora Respect &amp; Anti-Abuse Standards</span>
              </div>
            )}

            {errorMsg && <p className="vrate-error-text">{errorMsg}</p>}
          </div>

          {/* Footer Submit */}
          <footer className="vrate-footer">
            <button type="button" onClick={onHide} className="vrate-btn-cancel">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || profanityStatus.hasProfanity || !comment.trim()}
              className="vrate-btn-submit"
            >
              {submitting ? "Posting Review..." : "⭐ Post Friendly Review"}
            </button>
          </footer>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default RateMeetupModal;
