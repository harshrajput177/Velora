import React from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import CallModal from "../calls/CallModal";
import { useSafety } from "../../context/SafetyContext";
import { FiShield, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import "./AppLayout.css";

const AppLayout = () => {
  const { activeSession, checkIn, endSession } = useSafety();

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Header />

      
      {activeSession && (
        <div className="bg-danger text-white py-2 px-3 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-2 sticky-top" style={{ top: 56, zIndex: 1020 }}>
          <div className="d-flex align-items-center gap-2">
            <FiShield size={20} className="animate-pulse" />
            <div>
              <span className="fw-bold" style={{ fontSize: "0.9rem" }}>SafeTrack Mode Active</span>
              <span className="d-none d-sm-inline ms-2 opacity-75" style={{ fontSize: "0.8rem" }}>
                Heading to: {activeSession.destination}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button onClick={checkIn} className="btn btn-sm btn-light text-danger fw-bold rounded-pill px-3">
              <FiCheckCircle className="me-1" /> I'm Safe
            </button>
            <Link to="/safety" className="btn btn-sm btn-outline-light rounded-pill px-3">
              Live Map
            </Link>
            <button onClick={endSession} className="btn btn-sm btn-dark rounded-pill px-3">
              End Trip
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow-1 pb-5 pb-lg-0">
        <Outlet />
      </main>

      <CallModal />
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
