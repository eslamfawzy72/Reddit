import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/communityCard.css";
import { useEffect } from "react";
// import { isLoggedIn } from "../Context/AuthContext";
import { useAuth } from "../Context/AuthContext";

export default function CommunityCard({ communities = [], setCommunities , onOpenCreatePost}) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Programming",
    "Web Development",
    "AI & Machine Learning",
    "Cybersecurity",
    "Data Science",
    "Open Source",
    "Gaming",
    "Art",
    "Photography",
  ];

  const visibleCommunities =
    selectedCategory === "All"
      ? communities
      : communities.filter(
          (c) =>
            c.category?.toLowerCase() ===
            selectedCategory.toLowerCase()
        );

  const handleJoinSuccess = (communityId) => {
    setCommunities((prev) =>
      prev.map((c) =>
        c._id === communityId
          ? { ...c, isJoined: true }
          : c
      )
    );
  };

  return (
    <section className="community">
      <header className="community__header">
        <h1>Explore Communities</h1>

        <div className="community__categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-btn ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "active"
                  : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <h2 className="community__section-title">
        {selectedCategory === "All"
          ? "Recommended for you"
          : `${selectedCategory} Communities`}
      </h2>

<div className="community__list">
        {visibleCommunities.length ? (
          visibleCommunities.map((community) => (
            <CommunityCardItem
              key={community._id}
              community={community}
              navigate={navigate}
              onJoinSuccess={handleJoinSuccess}
               onOpenCreatePost={onOpenCreatePost}
            />
          ))
        ) : (
          <p className="community__empty">No communities found.</p>
        )}
      </div>
    </section>
  );
}


/* =========================
   Card Item
========================= */


function CommunityCardItem({ community, navigate, onJoinSuccess, onOpenCreatePost }) {
  const joined = Boolean(community.isJoined);
  const { isLoggedIn } = useAuth();

  const handleJoin = async (e) => {
    e.stopPropagation();
    if (joined) return;
    if(!isLoggedIn){
      alert("Please log in to join communities.");
      navigate("/login");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/communities/${community._id}/join`,
        {},
        { withCredentials: true }
      );

      onJoinSuccess(community._id);
    } catch {
      alert("Failed to join community");
    }
  };

  return (
    <article
      className="community-card"
onClick={() => {
  navigate(`/community/${community._id}`);
}}   >
      <div className="community-card__header">
        <div
          className="community-card__avatar"
          style={{ backgroundColor: community.color }}
        >
          {community.emoji}
        </div>

        <div className="community-card__info">
          <h3>{community.name}</h3>
          <span>{community.memberCount} members</span>
        </div>

        <button
          className={`join-btn ${joined ? "joined" : ""}`}
          onClick={handleJoin}
          disabled={joined}
        >
          {joined ? "Joined" : "Join"}
        </button>
      </div>

      <p className="community-card__description">
        {community.description}
      </p>
    </article>
  );
}


