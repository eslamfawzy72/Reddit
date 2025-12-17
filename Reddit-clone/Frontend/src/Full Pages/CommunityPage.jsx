import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

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
  const [toast, setToast] = useState(null);


  const [currentUser, setCurrentUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- CREATE POST MODAL ---------- */
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [preSelectedCommunity, setPreSelectedCommunity] = useState(null);
const showToast = (message) => {
  setToast(message);
  setTimeout(() => {
    setToast(null);
  }, 3000);
};
  const handleOpenCreatePostFromHeader = (communityData) => {
    setPreSelectedCommunity(communityData);
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
  /* ---------- FETCH DATA ---------- */
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
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
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

  /* ---------- LOADING ---------- */
  if (loading || !community) {
    return (
      <div className="community-page-wrapper">
        <PrimarySearchAppBar />
        <div className="community-loading">Loading community…</div>
      </div>
    );
  }

  /* ---------- PERMISSIONS ---------- */
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
      />

      {/* CREATE POST MODAL */}
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
                  date={post.createdAt}
                  community_name={`b/${community.commName}`}
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
