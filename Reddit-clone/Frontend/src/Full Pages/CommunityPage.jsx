import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import SidebarLeft from "../Components/SidebarLeft";
import SidebarRight from "../Components/SidebarRight";
import CommunityHeader from "../Components/CommunityHeader";
import PostCard from "../Components/PostCard";
import CreatePostModal from "../Components/CreatePostModal";

import "../styles/home.css";
import "../styles/toast.css";

function CommunityPage({ onOpenCreateCommunity, onOpenCreatePost }) {
  const { communityID } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [currentUser, setCurrentUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [preSelectedCommunity, setPreSelectedCommunity] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ---------- focus post ---------- */
  const focusPostId = useMemo(() => {
    return new URLSearchParams(location.search).get("focusPost");
  }, [location.search]);

  useEffect(() => {
    if (!focusPostId || !posts.length) return;
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

  /* ---------- search ---------- */
  const searchFunction = async (query) => {
    if (!query || !query.trim()) return { results: [], renderItem: null };

    try {
      const users = (await axios.get(`${API}/users`)).data || [];
      const communities = (await axios.get(`${API}/communities`)).data || [];

      const results = [
        ...users
          .filter(
            (u) =>
              u.userName?.toLowerCase().startsWith(query.toLowerCase()) &&
              u._id !== currentUser?._id
          )
          .map((u) => ({
            type: "user",
            id: u._id,
            label: u.userName,
            avatar: u.image,
          })),
        ...communities
          .filter((c) =>
            c.commName?.toLowerCase().startsWith(query.toLowerCase())
          )
          .map((c) => ({
            type: "community",
            id: c._id,
            label: c.commName,
            image: c.image,
          })),
      ];

      const renderItem = (item) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={item.avatar || item.image || "https://i.pravatar.cc/32"}
            alt=""
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <span>
            {item.label} ({item.type})
          </span>
        </div>
      );

      return { results, renderItem };
    } catch {
      return { results: [], renderItem: null };
    }
  };

  /* ---------- delete ---------- */
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`${API}/posts/${postId}`, {
        withCredentials: true,
      });
      setPosts((p) => p.filter((x) => x._id !== postId));
      showToast("Post deleted");
    } catch {
      showToast("Failed to delete post");
    }
  };

  /* ---------- fetch ---------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, pRes, uRes] = await Promise.all([
          axios.get(`${API}/communities/${communityID}`, {
            withCredentials: true,
          }),
          axios.get(`${API}/posts/community/${communityID}`, {
            withCredentials: true,
          }),
          axios
            .get(`${API}/auth/me`, { withCredentials: true })
            .catch(() => null),
        ]);

        setCommunity(cRes.data);
        setPosts(Array.isArray(pRes.data) ? pRes.data : []);
        setCurrentUser(uRes?.data?.user || null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [communityID]);

  if (loading || !community) {
    return (
      <div className="page-loading">
        <span>Loading community…</span>
      </div>
    );
  }

  const adminId =
    typeof community.created_by === "object"
      ? community.created_by._id
      : community.created_by;

  const canDelete =
    currentUser?._id === adminId ||
    community.moderators?.some((m) => m._id === currentUser?._id);

  const privateAndNotJoined =
    community.privacystate === "private" && !community.isJoined;

  return (
    <div className="homeContainer">
      {toast && <div className="global-toast">{toast}</div>}

      {/* TOP BAR */}
      <div className="topNavbar">
        <PrimarySearchAppBar
          searchFunction={searchFunction}
          onOpenCreatePost={() => setShowCreatePost(true)}
          onResultClick={(item) => {
            if (item.type === "user") navigate(`/profile/${item.id}`);
            if (item.type === "community")
              navigate(`/community/${item.id}`);
          }}
        />
      </div>

      {/* LEFT SIDEBAR */}
      <div className="leftSidebar">
        <SidebarLeft
          onOpenCreateCommunity={onOpenCreateCommunity}
          onOpenCreatePost={() => setShowCreatePost(true)}
        />
      </div>

      {/* MAIN */}
      <div className="mainFeed">
        <div className="feedWrapper">

          {/* 🔥 HEADER LOCKED TO SIDEBAR */}
          <div className="community-header-wrapper">
            <CommunityHeader
              banner={community.image}
              name={community.commName}
              communityId={community._id}
              admin={community.created_by}
              isJoined={community.isJoined}
              onOpenCreatePost={(c) => {
                setPreSelectedCommunity(c);
                setShowCreatePost(true);
              }}
            />
          </div>

          {privateAndNotJoined ? (
            <div className="private-community-message">
              <h2>This community is private</h2>
              <p>Join to see posts and participate.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="loadingPosts">No posts yet</div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                user_name={`u/${post.user?.userName || "Unknown"}`}
                title={post.title}
                description={post.description}
                images={post.images || []}
                comments={post.comments || []}
                upvoteCount={post.upvoteCount || 0}
                downvoteCount={post.downvoteCount || 0}
                date={post.date}
                community_name={`b/${community.commName}`}
                communityId={community._id}
                edited={post.edited}
                poll={post.poll}
                currentUser={currentUser}
                onDelete={handleDeletePost}
                canDelete={canDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* RIGHT */}
      <SidebarRight
        community={community}
        setCommunity={setCommunity}
        showToast={showToast}
      />

      {/* MODAL */}
      {showCreatePost && (
        <CreatePostModal
          isOpen={showCreatePost}
          onClose={() => {
            setShowCreatePost(false);
            setPreSelectedCommunity(null);
          }}
          preSelectedCommunity={preSelectedCommunity || community}
        />
      )}
    </div>
  );
}

export default CommunityPage;
