import React, { useState, useEffect } from "react";
import { FiMapPin, FiStar, FiChevronDown, FiChevronUp } from "react-icons/fi";
import "./NearbyPlaces.css";

const NearbyPlaces = ({ venue, onPlaceSelect }) => {
  const [nearbyData, setNearbyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({
    restaurants: true,
    malls: true,
    hotels: true
  });

  useEffect(() => {
    if (!venue) {
      setLoading(false);
      return;
    }

    const fetchNearbyPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/api/nearby-places?venue=${encodeURIComponent(venue)}`);
        if (!response.ok) throw new Error("Failed to fetch nearby places");
        const data = await response.json();
        setNearbyData(data);
      } catch (err) {
        console.error("Error fetching nearby places:", err);
        setError("Could not load nearby places");
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyPlaces();
  }, [venue]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!venue) return null;

  return (
    <div className="nearby-places-container">
      <div className="nearby-header">
        <h5 className="nearby-title">
          <FiMapPin size={16} className="me-2" />
          Nearby Places
        </h5>
        <small className="text-muted">{venue}</small>
      </div>

      {loading && (
        <div className="nearby-loading">
          <div className="spinner-border spinner-border-sm text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="ms-2">Finding nearby places...</span>
        </div>
      )}

      {error && (
        <div className="nearby-error">
          ⚠️ {error}
        </div>
      )}

      {nearbyData && !loading && (
        <div className="nearby-categories">
          {/* Restaurants Section */}
          <div className="category-section">
            <div
              className="category-header"
              onClick={() => toggleCategory("restaurants")}
            >
              <div className="category-title">
                <span className="category-icon">🍽️</span>
                <span>Restaurants ({nearbyData.restaurants.length})</span>
              </div>
              {expandedCategories.restaurants ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {expandedCategories.restaurants && (
              <div className="places-grid">
                {nearbyData.restaurants.map(place => (
                  <div
                    key={place.id}
                    className="place-card"
                    onClick={() => onPlaceSelect && onPlaceSelect(place)}
                  >
                    <div className="place-icon">{place.image}</div>
                    <div className="place-info">
                      <h6 className="place-name">{place.name}</h6>
                      <div className="place-details">
                        <span className="place-type">{place.type}</span>
                        <span className="place-distance">{place.distance} km</span>
                      </div>
                      <div className="place-rating">
                        <FiStar size={12} className="star-icon" />
                        <span>{place.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Malls Section */}
          <div className="category-section">
            <div
              className="category-header"
              onClick={() => toggleCategory("malls")}
            >
              <div className="category-title">
                <span className="category-icon">🛍️</span>
                <span>Shopping Malls ({nearbyData.malls.length})</span>
              </div>
              {expandedCategories.malls ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {expandedCategories.malls && (
              <div className="places-grid">
                {nearbyData.malls.map(place => (
                  <div
                    key={place.id}
                    className="place-card"
                    onClick={() => onPlaceSelect && onPlaceSelect(place)}
                  >
                    <div className="place-icon">{place.image}</div>
                    <div className="place-info">
                      <h6 className="place-name">{place.name}</h6>
                      <div className="place-details">
                        <span className="place-type">{place.type}</span>
                        <span className="place-distance">{place.distance} km</span>
                      </div>
                      <div className="place-rating">
                        <FiStar size={12} className="star-icon" />
                        <span>{place.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hotels Section */}
          <div className="category-section">
            <div
              className="category-header"
              onClick={() => toggleCategory("hotels")}
            >
              <div className="category-title">
                <span className="category-icon">🏨</span>
                <span>Hotels ({nearbyData.hotels.length})</span>
              </div>
              {expandedCategories.hotels ? <FiChevronUp /> : <FiChevronDown />}
            </div>
            {expandedCategories.hotels && (
              <div className="places-grid">
                {nearbyData.hotels.map(place => (
                  <div
                    key={place.id}
                    className="place-card"
                    onClick={() => onPlaceSelect && onPlaceSelect(place)}
                  >
                    <div className="place-icon">{place.image}</div>
                    <div className="place-info">
                      <h6 className="place-name">{place.name}</h6>
                      <div className="place-details">
                        <span className="place-type">{place.type}</span>
                        <span className="place-distance">{place.distance} km</span>
                      </div>
                      <div className="place-rating">
                        <FiStar size={12} className="star-icon" />
                        <span>{place.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NearbyPlaces;
