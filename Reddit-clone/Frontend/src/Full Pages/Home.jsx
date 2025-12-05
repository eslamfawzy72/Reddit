import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import axios from "axios";

// Realistic mock data — EXACTLY matches your real API structure
const mockPosts = [
  {
    _id: "6929a50c021b68655cbdc96e",
    userId: "6924c11062dbde5200745c28",
    user_name: "ahmed_dev",
    user_avatar: "https://i.pravatar.cc/48?img=3",
    description: "adham howa entaaa??????!",
    images: [
      "https://source.unsplash.com/random/800x600?funny,meme",
    ],
    edited: false,
    upvoteCount: 2,
    downvoteCount: 0,
    commentCount: 1,
    date: "2025-11-24T21:46:14.170Z",
    communityId: "6924f0a6098dc4c9933296f0",
    community_name: "b/funny",
    categories: ["meme", "funny"],
    __v: 1,

    comments: [
      {
        userID: "6924c11062dbde5200745c28",
        username: "eslamFawzy",
        text: "This is my first comment",
        edited: false,
        upvotedCount: 0,
        downvotedCount: 0,
        category: "tech",
        replies: [],
        _id: "692a5f124c321f0e66d753d2",
        date: "2025-11-29T02:48:50.339Z",
        communityID: "6924f0a6098dc4c9933296f0",
      },
    ],
  },

  {
    _id: "6929a50c021b68655cbdc96f",
    userId: "6924c4da62dbde5200745c29",
    user_name: "mariam_codes",
    user_avatar: "https://i.pravatar.cc/48?img=12",
    description: "Check out my new post!",
    images: [],
    edited: false,
    upvoteCount: 1,
    downvoteCount: 0,
    commentCount: 0,
    date: "2025-11-25T10:00:00.000Z",
    communityId: "6924f0a6098dc4c9933296f0",
    community_name: "b/webdev",
    categories: ["web", "project"],
    __v: 0,

    comments: [],
  },

  {
    _id: "692a3961c639b83dc9c25c53",
    userId: "6924c11062dbde5200745c28",
    user_name: "ahmed_dev",
    user_avatar: "https://i.pravatar.cc/48?img=3",
    description: "My favorite movie is Inception!",
    images: [
      "https://source.unsplash.com/random/1200x800?inception,movie",
      "https://source.unsplash.com/random/1200x800?leonardo,dicaprio",
    ],
    edited: false,
    upvoteCount: 0,
    downvoteCount: 0,
    commentCount: 0,
    date: "2025-11-29T00:08:01.208Z",
    communityId: "6924f0a6098dc4c9933296f0",
    community_name: "b/movies",
    categories: ["movies"],
    __v: 0,

    comments: [],
  },
];
const mockCommunities = [
  { id: 1, type: 'community', name: 'reactjs', display: 'b/reactjs', members: '412k', icon: 'React' },
  { id: 2, type: 'community', name: 'javascript', display: 'b/javascript', members: '1.2M', icon: 'JS' },
  { id: 3, type: 'community', name: 'programming', display: 'b/programming', members: '2.8M', icon: 'Code' },
  { id: 4, type: 'community', name: 'webdev', display: 'b/webdev', members: '892k', icon: 'Web' },
  { id: 5, type: 'community', name: 'bluedit', display: 'b/bluedit', members: '89k', icon: 'Blue' },
  { id: 6, type: 'community', name: 'nextjs', display: 'b/nextjs', members: '298k', icon: 'Next' },
  { id: 7, type: 'community', name: 'tailwindcss', display: 'b/tailwindcss', members: '445k', icon: 'Wind' },
];

const mockUsers = [
  { id: 101, type: 'user', name: 'john_dev', display: 'u/john_dev', karma: '12.4k', icon: 'J' },
  { id: 102, type: 'user', name: 'react_master', display: 'u/react_master', karma: '45k', icon: 'R' },
  { id: 103, type: 'user', name: 'bluecoder', display: 'u/bluecoder', karma: '8.9k', icon: 'B' },
  { id: 104, type: 'user', name: 'webdev_guru', display: 'u/webdev_guru', karma: '67k', icon: 'W' },
  { id: 105, type: 'user', name: 'js_ninja', display: 'u/js_ninja', karma: '89k', icon: 'Ninja' },
];

// Render helpers
const renderCommunity = (c) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
    <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: '#1b007b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
      {c.icon}
    </Box>
    <Box>
      <Box sx={{ fontWeight: 600, color: "#0d47a1" }}>{c.display}</Box>
      <Box sx={{ fontSize: 13, color: "#1565c0" }}>{c.members} members</Box>
    </Box>
  </Box>
);

const renderUser = (u) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#ff5722', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
      {u.icon}
    </Box>
    <Box>
      <Box sx={{ fontWeight: 600, color: "#0d47a1" }}>{u.display}</Box>
      <Box sx={{ fontSize: 13, color: "#1565c0" }}>• {u.karma} karma</Box>
    </Box>
  </Box>
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
  const [posts, setPosts] = useState(mockPosts);

  /*useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/posts`)
      .then((res) => {
        console.log("API Posts:", res.data);
        setPosts(res.data);
      })
      .catch((err) => {
        console.error("API failed, using mock data:", err);
        setPosts(mockPosts); // Fallback to perfect mock data
      });
  }, []);*/

  return (
    <Box sx={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      {/* Fixed Top Navbar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <PrimarySearchAppBar loggedin={true} searchFunction={searchEverything} />
      </Box>

      {/* Fixed Left Sidebar */}
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
        <SidebarLeft />
      </Box>

      {/* MAIN FEED — Perfect layout */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: { xs: 0, sm: 260 },
          right: 0,
          bottom: 0,
          overflowY: "auto",
          overflowX: "hidden",
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
          {posts.length === 0 ? (
            <Box sx={{ textAlign: "center", color: "#666", py: 8 }}>
              Loading posts...
            </Box>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                user_name={post.user_name || "Unknown User"}
                user_avatar={post.user_avatar || "https://i.pravatar.cc/48?img=1"}
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
        </Box>
      </Box>
    </Box>
  );
}

export default Home;