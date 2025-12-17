import React from "react";
import { toast } from "react-hot-toast";
import "../styles/communityHeader.css";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API = import.meta.env.VITE_API_URL;
export default function CommunityHeader({
  name,
  avatar,
  banner,
  admin,
  membersCount,
  onlineCount,
  isJoined,
  communityId,
  onOpenCreatePost,
}) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [currentAdmin, setCurrentAdmin] = useState(null);
  useEffect(() => {
    axios.get(`${API}/auth/me`, { withCredentials: true })

      .then(res => setCurrentAdmin(res.data.user._id))
      .catch(() => setCurrentAdmin(null));
  }, []);
  // const handleJoin = async () => {
  //   if (isJoined) return;

  //   try {
  //     await axios.post(
  //       `${import.meta.env.VITE_API_URL}/communities/${communityId}/join`,
  //       {},
  //       { withCredentials: true }
  //     );
  //     window.location.reload(); // simple & safe for now
  //   } catch {
  //     alert("Failed to join community");
  //   }
  // };
  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/communities/${communityId}`,
        { withCredentials: true }
      );
      alert("Community deleted successfully");
      window.location.href = "/";
    } catch {
      alert("Failed to delete community");
    }
  };




  const handleJoin = async (e) => {
    e.stopPropagation();
    if (isJoined) return;
    if (!isLoggedIn) {
      alert("Please log in to join communities.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/communities/${communityId}/join`,
        {},
        { withCredentials: true }
      );
      window.location.reload();


    } catch {
      alert("Failed to join community");
    }
  };
  const handleLeave = async () => {
    if (!isJoined) return;
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/Communities/${communityId}/leave`,
        {},
        { withCredentials: true }
      );
      alert("Left the community");
      // toast.success("Left the community");
      window.location.reload(); // simple & safe for now
    } catch {
      alert("Failed to leave community");
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
          <button
            className="primary-btn"
            onClick={() => {
              if (onOpenCreatePost) {
                onOpenCreatePost({
                  _id: communityId,
                  commName: name,
                });
              }
            }}
          >
            Create Post
          </button>


          <button
            className={`secondary-btn ${isJoined ? "joined" : ""}`}
            onClick={handleJoin}
          >
            {isJoined ? "Joined" : "Join"}
          </button>
          {isJoined && (
            <button className="leave-btn" onClick={handleLeave}>Leave Community</button>
          )}
          {currentAdmin && currentAdmin === admin._id && (
            <button className="delete-btn" onClick={handleDelete}>Delete Community</button>
          )}
        </div>
      </div>
    </section>
  );
}
