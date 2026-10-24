import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMapPin,
  FiCheckCircle,
  FiZap,
  FiMessageCircle,
  FiClock,
  FiCamera,
  FiArrowRight
} from "react-icons/fi";
import confetti from "canvas-confetti";
import { openOrCreateConversation } from "../../utils/mockStorage";
import { useAuth } from "../../context/AuthContext";
import "./SnapMomentsSection.css";

export const SAMPLE_PHOTO_SNAPS = [
  {
    id: "snap-1",
    companionId: "comp-ananya-01",
    name: "Ananya",
    gender: "FEMALE",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
    caption: "Iced Americano & aesthetic cafe corner at Blue Tokai CyberHub. Who's free for evening cafe talks? ☕✨",
    location: "CyberHub, DLF Phase 2",
    activity: "Coffee & Conversation",
    activityId: "coffee",
    time: "25m ago",
    rate: 699,
    likes: 342,
    category: "coffee"
  },
  {
    id: "snap-2",
    companionId: "comp-tanya-03",
    name: "Tanya",
    gender: "FEMALE",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    caption: "Wardrobe styling haul at DLF Mall of India! Trying out new festive silhouettes. Need shopping company? 🛍️💃",
    location: "Sector 18, Noida",
    activity: "Shopping & Styling",
    activityId: "shopping",
    time: "45m ago",
    rate: 799,
    likes: 489,
    category: "shopping"
  },
  {
    id: "snap-3",
    companionId: "comp-aryan-02",
    name: "Aryan",
    gender: "MALE",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    caption: "Tailored charcoal blazer ready for tonight's corporate gala & dinner walk. Let's make an entrance! 👔🥂",
    location: "Golf Course Road, Gurgaon",
    activity: "Wedding & Plus-One",
    activityId: "event",
    time: "1h ago",
    rate: 749,
    likes: 295,
    category: "event"
  },
  {
    id: "snap-4",
    companionId: "comp-meera-04",
    name: "Meera",
    gender: "FEMALE",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300",
    photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    caption: "Quiet book corner reading Murakami at Select Citywalk Saket. Looking for calm mindful evening walks 📖🍃",
    location: "Select Citywalk, Saket",
    activity: "Quiet Walk & Talk",
    activityId: "walk",
    time: "2h ago",
    rate: 499,
    likes: 312,
    category: "coffee"
  },
  {
    id: "snap-5",
    companionId: "comp-rohan-01",
    name: "Rohan",
    gender: "MALE",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800",
    caption: "Got extra tickets for the indie film premiere at Siri Fort tonight! Who wants to join for movie & dinner? 🎬🍿",
    location: "Hauz Khas, Delhi",
    activity: "Movie Night & Popcorn",
    activityId: "movie",
    time: "3h ago",
    rate: 649,
    likes: 278,
    category: "movie"
  },
  {
    id: "snap-6",
    companionId: "comp-zoya-05",
    name: "Zoya",
    gender: "FEMALE",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
    caption: "Golden hour rooftop table booked at Aerocity Worldmark. Looking forward to fine dining & cultured talks 🍷🌆",
    location: "Aerocity, Delhi",
    activity: "Romantic Fine Dining",
    activityId: "dinner",
    time: "3h ago",
    rate: 899,
    likes: 521,
    category: "dinner"
  }
];

const SnapMomentsSection = ({ onOpenBookingModal }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [likesState, setLikesState] = useState(() => {
    const map = {};
    SAMPLE_PHOTO_SNAPS.forEach((s) => (map[s.id] = { count: s.likes, liked: false }));
    return map;
  });

  const handleLike = (e, snapId) => {
    e.stopPropagation();
    setLikesState((prev) => {
      const current = prev[snapId] || { count: 100, liked: false };
      const nextLiked = !current.liked;
      if (nextLiked) {
        try {
          confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
        } catch {}
      }
      return {
        ...prev,
        [snapId]: {
          count: current.count + (nextLiked ? 1 : -1),
          liked: nextLiked
        }
      };
    });
  };

  const handleChat = (e, snap) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate("/login");
    const convo = openOrCreateConversation({
      userId: snap.companionId,
      id: snap.companionId,
      firstName: snap.name,
      photos: [snap.avatar, snap.photo],
      area: snap.location
    });
    navigate(`/messages?convo=${convo.id}`);
  };

  const filteredSnaps = SAMPLE_PHOTO_SNAPS.filter((s) => {
    if (selectedCategory === "all") return true;
    return s.category === selectedCategory;
  });

  return (
    <section className="velora-photo-snaps-section py-4 my-2">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-3 px-1">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span
              className="badge rounded-pill bg-danger px-2.5 py-1 text-white fw-bold d-inline-flex align-items-center gap-1"
              style={{ fontSize: "0.72rem" }}
            >
              <FiCamera size={12} /> DAILY PHOTO DROPS
            </span>
            <span className="badge rounded-pill bg-light text-muted border" style={{ fontSize: "0.72rem" }}>
              ⚡ Real-time Snaps
            </span>
          </div>
          <h3 className="fw-bold mb-1 text-dark" style={{ letterSpacing: "-0.025em" }}>
            Today's Companion Moments & Plans
          </h3>
          <p className="text-muted small mb-0">
            Real photos posted today across Delhi NCR. Pick a plan or tap to rent instantly.
          </p>
        </div>

        {/* Category Pills */}
        <div className="d-flex gap-1.5 overflow-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {[
            { id: "all", label: "All Snaps" },
            { id: "coffee", label: "☕ Coffee & Cafes" },
            { id: "dinner", label: "🍷 Fine Dining" },
            { id: "shopping", label: "🛍️ Shopping" },
            { id: "event", label: "🥂 Plus-One" },
            { id: "movie", label: "🎬 Movies" }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold transition-all ${
                selectedCategory === cat.id
                  ? "btn-danger text-white shadow-sm"
                  : "btn-light border text-muted"
              }`}
              style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Snaps Scroll Track / Grid */}
      <div
        className="d-flex gap-3 overflow-auto pb-3 pt-1 px-1"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {filteredSnaps.map((snap) => {
          const userLiked = likesState[snap.id]?.liked;
          const likeCount = likesState[snap.id]?.count || snap.likes;

          return (
            <div
              key={snap.id}
              className="velora-snap-card card border-0 shadow-sm rounded-4 overflow-hidden flex-shrink-0 bg-white"
              style={{
                width: "285px",
                scrollSnapAlign: "start",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer"
              }}
              onClick={() => navigate(`/companion/${snap.companionId}`)}
            >
              {/* Photo Canvas with Overlay Badges */}
              <div className="position-relative" style={{ height: "300px" }}>
                <img
                  src={snap.photo}
                  alt={snap.name}
                  className="w-100 h-100 object-fit-cover"
                  loading="lazy"
                />

                {/* Top Location & Rate Tag */}
                <div
                  className="position-absolute top-0 start-0 w-100 p-2.5 d-flex align-items-center justify-content-between"
                  style={{
                    background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 100%)",
                    zIndex: 2
                  }}
                >
                  <span
                    className="badge rounded-pill bg-dark bg-opacity-75 text-white border border-light border-opacity-25 d-flex align-items-center gap-1"
                    style={{ fontSize: "0.72rem" }}
                  >
                    <FiMapPin size={11} className="text-danger" />
                    {snap.location.split(",")[0]}
                  </span>

                  <span
                    className="badge rounded-pill bg-danger text-white fw-bold shadow-sm"
                    style={{ fontSize: "0.72rem" }}
                  >
                    ₹{snap.rate}/hr
                  </span>
                </div>

                {/* Heart Like Floating Button */}
                <button
                  type="button"
                  onClick={(e) => handleLike(e, snap.id)}
                  className="btn p-2 rounded-circle text-white position-absolute shadow border-0"
                  style={{
                    bottom: "12px",
                    right: "12px",
                    backgroundColor: userLiked ? "rgba(225, 29, 72, 0.95)" : "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(8px)",
                    zIndex: 2,
                    width: "38px",
                    height: "38px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title="Like Photo Snap"
                >
                  <FiHeart size={18} className={userLiked ? "fill-white" : ""} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-3 d-flex flex-column justify-content-between" style={{ minHeight: "175px" }}>
                <div>
                  {/* Companion Header */}
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={snap.avatar}
                        alt={snap.name}
                        className="rounded-circle object-fit-cover shadow-sm"
                        style={{ width: "32px", height: "32px", border: "1.5px solid #e11d48" }}
                      />
                      <div>
                        <div className="d-flex align-items-center gap-1">
                          <span className="fw-bold small text-dark">{snap.name}</span>
                          <FiCheckCircle size={12} className="text-warning fill-warning" />
                        </div>
                        <span className="text-muted" style={{ fontSize: "0.7rem" }}>
                          <FiClock size={10} className="me-0.5" /> {snap.time}
                        </span>
                      </div>
                    </div>

                    <span className="text-muted small fw-semibold" style={{ fontSize: "0.75rem" }}>
                      ❤️ {likeCount}
                    </span>
                  </div>

                  {/* Caption */}
                  <p
                    className="text-secondary small mb-2 text-truncate-2"
                    style={{
                      fontSize: "0.82rem",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    "{snap.caption}"
                  </p>

                  <div className="mb-3">
                    <span
                      className="badge rounded-pill px-2.5 py-1"
                      style={{
                        background: "#FFF1F4",
                        color: "#be123c",
                        border: "1px solid #fecdd3",
                        fontSize: "0.72rem",
                        fontWeight: 600
                      }}
                    >
                      🎯 {snap.activity}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="d-flex align-items-center gap-2 pt-2 border-top">
                  <button
                    type="button"
                    onClick={(e) => handleChat(e, snap)}
                    className="btn btn-sm btn-light border rounded-pill px-2.5 py-1.5 text-muted d-flex align-items-center gap-1"
                    style={{ fontSize: "0.78rem" }}
                    title="Chat with companion"
                  >
                    <FiMessageCircle size={13} /> Chat
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenBookingModal) {
                        onOpenBookingModal({
                          userId: snap.companionId,
                          id: snap.companionId,
                          firstName: snap.name,
                          photos: [snap.avatar, snap.photo],
                          hourlyRate: snap.rate,
                          area: snap.location,
                          gender: snap.gender
                        });
                      } else {
                        navigate(`/companion/${snap.companionId}`);
                      }
                    }}
                    className="btn btn-sm btn-primary-custom rounded-pill px-3 py-1.5 text-white fw-bold d-flex align-items-center justify-content-center gap-1 flex-grow-1 shadow-sm"
                    style={{
                      background: "linear-gradient(135deg, #e11d48 0%, #be123c 100%)",
                      fontSize: "0.78rem"
                    }}
                  >
                    <FiZap size={13} /> Rent {snap.name}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SnapMomentsSection;
