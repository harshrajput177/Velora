import React from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiShield, FiHeart, FiLock, FiStar, FiCalendar } from "react-icons/fi";

const HowItWorks = () => {
  return (
    <div className="container py-5" style={{ maxWidth: "1000px" }}>
      <div className="text-center mb-5">
        <span className="badge rounded-pill mb-3" style={{ background: "var(--accent-burgundy-light)", color: "var(--accent-burgundy)", padding: "8px 16px", letterSpacing: "1px", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "600" }}>
          Curated & Safe Experience
        </span>
        <h1 className="display-5 fw-bold" style={{ fontFamily: "var(--font-serif)", color: "var(--text-main)" }}>
          How VELORA Works
        </h1>
        <p className="lead text-muted mx-auto" style={{ maxWidth: "680px", fontSize: "1.05rem" }}>
          VELORA is India's premier social companionship platform, pairing verified, refined companions with urban professionals for dining, intellectual discourse, cultural events, and verified social dates.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {[
          {
            step: "01",
            title: "Identity & Age Verification (18+)",
            desc: "Every member on VELORA passes a mandatory age confirmation and document verification process. No underage accounts or unverified profiles are permitted.",
            icon: <FiShield size={28} className="text-danger" />
          },
          {
            step: "02",
            title: "Discover Refined Companions",
            desc: "Explore companion profiles with transparent hourly rates, verified hobbies, spoken languages, and real guest reviews across Delhi NCR.",
            icon: <FiStar size={28} className="text-warning" />
          },
          {
            step: "03",
            title: "Propose a Consensual Date Plan",
            desc: "Select a curated public venue (art galleries, fine dining, specialty coffee, or live concerts) and agree upon time, duration, and expectations.",
            icon: <FiCalendar size={28} className="text-primary" />
          },
          {
            step: "04",
            title: "SafeTrack & Trip Sharing",
            desc: "Share your live meetup link via WhatsApp with your trusted contacts, with automated 30-minute safety check-in countdowns.",
            icon: <FiLock size={28} className="text-success" />
          }
        ].map((item, idx) => (
          <div className="col-md-6" key={idx}>
            <div className="card h-100 p-4 border-0 shadow-sm" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
              <div className="d-flex align-items-center mb-3">
                <span className="fw-bold me-3" style={{ fontSize: "2rem", color: "var(--accent-burgundy)", opacity: 0.8, fontFamily: "var(--font-serif)" }}>
                  {item.step}
                </span>
                <div className="p-2 rounded-circle bg-light">{item.icon}</div>
              </div>
              <h5 className="fw-bold mb-2" style={{ color: "var(--text-main)" }}>{item.title}</h5>
              <p className="text-muted small mb-0" style={{ lineHeight: "1.6" }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 p-4 text-center" style={{ background: "var(--accent-burgundy)", color: "#FFFFFF", borderRadius: "var(--radius-lg)" }}>
        <h3 className="fw-bold mb-2" style={{ fontFamily: "var(--font-serif)" }}>Ready to Experience Refined Companionship?</h3>
        <p className="mb-4 small opacity-75">Connect with verified companions in Delhi NCR for your upcoming social engagement.</p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/discover" className="btn btn-light px-4 py-2 fw-semibold" style={{ color: "var(--accent-burgundy)", borderRadius: "var(--radius-full)" }}>
            Explore Companions
          </Link>
          <Link to="/register" className="btn btn-outline-light px-4 py-2 fw-semibold" style={{ borderRadius: "var(--radius-full)" }}>
            Join As Member
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
