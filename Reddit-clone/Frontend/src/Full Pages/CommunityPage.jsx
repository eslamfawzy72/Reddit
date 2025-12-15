import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import CommunityHeader from "../Components/CommunityHeader";
import SidebarRight from "../Components/SidebarRight";
import SideBarLeft from "../Components/SidebarLeft";
import PostCard from "../Components/PostCard";

import "../styles/communityPage.css";

function CommunityPage() {
  const { communityID } = useParams();

  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [communityRes, postsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_URL}/communities/${communityID}`,
            { withCredentials: true }
          ),
          axios.get(
            `${import.meta.env.VITE_API_URL}/posts/community/${communityID}`,
            { withCredentials: true }
          ),
        ]);

        setCommunity(communityRes.data);
        setPosts(postsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [communityID]);

  if (loading) {
    return <div className="community-loading">Loading community...</div>;
  }

  return (
    <>
      <PrimarySearchAppBar />

      <div className="community-layout">
        {/* LEFT SIDEBAR */}
        <aside className="left-sidebar">
          <SideBarLeft />
        </aside>

        {/* MAIN CONTENT */}
        <main className="community-main">
          <CommunityHeader
            name={community.commName}
            communityId={community._id}
            isJoined={community.isJoined}
          />
      <div className="community-feed">
  {(community.privacystate === "public" ||
    (community.privacystate === "private" && community.isJoined)) ? (

    posts.length === 0 ? (
      <div className="loadingPosts">No posts yet</div>
    ) : (
      posts.map((post) => (
        <PostCard
          key={post._id}
          id={post._id}
          user_name={`u/${post.user?.userName || "Unknown"}`}
          user_avatar={
            post.user?.image || "https://i.pravatar.cc/48?img=1"
          }
          description={post.description}
          images={post.images || []}
          comments={post.comments}
          upvoteCount={post.upvoteCount || 0}
          downvoteCount={post.downvoteCount || 0}
          commentCount={post.commentCount || 0}
          date={post.createdAt}
          community_name={`b/${community.commName}`}
          edited={post.edited || false}
        />
      ))
    )

  ) : (
    <div className="loadingPosts">
      This is a private community. Join to see the posts.
    </div>
  )}
</div>

        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="right-sidebar">
          <SidebarRight community={community} />
        </aside>
      </div>
    </>
  );
}

export default CommunityPage;
