import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { getMatches, openOrCreateConversation } from "../../utils/mockStorage";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setMatches(getMatches());
    setLoading(false);
  }, []);

  const handleOpenChat = (user) => {
    const convo = openOrCreateConversation(user);
    navigate(`/messages?convo=${convo.id}`);
  };

  return (
    <div className="app-container py-4">
      <h2 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <FiHeart className="text-danger" /> Mutual Matches
      </h2>
      <div className="row g-4">
        {matches.map(m => (
          <div key={m.matchId} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="app-card p-3 text-center">
              <img
                src={m.user.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                alt={m.user.firstName}
                className="rounded-circle mb-2 mx-auto"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <h5 className="fw-bold mb-0">{m.user.firstName}, {m.user.age}</h5>
              <p className="text-muted small mb-3">{m.user.area || m.user.city}</p>
              <button onClick={() => handleOpenChat(m.user)} className="btn btn-sm btn-primary-custom w-100">
                <FiMessageCircle className="me-1" /> Open Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
