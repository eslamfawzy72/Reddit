import React, { useState, useEffect } from "react";
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
  date,
  community_name,
  edited = false,
  poll: pollProp,
  currentUser,
  canDelete = false,
  onDeleteSuccess, 
}) {
  const [expanded, setExpanded] = useState(false);

  const [localUpvotes, setLocalUpvotes] = useState(upvoteCount);
  const [localDownvotes, setLocalDownvotes] = useState(downvoteCount);
  const [userVote, setUserVote] = useState(null);

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

  /* ---------- DELETE ---------- */
  const handleDeletePost = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        { withCredentials: true }
      );

      onDeleteSuccess?.(id); // 🔥 notify parent
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
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

  return (
    <Card className="post-card">
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "#1d9bf0" }}>
            <img src={user_avatar} alt="" style={{ width: "100%" }} />
          </Avatar>
        }
        title={user_name}
        subheader={`${community_name} • ${date}${edited ? " • edited" : ""}`}
        action={
          canDelete && (
            <IconButton onClick={handleDeletePost} sx={{ color: "#ef4444" }}>
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
              onClick={handleSummarize}
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

      <CardActions disableSpacing>
        <ActionBar
          score={localUpvotes - localDownvotes}
          userVote={userVote}
          commentCount={comments.length}
          onVote={handleVote}
          onCommentClick={() => setExpanded((p) => !p)}
        />
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <CommentSection
            postId={id}
            comments={comments}
            currentUser={currentUser}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
}
