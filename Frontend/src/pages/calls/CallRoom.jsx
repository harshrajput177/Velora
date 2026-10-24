import React, { useState } from "react";
import { FiPhone, FiVideo, FiMic, FiMicOff, FiVideoOff, FiPhoneOff, FiShield, FiAlertCircle } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const CallRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [micActive, setMicActive] = useState(true);
  const [videoActive, setVideoActive] = useState(true);
  const [callDuration, setCallDuration] = useState(124); // mock ongoing call timer
  const [callEnded, setCallEnded] = useState(false);

  const companionName = location.state?.companionName || "Ananya Roy";
  const companionPhoto = location.state?.companionPhoto || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500";

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleEndCall = () => {
    setCallEnded(true);
    setTimeout(() => {
      navigate("/messages");
    }, 1500);
  };

  return (
    <div className="container-fluid py-4 min-vh-100 d-flex flex-column justify-content-between" style={{ background: "var(--bg-dark)", color: "#FFFFFF" }}>
      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center gap-3">
          <img src={companionPhoto} alt={companionName} className="rounded-circle" style={{ width: "48px", height: "48px", objectFit: "cover", border: "2px solid var(--accent-champagne)" }} />
          <div>
            <h5 className="mb-0 fw-bold">{companionName}</h5>
            <span className="small text-success d-flex align-items-center gap-1">
              <span className="p-1 rounded-circle bg-success"></span> Encrypted WebRTC Session ({formatTimer(callDuration)})
            </span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge rounded-pill bg-dark text-warning border border-secondary px-3 py-2 d-flex align-items-center gap-1">
            <FiShield /> Anti-Recording Protected
          </span>
        </div>
      </div>

      {/* Main Call View */}
      <div className="d-flex justify-content-center align-items-center flex-grow-1 position-relative my-4">
        {callEnded ? (
          <div className="text-center">
            <h3 className="fw-bold text-muted">Call Terminated</h3>
            <p className="small text-muted">Returning to chat session...</p>
          </div>
        ) : (
          <div className="position-relative w-100 text-center" style={{ maxWidth: "850px", height: "480px", background: "#151515", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid #333" }}>
            <img
              src={companionPhoto}
              alt="Remote Video"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: videoActive ? "none" : "blur(20px)" }}
            />
            {/* Self preview thumbnail */}
            <div className="position-absolute bottom-0 end-0 m-3 rounded-3 overflow-hidden border border-secondary shadow" style={{ width: "140px", height: "180px", background: "#252525" }}>
              <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-secondary text-white small">
                {videoActive ? "Self Preview" : <FiVideoOff size={24} />}
              </div>
            </div>

            <div className="position-absolute top-0 start-0 m-3 px-3 py-1 bg-dark bg-opacity-75 rounded-pill small">
              HD 1080p • 60fps • End-to-End Encrypted
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="d-flex justify-content-center align-items-center gap-3 pb-4">
        <button
          onClick={() => setMicActive(!micActive)}
          className={`btn rounded-circle p-3 ${micActive ? "btn-secondary" : "btn-warning"}`}
          title={micActive ? "Mute Microphone" : "Unmute Microphone"}
        >
          {micActive ? <FiMic size={22} /> : <FiMicOff size={22} />}
        </button>

        <button
          onClick={() => setVideoActive(!videoActive)}
          className={`btn rounded-circle p-3 ${videoActive ? "btn-secondary" : "btn-warning"}`}
          title={videoActive ? "Turn Video Off" : "Turn Video On"}
        >
          {videoActive ? <FiVideo size={22} /> : <FiVideoOff size={22} />}
        </button>

        <button
          onClick={handleEndCall}
          className="btn btn-danger rounded-circle p-3"
          title="End Call Session"
          style={{ width: "54px", height: "54px" }}
        >
          <FiPhoneOff size={22} />
        </button>
      </div>
    </div>
  );
};

export default CallRoom;
