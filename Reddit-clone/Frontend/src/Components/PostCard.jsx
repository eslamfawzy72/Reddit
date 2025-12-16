import React, { useState, useEffect } from "react";

import { Card, CardHeader, CardMedia, CardContent, CardActions, Collapse, Avatar, IconButton, Typography } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import axios from "axios";
import ActionBar from "./ActionBar";
import CommentSection from "./CommentSection";
import "../styles/PostCard.css";

export default function PostCard({
  id,
  user_name,
  user_avatar,
  title,
  description,
  images = [],
  comments = [],
  upvoteCount = 0,
  downvoteCount = 0,
  commentCount = 0,
  date,
  community_name,
  edited = false,
  onVote,
  poll: pollProp,
  currentUser
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [isHidden, setIsHidden] = React.useState(false);
  const [loadingOption, setLoadingOption] = React.useState(null);
  const [localUpvotes, setLocalUpvotes] = useState(upvoteCount || 0);
  const [localDownvotes, setLocalDownvotes] = useState(downvoteCount || 0);
  const [userVote, setUserVote] = useState(null); // 'upvote' | 'downvote' | null
  const [poll, setPoll] = useState(pollProp);
const [selectedOptionId, setSelectedOptionId] = React.useState(
  pollProp?.userOptionId || null
);
React.useEffect(() => {
  setSelectedOptionId(pollProp?.userOptionId || null);
}, [pollProp?.userOptionId]);

useEffect(() => {
  setPoll(pollProp);
}, [pollProp]);


  const handleToggleComments = () => setExpanded(prev => !prev);
console.log("POST TITLE:", title);

  const nextImage = () => setIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  if (isHidden) {
    return (
      <div className="hidden-post">
        <Typography fontWeight="bold">Post hidden</Typography>
        <button className="undo-btn" onClick={() => setIsHidden(false)}>Undo</button>
      </div>
    );
  }

  // initialize vote state from props / currentUser
  React.useEffect(() => {
    setLocalUpvotes(upvoteCount || 0);
    setLocalDownvotes(downvoteCount || 0);
  }, [upvoteCount, downvoteCount]);

  

  // Correct initialization comparing to post id
  React.useEffect(() => {
    if (!currentUser) {
      setUserVote(null);
      return;
    }
    try {
      const upvoted = Array.isArray(currentUser.upvotedPosts) && currentUser.upvotedPosts.some(pid => pid.toString() === id);
      const downvoted = Array.isArray(currentUser.downvotedPosts) && currentUser.downvotedPosts.some(pid => pid.toString() === id);
      if (upvoted) setUserVote("upvote");
      else if (downvoted) setUserVote("downvote");
      else setUserVote(null);
    } catch (e) {
      setUserVote(null);
    }
  }, [currentUser, id]);

  // voting handler inside PostCard
  const handleVote = async (type) => {
    if (!currentUser) {
      alert('You must be logged in to vote');
      return;
    }

    // optimistic UI
    let up = localUpvotes;
    let down = localDownvotes;

    if (type === 'upvote') {
      if (userVote === 'upvote') {
        up = Math.max(up - 1, 0);
        setUserVote(null);
      } else if (userVote === 'downvote') {
        down = Math.max(down - 1, 0);
        up = up + 1;
        setUserVote('upvote');
      } else {
        up = up + 1;
        setUserVote('upvote');
      }
    } else if (type === 'downvote') {
      if (userVote === 'downvote') {
        down = Math.max(down - 1, 0);
        setUserVote(null);
      } else if (userVote === 'upvote') {
        up = Math.max(up - 1, 0);
        down = down + 1;
        setUserVote('downvote');
      } else {
        down = down + 1;
        setUserVote('downvote');
      }
    }

    setLocalUpvotes(up);
    setLocalDownvotes(down);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        { action: type },
        { withCredentials: true }
      );

      // sync counts from server
      if (res.data?.upvoteCount !== undefined) setLocalUpvotes(res.data.upvoteCount);
      if (res.data?.downvoteCount !== undefined) setLocalDownvotes(res.data.downvoteCount);
    } catch (err) {
      console.error('Vote failed', err);
    }
  };

  // derive a display title: prefer explicit title, otherwise use first paragraph of description
  return (
    <Card className="post-card" sx={{ backgroundColor: "#0b0f17", borderRadius: "20px", border: "1px solid rgba(29,155,240,0.15)", color: "#fff", overflow: "hidden" }}>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: "#1d9bf0" }}><img src={user_avatar} alt="" style={{ width: "100%" }} /></Avatar>}
        title={user_name}
        subheader={`${community_name} • ${date}${edited ? " • edited" : ""}`}
        sx={{ "& .MuiCardHeader-title": { color: "#fff", fontWeight: 600, fontSize: "15px" }, "& .MuiCardHeader-subheader": { color: "#9ca3af", fontSize: "13px" } }}
      />


      {/* TITLE AREA (dedicated) - always render area so divider shows even when no title */}
{title && title.trim() && (
  <CardContent className="post-title-area">
    <Typography className="post-title">
      {title}
    </Typography>
  </CardContent>
)}


      {/* DESCRIPTION */}
     {description && description.trim() && (
  <CardContent>
    <Typography className="post-description">
      {description}
    </Typography>
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
       
        <button
  className="nav-arrow prev-btn"
  onClick={index === 0 ? undefined : prevImage}
  style={{ opacity: index === 0 ? 0.4 : 1, cursor: index === 0 ? "default" : "pointer" }}
>
  ‹
</button>

   <button
  className="nav-arrow next-btn"
  onClick={index === images.length - 1 ? undefined : nextImage}
  style={{
    opacity: index === images.length - 1 ? 0.4 : 1,
    cursor: index === images.length - 1 ? "default" : "pointer"
  }}
>
  ›
</button>

        {/* dots */}
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




      {/* ACTION BAR */}
      {/* Poll UI — placed before actions so it lines up with description/title */}
      {poll?.isPoll && (
  <CardContent className="poll-cardcontent">
    <div className="poll-container">
      <div className="poll-question">{poll.question}</div>
      <div className="poll-options">
        {poll.options.map((opt) => (
          <button
            key={opt._id}
            className={`poll-option-btn ${
              selectedOptionId === opt._id ? "selected" : ""
            }`}
            onClick={async () => {
  if (loadingOption) return;
  setLoadingOption(opt._id);

  try {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/posts/${id}`,
      { action: "pollVote", optionId: opt._id },
      { withCredentials: true }
    );

    // ✅ update everything locally
    setSelectedOptionId(res.data.poll.userOptionId);
    setPoll(res.data.poll);

  } catch (err) {
    console.error("Poll vote failed", err);
  } finally {
    setLoadingOption(null);
  }
}}


            disabled={!!loadingOption}
          >
            <span className="poll-btn-text">{opt.text}</span>
            <span className="poll-vote-count">{opt.votes || 0}</span>
          </button>
        ))}
      </div>
    </div>
  </CardContent>
)}





      <CardActions disableSpacing>
        <ActionBar
          score={localUpvotes - localDownvotes}
          userVote={userVote}
          commentCount={comments.length}
          onHide={() => setIsHidden(true)}
          onVote={handleVote}
          onCommentClick={handleToggleComments}
        />
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <CommentSection postId={id} comments={comments} currentUser={currentUser} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
