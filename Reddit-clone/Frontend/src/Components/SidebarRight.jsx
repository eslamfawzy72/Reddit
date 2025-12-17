import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../styles/sideBarRight.css";

/* ---------- Rules ---------- */
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

/* ---------- MODERATOR LIST ---------- */
const ModeratorList = ({
  moderators,
  members,
  communityId,
  adminId,
  canManage,
  setCommunity,
  showToast,
}) => {
  const [showMembers, setShowMembers] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const moderatorIds = useMemo(
    () => moderators.map(m => m._id),
    [moderators]
  );

  const promotableMembers = useMemo(
    () =>
      members.filter(
        m => m._id !== adminId && !moderatorIds.includes(m._id)
      ),
    [members, moderatorIds, adminId]
  );

  /* ---------- PROMOTE ---------- */
  const promote = async (user) => {
    try {
      setLoadingId(user._id);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/communities/${communityId}/promote`,
        { userId: user._id },
        { withCredentials: true }
      );

      setCommunity(prev => ({
        ...prev,
        moderators: [...prev.moderators, user],
        members: prev.members.filter(m => m._id !== user._id),
      }));

      showToast(`u/${user.userName} promoted to moderator`);
    } finally {
      setLoadingId(null);
    }
  };

  /* ---------- DEMOTE ---------- */
  const demote = async (user) => {
    try {
      setLoadingId(user._id);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/communities/${communityId}/demote`,
        { userId: user._id },
        { withCredentials: true }
      );

      setCommunity(prev => ({
        ...prev,
        moderators: prev.moderators.filter(m => m._id !== user._id),
        members: [...prev.members, user],
      }));

      showToast(`u/${user.userName} demoted to member`);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="moderator-list">
      <div className="moderator-title">Moderators</div>

      {moderators.map(mod => (
        <div key={mod._id} className="moderator-item mod-row">
          <span>u/{mod.userName}</span>
          {canManage && (
            <button
              className="mod-action danger"
              onClick={() => demote(mod)}
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
              {promotableMembers.length === 0 ? (
                <div className="empty">No members available</div>
              ) : (
                promotableMembers.map(member => (
                  <div key={member._id} className="mod-pick-item">
                    <span>u/{member.userName}</span>
                    <button
                      className="mod-action"
                      onClick={() => promote(member)}
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

/* ---------- MAIN ---------- */
const SidebarRight = ({ community, setCommunity, showToast }) => {
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUserId(res.data.user._id))
      .catch(() => setCurrentUserId(null));
  }, []);

  if (!community) return null;

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

  const adminId =
    typeof created_by === "object" ? created_by._id : created_by;

  const canManage = currentUserId === adminId;

  return (
    <aside className="sidebar-right">
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
           <div>
        {members.length} members
      </div>
      </section>
   

      {rules.length > 0 && (
        <section className="rules-section">
          <div className="rules-title">Community Rules</div>
          {rules.map((r, i) => (
            <RuleItem key={i} number={i + 1} title={r} />
          ))}
        </section>
      )}

      <div className="admin-info">
        <strong>Admin:</strong> u/{created_by?.userName}
      </div>

      <ModeratorList
        moderators={moderators}
        members={members}
        communityId={_id}
        adminId={adminId}
        canManage={canManage}
        setCommunity={setCommunity}
        showToast={showToast}
      />
    </aside>
  );
};

export default SidebarRight;