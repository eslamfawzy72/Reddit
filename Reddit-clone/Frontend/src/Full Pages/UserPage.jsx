
import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios"
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import UserProfilePage from "../Components/UserProfilePage.jsx";
import "../styles/userPage.css"; // Import CSS

import { useParams } from "react-router-dom";

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
;

function UserPage(props) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const API = import.meta.env.VITE_API_URL;
   const { username } = useParams();
    const searchFunction = async (query) => {
  if (!query || !query.trim()) return { results: [], renderItem: null }; 
  try {
    // fetch users
    const userRes = await axios.get(`${API}/users`);
    const users = (userRes.data || [])
       .filter(u => u.userName?.toLowerCase().startsWith(query.toLowerCase())&& u._id !== currentUser?._id  )
      .map(u => ({ type: "user", id: u._id, label: u.userName, avatar: u.image }));

    // fetch communities
    const commRes = await axios.get(`${API}/communities`);
    const communities = (commRes.data || [])
      .filter(c => c.commName?.toLowerCase().startsWith(query.toLowerCase()))
      .map(c => ({ type: "community", id: c._id, label: c.commName, image: c.image }));

    const results = [...users, ...communities];

    const renderItem = (item) => (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img
          src={item.avatar || item.image || "https://i.pravatar.cc/32"}
          alt=""
          style={{ width: 32, height: 32, borderRadius: "50%" }}
        />
        <span>{item.label} ({item.type})</span>
      </div>
    );

    return { results, renderItem };
  } catch (err) {
    console.error("Search error:", err);
    return { results: [], renderItem: null }; // ✅ fallback
  }
}

  // 🔐 Auth check (same logic as Home)
  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, []);
  return (
    <>
      <div className="pageBackground" />

      <div className="topNavbar">
        <PrimarySearchAppBar
  loggedin={!!currentUser}
  searchFunction={searchFunction}

/>

      </div>

      <div className="leftSidebar">
        <SidebarLeft loggedin={!!currentUser} />
      </div>

      <div className="mainArea">
      <UserProfilePage isOwn={props.isOwn} username={username} />
      {/* Feed + Right Sidebar could go here */}
    </div>
    </>
  );
}

export default UserPage;
