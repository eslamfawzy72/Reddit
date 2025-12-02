import React, { useState } from "react";
import "../ActionBar.css";
import { ArrowUp, ArrowDown, MessageCircle, Share2 } from "lucide-react";

export default function ActionBar(props) {
  const [vote, setVote] = useState(null); // "up", "down", or null
  const [likes, setLikes] = useState(props.num_of_likes || 0); // track local likes

  const handleUpvote = () => {
    if (vote === "up") {
      setVote(null);
      setLikes((prev) => prev - 1); // remove upvote
    } else {
      setVote("up");
      setLikes((prev) => prev + 1); // add upvote
      if (vote === "down") setLikes((prev) => prev + 1); // remove previous downvote
    }
  };

  const handleDownvote = () => {
    if (vote === "down") {
      setVote(null);
      setLikes((prev) => prev + 1); // remove downvote (if needed)
    } else {
      setVote("down");
      setLikes((prev) => prev - 1); // add downvote
      if (vote === "up") setLikes((prev) => prev - 1); // remove previous upvote
    }
  };

  const open_full_post = () => console.log("Open full post");
  const share_url = () => console.log("Share post URL");

  return (
    <div className="action-bar">
      {/* UPVOTE */}
      <button className="btn vote_up" onClick={handleUpvote}>
        <ArrowUp
          size={20}
          color={vote === "up" ? "blue" : "gray"}
          fill={vote === "up" ? "blue" : "none"}
        />
      </button>

      {/* VOTE COUNT */}
      <p className="vote-count">{likes}</p>

      {/* DOWNVOTE */}
      <button className="btn vote_down" onClick={handleDownvote}>
        <ArrowDown
          size={20}
          color={vote === "down" ? "blue" : "gray"}
          fill={vote === "down" ? "blue" : "none"}
        />
      </button>

      {/* COMMENTS */}
      <button className="btn" onClick={open_full_post}>
        <MessageCircle size={20} />
        <span>{props.num_of_comments}</span>
      </button>

      {/* SHARE */}
      <button className="btn" onClick={share_url}>
        <Share2 size={20} />
        <span>Share</span>
      </button>

      {/* HIDE */}
      <button className="btn" onClick={props.onHide}>
        <span>Hide</span>
      </button>
    </div>
  );
}