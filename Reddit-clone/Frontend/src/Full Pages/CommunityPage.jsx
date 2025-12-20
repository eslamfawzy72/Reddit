import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import CommunityHeader from "../Components/CommunityHeader";
import SidebarRight from "../Components/SidebarRight";
import SideBarLeft from "../Components/SidebarLeft";
import PostCard from "../Components/PostCard";
import CreatePostModal from "../Components/CreatePostModal";
import "../styles/toast.css";

import "../styles/communityPage.css";

function CommunityPage({ onOpenCreateCommunity }) {
  const { communityID } = useParams();
  const location = useLocation();
   const [currentUser, setCurrentUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [preSelectedCommunity, setPreSelectedCommunity] = useState(null);

  const [toast, setToast] = useState(null);
  const focusPostId = React.useMemo(() => {
  return new URLSearchParams(location.search).get("focusPost");
}, [location.search]);

useEffect(() => {
  if (!focusPostId) return;
  if (!posts.length) return;

  if (community?.privacystate === "private" && !community.isJoined) return;

  const t = setTimeout(() => {
    const el = document.getElementById(`post-${focusPostId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("highlighted-post");
      setTimeout(() => el.classList.remove("highlighted-post"), 3000);
    }
  }, 300);

  return () => clearTimeout(t);
}, [posts, focusPostId, community]);




 


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
      return { results: [], renderItem: null }; 
    }
  };


const showToast = (message) => {
  setToast(message);
  setTimeout(() => {
    setToast(null);
  }, 3000);
};
  const handleOpenCreatePostFromHeader = (communityData) => {
    //setPreSelectedCommunity(communityData);
    setShowCreatePost(true);
  };
   const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        { withCredentials: true }
      );
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      showToast("Post deleted");
    } catch (err) {
      showToast("Failed to delete post");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [communityRes, postsRes, userRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/communities/${communityID}`,
            { withCredentials: true }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/posts/community/${communityID}`,
            { withCredentials: true }
          ),
          axios
            .get(`${import.meta.env.VITE_API_URL}/auth/me`, {
              withCredentials: true,
            })
            .catch(() => null),
        ]);

        setCommunity(communityRes.data);
        const fetchedPosts = Array.isArray(postsRes.data) ? postsRes.data : [];
        setPosts(fetchedPosts);
        setCurrentUser(userRes?.data?.user || null);
      } catch (err) {
        console.error("Failed to load community", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [communityID]);
  

  
  if (!community && loading) {
    return (
      <div className="community-page-wrapper">
        {/* TOP BAR */}
        <PrimarySearchAppBar
          onOpenCreatePost={() => setShowCreatePost(true)}
          searchFunction={searchFunction}
        />

        <div className="community-layout">
          {/* LEFT */}
          <aside className="left-sidebar">
            <SideBarLeft
              onOpenCreatePost={() => setShowCreatePost(true)}
              onOpenCreateCommunity={onOpenCreateCommunity}
            />
          </aside>

          {/* MAIN - LOADING STATE */}
          <main className="community-main">
            <div className="loadingPosts">Loading community…</div>
          </main>

          {/* RIGHT */}
          <aside className="right-sidebar">
          </aside>
        </div>
      </div>
    );
  }


  const adminId =
    typeof community.created_by === "object"
      ? community.created_by._id
      : community.created_by;

  const isAdmin = currentUser?._id === adminId;
  const isModerator =
    currentUser &&
    community.moderators?.some((m) => m._id === currentUser._id);

  const canDeletePosts = isAdmin || isModerator;

  const isPrivateAndNotJoined =
    community.privacystate === "private" && !community.isJoined;

  return (
    <div className="community-page-wrapper">
      
    {toast && <div className="global-toast">{toast}</div>}
      {/* TOP BAR */}
      <PrimarySearchAppBar
        onOpenCreatePost={() => setShowCreatePost(true)}
        searchFunction={searchFunction}
      />
    
 

      {/* CREATE POST MODAL */}
      {showCreatePost && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => {
            setShowCreatePost(false);
            setPreSelectedCommunity(null);
          }}
          //preSelectedCommunity={preSelectedCommunity || community}
        />
      )}

      <div className="community-layout">
        {/* LEFT */}
        <aside className="left-sidebar">
          <SideBarLeft
            onOpenCreatePost={() => setShowCreatePost(true)}
            onOpenCreateCommunity={onOpenCreateCommunity}
          />
        </aside>

        {/* MAIN */}
        <main className="community-main">
          <CommunityHeader
            banner={community.image}
            name={community.commName}
            communityId={community._id}
            admin={community.created_by}
            isJoined={community.isJoined}
            onOpenCreatePost={handleOpenCreatePostFromHeader}
          />

          <div className="community-feed">
            {isPrivateAndNotJoined ? (
              <div className="private-community-message">
                <h2 style={{ color: "#e5e7eb" }}>
                  This community is private
                </h2>
                <p style={{ color: "#9ca3af" }}>
                  Join to see posts and participate.
                </p>
              </div>
            ) : loading ? (
              <div className="loadingPosts">Loading posts…</div>
            ) : posts.length === 0 ? (
              <div className="loadingPosts">No posts yet</div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  id={post._id}
                  user_name={`u/${post.user?.userName || "Unknown"}`}
                  user_avatar={post.user?.image}
                  title={post.title}
                  description={post.description}
                  images={post.images || []}
                  comments={post.comments || []}
                  upvoteCount={post.upvoteCount || 0}
                  downvoteCount={post.downvoteCount || 0}
                  date={post.date}
                  community_name={`b/${community.commName}`}
                  communityId={community._id}
                  edited={post.edited || false}
                  poll={post.poll}
                  currentUser={currentUser}
                  onDelete={handleDeletePost}
                  canDelete={canDeletePosts}
                />
              ))
            )}
          </div>
        </main>

        {/* RIGHT */}
        <aside className="right-sidebar">
          <SidebarRight
            community={community}
            setCommunity={setCommunity}
             showToast={showToast} 
          />
        </aside>
      </div>
    </div>
  );
}

export default CommunityPage;