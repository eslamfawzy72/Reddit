import React, { useState } from "react";

export default function SidebarLeft() {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Home", icon: "🏠" },
    { name: "Popular", icon: "🔥" },
    { name: "Answers", icon: "💬", badge: "BETA" },
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
        width: isOpen ? "260px" : "0px",
        background: "#e6f0ff",
        padding: isOpen ? "10px" : "0px",
        overflowY: "auto",
        transition: "width 0.3s ease",
        position: "sticky",
        top: 0,
        height: "100vh",
        borderRight: "1px solid #ccc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Hamburger menu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "block",
          marginBottom: "10px",
          background: "#cce0ff",
          border: "none",
          padding: "8px",
          cursor: "pointer",
          color: "#003366",
          fontWeight: "bold",
        }}
      >
        ☰
      </button>

      {isOpen && (
        <>
          {/* Header */}
          <h2 style={{ marginBottom: "10px", color: "#0055cc" }}>Bluedit</h2>

          {/* Navigation */}
          <h3 style={{ color: "#0055cc" }}>Navigation</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {navItems.map((item) => (
              <li key={item.name}>
                <div style={itemStyle} onClick={() => {}}>
                  <span>
                    {item.icon} {item.name}
                  </span>
                  {item.badge && <span style={badgeStyle}>{item.badge}</span>}
                </div>
              </li>
            ))}
          </ul>

          {/* Start a Community Button */}
          <div style={{ marginTop: "20px" }}>
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
              onClick={() => alert("Open CreateCommunityForm page")}
            >
              ➕ Start a Community
            </button>
          </div>
        </>
      )}
    </div>
  );
}

