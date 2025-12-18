import React, { useEffect, useState } from "react";
import axios from "axios";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar.jsx";
import SidebarLeft from "../Components/SidebarLeft.jsx";
import UserProfilePage from "../Components/UserProfilePage.jsx";
import "../styles/userPage.css";
import { useParams } from "react-router-dom";

function UserPage({ isOwn, onOpenCreateCommunity, onOpenCreatePost }) {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [darkMode, setDarkMode] = useState(false);
  
  const API = import.meta.env.VITE_API_URL;
  const { username } = useParams();

  /* 🔐 AUTH */
  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, [API]);

  /* 🔍 SEARCH */
  const searchFunction = async (query) => {
    if (!query.trim()) return { results: [], renderItem: null };

    try {
      const [usersRes, commRes] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/communities`)
      ]);

      const users = (usersRes.data || [])
        .filter(u =>
          u.userName?.toLowerCase().startsWith(query.toLowerCase()) &&
          u._id !== currentUser?._id
        )
        .map(u => ({ type: "user", id: u._id, label: u.userName }));

      const communities = (commRes.data || [])
        .filter(c => c.commName?.toLowerCase().startsWith(query.toLowerCase()))
        .map(c => ({ type: "community", id: c._id, label: c.commName }));

      return { results: [...users, ...communities], renderItem: null };
    } catch {
      return { results: [], renderItem: null };
    }
  };

  return (
    <>
      <div className="pageBackground" />

      <div className="topNavbar">
        <PrimarySearchAppBar
          searchFunction={searchFunction}
          onOpenCreatePost={onOpenCreatePost}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      </div>

      <div className="leftSidebar">
        <SidebarLeft
          onOpenCreateCommunity={onOpenCreateCommunity}
          onOpenCreatePost={onOpenCreatePost}
        />
      </div>

      <div className="mainArea">
        <UserProfilePage
          key={username || "own-profile"}
          isOwn={isOwn}
          username={username}
        />
      </div>
    </>
  );
}

export default UserPage;
