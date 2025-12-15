import React, { useState, useEffect } from "react";
import "../styles/ActionBar.css";
import { ArrowUp, ArrowDown, MessageCircle, Share2 } from "lucide-react";

export default function ActionBar({
  upvoteCount = 0,
  downvoteCount = 0,
  commentCount = 0,
  onHide,
  onCommentClick
}) {
  // score = upvotes - downvotes
  const initialScore = upvoteCount - downvoteCount;

  const [vote, setVote] = useState(null); // "up" | "down" | null
  const [score, setScore] = useState(initialScore);

  const handleUpvote = () => {
    if (vote === "up") {
      // remove upvote
      setVote(null);
      setScore((s) => s - 1);
    } else if (vote === "down") {
      // switch from down → up
      setVote("up");
      setScore((s) => s + 2);
    } else {
      // add upvote
      setVote("up");
      setScore((s) => s + 1);
    }
  };

  const handleDownvote = () => {
    if (vote === "down") {
      // remove downvote
      setVote(null);
      setScore((s) => s + 1);
    } else if (vote === "up") {
      // switch from up → down
      setVote("down");
      setScore((s) => s - 2);
    } else {
      // add downvote
      setVote("down");
      setScore((s) => s - 1);
    }
  };

  return (
    <div className="action-bar">
      {/* UPVOTE */}
      <button className="btn vote_up" onClick={handleUpvote}>
        <ArrowUp
          size={20}
          color={vote === "up" ? "#1976d2" : "gray"}
          fill={vote === "up" ? "#1976d2" : "none"}
        />
      </button>

      {/* SCORE */}
      <p className="vote-count">{score}</p>

      {/* DOWNVOTE */}
      <button className="btn vote_down" onClick={handleDownvote}>
        <ArrowDown
          size={20}
          color={vote === "down" ? "#1976d2" : "gray"}
          fill={vote === "down" ? "#1976d2" : "none"}
        />
      </button>

      {/* COMMENTS */}
      <button className="btn">
        <MessageCircle size={20} 
        onClick={onCommentClick}/>
        <span>{commentCount}</span>
      </button>

      {/* SHARE */}
      <button className="btn">
        <Share2 size={20} />
        <span>Share</span>
      </button>

      {/* HIDE */}
      <button className="btn" onClick={onHide}>
        Hide
      </button>
    </div>
  );
}
