import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from "react-icons/fi";

const ContactSupport = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "General Inquiry", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container py-5" style={{ maxWidth: "900px" }}>
      <div className="text-center mb-5">
        <span className="badge rounded-pill mb-3" style={{ background: "var(--accent-burgundy-light)", color: "var(--accent-burgundy)", padding: "8px 16px", textTransform: "uppercase", fontSize: "0.8rem", fontWeight: "600" }}>
          Dedicated Assistance
        </span>
        <h1 className="display-6 fw-bold" style={{ fontFamily: "var(--font-serif)", color: "var(--text-main)" }}>
          Contact Concierge & Support
        </h1>
        <p className="text-muted">Our privacy desk and support team are available 24/7 for booking inquiries and safety support.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-5">
          <div className="card p-4 border-0 shadow-sm h-100" style={{ background: "var(--accent-burgundy)", color: "#FFFFFF", borderRadius: "var(--radius-lg)" }}>
            <h4 className="fw-bold mb-4" style={{ fontFamily: "var(--font-serif)" }}>VELORA Concierge</h4>
            
            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="p-2 rounded-circle bg-white text-dark"><FiMail size={18} /></div>
              <div>
                <span className="small opacity-75 d-block">Email Support</span>
                <strong className="small">concierge@velora.luxury</strong>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="p-2 rounded-circle bg-white text-dark"><FiPhone size={18} /></div>
              <div>
                <span className="small opacity-75 d-block">Urgent Safety Desk</span>
                <strong className="small">+91 (11) 4000-VELORA</strong>
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="p-2 rounded-circle bg-white text-dark"><FiMapPin size={18} /></div>
              <div>
                <span className="small opacity-75 d-block">Operating Headquarters</span>
                <strong className="small">DLF Cyber City, Tower B, Gurugram, Delhi NCR 122002</strong>
              </div>
            </div>

            <hr className="opacity-25" />
            <p className="small opacity-75 mb-0">Emergency helplines: 112 (National Police) • 1091 (Women Helpline India)</p>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card p-4 border-0 shadow-sm" style={{ background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)" }}>
            {submitted ? (
              <div className="text-center py-5">
                <FiCheckCircle size={48} className="text-success mb-3" />
                <h4 className="fw-bold">Message Received</h4>
                <p className="text-muted small">Our support team has logged your inquiry and will reach out within 2 hours.</p>
                <button onClick={() => setSubmitted(false)} className="btn btn-sm btn-outline-dark mt-2" style={{ borderRadius: "var(--radius-full)" }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h5 className="fw-bold mb-3" style={{ color: "var(--text-main)" }}>Send a Confidential Message</h5>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Your Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="E.g. Kabir Roy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Your Email</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Subject</label>
                  <select
                    className="form-select"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Booking Assistance">Booking Assistance</option>
                    <option value="Companion Application">Companion Application</option>
                    <option value="Safety or Dispute Report">Safety or Dispute Report</option>
                    <option value="DPDP Privacy Request">DPDP Privacy Request</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Message</label>
                  <textarea
                    rows={4}
                    required
                    className="form-control"
                    placeholder="How can our concierge assist you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-dark w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2" style={{ background: "var(--accent-burgundy)", borderColor: "var(--accent-burgundy)", borderRadius: "var(--radius-full)" }}>
                  <FiSend /> Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
