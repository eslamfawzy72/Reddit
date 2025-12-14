import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import axios from "axios";

function Popular() {
  const API = import.meta.env.VITE_API_URL;

  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const POPULARITY_THRESHOLD = 5;

  // 🔐 AUTH CHECK — SINGLE SOURCE OF TRUTH
  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null))
      .finally(() => setAuthChecked(true));
  }, []);

  // 📈 POPULAR FEED LOGIC
  useEffect(() => {
    if (!authChecked) return;

    const loadPopularFeed = async () => {
      setLoading(true);
      try {
        // ---------------- 🔴 NOT LOGGED IN ----------------
        if (!currentUser) {
          const commRes = await axios.get(`${API}/communities`);

          const publicCommunities = (commRes.data || []).filter(
            c => c.privacystate === "public"
          );

          const postsArrays = await Promise.all(
            publicCommunities.map(c =>
              axios
                .get(`${API}/posts/community/${c._id}`)
                .then(r => r.data)
                .catch(() => [])
            )
          );

          const allPosts = postsArrays.flat();

          const popularPosts = allPosts.filter(
            p =>
              (p.upvoteCount || 0) + (p.commentCount || 0) >=
              POPULARITY_THRESHOLD
          );

          popularPosts.sort(
            (a, b) =>
              (b.upvoteCount || 0) + (b.commentCount || 0) -
              ((a.upvoteCount || 0) + (a.commentCount || 0))
          );

          setPosts(popularPosts);
          return;
        }

        // ---------------- 🟢 LOGGED IN ----------------
        const commRes = await axios.get(
          `${API}/users/communities`,
          { withCredentials: true }
        );

        const joinedCommunities = commRes.data || [];

        // 🚫 LOGGED IN BUT NO COMMUNITIES → SAME AS LOGGED OUT
        if (joinedCommunities.length === 0) {
          const publicCommRes = await axios.get(`${API}/communities`);
          const publicCommunities = (publicCommRes.data || []).filter(
            c => c.privacystate === "public"
          );

          const postsArrays = await Promise.all(
            publicCommunities.map(c =>
              axios
                .get(`${API}/posts/community/${c._id}`)
                .then(r => r.data)
                .catch(() => [])
            )
          );

          const allPosts = postsArrays.flat();

          const popularPosts = allPosts.filter(
            p =>
              (p.upvoteCount || 0) + (p.commentCount || 0) >=
              POPULARITY_THRESHOLD
          );

          popularPosts.sort(
            (a, b) =>
              (b.upvoteCount || 0) + (b.commentCount || 0) -
              ((a.upvoteCount || 0) + (a.commentCount || 0))
          );

          setPosts(popularPosts);
          return;
        }

        // 🟢 JOINED COMMUNITIES POSTS (ALL)
        const joinedPosts = (
          await Promise.all(
            joinedCommunities.map(c =>
              axios
                .get(`${API}/posts/community/${c._id}`)
                .then(r => r.data)
                .catch(() => [])
            )
          )
        ).flat();

        // 🟢 PUBLIC (NOT JOINED) → POPULAR ONLY
        const allCommRes = await axios.get(`${API}/communities`);
        const publicNotJoined = (allCommRes.data || []).filter(
          c =>
            c.privacystate === "public" &&
            !joinedCommunities.some(j => j._id === c._id)
        );

        const publicPosts = (
          await Promise.all(
            publicNotJoined.map(c =>
              axios
                .get(`${API}/posts/community/${c._id}`)
                .then(r => r.data)
                .catch(() => [])
            )
          )
        ).flat();

        const popularPublicPosts = publicPosts.filter(
          p =>
            (p.upvoteCount || 0) + (p.commentCount || 0) >=
            POPULARITY_THRESHOLD
        );

        const merged = [...joinedPosts, ...popularPublicPosts];
        merged.sort(
          (a, b) =>
            (b.upvoteCount || 0) + (b.commentCount || 0) -
            ((a.upvoteCount || 0) + (a.commentCount || 0))
        );

        setPosts(merged);
      } catch (err) {
        console.error("Popular feed error:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPopularFeed();
  }, [authChecked, currentUser]);

  // ---------------- UI ----------------
  return (
    <Box sx={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <PrimarySearchAppBar loggedin={!!currentUser} />
      </Box>

      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: 0,
          width: { xs: 0, sm: 290 },
          height: "calc(100vh - 64px)",
          bgcolor: "white",
          borderRight: "1px solid #edeff1",
          zIndex: 1200,
        }}
      >
        <SidebarLeft loggedin={!!currentUser} />
      </Box>

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
        <Box sx={{ maxWidth: "960px", mx: "auto", display: "flex", flexDirection: "column", gap: 3 }}>
          {!authChecked || loading ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Loading popular posts...</Typography>
            </Box>
          ) : posts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10, color: "#666" }}>
              <Typography variant="h6">No popular posts yet</Typography>
              <Typography>Be the spark ⚡</Typography>
            </Box>
          ) : (
            posts.map(post => (
              <PostCard
                key={post._id}
                id={post._id}
                user_name={post.user?.userName || "Anonymous"}
                user_avatar={post.user?.image || "https://i.pravatar.cc/48?img=1"}
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
