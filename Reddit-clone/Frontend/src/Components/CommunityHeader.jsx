import React from "react";
import "../styles/communityHeader.css";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

import { toast } from "react-hot-toast";
export default function CommunityHeader({
  name,
  avatar,
  banner,
  membersCount,
  onlineCount,
  isJoined,
  communityId,
}) {
    const { isLoggedIn } = useAuth();
  
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
  
  const handleJoin = async (e) => {
    e.stopPropagation();
    if (isJoined) return;
    if(!isLoggedIn){
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
          <button className="primary-btn">Create Post</button>

          <button
            className={`secondary-btn ${isJoined ? "joined" : ""}`}
            onClick={handleJoin}
          >
            {isJoined ? "Joined" : "Join"}
          </button>
            {isJoined&&(
           <button className="leave-btn"    onClick={handleLeave}>Leave Community</button>
)}
        </div>
      </div>
    </section>
  );
}
