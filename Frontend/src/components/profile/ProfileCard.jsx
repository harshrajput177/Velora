import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCheckCircle, FiMapPin, FiStar, FiCalendar, FiHeart, FiZap, FiEye } from "react-icons/fi";
import "./ProfileCard.css";

const ProfileCard = ({ profile, onLike, onOpenDateModal, onOpenBookModal }) => {
  const navigate = useNavigate();
  const isFemale = profile.gender === "FEMALE";
  const companionId = profile.userId || profile.id;

  const handleCardClick = (e) => {
    // Avoid triggering card click if clicking an action button
    if (e.target.closest("button")) return;
    navigate(`/companion/${companionId}`);
  };

  return (
    <div
      className="profile-card position-relative"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* Photo header */}
      <div className="profile-card-media">
        <img
          src={profile.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"}
          alt={profile.firstName}
          className="profile-card-img"
        />

        {/* Top Badges */}
        <div className="profile-card-badge-left d-flex flex-column gap-1">
          {profile.availableNow && (
            <div className="badge-pill badge-available">
              <span className="pulse-dot" />
              Available Now
            </div>
          )}
          <span className="badge rounded-pill bg-dark bg-opacity-75 text-white" style={{ fontSize: "0.68rem" }}>
            {isFemale ? "💖 Rent GF" : "👔 Rent BF"}
          </span>
        </div>

        <div className="profile-card-badge-right">
          <div className="badge-pill badge-verified">
            <FiCheckCircle size={13} /> 18+ Verified
          </div>
        </div>

        <div className="profile-card-overlay">
          <div className="profile-card-name-row">
            <h4 className="profile-card-name">{profile.firstName}, {profile.age}</h4>
            {profile.rating && (
              <span className="profile-card-rating">
                <FiStar size={13} className="star-icon" /> {profile.rating}
              </span>
            )}
          </div>
          <p className="profile-card-location">
            <FiMapPin size={12} />
            {profile.area || profile.city}
            {profile.distanceKm ? ` • ${profile.distanceKm} km away` : ""}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="profile-card-body">
        <div>
          <p className="profile-card-bio">
            {profile.bio || "Friendly, polite and engaging conversationalist. Passionate about great food and wonderful social dates in NCR."}
          </p>

          <div className="profile-card-tags">
            {profile.interests?.slice(0, 3).map((item, i) => (
              <span key={i} className="tag-chip">{item}</span>
            )) || profile.companionActivities?.slice(0, 3).map((act, i) => (
              <span key={i} className="tag-chip">{act}</span>
            ))}
          </div>
        </div>

        <div className="profile-card-footer">
          <div className="profile-card-rate-row">
            <span className="rate-label">Hourly Rate:</span>
            <span className="rate-value">
              ₹{profile.hourlyRate || 599}
              <small style={{ fontSize: "0.75rem", fontWeight: 600 }}>/hr</small>
            </span>
          </div>

          <div className="profile-card-actions">
            <div className="profile-card-actions-row">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike && onLike(profile.userId);
                }}
                className={`btn-pill btn-pill-outline-danger ${profile.hasLiked ? "is-liked" : ""}`}
                title="Send a Like"
              >
                <FiHeart className="me-1" /> {profile.hasLiked ? "Liked" : "Like"}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/companion/${companionId}`);
                }}
                className="btn-pill btn-pill-outline-dark"
                title="View Full Profile Details"
              >
                <FiEye className="me-1" /> View Details
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenBookModal && onOpenBookModal(profile);
              }}
              className="btn-rent-now"
            >
              <FiZap size={15} /> Rent {profile.firstName} (Book)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
