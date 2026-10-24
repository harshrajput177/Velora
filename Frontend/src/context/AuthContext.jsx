import React, { createContext, useContext, useState, useEffect } from "react";
import {
  initializeMockDatabase,
  getStored,
  setStored,
  STORAGE_KEYS
} from "../utils/mockStorage";

const AuthContext = createContext(null);

const DEMO_ACCOUNTS = {
  client: {
    user: {
      id: "user-client-01",
      email: "kabir@example.com",
      role: "CLIENT",
      identityVerified: true,
      createdAt: "2026-01-15T10:00:00.000Z"
    },
    profile: {
      userId: "user-client-01",
      firstName: "Kabir",
      lastName: "Malhotra",
      age: 27,
      gender: "MALE",
      city: "Gurgaon",
      area: "Golf Course Road",
      bio: "Tech entrepreneur in CyberCity. Looking for polished, fun companions for dinner walks, cafe dates, and weekend events.",
      occupation: "Founder & Product Lead",
      hourlyRate: 0,
      availableNow: true,
      interests: ["Coffee", "Startups", "Fine Dining", "Travel"],
      photos: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"
      ]
    },
    wallet: {
      balance: 8500,
      escrowLocked: 1200,
      currency: "INR"
    }
  },
  companion: {
    user: {
      id: "comp-ananya-01",
      email: "ananya@example.com",
      role: "COMPANION",
      identityVerified: true,
      createdAt: "2026-02-10T10:00:00.000Z"
    },
    profile: {
      userId: "comp-ananya-01",
      firstName: "Ananya",
      lastName: "Roy",
      age: 24,
      gender: "FEMALE",
      city: "Gurgaon",
      area: "CyberHub / DLF Phase 2",
      bio: "Warm, empathetic and a passionate cafe connoisseur. I love walking around DLF Phase 2, exploring rooftop dinners, and giving great aesthetic advice while shopping!",
      occupation: "Architect & Cafe Connoisseur",
      hourlyRate: 699,
      availableNow: true,
      interests: ["Coffee", "Art", "Shopping", "Architecture", "Night Walks"],
      photos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80"
      ]
    },
    wallet: {
      balance: 48500,
      escrowLocked: 2097,
      currency: "INR"
    }
  },
  admin: {
    user: {
      id: "admin-velora-01",
      email: "admin@velora.in",
      role: "ADMIN",
      identityVerified: true,
      createdAt: "2026-01-01T10:00:00.000Z"
    },
    profile: {
      userId: "admin-velora-01",
      firstName: "Velora",
      lastName: "Admin",
      age: 32,
      gender: "OTHER",
      city: "Delhi",
      area: "Connaught Place",
      bio: "Velora Platform Safety, Compliance & Concierge Desk",
      occupation: "Compliance Director",
      hourlyRate: 0,
      availableNow: true,
      photos: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
      ]
    },
    wallet: {
      balance: 150000,
      escrowLocked: 14500,
      currency: "INR"
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure mock DB is initialized
    initializeMockDatabase();

    const storedUser = getStored(STORAGE_KEYS.USER, DEMO_ACCOUNTS.client.user);
    const storedProfile = getStored(STORAGE_KEYS.PROFILE, DEMO_ACCOUNTS.client.profile);
    const storedWallet = getStored(STORAGE_KEYS.WALLET, DEMO_ACCOUNTS.client.wallet);

    setUser(storedUser);
    setProfile(storedProfile);
    setWallet(storedWallet);
    setLoading(false);
  }, []);

  const login = async (loginId, password) => {
    // Check if logging in as companion or admin or client
    let account = DEMO_ACCOUNTS.client;
    if (loginId.toLowerCase().includes("ananya") || loginId.toLowerCase().includes("companion")) {
      account = DEMO_ACCOUNTS.companion;
    } else if (loginId.toLowerCase().includes("admin")) {
      account = DEMO_ACCOUNTS.admin;
    } else {
      // Dynamic client with provided email/name
      account = {
        user: {
          ...DEMO_ACCOUNTS.client.user,
          email: loginId
        },
        profile: {
          ...DEMO_ACCOUNTS.client.profile,
          firstName: loginId.split("@")[0].charAt(0).toUpperCase() + loginId.split("@")[0].slice(1)
        },
        wallet: DEMO_ACCOUNTS.client.wallet
      };
    }

    setStored(STORAGE_KEYS.USER, account.user);
    setStored(STORAGE_KEYS.PROFILE, account.profile);
    setStored(STORAGE_KEYS.WALLET, account.wallet);
    setStored(STORAGE_KEYS.TOKEN, "mock-jwt-token-" + Date.now());

    setUser(account.user);
    setProfile(account.profile);
    setWallet(account.wallet);

    return { user: account.user, profile: account.profile };
  };

  const register = async (formData) => {
    const newUser = {
      id: "user-" + Date.now(),
      email: formData.email || "member@example.com",
      role: formData.role || "CLIENT",
      identityVerified: true,
      createdAt: new Date().toISOString()
    };

    const newProfile = {
      userId: newUser.id,
      firstName: formData.firstName || "Member",
      lastName: formData.lastName || "",
      age: Number(formData.age) || 24,
      gender: formData.gender || "MALE",
      city: formData.city || "Delhi NCR",
      area: formData.area || "Connaught Place",
      bio: formData.bio || "Velora member.",
      occupation: formData.occupation || "Professional",
      hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : 0,
      availableNow: true,
      interests: formData.interests || ["Coffee", "Dining", "Walks"],
      photos: formData.photos?.length ? formData.photos : [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"
      ]
    };

    const newWallet = {
      balance: 5000,
      escrowLocked: 0,
      currency: "INR"
    };

    setStored(STORAGE_KEYS.USER, newUser);
    setStored(STORAGE_KEYS.PROFILE, newProfile);
    setStored(STORAGE_KEYS.WALLET, newWallet);
    setStored(STORAGE_KEYS.TOKEN, "mock-jwt-token-" + Date.now());

    setUser(newUser);
    setProfile(newProfile);
    setWallet(newWallet);

    return { user: newUser, profile: newProfile };
  };

  const loginDemoUser = async (role = "client") => {
    const account = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.client;
    setStored(STORAGE_KEYS.USER, account.user);
    setStored(STORAGE_KEYS.PROFILE, account.profile);
    setStored(STORAGE_KEYS.WALLET, account.wallet);
    setStored(STORAGE_KEYS.TOKEN, "mock-jwt-token-" + Date.now());

    setUser(account.user);
    setProfile(account.profile);
    setWallet(account.wallet);

    return { user: account.user, profile: account.profile };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.WALLET);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setUser(null);
    setProfile(null);
    setWallet(null);
  };

  const updateProfileState = (updatedProfile) => {
    const merged = { ...profile, ...updatedProfile };
    setStored(STORAGE_KEYS.PROFILE, merged);
    setProfile(merged);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      wallet,
      loading,
      login,
      register,
      loginDemoUser,
      logout,
      updateProfileState,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
