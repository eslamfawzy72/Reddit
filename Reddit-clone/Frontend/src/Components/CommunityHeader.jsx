import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "../styles/communityHeader.css";

const API = import.meta.env.VITE_API_URL;

export default function CommunityHeader({
  name,
  avatar,
  banner,
  admin,
  isJoined,
  communityId,
  onOpenCreatePost,
}) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
 
  /* ---------- FETCH CURRENT USER ---------- */
  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then((res) => setCurrentUserId(res.data.user._id))
      .catch(() => setCurrentUserId(null));
  }, []);

  /* ---------- JOIN ---------- */
  const handleJoin = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (isJoined) return;

    try {
      await axios.post(
        `${API}/communities/${communityId}/join`,
        {},
        { withCredentials: true }
      );
      
      navigate('/Explore');
    } catch {
      alert("Failed to join community");
    }
  };

  /* ---------- LEAVE ---------- */
  const handleLeave = async () => {
    try {
      await axios.post(
        `${API}/communities/${communityId}/leave`,
        {},
        { withCredentials: true }
      );
      navigate("/Explore");
    } catch {
      alert("Failed to leave community");
    }
  };

  /* ---------- DELETE COMMUNITY ---------- */
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API}/communities/${communityId}`,
        { withCredentials: true }
      );
      navigate("/");
    } catch {
      alert("Failed to delete community");
    }
  };

  const isAdmin = currentUserId && admin?._id === currentUserId;

  return (
    <section className="community-header">
      <div
        className="community-banner"
        style={{ backgroundImage: `url(${banner})` }}
      />

      <div className="community-header-inner">
        <div className="community-info">
         <div className="community-avatar">
  {avatar ? (
    <img src={avatar} alt={name} />
  ) : (
    <div className="avatar-letter">
      {name ? name[0].toUpperCase() : "?"}
    </div>
  )}
</div>

          <div>
            <h1>b/{name}</h1>
          </div>
        </div>

        <div className="community-actions">
          {/* CREATE POST */}
          <button
            className="primary-btn"
            onClick={() => {
              if (!isJoined) {
                alert("Join the community to create a post");
                return;
              }

              onOpenCreatePost?.({
                _id: communityId,
                commName: name,
              });
            }}
          >
            Create Post
          </button>

          {/* JOIN / LEAVE */}
          {!isJoined ? (
            <button className="secondary-btn" onClick={handleJoin}>
              Join
            </button>
          ) : (
            <button className="leave-btn" onClick={handleLeave}>
              Leave
            </button>
          )}

          {/* DELETE */}
          {isAdmin && (
            <button className="delete-btn" onClick={handleDelete}>
              Delete Community
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
