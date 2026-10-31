import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiShield,
  FiMapPin,
  FiLock,
  FiZap,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiStar,
  FiUsers,
  FiClock,
  FiPhone,
  FiMail
} from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";
import "./home.premium.css";

const PremiumHome = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginDemoUser } = useAuth();
  const [activeTab, setActiveTab] = useState("safety");
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { label: "Active Users", value: "50,000+", icon: FiUsers },
    { label: "Bookings", value: "12,500+", icon: FiCheck },
    { label: "Avg Rating", value: "4.98★", icon: FiStar },
    { label: "Cities", value: "8+", icon: FiMapPin }
  ];

  const features = [
    {
      icon: FiShield,
      title: "100% ID Verified",
      desc: "Aadhaar + Live video verification"
    },
    {
      icon: FiLock,
      title: "Escrow Payment",
      desc: "Funds stay safe until completion"
    },
    {
      icon: FiZap,
      title: "SafeTrack™ GPS",
      desc: "Real-time location sharing"
    },
    {
      icon: FiStar,
      title: "Trust Score",
      desc: "Transparent ratings system"
    }
  ];

  return (
    <div className="premium-home">
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-gradient" />
        <div className="container hero-content">
          <div className="hero-badge">
            <FiCheckCircle size={16} />
            <span>Trusted by 50,000+ users</span>
          </div>
          <h1 className="hero-title">
            Premium Verified <br />
            <span className="gradient-text">Companionship</span>
          </h1>
          <p className="hero-subtitle">
            Professional companions for every occasion. 100% verified, completely safe, transparent pricing.
          </p>
          <div className="hero-cta">
            <button className="btn-primary-large" onClick={() => navigate("/discover")}>
              Explore Now <FiArrowRight size={18} />
            </button>
            <button className="btn-secondary-large" onClick={() => loginDemoUser()}>
              Try Demo
            </button>
          </div>
          <div className="trust-indicators">
            <div className="indicator">🛡️ ID Verified</div>
            <div className="indicator">💳 Escrow Safe</div>
            <div className="indicator">📍 GPS Protected</div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <h2>By The Numbers</h2>
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <stat.icon size={32} />
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Velora?</h2>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of satisfied users</p>
          <button className="btn-primary-large" onClick={() => navigate("/discover")}>
            Get Started Now
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="premium-footer">
        <div className="container">
          <p>&copy; 2026 Velora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumHome;
