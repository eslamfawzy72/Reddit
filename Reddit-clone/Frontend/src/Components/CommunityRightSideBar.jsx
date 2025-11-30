import React, { useState } from "react";

// ———————— MOCK DATA ————————
const SUBREDDIT_INFO = {
  name: "r/inthenews",
  description: "Opinion, analysis, and discussion about recent events.",
  created: "Jan 30, 2010",
  visibility: "Public",
  weeklyVisitors: "167K",
  weeklyContributions: "6.6K",
};

const RULES = [
  { title: "No Spam", description: "Avoid posting irrelevant or repetitive content." },
  { title: "No Hate Speech", description: "Respect others and avoid discriminatory language." },
  { title: "Be Kind and Civil", description: "Engage respectfully in discussions." },
  { title: "No Violence", description: "Do not promote or post violent content." },
  { title: "No Anti-Vaxxers", description: "Medical misinformation is not allowed." },
  { title: "No COVID-19 Deniers", description: "Respect verified health guidelines." },
  { title: "No Editorialized Headlines", description: "Use original titles from sources." },
  { title: "Quality Control", description: "Maintain high standards for posts." },
  { title: "No Old Articles", description: "Share only recent and relevant news." },
];

const MODERATORS = [
  { username: "u/sentrope" },
  { username: "u/semaphore-1842", nickname: "Sema" },
  { username: "u/progress18" },
  { username: "u/abrownwn", nickname: "Not actually Alton Brown" },
  { username: "u/maybesaydie" },
  { username: "u/bxmidsom" },
  { username: "u/ani625", nickname: "ani the 625th" },
  { username: "u/deyoufool23", nickname: "Fool" },
  { username: "u/Handicapreader", nickname: "Mr. Pickle" },
];

// ———————— Collapsible Rule Item ————————
const RuleItem = ({ number, title, description }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      style={{
        backgroundColor: "#e6f2ff",
        borderRadius: "6px",
        padding: "10px",
        marginBottom: "6px",
        cursor: "pointer",
        border: "1px solid #cce0ff",
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontWeight: "bold",
          color: "#003366",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {number}. {title}
        </span>
       
      </div>
      {isOpen && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "13px",
            color: "#333",
            lineHeight: "1.4",
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
};

// ———————— Moderator List ————————
const ModeratorList = () => {
  return (
    <div
      style={{
        backgroundColor: "#e6f2ff",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #cce0ff",
        fontSize: "13px",
        color: "#003366",
        lineHeight: "1.5",
        marginTop: "20px",
      }}
    >
      <strong>Moderators</strong>
      <div style={{ marginTop: "10px" }}>
        {MODERATORS.map((mod, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            {mod.username}
            {mod.nickname && ` - ${mod.nickname}`}
          </div>
        ))}
      </div>
      <button
        onClick={() => alert("Messaging the moderators...")}
        style={{
          marginTop: "10px",
          backgroundColor: "#0055aa",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "10px",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
          fontSize: "14px",
        }}
      >
        Message Mods
      </button>
    </div>
  );
};

// ———————— MAIN SIDEBAR (Right Side) ————————
const SidebarRight = () => {
  return (
    <aside
      style={{
        width: "300px",
        maxWidth: "100%",
        backgroundColor: "#f0f8ff",
        padding: "20px 16px",
        borderLeft: "1px solid #cce0ff",
        borderRadius: "0 12px 12px 0",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        position: "fixed",
        top: 0,
        right: 0,
        height: "100vh",
        overflowY: "auto",
        boxShadow: "-4px 0 12px rgba(0,0,0,0.08)",
        zIndex: 10,
        boxSizing: "border-box",
      }}
    >
      {/* Subreddit Info */}
      <div
        style={{
          backgroundColor: "#e6f2ff",
          padding: "14px",
          borderRadius: "8px",
          border: "1px solid #cce0ff",
          fontSize: "13px",
          color: "#003366",
          lineHeight: "1.6",
          marginBottom: "20px",
        }}
      >
        <strong>{SUBREDDIT_INFO.name}:</strong> {SUBREDDIT_INFO.description}
        <br />
        Created {SUBREDDIT_INFO.created} · {SUBREDDIT_INFO.visibility}
        <br />
        {SUBREDDIT_INFO.weeklyVisitors} Weekly visitors ·{" "}
        {SUBREDDIT_INFO.weeklyContributions} posts
      </div>

      {/* Rules Section */}
      <h3 style={{ color: "#003366", margin: "0 0 12px 0", fontSize: "15px" }}>
        r/INTHENEWS Rules
      </h3>

      {RULES.map((rule, index) => (
        <div key={index}>
          <RuleItem number={index + 1} title={rule.title} description={rule.description} />
          {index === RULES.length - 1 && (
            <div
              style={{
                backgroundColor: "#e6f2ff",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #cce0ff",
                fontSize: "13px",
                color: "#003366",
                marginTop: "12px",
              }}
            >
              <strong>SUBMISSION GUIDELINES</strong>
              <br />
              Read the full{" "}
              <a
                href="#"
                style={{ color: "#0055aa", textDecoration: "underline" }}
              >
                subreddit rules here
              </a>
              .
            </div>
          )}
        </div>
      ))}

      <ModeratorList />
    </aside>
  );
};

export default SidebarRight;