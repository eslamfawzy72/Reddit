import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { House, Flame, Search } from "lucide-react";
import "../styles/sideBarLeft.css";

export default function SidebarLeft({
  onOpenCreateCommunity = null,
  onOpenCreatePost = null,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

 const navItems = [
  { name: "Home", icon: <House size={18} /> },
  { name: "Popular", icon: <Flame size={18} /> },
  { name: "Explore", icon: <Search size={18} /> },
];


  return (
    <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
      {isOpen && (
        <>
      
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

          {/* START COMMUNITY */}
          <div className="sidebar-button-container">
            <button
              className="sidebar-button start-community"
              onClick={() => {
                if (!isLoggedIn) {
                  alert("Please login to create a community");
                  navigate("/Login");
                  return;
                }

                // ✅ SAFE call — no errors anymore
                onOpenCreateCommunity?.();
              }}
            >
              Start a Community
            </button>
          </div>

          {/* ABOUT */}
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
