import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import "../styles/communityPage.css"; // Import CSS

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import SidebarRight from "../Components/SidebarRight.jsx";
import CommunityHeader from "../Components/communityheader.jsx";
import PostCard from "../Components/PostCard.jsx"; // ← Make sure you import PostCard

const mockPosts = [
  // ... (keep all your mockPosts data here)
];

function CommunityPage() {
  const { communityID } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Box className="background" />

      <Box className="navbar">
        <PrimarySearchAppBar />
      </Box>

      <Box className="leftSidebar">
        <SidebarLeft />
      </Box>

      <Box className="mainArea">
        <CommunityHeader />

        <Box className="feedArea">
          <Box className="postsArea">
            {mockPosts.length === 0 ? (
              <Box className="loadingPosts">Loading posts...</Box>
            ) : (
              mockPosts.map((post) => (
                <Box key={post._id} className="postCardWrapper">
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

          <Box className="rightSidebar">
            <SidebarRight />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default CommunityPage;
