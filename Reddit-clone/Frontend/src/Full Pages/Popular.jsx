import React, { useState } from "react";
import { Box } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import { useLocation } from 'react-router-dom';

// Generate lots of mock posts
const users = [
  { id: "u1", name: "ahmed_dev", avatar: "https://i.pravatar.cc/48?img=3" },
  { id: "u2", name: "mariam_codes", avatar: "https://i.pravatar.cc/48?img=12" },
  { id: "u3", name: "john_dev", avatar: "https://i.pravatar.cc/48?img=5" },
  { id: "u4", name: "sara_web", avatar: "https://i.pravatar.cc/48?img=7" },
  { id: "u5", name: "bluecoder", avatar: "https://i.pravatar.cc/48?img=8" },
];

const communities = [
  { id: "c1", name: "funny", display: "b/funny" },
  { id: "c2", name: "webdev", display: "b/webdev" },
  { id: "c3", name: "movies", display: "b/movies" },
  { id: "c4", name: "gaming", display: "b/gaming" },
];

const randomImages = [
  "https://source.unsplash.com/random/800x600?funny,meme",
  "https://source.unsplash.com/random/1200x800?movie,cinema",
  "https://source.unsplash.com/random/800x600?coding,tech",
  "https://source.unsplash.com/random/800x600?game,play",
  "https://source.unsplash.com/random/1200x800?landscape,nature",
];

const generateMockPosts = (num = 50) => {
  const posts = [];
  for (let i = 0; i < num; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const community = communities[Math.floor(Math.random() * communities.length)];
    const imgCount = Math.floor(Math.random() * 3); // 0–2 images
    const images = Array.from({ length: imgCount }, () => randomImages[Math.floor(Math.random() * randomImages.length)]);
    const upvotes = Math.floor(Math.random() * 1000);
    const downvotes = Math.floor(Math.random() * 50);
    const comments = Array.from({ length: Math.floor(Math.random() * 10) }, (_, idx) => ({
      userID: users[Math.floor(Math.random() * users.length)].id,
      username: users[Math.floor(Math.random() * users.length)].name,
      text: "Random comment " + idx,
      edited: false,
      upvotedCount: Math.floor(Math.random() * 20),
      downvotedCount: Math.floor(Math.random() * 5),
      _id: `${i}-${idx}`,
      date: new Date(Date.now() - Math.random() * 1e10).toISOString(),
    }));

    posts.push({
      _id: `post-${i}`,
      userId: user.id,
      user_name: user.name,
      user_avatar: user.avatar,
      description: `This is mock post #${i} by ${user.name}`,
      images,
      edited: false,
      upvoteCount: upvotes,
      downvoteCount: downvotes,
      commentCount: comments.length,
      comments,
      date: new Date(Date.now() - Math.random() * 1e10).toISOString(),
      community_name: community.display,
      categories: [community.name],
    });
  }
  return posts;
};

// Sort by popularity = upvotes + comments
const sortByPopularity = (posts) => {
  return posts.sort((a, b) => (b.upvoteCount + b.commentCount) - (a.upvoteCount + a.commentCount));
};

function Popular(props) {
  const [posts] = useState(sortByPopularity(generateMockPosts(50)));
    const location = useLocation();
  const loggedinpage = location.state?.loggedin ?? false; // 50 posts

  return (
    <Box sx={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <PrimarySearchAppBar loggedin={loggedinpage} />
      </Box>

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
        <SidebarLeft loggedin={loggedinpage} />
      </Box>

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
          {posts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              user_name={post.user_name}
              user_avatar={post.user_avatar}
              description={post.description}
              images={post.images}
              comments={post.comments}
              upvoteCount={post.upvoteCount}
              downvoteCount={post.downvoteCount}
              commentCount={post.commentCount}
              date={post.date}
              community_name={post.community_name}
              categories={post.categories}
              edited={post.edited}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Popular;
