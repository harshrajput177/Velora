import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";

import {
  FiSend,
  FiImage,
  FiZap,
  FiShield,
  FiClock,
  FiAlertCircle,
  FiArrowLeft,
  FiSearch,
  FiX,
  FiMessageCircle
} from "react-icons/fi";
import {
  getConversations,
  openOrCreateConversation,
  getMessagesForConvo,
  sendMockMessage
} from "../../utils/mockStorage";
import { INITIAL_COMPANIONS } from "../../constants/initialCompanions";
import "./Messages.css";

const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200";

const sameDay = (a, b) => a.toDateString() === b.toDateString();

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDayLabel = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, now)) return "Today";
  if (sameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const formatListTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (sameDay(d, new Date())) return formatTime(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const Messages = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocket();
 

  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isEphemeralMode, setIsEphemeralMode] = useState(false);
  const [viewingMoment, setViewingMoment] = useState(null);
  const [momentCountdown, setMomentCountdown] = useState(10);
  const [query, setQuery] = useState("");
  const messagesEndRef = useRef(null);

  const myId = user?.id || "user-1";

  const fetchConversations = () => {
    let list = getConversations();
    const paramId = searchParams.get("convo");
    const partnerId = searchParams.get("partnerId") || searchParams.get("userId");

    if (partnerId) {
      let existing = list.find((c) => c.partner?.id === partnerId);
      if (existing) {
        setActiveConvo(existing);
        setMobileChatOpen(true);
      } else {
        const comp = INITIAL_COMPANIONS.find((c) => (c.userId || c.id) === partnerId) || {
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
      const match = list.find((c) => c.id === paramId);
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

  useEffect(() => {
    fetchConversations();
  }, [searchParams]);

  useEffect(() => {
    if (!activeConvo) return;
    setMessages(getMessagesForConvo(activeConvo.id));
  }, [activeConvo?.id]);

  useEffect(() => {
    if (!socket) return;
    const handleMsg = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
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
  }, [messages, activeConvo?.id]);

  useEffect(() => {
    let timer;
    if (viewingMoment && momentCountdown > 0) {
      timer = setInterval(() => setMomentCountdown((prev) => prev - 1), 1000);
    } else if (momentCountdown === 0) {
      setViewingMoment(null);
      setMomentCountdown(10);
    }
    return () => clearInterval(timer);
  }, [viewingMoment, momentCountdown]);

  // Close the moment viewer with Escape
  useEffect(() => {
    if (!viewingMoment) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closeMoment();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [viewingMoment]);

  const closeMoment = () => {
    setViewingMoment(null);
    setMomentCountdown(10);
  };

  const dispatchMessage = (msgData) => {
    if (socket) {
      socket.emit("chat:send", msgData);
    } else {
      const newMsg = {
        id: "msg-" + Date.now(),
        ...msgData,
        createdAt: new Date().toISOString()
      };
      sendMockMessage(activeConvo.id, newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setConversations(getConversations());
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvo) return;
    dispatchMessage({
      conversationId: activeConvo.id,
      senderId: myId,
      recipientId: activeConvo.partner.id,
      text: inputText,
      mediaType: isEphemeralMode ? "moment" : "text",
      isEphemeral: isEphemeralMode,
      ephemeralDuration: isEphemeralMode ? 10 : 0
    });
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
    dispatchMessage({
      conversationId: activeConvo.id,
      senderId: myId,
      recipientId: activeConvo.partner.id,
      text: isMoment ? "⚡ Sent a Quick Snap (Moments)" : "📷 Shared a photo",
      mediaUrl,
      mediaType: isMoment ? "moment" : "image",
      isEphemeral: isMoment,
      ephemeralDuration: isMoment ? 10 : 0
    });
  };

  const selectConversation = (convo) => {
    setActiveConvo(convo);
    setMobileChatOpen(true);
  };

  const filteredConvos = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => (c.partner?.firstName || "").toLowerCase().includes(q));
  }, [conversations, query]);

  const activeOnline = activeConvo ? onlineUsers?.has(activeConvo.partner.id) : false;

  return (
    <div className="ms-page">
      <div className="ms-card">
        {/* ---------- Conversation list ---------- */}
        <aside className={`ms-sidebar ${mobileChatOpen ? "is-hidden-mobile" : ""}`}>
          <div className="ms-sidebar-head">
            {/* Mobile navigation shortcuts to easily return to Home or Discover */}
            <div className="ms-sidebar-mobile-bar d-flex d-md-none align-items-center justify-content-between mb-2">
              <Link to="/" className="ms-back-home-link">
                <FiArrowLeft size={15} /> Back to Home
              </Link>
              <Link to="/discover" className="ms-back-discover-link">
                Discover →
              </Link>
            </div>
            <h1 className="ms-sidebar-title">Messages</h1>
            <p className="ms-sidebar-sub">Private, encrypted chats with your companions</p>
            <div className="ms-search">
              <FiSearch size={16} />
              <input
                type="search"
                placeholder="Search conversations"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search conversations"
              />
            </div>
          </div>

          <ul className="ms-convo-list">
            {filteredConvos.length === 0 && (
              <li className="ms-list-empty">
                {conversations.length === 0
                  ? "No conversations yet. Book a companion to start chatting."
                  : "No conversations match your search."}
              </li>
            )}
            {filteredConvos.map((c) => {
              const isOnline = onlineUsers?.has(c.partner.id);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => selectConversation(c)}
                    className={`ms-convo ${activeConvo?.id === c.id ? "is-active" : ""}`}
                  >
                    <span className="ms-avatar-wrap">
                      <img
                        src={c.partner.photos?.[0] || FALLBACK_PHOTO}
                        alt=""
                        className="ms-avatar"
                      />
                      {isOnline && <span className="ms-online-dot" aria-label="Online" />}
                    </span>
                    <span className="ms-convo-text">
                      <span className="ms-convo-row">
                        <span className="ms-convo-name">{c.partner.firstName}</span>
                        <span className="ms-convo-time">
                          {isOnline ? "Online" : formatListTime(c.lastMessage?.createdAt)}
                        </span>
                      </span>
                      <span className="ms-convo-preview">
                        {c.lastMessage?.text || "Say hello to start the conversation"}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ---------- Chat pane ---------- */}
        <section className={`ms-chat ${!mobileChatOpen ? "is-hidden-mobile" : ""}`}>
          {activeConvo ? (
            <>
              <header className="ms-chat-head">
                <button
                  type="button"
                  className="ms-back"
                  onClick={() => setMobileChatOpen(false)}
                  aria-label="Back to messages"
                >
                  <FiArrowLeft size={20} />
                </button>
                <span className="ms-avatar-wrap">
                  <img
                    src={activeConvo.partner.photos?.[0] || FALLBACK_PHOTO}
                    alt=""
                    className="ms-avatar ms-avatar-sm"
                  />
                  {activeOnline && <span className="ms-online-dot" aria-label="Online" />}
                </span>
                <div className="ms-chat-user">
                  <h2 className="ms-chat-name">{activeConvo.partner.firstName}</h2>
                  <span className="ms-chat-sub">
                    {activeOnline ? "Online now" : activeConvo.partner.area || "Delhi NCR"}
                  </span>
                </div>
                <span className="ms-safe-pill" title="Your chats are protected by SafeTrack">
                  <FiShield size={13} /> SafeTrack
                </span>
              </header>

              <div className="ms-thread">
                {messages.length === 0 && (
                  <div className="ms-thread-empty">
                    <FiMessageCircle size={26} />
                    <p>No messages yet. Say hi to {activeConvo.partner.firstName}!</p>
                  </div>
                )}

                {messages.map((m, idx) => {
                  const isMe = m.senderId === myId;
                  const isMoment = m.isEphemeral || m.mediaType === "moment";
                  const prev = messages[idx - 1];
                  const showDay = !prev || !sameDay(new Date(prev.createdAt), new Date(m.createdAt));
                  const grouped = prev && !showDay && prev.senderId === m.senderId;

                  return (
                    <React.Fragment key={m.id}>
                      {showDay && (
                        <div className="ms-day">
                          <span>{formatDayLabel(m.createdAt)}</span>
                        </div>
                      )}
                      <div
                        className={`ms-row ${isMe ? "is-sent" : "is-received"} ${
                          grouped ? "is-grouped" : ""
                        }`}
                      >
                        <div className={`ms-bubble ${isMe ? "is-sent" : "is-received"}`}>
                          {isMoment ? (
                            <button
                              type="button"
                              className="ms-moment"
                              onClick={() => {
                                setViewingMoment(m);
                                setMomentCountdown(10);
                              }}
                            >
                              <span className="ms-moment-icon">
                                <FiZap size={18} />
                              </span>
                              <span>
                                <strong>Quick Snap</strong>
                                <small>Tap to view · disappears in 10s</small>
                              </span>
                            </button>
                          ) : m.mediaUrl ? (
                            <>
                              <img src={m.mediaUrl} alt="Shared media" className="ms-media" />
                              {m.text && <p className="ms-text">{m.text}</p>}
                            </>
                          ) : (
                            <p className="ms-text">{m.text}</p>
                          )}
                          <span className="ms-time">{formatTime(m.createdAt)}</span>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {isEphemeralMode && (
                <div className="ms-moment-banner">
                  <FiZap size={14} /> Moment is on. Your next message will disappear after 10 seconds.
                  <button type="button" onClick={() => setIsEphemeralMode(false)}>
                    Turn off
                  </button>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="ms-composer">
                <button
                  type="button"
                  onClick={() => setIsEphemeralMode(!isEphemeralMode)}
                  className={`ms-icon-btn ${isEphemeralMode ? "is-on" : ""}`}
                  aria-pressed={isEphemeralMode}
                  aria-label="Toggle disappearing message"
                  title="Disappearing message (Moment)"
                >
                  <FiZap size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSendSampleImage(false)}
                  className="ms-icon-btn"
                  aria-label="Send photo"
                  title="Send photo"
                >
                  <FiImage size={18} />
                </button>
                <input
                  type="text"
                  placeholder={isEphemeralMode ? "Type a disappearing message…" : "Type a message…"}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="ms-input"
                  aria-label="Message"
                />
                <button
                  type="submit"
                  className="ms-send"
                  disabled={!inputText.trim()}
                  aria-label="Send message"
                  title="Send"
                >
                  <FiSend size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="ms-empty">
              <span className="ms-empty-icon">
                <FiMessageCircle size={30} />
              </span>
              <h2>Select a conversation</h2>
              <p>Choose a chat from the list to start messaging.</p>
            </div>
          )}
        </section>
      </div>

      {/* ---------- Moment viewer ---------- */}
      {viewingMoment && (
        <div className="ms-viewer" role="dialog" aria-modal="true" aria-label="Quick Snap">
          <div className="ms-viewer-inner">
            <div className="ms-viewer-top">
              <span className="ms-viewer-count">
                <FiClock size={14} /> Disappears in {momentCountdown}s
              </span>
              <button type="button" onClick={closeMoment} className="ms-viewer-close" aria-label="Close">
                <FiX size={20} />
              </button>
            </div>
            <div className="ms-viewer-progress">
              <span style={{ width: `${(momentCountdown / 10) * 100}%` }} />
            </div>
            <img
              src={
                viewingMoment.mediaUrl ||
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600"
              }
              alt="Moment"
              className="ms-viewer-img"
            />
            <p className="ms-viewer-note">
              <FiAlertCircle size={14} /> Screen capture events are reported for user safety.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;