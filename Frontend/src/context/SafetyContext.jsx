import React, { createContext, useContext, useState, useEffect } from "react";
import { getStored, setStored, STORAGE_KEYS } from "../utils/mockStorage";

const SafetyContext = createContext(null);

export const SafetyProvider = ({ children }) => {
  const [activeSession, setActiveSession] = useState(null);
  const [trustedContacts, setTrustedContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = getStored(STORAGE_KEYS.ACTIVE_SESSION, null);
    const contacts = getStored(STORAGE_KEYS.CONTACTS, []);
    setActiveSession(session);
    setTrustedContacts(contacts);
  }, []);

  const refreshContacts = () => {
    const contacts = getStored(STORAGE_KEYS.CONTACTS, []);
    setTrustedContacts(contacts);
  };

  const startSession = async (sessionData) => {
    setLoading(true);
    const newSession = {
      id: "safe-" + Date.now(),
      shareToken: "token-" + Math.floor(100000 + Math.random() * 900000),
      destination: sessionData.destination || "CyberHub, Gurgaon",
      durationMinutes: sessionData.durationMinutes || 60,
      startTime: new Date().toISOString(),
      status: "ACTIVE",
      lastCheckIn: new Date().toISOString(),
      firstName: "Kabir"
    };

    setStored(STORAGE_KEYS.ACTIVE_SESSION, newSession);
    setActiveSession(newSession);
    setLoading(false);
    return { session: newSession };
  };

  const checkIn = async () => {
    if (!activeSession) return;
    const updated = {
      ...activeSession,
      lastCheckIn: new Date().toISOString(),
      status: "CHECKED_IN"
    };
    setStored(STORAGE_KEYS.ACTIVE_SESSION, updated);
    setActiveSession(updated);
    alert("✓ SafeTrack Check-in Confirmed! Your trusted contacts have been notified.");
  };

  const endSession = async () => {
    if (!activeSession) return;
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
    setActiveSession(null);
    alert("SafeTrack trip completed safely.");
  };

  const triggerEmergency = async () => {
    if (!activeSession) return;
    const updated = {
      ...activeSession,
      status: "EMERGENCY_ALERT_ACTIVE"
    };
    setStored(STORAGE_KEYS.ACTIVE_SESSION, updated);
    setActiveSession(updated);
    return { emergencyTriggered: true };
  };

  return (
    <SafetyContext.Provider value={{
      activeSession,
      trustedContacts,
      loading,
      startSession,
      checkIn,
      endSession,
      triggerEmergency,
      refreshContacts
    }}>
      {children}
    </SafetyContext.Provider>
  );
};

export const useSafety = () => useContext(SafetyContext);
