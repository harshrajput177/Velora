import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProfileCard from "../../components/profile/ProfileCard";
import DateRequestModal from "../../components/dating/DateRequestModal";
import CompanionBookingModal from "../../components/companion/CompanionBookingModal";
import { INITIAL_COMPANIONS } from "../../constants/initialCompanions";
import { addMatch } from "../../utils/mockStorage";
import { useAuth } from "../../context/AuthContext";
import confetti from "canvas-confetti";
import { FiCheckCircle } from "react-icons/fi";
import "./Discover.css";

const Discover = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [profiles, setProfiles] = useState(INITIAL_COMPANIONS);
  const [gender, setGender] = useState(searchParams.get("gender") || "ALL");
  const [activity, setActivity] = useState(searchParams.get("activity") || "all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [datePartner, setDatePartner] = useState(null);
  const [bookCompanion, setBookCompanion] = useState(null);
  const [loading, setLoading] = useState(false);

  const mode = searchParams.get("mode") || "discover";

  useEffect(() => {
    const urlGender = searchParams.get("gender");
    if (urlGender) setGender(urlGender);
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...INITIAL_COMPANIONS];
    if (gender && gender !== "ALL") filtered = filtered.filter(p => p.gender === gender);
    if (activity && activity !== "all") filtered = filtered.filter(p => p.companionActivities?.includes(activity));
    if (verifiedOnly) filtered = filtered.filter(p => p.idProofVerified);
    setProfiles(filtered);
    setLoading(false);
  }, [mode, gender, activity, verifiedOnly]);

  const handleLike = (targetUserId) => {
    if (!isAuthenticated) return navigate("/login");
    const companion = INITIAL_COMPANIONS.find(c => (c.userId || c.id) === targetUserId);
    if (companion) {
      addMatch(companion);
      try {
        confetti({ particleCount: 100, spread: 70 });
      } catch (err) {
        console.log(err);
      }
      alert(`🎉 Mutual Match with ${companion.firstName}! You can chat now in Messages.`);
    } else {
      alert("❤️ Liked!");
    }
  };

  return (
    <div className="discover-page-container">
      {/* Title & Filter Bar */}
      <div className="discover-header-wrap">
        <div>
          <h2 className="discover-title">
            {mode === "dates" ? "Romantic Dates & Plans" : mode === "companion" ? "Social Companions" : "Discover in Delhi NCR"}
          </h2>
          <p className="discover-sub">Filtered by proximity, real-time availability and 18+ verified reputation</p>
        </div>

        {/* Filter Pills */}
        <div className="discover-filter-bar">
          <select value={gender} onChange={e => setGender(e.target.value)} className="discover-select">
            <option value="ALL">All Genders</option>
            <option value="FEMALE">Girlfriends (GF)</option>
            <option value="MALE">Boyfriends (BF)</option>
          </select>

          <select value={activity} onChange={e => setActivity(e.target.value)} className="discover-select">
            <option value="all">All Occasions</option>
            <option value="coffee">Coffee & Cafe</option>
            <option value="dinner">Fine Dining</option>
            <option value="movie">Movie Night</option>
            <option value="shopping">Shopping</option>
            <option value="walk">Night Walk</option>
            <option value="talk">Conversation</option>
          </select>

          <button
            type="button"
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`btn-filter-pill ${verifiedOnly ? "is-active" : ""}`}
          >
            <FiCheckCircle size={14} /> 18+ Verified Only
          </button>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-danger" role="status" />
          <p className="text-muted small mt-2">Finding companions near you...</p>
        </div>
      ) : profiles.length === 0 ? (
        <div className="discover-empty-card">
          <h5>No companions matched these filters.</h5>
          <p>Try broadening your filter criteria or exploring all occasions.</p>
          <button
            type="button"
            onClick={() => { setGender("ALL"); setActivity("all"); setVerifiedOnly(false); }}
            className="btn-reset-filters"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {profiles.map(p => (
            <div key={p.userId || p.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <ProfileCard
                profile={p}
                onLike={handleLike}
                onOpenDateModal={partner => {
                  if (!isAuthenticated) return navigate("/login");
                  setDatePartner(partner);
                }}
                onOpenBookModal={companion => {
                  if (!isAuthenticated) return navigate("/login");
                  setBookCompanion(companion);
                }}
              />
            </div>
          ))}
        </div>
      )}

      <DateRequestModal
        show={!!datePartner}
        onHide={() => setDatePartner(null)}
        partner={datePartner}
      />
      <CompanionBookingModal
        show={!!bookCompanion}
        onHide={() => setBookCompanion(null)}
        companion={bookCompanion}
      />
    </div>
  );
};

export default Discover;
