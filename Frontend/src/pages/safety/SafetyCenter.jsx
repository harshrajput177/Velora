import React, { useState } from "react";
import { useSafety } from "../../context/SafetyContext";
import { useAuth } from "../../context/AuthContext";
import { getStored, setStored, STORAGE_KEYS } from "../../utils/mockStorage";
import { FiShield, FiSend, FiPlus, FiTrash2, FiPhoneCall, FiCheckCircle, FiShare2, FiAlertOctagon } from "react-icons/fi";
import "./SafetyCenter.css";

const SafetyCenter = () => {
  const { user } = useAuth();
  const { activeSession, trustedContacts, startSession, checkIn, endSession, triggerEmergency, refreshContacts } = useSafety();

  const [destination, setDestination] = useState("DLF CyberHub, Gurgaon");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRelation, setContactRelation] = useState("Friend");
  const [shareData, setShareData] = useState(null);

  const handleStartSafeTrack = async (e) => {
    e.preventDefault();
    try {
      const data = await startSession({
        destination,
        durationMinutes
      });
      setShareData(data);
    } catch (err) {
      alert("Error starting SafeTrack: " + err.message);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;
    try {
      const current = getStored(STORAGE_KEYS.CONTACTS, []);
      const newContact = {
        id: "c-" + Date.now(),
        name: contactName,
        phone: contactPhone,
        relation: contactRelation
      };
      setStored(STORAGE_KEYS.CONTACTS, [...current, newContact]);
      setContactName("");
      setContactPhone("");
      refreshContacts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      const current = getStored(STORAGE_KEYS.CONTACTS, []);
      setStored(STORAGE_KEYS.CONTACTS, current.filter(c => c.id !== id));
      refreshContacts();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEmergency = async () => {
    if (confirm("Trigger emergency assistance shortcut and alert contacts?")) {
      const data = await triggerEmergency();
      alert("Emergency assistance shortcut triggered. Helpline 112 / 1091 dialed.");
    }
  };

  return (
    <div className="safety-page-container">
      {/* Header */}
      <div className="safety-header-wrap">
        <div className="safety-shield-badge">
          <FiShield size={28} />
        </div>
        <div>
          <h2 className="safety-title">SafeTrack & Safety Center</h2>
          <p className="safety-sub">Real-time live trip tracking, verified contacts & emergency assistance</p>
        </div>
      </div>

      <div className="row g-4">
        {/* SafeTrack Session Launcher / Status */}
        <div className="col-12 col-lg-7">
          <div className="app-card p-4 mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <span className="badge bg-danger">LIVE</span> SafeTrack Date / Outing Mode
            </h5>

            {activeSession ? (
              <div className="p-4 bg-light rounded-4 border">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span className="badge bg-success rounded-pill px-3 py-1 mb-1">
                      {activeSession.status}
                    </span>
                    <h5 className="fw-bold mb-0">{activeSession.destination}</h5>
                    <small className="text-muted">Started: {new Date(activeSession.startedAt).toLocaleTimeString()}</small>
                  </div>
                  <button onClick={endSession} className="btn btn-sm btn-dark rounded-pill">
                    End Session
                  </button>
                </div>

                <div className="p-3 bg-white rounded-3 border mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-bold small">Next Safety Check-in</div>
                      <small className="text-muted">Auto-reminds you every 30 minutes</small>
                    </div>
                    <button onClick={checkIn} className="btn btn-sm btn-success rounded-pill px-3 fw-bold">
                      <FiCheckCircle className="me-1" /> I'm Safe
                    </button>
                  </div>
                </div>

                {/* WhatsApp Live Share Link */}
                <div className="border-top pt-3">
                  <label className="fw-semibold small text-muted mb-2">Live WhatsApp Tracking Link</label>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/safety/share/${activeSession.shareToken}`}
                      className="form-control form-control-sm"
                    />
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent("I am sharing my live SafeTrack trip with you: " + window.location.origin + "/safety/share/" + activeSession.shareToken)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-success rounded-pill text-nowrap"
                    >
                      <FiShare2 className="me-1" /> Share on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStartSafeTrack}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Meeting Destination / Venue</label>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="e.g. Blue Tokai Hauz Khas / CyberHub"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Expected Duration (Minutes)</label>
                  <select value={durationMinutes} onChange={e => setDurationMinutes(e.target.value)} className="form-select">
                    <option value={30}>30 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={120}>2 Hours</option>
                    <option value={180}>3 Hours</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary-custom w-100 py-2">
                  <FiShield className="me-1" /> Start SafeTrack & Generate WhatsApp Link
                </button>
              </form>
            )}
          </div>

          {/* Quick Emergency Assistance */}
          <div className="app-card p-4 border border-danger-subtle bg-white">
            <h5 className="fw-bold text-danger mb-2 d-flex align-items-center gap-2">
              <FiAlertOctagon /> Emergency Shortcuts
            </h5>
            <p className="text-muted small mb-3">
              Direct emergency helpline shortcuts for Delhi NCR.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <a href="tel:112" className="btn btn-danger btn-sm rounded-pill px-3">
                <FiPhoneCall className="me-1" /> Call 112 (National Emergency)
              </a>
              <a href="tel:1091" className="btn btn-outline-danger btn-sm rounded-pill px-3">
                <FiPhoneCall className="me-1" /> Call 1091 (Women Helpline)
              </a>
              <button onClick={handleEmergency} className="btn btn-dark btn-sm rounded-pill px-3">
                Alert Trusted Contacts
              </button>
            </div>
          </div>
        </div>

        {/* Trusted Contacts Sidebar */}
        <div className="col-12 col-lg-5">
          <div className="app-card p-4">
            <h5 className="fw-bold mb-3">Trusted Contacts</h5>
            <p className="text-muted small mb-3">These contacts receive automated SafeTrack links when you start a date outing.</p>

            {/* Contacts List */}
            <div className="d-flex flex-column gap-2 mb-4">
              {trustedContacts.map(c => (
                <div key={c.id} className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between border">
                  <div>
                    <h6 className="fw-bold mb-0">{c.name}</h6>
                    <small className="text-muted">{c.relation} • {c.phone}</small>
                  </div>
                  <button onClick={() => handleDeleteContact(c.id)} className="btn btn-light text-danger btn-sm rounded-circle p-2">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Contact Form */}
            <form onSubmit={handleAddContact} className="p-3 bg-light rounded-3 border">
              <h6 className="fw-bold small mb-2">+ Add New Trusted Contact</h6>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Contact Name"
                  required
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  className="form-control form-control-sm"
                />
              </div>
              <div className="mb-2">
                <input
                  type="tel"
                  placeholder="Phone Number (for WhatsApp)"
                  required
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  className="form-control form-control-sm"
                />
              </div>
              <button type="submit" className="btn btn-dark btn-sm rounded-pill w-100">
                Save Contact
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyCenter;
