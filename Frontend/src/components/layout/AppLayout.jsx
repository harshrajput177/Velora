import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

import { useSafety } from "../../context/SafetyContext";
import { FiShield, FiCheckCircle } from "react-icons/fi";
import "./AppLayout.css";

// How much space the bottom navigation takes up at the bottom of the screen.
// Looks at every element inside the nav wrapper, so it works whether the nav is
// fixed, sticky or part of the normal page flow.
const getBottomReserve = (wrapper, viewportH) => {
  if (!wrapper) return 0;
  let reserve = 0;
  let fixedTop = viewportH;

  Array.from(wrapper.children).forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.height > 0) reserve = Math.max(reserve, rect.height);

    const group = [el, ...el.querySelectorAll("*")];
    const anchored = group.some((node) => {
      const cs = window.getComputedStyle(node);
      const r = node.getBoundingClientRect();
      return (
        (cs.position === "fixed" || cs.position === "sticky") &&
        r.height > 0 &&
        r.bottom >= viewportH - 4 &&
        r.top > viewportH * 0.5
      );
    });
    if (anchored) {
      group.forEach((node) => {
        const r = node.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && r.top > viewportH * 0.5) {
          fixedTop = Math.min(fixedTop, r.top);
        }
      });
    }
  });

  reserve = Math.max(reserve, viewportH - fixedTop);
  // The bottom nav is only shown below the lg breakpoint; use a safe default if it
  // could not be measured yet.
  if (reserve === 0 && window.innerWidth < 992) reserve = 96;
  return reserve;
};

const AppLayout = () => {
  const { activeSession, checkIn, endSession } = useSafety();
  const { pathname } = useLocation();

  // The chat page behaves like a mobile app screen: it fills exactly the space
  // between the header and the bottom navigation, and the page itself never scrolls.
  const isChat = pathname.startsWith("/messages");

  const headerWrapRef = useRef(null);
  const navWrapRef = useRef(null);
  const mainRef = useRef(null);
  const [chatHeight, setChatHeight] = useState(null);

  // Lock page scroll while the chat is open
  useEffect(() => {
    if (!isChat) return undefined;
    window.scrollTo(0, 0);
    document.documentElement.classList.add("velora-chat-lock");
    return () => document.documentElement.classList.remove("velora-chat-lock");
  }, [isChat]);

  // Work out how tall the chat area can be: screen - everything above it - bottom nav
  useLayoutEffect(() => {
    if (!isChat) {
      setChatHeight(null);
      return undefined;
    }

    const measure = () => {
      const mainEl = mainRef.current;
      if (!mainEl) return;
      const viewportH = window.visualViewport?.height || window.innerHeight;
      const top = mainEl.getBoundingClientRect().top;
      // On chat screens, the bottom navigation is hidden, so there is zero bottom reserve
      const navH = isChat ? 0 : getBottomReserve(navWrapRef.current, viewportH);
      const reserve = navH > 0 ? navH + 12 : 0;
      setChatHeight(Math.max(320, Math.floor(viewportH - top - reserve)));
    };

    measure();
    const raf = requestAnimationFrame(measure);
    const timer = setTimeout(measure, 300);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    window.visualViewport?.addEventListener("resize", measure);

    let observer;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(measure);
      const headerEl = headerWrapRef.current?.firstElementChild;
      const navEl = navWrapRef.current?.firstElementChild;
      if (headerEl) observer.observe(headerEl);
      if (navEl) observer.observe(navEl);
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      observer?.disconnect();
    };
  }, [isChat, activeSession]);

  return (
    <div
      className={`min-vh-100 d-flex flex-column velora-app-layout ${isChat ? "is-chat" : ""}`}
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* display: contents keeps the header's own sticky/fixed behaviour unchanged */}
      <div ref={headerWrapRef} style={{ display: "contents" }}>
        <Header />
      </div>

      {activeSession && (
        <div
          className="bg-danger text-white py-2 px-3 shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-2 sticky-top"
          style={{ top: 56, zIndex: 1020 }}
        >
          <div className="d-flex align-items-center gap-2">
            <FiShield size={20} className="animate-pulse" />
            <div>
              <span className="fw-bold" style={{ fontSize: "0.9rem" }}>
                SafeTrack Mode Active
              </span>
              <span className="d-none d-sm-inline ms-2 opacity-75" style={{ fontSize: "0.8rem" }}>
                Heading to: {activeSession.destination}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button onClick={checkIn} className="btn btn-sm btn-light text-danger fw-bold rounded-pill px-3">
              <FiCheckCircle className="me-1" /> I'm Safe
            </button>
            <Link to="/safety" className="btn btn-sm btn-outline-light rounded-pill px-3">
              Live Map
            </Link>
            <button onClick={endSession} className="btn btn-sm btn-dark rounded-pill px-3">
              End Trip
            </button>
          </div>
        </div>
      )}

      <main
        ref={mainRef}
        className={`flex-grow-1 ${isChat ? "is-chat-main" : "pb-5 pb-lg-0"}`}
        style={isChat && chatHeight ? { height: chatHeight } : undefined}
      >
        <Outlet />
      </main>

      {!isChat && (
        <div ref={navWrapRef} style={{ display: "contents" }}>
          <BottomNavigation />
        </div>
      )}
    </div>
  );
};

export default AppLayout;