import React from "react";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import { Box } from "@mui/material";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import CommunityCard from "../Components/CommunityCard.jsx";
import NotificationPage from "../Components/NotificationPage.jsx";

// Mock data
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

function Notifications() {
  return (
    <Box sx={{ backgroundColor: "#0A0A0A", minHeight: "100vh" }}>
      {/* Fixed top bar */}
      <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <PrimarySearchAppBar
          loggedin={true}
          searchFunction={searchEverything}
          onResultClick={(item) => console.log("Clicked:", item)}
        />
      </Box>

      {/* Sidebar - fixed position */}
      <Box sx={{ position: "fixed", top: 64, left: 0, bottom: 0, zIndex: 100 }}>
        <SidebarLeft loggedin={true} />
      </Box>

      {/* Main content area */}
      <Box
  sx={{
    position: "fixed",
    top: 64,                         // Under navbar
    left: { xs: 0, sm: 260 },        // Next to sidebar (260px on desktop)
    right: 0,
    bottom: 0,
    overflowY: "auto",               // Only vertical scroll
    overflowX: "hidden",
    bgcolor: "#f5f5f5ff",              // Light background (no black!)
    px: { xs: 2, sm: 4 },            // Nice padding
    py: 3,
  }}
>
  {/* Optional: center the content like Reddit */}
  <Box sx={{ maxWidth: "800px", mx: "auto", width: "100%" }}>
    <NotificationPage />
  </Box>
</Box>
    </Box>
  );
}

export default Notifications;