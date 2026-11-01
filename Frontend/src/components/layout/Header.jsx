import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSafety } from "../../context/SafetyContext";
import {
  FiMapPin,
  FiShield,
  FiMessageCircle,
  FiUser,
  FiZap,
  FiLogOut,
  FiChevronDown,
  FiHeart,
  FiCalendar
} from "react-icons/fi";
import "./Header.css";

const Header = () => {
  const { user, profile, logout, isAuthenticated } = useAuth();
  const { activeSession } = useSafety();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isGF = location.pathname.includes("/discover") && location.search.includes("FEMALE");
  const isBF = location.pathname.includes("/discover") && location.search.includes("MALE");
  const isAvailable = location.pathname === "/available-now";
  const isSafety = location.pathname === "/safety";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const displayName = profile?.firstName
    ? `${profile.firstName} ${profile.lastName || ""}`.trim()
    : "Manish Yadav";

  const displayEmail = user?.email || profile?.email || "manish123@gmail.com";

  const userInitials = profile?.firstName
    ? `${profile.firstName.charAt(0)}${(profile.lastName || "").charAt(0) || profile.firstName.charAt(1) || ""}`.toUpperCase()
    : "MY";

  const userPhoto = profile?.photos?.[0];

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/login");
  };

  return (
    <header className="velora-navbar-wrapper">
      <div className="velora-navbar-container">

        {/* 1. BRAND LOGO */}
        <Link to="/" className="velora-brand">
          <div className="velora-logo-mark">V</div>
          <div className="velora-logo-text">
            <span>VELORA</span>
            <span className="badge-18">18+</span>
          </div>
        </Link>

        {/* 2. LOCATION PILL */}
        <div
          className="velora-location-pill d-none d-md-flex"
          onClick={() => navigate("/discover")}
          title="Browse companions by area"
        >
          <FiMapPin className="velora-location-icon" size={14} />
          <span>
            {profile?.area
              ? `${profile.area}, ${profile.city}`
              : "Delhi NCR (All Zones)"}
          </span>
          <FiChevronDown size={13} className="opacity-75" />
        </div>

        {/* 3. CENTER NAVIGATION (Sleek Horizontal Luxury Pills) */}
        <nav className="velora-nav-links d-none d-lg-flex" aria-label="Main navigation">
          <Link
            to="/discover?gender=FEMALE"
            className={`velora-nav-item ${isGF ? "active" : ""}`}
          >
            <FiHeart size={15} className="velora-nav-icon" />
            <span>Girlfriends</span>
          </Link>

          <Link
            to="/discover?gender=MALE"
            className={`velora-nav-item ${isBF ? "active" : ""}`}
          >
            <FiUser size={15} className="velora-nav-icon" />
            <span>Boyfriends</span>
          </Link>

          <Link
            to="/available-now"
            className={`velora-nav-item ${isAvailable ? "active" : ""}`}
          >
            <FiZap size={15} className="velora-nav-icon" />
            <span>Available Now</span>
          </Link>

          <Link
            to="/safety"
            className={`velora-nav-item ${isSafety ? "active" : ""}`}
          >
            <FiShield size={15} className="velora-nav-icon" />
            <span>SafeTrack™</span>
          </Link>
        </nav>

        {/* 4. RIGHT ACTIONS */}
        <div className="velora-actions">
          {isAuthenticated ? (
            <div className="d-flex align-items-center gap-2">
              {/* MESSAGES */}
              <Link
                to="/messages"
                className="header-icon-btn position-relative"
                title="Messages"
              >
                <FiMessageCircle size={17} />
                <span className="notification-dot" />
              </Link>

              {/* SAFETRACK */}
              <Link
                to="/safety"
                className={`header-icon-btn ${activeSession ? "safety-active" : ""}`}
                title="SafeTrack GPS"
              >
                <FiShield size={17} />
              </Link>

              {/* PROFILE DROPDOWN TRIGGER (Click opens popover modal) */}
              <div className="velora-profile-dropdown-wrap" ref={dropdownRef}>
                <button
                  type="button"
                  className={`header-profile-btn ${dropdownOpen ? "is-active" : ""}`}
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {userPhoto ? (
                    <img
                      src={userPhoto}
                      alt={displayName}
                      className="header-profile-avatar"
                    />
                  ) : (
                    <div className="header-initials-badge">
                      {userInitials}
                    </div>
                  )}
                  <span className="header-profile-name d-none d-sm-inline">
                    {profile?.firstName || "Profile"}
                  </span>
                  <FiChevronDown
                    size={14}
                    className={`header-chevron ${dropdownOpen ? "is-rotated" : ""}`}
                  />
                </button>

                {/* THE SLEEK PROFILE POPOVER MODAL (Exact match to screenshot) */}
                {dropdownOpen && (
                  <div className="velora-profile-popover" role="menu">
                    {/* 1. User Info Header */}
                    <div className="popover-user-row">
                      {userPhoto ? (
                        <img
                          src={userPhoto}
                          alt={displayName}
                          className="popover-avatar"
                        />
                      ) : (
                        <div className="popover-initials-badge">
                          {userInitials}
                        </div>
                      )}
                      <div className="popover-user-text">
                        <div className="popover-name-badge">
                          <strong className="popover-name">{displayName}</strong>
                          <span className="popover-pro-tag">PRO</span>
                        </div>
                        <span className="popover-email">{displayEmail}</span>
                      </div>
                    </div>

                    <div className="popover-divider" />

                    {/* 2. Active Status Row */}
                    <div className="popover-status-row">
                      <span className="popover-status-dot" />
                      <span className="popover-status-label">Active</span>
                    </div>

                    <div className="popover-divider" />

                    {/* 3. Action Links */}
                    <div className="popover-actions-list">
                      <Link
                        to="/profile"
                        className="popover-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser size={16} className="popover-item-icon" />
                        <span>Profile Details</span>
                      </Link>

                      <Link
                        to="/bookings"
                        className="popover-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiCalendar size={16} className="popover-item-icon" />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        to="/safety"
                        className="popover-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiShield size={16} className="popover-item-icon" />
                        <span>SafeTrack™ Hub</span>
                      </Link>
                    </div>

                    <div className="popover-divider" />

                    {/* 4. Logout Action */}
                    <button
                      type="button"
                      className="popover-item popover-logout"
                      onClick={handleLogout}
                    >
                      <FiLogOut size={16} className="popover-item-icon" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="velora-link-login">
                Log in
              </Link>

              <Link to="/register" className="velora-btn-join">
                <span>Join 18+</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
