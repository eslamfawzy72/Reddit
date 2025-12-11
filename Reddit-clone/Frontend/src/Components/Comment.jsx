import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import "../styles/comment.css";

// ------------------- Avatar -------------------
const Avatar = ({ avatar, username, size = 32 }) => (
  <div
    className="comment-avatar"
    style={{
      width: size,
      height: size,
      fontSize: size / 2.2,
    }}
  >
    {avatar || username[0].toUpperCase()}
  </div>
);

// ------------------- VoteButtons -------------------
const VoteButtons = ({ votes, isLiked, isDisliked, onVote }) => (
  <div className="vote-buttons">
    <button onClick={() => onVote("up")} className={`vote-btn ${isLiked ? "liked" : ""}`}>
      <ArrowBigUp size={22} strokeWidth={2.2} />
    </button>

    <span className={`vote-count ${isLiked ? "liked" : isDisliked ? "disliked" : ""}`}>
      {votes || 0}
    </span>

    <button onClick={() => onVote("down")} className={`vote-btn ${isDisliked ? "disliked" : ""}`}>
      <ArrowBigDown size={22} strokeWidth={2.2} />
    </button>
  </div>
);

// ------------------- ActionBar -------------------
const ActionBar = ({ onReplyClick }) => (
  <div className="action-bar">
    <button className="reply-btn" onClick={onReplyClick}>
      Reply
    </button>
  </div>
);

// ------------------- MAIN COMMENT -------------------
function Comment({ comment, depth = 0, maxDepth = 7 }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [localReplies, setLocalReplies] = useState(comment.replies);

  useEffect(() => {
    setLocalReplies(comment.replies || []);
  }, [comment.replies]);

  const handleAddReply = () => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      username: "current_user",
      avatar: "CU",
      timestamp: "just now",
      text: replyText.trim(),
      votes: 1,
      isOP: false,
      replies: [],
    };

    setLocalReplies((prev) => [...prev, newReply]);
    setReplyText("");
    setShowReply(false);
  };

  const handleVote = (type) => {
    if (type === "up") {
      setIsLiked(!isLiked);
      if (isDisliked) setIsDisliked(false);
    } else {
      setIsDisliked(!isDisliked);
      if (isLiked) setIsLiked(false);
    }
  };

  const tooDeep = depth >= maxDepth && localReplies.length > 0;

  return (
    <div
      className={`comment-wrapper ${depth > 0 ? "nested" : "root"}`}
      style={{
        paddingLeft: depth > 0 ? "40px" : "0",
        marginLeft: depth > 0 ? "20px" : "0",
      }}
    >
      <div className="comment-container">
        <VoteButtons
          votes={comment.votes || 5}
          isLiked={isLiked}
          isDisliked={isDisliked}
          onVote={handleVote}
        />

        <div className="comment-content">
          <div className="comment-header">
            <Avatar avatar={comment.avatar} username={comment.username} />

            <div className="comment-user-meta">
              <span className="username">u/{comment.username}</span>
              <span className="timestamp">
                <Clock size={12} />
                {comment.date}
              </span>
            </div>

            <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? "[+]" : "[–]"}
            </button>
          </div>

          {collapsed ? (
            <div className="collapsed-text">[comment hidden]</div>
          ) : (
            <>
              <div className="comment-text">{comment.text}</div>

              <ActionBar onReplyClick={() => setShowReply(!showReply)} />

              {showReply && (
                <div className="reply-box">
                  <textarea
                    rows="4"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="reply-textarea"
                  />

                  <div className="reply-actions">
                    <button className="btn-cancel" onClick={() => setShowReply(false)}>
                      Cancel
                    </button>
                    <button
                      className="btn-reply"
                      onClick={handleAddReply}
                      disabled={!replyText.trim()}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}

              {localReplies?.length > 0 && (
                <div className="nested-replies">
                  {tooDeep ? (
                    <a href="#" className="continue-thread">
                      Continue this thread →
                    </a>
                  ) : (
                    localReplies.map((reply) => (
                      <Comment
                        key={reply._id || reply.id}
                        comment={reply}
                        depth={depth + 1}
                        maxDepth={maxDepth}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Comment;
