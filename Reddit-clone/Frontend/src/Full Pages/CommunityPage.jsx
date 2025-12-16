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
const[currentUser,setCurrentUser]=useState(null);
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const communityRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/communities/${communityID}`,
          { withCredentials: true }
        );

        setCommunity(communityRes.data);

        const postsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/posts/community/${communityID}`,
          { withCredentials: true }
        );
       await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
      
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      } catch (err) {
        console.error(err);
        setPosts([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [communityID]);

  if (loading || !community) {
    return <div className="community-loading">Loading community...</div>;
  }

  return (
    <>
      <PrimarySearchAppBar />

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
                    user_avatar={post.user?.image}
                    description={post.description}
                    title={post.title}
                    images={post.images || []}
                    comments={post.comments}
                    upvoteCount={post.upvoteCount || 0}
                    downvoteCount={post.downvoteCount || 0}
                    commentCount={post.commentCount || 0}
                    date={post.createdAt}
                    community_name={`b/${community.commName}`}
                    edited={post.edited || false}
                    currentUser={currentUser}
                    poll={post.poll}
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

        <aside className="right-sidebar">
          <SidebarRight community={community}
          />
        </aside>
      </div>
    </>
  );
}
export default CommunityPage;