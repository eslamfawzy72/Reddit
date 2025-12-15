import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import SidebarLeft from "../Components/SidebarLeft";
import SidebarRight from "../Components/SidebarRight";
import CommunityHeader from "../Components/CommunityHeader";
import PostCard from "../Components/PostCard";

import "../styles/communityPage.css";
import axios from "axios";

function CommunityPage() {
  const { communityID } = useParams();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/communities/${communityID}`,
          { withCredentials: true }
        );

        setCommunity(res.data);
        setPosts(res.data.posts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [communityID]);

  if (loading) {
    return <div className="community-loading">Loading community...</div>;
  }

 return (
  <>
    <div className="navbar">
      <PrimarySearchAppBar />
    </div>

    <div className="app-layout">
      <main className="mainArea">
        <CommunityHeader name={community.commName} />

        <div className="feedArea">
          {/* Posts */}
        </div>
      </main>

      <aside className="rightSidebar">
        <SidebarRight community={community} />
      </aside>
    </div>
  </>
);

}

export default CommunityPage;
