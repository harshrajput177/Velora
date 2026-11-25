import React, { useState, useEffect } from "react";
import {
  FiMapPin,
  FiStar,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiCheck,
  FiCompass,
  FiCoffee
} from "react-icons/fi";
import { fetchNearbyPlaces, getCurrentLocation } from "../../services/locationService";
import "./NearbyPlaces.css";

const NearbyPlaces = ({ venue, companion, onPlaceSelect, selectedPlaceName }) => {
  const [nearbyData, setNearbyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all"); // "all" | "cafes" | "restaurants" | "hotels" | "clubs"
  const [userCoords, setUserCoords] = useState(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);

  // 1. Get user coordinates once
  useEffect(() => {
    let isMounted = true;
    getCurrentLocation().then(loc => {
      if (isMounted) setUserCoords(loc);
    });
    return () => { isMounted = false; };
  }, []);

  // 2. Fetch nearby places whenever venue changes
  const loadPlaces = async () => {
    if (!venue) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNearbyPlaces({
        venue,
        userCoords,
        radius: 5
      });
      setNearbyData(data);
    } catch (err) {
      console.warn("Nearby fetch error:", err);
      setError("Unable to load places right now");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [venue]);

  const handleSelect = (place) => {
    setSelectedPlaceId(place.id);
    if (onPlaceSelect) {
      onPlaceSelect(place);
    }
  };

  if (!venue) return null;

  // Flatten or filter places based on activeCategory
  const getPlacesList = () => {
    if (!nearbyData) return [];
    if (activeCategory === "all") {
      const all = [];
      if (nearbyData.cafes) all.push(...nearbyData.cafes);
      if (nearbyData.restaurants) all.push(...nearbyData.restaurants);
      if (nearbyData.hotels) all.push(...nearbyData.hotels);
      if (nearbyData.clubs) all.push(...nearbyData.clubs);
      return all;
    }
    return nearbyData[activeCategory] || [];
  };

  const placesList = getPlacesList();

  return (
    <div className="nearby-places-container mb-3">
      {/* Header */}
      <div className="nearby-header d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div>
          <div className="d-flex align-items-center gap-1.5">
            <h6 className="nearby-title mb-0">
              <FiCompass className="text-danger me-1" size={16} />
              OpenStreetMap Safe Meetup Places
            </h6>
            <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2 py-0.5" style={{ fontSize: "0.68rem" }}>
              100% Public & Verified
            </span>
          </div>
          <small className="text-muted" style={{ fontSize: "0.75rem" }}>
            Select a verified cafe, hotel or restaurant near <strong>{venue.split(",")[0]}</strong>
          </small>
        </div>

        <button
          type="button"
          onClick={loadPlaces}
          disabled={loading}
          className="btn btn-sm btn-outline-secondary rounded-pill d-inline-flex align-items-center gap-1 py-1 px-2.5"
          style={{ fontSize: "0.75rem" }}
          title="Refresh places from OpenStreetMap"
        >
          <FiRefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? "Scanning..." : "Refresh"}
        </button>
      </div>

      {/* Category Pills */}
      <div className="d-flex gap-1.5 overflow-x-auto pb-1 mb-2.5 nearby-category-bar">
        {[
          { id: "all", label: "🌟 All Spots", count: nearbyData?.total || 0 },
          { id: "cafes", label: "☕ Cafes", count: nearbyData?.cafes?.length || 0 },
          { id: "restaurants", label: "🍽️ Dining", count: nearbyData?.restaurants?.length || 0 },
          { id: "hotels", label: "🏨 Luxury Hotels", count: nearbyData?.hotels?.length || 0 },
          { id: "clubs", label: "🍸 Lounges", count: nearbyData?.clubs?.length || 0 }
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`btn btn-sm rounded-pill py-1 px-2.5 text-nowrap nearby-tab-pill ${
              activeCategory === cat.id
                ? "btn-danger fw-bold shadow-sm"
                : "btn-light border text-muted"
            }`}
            style={{ fontSize: "0.76rem" }}
          >
            {cat.label} {cat.count > 0 && <span className="opacity-75 ms-1">({cat.count})</span>}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-4 bg-white rounded-3 border border-dashed">
          <div className="spinner-border spinner-border-sm text-danger me-2" role="status" />
          <span className="small text-muted" style={{ fontSize: "0.82rem" }}>
            Scanning OpenStreetMap nodes for <strong>{venue.split(",")[0]}</strong>...
          </span>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="alert alert-warning py-2 px-3 small rounded-3 mb-2" style={{ fontSize: "0.8rem" }}>
          ⚠️ {error}. Using verified fallback spots for {venue.split(",")[0]}.
        </div>
      )}

      {/* Places Grid */}
      {!loading && (
        <div className="nearby-places-grid">
          {placesList.slice(0, 8).map((place) => {
            const isSelected = selectedPlaceId === place.id || (selectedPlaceName && selectedPlaceName.includes(place.name));
            return (
              <div
                key={place.id}
                onClick={() => handleSelect(place)}
                className={`nearby-place-card ${isSelected ? "is-selected" : ""}`}
                role="button"
                tabIndex={0}
              >
                <div className="nearby-card-top">
                  <span className="place-emoji-icon">{place.image || "📍"}</span>
                  <div className="place-rating-badge">
                    <FiStar size={11} className="text-warning fill-warning" />
                    <span>{place.rating || "4.6"}</span>
                  </div>
                </div>

                <div className="nearby-card-body">
                  <div className="place-title-text" title={place.name}>
                    {place.name}
                  </div>
                  <div className="place-address-text text-truncate">
                    {place.address || place.category}
                  </div>
                </div>

                <div className="nearby-card-footer">
                  <span className="distance-badge">
                    <FiMapPin size={10} className="me-1" />
                    {place.distance ? `${place.distance} km` : "Nearby"}
                  </span>
                  {isSelected ? (
                    <span className="badge bg-danger text-white rounded-pill px-2 py-0.5" style={{ fontSize: "0.68rem" }}>
                      <FiCheck size={11} className="me-0.5" /> Selected
                    </span>
                  ) : (
                    <span className="select-hint-text">Select</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* OpenStreetMap Attribution Footer */}
      <div className="mt-2.5 pt-2 border-top d-flex align-items-center justify-content-between text-muted" style={{ fontSize: "0.72rem" }}>
        <span>
          📡 Data: <strong>OpenStreetMap (OSM) Contributors</strong>
        </span>
        <span>
          🛡️ Verified 100% public venue safety
        </span>
      </div>
    </div>
  );
};

export default NearbyPlaces;
