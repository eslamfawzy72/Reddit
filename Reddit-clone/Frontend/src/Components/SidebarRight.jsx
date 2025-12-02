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
        borderBottom: "1px solid #343536",
        padding: "12px 0",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div
        style={{
          fontWeight: "500",
          color: "#D7DADC",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "14px",
        }}
      >
        <span>
          {number}. {title}
        </span>
        <span style={{ fontSize: "12px", color: "#818384" }}>
          {isOpen ? "▼" : "▶"}
        </span>
      </div>
      {isOpen && (
        <div
          style={{
            marginTop: "8px",
            fontSize: "13px",
            color: "#B8B8B8",
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
        padding: "16px",
        borderTop: "1px solid #343536",
      }}
    >
      <div style={{ fontSize: "12px", fontWeight: "600", color: "#818384", marginBottom: "12px", textTransform: "uppercase" }}>
        Moderators
      </div>
      <div style={{ marginTop: "10px", fontSize: "14px", color: "#D7DADC" }}>
        {MODERATORS.map((mod, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            {mod.username}
            {mod.nickname && <span style={{ color: "#818384" }}> - {mod.nickname}</span>}
          </div>
        ))}
      </div>
      <button
        onClick={() => alert("Messaging the moderators...")}
        style={{
          marginTop: "12px",
          backgroundColor: "#0079D3",
          color: "#fff",
          border: "none",
          borderRadius: "24px",
          padding: "8px 16px",
          fontWeight: "700",
          cursor: "pointer",
          width: "100%",
          fontSize: "14px",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = "#1484D6"}
        onMouseLeave={(e) => e.target.style.backgroundColor = "#0079D3"}
      >
        Message the mods
      </button>
    </div>
  );
};

// ———————— MAIN SIDEBAR (Right Side) ————————
const SidebarRight = () => {
  return (
    <aside
      style={{
        width: "100%",
        backgroundColor: "#1A1A1B",
        borderRadius: "8px",
        border: "1px solid #343536",
        fontFamily: "'IBM Plex Sans', 'Segoe UI', Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Subreddit Info */}
      <div
        style={{
          backgroundColor: "#1A1A1B",
          padding: "16px",
          borderBottom: "1px solid #343536",
        }}
      >
        <h3 style={{ color: "#D7DADC", margin: "0 0 8px 0", fontSize: "16px", fontWeight: "500" }}>
          {SUBREDDIT_INFO.name}
        </h3>
        <p style={{ color: "#818384", fontSize: "14px", margin: "0 0 12px 0", lineHeight: "1.4" }}>
          {SUBREDDIT_INFO.description}
        </p>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "13px", color: "#818384" }}>
          <span>📅</span>
          <span>Created {SUBREDDIT_INFO.created}</span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", fontSize: "13px", color: "#818384" }}>
          <span>🌐</span>
          <span>{SUBREDDIT_INFO.visibility}</span>
        </div>

        <div style={{ display: "flex", gap: "32px", marginTop: "16px" }}>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#D7DADC" }}>
              {SUBREDDIT_INFO.weeklyVisitors}
            </div>
            <div style={{ fontSize: "12px", color: "#818384" }}>Weekly visitors</div>
          </div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#D7DADC" }}>
              {SUBREDDIT_INFO.weeklyContributions}
            </div>
            <div style={{ fontSize: "12px", color: "#818384" }}>Weekly contributions</div>
          </div>
        </div>
      </div>

      {/* User Flair */}
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #343536",
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#818384", marginBottom: "8px", textTransform: "uppercase" }}>
          USER FLAIR
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#0DD3BB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>
            👤
          </div>
          <span style={{ color: "#D7DADC", fontSize: "14px" }}>Agitated-Cup-4986</span>
        </div>
      </div>

      {/* Rules Section */}
      <div style={{ padding: "16px", borderBottom: "1px solid #343536" }}>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#818384", marginBottom: "12px", textTransform: "uppercase" }}>
          R/INTHENEWS RULES
        </div>

        {RULES.map((rule, index) => (
          <RuleItem key={index} number={index + 1} title={rule.title} description={rule.description} />
        ))}
        
        <div
          style={{
            backgroundColor: "#272729",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#D7DADC",
            marginTop: "12px",
          }}
        >
          <strong>SUBMISSION GUIDELINES</strong>
          <br />
          Read the full{" "}
          <a
            href="#"
            style={{ color: "#0079D3", textDecoration: "underline" }}
          >
            subreddit rules here
          </a>
          .
        </div>
      </div>

      <ModeratorList />
    </aside>
  );
};

export default SidebarRight;