import React, { useEffect } from "react";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import { Box } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft";
import CommunityCard from "../Components/CommunityCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
// // Mock data - now in the exact format of your real community document
// const mockCommunities = [
//   {
//     _id: "6924f0a6098dc4c9933296f1",
//     commName: "reactjs",
//     description: "The official React community for developers building user interfaces.",
//     image: "https://example.com/reactjs-banner.jpg",
//     created_by: "6924c11062dbde5200745c28",
//     created_at: "2024-01-15T12:00:00.000+00:00",
//     rules: ["Be respectful", "No spam", "Stay on topic"],
//     privacystate: "public",
//     moderators: ["6924c11062dbde5200745c29", "6924c11062dbde5200745c30"],
//     members: Array(412000).fill(null), // approximate member count
//     displayName: "b/reactjs",
//     memberCount: "412k"
//   },
//   {
//     _id: "6924f0a6098dc4c9933296f2",
//     commName: "javascript",
//     description: "Everything JavaScript – questions, news, and discussions.",
//     image: "https://example.com/javascript-banner.jpg",
//     created_by: "6924c11062dbde5200745c31",
//     created_at: "2023-05-20T08:30:00.000+00:00",
//     rules: ["Keep it civil", "No piracy", "Use code blocks"],
//     privacystate: "public",
//     moderators: ["6924c11062dbde5200745c32"],
//     members: Array(1200000).fill(null),
//     displayName: "b/javascript",
//     memberCount: "1.2M"
//   },
//   {
//     _id: "6924f0a6098dc4c9933296f3",
//     commName: "programming",
//     description: "General programming discussion, news, and career advice.",
//     image: "https://example.com/programming-banner.jpg",
//     created_by: "6924c11062dbde5200745c33",
//     created_at: "2022-11-01T15:45:00.000+00:00",
//     rules: ["No homework dumps", "Be kind", "No advertising"],
//     privacystate: "public",
//     moderators: ["6924c11062dbde5200745c34", "6924c11062dbde5200745c35"],
//     members: Array(2800000).fill(null),
//     displayName: "b/programming",
//     memberCount: "2.8M"
//   },
//   {
//     _id: "6924f0a6098dc4c9933296f4",
//     commName: "webdev",
//     description: "A place for web developers to share projects, tips, and resources.",
//     image: "https://example.com/webdev-banner.jpg",
//     created_by: "6924c11062dbde5200745c36",
//     created_at: "2024-03-10T09:20:00.000+00:00",
//     rules: ["No job posts", "Source required for tutorials"],
//     privacystate: "public",
//     moderators: ["6924c11062dbde5200745c37"],
//     members: Array(892000).fill(null),
//     displayName: "b/webdev",
//     memberCount: "892k"
//   },
//   {
//     _id: "6924f0a6098dc4c9933296f5",
//     commName: "bluedit",
//     description: "The front page of the internet – for everything.",
//     image: "https://example.com/bluedit-banner.jpg",
//     created_by: "6924c11062dbde5200745c38",
//     created_at: "2023-07-12T14:00:00.000+00:00",
//     rules: ["Follow reddiquette", "No hate speech"],
//     privacystate: "public",
//     moderators: ["6924c11062dbde5200745c39"],
//     members: Array(89000).fill(null),
//     displayName: "b/bluedit",
//     memberCount: "89k"
//   },
//   {
//     _id: "6924f0a6098dc4c9933296f6",
//     commName: "nextjs",
//     description: "The React framework for production – discuss Next.js here.",
//     image: "https://example.com/nextjs-banner.jpg",
//     created_by: "6924c11062dbde5200745c40",
//     created_at: "2024-06-18T11:11:00.000+00:00",
//     rules: ["No duplicate posts", "Use the issue tracker for bugs"],
//     privacystate: "public",
//     moderators: ["6924c11062dbde5200745c41", "6924c11062dbde5200745c42"],
//     members: Array(298000).fill(null),
//     displayName: "b/nextjs",
//     memberCount: "298k"
//   },
//   {
//     _id: "6924f0a6098dc4c9933296f7",
//     commName: "tailwindcss",
//     description: "Rapidly build modern websites without leaving your HTML.",
//     image: "https://example.com/tailwindcss-banner.jpg",
//     created_by: "6924c11062dbde5200745c43",
//     created_at: "2024-02-28T17:30:00.000+00:00",
//     rules: ["Stay on topic", "No self-promotion"],
//     privacystate: "public",
//     moderators: ["6924c11062dbde5200745c44"],
//     members: Array(445000).fill(null),
//     displayName: "b/tailwindcss",
//     memberCount: "445k"
//   },
// ];

// const mockUsers = [
//   { id: 101, type: 'user', name: 'john_dev', display: 'u/john_dev', karma: '12.4k', icon: 'J' },
//   { id: 102, type: 'user', name: 'react_master', display: 'u/react_master', karma: '45k', icon: 'R' },
//   { id: 103, type: 'user', name: 'bluecoder', display: 'u/bluecoder', karma: '8.9k', icon: 'B' },
//   { id: 104, type: 'user', name: 'webdev_guru', display: 'u/webdev_guru', karma: '67k', icon: 'W' },
//   { id: 105, type: 'user', name: 'js_ninja', display: 'u/js_ninja', karma: '89k', icon: 'Ninja' },
// ];

// Render helpers (updated to use the new shape)
const renderCommunity = (c) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1 }}>
    <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: '#1b007b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
      {c.commName.charAt(0).toUpperCase()}
    </Box>
    <Box>
      <Box sx={{ fontWeight: 600, color: "#0d47a1" }}>{c.displayName || `b/${c.commName}`}</Box>
      <Box sx={{ fontSize: 13, color: "#1565c0" }}>{c.memberCount || `${c.members.length} members`}</Box>
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

// Search function (updated to work with new community shape)
export const searchEverything = (query) => {
  if (!query?.trim()) return { results: [], renderItem: null };
  const q = query.toLowerCase();

  const comms = mockCommunities
    .filter(c => c.commName.toLowerCase().includes(q))
    .map(c => ({ ...c, score: c.commName.toLowerCase().startsWith(q) ? 100 : 50 }));

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

export const searchcomm = (query) => {
  if (!query?.trim()) return { results: [], renderItem: null };
  const q = query.toLowerCase();

  const comms = mockCommunities
    .filter(c => c.commName.toLowerCase().includes(q))
    .map(c => ({ ...c, score: c.commName.toLowerCase().startsWith(q) ? 100 : 50 }));

  const results = comms
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return {
    results,
    renderItem: (item) => renderCommunity(item),
  };
};

function Explore(props) {
  const navigate = useNavigate();
    const location = useLocation();
    const isLoggedIn = location.state?.isLoggedIn || false;
 useEffect(() => {
axios
  .get(`${import.meta.env.VITE_API_URL}/communities`)
  .then((res) => {
    const mapped = res.data.map((c) => ({
      _id: c._id,
      name: c.commName,
      displayName: c.displayName || `b/${c.commName}`,
      description: c.description,
      memberCount: c.memberCount || `${c.members.length}`,
      categories: ["Programming"], // TEMP fallback
      color: "#0079D3",
      emoji: c.commName.charAt(0).toUpperCase(),
    }));

    setCommunities(mapped);
  })
  .catch(console.log);
},[])
  const[communities,setCommunities]=useState([])
  return (
    <Box sx={{ backgroundColor: "#ffffffff", minHeight: "100vh" }}>
      {/* Fixed top bar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <PrimarySearchAppBar
          loggedin={isLoggedIn}
          searchFunction={searchcomm}
          onResultClick={(item) => console.log("Clicked:", item)}
        />
      </Box>

      {/* Sidebar - fixed position */}
      <Box sx={{ position: "fixed", top: 64, left: 0, bottom: 0, zIndex: 100 }}>
        <SidebarLeft loggedin={isLoggedIn} />
      </Box>

      {/* Main content area */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: { xs: 0, sm: 260 },
          right: 0,
          bottom: 0,
          overflow: "auto",
          p: { xs: 2, sm: 3 },
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: 8, height: 8 },
          "&::-webkit-scrollbar-thumb": { background: "#888", borderRadius: 4 },
          "& > *": { minWidth: "fit-content" },
        }}
      >
        <Box sx={{ minWidth: "max-content" }}>
          <CommunityCard communities={communities} />
        </Box>
      </Box>
    </Box>
  );
}

export default Explore;