// src/components/SidebarLeft.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "../styles/sideBarLeft.css";

export default function SidebarLeft(props) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const navItems = [
    { name: "Home", icon: "🏠" },
    { name: "Popular", icon: "🔥" },
    { name: "Explore", icon: "🔍" },
  ];

  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      {isOpen && (
        <>
          <h2 className="sidebar-title">Bluedit</h2>

          <h3 className="sidebar-subtitle">Navigation</h3>
          <ul className="sidebar-nav">
            {navItems.map((item) => (
              <li key={item.name}>
                <div
                  className="sidebar-nav-item"
                  onClick={() => navigate("/" + item.name)}
                >
                  <span>
                    {item.icon} {item.name}
                  </span>
                  {item.name === "Popular" && (
                    <span className="sidebar-badge">HOT</span>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {isLoggedIn && (
            <div className="sidebar-button-container">
              <button
                className="sidebar-button start-community"
                onClick={() => navigate("/StartCommunity")}
              >
                Start a Community
              </button>
            </div>
          )}

          <div className="sidebar-button-container">
            <button
              className="sidebar-button about-bluedit"
              onClick={() => navigate("/About")}
            >
              About Bluedit
            </button>
          </div>
        </>
      )}

      {!isOpen && (
        <div className="sidebar-collapsed">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="sidebar-collapsed-item"
              title={item.name}
              onClick={() => navigate("/" + item.name)}
            >
              {item.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
