import { useState, useEffect, useCallback } from 'react';
import { getCurrentLocation, fetchNearbyPlaces } from '../services/locationService';

export const useLocation = (venue, radius = 5) => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Fetch user coordinates on mount
  useEffect(() => {
    let isMounted = true;
    getCurrentLocation().then((loc) => {
      if (isMounted) setUserLocation(loc);
    });
    return () => { isMounted = false; };
  }, []);

  // 2. Refresh nearby places whenever venue or radius changes
  const loadPlaces = useCallback(async () => {
    if (!venue) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNearbyPlaces({
        venue,
        radius,
        userCoords: userLocation
      });
      setNearbyPlaces(data);
    } catch (err) {
      console.error("Failed to load nearby places:", err);
      setError("Unable to load nearby places");
    } finally {
      setLoading(false);
    }
  }, [venue, radius, userLocation]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  return {
    userLocation,
    nearbyPlaces,
    loading,
    error,
    refreshPlaces: loadPlaces
  };
};

export default useLocation;
