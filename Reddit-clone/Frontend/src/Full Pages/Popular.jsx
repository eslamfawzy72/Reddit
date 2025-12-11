// src/pages/Popular.jsx
import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import { useLocation } from "react-router-dom";
import axios from "axios";

function Popular() {
  const location = useLocation();
  const isLoggedIn = location.state?.isLoggedIn || location.state?.loggedin || false;

  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1️⃣ Fetch logged-in user
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => {
        console.log("Not logged in");
        setLoading(false);
      });
  }, []);

  // 2️⃣ Fetch posts from user's joined communities
useEffect(() => {
  if (!currentUser) return;

  (async () => {
    try {
      // 1️⃣ Fetch all communities
      const commRes = await axios.get(`${import.meta.env.VITE_API_URL}/communities`, {
        withCredentials: true,
      });
      const allCommunities = commRes.data || [];

      // 2️⃣ Split communities: joined vs public (not joined)
      const joinedCommunities = allCommunities.filter(c => c.isJoined);
      const publicCommunities = allCommunities.filter(
        c => !c.isJoined && c.privacystate === "public"
      );

      // 3️⃣ Fetch posts for joined communities
      const joinedPostsPromises = joinedCommunities.map(c =>
        axios.get(`${import.meta.env.VITE_API_URL}/posts/community/${c._id}`)
          .then(res => res.data)
          .catch(() => [])
      );
      const joinedPostsArrays = await Promise.all(joinedPostsPromises);
      const joinedPosts = joinedPostsArrays.flat();

      // 4️⃣ Fetch posts for public communities
      const publicPostsPromises = publicCommunities.map(c =>
        axios.get(`${import.meta.env.VITE_API_URL}/posts/community/${c._id}`)
          .then(res => res.data)
          .catch(() => [])
      );
      const publicPostsArrays = await Promise.all(publicPostsPromises);
      const publicPosts = publicPostsArrays.flat();

      // 5️⃣ Filter public posts by popularity threshold
      const POPULARITY_THRESHOLD = 5; // adjust as needed
      const filteredPublicPosts = publicPosts.filter(
        p => (p.upvoteCount || 0) + (p.commentCount || 0) >= POPULARITY_THRESHOLD
      );

      // 6️⃣ Merge all posts and sort by popularity (upvotes + comments)
      const mergedPosts = [...joinedPosts, ...filteredPublicPosts];
      mergedPosts.sort(
        (a, b) =>
          (b.upvoteCount || 0) + (b.commentCount || 0) -
          ((a.upvoteCount || 0) + (a.commentCount || 0))
      );

      setPosts(mergedPosts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching popular posts:", err);
      setPosts([]);
      setLoading(false);
    }
  })();
}, [currentUser]);


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
                user_avatar={post.user?.image || post.user_avatar || "https://i.pravatar.cc/48?img=1"}
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
