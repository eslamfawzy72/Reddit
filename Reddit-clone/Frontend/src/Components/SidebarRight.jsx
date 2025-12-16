import React, { useState, useEffect } from "react";
import axios from "axios";
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

/* ---------- Moderators + Members Management ---------- */
const ModeratorList = ({
  moderators = [],
  members = [],
  communityId,
  canManage,
  setCommunity,
}) => {
  const [showMembers, setShowMembers] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const moderatorIds = moderators.map((m) => m._id);

  const nonModerators = members.filter(
    (m) => !moderatorIds.includes(m._id)
  );

  /* -------- PROMOTE -------- */
  const promoteToMod = async (user) => {
    try {
      setLoadingId(user._id);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/communities/${communityId}/promote`,
        { userId: user._id },
        { withCredentials: true }
      );

      setCommunity((prev) => ({
        ...prev,
        moderators: [...prev.moderators, user],
      }));
    } catch (err) {
  if (err.response?.status >= 400) {
    alert(err.response.data.message);
  }
} finally {
      setLoadingId(null);
    }
  };

  /* -------- DEMOTE -------- */
  const demoteModerator = async (user) => {
    try {
      setLoadingId(user._id);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/communities/${communityId}/demote`,
        { userId: user._id },
        { withCredentials: true }
      );

      setCommunity((prev) => ({
        ...prev,
        moderators: prev.moderators.filter((m) => m._id !== user._id),
      }));
    } catch (err) {
 
    alert(err.response.data.message);
  
} finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="moderator-list">
      <div className="moderator-title">Moderators</div>

      {moderators.map((mod) => (
        <div key={mod._id} className="moderator-item mod-row">
          <span>u/{mod.userName}</span>

          {canManage && (
            <button
              className="mod-action danger"
              onClick={() => { demoteModerator(mod); window.location.reload(); }}
              disabled={loadingId === mod._id}
            >
              {loadingId === mod._id ? "…" : "Demote"}
            </button>
          )}
        </div>
      ))}

      {canManage && (
        <>
          <button
            className="message-mods-btn"
            onClick={() => setShowMembers(!showMembers)}
          >
            Add moderator
          </button>

          {showMembers && (
            <div className="mod-picker">
              {nonModerators.length === 0 ? (
                <div className="empty">No members available</div>
              ) : (
                nonModerators.map((member) => (
                  <div key={member._id} className="mod-pick-item">
                    <span>u/{member.userName}</span>

                    <button
                      className="mod-action"
                      onClick={() => {promoteToMod(member)
                        window.location.reload();
                      }

                      }
                      disabled={loadingId === member._id}
                    >
                      {loadingId === member._id ? "…" : "Promote"}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ---------- MAIN SIDEBAR ---------- */
const SidebarRight = ({ community, setCommunity }) => {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true })
      .then((res) => setCurrentUserId(res.data.user._id))
      .catch(() => setCurrentUserId(null));
  }, []);

  if (!community) return <div className="sidebar-right">Loading...</div>;

  const {
    _id,
    commName,
    description,
    created_at,
    privacystate,
    members = [],
    moderators = [],
    rules = [],
    created_by,
  } = community;

  const creatorId =
    typeof created_by === "object" ? created_by._id : created_by;

  const canManage =
    creatorId === currentUserId 

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

      {/* Admin */}
      <div className="admin-info">
        <strong>Admin:</strong>{" "}
        u/{created_by?.userName || "Unknown"}
      </div>

      {/* Moderators */}
      <ModeratorList
        moderators={moderators}
        members={members}
        communityId={_id}
        canManage={canManage}
        setCommunity={setCommunity}
      />
    </aside>
  );
};

export default SidebarRight;
