import "../styles/ActionBar.css";
import { ArrowUp, ArrowDown, MessageCircle, Share2 } from "lucide-react";
import axios from "axios";

export default function ActionBar({
  postId,
  upvoteCount,
  downvoteCount,
  commentCount,
  onHide,
  onVote,
}) {
  const score = upvoteCount - downvoteCount;

  const vote = async (action) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/posts/${postId}`,
        { action },
        { withCredentials: true }
      );

      onVote({
        postId,
        upvoteCount: res.data.upvoteCount,
        downvoteCount: res.data.downvoteCount,
      });

    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  return (
    <div className="action-bar">
      <button className="btn vote_up" onClick={() => vote("upvote")}>
        <ArrowUp size={20} />
      </button>

      <p className="vote-count">{score}</p>

      <button className="btn vote_down" onClick={() => vote("downvote")}>
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
