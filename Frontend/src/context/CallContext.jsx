import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

const CallContext = createContext(null);

export const CallProvider = ({ children }) => {
  const { socket } = useSocket();
  const { user, profile } = useAuth();
  const [incomingCall, setIncomingCall] = useState(null); // { fromUserId, callerInfo, callType }
  const [activeCall, setActiveCall] = useState(null); // { partnerId, partnerInfo, callType, status: 'calling'|'connected' }
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on("call:incoming", (data) => {
      setIncomingCall(data);
    });

    socket.on("call:accepted", () => {
      setActiveCall(prev => prev ? { ...prev, status: "connected" } : null);
    });

    socket.on("call:declined", () => {
      alert("Call was declined.");
      setActiveCall(null);
    });

    socket.on("call:ended", () => {
      setActiveCall(null);
      setIncomingCall(null);
    });

    return () => {
      socket.off("call:incoming");
      socket.off("call:accepted");
      socket.off("call:declined");
      socket.off("call:ended");
    };
  }, [socket]);

  const startCall = (targetUserId, partnerInfo, callType = "video") => {
    setActiveCall({
      partnerId: targetUserId,
      partnerInfo,
      callType,
      status: "calling"
    });

    if (socket) {
      socket.emit("call:initiate", {
        targetUserId,
        callerInfo: {
          id: user?.id,
          firstName: profile?.firstName || "Companion",
          photos: profile?.photos || []
        },
        callType
      });
    }

    // Auto-connect call simulation after 1.8s
    setTimeout(() => {
      setActiveCall(prev => prev ? { ...prev, status: "connected" } : null);
    }, 1800);
  };

  const acceptIncomingCall = () => {
    if (!socket || !incomingCall) return;
    setActiveCall({
      partnerId: incomingCall.fromUserId,
      partnerInfo: incomingCall.callerInfo,
      callType: incomingCall.callType,
      status: "connected"
    });
    socket.emit("call:accept", { toUserId: incomingCall.fromUserId });
    setIncomingCall(null);
  };

  const declineIncomingCall = () => {
    if (!socket || !incomingCall) return;
    socket.emit("call:decline", { toUserId: incomingCall.fromUserId });
    setIncomingCall(null);
  };

  const endCall = () => {
    if (!socket) return;
    if (activeCall?.partnerId) {
      socket.emit("call:end", { toUserId: activeCall.partnerId });
    }
    setActiveCall(null);
    setIncomingCall(null);
  };

  return (
    <CallContext.Provider value={{
      incomingCall,
      activeCall,
      isMuted,
      isVideoOff,
      setIsMuted,
      setIsVideoOff,
      startCall,
      acceptIncomingCall,
      declineIncomingCall,
      endCall
    }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => useContext(CallContext);
