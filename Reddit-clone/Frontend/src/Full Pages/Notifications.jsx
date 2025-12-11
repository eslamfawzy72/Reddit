import React from "react";
import { Box } from "@mui/material";
import "../styles/notifications.css"; // Import CSS

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
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
  <Box className="render-community">
    <Box className="render-community-icon">{c.icon}</Box>
    <Box>
      <Box className="render-community-name">{c.display}</Box>
      <Box className="render-community-members">{c.members} members</Box>
    </Box>
  </Box>
);

const renderUser = (u) => (
  <Box className="render-user">
    <Box className="render-user-icon">{u.icon}</Box>
    <Box>
      <Box className="render-user-name">{u.display}</Box>
      <Box className="render-user-karma">• {u.karma} karma</Box>
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
    <Box className="notifications-background">
      {/* Fixed top bar */}
      <Box className="notifications-navbar">
        <PrimarySearchAppBar
          loggedin={true}
          searchFunction={searchEverything}
          onResultClick={(item) => console.log("Clicked:", item)}
        />
      </Box>

      {/* Sidebar */}
      <Box className="notifications-sidebar">
        <SidebarLeft loggedin={true} />
      </Box>

      {/* Main content */}
      <Box className="notifications-main">
        <Box className="notifications-main-inner">
          <NotificationPage />
        </Box>
      </Box>
    </Box>
  );
}

export default Notifications;
