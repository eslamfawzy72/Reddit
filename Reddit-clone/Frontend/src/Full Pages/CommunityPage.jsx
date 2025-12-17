import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import CommunityHeader from "../Components/CommunityHeader";
import SidebarRight from "../Components/SidebarRight";
import SideBarLeft from "../Components/SideBarLeft";
import PostCard from "../Components/PostCard";

import "../styles/communityPage.css";
import "../styles/toast.css";

function CommunityPage() {
  const { communityID } = useParams();
  const API = import.meta.env.VITE_API_URL;
  const searchFunction = async (query) => {
    if (!query || !query.trim()) return { results: [], renderItem: null }; // ✅ always return object
  
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
  };

  const [currentUser, setCurrentUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------- AUTH ---------- */
  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user || null))
      .catch(() => setCurrentUser(null));
  }, []);

  /* ---------- COMMUNITY ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const communityRes = await axios.get(
          `${API}/communities/${communityID}`,
          { withCredentials: true }
        );
        setCommunity(communityRes.data);

        const postsRes = await axios.get(
          `${API}/posts/community/${communityID}`,
          { withCredentials: true }
        );
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [communityID]);

  /* ---------- GLOBAL TOAST ---------- */
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  if (loading || !community) {
    return <div className="community-loading">Loading community…</div>;
  }

  const adminId =
    typeof community.created_by === "object"
      ? community.created_by._id
      : community.created_by;

  const canDeletePosts =
    currentUser &&
    (currentUser._id === adminId ||
      community.moderators?.some(m => m._id === currentUser._id));

  return (
    <>
      <PrimarySearchAppBar searchFunction={searchFunction} />

      {toast && <div className="global-toast">{toast}</div>}

      <div className="community-layout">
        <aside className="left-sidebar">
          <SideBarLeft />
        </aside>

        <main className="community-main">
          <CommunityHeader
            banner={community.image}
            name={community.commName}
            communityId={community._id}
            admin={community.created_by}
            isJoined={community.isJoined}
          />

          <div className="community-feed">
            {posts.length === 0 ? (
              <div className="loadingPosts">No posts yet</div>
            ) : (
              posts.map(post => (
                <PostCard
                  key={post._id}
                  {...post}
                  id={post._id}
                  user_name={`u/${post.user?.userName || "Unknown"}`}
                  user_avatar={post.user?.image}
                  community_name={`b/${community.commName}`}
                  currentUser={currentUser}
                  canDelete={canDeletePosts}
                  onDeleteSuccess={(id) => {
                    setPosts(prev => prev.filter(p => p._id !== id));
                    showToast("Post deleted");
                  }}
                />
              ))
            )}
          </div>
        </main>

        <aside className="right-sidebar">
          <SidebarRight
            community={community}
            setCommunity={setCommunity}
            showToast={showToast}
          />
        </aside>
      </div>
    </>
  );
}

export default CommunityPage;
