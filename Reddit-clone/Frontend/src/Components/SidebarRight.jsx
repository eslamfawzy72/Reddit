import React, { useState } from "react";
import "../styles/sideBarRight.css";

/* ---------- Collapsible Rule ---------- */
const RuleItem = ({ number, title }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rule-item" onClick={() => setOpen(!open)}>
      <div className="rule-header">
        <span>{number}. {title}</span>
        <span className="arrow">{open ? "▼" : "▶"}</span>
      </div>
    </div>
  );
};

/* ---------- Moderators ---------- */
const ModeratorList = ({ moderators = [] }) => {
  if (!moderators.length) return null;

  return (
    <div className="moderator-list">
      <div className="moderator-title">Moderators</div>

      {moderators.map((mod, i) => (
        <div key={i} className="moderator-item">
          u/{mod.userName}
        </div>
      ))}

      <button
        className="message-mods-btn"
        onClick={() => alert("Messaging moderators...")}
      >
        Message the mods
      </button>
    </div>
  );
};

/* ---------- MAIN SIDEBAR ---------- */
const SidebarRight = ({ community }) => {
  if (!community) return <div className="sidebar-right">Loading...</div>;

  const {
    commName,
    description,
    created_at,
    privacystate,
    members = [],
    moderators = [],
    rules = [],
  } = community;

  return (
    <aside className="sidebar-right">
      {/* Community Info */}
      <section className="subreddit-info">
        <h3>b/{commName}</h3>
        <p>{description}</p>

        <div className="subreddit-meta">
          <span>📅</span>
          <span>
            Created{" "}
            {new Date(created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="subreddit-meta">
          <span>🌐</span>
          <span>{privacystate}</span>
        </div>

        <div className="subreddit-stats">
          <div>
            <div className="stat-number">{members.length}</div>
            <div className="stat-label">Members</div>
          </div>
          <div>
            <div className="stat-number">
              {Math.floor(members.length * 0.08)}
            </div>
            <div className="stat-label">Online</div>
          </div>
        </div>
      </section>

      {/* Rules */}
      {rules.length > 0 && (
        <section className="rules-section">
          <div className="rules-title">Community Rules</div>
          {rules.map((rule, i) => (
            <RuleItem key={i} number={i + 1} title={rule} />
          ))}
        </section>
      )}

      {/* Moderators */}
      <ModeratorList moderators={moderators} />
    </aside>
  );
};

export default SidebarRight;
