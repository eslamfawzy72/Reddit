import { height } from "@mui/system";
import React from "react";


export default function CommunityHeader() {
  const pageStyle = {
    backgroundColor: "#0d0d0d",
    color: "#fff",
    height: "60vh",
    display: "flex",
    width : "100%",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  };

  // Centered banner photo
  const topImageStyle = {
    width: "100%",                // takes full width of its container
    height: "70%",              // taller banner
    borderRadius: "12px",         // rounded edges for a card look
    margin: "0 auto 40px auto",   // centers horizontally + spacing below
    backgroundImage: 'url("https://images.unsplash.com/photo-1503264116251-35a269479413")',
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height : '30%',
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: "20px 30px",
    borderRadius: "12px",
  };

  const leftGroupStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const avatarStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#0055aa",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "12px",
  };

  const buttonStyle = {
    backgroundColor: "#0055aa",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "8px 16px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.2s",
  };

  const iconButtonStyle = {
    backgroundColor: "#0055aa",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
  };

  const handleCreatePost = () => alert("Create Post clicked!");
  const handleJoin = () => alert("Join clicked!");
  const handleOptions = () => alert("Options clicked!");

  return (
    <div style={pageStyle}>
      {/* Centered group photo */}
      <div style={topImageStyle}></div>

      {/* Centered header */}
      <div style={headerStyle}>
        {/* Left side: Avatar + Title */}
        <div style={leftGroupStyle}>
          <div style={avatarStyle}>JH</div>
          <div style={titleStyle}>r/janahasheesh</div>
        </div>

        {/* Right side: Buttons */}
        <div style={buttonGroupStyle}>
          <button
            style={buttonStyle}
            onClick={handleCreatePost}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0066cc")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0055aa")}
          >
            Create Post
          </button>
          <button
            style={buttonStyle}
            onClick={handleJoin}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0066cc")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0055aa")}
          >
            Join
          </button>
          <button
            style={iconButtonStyle}
            onClick={handleOptions}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0066cc")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#0055aa")}
          >
            ⋮
          </button>
        </div>
      </div>
    </div>
  );
}