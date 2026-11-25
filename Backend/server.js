const express = require('express');
const cors = require('cors');
const { getNearbyPlaces, findCommonPlaces, validateCoordinates } = require('./services/locationService');
const { placeCache } = require('./utils/cache');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VELORA OpenStreetMap Backend Running 🚀",
    version: "2.0.0",
    endpoints: [
      "GET  /api/nearby-places?venue=...&radius=5",
      "POST /api/v1/locations/common-places",
      "POST /api/v1/locations/validate"
    ]
  });
});

// Validate coordinates API
app.post("/api/v1/locations/validate", (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    validateCoordinates(parseFloat(latitude), parseFloat(longitude));

    res.json({
      success: true,
      message: "Coordinates are valid",
      coordinates: { latitude: parseFloat(latitude), longitude: parseFloat(longitude) }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Nearby Places API (Works with venue name or lat/lon coordinates)
const handleNearbyPlaces = async (req, res) => {
  try {
    const { venue, latitude, longitude, radius = 5, userLatitude, userLongitude } = req.query;

    const data = await getNearbyPlaces({
      venue,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      radius: parseInt(radius) || 5,
      userLatitude: userLatitude ? parseFloat(userLatitude) : null,
      userLongitude: userLongitude ? parseFloat(userLongitude) : null
    });

    res.json(data);
  } catch (error) {
    console.error("Nearby places error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch nearby places"
    });
  }
};

app.get("/api/nearby-places", handleNearbyPlaces);
app.get("/api/real-nearby-places", handleNearbyPlaces); // Alias for backwards compatibility

// Common places between two users (e.g. BF & GF)
app.post("/api/v1/locations/common-places", async (req, res) => {
  try {
    const { user1, user2, radiusKm = 10, venue } = req.body;

    if (!user1 || !user2 || user1.latitude === undefined || user1.longitude === undefined || user2.latitude === undefined || user2.longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Both user coordinates (user1, user2) are required"
      });
    }

    const u1Lat = parseFloat(user1.latitude);
    const u1Lon = parseFloat(user1.longitude);
    const u2Lat = parseFloat(user2.latitude);
    const u2Lon = parseFloat(user2.longitude);
    const rad = parseInt(radiusKm) || 10;

    const result = await findCommonPlaces(u1Lat, u1Lon, u2Lat, u2Lon, rad, venue);
    res.json(result);
  } catch (error) {
    console.error("Common places error:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to calculate common places"
    });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`\n✅ VELORA OpenStreetMap API Server Running on http://localhost:${PORT}`);
  console.log("📍 GET  /api/nearby-places?venue=CyberHub&radius=5");
  console.log("📍 POST /api/v1/locations/common-places\n");
});

module.exports = app;
