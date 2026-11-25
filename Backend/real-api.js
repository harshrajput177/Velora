// Real API Endpoints for Overpass API Integration

const axios = require('axios');

// Haversine Formula - Calculate distance
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getPlaceEmoji = (type) => {
  const map = {
    "restaurant": "🍽️", "cafe": "☕", "hotel": "🏨",
    "nightclub": "🎉", "pub": "🍺", "bar": "🍷"
  };
  return map[type] || "📍";
};

module.exports = { calculateDistance, getPlaceEmoji };







// Request URL
// Request Method
// Status Code

// Remote Address

// Referrer Policy

// https://klkerp.com/api/kashmir/srt/70mw/installation/site-details-store
// POST
// 500 Internal Server Error
// 88.222.243.248:443
// strict-origin-when-cross-origin