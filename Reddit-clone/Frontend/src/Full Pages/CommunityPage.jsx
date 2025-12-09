
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import SidebarRight from "../Components/SidebarRight.jsx";
import CommunityHeader from "../Components/communityheader.jsx";
import PostCard from "../Components/PostCard.jsx"; // ← Make sure you import PostCard

const mockPosts = [
  {
    _id: "6929a50c021b68655cbdc96e",
    userId: "6924c11062dbde5200745c28",
    user_name: "ahmed_dev",
    user_avatar: "https://i.pravatar.cc/48?img=3",
    description: "adham howa entaaa??????!",
    images: ["https://source.unsplash.com/random/800x600?funny,meme"],
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

function CommunityPage(props) {
    const { communityID } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  return (
    <>
      {/* Full light background */}
      <Box sx={{ position: "fixed", inset: 0, bgcolor: "#f5f5f5", zIndex: -1 }} />

      {/* Fixed Top Navbar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <PrimarySearchAppBar />
      </Box>

      {/* Fixed Left Sidebar */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: 0,
          width: { xs: 0, sm: 280 },
          height: "calc(100vh - 64px)",
          bgcolor: "white",
          borderRight: "1px solid #edeff1",
          zIndex: 1200,
          overflow: "hidden",
        }}
      >
        <SidebarLeft />
      </Box>

      {/* Main Scrollable Area */}
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
        }}
      >
        {/* Community Header */}
        <CommunityHeader />

        {/* Feed + Right Sidebar */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            maxWidth: "1600px",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            pt: 2,
            pb: 10,
          }}
        >
          {/* Main Posts Area */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {mockPosts.length === 0 ? (
              <Box sx={{ textAlign: "center", color: "#666", py: 8 }}>
                Loading posts...
              </Box>
            ) : (
              mockPosts.map((post) => (
                <Box
                  key={post._id}
                  sx={{
                    mb: 3,
                  }}
                >
                  <PostCard
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
                </Box>
              ))
            )}
          </Box>

          {/* Sticky Right Sidebar */}
          <Box
            sx={{
              width: "320px",
              flexShrink: 0,
              position: "sticky",
              top: 80,
              alignSelf: "flex-start",
            }}
          >
            <SidebarRight />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default CommunityPage;
