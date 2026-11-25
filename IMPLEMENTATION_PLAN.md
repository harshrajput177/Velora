# VELORA - Real-time Couple Common Nearby Places System

## Implementation Plan

### Phase 1: Backend Setup
1. **Create `/api/services/locationService.js`** - Haversine + Overpass API
2. **Create `/api/services/placeService.js`** - Place filtering + caching
3. **Update `/Backend/server.js`** - Add endpoints
4. **Endpoints:**
   - `POST /api/v1/locations/common-places` - Main endpoint
   - `GET /api/v1/locations/validate` - Location validation

### Phase 2: Frontend Services
1. **Create `/Frontend/src/services/locationService.js`** - Geolocation + API calls
2. **Create `/Frontend/src/services/placeService.js`** - Place filtering logic
3. **Create `/Frontend/src/hooks/useLocation.js`** - Location hook

### Phase 3: Frontend Components
1. **Create `/Frontend/src/components/booking/LocationSelector.jsx`** - Capture both locations
2. **Update `/Frontend/src/components/nearby/CommonPlaces.jsx`** - Show real places
3. **Update `CompanionBookingModal.jsx`** - Integrate location flow

### Phase 4: Testing
1. Test with real coordinates
2. Verify Overpass API integration
3. Test distance calculations
4. Test error handling

---

## Files to Create/Modify

### Create:
- `Backend/services/locationService.js`
- `Backend/services/placeService.js`
- `Backend/utils/cache.js`
- `Frontend/src/services/locationService.js`
- `Frontend/src/services/placeService.js`
- `Frontend/src/hooks/useLocation.js`
- `Frontend/src/components/booking/LocationSelector.jsx`
- `Frontend/src/components/nearby/CommonPlaces.jsx`

### Modify:
- `Backend/server.js` - Add routes
- `CompanionBookingModal.jsx` - Integrate locations
- `Frontend/package.json` - If needed

---

## Key Features
✅ Real Overpass API integration
✅ Haversine distance calculation
✅ Both users' location capture
✅ Common meeting places
✅ Separate + average distances
✅ Caching for performance
✅ Error handling (NO mock fallback on error)
✅ Multiple categories
✅ Sorted by convenience

