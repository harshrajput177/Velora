import React, { useState } from "react";
import { FiChevronDown, FiHelpCircle } from "react-icons/fi";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "What is VELORA and how does companionship work?",
      a: "VELORA is a luxury social companionship and concierge platform connecting urban professionals with vetted companions for public social dates, fine dining, art exhibitions, cafe conversations, and networking. All interactions are strictly consensual, lawful, and purely time-based."
    },
    {
      q: "What are the age and eligibility requirements?",
      a: "All members and companions must be at least 18 years of age. Every account undergoes mandatory age verification. We enforce zero tolerance for underage participation, solicitation, harassment, or non-consensual conduct."
    },
    {
      q: "How does SafeTrack and location sharing protect me?",
      a: "When you confirm an in-person meetup, VELORA provides an encrypted 1-Click WhatsApp Live Tracking link you can share with trusted emergency contacts. Our system also features an automated 30-minute safety check-in countdown and direct emergency hotlines (112 National Helpline & 1091 Women Helpline)."
    },
    {
      q: "How are pricing and payments structured?",
      a: "Companions independently set their hourly rates (transparently displayed on their profile). Bookings are billed by the hour. Payment transactions are processed securely through verified digital payment rails, with complete escrow-style protection until the scheduled session concludes."
    },
    {
      q: "What is VELORA's cancellation and refund policy?",
      a: "Cancellations made more than 6 hours prior to a scheduled meetup qualify for a full refund or session credit. Late cancellations within 2 hours or no-shows may incur companion reservation compensation."
    },
    {
      q: "How does VELORA comply with India's Digital Personal Data Protection (DPDP) Act 2023?",
      a: "We adhere strictly to DPDP Act principles of purpose limitation and data minimization. You have full rights to request your complete personal data dossier via our compliance portal or request irrevocable erasure of your account at any time."
    }
  ];

  return (
    <div className="container py-5" style={{ maxWidth: "860px" }}>
      <div className="text-center mb-5">
        <span className="badge rounded-pill mb-3" style={{ background: "var(--accent-burgundy-light)", color: "var(--accent-burgundy)", padding: "8px 16px", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "600" }}>
          Frequently Asked Questions
        </span>
        <h1 className="display-6 fw-bold" style={{ fontFamily: "var(--font-serif)", color: "var(--text-main)" }}>
          Everything You Need to Know
        </h1>
        <p className="text-muted">Clear answers about privacy, verified companionship, pricing, and safety on VELORA.</p>
      </div>

      <div className="d-flex flex-column gap-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="card border-0 shadow-sm" style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--border-light)" }}>
            <div
              className="p-3 d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer", background: openIndex === idx ? "var(--accent-champagne-light)" : "var(--bg-surface)", borderRadius: "var(--radius-md)" }}
              onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            >
              <div className="d-flex align-items-center gap-2">
                <FiHelpCircle className="text-muted" size={18} />
                <span className="fw-semibold" style={{ color: "var(--text-main)" }}>{faq.q}</span>
              </div>
              <FiChevronDown
                size={18}
                style={{
                  transform: openIndex === idx ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease"
                }}
              />
            </div>
            {openIndex === idx && (
              <div className="p-3 pt-0 border-top bg-white" style={{ borderColor: "var(--border-light)" }}>
                <p className="text-muted small mb-0 mt-3" style={{ lineHeight: "1.7" }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
