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
      <PrimarySearchAppBar />

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
