import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { useCall } from "../../context/CallContext";
import { FiSend, FiImage, FiZap, FiShield, FiClock, FiAlertCircle, FiArrowLeft } from "react-icons/fi";
import {
  getConversations,
  openOrCreateConversation,
  getMessagesForConvo,
  sendMockMessage
} from "../../utils/mockStorage";
import { INITIAL_COMPANIONS } from "../../constants/initialCompanions";
import "./Messages.css";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
  const callContext = useCall();
  const startCall = callContext?.startCall;

  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isEphemeralMode, setIsEphemeralMode] = useState(false);
  const [viewingMoment, setViewingMoment] = useState(null);
  const [momentCountdown, setMomentCountdown] = useState(10);
  const messagesEndRef = useRef(null);

  const fetchConversations = () => {
    let list = getConversations();
    const paramId = searchParams.get("convo");
    const partnerId = searchParams.get("partnerId") || searchParams.get("userId");

    if (partnerId) {
      let existing = list.find(c => c.partner?.id === partnerId);
      if (existing) {
        setActiveConvo(existing);
        setMobileChatOpen(true);
      } else {
        const comp = INITIAL_COMPANIONS.find(c => (c.userId || c.id) === partnerId) || {
          id: partnerId,
          firstName: "Partner",
          photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500"],
          area: "Delhi NCR"
        };
        const newConvo = openOrCreateConversation(comp);
        list = getConversations();
        setActiveConvo(newConvo);
        setMobileChatOpen(true);
      }
    } else if (paramId) {
      const match = list.find(c => c.id === paramId);
      if (match) {
        setActiveConvo(match);
        setMobileChatOpen(true);
      } else if (list.length > 0) {
        setActiveConvo(list[0]);
      }
    } else if (list.length > 0 && !activeConvo) {
      setActiveConvo(list[0]);
    }
    setConversations(list);
  };

  useEffect(() => { fetchConversations(); }, [searchParams]);

  useEffect(() => {
    if (!activeConvo) return;
    const msgs = getMessagesForConvo(activeConvo.id);
    setMessages(msgs);
  }, [activeConvo?.id]);

  useEffect(() => {
    if (!socket) return;
    const handleMsg = (msg) => {
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      setConversations(getConversations());
    };

    socket.on("chat:receive", handleMsg);
    socket.on("chat:message", handleMsg);
    return () => {
      socket.off("chat:receive", handleMsg);
      socket.off("chat:message", handleMsg);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let timer;
    if (viewingMoment && momentCountdown > 0) {
      timer = setInterval(() => setMomentCountdown(prev => prev - 1), 1000);
    } else if (momentCountdown === 0) {
      setViewingMoment(null);
      setMomentCountdown(10);
    }
    return () => clearInterval(timer);
  }, [viewingMoment, momentCountdown]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvo) return;
    const msgData = {
      conversationId: activeConvo.id,
      senderId: user?.id || "user-1",
      recipientId: activeConvo.partner.id,
      text: inputText,
      mediaType: isEphemeralMode ? "moment" : "text",
      isEphemeral: isEphemeralMode,
      ephemeralDuration: isEphemeralMode ? 10 : 0
    };

    if (socket) {
      socket.emit("chat:send", msgData);
    } else {
      const newMsg = {
        id: "msg-" + Date.now(),
        ...msgData,
        createdAt: new Date().toISOString()
      };
      sendMockMessage(activeConvo.id, newMsg);
      setMessages(prev => [...prev, newMsg]);
      setConversations(getConversations());
    }
    setInputText("");
    setIsEphemeralMode(false);
  };

  const handleSendSampleImage = async (isMoment = false) => {
    if (!activeConvo) return;
    const sampleUrls = [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500"
    ];
    const mediaUrl = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    const msgData = {
      conversationId: activeConvo.id,
      senderId: user?.id || "user-1",
      recipientId: activeConvo.partner.id,
      text: isMoment ? "⚡ Sent a Quick Snap (Moments)" : "📷 Shared a photo",
      mediaUrl,
      mediaType: isMoment ? "moment" : "image",
      isEphemeral: isMoment,
      ephemeralDuration: isMoment ? 10 : 0
    };
    if (socket) {
      socket.emit("chat:send", msgData);
    } else {
      const newMsg = {
        id: "msg-" + Date.now(),
        ...msgData,
        createdAt: new Date().toISOString()
      };
      sendMockMessage(activeConvo.id, newMsg);
      setMessages(prev => [...prev, newMsg]);
      setConversations(getConversations());
    }
  };

  const selectConversation = (convo) => {
    setActiveConvo(convo);
    setMobileChatOpen(true);
  };

  return (
    <div className="messages-page-wrapper">
      <div className="messages-card">
        {/* Conversations Sidebar */}
        <div className={`messages-sidebar ${mobileChatOpen ? "hide-mobile" : ""}`}>
          <div className="sidebar-header">
            <h5 className="sidebar-title">Messages & Moments</h5>
            <small className="sidebar-sub">Real-time encrypted social chat</small>
          </div>
          <div className="conversations-scroll-list">
            {conversations.map(c => {
              const isOnline = onlineUsers?.has(c.partner.id);
              return (
                <div
                  key={c.id}
                  onClick={() => selectConversation(c)}
                  className={`convo-item ${activeConvo?.id === c.id ? "is-active" : ""}`}
                >
                  <div className="convo-avatar-wrap">
                    <img
                      src={c.partner.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                      alt={c.partner.firstName}
                      className="convo-avatar"
                    />
                    {isOnline && <span className="convo-online-dot" />}
                  </div>
                  <div className="convo-text-wrap">
                    <div className="convo-name-row">
                      <h6 className="convo-name">{c.partner.firstName}</h6>
                      <span className="convo-status-text">
                        {isOnline ? "Online" : "Active"}
                      </span>
                    </div>
                    <p className="convo-preview">
                      {c.lastMessage?.text || "Started conversation"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`messages-chat-pane ${!mobileChatOpen ? "hide-mobile" : ""}`}>
          {activeConvo ? (
            <>
              {/* Header */}
              <div className="chat-header">
                <button
                  type="button"
                  className="btn-chat-back d-md-none"
                  onClick={() => setMobileChatOpen(false)}
                  aria-label="Back to messages"
                >
                  <FiArrowLeft size={18} />
                </button>
                <div className="chat-header-user">
                  <img
                    src={activeConvo.partner.photos?.[0] || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt={activeConvo.partner.firstName}
                    className="chat-avatar"
                  />
                  <div className="chat-user-info">
                    <h6 className="chat-user-name">{activeConvo.partner.firstName}</h6>
                    <small className="chat-user-sub">{activeConvo.partner.area || "Delhi NCR"}</small>
                  </div>
                </div>

                <div className="chat-encrypted-pill d-none d-sm-inline-flex">
                  <FiShield size={12} /> SafeTrack™
                </div>
              </div>

              {/* Message List */}
              <div className="chat-messages-container">
                {messages.map(m => {
                  const isMe = m.senderId === (user?.id || "user-1");
                  const isMoment = m.isEphemeral || m.mediaType === "moment";

                  return (
                    <div key={m.id} className={`msg-bubble-wrap ${isMe ? "sent" : "received"}`}>
                      <div className={`msg-bubble ${isMe ? "sent" : "received"}`}>
                        {isMoment ? (
                          <div
                            onClick={() => { setViewingMoment(m); setMomentCountdown(10); }}
                            className="d-flex align-items-center gap-2 cursor-pointer p-2 rounded bg-dark text-white"
                            style={{ cursor: "pointer" }}
                          >
                            <FiZap className="text-warning" size={20} />
                            <div>
                              <div className="fw-bold small">⚡ Quick Snap (Moments)</div>
                              <small className="text-white-50">Tap to view (10s countdown)</small>
                            </div>
                          </div>
                        ) : m.mediaUrl ? (
                          <div>
                            <img src={m.mediaUrl} alt="Media" className="rounded mb-1 w-100" style={{ maxHeight: 200, objectFit: "cover" }} />
                            {m.text && <p className="mb-0">{m.text}</p>}
                          </div>
                        ) : (
                          <p className="mb-0">{m.text}</p>
                        )}
                        <div className="msg-timestamp">
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <button
                  type="button"
                  onClick={() => setIsEphemeralMode(!isEphemeralMode)}
                  className={`btn-moment-toggle ${isEphemeralMode ? "is-active" : ""}`}
                  title="Toggle Snap Moments (Disappearing Message)"
                >
                  <FiZap /> {isEphemeralMode ? "Moment ON" : "Moment"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSendSampleImage(false)}
                  className="btn-chat-media"
                  title="Send Photo"
                >
                  <FiImage size={18} />
                </button>
                <input
                  type="text"
                  placeholder={isEphemeralMode ? "Type ephemeral moment message..." : "Type a message..."}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="chat-input-text"
                />
                <button type="submit" className="btn-chat-send" title="Send message">
                  <FiSend size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty-state">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

      {/* Ephemeral Moments Viewer Modal */}
      {viewingMoment && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: "rgba(0,0,0,0.92)", zIndex: 99999 }}>
          <div className="text-center text-white position-relative" style={{ maxWidth: 400 }}>
            <div className="badge bg-danger fs-6 rounded-pill px-3 py-2 mb-3">
              <FiClock className="me-1" /> Disappearing in {momentCountdown}s
            </div>
            <img
              src={viewingMoment.mediaUrl || "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600"}
              alt="Moment"
              className="rounded-4 shadow-lg w-100 mb-3"
              style={{ maxHeight: 450, objectFit: "cover" }}
            />
            <p className="small text-white-50 d-flex align-items-center justify-content-center gap-1">
              <FiAlertCircle /> Screen capture events are reported for user safety.
            </p>
            <button onClick={() => setViewingMoment(null)} className="btn btn-light rounded-pill px-4 fw-bold">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
