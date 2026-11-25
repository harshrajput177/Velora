import React, { useState } from "react";
import {
  FiStar,
  FiCheckCircle,
  FiShield,
  FiClock,
  FiMessageSquare,
  FiPlus,
  FiHeart
} from "react-icons/fi";
import { getReviewsForUser, getReviewsStats } from "../../utils/mockStorage";
import RateMeetupModal from "./RateMeetupModal";
import "./ReviewsList.css";

const ReviewsList = ({ targetUser, canRate = true }) => {
  const [showRateModal, setShowRateModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const userId = targetUser?.userId || targetUser?.id;
  const reviews = getReviewsForUser(userId);
  const stats = getReviewsStats(userId);

  const handleReviewAdded = () => {
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="vrev-container" key={refreshKey}>
      {/* Header with Title and "Rate" CTA */}
      <div className="vrev-header-row">
        <div>
          <div className="vrev-badge">
            <FiShield size={12} className="text-danger" />
            <span>Verified Ratings &amp; Trust</span>
          </div>
          <h2 className="vrev-title">Friendship Reviews &amp; Ratings</h2>
          <p className="vrev-subtitle">
            Authentic feedback from verified companion meetups in Delhi NCR.
          </p>
        </div>

        {canRate && (
          <button
            type="button"
            onClick={() => setShowRateModal(true)}
            className="vrev-rate-btn"
          >
            <FiPlus size={15} /> Rate as a Friend
          </button>
        )}
      </div>

      {/* Ratings Summary Card */}
      <div className="vrev-summary-card">
        <div className="vrev-score-side">
          <div className="vrev-big-score">
            <span>{stats.average}</span>
            <FiStar size={24} className="vrev-star-gold" />
          </div>
          <span className="vrev-score-sub">out of 5.0</span>
          <span className="vrev-meetups-count">
            Based on {stats.count} verified outings
          </span>
        </div>

        <div className="vrev-bars-side">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.breakdown[star] || 0;
            const pct = stats.count > 0 ? Math.round((count / stats.count) * 100) : 0;
            return (
              <div key={star} className="vrev-bar-row">
                <span className="vrev-bar-label">{star} ★</span>
                <div className="vrev-bar-track">
                  <div className="vrev-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="vrev-bar-count">{pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="vrev-badges-side">
          <span className="vrev-badges-title">Top Friend Qualities:</span>
          <div className="vrev-badges-cloud">
            {stats.topTags.map((tag, idx) => (
              <span key={idx} className="vrev-quality-chip">
                <FiCheckCircle size={12} className="text-success" />
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="vrev-feed">
        {reviews.length === 0 ? (
          <div className="vrev-empty">
            <FiMessageSquare size={28} className="text-muted mb-2" />
            <p>No reviews yet. Be the first to share your experience with {targetUser?.firstName || "this friend"}!</p>
          </div>
        ) : (
          reviews.map((rev) => (
            <article key={rev.id} className="vrev-card">
              <div className="vrev-card-head">
                <img
                  src={rev.authorPhoto || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"}
                  alt={rev.authorName}
                  className="vrev-card-avatar"
                />
                <div className="vrev-card-meta">
                  <div className="vrev-card-name-row">
                    <strong className="vrev-card-author">{rev.authorName}</strong>
                    {rev.verifiedMeetup && (
                      <span className="vrev-verified-tag">
                        <FiCheckCircle size={11} /> Verified Outing
                      </span>
                    )}
                  </div>
                  <span className="vrev-card-activity">
                    {rev.activity} · {rev.date}
                  </span>
                </div>

                <div className="vrev-card-stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={14}
                      className={i < rev.rating ? "star-active" : "star-inactive"}
                    />
                  ))}
                  <strong className="vrev-card-rating-num">{rev.rating}.0</strong>
                </div>
              </div>

              {rev.tags && rev.tags.length > 0 && (
                <div className="vrev-card-tags">
                  {rev.tags.map((t, idx) => (
                    <span key={idx} className="vrev-tag-pill">
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <p className="vrev-card-comment">“{rev.comment}”</p>
            </article>
          ))
        )}
      </div>

      {/* Clean Language & Respect Guarantee Note */}
      <div className="vrev-policy-banner">
        <FiShield size={16} className="text-danger flex-shrink-0" />
        <div>
          <strong>Velora Anti-Abuse &amp; Respect Shield:</strong>
          <p>
            All ratings &amp; comments undergo automated profanity filtration. Vulgar, abusive, or sexual language is strictly prohibited and immediately blocked from being posted.
          </p>
        </div>
      </div>

      {/* Rating Modal */}
      {showRateModal && (
        <RateMeetupModal
          show={showRateModal}
          onHide={() => setShowRateModal(false)}
          targetCompanion={targetUser}
          onReviewSubmitted={handleReviewAdded}
        />
      )}
    </div>
  );
};

export default ReviewsList;
