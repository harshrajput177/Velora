import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { sendMockMessage, getStored, setStored, STORAGE_KEYS } from "../utils/mockStorage";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();

  // Mock online users in Delhi NCR
  const [onlineUsers, setOnlineUsers] = useState(
    new Set([
      "comp-ananya-01",
      "comp-tanya-03",
      "comp-meera-04",
      "comp-aryan-02",
      "comp-kabir-05"
    ])
  );

  const [liveNotifications, setLiveNotifications] = useState([
    {
      id: "n-1",
      title: "Ananya viewed your profile",
      time: "5m ago",
      type: "view"
    }
  ]);

  // Create client-side mock socket
  const mockSocket = useMemo(() => {
    const listeners = {};

    return {
      connected: true,
      on: (event, callback) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback);
      },
      off: (event, callback) => {
        if (!listeners[event]) return;
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      },
      emit: (event, data) => {
        if (event === "chat:send" && data) {
          // Echo sent message back to listeners
          const newMsg = {
            id: "msg-" + Date.now(),
            senderId: data.senderId || user?.id || "user-client-01",
            recipientId: data.recipientId,
            text: data.text,
            mediaUrl: data.mediaUrl,
            mediaType: data.mediaType,
            isEphemeral: data.isEphemeral,
            ephemeralDuration: data.ephemeralDuration,
            createdAt: new Date().toISOString()
          };

          if (data.conversationId) {
            sendMockMessage(data.conversationId, newMsg);
          }

          if (listeners["chat:receive"]) {
            listeners["chat:receive"].forEach(cb => cb(newMsg));
          }

          // Companion friendly automated response after 1.5 seconds
          if (data.recipientId && data.conversationId) {
            setTimeout(() => {
              const replies = [
                "That sounds wonderful! Looking forward to it 😊",
                "I'm free around that time! Let's definitely do this. ✨",
                "Great! Blue Tokai / CyberHub is one of my favorite spots.",
                "Awesome! See you soon. Take care! ❤️",
                "Sounds like a plan! Let me know if you need any styling or venue tips."
              ];
              const replyText = replies[Math.floor(Math.random() * replies.length)];
              const companionMsg = {
                id: "msg-reply-" + Date.now(),
                senderId: data.recipientId,
                recipientId: data.senderId,
                text: replyText,
                createdAt: new Date().toISOString()
              };
              sendMockMessage(data.conversationId, companionMsg);
              if (listeners["chat:receive"]) {
                listeners["chat:receive"].forEach(cb => cb(companionMsg));
              }
            }, 1400);
          }
        }
      },
      disconnect: () => {}
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket: mockSocket, onlineUsers, liveNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
