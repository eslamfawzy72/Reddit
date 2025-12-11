// src/pages/Popular.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import { useLocation } from "react-router-dom";
import axios from "axios";

// Sort by popularity: upvotes + comments (same as your mock)
const sortByPopularity = (posts) => {
  return [...posts].sort((a, b) => {
    const scoreA = (a.upvoteCount || 0) + (a.commentCount || 0);
    const scoreB = (b.upvoteCount || 0) + (b.commentCount || 0);
    return scoreB - scoreA;
  });
};

function Popular() {
  // EXACTLY how you do it in Home.jsx
  const location = useLocation();
  const isLoggedIn = location.state?.isLoggedIn || false;
  // Note: if you use "loggedin" in some places and "isLoggedIn" in others,
  // this line handles both safely:
  // const isLoggedIn = location.state?.isLoggedIn || location.state?.loggedin || false;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/posts`)
      .then((res) => {
        const sortedPosts = sortByPopularity(res.data);
        setPosts(sortedPosts);
      })
      .catch((err) => {
        console.error("Failed to fetch posts:", err);
        setPosts([]); // or fallback to mockPosts if you want
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      {/* Top Navbar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <PrimarySearchAppBar loggedin={isLoggedIn} />
      </Box>

      {/* Left Sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: 0,
          width: { xs: 0, sm: 290 },
          height: "calc(100vh - 64px)",
          bgcolor: "white",
          borderRight: "1px solid #edeff1",
          overflow: "hidden",
          zIndex: 1200,
        }}
      >
        <SidebarLeft loggedin={isLoggedIn} />
      </Box>

      {/* Main Content Feed */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: { xs: 0, sm: 260 },
          right: 0,
          bottom: 0,
          overflowY: "auto",
          bgcolor: "#f5f5f5",
          px: { xs: 2, sm: 4 },
          py: 3,
        }}
      >
        <Box
          sx={{
            maxWidth: "960px",
            mx: "auto",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {loading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading popular posts...</Typography>
            </Box>
          ) : posts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10, color: "#666" }}>
              <Typography variant="h6">No posts yet</Typography>
              <Typography>Be the first to post something viral!</Typography>
            </Box>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                user_name={post.user?.userName || post.user_name || "Anonymous"}
                user_avatar={
                  post.user?.image ||
                  post.user_avatar ||
                  "https://i.pravatar.cc/48?img=1"
                }
                description={post.description}
                images={post.images || []}
                comments={post.comments || []}
                upvoteCount={post.upvoteCount || 0}
                downvoteCount={post.downvoteCount || 0}
                commentCount={post.commentCount || 0}
                date={post.date}
                community_name={post.community_name || "b/unknown"}
                categories={post.categories || []}
                edited={post.edited || false}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Popular;