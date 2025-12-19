import React, { useEffect, useState } from "react";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home({ onOpenCreateCommunity, onOpenCreatePost }) {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [voteCounts, setVoteCounts] = useState({});
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // 🔐 Auth check
  useEffect(() => {
    axios.get(`${API}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  useEffect(() => {
    if (currentUser === undefined) return;

    const loadFeed = async () => {
      setLoading(true);
      try {
        let communities = [];
        if (currentUser) {
          const commRes = await axios.get(`${API}/users/communities`, { withCredentials: true });
          communities = commRes.data || [];
        } else {
          const commRes = await axios.get(`${API}/communities`);
          communities = (commRes.data || []).filter(c => c.privacystate === "public");
        }

        if (!communities.length) {
          setPosts([]);
          setLoading(false);
          return;
        }

        const postsArrays = await Promise.all(
          communities.map(c =>
            axios.get(`${API}/posts/community/${c._id}`, { withCredentials: true })
              .then(r => r.data)
              .catch(() => [])
          )
        );

        const mergedPosts = Array.from(
          new Map(
            postsArrays
              .flat()
              .map(post => [post._id, post])
          ).values()
        ).sort((a, b) => new Date(b.date) - new Date(a.date));

        const initialVotes = {};
        mergedPosts.forEach(p => {
          initialVotes[p._id] = { upvoteCount: p.upvoteCount || 0, downvoteCount: p.downvoteCount || 0 };
        });

        setPosts(mergedPosts);
        setVoteCounts(initialVotes);
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, [currentUser]);

  const searchFunction = async (query) => {
    if (!query || !query.trim()) return { results: [], renderItem: null };

    try {
      const userRes = await axios.get(`${API}/users`);
      const users = (userRes.data || [])
        .filter(u => u.userName?.toLowerCase().startsWith(query.toLowerCase()) && u._id !== currentUser?._id)
        .map(u => ({ type: "user", id: u._id, label: u.userName, avatar: u.image }));

      const commRes = await axios.get(`${API}/communities`);
      const communities = (commRes.data || [])
        .filter(c => c.commName?.toLowerCase().startsWith(query.toLowerCase()))
        .map(c => ({ type: "community", id: c._id, label: c.commName, image: c.image }));

      const results = [...users, ...communities];

      const renderItem = (item) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={item.avatar || item.image || "https://i.pravatar.cc/32"}
            alt=""
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <span>{item.label} ({item.type})</span>
        </div>
      );

      return { results, renderItem };
    } catch (err) {
      console.error("Search error:", err);
      return { results: [], renderItem: null };
    }
  };

  return (
    <div className="homeContainer">
      <div className="topNavbar">
        <PrimarySearchAppBar
          loggedin={!!currentUser}
          searchFunction={searchFunction}
          onResultClick={(item) => {
            if (item.type === "user") navigate(`/profile/${item.id}`);
            else if (item.type === "community") navigate(`/community/${item.id}`);
          }}
          onOpenCreatePost={onOpenCreatePost}
        />
      </div>

      <div className="leftSidebar">
        <SidebarLeft
          onOpenCreateCommunity={onOpenCreateCommunity}
          onOpenCreatePost={onOpenCreatePost}
        />
      </div>

      <div className="mainFeed">
        <div className="feedWrapper">
          {loading || currentUser === undefined ? (
            <div className="loadingPosts">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div
              style={{
                padding: "60px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#E5E7EB",
                textAlign: "center"
              }}
            >
              <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
                {currentUser
                  ? "No posts found in your communities."
                  : "No public communities available."}
              </h3>
              <p style={{ fontSize: "14px", color: "#9CA3AF", marginTop: "6px" }}>
                {currentUser
                  ? "Join more communities or create your own to start seeing posts!"
                  : "Sign up or log in to join communities and view posts."}
              </p>
              {currentUser && (
                <button
                   onClick={() => navigate("/Explore")}
                  style={{
                    marginTop: "20px",
                    padding: "10px 24px",
                    borderRadius: "24px",
                    border: "none",
                    backgroundColor: "#4c6ef5",
                    color: "#fff",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseOver={e => (e.currentTarget.style.backgroundColor = "#3b5bd4")}
                  onMouseOut={e => (e.currentTarget.style.backgroundColor = "#4c6ef5")}
                >
                  Explore Communities
                </button>
              )}
            </div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post._id}
                id={post._id}
                user_name={`u/${post.user?.userName || "Unknown"}`}
                user_avatar={post.user?.userName[0] || "https://i.pravatar.cc/48?img=1"}
                description={post.description}
                title={post.title}
                images={post.images || []}
                comments={post.comments}
                upvoteCount={voteCounts[post._id]?.upvoteCount || 0}
                downvoteCount={voteCounts[post._id]?.downvoteCount || 0}
                commentCount={post.commentCount || 0}
                date={post.date}
                community_name={`b/${post.community_name || "unknown"}`}
                communityId={post.communityID?._id || post.communityID}
                edited={post.edited || false}
                currentUser={currentUser}
                poll={post.poll}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
