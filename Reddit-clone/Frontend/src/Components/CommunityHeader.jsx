import React from "react";
import "../styles/communityHeader.css";
import axios from "axios";

export default function CommunityHeader({
  name,
  avatar,
  banner,
  membersCount,
  onlineCount,
  isJoined,
  communityId,
}) {
  const handleJoin = async () => {
    if (isJoined) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/communities/${communityId}/join`,
        {},
        { withCredentials: true }
      );
      window.location.reload(); // simple & safe for now
    } catch {
      alert("Failed to join community");
    }
  };

  return (
    <section className="community-header">
      <div
        className="community-banner"
        style={{ backgroundImage: `url(${banner})` }}
      />

      <div className="community-header-inner">
        <div className="community-info">
          <div className="community-avatar">{avatar}</div>

          <div>
            <h1>b/{name}</h1>
            <p>
              {/* {membersCount.toLocaleString()} members •{" "}
              {onlineCount.toLocaleString()} online */}
            </p>
          </div>
        </div>

        <div className="community-actions">
          <button className="primary-btn">Create Post</button>

          <button
            className={`secondary-btn ${isJoined ? "joined" : ""}`}
            onClick={handleJoin}
          >
            {isJoined ? "Joined" : "Join"}
          </button>

           <button className="leave-btn">Leave Community</button>

        </div>
      </div>
    </section>
  );
}
