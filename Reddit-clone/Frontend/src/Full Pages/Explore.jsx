import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import SidebarLeft from "../Components/SidebarLeft";
import CommunityCard from "../Components/CommunityCard";

import "../styles/explore.css";

function Explore({ onOpenCreateCommunity, onOpenCreatePost }) {
  const location = useLocation();
  const isLoggedIn = location.state?.isLoggedIn || false;
  const API = import.meta.env.VITE_API_URL;
  const [communities, setCommunities] = useState([]);
  const searchcomms = async (query) => {
    if (!query || !query.trim()) return { results: [], renderItem: null };

    try {
    
      const commRes = await axios.get(`${API}/communities`);
      const communities = (commRes.data || [])
        .filter(c => c.commName?.toLowerCase().startsWith(query.toLowerCase()))
        .map(c => ({ type: "community", id: c._id, label: c.commName, image: c.image }));

      const results = [...communities];

      const renderItem = (item) => (
        <div style={{ display: "flex", alignItems: "center" }}>
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
      return { results: [], renderItem: null }; 
    }
  };


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
      <header
        className="explore__navbar"
        style={{ position: "sticky", top: 0, zIndex: 2000 }}
      >
        <PrimarySearchAppBar
          loggedin={isLoggedIn}
          dropdownStyle={{ zIndex: 2100 }} searchFunction={searchcomms} 
          onOpenCreatePost={onOpenCreatePost}
        />
      </header>

      <aside className="explore__sidebar">
        <SidebarLeft onOpenCreateCommunity={onOpenCreateCommunity} onOpenCreatePost={onOpenCreatePost} />
      </aside>

      <main className="explore__content">
        <CommunityCard communities={communities} setCommunities={setCommunities}  onOpenCreatePost={onOpenCreatePost}>
          <div className="communityCard__scroll">
            {communities.map((c) => (
              <div key={c._id} className="communityCard__item">
                <span>{c.displayName}</span>
              </div>
            ))}
          </div>
        </CommunityCard>
      </main>
    </div>
  );
}

export default Explore;
