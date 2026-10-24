import React, { useState, useEffect } from "react";
import ProfileCard from "../../components/profile/ProfileCard";
import DateRequestModal from "../../components/dating/DateRequestModal";
import CompanionBookingModal from "../../components/companion/CompanionBookingModal";
import { INITIAL_COMPANIONS } from "../../constants/initialCompanions";
import { addMatch } from "../../utils/mockStorage";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiZap } from "react-icons/fi";
import "./AvailableNow.css";

const AvailableNow = () => {
  const [companions, setCompanions] = useState(INITIAL_COMPANIONS.filter(c => c.availableNow));
  const [datePartner, setDatePartner] = useState(null);
  const [bookCompanion, setBookCompanion] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setCompanions(INITIAL_COMPANIONS.filter(c => c.availableNow));
  }, []);

  return (
    <div className="avail-page-container">
      <div className="avail-header-wrap">
        <div className="avail-zap-badge">
          <FiZap size={22} />
        </div>
        <div>
          <h2 className="avail-title">Available Right Now in Delhi NCR</h2>
          <p className="avail-sub">Verified companions ready to connect in person within 20–30 minutes</p>
        </div>
      </div>

      <div className="row g-3 g-md-4">
        {companions.map(c => (
          <div key={c.userId || c.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <ProfileCard
              profile={c}
              onLike={() => {
                if (!isAuthenticated) return navigate("/login");
                addMatch(c);
                alert(`❤️ Liked ${c.firstName}!`);
              }}
              onOpenDateModal={p => { if (!isAuthenticated) return navigate("/login"); setDatePartner(p); }}
              onOpenBookModal={comp => { if (!isAuthenticated) return navigate("/login"); setBookCompanion(comp); }}
            />
          </div>
        ))}
      </div>

      <DateRequestModal show={!!datePartner} onHide={() => setDatePartner(null)} partner={datePartner} />
      <CompanionBookingModal show={!!bookCompanion} onHide={() => setBookCompanion(null)} companion={bookCompanion} />
    </div>
  );
};

export default AvailableNow;
