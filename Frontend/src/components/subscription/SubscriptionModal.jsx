import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiCheck,
  FiShield,
  FiZap,
  FiStar,
  FiLock,
  FiChevronRight
} from "react-icons/fi";
import confetti from "canvas-confetti";
import { getSubscription, saveSubscription } from "../../utils/mockStorage";
import "./SubscriptionModal.css";

const PLANS = [
  {
    id: "silver-connect",
    name: "Silver Connect",
    price: 299,
    period: "month",
    periodLabel: "/ month",
    badge: "Starter",
    popular: false,
    savings: null,
    perMonthText: "₹299/mo",
    tagline: "Essential companion connects",
    description: "Ideal for occasional companion outings in Delhi NCR.",
    features: [
      "5 Companion Direct Connects / month",
      "Pay Companion in hand at meetup",
      "Standard In-App Messaging",
      "SafeTrack™ GPS Live Protection",
      "Verified 100% Public Venues"
    ]
  },
  {
    id: "vip-gold",
    name: "VIP Gold Pass",
    price: 499,
    period: "month",
    periodLabel: "/ month",
    badge: "Most Popular",
    popular: true,
    savings: null,
    perMonthText: "₹499/mo",
    tagline: "Unlimited connects & direct booking",
    description: "Unlimited connects, direct booking & zero platform commissions.",
    features: [
      "Unlimited Direct Connects with Companions",
      "Unlimited Outing & Rental Bookings",
      "100% Direct Cash/UPI in Hand to Companion",
      "₹0 Platform Commission on Outings",
      "Secret Admirer Signals & Mystery Vault",
      "Priority Instant Chat & Audio Calls",
      "SafeTrack™ Automated 30-min Check-in"
    ]
  },
  {
    id: "diamond-club",
    name: "Diamond Elite",
    price: 999,
    period: "3 months",
    periodLabel: "/ 3 months",
    badge: "Save 33%",
    popular: false,
    savings: "Save 33% (₹333/mo)",
    perMonthText: "₹333/mo",
    tagline: "VIP status & personal concierge",
    description: "Exclusive concierge pairing & premium member status.",
    features: [
      "Everything in VIP Gold Pass",
      "Verified VIP Profile Badge",
      "Priority Booking with Top 5.0★ Companions",
      "Direct WhatsApp / Call Verification",
      "Dedicated 24/7 Concierge Support",
      "Early Access to New Companion Photo Drops"
    ]
  }
];

const SubscriptionModal = ({ show, onHide, onSubscribed }) => {
  const [currentSub, setCurrentSub] = useState(getSubscription());
  const [selectedPlanId, setSelectedPlanId] = useState("vip-gold");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Close on Escape and lock background scroll
  useEffect(() => {
    if (!show) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onHide();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setCurrentSub(getSubscription());
    setSuccessMessage("");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [show, onHide]);

  if (!show) return null;

  const handleSelectPlan = (planId) => {
    setSelectedPlanId(planId);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setProcessing(true);

    const chosenPlan = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

    setTimeout(() => {
      const updated = saveSubscription({
        planId: chosenPlan.id,
        planName: chosenPlan.name,
        status: "ACTIVE",
        price: chosenPlan.price,
        billingCycle: chosenPlan.period === "3 months" ? "Quarterly" : "Monthly",
        validUntil: "2027-03-31",
        benefits: chosenPlan.features
      });

      setCurrentSub(updated);
      setProcessing(false);
      setSuccessMessage(`🎉 ${chosenPlan.name} is now active! You can now connect and book companions with zero platform fees.`);

      try {
        confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } });
      } catch (err) {
        console.log("Confetti trigger:", err);
      }

      if (onSubscribed) onSubscribed(updated);

      // Smooth auto-close after celebration
      setTimeout(() => {
        if (onHide) onHide();
      }, 1600);
    }, 600);
  };

  const selectedPlanObj = PLANS.find((p) => p.id === selectedPlanId) || PLANS[1];

  // Render via React Portal directly into document.body to prevent parent container clipping
  return createPortal(
    <div className="vsub-overlay" onClick={onHide}>
      <div
        className="vsub-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vsub-title-id"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Pill */}
        <div className="vsub-mobile-handle d-md-none" onClick={onHide} />

        {/* Header - Sleek & Compact */}
        <header className="vsub-header">
          <div className="vsub-header-content">
            <div className="vsub-badge-pill">
              <FiStar size={11} className="vsub-star-icon" />
              <span>Velora VIP Pass</span>
            </div>
            <h2 id="vsub-title-id" className="vsub-title">Connect &amp; Book Pass</h2>
            <p className="vsub-subtitle">
              One simple membership to connect with verified companions. Pay companions directly in hand!
            </p>
          </div>
          <button
            type="button"
            onClick={onHide}
            className="vsub-close-btn"
            aria-label="Close modal"
          >
            <FiX size={18} />
          </button>
        </header>

        {/* Scrollable Body Content */}
        <div className="vsub-body">
          {successMessage && (
            <div className="vsub-alert-success">
              <FiCheck size={18} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Compact Trust Strip - Takes minimal vertical space */}
          <div className="vsub-quick-trust">
            <div className="vsub-trust-chip">
              <span className="vsub-trust-icon">🤝</span>
              <span className="vsub-trust-txt">
                <strong>Pay In-Hand:</strong> Rental fees paid directly to companion (Cash/UPI) at meetup. ₹0 platform booking fees.
              </span>
            </div>
          </div>

          {/* =========================================================
              MOBILE PLAN SELECTOR: 3 Side-by-Side Interactive Tiles
              Allows mobile users to see all 3 options without scrolling!
              ========================================================= */}
          <div className="vsub-mobile-selector-section d-md-none">
            <div className="vsub-mobile-tiles-grid">
              {PLANS.map((plan) => {
                const isSelected = selectedPlanId === plan.id;
                const isCurrent = currentSub?.planId === plan.id && currentSub?.status === "ACTIVE";

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`vsub-mobile-tile ${isSelected ? "is-selected" : ""} ${
                      plan.popular ? "is-popular" : ""
                    }`}
                  >
                    {plan.badge && (
                      <span className={`vsub-mobile-tile-badge ${plan.popular ? "badge-popular" : ""}`}>
                        {plan.badge}
                      </span>
                    )}

                    <span className="vsub-m-name">{plan.name.replace(" Connect", "").replace(" Pass", "").replace(" Elite", "")}</span>
                    
                    <div className="vsub-m-price-wrap">
                      <span className="vsub-m-currency">₹</span>
                      <span className="vsub-m-price">{plan.price}</span>
                    </div>

                    <span className="vsub-m-period">
                      {plan.period === "3 months" ? "3 mos (₹333/mo)" : "/ month"}
                    </span>

                    <div className={`vsub-m-radio ${isSelected ? "is-checked" : ""}`}>
                      {isSelected ? <FiCheck size={11} /> : null}
                    </div>

                    {isCurrent && (
                      <span className="vsub-m-active-tag">Active</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Perks Showcase for Currently Selected Plan */}
            <div className="vsub-mobile-perks-card">
              <div className="vsub-m-perks-head">
                <span className="vsub-m-perks-title">
                  ✨ What's unlocked with <strong>{selectedPlanObj.name}</strong>:
                </span>
                {selectedPlanObj.savings && (
                  <span className="vsub-m-savings-pill">{selectedPlanObj.savings}</span>
                )}
              </div>
              <ul className="vsub-m-perks-list">
                {selectedPlanObj.features.map((feat, idx) => (
                  <li key={idx}>
                    <FiCheck size={13} className="vsub-m-perk-check" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* =========================================================
              DESKTOP VIEW: Full 3-Column Luxury Cards Grid
              Shown on tablets & desktops (>=768px)
              ========================================================= */}
          <div className="vsub-plans-grid d-none d-md-grid">
            {PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isCurrent = currentSub?.planId === plan.id && currentSub?.status === "ACTIVE";

              return (
                <div
                  key={plan.id}
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`vsub-plan-card ${isSelected ? "is-selected" : ""} ${
                    plan.popular ? "is-popular" : ""
                  }`}
                  role="button"
                  tabIndex={0}
                >
                  {plan.badge && (
                    <span className={`vsub-plan-badge ${plan.popular ? "badge-popular" : ""}`}>
                      {plan.badge}
                    </span>
                  )}

                  <div className="vsub-plan-head">
                    <h3 className="vsub-plan-name">{plan.name}</h3>
                    <div className="vsub-price-row">
                      <span className="vsub-price-num">₹{plan.price}</span>
                      <span className="vsub-price-period">/ {plan.period}</span>
                    </div>
                    {plan.savings ? (
                      <span className="vsub-savings-chip">{plan.savings}</span>
                    ) : (
                      <p className="vsub-plan-desc">{plan.description}</p>
                    )}
                  </div>

                  <div className="vsub-plan-divider" />

                  <ul className="vsub-features-list">
                    {plan.features.map((feat, idx) => (
                      <li key={idx}>
                        <FiCheck size={14} className="vsub-feat-check" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="vsub-select-btn-wrap">
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`vsub-select-btn ${isSelected ? "btn-is-active" : ""}`}
                    >
                      {isCurrent ? "Current Plan ✓" : isSelected ? "Selected Plan" : "Choose Plan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Guarantees Row */}
          <div className="vsub-trust-row">
            <div className="vsub-trust-item">
              <FiShield size={14} className="text-danger" />
              <span>100% Verified Companions</span>
            </div>
            <div className="vsub-trust-item">
              <FiZap size={14} className="text-danger" />
              <span>Zero Booking Commissions</span>
            </div>
            <div className="vsub-trust-item">
              <FiLock size={14} className="text-danger" />
              <span>Cancel Anytime with 1-Click</span>
            </div>
          </div>
        </div>

        {/* Footer - Optimized for 1-Tap Mobile Conversion */}
        <footer className="vsub-footer">
          <div className="vsub-footer-summary d-none d-md-block">
            <span className="vsub-footer-label">Selected Membership:</span>
            <strong className="vsub-footer-val">
              {selectedPlanObj.name} (₹{selectedPlanObj.price} / {selectedPlanObj.period})
            </strong>
          </div>
          <div className="vsub-footer-actions">
            <button type="button" onClick={onHide} className="vsub-btn-cancel d-none d-md-inline-flex">
              Close
            </button>
            <button
              type="button"
              disabled={processing}
              onClick={handleSubscribe}
              className="vsub-btn-confirm"
            >
              {processing ? (
                "Activating Pass..."
              ) : (
                <>
                  <FiZap size={16} /> Activate {selectedPlanObj.name} — ₹{selectedPlanObj.price}
                </>
              )}
            </button>
          </div>
          <div className="vsub-footer-security d-md-none">
            <FiLock size={11} /> 100% Secure • Instant Access • Pay companion in-hand
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default SubscriptionModal;
