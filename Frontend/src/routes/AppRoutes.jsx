import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Home from "../pages/home/Home";
import Discover from "../pages/discover/Discover";
import AvailableNow from "../pages/discover/AvailableNow";
import Matches from "../pages/matches/Matches";
import Dates from "../pages/dates/Dates";
import MyBookings from "../pages/companion/MyBookings";
import Messages from "../pages/chat/Messages";
import SafetyCenter from "../pages/safety/SafetyCenter";
import SharedTrip from "../pages/safety/SharedTrip";
import MyProfile from "../pages/profile/MyProfile";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// VELORA Master Additions
import HowItWorks from "../pages/public/HowItWorks";
import FAQ from "../pages/public/FAQ";
import LegalTerms from "../pages/public/LegalTerms";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";
import CancellationRefundPolicy from "../pages/public/CancellationRefundPolicy";
import ContactSupport from "../pages/public/ContactSupport";
import VerificationOnboarding from "../pages/auth/VerificationOnboarding";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CompanionDashboard from "../pages/companion/CompanionDashboard";
import CompanionProfile from "../pages/companion/CompanionProfile";
import CallRoom from "../pages/calls/CallRoom";
import TrustCenter from "../pages/safety/TrustCenter";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Core Discovery */}
        <Route index element={<Home />} />
        <Route path="discover" element={<Discover />} />
        <Route path="available-now" element={<AvailableNow />} />
        <Route path="companion/:id" element={<CompanionProfile />} />
        
        {/* Public Informational & Policy Pages */}
        <Route path="how-it-works" element={<HowItWorks />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="terms" element={<LegalTerms />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="cancellation-policy" element={<CancellationRefundPolicy />} />
        <Route path="contact" element={<ContactSupport />} />

        {/* Auth & Verification */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify" element={<ProtectedRoute><VerificationOnboarding /></ProtectedRoute>} />

        {/* Member Portals */}
        <Route path="dates" element={<ProtectedRoute><Dates /></ProtectedRoute>} />
        <Route path="bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="matches" element={<ProtectedRoute><Matches /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="safety" element={<ProtectedRoute><SafetyCenter /></ProtectedRoute>} />
        <Route path="trust" element={<ProtectedRoute><TrustCenter /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
        
        {/* Companion & Admin Portals */}
        <Route path="companion/dashboard" element={<ProtectedRoute><CompanionDashboard /></ProtectedRoute>} />
        <Route path="admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      </Route>

      {/* Standalone Focus Views */}
      <Route path="/calls/room" element={<ProtectedRoute><CallRoom /></ProtectedRoute>} />
      <Route path="/safety/share/:token" element={<SharedTrip />} />
    </Routes>
  );
};

export default AppRoutes;
