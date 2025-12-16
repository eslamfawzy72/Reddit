import React, { useEffect, useState } from "react";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [voteCounts, setVoteCounts] = useState({});
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // 🔐 Auth check
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, []);

 

 

  // 🟢 Load feed
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
            axios.get(`${API}/posts/community/${c._id}`)
              .then(r => r.data)
              .catch(() => [])
          )
        );

        const mergedPosts = postsArrays.flat().sort((a, b) => new Date(b.date) - new Date(a.date));

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

  // 🔥 Upvote/downvote handling
  const handleVote = (postId, voteData) => {
    const { upvoteCount, downvoteCount } = voteData;
    setVoteCounts(prev => ({ ...prev, [postId]: { upvoteCount, downvoteCount } }));
  };

  // 🔍 Search function for PrimarySearchAppBar
 const searchFunction = async (query) => {
  if (!query || !query.trim()) return { results: [], renderItem: null }; // ✅ always return object

  try {
    // fetch users
    const userRes = await axios.get(`${API}/users`);
    const users = (userRes.data || [])
      .filter(u => u.userName?.toLowerCase().includes(query.toLowerCase()))
      .map(u => ({ type: "user", id: u._id, label: u.userName, avatar: u.image }));

    // fetch communities
    const commRes = await axios.get(`${API}/communities`);
    const communities = (commRes.data || [])
      .filter(c => c.commName?.toLowerCase().includes(query.toLowerCase()))
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
    return { results: [], renderItem: null }; // ✅ fallback
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
        />
      </div>

      <div className="leftSidebar">
        <SidebarLeft loggedin={!!currentUser} />
      </div>

      <div className="mainFeed">
        <div className="feedWrapper">
          {loading || currentUser === undefined ? (
            <div className="loadingPosts">Loading posts...</div>
          ) : (
            posts.map(post => (
  <PostCard
    key={post._id}
    id={post._id}
    user_name={`u/${post.user?.userName || "Unknown"}`}
    user_avatar={post.user?.image || "https://i.pravatar.cc/48?img=1"}
    description={post.description}
       title={post.title}
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
