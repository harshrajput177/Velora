import { INITIAL_COMPANIONS } from "../constants/initialCompanions";

const DEFAULT_USER = {
  id: "user-client-01",
  email: "kabir@example.com",
  role: "CLIENT",
  identityVerified: true,
  createdAt: "2026-01-15T10:00:00.000Z"
};

const DEFAULT_PROFILE = {
  userId: "user-client-01",
  firstName: "Kabir",
  lastName: "Malhotra",
  age: 27,
  gender: "MALE",
  city: "Gurgaon",
  area: "Golf Course Road",
  bio: "Tech entrepreneur in CyberCity. Looking for polished, delightful companions for dinner walks, cafe dates, and weekend events.",
  occupation: "Founder & Product Lead",
  hourlyRate: 0,
  availableNow: true,
  interests: ["Coffee", "Startups", "Fine Dining", "Travel", "Books"],
  photos: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"
  ]
};

const DEFAULT_WALLET = {
  balance: 8500,
  escrowLocked: 1200,
  currency: "INR"
};

const INITIAL_BOOKINGS = [
  {
    id: "BK-9842",
    companionId: "comp-ananya-01",
    companionName: "Ananya",
    companionAge: 24,
    companionPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
    companionRate: 699,
    companionArea: "CyberHub / DLF Phase 2",
    date: "2026-10-24",
    time: "19:00",
    durationHours: 2,
    activityName: "Romantic Fine Dining",
    activityId: "dinner",
    venue: "CyberHub, DLF Phase 2, Gurgaon",
    notes: "Outdoor seating at Cafe Delhi Heights. Casual chic attire.",
    totalAmount: 1547,
    paymentMethod: "Velora Escrow Wallet",
    status: "CONFIRMED",
    createdAt: "2026-10-20T12:00:00.000Z"
  },
  {
    id: "BK-8821",
    companionId: "comp-tanya-03",
    companionName: "Tanya",
    companionAge: 23,
    companionPhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600",
    companionRate: 799,
    companionArea: "Sector 18 (DLF Mall)",
    date: "2026-10-26",
    time: "16:00",
    durationHours: 3,
    activityName: "Shopping Companion & Stylist",
    activityId: "shopping",
    venue: "DLF Mall of India, Noida",
    notes: "Need guidance picking formal suits and party wear.",
    totalAmount: 2546,
    paymentMethod: "UPI Instant",
    status: "CONFIRMED",
    createdAt: "2026-10-21T09:30:00.000Z"
  }
];

const INITIAL_DATES = [
  {
    id: "DATE-102",
    recipientId: "comp-ananya-01",
    partner: {
      id: "comp-ananya-01",
      firstName: "Ananya",
      area: "CyberHub Gurgaon",
      photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"]
    },
    activity: "Coffee & Cafe",
    venue: "Blue Tokai Coffee Roasters, CyberHub",
    date: "2026-10-23",
    time: "18:30",
    status: "ACCEPTED",
    notes: "Quick evening iced latte and book recommendations."
  },
  {
    id: "DATE-105",
    recipientId: "comp-meera-04",
    partner: {
      id: "comp-meera-04",
      firstName: "Meera",
      area: "Saket (Select Citywalk)",
      photos: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600"]
    },
    activity: "Night Walk & Talk",
    venue: "Lodhi Art District / Garden",
    date: "2026-10-27",
    time: "20:00",
    status: "REQUESTED",
    notes: "Peaceful evening stroll after a busy work week."
  }
];

const INITIAL_MATCHES = [
  {
    matchId: "m-1",
    user: {
      id: "comp-ananya-01",
      firstName: "Ananya",
      age: 24,
      city: "Gurgaon",
      area: "CyberHub / DLF Phase 2",
      photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"]
    }
  },
  {
    matchId: "m-2",
    user: {
      id: "comp-tanya-03",
      firstName: "Tanya",
      age: 23,
      city: "Noida",
      area: "Sector 18 (DLF Mall)",
      photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600"]
    }
  },
  {
    matchId: "m-3",
    user: {
      id: "comp-zoya-05",
      firstName: "Zoya",
      age: 26,
      city: "Delhi",
      area: "Aerocity / Vasant Kunj",
      photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600"]
    }
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: "convo-1",
    partner: {
      id: "comp-ananya-01",
      firstName: "Ananya",
      photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600"],
      area: "CyberHub Gurgaon"
    },
    lastMessage: {
      text: "Hey Kabir! Excited to meet for coffee at CyberHub! 😊",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    unreadCount: 1
  },
  {
    id: "convo-2",
    partner: {
      id: "comp-tanya-03",
      firstName: "Tanya",
      photos: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600"],
      area: "Sector 18 Noida"
    },
    lastMessage: {
      text: "See you this weekend at DLF Mall of India! ✨",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    unreadCount: 0
  }
];

const INITIAL_MESSAGES_MAP = {
  "convo-1": [
    {
      id: "m-101",
      senderId: "comp-ananya-01",
      text: "Hi Kabir! Welcome to Velora. Thanks for liking my profile!",
      createdAt: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: "m-102",
      senderId: "user-client-01",
      text: "Hi Ananya! Loved your bio and cafe recommendations. Would love to plan a visit to CyberHub.",
      createdAt: new Date(Date.now() - 5400000).toISOString()
    },
    {
      id: "m-103",
      senderId: "comp-ananya-01",
      text: "Hey Kabir! Excited to meet for coffee at CyberHub! 😊 Let me know what time works best for you.",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  "convo-2": [
    {
      id: "m-201",
      senderId: "comp-tanya-03",
      text: "Hello Kabir! Looking for some styling assistance or shopping companion?",
      createdAt: new Date(Date.now() - 90000000).toISOString()
    },
    {
      id: "m-202",
      senderId: "user-client-01",
      text: "Yes Tanya! Need to pick outfits for an upcoming conference.",
      createdAt: new Date(Date.now() - 88000000).toISOString()
    },
    {
      id: "m-203",
      senderId: "comp-tanya-03",
      text: "See you this weekend at DLF Mall of India! ✨ We'll find some amazing pieces.",
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]
};

const INITIAL_CONTACTS = [
  {
    id: "c-1",
    name: "Aman Sharma (Emergency Contact)",
    phone: "+91 98765 43210",
    relation: "Brother"
  },
  {
    id: "c-2",
    name: "Delhi Police Helpline",
    phone: "112",
    relation: "Police Assistance"
  },
  {
    id: "c-3",
    name: "National Women Helpline",
    phone: "1091",
    relation: "Helpline"
  }
];

export const getStored = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Storage write error:", err);
  }
};

// Storage keys
export const STORAGE_KEYS = {
  USER: "velora_user",
  PROFILE: "velora_profile",
  WALLET: "velora_wallet",
  TOKEN: "companion_token",
  BOOKINGS: "velora_bookings",
  DATES: "velora_dates",
  MATCHES: "velora_matches",
  CONVERSATIONS: "velora_conversations",
  MESSAGES: "velora_messages_",
  CONTACTS: "velora_contacts",
  ACTIVE_SESSION: "velora_active_session",
  VERIFICATION: "velora_verification",
  COMPANIONS: "velora_companions"
};

const DEFAULT_VIDEOS = [
  {
    id: "vid-1",
    title: "Greeting & Aesthetic Vibe",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: "vid-2",
    title: "Cafe Walk & Outing Reel",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  }
];

// Initialization helper to ensure clean first load
export const initializeMockDatabase = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WALLET)) {
    localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(DEFAULT_WALLET));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(INITIAL_BOOKINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DATES)) {
    localStorage.setItem(STORAGE_KEYS.DATES, JSON.stringify(INITIAL_DATES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MATCHES)) {
    localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(INITIAL_MATCHES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CONTACTS)) {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(INITIAL_CONTACTS));
  }
  Object.entries(INITIAL_MESSAGES_MAP).forEach(([convoId, msgs]) => {
    const key = STORAGE_KEYS.MESSAGES + convoId;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(msgs));
    }
  });
};

export const getBookings = () => getStored(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);

export const saveBooking = (newBooking) => {
  const current = getBookings();
  const updated = [newBooking, ...current];
  setStored(STORAGE_KEYS.BOOKINGS, updated);
  return updated;
};

export const cancelBooking = (bookingId) => {
  const current = getBookings();
  const updated = current.map(b => b.id === bookingId ? { ...b, status: "CANCELLED" } : b);
  setStored(STORAGE_KEYS.BOOKINGS, updated);
  return updated;
};

export const getDates = () => getStored(STORAGE_KEYS.DATES, INITIAL_DATES);

export const saveDate = (newDate) => {
  const current = getDates();
  const updated = [newDate, ...current];
  setStored(STORAGE_KEYS.DATES, updated);
  return updated;
};

export const updateDateStatus = (dateId, status) => {
  const current = getDates();
  const updated = current.map(d => d.id === dateId ? { ...d, status } : d);
  setStored(STORAGE_KEYS.DATES, updated);
  return updated;
};

export const getMatches = () => getStored(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);

export const addMatch = (companion) => {
  const current = getMatches();
  const exists = current.find(m => m.user.id === (companion.userId || companion.id));
  if (!exists) {
    const newMatch = {
      matchId: "m-" + Date.now(),
      user: {
        id: companion.userId || companion.id,
        firstName: companion.firstName,
        age: companion.age,
        city: companion.city,
        area: companion.area,
        photos: companion.photos || []
      }
    };
    const updated = [newMatch, ...current];
    setStored(STORAGE_KEYS.MATCHES, updated);
    return { isMatch: true, list: updated };
  }
  return { isMatch: true, list: current };
};

export const getConversations = () => getStored(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);

export const openOrCreateConversation = (partner) => {
  const current = getConversations();
  const partnerId = partner.userId || partner.id;
  let existing = current.find(c => c.partner?.id === partnerId);
  if (!existing) {
    existing = {
      id: "convo-" + Date.now(),
      partner: {
        id: partnerId,
        firstName: partner.firstName,
        photos: partner.photos || [],
        area: partner.area || partner.city || "Delhi NCR"
      },
      lastMessage: {
        text: "Hi! Started a new conversation.",
        createdAt: new Date().toISOString()
      },
      unreadCount: 0
    };
    const updated = [existing, ...current];
    setStored(STORAGE_KEYS.CONVERSATIONS, updated);
    // initialize messages
    setStored(STORAGE_KEYS.MESSAGES + existing.id, [
      {
        id: "msg-" + Date.now(),
        senderId: partnerId,
        text: `Hi there! I am ${partner.firstName}. Looking forward to connecting with you on Velora! ✨`,
        createdAt: new Date().toISOString()
      }
    ]);
    return existing;
  }
  return existing;
};

export const getMessagesForConvo = (convoId) => {
  return getStored(STORAGE_KEYS.MESSAGES + convoId, []);
};

export const sendMockMessage = (convoId, message) => {
  const msgs = getMessagesForConvo(convoId);
  const updated = [...msgs, message];
  setStored(STORAGE_KEYS.MESSAGES + convoId, updated);

  // Also update conversation preview
  const convos = getConversations();
  const convosUpdated = convos.map(c => {
    if (c.id === convoId) {
      return {
        ...c,
        lastMessage: {
          text: message.text,
          createdAt: message.createdAt
        }
      };
    }
    return c;
  });
  setStored(STORAGE_KEYS.CONVERSATIONS, convosUpdated);
  return updated;
};

export const syncProfileToCompanions = (updatedProfile) => {
  const companions = getStoredCompanions();
  const userId = updatedProfile.userId || updatedProfile.id;
  const exists = companions.some(c => c.userId === userId || c.id === userId);
  if (exists) {
    const updated = companions.map(c => {
      if (c.userId === userId || c.id === userId) {
        return {
          ...c,
          ...updatedProfile,
          photos: updatedProfile.photos || c.photos,
          videos: updatedProfile.videos || c.videos
        };
      }
      return c;
    });
    setStored(STORAGE_KEYS.COMPANIONS, updated);
  }
};

export const getStoredCompanions = () => {
  const seeded = INITIAL_COMPANIONS.map((c, i) => ({
    ...c,
    videos: c.videos && c.videos.length > 0 ? c.videos : DEFAULT_VIDEOS
  }));
  return getStored(STORAGE_KEYS.COMPANIONS, seeded);
};

export const getCompanionById = (id) => {
  const companions = getStoredCompanions();
  return companions.find(c => (c.userId === id || c.id === id)) || null;
};

export const addPhotoToCompanion = (id, photoUrl) => {
  const companions = getStoredCompanions();
  const updated = companions.map(c => {
    if (c.userId === id || c.id === id) {
      const photos = c.photos ? [...c.photos, photoUrl] : [photoUrl];
      return { ...c, photos };
    }
    return c;
  });
  setStored(STORAGE_KEYS.COMPANIONS, updated);
  return updated.find(c => (c.userId === id || c.id === id));
};

export const deletePhotoFromCompanion = (id, photoIndex) => {
  const companions = getStoredCompanions();
  const updated = companions.map(c => {
    if (c.userId === id || c.id === id) {
      const photos = c.photos ? c.photos.filter((_, idx) => idx !== photoIndex) : [];
      return { ...c, photos };
    }
    return c;
  });
  setStored(STORAGE_KEYS.COMPANIONS, updated);
  return updated.find(c => (c.userId === id || c.id === id));
};

export const addVideoToCompanion = (id, videoData) => {
  const companions = getStoredCompanions();
  const updated = companions.map(c => {
    if (c.userId === id || c.id === id) {
      const newVideo = {
        id: "vid-" + Date.now(),
        title: videoData.title || "User Clip",
        url: videoData.url
      };
      const videos = c.videos ? [...c.videos, newVideo] : [newVideo];
      return { ...c, videos };
    }
    return c;
  });
  setStored(STORAGE_KEYS.COMPANIONS, updated);
  return updated.find(c => (c.userId === id || c.id === id));
};

export const deleteVideoFromCompanion = (id, videoId) => {
  const companions = getStoredCompanions();
  const updated = companions.map(c => {
    if (c.userId === id || c.id === id) {
      const videos = c.videos ? c.videos.filter(v => v.id !== videoId) : [];
      return { ...c, videos };
    }
    return c;
  });
  setStored(STORAGE_KEYS.COMPANIONS, updated);
  return updated.find(c => (c.userId === id || c.id === id));
};
