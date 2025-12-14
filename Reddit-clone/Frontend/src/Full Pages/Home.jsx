import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import axios from "axios";
import "../styles/home.css";

// ---------------- SEARCH MOCKS (UNCHANGED) ----------------
const mockPosts = [];
const mockCommunities = [];
const mockUsers = [];

const renderCommunity = (c) => (
  <div className="communityItem">
    <div className="communityIcon">{c.icon}</div>
    <div>
      <div className="communityName">{c.display}</div>
      <div className="communityMembers">{c.members} members</div>
    </div>
  </div>
);

const renderUser = (u) => (
  <div className="userItem">
    <div className="userIcon">{u.icon}</div>
    <div>
      <div className="userName">{u.display}</div>
      <div className="userKarma">• {u.karma} karma</div>
    </div>
  </div>
);

export const searchEverything = (query) => {
  if (!query?.trim()) return { results: [], renderItem: null };
  const q = query.toLowerCase();

  const comms = mockCommunities
    .filter(c => c.name.includes(q))
    .map(c => ({ ...c, score: c.name.startsWith(q) ? 100 : 50 }));

  const users = mockUsers
    .filter(u => u.name.includes(q))
    .map(u => ({ ...u, score: u.name.startsWith(q) ? 90 : 40 }));

  const results = [...comms, ...users]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return {
    results,
    renderItem: (item) =>
      item.type === "user" ? renderUser(item) : renderCommunity(item),
  };
};

// ---------------- HOME ----------------
function Home() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL;

  // 🔐 AUTH TRUTH — SINGLE SOURCE OF REALITY
  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  // 🟢 LOGGED IN → USER COMMUNITIES ONLY
  useEffect(() => {
    if (!currentUser) return;

    const loadUserFeed = async () => {
      setLoading(true);
      try {
        const commRes = await axios.get(
          `${API}/users/communities`,
          { withCredentials: true }
        );

        const communities = commRes.data || [];

        // 🚫 NO COMMUNITIES = NO POSTS
        if (communities.length === 0) {
          setPosts([]);
          setLoading(false);
          return;
        }

        const postsArrays = await Promise.all(
          communities.map(c =>
            axios
              .get(`${API}/posts/community/${c._id}`)
              .then(r => r.data)
              .catch(() => [])
          )
        );

        const mergedPosts = postsArrays.flat();
        mergedPosts.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setPosts(mergedPosts);
      } catch (err) {
        console.error("User feed error:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserFeed();
  }, [currentUser]);

  // 🔴 NOT LOGGED IN → PUBLIC COMMUNITIES ONLY
  useEffect(() => {
    if (currentUser !== null) return;

    const loadPublicFeed = async () => {
      setLoading(true);
      try {
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

        const mergedPosts = postsArrays.flat();
        mergedPosts.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setPosts(mergedPosts);
      } catch (err) {
        console.error("Public feed error:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPublicFeed();
  }, [currentUser]);

  // ---------------- UI ----------------
  return (
    <div className="homeContainer">
      <div className="topNavbar">
        <PrimarySearchAppBar
          loggedin={!!currentUser}
          searchFunction={searchEverything}
        />
      </div>

      <div className="leftSidebar">
        <SidebarLeft loggedin={!!currentUser} />
      </div>

      <div className="mainFeed">
        <div className="feedWrapper">
          {loading ? (
            <div className="loadingPosts">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="loadingPosts">
              {currentUser
                ? "Join some communities to personalize your feed."
                : "Welcome! Showing posts from public communities."}
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post._id}
                id={post._id}
                user_name={post.user?.userName || "Unknown User"}
                user_avatar={
                  post.user?.image ||
                  "https://i.pravatar.cc/48?img=1"
                }
                description={post.description}
                images={post.images || []}
                comments={post.comments}
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
        </div>
      </div>
    </div>
  );
}

export default Home;
