import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStored, STORAGE_KEYS } from "../../utils/mockStorage";
import { FiShield, FiMapPin, FiClock, FiCheckCircle } from "react-icons/fi";

const SharedTrip = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrip = () => {
      const active = getStored(STORAGE_KEYS.ACTIVE_SESSION, null);
      if (active) {
        setTrip(active);
      } else {
        setTrip({
          firstName: "Kabir",
          destination: "CyberHub, DLF Phase 2, Gurgaon",
          status: "ACTIVE",
          durationMinutes: 90,
          startTime: new Date().toISOString(),
          lastCheckIn: new Date().toISOString()
        });
      }
      setLoading(false);
    };
    fetchTrip();
  }, [token]);

  if (loading) return <div className="text-center py-5">Loading live tracking data...</div>;
  if (!trip) return <div className="text-center py-5">Trip link is invalid or has expired.</div>;

  return (
    <div className="container py-5" style={{ maxWidth: 600 }}>
      <div className="app-card p-4 text-center">
        <div className="badge bg-danger rounded-circle p-3 mx-auto mb-3" style={{ width: 64, height: 64 }}>
          <FiShield size={32} className="text-white" />
        </div>
        <h3 className="fw-bold mb-1">{trip.firstName}'s Live SafeTrack Outing</h3>
        <p className="text-muted small mb-4">Real-time status shared with trusted contacts</p>

        <div className="p-3 bg-light rounded-4 border text-start mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">Status</span>
            <span className="badge bg-success rounded-pill px-3">{trip.status}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">Destination</span>
            <span className="fw-bold">{trip.destination}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted small">Started At</span>
            <span>{new Date(trip.startedAt).toLocaleTimeString()}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted small">Last Location Update</span>
            <span>{trip.lastLocationName || "Delhi NCR"}</span>
          </div>
        </div>

        <div className="p-3 bg-success-subtle text-success rounded-3 small fw-semibold">
          <FiCheckCircle className="me-1" /> SafeTrack monitoring is currently active.
        </div>
      </div>
    </div>
  );
};

export default SharedTrip;
