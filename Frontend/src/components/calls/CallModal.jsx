import React from "react";
import { useCall } from "../../context/CallContext";
import { FiPhone, FiPhoneOff, FiMic, FiMicOff, FiVideo, FiVideoOff } from "react-icons/fi";

const CallModal = () => {
  const {
    incomingCall,
    activeCall,
    isMuted,
    isVideoOff,
    setIsMuted,
    setIsVideoOff,
    acceptIncomingCall,
    declineIncomingCall,
    endCall
  } = useCall();

  if (!incomingCall && !activeCall) return null;

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: "rgba(0,0,0,0.85)", zIndex: 99999 }}>
      {/* Incoming Call View */}
      {incomingCall && !activeCall && (
        <div className="bg-white rounded-4 p-4 text-center shadow-lg max-w-sm w-100" style={{ maxWidth: 360 }}>
          <img
            src={incomingCall.callerInfo?.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
            alt="Caller"
            className="rounded-circle shadow-md mx-auto mb-3"
            style={{ width: 90, height: 90, objectFit: "cover" }}
          />
          <h4 className="fw-bold mb-1">{incomingCall.callerInfo?.firstName || "Companion User"}</h4>
          <p className="text-muted small mb-4">Incoming {incomingCall.callType === "video" ? "Video" : "Voice"} Call...</p>
          <div className="d-flex justify-content-center gap-4">
            <button onClick={declineIncomingCall} className="btn btn-danger rounded-circle p-3 shadow" title="Decline">
              <FiPhoneOff size={24} />
            </button>
            <button onClick={acceptIncomingCall} className="btn btn-success rounded-circle p-3 shadow" title="Accept">
              <FiPhone size={24} />
            </button>
          </div>
        </div>
      )}

      {/* Active Call View */}
      {activeCall && (
        <div className="bg-dark rounded-4 p-4 text-white text-center shadow-lg w-100" style={{ maxWidth: 500, minHeight: 400 }}>
          <div className="position-relative rounded-3 overflow-hidden mb-3 bg-secondary d-flex align-items-center justify-content-center" style={{ height: 260 }}>
            <img
              src={activeCall.partnerInfo?.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
              alt="Partner"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div className="position-absolute bottom-0 start-0 w-100 p-2 bg-gradient-dark text-start text-white">
              <span className="badge bg-success me-2">{activeCall.status === "connected" ? "Connected" : "Calling..."}</span>
              <span className="fw-semibold">{activeCall.partnerInfo?.firstName || "Companion"}</span>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button onClick={() => setIsMuted(!isMuted)} className={`btn ${isMuted ? "btn-warning" : "btn-light"} rounded-circle p-3`}>
              {isMuted ? <FiMicOff size={20} /> : <FiMic size={20} />}
            </button>
            <button onClick={() => setIsVideoOff(!isVideoOff)} className={`btn ${isVideoOff ? "btn-warning" : "btn-light"} rounded-circle p-3`}>
              {isVideoOff ? <FiVideoOff size={20} /> : <FiVideo size={20} />}
            </button>
            <button onClick={endCall} className="btn btn-danger rounded-circle p-3 shadow" title="End Call">
              <FiPhoneOff size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallModal;
