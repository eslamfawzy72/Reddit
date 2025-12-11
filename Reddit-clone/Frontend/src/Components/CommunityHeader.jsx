import React from "react";
import { Box, Button, Avatar, Typography } from "@mui/material";
import "../styles/communityHeader.css";

export default function CommunityHeader({
  name = "Community Name",
  avatar = "JH",
  banner = "https://images.unsplash.com/photo-1503264116251-35a269479413",
  membersCount = 0,
  onlineCount = 0,
  onCreatePost = () => {},
  onJoin = () => {},
}) {
  return (
    <Box className="community-header">
      {/* Banner Image */}
      <Box
        className="community-banner"
        style={{ backgroundImage: `url(${banner})` }}
      />

      {/* Header Content */}
      <Box className="community-header-content">
        {/* Left: Avatar + Name */}
        <Box className="community-left">
          <Avatar className="community-avatar">{avatar}</Avatar>

          <Box>
            <Typography variant="h5" className="community-name">
              r/{name}
            </Typography>
            <Typography variant="body2" className="community-meta">
              {membersCount.toLocaleString()} members •{" "}
              {onlineCount.toLocaleString()} online
            </Typography>
          </Box>
        </Box>

        {/* Right: Buttons */}
        <Box className="community-buttons">
          <Button className="btn-create-post" onClick={onCreatePost}>
            Create Post
          </Button>
          <Button className="btn-join" onClick={onJoin}>
            Join
          </Button>
          <Button className="btn-options">⋮</Button>
        </Box>
      </Box>
    </Box>
  );
}
