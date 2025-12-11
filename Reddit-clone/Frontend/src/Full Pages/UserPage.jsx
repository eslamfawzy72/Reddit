import React from "react";
import { Box } from "@mui/material";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import UserProfilePage from "../Components/UserProfilePage.jsx";
import "../styles/userPage.css"; // Import CSS

const mockCommunities = [ /* keep your mockCommunities here */ ];
const mockUsers = [ /* keep your mockUsers here */ ];

// Render helpers
const renderCommunity = (c) => (
  <div className="communityItem">
    <div className="communityIcon">{c.icon}</div>
    <div>
      <div className="communityName">{c.display}</div>
      <div className="communityMembers">{c.members} members</div>
    </div>
  </div>
);

const renderUser = (u) => (
  <div className="userItem">
    <div className="userIcon">{u.icon}</div>
    <div>
      <div className="userName">{u.display}</div>
      <div className="userKarma">• {u.karma} karma</div>
    </div>
  </div>
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
      <div className="pageBackground" />

      <div className="topNavbar">
        <PrimarySearchAppBar loggedin={true} searchFunction={searchEverything} />
      </div>

      <div className="leftSidebar">
        <SidebarLeft />
      </div>

      <div className="mainArea">
        <UserProfilePage isOwn={props.isOwn} />
        {/* Feed + Right Sidebar could go here */}
      </div>
    </>
  );
}

export default UserPage;
