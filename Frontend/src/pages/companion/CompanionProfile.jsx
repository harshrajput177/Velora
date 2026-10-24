import "./CompanionProfile.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCheck,
  FiMapPin,
  FiStar,
  FiShield,
  FiHeart,
  FiZap,
  FiCalendar,
  FiMessageCircle,
  FiUpload,
  FiVideo,
  FiImage,
  FiTrash2,
  FiPlus,
  FiPhone,
  FiShare2,
  FiX,
  FiMaximize2,
  FiLink,
  FiChevronLeft,
  FiChevronRight,
  FiBriefcase,
  FiUser,
  FiLock,
  FiAlertCircle,
  FiTarget
} from "react-icons/fi";
import confetti from "canvas-confetti";
import {
  getCompanionById,
  addPhotoToCompanion,
  deletePhotoFromCompanion,
  addMatch,
  openOrCreateConversation
} from "../../utils/mockStorage";
import { useAuth } from "../../context/AuthContext";
import { useCall } from "../../context/CallContext";
import CompanionBookingModal from "../../components/companion/CompanionBookingModal";
import DateRequestModal from "../../components/dating/DateRequestModal";

const FALLBACK_PHOTO =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800";

const CompanionProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { startCall } = useCall();

  const [companion, setCompanion] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  // Booking modals
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  // Upload sheet (owner only)
  const [sheet, setSheet] = useState(null); // null | "photo"
  const [source, setSource] = useState("file"); // file | url
  const [urlInput, setUrlInput] = useState("");

  // Feedback
  const [confirmBox, setConfirmBox] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const data = getCompanionById(id);
    if (data) setCompanion(data);
  }, [id]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const photos =
    companion?.photos && companion.photos.length > 0
      ? companion.photos
      : [FALLBACK_PHOTO];
  const ownerKey = companion ? companion.userId || companion.id : null;

  const isOwner = Boolean(
    user &&
      companion &&
      (user.id === companion.userId ||
        user.id === companion.id ||
        (user.email &&
          companion.email &&
          user.email.toLowerCase() === companion.email.toLowerCase()))
  );

  /* ---------- helpers ---------- */
  const showToast = (message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const requireLogin = (fn) => () => {
    if (!isAuthenticated) return navigate("/login");
    fn();
  };

  const closeSheet = () => {
    setSheet(null);
    setUrlInput("");
    setSource("file");
  };

  const openSheet = (kind = "photo") => {
    setSource("file");
    setUrlInput("");
    setSheet(kind);
  };

  /* ---------- actions ---------- */
  const handleLike = () => {
    if (!isAuthenticated) return navigate("/login");
    addMatch(companion);
    try {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } catch (err) {
      console.log(err);
    }
    showToast(`It's a match with ${companion.firstName}. You can chat now.`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Meet ${companion.firstName} on Velora`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (e) {
        /* user cancelled */
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Profile link copied");
      } catch (e) {
        showToast("Could not copy the link", "error");
      }
    }
  };

  const handleOpenChat = () => {
    const convo = openOrCreateConversation(companion);
    navigate(`/messages?convo=${convo.id}`);
  };

  const handleVoiceCall = () => startCall(ownerKey, companion, "voice");
  const handleVideoCall = () => startCall(ownerKey, companion, "video");

  const addPhoto = (value) => {
    const updated = addPhotoToCompanion(ownerKey, value);
    setCompanion({ ...updated });
    setActivePhotoIdx((updated.photos?.length || 1) - 1);
    closeSheet();
    showToast("Photo added");
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => addPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const value = urlInput.trim();
    if (!value) return;
    addPhoto(value);
  };

  const handleDeletePhoto = (idx) => {
    if (photos.length <= 1) {
      showToast("At least one profile photo is required", "error");
      return;
    }
    setConfirmBox({
      title: "Delete this photo?",
      message: "It will be removed from your public profile.",
      onConfirm: () => {
        const updated = deletePhotoFromCompanion(ownerKey, idx);
        setCompanion({ ...updated });
        setActivePhotoIdx(0);
        showToast("Photo deleted");
      }
    });
  };

  /* ---------- lightbox ---------- */
  const lbNext = useCallback(
    () => setLightboxIdx((i) => (i === null ? i : (i + 1) % photos.length)),
    [photos.length]
  );
  const lbPrev = useCallback(
    () =>
      setLightboxIdx((i) =>
        i === null ? i : (i - 1 + photos.length) % photos.length
      ),
    [photos.length]
  );

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowRight") lbNext();
      if (e.key === "ArrowLeft") lbPrev();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightboxIdx, lbNext, lbPrev]);

  /* ---------- not found ---------- */
  if (!companion) {
    return (
      <div className="cp-root">
        <div className="cp-card cp-notfound">
          <span className="cp-empty-icon">
            <FiUser size={26} />
          </span>
          <h2>Profile not found</h2>
          <p>This companion does not exist or the profile has been updated.</p>
          <Link to="/discover" className="cp-btn cp-btn-primary">
            Browse companions
          </Link>
        </div>
      </div>
    );
  }

  const isFemale = companion.gender === "FEMALE";
  const dp = photos[0];
  const rate = companion.hourlyRate || 599;

  /* ---------- render ---------- */
  return (
    <div className="cp-root">
      {/* ===== Top bar ===== */}
      <div className="cp-topbar">
        <button type="button" className="cp-btn cp-btn-ghost" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} /> Back
        </button>

        <div className="cp-topbar-right">
          {isOwner && (
            <span className="cp-chip cp-chip-blue">
              <FiUser size={13} /> Owner view
            </span>
          )}
          <button type="button" className="cp-btn cp-btn-ghost" onClick={handleLike}>
            <FiHeart size={16} className="cp-rose" /> Like
          </button>
          <button type="button" className="cp-btn cp-btn-ghost" onClick={handleShare}>
            <FiShare2 size={16} /> Share
          </button>
        </div>
      </div>

      <div className="cp-layout">
        {/* ================= LEFT: media ================= */}
        <div className="cp-left">
          {/* Hero photo */}
          <div className="cp-card cp-hero">
            <img
              src={photos[activePhotoIdx]}
              alt={companion.firstName}
              className="cp-hero-img"
              onClick={() => setLightboxIdx(activePhotoIdx)}
            />
            <span className="cp-hero-shade" />

            <div className="cp-hero-tl">
              <span className="cp-chip cp-chip-solid">
                {isFemale ? <FiHeart size={13} /> : <FiUser size={13} />}
                {isFemale ? "Girlfriend experience" : "Boyfriend experience"}
              </span>
              {companion.availableNow && (
                <span className="cp-chip cp-chip-live">
                  <span className="cp-dot" /> Available now
                </span>
              )}
            </div>

            <div className="cp-hero-tr">
              <span className="cp-chip cp-chip-glass">
                <FiCheckCircle size={13} /> 18+ ID verified
              </span>
            </div>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  className="cp-hero-arrow cp-hero-arrow-l"
                  onClick={() =>
                    setActivePhotoIdx((i) => (i - 1 + photos.length) % photos.length)
                  }
                  aria-label="Previous photo"
                >
                  <FiChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="cp-hero-arrow cp-hero-arrow-r"
                  onClick={() => setActivePhotoIdx((i) => (i + 1) % photos.length)}
                  aria-label="Next photo"
                >
                  <FiChevronRight size={22} />
                </button>
              </>
            )}

            <div className="cp-hero-bottom">
              <button
                type="button"
                className="cp-glass-btn"
                onClick={() => setLightboxIdx(activePhotoIdx)}
              >
                <FiMaximize2 size={14} /> {activePhotoIdx + 1} / {photos.length}
              </button>
              {isOwner && photos.length > 1 && (
                <button
                  type="button"
                  className="cp-glass-btn cp-glass-icon"
                  onClick={() => handleDeletePhoto(activePhotoIdx)}
                  aria-label="Delete this photo"
                >
                  <FiTrash2 size={15} />
                </button>
              )}
            </div>
          </div>


          {/* Photo Lookbook & Aesthetic Snaps */}
          <section className="cp-card cp-pad">
            <div className="cp-section-head">
              <div>
                <h2 className="cp-h2">
                  <FiImage size={18} className="cp-rose" /> Lookbook & Aesthetic Moments
                </h2>
                <p className="cp-sub">
                  Verified real-life photos of {companion.firstName}. Tap any photo to zoom in.
                </p>
              </div>
              {isOwner && (
                <button
                  type="button"
                  className="cp-btn cp-btn-ghost"
                  onClick={() => openSheet("photo")}
                >
                  <FiPlus size={15} /> Add photo
                </button>
              )}
            </div>

            <div className="cp-moments-grid">
              {photos.map((p, idx) => (
                <div
                  key={p + idx}
                  className="cp-moment-card"
                  onClick={() => setLightboxIdx(idx)}
                >
                  <img src={p} alt={`${companion.firstName} snapshot ${idx + 1}`} loading="lazy" />
                  <span className="cp-moment-shade" />
                  <span className="cp-moment-zoom">
                    <FiMaximize2 size={16} />
                  </span>
                  <span className="cp-moment-badge">Photo {idx + 1}</span>
                </div>
              ))}
              {isOwner && (
                <button
                  type="button"
                  className="cp-moment-card cp-moment-add"
                  onClick={() => openSheet("photo")}
                >
                  <span className="cp-add-circle">
                    <FiPlus size={20} />
                  </span>
                  <span>Add photo</span>
                </button>
              )}
            </div>
          </section>
        </div>

        {/* ================= RIGHT: details ================= */}
        <aside className="cp-right">
          <div className="cp-card cp-pad cp-sticky">
            <div className="cp-id-row">
              <div className="cp-id-main">
                <img src={dp} alt="" className="cp-id-avatar" />
                <div>
                  <h1 className="cp-name">
                    {companion.firstName}, {companion.age}
                  </h1>
                  <p className="cp-loc">
                    <FiMapPin size={13} />
                    {companion.area ? `${companion.area}, ` : ""}
                    {companion.city || "Delhi NCR"}
                    {companion.distanceKm ? ` · ${companion.distanceKm} km away` : ""}
                  </p>
                </div>
              </div>
              <div className="cp-rating">
                <FiStar size={14} />
                <strong>{companion.rating || 4.9}</strong>
                <span>({companion.reviewCount || 28})</span>
              </div>
            </div>

            {/* Price */}
            <div className="cp-price">
              <div>
                <span className="cp-price-label">Hourly fee</span>
                <strong className="cp-price-amount">
                  ₹{rate}
                  <small> / hour</small>
                </strong>
              </div>
              <span className="cp-chip cp-chip-white">
                <FiLock size={12} /> Escrow protected
              </span>
            </div>

            {/* Actions */}
            <button
              type="button"
              className="cp-btn cp-btn-primary cp-btn-lg cp-block"
              onClick={requireLogin(() => setShowBookingModal(true))}
            >
              <FiZap size={18} /> Book {companion.firstName}
            </button>

            <div className="cp-action-grid">
              <button
                type="button"
                className="cp-btn cp-btn-outline"
                onClick={requireLogin(() => setShowDateModal(true))}
              >
                <FiCalendar size={15} /> Pick a plan
              </button>
              <button
                type="button"
                className="cp-btn cp-btn-outline"
                onClick={requireLogin(handleOpenChat)}
              >
                <FiMessageCircle size={15} /> Chat
              </button>
              <button
                type="button"
                className="cp-btn cp-btn-ghost"
                onClick={requireLogin(handleVoiceCall)}
              >
                <FiPhone size={15} className="cp-green" /> Voice call
              </button>
              <button
                type="button"
                className="cp-btn cp-btn-ghost"
                onClick={requireLogin(handleVideoCall)}
              >
                <FiVideo size={15} className="cp-rose" /> Video call
              </button>
            </div>

            <div className="cp-divider" />

            {/* About */}
            <h3 className="cp-h3">About</h3>
            {companion.occupation && (
              <p className="cp-job">
                <FiBriefcase size={14} /> {companion.occupation}
              </p>
            )}
            <p className="cp-bio">
              {companion.bio ||
                "Friendly, engaging and courteous. Available for coffee chats, dinner walks, shopping company and events."}
            </p>

            {companion.interests && companion.interests.length > 0 && (
              <>
                <h3 className="cp-h3">Interests</h3>
                <div className="cp-tags">
                  {companion.interests.map((item, i) => (
                    <span key={i} className="cp-tag">
                      {item}
                    </span>
                  ))}
                </div>
              </>
            )}

            {companion.companionActivities &&
              companion.companionActivities.length > 0 && (
                <>
                  <h3 className="cp-h3">Date activities</h3>
                  <div className="cp-tags">
                    {companion.companionActivities.map((act, i) => (
                      <span key={i} className="cp-tag cp-tag-outline">
                        <FiTarget size={12} /> {act}
                      </span>
                    ))}
                  </div>
                </>
              )}

            {/* Safety */}
            <div className="cp-safety">
              <div className="cp-safety-head">
                <FiShield size={16} /> Safety and escrow
              </div>
              <ul>
                <li>
                  <FiCheck size={13} /> Meetings take place only in public venues in Delhi NCR.
                </li>
                <li>
                  <FiCheck size={13} /> Strictly platonic companionship, no intimate contact.
                </li>
                <li>
                  <FiCheck size={13} /> Payment is released only after you confirm the date.
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* ===== Mobile booking bar ===== */}
      <div className="cp-mobilebar">
        <div>
          <span>From</span>
          <strong>₹{rate}/hr</strong>
        </div>
        <button
          type="button"
          className="cp-btn cp-btn-primary"
          onClick={requireLogin(() => setShowBookingModal(true))}
        >
          <FiZap size={16} /> Book now
        </button>
      </div>

      {/* ===== Photo lightbox ===== */}
      {lightboxIdx !== null && (
        <div className="cp-lightbox" onClick={() => setLightboxIdx(null)}>
          <button
            type="button"
            className="cp-lb-close"
            onClick={() => setLightboxIdx(null)}
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
          {photos.length > 1 && (
            <button
              type="button"
              className="cp-lb-arrow cp-lb-l"
              onClick={(e) => {
                e.stopPropagation();
                lbPrev();
              }}
              aria-label="Previous"
            >
              <FiChevronLeft size={24} />
            </button>
          )}
          <img
            src={photos[lightboxIdx]}
            alt="Full view"
            onClick={(e) => e.stopPropagation()}
          />
          {photos.length > 1 && (
            <button
              type="button"
              className="cp-lb-arrow cp-lb-r"
              onClick={(e) => {
                e.stopPropagation();
                lbNext();
              }}
              aria-label="Next"
            >
              <FiChevronRight size={24} />
            </button>
          )}
          <span className="cp-lb-count">
            {lightboxIdx + 1} / {photos.length}
          </span>
        </div>
      )}

      {/* ===== Upload photo sheet (owner only) ===== */}
      {sheet && isOwner && (
        <div className="cp-overlay" onClick={closeSheet}>
          <div className="cp-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="cp-sheet-head">
              <h3>Add a photo</h3>
              <button type="button" className="cp-close" onClick={closeSheet} aria-label="Close">
                <FiX size={18} />
              </button>
            </div>

            <div className="cp-seg-control cp-seg-small">
              <button
                type="button"
                className={source === "file" ? "is-active" : ""}
                onClick={() => setSource("file")}
              >
                <FiUpload size={14} /> Upload from device
              </button>
              <button
                type="button"
                className={source === "url" ? "is-active" : ""}
                onClick={() => setSource("url")}
              >
                <FiLink size={14} /> Photo link
              </button>
            </div>

            {source === "file" ? (
              <label className="cp-drop">
                <span className="cp-drop-icon">
                  <FiImage size={24} />
                </span>
                <strong>Choose a photo from your device</strong>
                <small>JPG, PNG or WebP</small>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                />
              </label>
            ) : (
              <form onSubmit={handleUrlSubmit}>
                <label className="cp-field">
                  <span>Image link (URL)</span>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </label>
                <button type="submit" className="cp-btn cp-btn-primary cp-block">
                  Add photo
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===== Confirm ===== */}
      {confirmBox && (
        <div className="cp-overlay cp-overlay-top" onClick={() => setConfirmBox(null)}>
          <div className="cp-confirm" onClick={(e) => e.stopPropagation()}>
            <span className="cp-confirm-icon">
              <FiTrash2 size={20} />
            </span>
            <h3>{confirmBox.title}</h3>
            <p>{confirmBox.message}</p>
            <div className="cp-confirm-actions">
              <button type="button" className="cp-btn cp-btn-ghost" onClick={() => setConfirmBox(null)}>
                Keep it
              </button>
              <button
                type="button"
                className="cp-btn cp-btn-danger"
                onClick={() => {
                  confirmBox.onConfirm();
                  setConfirmBox(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Toast ===== */}
      {toast && (
        <div className={`cp-toast ${toast.type === "error" ? "is-error" : ""}`} role="status">
          {toast.type === "error" ? <FiAlertCircle size={16} /> : <FiCheckCircle size={16} />}
          {toast.message}
        </div>
      )}

      {/* ===== Existing modals ===== */}
      <CompanionBookingModal
        show={showBookingModal}
        onHide={() => setShowBookingModal(false)}
        companion={companion}
      />
      <DateRequestModal
        show={showDateModal}
        onHide={() => setShowDateModal(false)}
        partner={companion}
      />
    </div>
  );
};

export default CompanionProfile;