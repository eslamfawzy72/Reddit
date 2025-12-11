import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/communityCard.css";

export default function CommunityCard({ communities = [] }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Personal Finance",
    "Crypto",
    "Economics",
    "Business News & Discussion",
    "Deals & Marketplace",
    "Startups & Entrepreneurship",
    "Real Estate",
    "Stocks & Investing",
    "Programming",
    "Web Development",
    "AI & Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "Data Science",
    "Open Source",
    "PC Gaming",
    "Console Gaming",
    "Esports",
    "Game Development",
    "Retro Games",
    "Speedrunning",
    "Performing Arts",
    "Architecture",
    "Design",
    "Art",
    "Filmmaking",
    "Digital Art",
    "Photography",
  ];

  const filteredCommunities =
    selectedCategory === "All"
      ? communities
      : communities.filter(
          (community) =>
            community.categories &&
            community.categories.includes(selectedCategory)
        );

  const CommunityCardItem = ({ community }) => {
    const [joined, setJoined] = useState(community.isJoined);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`card ${isHovered ? "card-hover" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/community`)}
      >
        <div className="card-header">
          <div className="left-section">
            <div className="avatar" style={{ backgroundColor: community.color }}>
              {community.emoji}
            </div>
            <div className="info-section">
              <div className="name">{community.name}</div>
              <div className="members">
                {community.members} {community.visitors}
              </div>
            </div>
          </div>
          <button
            type="button"
            className={`join-btn ${joined ? "joined" : ""}`}
            onClick={async (e) => {
              e.stopPropagation();
              try {
                await axios.post(
                  `${import.meta.env.VITE_API_URL}/communities/${community._id}/join`,
                  {},
                  { withCredentials: true }
                );
                setJoined(true);
              } catch (err) {
                console.error(err.response?.data || err);
                alert(
                  err.response?.data?.message || "Failed to join community"
                );
              }
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = joined ? "#E3F2FD" : "#1484D6";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = joined ? "#F5F5F5" : "#0079D3";
            }}
          >
            {joined ? "Joined" : "Join"}
          </button>
        </div>
        <div className="description">{community.description}</div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="header">
          <div className="title">Explore Communities</div>
          <div className="category-bar">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${
                  selectedCategory === cat ? "selected" : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat) e.target.classList.add("hover");
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat)
                    e.target.classList.remove("hover");
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="section-title">
          {selectedCategory === "All"
            ? "Recommended for you"
            : `${selectedCategory} Communities`}
        </div>

        {filteredCommunities.length > 0 ? (
          <div className="wrapper">
            {filteredCommunities.map((community) => (
              <CommunityCardItem
                key={community.name}
                community={community}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            No communities found for "{selectedCategory}". Try selecting a
            different category.
          </div>
        )}
      </div>
    </div>
  );
}
