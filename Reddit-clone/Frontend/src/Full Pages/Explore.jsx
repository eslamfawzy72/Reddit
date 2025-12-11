import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import "../styles/explore.css"; // Import CSS

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import CommunityCard from "../Components/CommunityCard.jsx";

// Search helpers (mock data assumed elsewhere)
export const searchEverything = (query) => {
  if (!query?.trim()) return { results: [], renderItem: null };
  const q = query.toLowerCase();
  const comms = mockCommunities
    .filter(c => c.commName.toLowerCase().includes(q))
    .map(c => ({ ...c, score: c.commName.toLowerCase().startsWith(q) ? 100 : 50 }));
  const users = mockUsers
    .filter(u => u.name.includes(q))
    .map(u => ({ ...u, score: u.name.startsWith(q) ? 90 : 40 }));
  const results = [...comms, ...users].sort((a, b) => b.score - a.score).slice(0, 8);
  return { results, renderItem: (item) => (item.type === 'user' ? renderUser(item) : renderCommunity(item)) };
};

export const searchcomm = (query) => {
  if (!query?.trim()) return { results: [], renderItem: null };
  const q = query.toLowerCase();
  const comms = mockCommunities
    .filter(c => c.commName.toLowerCase().includes(q))
    .map(c => ({ ...c, score: c.commName.toLowerCase().startsWith(q) ? 100 : 50 }));
  const results = comms.sort((a, b) => b.score - a.score).slice(0, 8);
  return { results, renderItem: (item) => renderCommunity(item) };
};

function Explore() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = location.state?.isLoggedIn || false;

  const [communities, setCommunities] = useState([]);

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
  }, []);

  return (
    <Box className="explore-background">
      {/* Fixed top bar */}
      <Box className="explore-navbar">
        <PrimarySearchAppBar
          loggedin={isLoggedIn}
          searchFunction={searchcomm}
          onResultClick={(item) => console.log("Clicked:", item)}
        />
      </Box>

      {/* Sidebar - fixed position */}
      <Box className="explore-sidebar">
        <SidebarLeft loggedin={isLoggedIn} />
      </Box>

      {/* Main content area */}
      <Box className="explore-main">
        <Box>
          <CommunityCard communities={communities} />
        </Box>
      </Box>
    </Box>
  );
}

export default Explore;
