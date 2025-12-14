import "../styles/ActionBar.css";
import { ArrowUp, ArrowDown, MessageCircle, Share2 } from "lucide-react";
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function ActionBar({ postId, upvoteCount, downvoteCount, commentCount, onHide, onVote, currentUser }) {
  const [userVote, setUserVote] = useState(null); // null | "upvote" | "downvote"
  const [score, setScore] = useState(upvoteCount - downvoteCount);

  useEffect(() => {
    setScore(upvoteCount - downvoteCount);
  }, [upvoteCount, downvoteCount]);

  const handleVote = async (type) => {
    if (!currentUser) return;

    let newScore = score;

    // Optimistic UI
    if (type === "upvote") {
      if (userVote === "upvote") {
        newScore -= 1;
        setUserVote(null);
      } else if (userVote === "downvote") {
        newScore += 2;
        setUserVote("upvote");
      } else {
        newScore += 1;
        setUserVote("upvote");
      }
    } else if (type === "downvote") {
      if (userVote === "downvote") {
        newScore += 1;
        setUserVote(null);
      } else if (userVote === "upvote") {
        newScore -= 2;
        setUserVote("downvote");
      } else {
        newScore -= 1;
        setUserVote("downvote");
      }
    }

    setScore(newScore);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        { action: type },
        { withCredentials: true }
      );

      if (onVote) {
        onVote({
          postId,
          upvoteCount: res.data.upvoteCount,
          downvoteCount: res.data.downvoteCount,
          userVote: type
        });
      }
    } catch (err) {
      console.error("Vote failed", err);
      // Optional: revert UI
    }
  };

  return (
    <div className="action-bar">
      <button className={`btn vote_up ${userVote === "upvote" ? "active" : ""}`} onClick={() => handleVote("upvote")}>
        <ArrowUp size={20} />
      </button>

      <p className="vote-count">{score}</p>

      <button className={`btn vote_down ${userVote === "downvote" ? "active" : ""}`} onClick={() => handleVote("downvote")}>
        <ArrowDown size={20} />
      </button>

      <button className="btn">
        <MessageCircle size={18} />
        <span>{commentCount}</span>
      </button>

      <button className="btn">
        <Share2 size={18} />
        <span>Share</span>
      </button>

      <button className="btn hide-btn" onClick={onHide}>
        Hide
      </button>
    </div>
  );
}
