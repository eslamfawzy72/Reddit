import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import { useLocation } from "react-router-dom";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import axios from "axios";
import "../styles/home.css"; // Import the CSS

// Mock data
const mockPosts = [ /* keep your mockPosts here */];
const mockCommunities = [ /* keep your mockCommunities here */];
const mockUsers = [ /* keep your mockUsers here */];

// Render helpers
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

// Search function
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
    renderItem: (item) => (item.type === 'user' ? renderUser(item) : renderCommunity(item)),
  };
};

function Home() {
  console.log("Rendering Home component");
  const location = useLocation();
  const isLoggedIn = location.state?.isLoggedIn || false;
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const handleVoteUpdate = ({ postId, upvoteCount, downvoteCount }) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId
          ? { ...post, upvoteCount, downvoteCount }
          : post
      )
    );
  };
  useEffect(() => {
    axios.get("http://localhost:5000/auth/me")
      .then(res => setCurrentUser(res.data.user))
      .catch(() => console.log("Not logged in"));
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    (async () => {
      try {
        // 1️⃣ Get the communities the user has joined
        const commRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/communities`,
          { withCredentials: true }
        );
        const communities = commRes.data;
        communities.forEach(element => {
          console.log(element)
        });

        if (!communities || communities.length === 0) {
          setPosts([]); // no communities → empty feed
          return;
        }

        // 2️⃣ Fetch posts from all communities in parallel
        const allPostsPromises = communities.map(c =>
          axios.get(`${import.meta.env.VITE_API_URL}/posts/community/${c._id}`)
            .then(r => r.data)
            .catch(() => []) // ignore errors for individual communities
        );

        const postsArrays = await Promise.all(allPostsPromises);

        // 3️⃣ Flatten and sort by date descending
        const mergedPosts = postsArrays.flat();
        mergedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // 4️⃣ Update state
        setPosts(mergedPosts);

      } catch (err) {
        console.error("Error fetching feed:", err);
      }
    })();
  }, [currentUser]);


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/users`, { withCredentials: true })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="homeContainer">
      <div className="topNavbar">
        <PrimarySearchAppBar loggedin={isLoggedIn} searchFunction={searchEverything} />
      </div>

      <div className="leftSidebar">
        <SidebarLeft loggedin={isLoggedIn} />
      </div>

      <div className="mainFeed">
        <div className="feedWrapper">
          {posts.length === 0 ? (
            <div className="loadingPosts">Loading posts...</div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                user_name={post.user?.userName || "Unknown User"}
                user_avatar={post.user?.image || "https://i.pravatar.cc/48?img=1"}
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
                onVote={handleVoteUpdate}

              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
