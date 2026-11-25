// Simple in-memory cache with TTL
class Cache {
  constructor(ttlSeconds = 300) {
    this.store = new Map();
    this.ttl = ttlSeconds * 1000; // Convert to milliseconds
  }

  generateKey(user1Lat, user1Lng, user2Lat, user2Lng, radius) {
    // Round to 4 decimal places to create a cache key
    const key = `${Math.round(user1Lat * 10000)}-${Math.round(user1Lng * 10000)}-${Math.round(user2Lat * 10000)}-${Math.round(user2Lng * 10000)}-${radius}`;
    return key;
  }

  set(key, value) {
    this.store.set(key, {
      value,
      timestamp: Date.now()
    });
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > this.ttl) {
      this.store.delete(key);
      return null;
    }

    return item.value;
  }

  clear() {
    this.store.clear();
  }

  // Clean up expired items
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now - item.timestamp > this.ttl) {
        this.store.delete(key);
      }
    }
  }
}

// Create singleton instance (5 minute TTL)
const placeCache = new Cache(300);

module.exports = { Cache, placeCache };
