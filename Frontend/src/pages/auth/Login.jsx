import "./Auth.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiShield,
  FiHeart
} from "react-icons/fi";

const COUPLE_HERO_IMAGE =
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80";

const Login = () => {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { login, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      await login(loginId, password);
      navigate("/");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || err.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email, pass = "Password@123") => {
    setLoading(true);
    setErrorMessage("");
    try {
      if (email) {
        await login(email, pass);
      } else {
        await loginDemoUser();
      }
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
          <Link to="/register" className="auth-seam-tab">
            Sign up
          </Link>

          {/* Bottom Social Buttons in Photo (Desktop) */}
          <div className="auth-photo-footer">
            <button
              type="button"
              className="btn-social-fb"
              onClick={() => handleDemoLogin("kabir@example.com")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Login with Facebook</span>
            </button>

            <button
              type="button"
              className="btn-social-google"
              onClick={() => handleDemoLogin("kabir@example.com")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFF"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFF"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FFF"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#FFF"/>
              </svg>
              <span>Login with Google</span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT FORM COLUMN ================= */}
        <div className="auth-form-col">
          {/* Mobile Switch Tabs (Visible on Mobile) */}
          <div className="auth-mobile-tabs d-flex d-md-none">
            <span className="auth-mobile-tab-btn active">Log In</span>
            <Link to="/register" className="auth-mobile-tab-btn">Sign Up</Link>
          </div>

          <h1 className="auth-heading">Welcome to Velora</h1>
          <p className="auth-subheading">
            Sign in to access your luxury adult social companionship concierge
          </p>

          {errorMessage && (
            <div className="alert alert-danger py-2 px-3 small rounded-3 mb-3 d-flex align-items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* EMAIL INPUT WITH ICON ON RIGHT */}
            <div className="auth-field-group">
              <div className="auth-field-wrapper">
                <input
                  type="text"
                  required
                  placeholder="Email Address *"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="auth-input"
                  autoComplete="username"
                />
                <FiMail size={18} className="auth-field-icon" />
              </div>
            </div>

            {/* PASSWORD INPUT WITH LOCK / EYE TOGGLE ON RIGHT */}
            <div className="auth-field-group">
              <div className="auth-field-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  autoComplete="current-password"
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

            {/* REMEMBER ME + FORGOT PASSWORD */}
            <div className="auth-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <Link to="/contact" className="auth-forgot-link">
                Forgot Password
              </Link>
            </div>

            {/* PRIMARY CTA BUTTON (Vibrant Coral/Rose Gradient) */}
            <button
              type="submit"
              className="auth-btn-primary"
              disabled={loading}
            >
              {loading ? (
                "Authenticating..."
              ) : (
                <>
                  <span>Log In</span>
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* 1-CLICK FAST TEST CREDENTIALS */}
          <div className="demo-credentials-box">
            <div className="demo-credentials-header">
              <FiShield size={14} />
              <span>Instant 1-Click Testing Credentials</span>
            </div>
            <div className="demo-grid">
              <button
                type="button"
                onClick={() => handleDemoLogin("kabir@example.com")}
                className="btn-demo-pill"
              >
                <span>👤 Kabir Roy (Client)</span>
                <span className="demo-tag">1-Click</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("ananya@companion.app")}
                className="btn-demo-pill"
              >
                <span>✨ Ananya (Companion)</span>
                <span className="demo-tag">1-Click</span>
              </button>
            </div>
          </div>

          {/* MOBILE SOCIAL LOGIN BUTTONS */}
          <div className="auth-mobile-socials d-flex d-md-none">
            <button
              type="button"
              className="btn-social-fb"
              onClick={() => handleDemoLogin("kabir@example.com")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Login with Facebook</span>
            </button>

            <button
              type="button"
              className="btn-social-google"
              onClick={() => handleDemoLogin("kabir@example.com")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#FFF"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#FFF"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FFF"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#FFF"/>
              </svg>
              <span>Login with Google</span>
            </button>
          </div>

          {/* BOTTOM FOOTER LINK */}
          <div className="auth-footer">
            <span>New member?</span>
            <Link to="/register" className="auth-footer-link">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
