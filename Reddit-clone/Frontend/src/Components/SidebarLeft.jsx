// src/components/SidebarLeft.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function SidebarLeft() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
 const navItems = [
    { name: "Home", icon: "🏠" },
    { name: "Popular", icon: "🔥" },
    { name: "Explore", icon: "🔍" },
    { name: "All", icon: "📚" },
  ];

  const itemStyle = {
    cursor: "pointer",
    padding: "8px 10px",
    borderRadius: "6px",
    marginBottom: "6px",
    background: "#fff",
    border: "1px solid #c7d7ff",
    color: "#003366",
    fontWeight: 600,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const badgeStyle = {
    background: "#ff4d4d",
    color: "white",
    fontSize: "10px",
    padding: "2px 6px",
    borderRadius: "12px",
    marginLeft: "8px",
  };

  return (
    <div
      style={{
        width: isOpen ? "260px" : "60px",     // ← Only this width
        flexShrink: 0,                        // ← NEVER shrinks or pushes content
        background: "#e6f0ff",
        padding: isOpen ? "10px" : "10px 5px",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.3s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
        borderRight: "1px solid #ccc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Toggle Button */}
      

      {isOpen && (
        <>
          {/* Header */}
          <h2 style={{ margin: "0 0 20px 0", color: "#0055cc" }}>Bluedit</h2>

          {/* Navigation */}
          <h3 style={{ color: "#0055cc", margin: "10px 0" }}>Navigation</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {navItems.map((item) => (
              <li key={item.name} style={{ marginBottom: "6px" }}>
                <div style={itemStyle} onClick={() => navigate('/' + item.name)}>
                  <span>
                    {item.icon} {item.name}
                  </span>
                  {item.name === "Popular" && <span style={badgeStyle}>HOT</span>}
                </div>
              </li>
            ))}
          </ul>

          {/* Start a Community Button */}
          <div style={{ marginTop: "30px" }}>
            <button
              style={{
                width: "100%",
                padding: "10px",
                background: "#0079d3",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/StartCommunity")}
            >
              Start a Community
            </button>
            
          </div>
          <div style={{ marginTop: "30px" }}>
            <button
              style={{
                width: "100%",
                padding: "10px",
                background: "#00b7d3ff",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => navigate("/About")}
            >
              About Bluedit
            </button>
            
          </div>
        </>
      )}

      {/* Collapsed: show only icons */}
      {!isOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
          {navItems.map((item) => (
            <div
              key={item.name}
              style={{ fontSize: "24px", textAlign: "center", cursor: "pointer" }}
              title={item.name}
            >
              {item.icon}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}