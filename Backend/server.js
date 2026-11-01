const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Home API
app.get("/", (req, res) => {
  res.send("Express server is running successfully! 🚀");
});

// Test API
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    message: "Users fetched successfully",
    users: [
      { id: 1, name: "Harsh" },
      { id: 2, name: "Rahul" }
    ]
  });
});

// Nearby Places API - Returns restaurants, malls, and hotels near a venue
app.get("/api/nearby-places", (req, res) => {
  const { venue, latitude, longitude, radius = 5 } = req.query;

  // Mock data for nearby places by venue/area
  const nearbyPlacesData = {
    "CyberHub, DLF Phase 2, Gurgaon": {
      lat: 28.4595,
      lng: 77.0593,
      restaurants: [
        { id: 1, name: "Tapas Bar & Grill", type: "Restaurant", rating: 4.5, distance: 0.3, image: "🍽️" },
        { id: 2, name: "The Leela Palace Restaurant", type: "Fine Dining", rating: 4.8, distance: 0.5, image: "🍷" },
        { id: 3, name: "Cafe Coffee Day", type: "Cafe", rating: 4.2, distance: 0.2, image: "☕" },
        { id: 4, name: "Biryani Express", type: "Restaurant", rating: 4.3, distance: 0.6, image: "🍛" }
      ],
      malls: [
        { id: 101, name: "DLF Cyber Hub Mall", type: "Shopping Mall", rating: 4.4, distance: 0.1, image: "🛍️" },
        { id: 102, name: "Galleria Market", type: "Shopping Complex", rating: 4.6, distance: 1.2, image: "🏬" }
      ],
      hotels: [
        { id: 201, name: "The Leela Ambience Delhi", type: "5-Star Hotel", rating: 4.7, distance: 0.8, image: "🏨" },
        { id: 202, name: "Hyatt Regency Delhi", type: "5-Star Hotel", rating: 4.6, distance: 1.5, image: "🏨" }
      ]
    },
    "Khan Market, Central Delhi": {
      lat: 28.5667,
      lng: 77.0175,
      restaurants: [
        { id: 5, name: "The Ivy", type: "Restaurant", rating: 4.6, distance: 0.2, image: "🍽️" },
        { id: 6, name: "Amici", type: "Italian", rating: 4.4, distance: 0.3, image: "🍝" },
        { id: 7, name: "Kaach Niwas", type: "North Indian", rating: 4.3, distance: 0.4, image: "🍛" }
      ],
      malls: [
        { id: 103, name: "Khan Market Shopping", type: "Market", rating: 4.5, distance: 0, image: "🛍️" }
      ],
      hotels: [
        { id: 203, name: "Hotel Delhi Ashok", type: "4-Star Hotel", rating: 4.5, distance: 0.5, image: "🏨" },
        { id: 204, name: "The Ashoka New Delhi", type: "Luxury Hotel", rating: 4.6, distance: 0.6, image: "🏨" }
      ]
    },
    "DLF Mall of India, Sector 18 Noida": {
      lat: 28.5921,
      lng: 77.3758,
      restaurants: [
        { id: 8, name: "Mainland China", type: "Chinese", rating: 4.4, distance: 0.1, image: "🥢" },
        { id: 9, name: "Theobroma", type: "Bakery Cafe", rating: 4.5, distance: 0.2, image: "🍰" },
        { id: 10, name: "Smokeys", type: "BBQ Restaurant", rating: 4.3, distance: 0.3, image: "🍖" }
      ],
      malls: [
        { id: 104, name: "DLF Mall of India", type: "Large Mall", rating: 4.6, distance: 0, image: "🛍️" }
      ],
      hotels: [
        { id: 205, name: "Noida Hilton", type: "5-Star Hotel", rating: 4.5, distance: 0.8, image: "🏨" }
      ]
    }
  };

  // Default to first venue if not found
  const venueKey = Object.keys(nearbyPlacesData).find(key => key.toLowerCase().includes(venue?.toLowerCase() || "cyber"));
  const places = nearbyPlacesData[venueKey] || nearbyPlacesData["CyberHub, DLF Phase 2, Gurgaon"];

  res.json({
    success: true,
    message: "Nearby places fetched successfully",
    venue: venueKey,
    coordinates: { lat: places.lat, lng: places.lng },
    restaurants: places.restaurants,
    malls: places.malls,
    hotels: places.hotels,
    total: places.restaurants.length + places.malls.length + places.hotels.length
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});