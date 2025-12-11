import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import { useLocation } from "react-router-dom";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import axios from "axios";
import "../styles/home.css"; // Import the CSS

// Mock data
const mockPosts = [ /* keep your mockPosts here */ ];
const mockCommunities = [ /* keep your mockCommunities here */ ];
const mockUsers = [ /* keep your mockUsers here */ ];

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
  const location = useLocation();
  const isLoggedIn = location.state?.isLoggedIn || false;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/posts`)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);

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
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
