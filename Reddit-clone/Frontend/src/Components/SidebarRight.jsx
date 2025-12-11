import React, { useState } from "react";
import "../styles/sideBarRight.css";

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
    <div className="rule-item" onClick={() => setIsOpen(!isOpen)}>
      <div className="rule-header">
        <span>{number}. {title}</span>
        <span className="arrow">{isOpen ? "▼" : "▶"}</span>
      </div>
      {isOpen && <div className="rule-description">{description}</div>}
    </div>
  );
};

// ———————— Moderator List ————————
const ModeratorList = () => {
  return (
    <div className="moderator-list">
      <div className="moderator-title">Moderators</div>
      <div className="moderator-items">
        {MODERATORS.map((mod, i) => (
          <div key={i} className="moderator-item">
            {mod.username}
            {mod.nickname && <span className="moderator-nickname"> - {mod.nickname}</span>}
          </div>
        ))}
      </div>
      <button className="message-mods-btn" onClick={() => alert("Messaging the moderators...")}>
        Message the mods
      </button>
    </div>
  );
};

// ———————— MAIN SIDEBAR (Right Side) ————————
const SidebarRight = () => {
  return (
    <aside className="sidebar-right">
      {/* Subreddit Info */}
      <div className="subreddit-info">
        <h3>{SUBREDDIT_INFO.name}</h3>
        <p>{SUBREDDIT_INFO.description}</p>
        
        <div className="subreddit-meta">
          <span>📅</span>
          <span>Created {SUBREDDIT_INFO.created}</span>
        </div>
        
        <div className="subreddit-meta">
          <span>🌐</span>
          <span>{SUBREDDIT_INFO.visibility}</span>
        </div>

        <div className="subreddit-stats">
          <div>
            <div className="stat-number">{SUBREDDIT_INFO.weeklyVisitors}</div>
            <div className="stat-label">Weekly visitors</div>
          </div>
          <div>
            <div className="stat-number">{SUBREDDIT_INFO.weeklyContributions}</div>
            <div className="stat-label">Weekly contributions</div>
          </div>
        </div>
      </div>

      {/* User Flair */}
      <div className="user-flair">
        <div className="user-flair-title">USER FLAIR</div>
        <div className="user-flair-info">
          <div className="user-avatar">👤</div>
          <span className="user-name">Agitated-Cup-4986</span>
        </div>
      </div>

      {/* Rules Section */}
      <div className="rules-section">
        <div className="rules-title">R/INTHENEWS RULES</div>
        {RULES.map((rule, index) => (
          <RuleItem key={index} number={index + 1} title={rule.title} description={rule.description} />
        ))}
        
        <div className="submission-guidelines">
          <strong>SUBMISSION GUIDELINES</strong>
          <br />
          Read the full{" "}
          <a href="#">subreddit rules here</a>.
        </div>
      </div>

      <ModeratorList />
    </aside>
  );
};

export default SidebarRight;
