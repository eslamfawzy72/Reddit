import React from "react";
import { Box } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import PostCard from "../Components/PostCard";
import { useEffect } from "react";
import axios from "axios";
// Mock posts data

// const mockPosts = [
//   {
//     id: 1,
//     user_name: "john_dev",
//     img_src: "https://i.pravatar.cc/40?img=1",
//     post_date: "2025-12-02",
//     description: "Check out this cool React tip!",
//     num_of_likes: 120,
//     num_of_comments: 24,
//     post_details: "More details about this React tip...",
//     is_poll: false,
//     images: [
//       "https://source.unsplash.com/random/800x600?tech",
//       "https://source.unsplash.com/random/800x600?code",
//     ],
//   },
//   {
//     id: 2,
//     user_name: "react_master",
//     img_src: "https://i.pravatar.cc/40?img=2",
//     post_date: "2025-12-01",
//     description: "Vote for your favorite JS framework!",
//     num_of_likes: 80,
//     num_of_comments: 10,
//     post_details: "Here is why React is awesome...",
//     is_poll: true,
//     poll_question: "Which JS framework do you prefer?",
//     options: ["React", "Vue", "Angular"],
//     votes: [10, 5, 2],
//   },
//   {
//     id: 3,
//     user_name: "webdev_guru",
//     img_src: "https://i.pravatar.cc/40?img=3",
//     post_date: "2025-11-30",
//     description: "TailwindCSS makes life easier!",
//     num_of_likes: 50,
//     num_of_comments: 8,
//     post_details: "More TailwindCSS tips here...",
//     is_poll: false,
//   },
// ];


function Home() {
    
const [posts,setPosts]=React.useState([])
    useEffect(() => {
 axios.get(`${import.meta.env.VITE_API_URL}/posts`).then((res)=>{
    console.log(res.data);
    setPosts(res.data);
  }).catch((err)=>{
    console.log(err);
  })
},[])




  return (
    <Box sx={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      {/* Top search bar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <PrimarySearchAppBar loggedin={true} />
      </Box>

      {/* Left sidebar */}
      <Box sx={{ position: "fixed", top: 64, left: 0, bottom: 0, zIndex: 100 }}>
        <SidebarLeft />
      </Box>

      {/* Main feed */}
      <Box
        sx={{
          marginLeft: { xs: 0, sm: "260px" },
          paddingTop: "64px",
          paddingX: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {posts.map((post) => (
          <PostCard key={post.id} {...post} />
        ))}
      </Box>
    </Box>
  );
}

export default Home;
