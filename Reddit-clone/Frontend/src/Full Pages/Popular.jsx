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
<<<<<<< HEAD

import "../styles/Popular.css";

// Mock data
const users = [
  { id: "u1", name: "ahmed_dev", avatar: "https://i.pravatar.cc/48?img=3" },
  { id: "u2", name: "mariam_codes", avatar: "https://i.pravatar.cc/48?img=12" },
  { id: "u3", name: "john_dev", avatar: "https://i.pravatar.cc/48?img=5" },
  { id: "u4", name: "sara_web", avatar: "https://i.pravatar.cc/48?img=7" },
  { id: "u5", name: "bluecoder", avatar: "https://i.pravatar.cc/48?img=8" },
];

const communities = [
  { id: "c1", name: "funny", display: "b/funny" },
  { id: "c2", name: "webdev", display: "b/webdev" },
  { id: "c3", name: "movies", display: "b/movies" },
  { id: "c4", name: "gaming", display: "b/gaming" },
];

const randomImages = [
  "https://source.unsplash.com/random/800x600?funny,meme",
  "https://source.unsplash.com/random/1200x800?movie,cinema",
  "https://source.unsplash.com/random/800x600?coding,tech",
  "https://source.unsplash.com/random/800x600?game,play",
  "https://source.unsplash.com/random/1200x800?landscape,nature",
];

// Generate posts
const generateMockPosts = (num = 50) => {
  const posts = [];
  for (let i = 0; i < num; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const community = communities[Math.floor(Math.random() * communities.length)];
    const imgCount = Math.floor(Math.random() * 3);
    const images = Array.from({ length: imgCount }, () => randomImages[Math.floor(Math.random() * randomImages.length)]);
    const upvotes = Math.floor(Math.random() * 1000);
    const downvotes = Math.floor(Math.random() * 50);
    const comments = Array.from({ length: Math.floor(Math.random() * 10) }, (_, idx) => ({
      userID: users[Math.floor(Math.random() * users.length)].id,
      username: users[Math.floor(Math.random() * users.length)].name,
      text: "Random comment " + idx,
      edited: false,
      upvotedCount: Math.floor(Math.random() * 20),
      downvotedCount: Math.floor(Math.random() * 5),
      _id: `${i}-${idx}`,
      date: new Date(Date.now() - Math.random() * 1e10).toISOString(),
    }));

    posts.push({
      _id: `post-${i}`,
      userId: user.id,
      user_name: user.name,
      user_avatar: user.avatar,
      description: `This is mock post #${i} by ${user.name}`,
      images,
      edited: false,
      upvoteCount: upvotes,
      downvoteCount: downvotes,
      commentCount: comments.length,
      comments,
      date: new Date(Date.now() - Math.random() * 1e10).toISOString(),
      community_name: community.display,
      categories: [community.name],
    });
  }
  return posts;
};

const sortByPopularity = (posts) => posts.sort((a, b) => (b.upvoteCount + b.commentCount) - (a.upvoteCount + a.commentCount));

function Popular() {
  const [posts] = useState(sortByPopularity(generateMockPosts(50)));
  const location = useLocation();
  const loggedinpage = location.state?.loggedin ?? false;

  return (
    <Box className="popular-bg">
      <Box className="popular-topbar">
        <PrimarySearchAppBar loggedin={loggedinpage} />
      </Box>

      <Box className="popular-sidebar">
        <SidebarLeft loggedin={loggedinpage} />
      </Box>

      <Box className="popular-content">
        <Box className="popular-posts-wrapper">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              user_name={post.user_name}
              user_avatar={post.user_avatar}
              description={post.description}
              images={post.images}
              comments={post.comments}
              upvoteCount={post.upvoteCount}
              downvoteCount={post.downvoteCount}
              commentCount={post.commentCount}
              date={post.date}
              community_name={post.community_name}
              categories={post.categories}
              edited={post.edited}
            />
          ))}
=======
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
>>>>>>> b36b3c103fd90eae266efdd76797564a63c5acd4
        </Box>
      </Box>
    </Box>
  );
}

export default Popular;