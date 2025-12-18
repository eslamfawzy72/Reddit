import "../styles/ActionBar.css";
import { ArrowUp, ArrowDown, MessageCircle, Share2 } from "lucide-react";
import React from "react";

export default function ActionBar({
  score = 0,
  userVote = null, // "upvote" | "downvote" | null
  commentCount = 0,
  onHide,
  onCommentClick,
  onVote,
  onShare
}) {
  return (
    <div className="action-bar">
      <button
        className="btn vote_up"
        onClick={() => onVote && onVote("upvote")}
        style={{ color: userVote === "upvote" ? "#1c7ed6" : "inherit" }}
      >
        <ArrowUp size={20} />
      </button>

      <p className="vote-count">{score}</p>

      <button
        className="btn vote_down"
        onClick={() => onVote && onVote("downvote")}
        style={{ color: userVote === "downvote" ? "#1c7ed6" : "inherit" }}
      >
        <ArrowDown size={20} />
      </button>

      <button className="btn" onClick={onCommentClick}>
        <MessageCircle size={18} />
        <span>{commentCount}</span>
      </button>

      <button className="btn" onClick={(e) => onShare && onShare(e)} type="button">
        <Share2 size={18} />
        <span>Share</span>
      </button>

      <button className="btn hide-btn" onClick={onHide}>
        Hide
      </button>
    </div>
  );
}