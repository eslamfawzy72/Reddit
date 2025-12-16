import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import SidebarLeft from "../Components/SidebarLeft";
import CommunityCard from "../Components/CommunityCard";

import "../styles/explore.css";

function Explore() {
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
          category: c.category || "General",
           isJoined: c.isJoined,
          color: "#0079D3",
          emoji: c.commName.charAt(0).toUpperCase(),
        }));

        setCommunities(mapped);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="explore">
      <header className="explore__navbar">
        <PrimarySearchAppBar loggedin={isLoggedIn} />
      </header>

      <aside className="explore__sidebar">
        <SidebarLeft loggedin={isLoggedIn} />
      </aside>

      <main className="explore__content">
        <CommunityCard communities={communities}
        setCommunities={setCommunities} />
      </main>
    </div>
  );
}

export default Explore;
