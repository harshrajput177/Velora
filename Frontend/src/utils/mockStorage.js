import { INITIAL_COMPANIONS } from "../constants/initialCompanions";
import { checkProfanity, sanitizeComment } from "./profanityFilter";

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
    paymentMethod: "Direct Cash/UPI in Hand",
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
  },
  {
    id: "BK-7710",
    companionId: "comp-ananya-01",
    companionName: "Ananya",
    companionAge: 24,
    companionPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600",
    companionRate: 699,
    companionArea: "CyberHub / DLF Phase 2",
    date: "2026-10-18",
    time: "18:00",
    durationHours: 2,
    activityName: "Coffee & Evening Walk",
    activityId: "coffee",
    venue: "CyberHub, DLF Phase 2, Gurgaon",
    notes: "Wonderful evening walk and lively chat at Starbucks CyberHub.",
    totalAmount: 1398,
    paymentMethod: "Direct Cash in Hand",
    status: "COMPLETED",
    isRated: false,
    createdAt: "2026-10-16T10:00:00.000Z"
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
  COMPANIONS: "velora_companions",
  SUBSCRIPTION: "velora_subscription",
  REVIEWS: "velora_reviews"
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


/* ====================================================================
   VELORA VIP MEMBERSHIP & CONNECT SUBSCRIPTION
   ==================================================================== */
export const DEFAULT_SUBSCRIPTION = {
  planId: "vip-gold",
  planName: "Velora VIP Connect Pass",
  status: "ACTIVE",
  price: 499,
  billingCycle: "Monthly",
  validUntil: "2026-12-31",
  benefits: [
    "Unlimited Direct Connects with Verified Companions",
    "Zero Platform Fees on Companion Bookings",
    "Pay Companion Directly in Hand (Cash / UPI)",
    "Priority Live Chat & SafeTrack™ GPS Protection",
    "Full Access to Secret Admirers & Mystery Vault"
  ]
};

export const getSubscription = () => {
  return getStored(STORAGE_KEYS.SUBSCRIPTION, DEFAULT_SUBSCRIPTION);
};

export const saveSubscription = (subscriptionData) => {
  setStored(STORAGE_KEYS.SUBSCRIPTION, {
    ...DEFAULT_SUBSCRIPTION,
    ...subscriptionData,
    updatedAt: new Date().toISOString()
  });
  return getSubscription();
};

/* ====================================================================
   VELORA MUTUAL RATINGS & CLEAN REVIEWS SYSTEM
   Both clients and companions have ratings & verified reviews.
   Zero-tolerance for abusive or vulgar comments.
   ==================================================================== */
export const INITIAL_REVIEWS = [
  // Reviews for Ananya (Companion)
  {
    id: "rev-ananya-01",
    targetUserId: "comp-ananya-01",
    targetName: "Ananya",
    authorId: "user-client-01",
    authorName: "Kabir Malhotra",
    authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    authorRole: "CLIENT",
    rating: 5,
    date: "2026-10-19",
    activity: "Coffee Walk & Evening Chat",
    tags: ["Punctual & Polite", "Great Conversationalist", "Warm Vibe"],
    comment: "Had an awesome coffee walk and chat with Ananya at CyberHub! She was extremely polite, punctual, and such an engaging friend. 100% recommended for friendly outings.",
    verifiedMeetup: true,
    status: "APPROVED"
  },
  {
    id: "rev-ananya-02",
    targetUserId: "comp-ananya-01",
    targetName: "Ananya",
    authorId: "user-client-02",
    authorName: "Rohan Sharma",
    authorPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    authorRole: "CLIENT",
    rating: 5,
    date: "2026-10-12",
    activity: "Art Gallery Visit",
    tags: ["Respectful & Safe", "Elegant & Chic"],
    comment: "Ananya accompanied me to a modern art exhibition at India Habitat Centre. Wonderful etiquette and conversation. Made the event much more memorable.",
    verifiedMeetup: true,
    status: "APPROVED"
  },
  {
    id: "rev-ananya-03",
    targetUserId: "comp-ananya-01",
    targetName: "Ananya",
    authorId: "user-client-03",
    authorName: "Aditya Verma",
    authorPhoto: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200",
    authorRole: "CLIENT",
    rating: 5,
    date: "2026-10-05",
    activity: "Dinner Outing",
    tags: ["Warm Vibe", "Punctual & Polite"],
    comment: "Very graceful and warm companion. Punctual and safe meetup. Enjoyed our conversation about startups and books.",
    verifiedMeetup: true,
    status: "APPROVED"
  },

  // Reviews for Tanya (Companion)
  {
    id: "rev-tanya-01",
    targetUserId: "comp-tanya-03",
    targetName: "Tanya",
    authorId: "user-client-01",
    authorName: "Kabir Malhotra",
    authorPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    authorRole: "CLIENT",
    rating: 5,
    date: "2026-10-15",
    activity: "Shopping Companion & Stylist",
    tags: ["Elegant & Chic", "Punctual & Polite"],
    comment: "Tanya has great styling sense and is so patient. She helped me pick out formal attire at DLF Mall of India.",
    verifiedMeetup: true,
    status: "APPROVED"
  },

  // Client Ratings: Reviews received by Client (Kabir Malhotra) from Companions!
  {
    id: "rev-client-01",
    targetUserId: "user-client-01",
    targetName: "Kabir Malhotra",
    authorId: "comp-ananya-01",
    authorName: "Ananya (Companion)",
    authorPhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    authorRole: "COMPANION",
    rating: 5,
    date: "2026-10-19",
    activity: "Coffee Walk & Evening Chat",
    tags: ["Gentleman & Polite", "Always Punctual", "100% Respectful"],
    comment: "Kabir was an absolute gentleman and courteous friend throughout our coffee meetup in CyberHub! Very polite, respectful, and safe. A pleasure to accompany.",
    verifiedMeetup: true,
    status: "APPROVED"
  },
  {
    id: "rev-client-02",
    targetUserId: "user-client-01",
    targetName: "Kabir Malhotra",
    authorId: "comp-tanya-03",
    authorName: "Tanya (Companion)",
    authorPhoto: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200",
    authorRole: "COMPANION",
    rating: 5,
    date: "2026-10-15",
    activity: "Shopping Tour",
    tags: ["100% Respectful", "Trusted Friend", "Always Punctual"],
    comment: "Extremely respectful client. Treated me with total dignity during our shopping tour at DLF Mall. Highly trusted friend on Velora!",
    verifiedMeetup: true,
    status: "APPROVED"
  }
];

export const getAllReviews = () => {
  return getStored(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
};

export const getReviewsForUser = (userId) => {
  if (!userId) return [];
  const reviews = getAllReviews();
  return reviews.filter(
    (r) => (r.targetUserId === userId || r.targetUserId === `comp-${userId}` || (userId.startsWith("comp-") && r.targetUserId === userId)) &&
           r.status === "APPROVED"
  );
};

export const getClientReviews = (clientId = "user-client-01") => {
  const reviews = getAllReviews();
  return reviews.filter(
    (r) => (r.targetUserId === clientId || r.targetUserId === "user-client-01") &&
           r.status === "APPROVED"
  );
};

export const getReviewsStats = (userId) => {
  const reviews = getReviewsForUser(userId);
  if (!reviews || reviews.length === 0) {
    return {
      average: 4.98,
      count: 42,
      breakdown: { 5: 38, 4: 4, 3: 0, 2: 0, 1: 0 },
      topTags: ["Punctual & Polite", "Great Conversationalist", "Respectful & Safe", "Warm Vibe"]
    };
  }

  const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
  const avg = Number((sum / reviews.length).toFixed(2));
  
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const tagCounts = {};

  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 5)));
    breakdown[star] = (breakdown[star] || 0) + 1;
    if (Array.isArray(r.tags)) {
      r.tags.forEach((t) => {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      });
    }
  });

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([t]) => t);

  return {
    average: avg,
    count: reviews.length,
    breakdown,
    topTags: topTags.length > 0 ? topTags : ["Punctual & Polite", "Great Conversationalist", "Respectful & Safe"]
  };
};

export const addReview = ({
  targetUserId,
  targetName = "Companion",
  authorId = "user-client-01",
  authorName = "Kabir Malhotra",
  authorPhoto = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  authorRole = "CLIENT",
  rating = 5,
  tags = [],
  comment = "",
  bookingId = null,
  activity = "Social Outing"
}) => {
  // 1. Strict profanity and abusive language check
  const profanityResult = checkProfanity(comment);
  if (profanityResult.hasProfanity) {
    throw new Error(profanityResult.message);
  }

  // 2. Format & store clean review
  const reviews = getAllReviews();
  const cleanComment = sanitizeComment(comment.trim());
  const newReview = {
    id: "rev-" + Date.now(),
    targetUserId,
    targetName,
    authorId,
    authorName,
    authorPhoto,
    authorRole,
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    tags: Array.isArray(tags) ? tags : [],
    comment: cleanComment,
    bookingId,
    activity,
    verifiedMeetup: true,
    status: "APPROVED",
    date: new Date().toISOString().split("T")[0],
    createdAt: new Date().toISOString()
  };

  const updatedReviews = [newReview, ...reviews];
  setStored(STORAGE_KEYS.REVIEWS, updatedReviews);

  // 3. Mark booking as rated if bookingId is provided
  if (bookingId) {
    const bookings = getBookings();
    const updatedBookings = bookings.map((b) =>
      b.id === bookingId ? { ...b, isRated: true, userRating: newReview.rating } : b
    );
    setStored(STORAGE_KEYS.BOOKINGS, updatedBookings);
  }

  // 4. Update companion rating in stored companions list
  try {
    const companions = getStoredCompanions();
    const compMatch = companions.find((c) => c.userId === targetUserId || c.id === targetUserId);
    if (compMatch) {
      const stats = getReviewsStats(targetUserId);
      const updatedComps = companions.map((c) =>
        c.userId === targetUserId || c.id === targetUserId
          ? { ...c, rating: stats.average, reviewsCount: stats.count }
          : c
      );
      setStored(STORAGE_KEYS.COMPANIONS, updatedComps);
    }
  } catch (err) {
    console.error("Could not update companion stats:", err);
  }

  return newReview;
};

