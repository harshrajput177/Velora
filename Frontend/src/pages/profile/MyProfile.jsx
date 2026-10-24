import "./MyProfile.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiCheckCircle,
  FiEdit3,
  FiMapPin,
  FiBriefcase,
  FiCamera,
  FiTrash2,
  FiPlus,
  FiX,
  FiCheck,
  FiImage,
  FiUpload,
  FiLink,
  FiStar,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiLock,
  FiShield,
  FiAlertCircle,
  FiClock
} from "react-icons/fi";
import { syncProfileToCompanions } from "../../utils/mockStorage";

const DEFAULT_DP =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500";

const MyProfile = () => {
  const { user, profile, wallet, updateProfileState } = useAuth();

  /* ---------------- Profile data ---------------- */
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [age, setAge] = useState(profile?.age || 24);
  const [bio, setBio] = useState(profile?.bio || "");
  const [occupation, setOccupation] = useState(profile?.occupation || "");
  const [city, setCity] = useState(profile?.city || "Gurgaon");
  const [area, setArea] = useState(profile?.area || "CyberHub / DLF Phase 2");
  const [hourlyRate, setHourlyRate] = useState(profile?.hourlyRate || 599);
  const [availableNow, setAvailableNow] = useState(profile?.availableNow ?? true);
  const [interests, setInterests] = useState(
    profile?.interests || ["Coffee", "Art", "Dining"]
  );
  const [newInterestInput, setNewInterestInput] = useState("");

  const [photos, setPhotos] = useState(
    profile?.photos && profile.photos.length > 0 ? profile.photos : [DEFAULT_DP]
  );

  /* ---------------- UI state ---------------- */
  const [tab, setTab] = useState("about"); // about | photos
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [sheet, setSheet] = useState(null); // null | "dp" | "photo"
  const [source, setSource] = useState("file"); // file | url
  const [urlInput, setUrlInput] = useState("");

  const [confirmBox, setConfirmBox] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const currentDp = photos[0] || DEFAULT_DP;
  const displayName = `${profile?.firstName || firstName} ${profile?.lastName || lastName}`.trim();

  /* ---------------- Helpers ---------------- */
  const showToast = (message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type });
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const commitPhotos = (next, message) => {
    setPhotos(next);
    updateProfileState({ photos: next });
    syncProfileToCompanions({ ...profile, photos: next });
    if (message) showToast(message);
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

  /* ---------------- Photo / DP actions ---------------- */
  const addPhotoValue = (value, kind) => {
    if (kind === "dp") {
      commitPhotos([value, ...photos.slice(1)], "Profile picture updated");
    } else {
      commitPhotos([...photos, value], "Photo added to gallery");
    }
    closeSheet();
  };

  const handleSetAsDp = (idx) => {
    if (idx === 0) return;
    const selected = photos[idx];
    const rest = photos.filter((_, i) => i !== idx);
    commitPhotos([selected, ...rest], "Profile picture updated");
  };

  const handleDeletePhoto = (idx) => {
    if (photos.length <= 1) {
      showToast("Keep at least one photo as your profile picture", "error");
      return;
    }
    setConfirmBox({
      title: "Delete this photo?",
      message: "It will be removed from your public profile.",
      onConfirm: () => {
        commitPhotos(photos.filter((_, i) => i !== idx), "Photo deleted");
      }
    });
  };

  /* ---------------- Upload sheet handlers ---------------- */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const kind = sheet || "photo";
    const reader = new FileReader();
    reader.onload = (ev) => addPhotoValue(ev.target.result, kind);
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    const value = urlInput.trim();
    if (!value) return;
    addPhotoValue(value, sheet || "photo");
  };

  /* ---------------- Interests ---------------- */
  const handleAddInterest = (e) => {
    e.preventDefault();
    const value = newInterestInput.trim();
    if (!value || interests.includes(value)) return;
    setInterests([...interests, value]);
    setNewInterestInput("");
  };

  const handleRemoveInterest = (item) =>
    setInterests(interests.filter((i) => i !== item));

  /* ---------------- Save profile text ---------------- */
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);

    const updatedData = {
      firstName,
      lastName,
      age: Number(age),
      bio,
      occupation,
      city,
      area,
      hourlyRate: Number(hourlyRate),
      availableNow,
      interests,
      photos
    };

    setTimeout(() => {
      updateProfileState(updatedData);
      syncProfileToCompanions({ ...profile, ...updatedData });
      setSaving(false);
      setEditOpen(false);
      showToast("Profile saved");
    }, 400);
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="vp-root">
      {/* ===== Header ===== */}
      <section className="vp-card vp-header">
        <div className="vp-cover" />

        <div className="vp-header-body">
          <div className="vp-avatar-wrap">
            <img src={currentDp} alt="Profile" className="vp-avatar" />
            <button
              type="button"
              className="vp-avatar-btn"
              onClick={() => openSheet("dp")}
              aria-label="Change profile picture"
            >
              <FiCamera size={16} />
            </button>
          </div>

          <div className="vp-header-info">
            <div className="vp-name-row">
              <h1 className="vp-name">
                {displayName || "Your name"}
                {(profile?.age || age) ? `, ${profile?.age || age}` : ""}
              </h1>
              {user?.identityVerified && (
                <span className="vp-chip vp-chip-green">
                  <FiCheckCircle size={13} /> KYC verified
                </span>
              )}
              {availableNow && (
                <span className="vp-chip vp-chip-live">
                  <span className="vp-dot" /> Available now
                </span>
              )}
            </div>

            <div className="vp-meta">
              <span>
                <FiBriefcase size={14} />
                {profile?.occupation || occupation || "Velora member"}
              </span>
              <span>
                <FiMapPin size={14} />
                {profile?.area || area}, {profile?.city || city}
              </span>
            </div>
          </div>

          <div className="vp-header-actions">
            <button
              type="button"
              className="vp-btn vp-btn-ghost"
              onClick={() => setEditOpen(true)}
            >
              <FiEdit3 size={15} /> Edit profile
            </button>
            <Link
              to={`/companion/${user?.id || profile?.userId || "comp-ananya-01"}`}
              className="vp-btn vp-btn-primary"
            >
              <FiExternalLink size={15} /> Public view
            </Link>
          </div>
        </div>

        {/* Stats + wallet */}
        <div className="vp-stats">
          <div className="vp-stat">
            <strong>{photos.length}</strong>
            <span>Photos</span>
          </div>
          <div className="vp-stat">
            <strong>4.9 ★</strong>
            <span>Rating</span>
          </div>
          <div className="vp-stat">
            <strong>₹{Number(profile?.hourlyRate || hourlyRate).toLocaleString()}</strong>
            <span>Per hour</span>
          </div>
          <div className="vp-wallet">
            <div className="vp-wallet-icon">
              <FiCreditCard size={18} />
            </div>
            <div>
              <span className="vp-wallet-label">Escrow wallet</span>
              <strong className="vp-wallet-amount">
                ₹{wallet?.balance?.toLocaleString() || "8,500"}
              </strong>
              <span className="vp-wallet-lock">
                <FiLock size={11} /> ₹{wallet?.escrowLocked || "1,200"} in escrow
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Tabs ===== */}
      <nav className="vp-tabs" role="tablist">
        {[
          { id: "about", label: "About", icon: <FiShield size={16} /> },
          { id: "photos", label: "Photos", icon: <FiImage size={16} /> }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`vp-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </nav>

      {/* ===== About ===== */}
      {tab === "about" && (
        <section className="vp-card vp-pad">
          <h2 className="vp-h2">About me</h2>
          <p className="vp-bio">
            {profile?.bio ||
              bio ||
              "Add a short bio so clients know your vibe, favourite places and style."}
          </p>

          <h3 className="vp-h3">Interests</h3>
          <div className="vp-tags">
            {(profile?.interests || interests).map((item) => (
              <span key={item} className="vp-tag">
                {item}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ===== Photos ===== */}
      {tab === "photos" && (
        <section className="vp-card vp-pad">
          <div className="vp-section-head">
            <div>
              <h2 className="vp-h2">Photos</h2>
              <p className="vp-sub">
                The first photo is your profile picture.
              </p>
            </div>
            <button
              type="button"
              className="vp-btn vp-btn-primary"
              onClick={() => openSheet("photo")}
            >
              <FiPlus size={16} /> Add photo
            </button>
          </div>

          <div className="vp-photo-grid">
            {photos.map((p, idx) => (
              <figure key={p + idx} className="vp-photo">
                <img src={p} alt={`Photo ${idx + 1}`} loading="lazy" />
                {idx === 0 && (
                  <span className="vp-photo-badge">
                    <FiStar size={12} /> Profile picture
                  </span>
                )}
                <figcaption className="vp-photo-bar">
                  {idx !== 0 ? (
                    <button
                      type="button"
                      className="vp-mini"
                      onClick={() => handleSetAsDp(idx)}
                    >
                      <FiCheck size={13} /> Set as DP
                    </button>
                  ) : (
                    <span />
                  )}
                  {photos.length > 1 && (
                    <button
                      type="button"
                      className="vp-mini vp-mini-icon"
                      onClick={() => handleDeletePhoto(idx)}
                      aria-label="Delete photo"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  )}
                </figcaption>
              </figure>
            ))}

            <button
              type="button"
              className="vp-add-tile"
              onClick={() => openSheet("photo")}
            >
              <span className="vp-add-circle">
                <FiPlus size={20} />
              </span>
              Add photo
            </button>
          </div>
        </section>
      )}

      {/* ===== Upload sheet (DP / Photo) ===== */}
      {sheet && (
        <div className="vp-overlay" onClick={closeSheet}>
          <div className="vp-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="vp-sheet-head">
              <h3>
                {sheet === "dp" ? "Change profile picture" : "Add a photo"}
              </h3>
              <button type="button" className="vp-close" onClick={closeSheet} aria-label="Close">
                <FiX size={18} />
              </button>
            </div>

            {sheet === "dp" && (
              <div className="vp-dp-preview">
                <img src={currentDp} alt="Current" />
                <span>Current picture</span>
              </div>
            )}

            <div className="vp-seg-control">
              <button
                type="button"
                className={source === "file" ? "is-active" : ""}
                onClick={() => setSource("file")}
              >
                <FiUpload size={15} /> Upload from device
              </button>
              <button
                type="button"
                className={source === "url" ? "is-active" : ""}
                onClick={() => setSource("url")}
              >
                <FiLink size={15} /> Photo link
              </button>
            </div>

            {source === "file" ? (
              <label className="vp-drop">
                <span className="vp-drop-icon">
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
                <label className="vp-field">
                  <span>Photo link (URL)</span>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                </label>
                <button type="submit" className="vp-btn vp-btn-primary vp-block">
                  {sheet === "dp" ? "Set as profile picture" : "Add photo"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===== Edit profile drawer ===== */}
      {editOpen && (
        <div className="vp-overlay" onClick={() => setEditOpen(false)}>
          <form
            className="vp-sheet vp-sheet-wide"
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSaveProfile}
          >
            <div className="vp-sheet-head">
              <h3>Edit profile</h3>
              <button type="button" className="vp-close" onClick={() => setEditOpen(false)} aria-label="Close">
                <FiX size={18} />
              </button>
            </div>

            <div className="vp-form-scroll">
              <div className="vp-grid-2">
                <label className="vp-field">
                  <span>First name</span>
                  <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </label>
                <label className="vp-field">
                  <span>Last name</span>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </label>
              </div>

              <div className="vp-grid-2 vp-grid-age">
                <label className="vp-field">
                  <span>Age</span>
                  <input type="number" min="18" max="80" required value={age} onChange={(e) => setAge(e.target.value)} />
                </label>
                <label className="vp-field">
                  <span>Headline</span>
                  <input
                    placeholder="e.g. Architect & cafe lover"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                  />
                </label>
              </div>

              <div className="vp-grid-2">
                <label className="vp-field">
                  <span>City</span>
                  <input value={city} onChange={(e) => setCity(e.target.value)} />
                </label>
                <label className="vp-field">
                  <span>Area</span>
                  <input value={area} onChange={(e) => setArea(e.target.value)} />
                </label>
              </div>

              <label className="vp-field">
                <span>Hourly rate (₹)</span>
                <input type="number" min="200" step="50" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
              </label>

              <div className="vp-switch-row">
                <div>
                  <strong>Available now</strong>
                  <small>Show up for instant hire</small>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={availableNow}
                  className={`vp-switch ${availableNow ? "is-on" : ""}`}
                  onClick={() => setAvailableNow(!availableNow)}
                >
                  <span />
                </button>
              </div>

              <label className="vp-field">
                <span>Bio</span>
                <textarea
                  rows={3}
                  placeholder="Tell clients about your vibe, favourite hangouts and style"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </label>

              <div className="vp-field">
                <span>Interests</span>
                <div className="vp-tags vp-tags-edit">
                  {interests.map((item) => (
                    <span key={item} className="vp-tag">
                      {item}
                      <button type="button" onClick={() => handleRemoveInterest(item)} aria-label={`Remove ${item}`}>
                        <FiX size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="vp-inline-add">
                  <input
                    placeholder="Add an interest"
                    value={newInterestInput}
                    onChange={(e) => setNewInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddInterest(e);
                    }}
                  />
                  <button type="button" className="vp-btn vp-btn-ghost" onClick={handleAddInterest}>
                    <FiPlus size={15} /> Add
                  </button>
                </div>
              </div>
            </div>

            <div className="vp-sheet-foot">
              <button type="button" className="vp-btn vp-btn-ghost" onClick={() => setEditOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="vp-btn vp-btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== Confirm dialog ===== */}
      {confirmBox && (
        <div className="vp-overlay vp-overlay-top" onClick={() => setConfirmBox(null)}>
          <div className="vp-confirm" onClick={(e) => e.stopPropagation()}>
            <span className="vp-confirm-icon">
              <FiTrash2 size={20} />
            </span>
            <h3>{confirmBox.title}</h3>
            <p>{confirmBox.message}</p>
            <div className="vp-confirm-actions">
              <button type="button" className="vp-btn vp-btn-ghost" onClick={() => setConfirmBox(null)}>
                Keep it
              </button>
              <button
                type="button"
                className="vp-btn vp-btn-danger"
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
        <div className={`vp-toast ${toast.type === "error" ? "is-error" : ""}`} role="status">
          {toast.type === "error" ? <FiAlertCircle size={16} /> : <FiCheckCircle size={16} />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default MyProfile;