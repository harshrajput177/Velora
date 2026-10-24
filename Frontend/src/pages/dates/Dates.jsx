import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin, FiClock, FiCheck, FiX, FiRefreshCw, FiPlus } from "react-icons/fi";
import { getDates, updateDateStatus } from "../../utils/mockStorage";
import "./Dates.css";

const Dates = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDates = () => {
    setDates(getDates());
    setLoading(false);
  };

  useEffect(() => { fetchDates(); }, []);

  const handleStatusChange = (id, status) => {
    const updated = updateDateStatus(id, status);
    setDates(updated);
    alert(`Date invitation status updated to ${status}`);
  };

  return (
    <div className="dates-page-container">
      <div className="dates-header-wrap">
        <div>
          <h2 className="dates-title">Pick a Plan Date Outings</h2>
          <p className="dates-sub">Curated romantic & social dates in NCR</p>
        </div>
        <Link to="/discover?mode=dates" className="btn-plan-new">
          <FiPlus size={15} /> Pick New Plan
        </Link>
      </div>

      {dates.length === 0 ? (
        <div className="card p-5 text-center border-0 shadow-sm rounded-4 bg-white">
          <h5 className="fw-bold mb-2">No date invitations yet.</h5>
          <p className="text-muted small mb-3">Explore companions and click "Pick a Plan" to create one.</p>
          <div>
            <Link to="/discover" className="btn-plan-new" style={{ margin: "0 auto" }}>
              Discover Companions
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-3 g-md-4">
          {dates.map(d => (
            <div key={d.id} className="col-12 col-md-6">
              <div className="date-plan-card">
                <div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className={`badge rounded-pill ${d.status === "ACCEPTED" ? "bg-success" : d.status === "REQUESTED" ? "bg-warning text-dark" : "bg-secondary"}`}>
                      {d.status}
                    </span>
                    <small className="text-muted">{new Date(d.date).toLocaleDateString()} @ {d.time}</small>
                  </div>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <img
                      src={d.partner.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                      alt="Partner"
                      className="rounded-circle"
                      style={{ width: 48, height: 48, objectFit: "cover" }}
                    />
                    <div>
                      <h6 className="fw-bold mb-0">{d.partner.firstName}</h6>
                      <small className="text-muted">{d.activity} • {d.venue}</small>
                    </div>
                  </div>
                  {d.notes && <p className="small text-muted mb-2 bg-light p-2 rounded">"{d.notes}"</p>}
                </div>

                {/* Actions */}
                {!d.isSender && d.status === "REQUESTED" && (
                  <div className="d-flex gap-2 mt-3 pt-2 border-top">
                    <button onClick={() => handleStatusChange(d.id, "ACCEPTED")} className="btn btn-sm btn-success rounded-pill flex-grow-1">
                      <FiCheck className="me-1" /> Accept Date
                    </button>
                    <button onClick={() => handleStatusChange(d.id, "DECLINED")} className="btn btn-sm btn-outline-danger rounded-pill flex-grow-1">
                      <FiX className="me-1" /> Decline
                    </button>
                  </div>
                )}
                {d.status === "ACCEPTED" && (
                  <div className="d-flex gap-2 mt-3 pt-2 border-top">
                    <Link to="/safety" className="btn btn-sm btn-danger rounded-pill flex-grow-1 text-white">
                      🛡️ SafeTrack Date Mode
                    </Link>
                    <Link to="/messages" className="btn btn-sm btn-outline-dark rounded-pill flex-grow-1">
                      💬 Open Chat
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dates;
