import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiZap,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";
import "./BottomNavigation.css";

const BottomNavigation = () => {
  const navItems = [
    {
      to: "/",
      icon: FiHome,
      label: "Home",
    },
    {
      to: "/discover",
      icon: FiCompass,
      label: "Discover",
    },
    {
      to: "/available-now",
      icon: FiZap,
      label: "Right Now",
      center: true,
    },
    {
      to: "/messages",
      icon: FiMessageCircle,
      label: "Messages",
    },
    {
      to: "/profile",
      icon: FiUser,
      label: "Profile",
    },
  ];

  return (
    <div className="companion-bottom-nav d-lg-none">
      <div className="bottom-nav-inner">

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `bottom-nav-item ${
                  isActive ? "active" : ""
                } ${item.center ? "center-item" : ""}`
              }
            >
              {item.center ? (
                <div className="right-now-button">
                  <Icon size={21} />
                  <span className="right-now-dot" />
                </div>
              ) : (
                <div className="bottom-nav-icon">
                  <Icon size={19} />
                </div>
              )}

              <span>{item.label}</span>
            </NavLink>
          );
        })}

      </div>
    </div>
  );
};

export default BottomNavigation;