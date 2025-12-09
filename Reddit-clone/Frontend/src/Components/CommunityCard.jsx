import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// const communities = [
//   { name: "anime_irl", members: "908K", visitors: "weekly visitors", description: "Very shitposts and memes. Very fun. Very anime.", emoji: "🎌", color: "#FF6B9D", categories: ["Performing Arts", "Art"] },
//   { name: "funny", members: "42.2M", visitors: "weekly visitors", description: "Reddit's largest humour depository.", emoji: "😂", color: "#FF4500", categories: ["Performing Arts"] },
//   { name: "FunnyAnimals", members: "1.4M", visitors: "weekly visitors", description: "Funny videos, gifs, and images of animals.", emoji: "🐶", color: "#FFA500", categories: ["Photography", "Art"] },
//   { name: "AskMen", members: "3M", visitors: "weekly visitors", description: "Become a better man by asking questions.", emoji: "👨", color: "#0079D3", categories: ["Personal Finance", "Startups & Entrepreneurship"] },
//   { name: "PersonalFinanceEgypt", members: "1.1K", visitors: "weekly visitors", description: "Finance tips and discussions for Egyptians.", emoji: "💰", color: "#46D160", categories: ["Personal Finance", "Economics", "Stocks & Investing"] },
//   { name: "Megumin", members: "11K", visitors: "weekly visitors", description: "Konosuba's most explosive mage community.", emoji: "💥", color: "#D32F2F", categories: ["PC Gaming", "Console Gaming"] },
//   { name: "webdev", members: "892K", visitors: "weekly visitors", description: "A community for web developers.", emoji: "🌐", color: "#61DAFB", categories: ["Web Development", "Programming"] },
//   { name: "MachineLearning", members: "2.3M", visitors: "weekly visitors", description: "Discuss AI and ML technologies.", emoji: "🤖", color: "#00D9FF", categories: ["AI & Machine Learning", "Data Science", "Programming"] },
//   { name: "CryptoTrading", members: "445K", visitors: "weekly visitors", description: "Cryptocurrency trading discussions.", emoji: "₿", color: "#F7931A", categories: ["Crypto", "Economics", "Stocks & Investing"] },
//   { name: "IndieGaming", members: "156K", visitors: "weekly visitors", description: "Indie game developers and players.", emoji: "🎮", color: "#9C27B0", categories: ["Game Development", "PC Gaming"] },
//   { name: "Cybersecurity", members: "678K", visitors: "weekly visitors", description: "Information security discussions.", emoji: "🔒", color: "#E91E63", categories: ["Cybersecurity", "Programming"] },
//   { name: "RealEstateInvesting", members: "234K", visitors: "weekly visitors", description: "Real estate investment strategies.", emoji: "🏠", color: "#795548", categories: ["Real Estate", "Personal Finance", "Stocks & Investing"] },
// ];

export default function CommunityCard({communities=[]}) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const pageContainerStyle = {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#F5F5F5",
  };

  const contentWrapperStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0",
  };

  const headerStyle = {
    padding: "32px 48px 24px 48px",
    borderBottom: "1px solid #E0E0E0",
    backgroundColor: "#FFFFFF",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: "24px",
  };

  const categoryBarStyle = {
    display: "flex",
    gap: "12px",
    overflowX: "auto",
    paddingBottom: "8px",
    scrollbarWidth: "thin",
    scrollbarColor: "#BDBDBD #F5F5F5",
  };

  const categoryButtonStyle = {
    backgroundColor: "#FFFFFF",
    color: "#0079D3",
    border: "1px solid #0079D3",
    borderRadius: "24px",
    padding: "8px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1A1A1A",
    padding: "32px 48px 20px 48px",
  };

  const wrapperStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "16px",
    padding: "0 48px 48px 48px",
  };

  const cardStyle = {
    backgroundColor: "#FFFFFF",
    border: "1px solid #E0E0E0",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "all 0.2s",
    cursor: "pointer",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const cardHoverStyle = {
    backgroundColor: "#F8F9FA",
    borderColor: "#0079D3",
    boxShadow: "0 4px 12px rgba(0,121,211,0.15)",
  };

  const cardHeaderStyle = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "12px",
  };

  const leftSectionStyle = {
    display: "flex",
    gap: "12px",
    flex: 1,
  };

  const avatarStyle = (color) => ({
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: color,
    color: "#fff",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  });

  const infoSectionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
  };

  const nameStyle = { 
    fontWeight: "bold", 
    fontSize: "16px", 
    color: "#1A1A1A",
  };

  const membersStyle = { 
    fontSize: "13px", 
    color: "#616161",
    fontWeight: "400"
  };

  const descriptionStyle = { 
    fontSize: "14px", 
    color: "#424242", 
    lineHeight: "1.4",
    marginTop: "4px",
    flex: 1
  };

  const joinButtonStyle = {
    backgroundColor: "#0079D3",
    color: "#fff",
    border: "none",
    borderRadius: "24px",
    padding: "6px 16px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s",
    alignSelf: "flex-start",
    flexShrink: 0,
  };

  const noResultsStyle = {
    textAlign: "center",
    padding: "60px 20px",
    color: "#616161",
    fontSize: "16px",
  };

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
    "Photography"
  ];

  // Filter communities based on selected category
const filteredCommunities =
  selectedCategory === "All"
    ? communities
    : communities.filter(
        (community) =>
          community.categories &&
          community.categories.includes(selectedCategory)
      );

  const CommunityCardItem = ({ community }) => {
    const [joined, setJoined] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        style={{
          ...cardStyle,
          ...(isHovered ? cardHoverStyle : {})
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
onClick={() => navigate(`/community`)}
      >
        <div style={cardHeaderStyle}>
          <div style={leftSectionStyle}>
            <div style={avatarStyle(community.color)}>{community.emoji}</div>
            <div style={infoSectionStyle}>
              <div style={nameStyle}>{community.name}</div>
              <div style={membersStyle}>{community.members} {community.visitors}</div>
            </div>
          </div>
          <button
            type="button"
            style={{
              ...joinButtonStyle,
              backgroundColor: joined ? "#F5F5F5" : "#0079D3",
              color: joined ? "#0079D3" : "#fff",
              border: joined ? "1px solid #0079D3" : "none",
            }}
            onClick={(e) => {
              e.stopPropagation();
              setJoined(!joined);
            }}
            onMouseEnter={(e) => {
              if (!joined) {
                e.target.style.backgroundColor = "#1484D6";
              } else {
                e.target.style.backgroundColor = "#E3F2FD";
              }
            }}
            onMouseLeave={(e) => {
              if (!joined) {
                e.target.style.backgroundColor = "#0079D3";
              } else {
                e.target.style.backgroundColor = "#F5F5F5";
              }
            }}
          >
            {joined ? "Joined" : "Join"}
          </button>
        </div>
        <div style={descriptionStyle}>{community.description}</div>
      </div>
    );
  };

  return (
    <div style={pageContainerStyle}>
      <div style={contentWrapperStyle}>
        <div style={headerStyle}>
          <div style={titleStyle}>Explore Communities</div>
          <div style={categoryBarStyle}>
            {categories.map((cat) => (
              <button
                key={cat}
                style={{
                  ...categoryButtonStyle,
                  backgroundColor: selectedCategory === cat ? "#0079D3" : "#FFFFFF",
                  color: selectedCategory === cat ? "#FFFFFF" : "#0079D3",
                }}
                onClick={() => setSelectedCategory(cat)}
                onMouseEnter={(e) => {
                  if (selectedCategory !== cat) {
                    e.target.style.backgroundColor = "#E3F2FD";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== cat) {
                    e.target.style.backgroundColor = "#FFFFFF";
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={sectionTitleStyle}>
          {selectedCategory === "All" ? "Recommended for you" : `${selectedCategory} Communities`}
        </div>

        {filteredCommunities.length > 0 ? (
          <div style={wrapperStyle}>
            {filteredCommunities.map((community) => (
              <CommunityCardItem key={community.name} community={community} />
            ))}
          </div>
        ) : (
          <div style={noResultsStyle}>
            No communities found for "{selectedCategory}". Try selecting a different category.
          </div>
        )}
      </div>
    </div>
  );
}