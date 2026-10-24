import "./Auth.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiCalendar,
  FiArrowRight,
  FiShield,
  FiHeart
} from "react-icons/fi";

const COUPLE_HERO_IMAGE =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [age, setAge] = useState(24);
  const [gender, setGender] = useState("FEMALE");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("Password@123");
  const [area, setArea] = useState("CyberHub / DLF Phase 2");
  const [city, setCity] = useState("Gurgaon");
  const [isAdultConfirmed, setIsAdultConfirmed] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!isAdultConfirmed || Number(age) < 18) {
      setErrorMessage("You must be at least 18 years of age to register on VELORA.");
      return;
    }
    setLoading(true);
    try {
      await register({
        email,
        phone,
        password,
        firstName,
        age: Number(age),
        gender,
        area,
        city,
        isAdultConfirmed
      });
      navigate("/");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="velora-auth-root">
            <div className="auth-card-wrapper">
        {/* ================= LEFT PHOTO HERO COLUMN ================= */}
        <div className="auth-photo-col">
          {/* Top Hanging Badge */}
          <div className="auth-crest-badge">
            <div className="auth-crest-heart-wrap">
              <FiHeart size={26} fill="rgba(255,255,255,0.25)" />
            </div>
            <span className="auth-crest-title">Velora</span>
          </div>

          {/* Seam Pill Tab (Desktop) */}
          <Link to="/login" className="auth-seam-tab">
            Log in
          </Link>

          {/* Bottom Social Buttons in Photo (Desktop) */}
          <div className="auth-photo-footer">
            <button type="button" className="btn-social-fb" onClick={() => navigate("/login")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Sign up with Facebook</span>
            </button>

            <button type="button" className="btn-social-google" onClick={() => navigate("/login")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFF"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFF"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FFF"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#FFF"/>
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT FORM COLUMN ================= */}
        <div className="auth-form-col">
          {/* Mobile Switch Tabs */}
          <div className="auth-mobile-tabs d-flex d-md-none">
            <Link to="/login" className="auth-mobile-tab-btn">Log In</Link>
            <span className="auth-mobile-tab-btn active">Sign Up</span>
          </div>

          <h1 className="auth-heading">Create Velora Account</h1>
          <p className="auth-subheading">
            Join India's premier social companionship & concierge network (Strictly 18+)
          </p>

          {errorMessage && (
            <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* FIRST NAME & AGE IN ONE ROW */}
            <div className="row g-2 mb-2">
              <div className="col-8">
                <div className="auth-field-group mb-2">
                  <div className="auth-field-wrapper">
                    <input
                      type="text"
                      required
                      placeholder="First Name *"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="auth-input"
                    />
                    <FiUser size={18} className="auth-field-icon" />
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="auth-field-group mb-2">
                  <div className="auth-field-wrapper">
                    <input
                      type="number"
                      min={18}
                      max={99}
                      required
                      placeholder="Age (18+) *"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="auth-input"
                    />
                    <FiCalendar size={18} className="auth-field-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* GENDER IDENTITY */}
            <div className="auth-field-group">
              <div className="auth-field-wrapper">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="auth-select"
                >
                  <option value="FEMALE">Girlfriend (Female)</option>
                  <option value="MALE">Boyfriend (Male)</option>
                  <option value="NON_BINARY">Non-Binary</option>
                </select>
                <FiUser size={18} className="auth-field-icon" />
              </div>
            </div>

            {/* EMAIL ADDRESS */}
            <div className="auth-field-group">
              <div className="auth-field-wrapper">
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                />
                <FiMail size={18} className="auth-field-icon" />
              </div>
            </div>

            {/* MOBILE NUMBER */}
            <div className="auth-field-group">
              <div className="auth-field-wrapper">
                <input
                  type="tel"
                  placeholder="Mobile (for SafeTrack™ SMS) *"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="auth-input"
                />
                <FiPhone size={18} className="auth-field-icon" />
              </div>
            </div>

            {/* PASSWORD WITH EYE TOGGLE */}
            <div className="auth-field-group">
              <div className="auth-field-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiLock size={18} />}
                </button>
              </div>
            </div>

            {/* PRIMARY NCR REGION */}
            <div className="auth-field-group">
              <div className="auth-field-wrapper">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="auth-select"
                >
                  <option value="CyberHub / DLF Phase 2">CyberHub / DLF Phase 2 (Gurgaon)</option>
                  <option value="Connaught Place">Connaught Place (Delhi)</option>
                  <option value="Hauz Khas Village">Hauz Khas Village (Delhi)</option>
                  <option value="Sector 18 (DLF Mall)">Sector 18 DLF Mall (Noida)</option>
                  <option value="Saket">Saket / Select Citywalk (Delhi)</option>
                  <option value="Golf Course Road">Golf Course Road (Gurgaon)</option>
                  <option value="Aerocity">Aerocity (Delhi NCR)</option>
                </select>
                <FiMapPin size={18} className="auth-field-icon" />
              </div>
            </div>

            {/* 18+ CERTIFICATION CHECKBOX */}
            <label className="auth-checkbox-wrap">
              <input
                type="checkbox"
                required
                checked={isAdultConfirmed}
                onChange={(e) => setIsAdultConfirmed(e.target.checked)}
              />
              <span>
                I certify I am at least 18 years old and agree to VELORA's{" "}
                <Link to="/terms" target="_blank" style={{ color: "#E11D48", fontWeight: 700 }}>
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" target="_blank" style={{ color: "#E11D48", fontWeight: 700 }}>
                  Privacy Policy
                </Link>.
              </span>
            </label>

            {/* PRIMARY CTA BUTTON (Coral-Rose Gradient) */}
            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? (
                "Creating Account..."
              ) : (
                <>
                  <span>Create Account (18+)</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* MOBILE SOCIAL LOGIN BUTTONS */}
          <div className="auth-mobile-socials d-flex d-md-none">
            <button type="button" className="btn-social-fb" onClick={() => navigate("/login")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Sign up with Facebook</span>
            </button>

            <button type="button" className="btn-social-google" onClick={() => navigate("/login")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFF"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFF"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FFF"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#FFF"/>
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>

          {/* BOTTOM FOOTER LINK */}
          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-footer-link">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
