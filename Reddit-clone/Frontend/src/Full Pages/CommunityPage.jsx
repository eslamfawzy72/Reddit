import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import CommunityHeader from "../Components/CommunityHeader";
import SidebarRight from "../Components/SidebarRight";
import SideBarLeft from "../Components/SideBarLeft";
import PostCard from "../Components/PostCard";

import "../styles/communityPage.css";

function CommunityPage() {
  const { communityID } = useParams();
  const API = import.meta.env.VITE_API_URL;

  const [currentUser, setCurrentUser] = useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     AUTH USER
  ========================= */
  useEffect(() => {
    axios
      .get(`${API}/auth/me`, { withCredentials: true })
      .then((res) => {
        console.log("/auth/me response:", res.data);
        setCurrentUser(res.data.user || null);
      })
      .catch((err) => {
        console.warn("/auth/me failed:", err.response?.status);
        setCurrentUser(null);
      });
  }, []);

  /* =========================
     COMMUNITY + POSTS
  ========================= */
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        console.log("Fetching community:", communityID);

        const communityRes = await axios.get(
          `${API}/communities/${communityID}`,
          { withCredentials: true }
        );

      //  console.log("Community data:", communityRes.data);
        setCommunity(communityRes.data);

        const postsRes = await axios.get(
          `${API}/posts/community/${communityID}`,
          { withCredentials: true }
        );

        //console.log("Posts data:", postsRes.data);
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      } catch (err) {
        console.error("Fetch community/posts error:", err);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [communityID]);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading || !community) {
    return <div className="community-loading">Loading community…</div>;
  }


  const adminId =
    typeof community.created_by === "object"
      ? community.created_by._id
      : community.created_by;

  const isAdmin = currentUser && currentUser._id === adminId;

  const isModerator =
    currentUser &&
    community.moderators?.some(
      (m) => m._id === currentUser._id
    );

  const canDeletePosts = isAdmin || isModerator;

  // console.log("currentUser:", currentUser);
  // console.log("adminId:", adminId);
  // console.log("moderators:", community.moderators);
  // console.log("canDeletePosts:", canDeletePosts);


  return (
    <>
      <PrimarySearchAppBar />

      <div className="community-layout">
        {/* LEFT SIDEBAR */}
        <aside className="left-sidebar">
          <SideBarLeft />
        </aside>

        {/* MAIN */}
        <main className="community-main">
          <CommunityHeader
            banner={community.image}
            name={community.commName}
            communityId={community._id}
            admin={community.created_by}
            isJoined={community.isJoined}
          />

          <div className="community-feed">
            {(community.privacystate === "public" ||
              (community.privacystate === "private" &&
                community.isJoined)) ? (
              posts.length === 0 ? (
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
                    commentCount={post.commentCount || 0}
                    date={post.createdAt}
                    community_name={`b/${community.commName}`}
                    edited={post.edited || false}
                    poll={post.poll}
                    currentUser={currentUser}
                    canDelete={canDeletePosts}
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
