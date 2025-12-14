import React, { useEffect, useState } from "react";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import axios from "axios";
import "../styles/home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [voteCounts, setVoteCounts] = useState({});

  const API = import.meta.env.VITE_API_URL;

  // Auth check
  useEffect(() => {
    axios.get(`${API}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, []);

  // Load feed
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
            axios.get(`${API}/posts/community/${c._id}`).then(r => r.data).catch(() => [])
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

  const handleVote = async (postId, voteData) => {
    const { upvoteCount, downvoteCount, userVote } = voteData;
    setVoteCounts(prev => ({ ...prev, [postId]: { upvoteCount, downvoteCount } }));
  };

  return (
    <div className="homeContainer">
      <div className="topNavbar"><PrimarySearchAppBar loggedin={!!currentUser} /></div>
      <div className="leftSidebar"><SidebarLeft loggedin={!!currentUser} /></div>
      <div className="mainFeed">
        <div className="feedWrapper">
          {loading || currentUser === undefined ? (
            <div className="loadingPosts">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="loadingPosts">{currentUser ? "Join communities to see posts." : "No public posts found."}</div>
          ) : (
            posts.map(post => (
              <PostCard
                key={post._id}
                id={post._id}
                user_name={post.user?.userName || "Unknown User"}
                user_avatar={post.user?.image || "https://i.pravatar.cc/48?img=1"}
                description={post.description}
                images={post.images || []}
                comments={post.comments}
                upvoteCount={voteCounts[post._id]?.upvoteCount || 0}
                downvoteCount={voteCounts[post._id]?.downvoteCount || 0}
                commentCount={post.commentCount || 0}
                date={post.date}
                community_name={post.community_name || "b/unknown"}
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

export default Home;
