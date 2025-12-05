// src/FullPages/BlueditAbout.jsx
import React from "react";

/**
 * Bluedit About Page
 * - No external deps (no framer-motion, no lucide, no alias)
 * - Inline styles for a consistent blue theme
 * - Self-contained, copy-paste ready
 */

export default function BlueditAbout() {
  const pageStyle = {
    minHeight: "100vh",
    padding: "48px 24px",
    background: "linear-gradient(180deg,#071032 0%, #0b2a66 100%)",
    color: "#e6f0ff",
    fontFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 28,
  };

  const containerStyle = {
    maxWidth: 1100,
    width: "100%",
  };

  const headerStyle = {
    textAlign: "center",
    marginBottom: 8,
  };

  const titleStyle = {
    fontSize: 42,
    lineHeight: 1.03,
    margin: 0,
    fontWeight: 800,
    color: "#dbeafe",
    textShadow: "0 6px 30px rgba(2,6,23,0.6)",
  };

  const leadStyle = {
    fontSize: 16,
    color: "#cfe6ff",
    marginTop: 12,
    maxWidth: 920,
    marginLeft: "auto",
    marginRight: "auto",
    opacity: 0.95,
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 18,
    marginTop: 26,
  };

  const cardStyle = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
    border: "1px solid rgba(255,255,255,0.04)",
    padding: 20,
    borderRadius: 14,
    minHeight: 160,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 10,
  };

  const iconWrap = {
    width: 48,
    height: 48,
    borderRadius: 10,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.04)",
    boxShadow: "inset 0 -6px 18px rgba(0,0,0,0.35)",
  };

  const h2 = { margin: 0, fontSize: 18, color: "#eaf6ff", fontWeight: 700 };
  const p = { margin: 0, fontSize: 14, color: "#cfe6ff", opacity: 0.95, lineHeight: 1.45 };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>About Bluedit</h1>
          <p style={leadStyle}>
            Bluedit was created by crab lovers, people who live in October, and Dexter fans — a strange, brilliant
            mix that somehow built the greatest community platform you didn't know you needed. Think of it as the
            internet's midnight diner: messy, warm, and full of stories that won't let you sleep.
          </p>
        </header>

        <section style={gridStyle} aria-label="features">
          <article style={cardStyle}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
              <div style={iconWrap} aria-hidden>
                {/* simple chat bubble SVG */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="#bfe0ff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={h2}>Community First</h3>
                <p style={p}>
                  Built by people who love weird things, Bluedit puts communities at the center. Create subspaces,
                  ignite debates, and watch micro-cultures bloom — from crab aficionados to midnight plot theorists.
                </p>
              </div>
            </div>
          </article>

          <article style={cardStyle}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
              <div style={iconWrap} aria-hidden>
                {/* flame / spark */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2s1.5 2.6 1.5 4.8S12 10.5 12 13.5 7.5 16 7.5 16 9 9.6 12 6.5 12 2 12 2z" stroke="#bfe0ff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={h2}>Trending & Amplified</h3>
                <p style={p}>
                  Hot topics surface fast. Whether it's a meme, a lifehack, or a theory about Dexter's finest hour,
                  Bluedit highlights what’s worthy of attention and what’s just pure chaos — both are welcome.
                </p>
              </div>
            </div>
          </article>

          <article style={cardStyle}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
              <div style={iconWrap} aria-hidden>
                {/* globe */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="#bfe0ff" strokeWidth="1"></circle>
                  <path d="M2 12h20M12 2v20" stroke="#bfe0ff" strokeWidth="1"></path>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={h2}>Global Voices</h3>
                <p style={p}>
                  From Cairo to Kalamazoo, Bluedit connects different worlds. Discover new perspectives and learn why
                  crab migration theories and October rituals matter to someone else out there.
                </p>
              </div>
            </div>
          </article>

          <article style={cardStyle}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", width: "100%" }}>
              <div style={iconWrap} aria-hidden>
                {/* detective / magnifier */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M21 21l-4.35-4.35" stroke="#bfe0ff" strokeWidth="1.2" strokeLinecap="round"></path>
                  <circle cx="11" cy="11" r="6" stroke="#bfe0ff" strokeWidth="1.2"></circle>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={h2}>Curiosity & Deep Dives</h3>
                <p style={p}>
                  Dexter-level analysis? Conspiracy threads? Niche fandoms? Bluedit rewards curiosity. Long-form posts,
                  threaded discussions, and community-driven investigations live here.
                </p>
              </div>
            </div>
          </article>
        </section>

        <footer style={{ marginTop: 28, textAlign: "center" }}>
          <p style={{ color: "#d7eeff", fontSize: 15, maxWidth: 920, margin: "0 auto", lineHeight: 1.5 }}>
            This is the greatest platform because it refuses to be bland. It's designed for messy genius, late-night
            takes, and the kind of friendships that start under a niche post and last forever. Come for the crabs,
            stay for the conversations — and bring your weird.
          </p>
        </footer>
      </div>
    </div>
  );
}
