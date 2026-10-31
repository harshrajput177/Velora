import React, { useState } from "react";
import {
  FiShield,
  FiCheckCircle,
  FiStar,
  FiAward,
  FiFileText,
  FiAlertCircle,
  FiFlag,
  FiX,
  FiUser,
  FiCalendar,
  FiTrendingUp,
  FiLock,
  FiPhone
} from "react-icons/fi";
import "./TrustCenter.css";

const TrustCenter = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [blockConfirm, setBlockConfirm] = useState(null);

  // Mock companion data
  const companionData = {
    id: "comp-ananya-01",
    firstName: "Ananya",
    lastName: "Sharma",
    age: 24,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500",
    trustScore: 98,
    verificationStatus: {
      kyc: { verified: true, date: "2026-08-15" },
      liveVideo: { verified: true, date: "2026-08-15" },
      bookingHistory: { count: 127, averageRating: 4.98 },
      cancelPolicy: "48-hour cancellation with 50% refund"
    }
  };

  const reportReasons = [
    "Inappropriate behavior",
    "Safety concerns",
    "Profile information inaccurate",
    "Non-consensual photos",
    "Solicitation of illegal services",
    "Other"
  ];

  const handleReport = (e) => {
    e.preventDefault();
    alert(`Report submitted for ${companionData.firstName}. Our team will review within 24 hours.`);
    setShowReportModal(false);
    setReportReason("");
  };

  const handleBlock = () => {
    alert(`${companionData.firstName} has been blocked. You won't see their profile again.`);
    setBlockConfirm(null);
  };

  return (
    <div className="trust-center-root">
      {/* Header */}
      <section className="trust-header">
        <div className="trust-wrap">
          <div className="trust-header-content">
            <h1>Trust & Verification Center</h1>
            <p>Complete transparency on every verified companion profile</p>
          </div>
        </div>
      </section>

      {/* Companion Card Preview */}
      <section className="trust-wrap trust-companion-card">
        <div className="companion-box">
          <div className="comp-photo">
            <img src={companionData.photo} alt={companionData.firstName} />
          </div>
          <div className="comp-info">
            <h2>{companionData.firstName} {companionData.lastName}, {companionData.age}</h2>
            <div className="trust-score-display">
              <span className="score-label">Trust Score</span>
              <div className="score-circle">
                <strong>{companionData.trustScore}</strong>
                <span>/100</span>
              </div>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${companionData.trustScore}%` }} />
              </div>
            </div>
          </div>
          <div className="comp-actions">
            <button className="trust-btn trust-btn-report" onClick={() => setShowReportModal(true)}>
              <FiFlag size={16} /> Report Profile
            </button>
            <button className="trust-btn trust-btn-block" onClick={() => setBlockConfirm(true)}>
              <FiX size={16} /> Block User
            </button>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="trust-wrap">
        <nav className="trust-tabs">
          <button
            className={`trust-tab ${selectedTab === "overview" ? "active" : ""}`}
            onClick={() => setSelectedTab("overview")}
          >
            <FiShield size={16} /> Verification Status
          </button>
          <button
            className={`trust-tab ${selectedTab === "reviews" ? "active" : ""}`}
            onClick={() => setSelectedTab("reviews")}
          >
            <FiStar size={16} /> Reviews & Ratings
          </button>
          <button
            className={`trust-tab ${selectedTab === "policy" ? "active" : ""}`}
            onClick={() => setSelectedTab("policy")}
          >
            <FiFileText size={16} /> Policies
          </button>
          <button
            className={`trust-tab ${selectedTab === "safety" ? "active" : ""}`}
            onClick={() => setSelectedTab("safety")}
          >
            <FiShield size={16} /> Safety Guidelines
          </button>
        </nav>
      </section>

      {/* Content Sections */}
      <section className="trust-wrap trust-content">
        {/* Verification Status Tab */}
        {selectedTab === "overview" && (
          <div className="trust-panel">
            <h3>Verification & Credibility Badges</h3>

            <div className="verification-grid">
              {/* KYC Verification */}
              <div className="verification-card">
                <div className="verify-header verified">
                  <FiShield size={24} />
                  <span className="badge">✓ Verified</span>
                </div>
                <h4>18+ ID Verified</h4>
                <p>Government Aadhaar verification with live video selfie</p>
                <span className="verify-date">
                  <FiCalendar size={12} /> {companionData.verificationStatus.kyc.date}
                </span>
              </div>

              {/* Live Video Check */}
              <div className="verification-card">
                <div className="verify-header verified">
                  <FiCheckCircle size={24} />
                  <span className="badge">✓ Verified</span>
                </div>
                <h4>Live Identity Check</h4>
                <p>Recent video verification with facial recognition match</p>
                <span className="verify-date">
                  <FiCalendar size={12} /> {companionData.verificationStatus.liveVideo.date}
                </span>
              </div>

              {/* Booking History */}
              <div className="verification-card">
                <div className="verify-header verified">
                  <FiAward size={24} />
                  <span className="badge">✓ Established</span>
                </div>
                <h4>Completed Bookings</h4>
                <p>{companionData.verificationStatus.bookingHistory.count} verified bookings completed</p>
                <span className="verify-date">
                  <FiTrendingUp size={12} /> Avg Rating {companionData.verificationStatus.bookingHistory.averageRating}★
                </span>
              </div>
            </div>

            {/* Trust Score Breakdown */}
            <div className="trust-breakdown-box">
              <h4>Trust Score Breakdown</h4>
              <div className="breakdown-items">
                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <span>Identity Verification</span>
                    <span className="score">+35</span>
                  </div>
                  <div className="breakdown-bar">
                    <div className="fill" style={{ width: "100%" }} />
                  </div>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <span>Booking History</span>
                    <span className="score">+38</span>
                  </div>
                  <div className="breakdown-bar">
                    <div className="fill" style={{ width: "95%" }} />
                  </div>
                </div>
                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <span>Customer Ratings</span>
                    <span className="score">+25</span>
                  </div>
                  <div className="breakdown-bar">
                    <div className="fill" style={{ width: "98%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {selectedTab === "reviews" && (
          <div className="trust-panel">
            <h3>Authentic Customer Reviews</h3>
            <p className="trust-subtitle">Verified feedback from completed bookings</p>

            <div className="reviews-container">
              <div className="review-card">
                <div className="review-header">
                  <span className="review-rating">⭐⭐⭐⭐⭐ 5.0</span>
                  <span className="review-date">Oct 24, 2026</span>
                </div>
                <p className="review-text">
                  "Professional, punctual, and wonderful company for the corporate dinner. Highly recommended for anyone needing a reliable companion."
                </p>
                <span className="review-author">Kabir R. • Gurgaon</span>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <span className="review-rating">⭐⭐⭐⭐⭐ 5.0</span>
                  <span className="review-date">Oct 20, 2026</span>
                </div>
                <p className="review-text">
                  "Great conversation, very attentive listener, and made me feel comfortable the entire time. Exceeded expectations!"
                </p>
                <span className="review-author">Priya M. • South Delhi</span>
              </div>

              <div className="review-card">
                <div className="review-header">
                  <span className="review-rating">⭐⭐⭐⭐⭐ 5.0</span>
                  <span className="review-date">Oct 15, 2026</span>
                </div>
                <p className="review-text">
                  "Excellent stylist and great company. Helped me pick the perfect wardrobe. Very professional throughout!"
                </p>
                <span className="review-author">Vikram S. • Noida</span>
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Policy Tab */}
        {selectedTab === "policy" && (
          <div className="trust-panel">
            <h3>Cancellation & Refund Policy</h3>

            <div className="policy-box">
              <h4>💳 Escrow Wallet Protection</h4>
              <p>
                Your payment stays in our secure escrow wallet until the booking is successfully completed. Both parties must confirm satisfaction before funds are released.
              </p>
            </div>

            <div className="policy-box">
              <h4>⏰ 48-Hour Cancellation Policy</h4>
              <ul>
                <li><strong>Cancel 48+ hours before:</strong> 100% refund to your Velora wallet</li>
                <li><strong>Cancel 24-48 hours before:</strong> 75% refund (25% admin fee)</li>
                <li><strong>Cancel within 24 hours:</strong> 50% refund (50% non-refundable)</li>
                <li><strong>No-show:</strong> 0% refund (full amount forfeit)</li>
              </ul>
            </div>

            <div className="policy-box">
              <h4>🛡️ Dispute Resolution</h4>
              <p>
                If there's a booking dispute, contact our support team within 24 hours. We review evidence from both parties and make a fair ruling within 48 hours.
              </p>
              <button className="trust-link-btn">
                <FiPhone size={14} /> Contact Support 24/7
              </button>
            </div>
          </div>
        )}

        {/* Safety Guidelines Tab */}
        {selectedTab === "safety" && (
          <div className="trust-panel">
            <h3>Safety & Consent Guidelines</h3>

            <div className="safety-box">
              <h4>✓ What Velora Guarantees</h4>
              <ul className="safety-list">
                <li><FiCheckCircle size={16} /> 100% public venue meetings only</li>
                <li><FiCheckCircle size={16} /> Strictly platonic, consensual companionship</li>
                <li><FiCheckCircle size={16} /> SafeTrack™ GPS with 30-min check-ins</li>
                <li><FiCheckCircle size={16} /> All companions are 18+ ID verified</li>
                <li><FiCheckCircle size={16} /> 24/7 support & emergency response</li>
              </ul>
            </div>

            <div className="safety-box">
              <h4>⚠️ Zero Tolerance Violations</h4>
              <ul className="safety-list danger">
                <li><FiAlertCircle size={16} /> Solicitation of illegal services → Instant blacklist</li>
                <li><FiAlertCircle size={16} /> Inappropriate physical contact → Account suspension</li>
                <li><FiAlertCircle size={16} /> Harassment or threats → Permanent ban</li>
                <li><FiAlertCircle size={16} /> Sharing private location data → Legal action</li>
              </ul>
            </div>

            <div className="safety-box">
              <h4>📍 SafeTrack™ Features</h4>
              <p>
                During every booking, both parties receive automated check-in prompts every 30 minutes. Location is shared with your trusted emergency contact, and you can trigger an SOS alert at any time.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div className="trust-modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="trust-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Report {companionData.firstName}'s Profile</h3>
            <p>Help us keep Velora safe. All reports are reviewed confidentially within 24 hours.</p>

            <form onSubmit={handleReport}>
              <div className="form-field">
                <label>Report Reason *</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  required
                >
                  <option value="">Select a reason...</option>
                  {reportReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Additional Details (Optional)</label>
                <textarea
                  placeholder="Provide any additional context that helps us understand the issue..."
                  rows="4"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="trust-btn-outline" onClick={() => setShowReportModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="trust-btn trust-btn-primary">
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {blockConfirm && (
        <div className="trust-modal-overlay" onClick={() => setBlockConfirm(null)}>
          <div className="trust-modal trust-modal-confirm" onClick={(e) => e.stopPropagation()}>
            <FiX size={32} className="modal-icon-block" />
            <h3>Block {companionData.firstName}?</h3>
            <p>You won't see their profile again, and they won't be able to contact you.</p>
            <div className="modal-actions">
              <button className="trust-btn-outline" onClick={() => setBlockConfirm(null)}>
                Keep Unblocked
              </button>
              <button className="trust-btn trust-btn-danger" onClick={handleBlock}>
                Yes, Block User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrustCenter;
