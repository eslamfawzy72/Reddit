import React from "react";
import axios from "axios";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import { useNavigate } from "react-router-dom";

export default function BlueditAbout({ onOpenCreatePost }) {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  /* 🔍 SEARCH */
  const searchFunction = async (query) => {
    if (!query.trim()) return { results: [], renderItem: null };

    try {
      const [usersRes, commRes] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/communities`)
      ]);

      const users = (usersRes.data || [])
        .filter(u => u.userName?.toLowerCase().startsWith(query.toLowerCase()))
        .map(u => ({ type: "user", id: u._id, label: u.userName }));

      const communities = (commRes.data || [])
        .filter(c => c.commName?.toLowerCase().startsWith(query.toLowerCase()))
        .map(c => ({ type: "community", id: c._id, label: c.commName }));

      return { results: [...users, ...communities], renderItem: null };
    } catch {
      return { results: [], renderItem: null };
    }
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <div style={{ position: "sticky", top: 0, zIndex: 10 }}>
        <PrimarySearchAppBar
          searchFunction={searchFunction}
          onOpenCreatePost={onOpenCreatePost}
        />
      </div>

      {/* FULL PAGE WRAPPER — KILLS SIDEBAR SPACE */}
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          margin: 0,
          padding: 0,
          backgroundColor: "#0B0F1A",
          display: "flex",
          justifyContent: "center"
        }}
      >
        {/* CENTERED CONTENT */}
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "28px 36px",
            color: "#d7dadc",
            fontFamily:
              "Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "28px"
          }}
        >
          {/* HEADER */}
          <header style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "42px",
                fontWeight: 800,
                color: "#4c6ef5",
                margin: 0,
                textShadow: "0 4px 20px rgba(76,110,245,0.3)"
              }}
            >
              About Bluedit
            </h1>

            <p
              style={{
                fontSize: "16px",
                color: "#9ca3af",
                marginTop: "12px",
                maxWidth: "920px",
                opacity: 0.95
              }}
            >
              Bluedit wasn’t built in a weekend. It was built through burnout,
              broken builds, failed deploys, and “why is this undefined at 3AM?”
              moments. It’s messy. It’s alive. And somehow—it works.
            </p>
          </header>

          {/* GRID */}
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
              width: "100%",
              marginTop: "26px"
            }}
          >
            {[
              {
                title: "Community First",
                text:
                  "Bluedit is about people before pixels. Communities aren’t features — they’re the backbone."
              },
              {
                title: "Built Through Pain",
                text:
                  "Every feature here exists because something broke. This platform is held together by debugging and stubbornness."
              },
              {
                title: "Not Polished. Real.",
                text:
                  "No corporate shine. No fake engagement. Just raw discussions, chaotic energy, and honest interaction."
              },
              {
                title: "A Student Project That Refused to Die",
                text:
                  "What started as a requirement turned into a war. And this page? This is the victory lap."
              }
            ].map((card, i) => (
              <article
                key={i}
                style={{
                  background: "#0f172a",
                  border: "1px solid #1F2933",
                  padding: "20px",
                  borderRadius: "12px",
                  minHeight: "160px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  transition: "0.3s",
                  cursor: "default"
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#d7dadc"
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#9ca3af",
                    lineHeight: 1.45
                  }}
                >
                  {card.text}
                </p>
              </article>
            ))}
          </section>

          {/* FOOTER */}
          <footer style={{ textAlign: "center", marginTop: "28px" }}>
            <p
              style={{
                color: "#9ca3af",
                fontSize: "15px",
                maxWidth: "920px",
                lineHeight: 1.5
              }}
            >
              Bluedit exists because quitting was never an option. If you’re here,
              you survived the same grind. Welcome home.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
