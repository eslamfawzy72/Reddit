import React from "react";
import { Box } from "@mui/material";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import SidebarRight from "../Components/SidebarRight.jsx";
import CommunityHeader from "../Components/communityheader.jsx";
import UserProfilePage from "../Components/UserProfilePage.jsx";
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

function UserPage(props) {
  return (
    <>
      {/* Full light background — removes black gaps */}
      <Box sx={{ position: "fixed", inset: 0, bgcolor: "#f5f5f5", zIndex: -1 }} />

      {/* Fixed Top Navbar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1300 }}>
        <PrimarySearchAppBar loggedin={true} searchFunction={searchEverything} />
      </Box>

      {/* Fixed Left Sidebar — NEVER SCROLLS */}
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
          overflow: "hidden",        // ← THIS IS KEY: no scroll
        }}
      >
        <SidebarLeft />
      </Box>

      {/* MAIN FIXED + VERTICALLY SCROLLABLE AREA */}
      <Box
        sx={{
          position: "fixed",
          top: 64,
          left: { xs: 0, sm: 260 },
          right: 0,
          bottom: 0,
          overflowY: "auto",     // ← Only vertical scroll
          overflowX: "hidden",   // ← No horizontal scroll
          bgcolor: "#f5f5f5",
        }}
      >
        {/* Community Header */}
        <UserProfilePage isOwn={props.isOwn} />

        {/* Feed + Right Sidebar */}
       
      </Box>
    </>
  );
}

export default UserPage;