import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import ActionBar from "./ActionBar";
import CommentSection from "./CommentSection";
import ShareModal from "./ShareModal";
import "../styles/PostCard.css";

export default function PostCard({
  id,
  user_name,
  user_avatar,
  title,
  description,
  images = [],
  comments: initialComments = [],
  upvoteCount = 0,
  downvoteCount = 0,
  date,
  community_name,
  edited = false,
  poll: pollProp,
  currentUser,
  communityId,
  canDelete = false,
  onDelete,
  onDeleteSuccess, 
}) {
  
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [isHidden, setIsHidden] = React.useState(false);
  const [loadingOption, setLoadingOption] = React.useState(null);
  const [localUpvotes, setLocalUpvotes] = useState(upvoteCount || 0);
  const [localDownvotes, setLocalDownvotes] = useState(downvoteCount || 0);
  const [userVote, setUserVote] = useState(null); // 'upvote' | 'downvote' | null
  const [poll, setPoll] = useState(pollProp);
  const [comments, setComments] = useState(initialComments);
  const [showShare, setShowShare] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const { isLoggedIn } = useAuth();

const [selectedOptionId, setSelectedOptionId] = React.useState(
  pollProp?.userOptionId || null
);
const nextImage = () =>
  setIndex((prev) => (prev + 1) % images.length);

const prevImage = () =>
  setIndex((prev) =>
    prev === 0 ? images.length - 1 : prev - 1
  );

React.useEffect(() => {
   setSelectedOptionId(pollProp?.userOptionId || null);
}, [pollProp?.userOptionId]);
  React.useEffect(() => {
    setPoll(pollProp);
  }, [pollProp]);
  const API = import.meta.env.VITE_API_URL;

  const handleCommunityClick = async (e) => {
    e.stopPropagation();
    if (!communityId) return navigate("/communities");

    try {
      const res = await axios.get(`${API}/communities/${communityId}`, {
        withCredentials: true,
      });
      const community = res.data;

      if (community.privacystate === "private" && !community.isJoined) {
        if (!currentUser) {
          if (window.confirm("This community is private. Log in to join?")) {
            navigate("/Login");
          }
          return;
        }

        if (window.confirm("This community is private. Join now?")) {
          try {
            await axios.post(`${API}/communities/${communityId}/join`, {}, { withCredentials: true });
            navigate(`/community/${communityId}`);
          } catch (joinErr) {
            console.error("Failed to join community", joinErr);
            alert(joinErr.response?.data?.message || "Failed to join community");
          }
        }
      } else {
        navigate(`/community/${communityId}`);
      }
    } catch (err) {
      console.error("Failed to fetch community", err);
      navigate(`/community/${communityId}`);
    }
  };
 

  /* ---------- AI SUMMARY ---------- */
  const [summary, setSummary] = useState("");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  /* ---------- SYNC VOTES ---------- */
  useEffect(() => {
    setLocalUpvotes(upvoteCount);
    setLocalDownvotes(downvoteCount);
  }, [upvoteCount, downvoteCount]);

  useEffect(() => {
    if (!currentUser) {
      setUserVote(null);
      return;
    }
    if (currentUser.upvotedPosts?.includes(id)) setUserVote("upvote");
    else if (currentUser.downvotedPosts?.includes(id)) setUserVote("downvote");
    else setUserVote(null);
  }, [currentUser, id]);
 const handleDelete = () => {
    if (!window.confirm("Delete this post?")) return;
    onDelete(id); 
  };

  /* ---------- POLL VOTING ---------- */
  const handlePollVote = async (optionId) => {
    if (!currentUser) {
      alert("You must be logged in to vote");
      return;
    }

    if (!poll || !poll.isPoll) return;

    setLoadingOption(optionId);
    try {
      const res = await axios.patch(
        `${API}/posts/${id}`,
        { action: "pollVote", optionId },
        { withCredentials: true }
      );

      // backend returns { poll: { ... } }
      if (res.data?.poll) {
        setPoll(res.data.poll);
        setSelectedOptionId(res.data.poll.userOptionId || null);
      }
    } catch (err) {
      console.error("Poll vote failed", err);
    } finally {
      setLoadingOption(null);
    }
  };
  /* ---------- VOTE ---------- */
  const handleVote = async (type) => {
    if (!currentUser) {
      alert("You must be logged in to vote");
      return;
    }

    let up = localUpvotes;
    let down = localDownvotes;

    if (type === "upvote") {
      if (userVote === "upvote") {
        up--;
        setUserVote(null);
      } else {
        if (userVote === "downvote") down--;
        up++;
        setUserVote("upvote");
      }
    } else {
      if (userVote === "downvote") {
        down--;
        setUserVote(null);
      } else {
        if (userVote === "upvote") up--;
        down++;
        setUserVote("downvote");
      }
    }

    setLocalUpvotes(Math.max(up, 0));
    setLocalDownvotes(Math.max(down, 0));

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        { action: type },
        { withCredentials: true }
      );
      setLocalUpvotes(res.data.upvoteCount);
      setLocalDownvotes(res.data.downvoteCount);
    } catch {}
  };

  /* ---------- AI SUMMARY ---------- */
  const handleSummarize = async () => {
    if (summaryLoading || summary) return;

    setSummaryLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/posts/${id}/summary`,
        { withCredentials: true }
      );

      const text = res.data.summary || "No summary available.";
      setSummary(text);

      let i = 0;
      setDisplayedSummary("");
      const interval = setInterval(() => {
        i++;
        setDisplayedSummary(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, 20);
    } catch {
      alert("Failed to generate summary");
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleOpenShare = (e) => {
    console.log("PostCard: open share modal for post", id);
    e?.stopPropagation();
    setShowShare(true);
  };

  const handleCloseShare = () => setShowShare(false);

  return (
    <Card id={`post-${id}`} className="post-card">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#1d9bf0" }}>
           {user_name ? user_name[2].toUpperCase() : "?"}
          </Avatar>
        }
        title={user_name}
        subheader={
          <span className="post-community" style={{ cursor: communityId ? "pointer" : "default" }} onClick={handleCommunityClick}>
            {community_name} • {date}{edited ? " • edited" : ""}
          </span>
        }
        action={
          canDelete && (
            <IconButton onClick={handleDelete} sx={{ color: "#ef4444" }}>
              <DeleteOutlineIcon />
            </IconButton>
          )
        }
      />

      {title?.trim() && (
        <CardContent className="post-title-area">
          <Typography className="post-title">{title}</Typography>
        </CardContent>
      )}

      {description?.trim() && (
        <CardContent>
          <Typography className="post-description">
            {description}
          </Typography>

          {description.length > 100 && (
            <Button
              startIcon={<AutoAwesomeIcon />}
              onClick={
                ()=>{
              if(!isLoggedIn){
      alert("Please log in to summarize posts");
      navigate("/login");
      return;
              }
              handleSummarize();
    }
              }
              disabled={summaryLoading || !!summary}
              size="small"
              variant="outlined"
              className="ai-summary-btn"
            >
              {summaryLoading ? "Summarizing..." : "✨ Summarize"}
            </Button>
          )}

          {displayedSummary && (
            <div className="ai-summary-box">
              <Typography className="ai-summary-text">
                {displayedSummary}
              </Typography>
            </div>
          )}
        </CardContent>
      )}
{Array.isArray(images) && images.length > 0 && (
  <div className="image-slider">
    <img
      src={images[index]}
      alt={`post-${index}`}
      className="post-image"
    />

    {images.length > 1 && (
      <>
        {/* Prev */}
        <button
          className="nav-arrow prev-btn"
          onClick={index === 0 ? undefined : prevImage}
          style={{
            opacity: index === 0 ? 0.4 : 1,
            cursor: index === 0 ? "default" : "pointer",
          }}
        >
          ‹
        </button>

        {/* Next */}
        <button
          className="nav-arrow next-btn"
          onClick={index === images.length - 1 ? undefined : nextImage}
          style={{
            opacity: index === images.length - 1 ? 0.4 : 1,
            cursor:
              index === images.length - 1 ? "default" : "pointer",
          }}
        >
          ›
        </button>

        {/* Dots */}
        <div className="image-dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </>
    )}
  </div>
)}

      {poll?.isPoll && (
        <CardContent className="poll-cardcontent">
          <div className="poll-container">
            <div className="poll-question">{poll.question || "Poll"}</div>
            <div className="poll-options">
              {(poll.options || []).map((opt, idx) => {
                const optId = opt._id || opt.id || idx;
                const votes = opt.votes || 0;
                const selected = selectedOptionId && selectedOptionId.toString() === optId.toString();
                return (
                  <button
                    key={optId}
                    className={`poll-option-btn ${selected ? "selected" : ""}`}
                    disabled={loadingOption && loadingOption !== optId}
                    onClick={() => handlePollVote(optId)}
                  >
                    <span>{opt.text}</span>
                    <span className="poll-vote-count">{votes}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardContent>
      )}

      <CardActions disableSpacing>
        <ActionBar
          score={localUpvotes - localDownvotes}
          userVote={userVote}
          commentCount={comments.length}
          onVote={handleVote}
          onCommentClick={() => setExpanded((p) => !p)}
        onShare={() => setOpenShare(true)}
        />
      </CardActions>

      <ShareModal open={openShare} onClose={() => setOpenShare(false)} postId={id} />



  
      <Collapse in={expanded} timeout="auto" >
        <CardContent>
          <CommentSection postId={id} comments={comments} currentUser={currentUser} 
             onCommentsUpdate={(updatedComments) => {
              setComments(updatedComments); // <-- update parent state
                  }}  />
        </CardContent>
      </Collapse>
    </Card>
  );
}