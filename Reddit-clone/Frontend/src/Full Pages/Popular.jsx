import React, { useEffect, useState } from "react";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const POPULARITY_THRESHOLD = 5;

function Popular() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [voteCounts, setVoteCounts] = useState({});

  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // 🔐 Auth check
  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  // 🟢 Load popular posts
  useEffect(() => {
    if (currentUser === undefined) return;

    const loadPopular = async () => {
      setLoading(true);
      try {
        let joinedCommunities = [];

        if (currentUser) {
          const res = await axios.get(`${API}/users/communities`, { withCredentials: true });
          joinedCommunities = res.data || [];
        }

        // Posts from joined communities
        const joinedPostsArrays = await Promise.all(
          joinedCommunities.map(c =>
            axios.get(`${API}/posts/community/${c._id}`).then(r => r.data).catch(() => [])
          )
        );

        // Posts from public communities not joined
        const allCommRes = await axios.get(`${API}/communities`);
        const publicNotJoined = (allCommRes.data || []).filter(
          c => c.privacystate === "public" &&
               !joinedCommunities.some(j => j._id === c._id)
        );

        const publicPostsArrays = await Promise.all(
          publicNotJoined.map(c =>
            axios.get(`${API}/posts/community/${c._id}`).then(r => r.data).catch(() => [])
          )
        );

        const allPosts = [...joinedPostsArrays.flat(), ...publicPostsArrays.flat()];

        // Apply popularity threshold
        const popularPosts = allPosts.filter(
          p => ((p.upvoteCount || 0) + (p.commentCount || 0)) >= POPULARITY_THRESHOLD
        );

        popularPosts.sort(
          (a, b) => ((b.upvoteCount || 0) + (b.commentCount || 0)) - ((a.upvoteCount || 0) + (a.commentCount || 0))
        );

        // Initialize vote counts
        const initialVotes = {};
        popularPosts.forEach(p => {
          initialVotes[p._id] = { upvoteCount: p.upvoteCount || 0, downvoteCount: p.downvoteCount || 0 };
        });

        setPosts(popularPosts);
        setVoteCounts(initialVotes);
      } catch (err) {
        console.error(err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPopular();
  }, [currentUser]);

  // 🔥 Handle vote
  const handleVote = async (postId, type, prevVote) => {
    if (!currentUser) return;

    // Optimistic update
    setVoteCounts(prev => {
      const current = prev[postId] || { upvoteCount: 0, downvoteCount: 0 };
      let up = current.upvoteCount;
      let down = current.downvoteCount;

      if (type === "upvote") {
        if (prevVote === "upvote") up -= 1;
        else if (prevVote === "downvote") { up += 1; down -= 1; }
        else up += 1;
      } else if (type === "downvote") {
        if (prevVote === "downvote") down -= 1;
        else if (prevVote === "upvote") { up -= 1; down += 1; }
        else down += 1;
      }

      return { ...prev, [postId]: { upvoteCount: up, downvoteCount: down } };
    });

    try {
      const res = await axios.patch(
        `${API}/posts/${postId}`,
        { action: type },
        { withCredentials: true }
      );

      setVoteCounts(prev => ({
        ...prev,
        [postId]: { upvoteCount: res.data.upvoteCount, downvoteCount: res.data.downvoteCount }
      }));
    } catch (err) {
      console.error(err);
      // optional: revert optimistic update
    }
  };

  // 🔍 Search function for PrimarySearchAppBar
  const searchFunction = async (query) => {
    if (!query || !query.trim()) return { results: [], renderItem: null };

    try {
      // Users
      const userRes = await axios.get(`${API}/users`);
      const users = (userRes.data || [])
        .filter(u => u.userName?.toLowerCase().includes(query.toLowerCase()))
        .map(u => ({ type: "user", id: u._id, label: u.userName }));

      // Communities
      const commRes = await axios.get(`${API}/communities`);
      const communities = (commRes.data || [])
        .filter(c => c.commName?.toLowerCase().includes(query.toLowerCase()))
        .map(c => ({ type: "community", id: c._id, label: c.commName }));

      const results = [...users, ...communities];

      const renderItem = (item) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", backgroundColor: "#4c6ef5",
            display: "flex", justifyContent: "center", alignItems: "center",
            fontWeight: "bold", color: "#fff", textTransform: "uppercase"
          }}>{item.label[0]}</div>
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
          searchFunction={searchFunction}
          onResultClick={(item) => {
            if (item.type === "user") navigate(`/profile/${item.id}`);
            else if (item.type === "community") navigate(`/community/${item.id}`);
          }}
        />
      </div>

      <div className="leftSidebar"><SidebarLeft loggedin={!!currentUser} /></div>

      <div className="mainFeed">
        <div className="feedWrapper">
          {loading || currentUser === undefined ? (
            <div className="loadingPosts">Loading popular posts...</div>
          ) : posts.length === 0 ? (
            <div className="loadingPosts">No popular posts available.</div>
          ) : (
            posts.map(post => (
  <PostCard
    key={post._id}
    id={post._id}
    user_name={`u/${post.user?.userName || "Unknown"}`}
    user_avatar={post.user?.image || "https://i.pravatar.cc/48?img=1"}
    description={post.description}
    images={post.images || []}
    comments={post.comments}
    upvoteCount={voteCounts[post._id]?.upvoteCount || 0}
    downvoteCount={voteCounts[post._id]?.downvoteCount || 0}
    commentCount={post.commentCount || 0}
    date={post.date}
    community_name={`b/${post.commName || "unknown"}`}
    edited={post.edited || false}
    onVote={handleVote}
    currentUser={currentUser}
  />
))

          )}
        </div>
      </div>
    </div>
  );
}

export default Popular;
