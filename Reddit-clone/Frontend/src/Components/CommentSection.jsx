import React, { useState } from "react";
import "../styles/commentSection.css";

const Avatar = ({ username }) => (
  <div className="avatar">
    <span className="avatar-text">{username[0].toUpperCase()}</span>
  </div>
);

const VoteButtons = () => {
  const [votes, setVotes] = useState(0);

  return (
    <div className="vote-buttons">
      <button className="vote-btn" onClick={() => setVotes(votes + 1)}>
        ▲
      </button>
      <span className="vote-count">{votes}</span>
      <button className="vote-btn" onClick={() => setVotes(votes - 1)}>
        ▼
      </button>
    </div>
  );
};

const ActionBar = ({ onReply }) => (
  <div className="action-bar">
    <button className="action-btn" onClick={onReply}>Reply</button>
    <button className="action-btn">Share</button>
    <button className="action-btn">Report</button>
  </div>
);

const CommentItem = ({ comment, onReply }) => (
  <div className="comment-item">
    <Avatar username={comment.username} />

    <div className="comment-body">
      <div className="comment-header">
        <span className="comment-username">{comment.username}</span>
        <span className="comment-time">{comment.time}</span>
      </div>

      <p className="comment-text">{comment.text}</p>

      <VoteButtons />
      <ActionBar onReply={() => onReply(comment.id)} />

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </div>
      )}
    </div>
  </div>
);

export default function CommentSection({
  username,
  timestamp,
  postContent,
  comments,
  onReply,
}) {
  return (
    <div className="post-container">
      {/* Post Header */}
      <div className="post-header">
        <Avatar username={username} />

        <div className="post-user-info">
          <p className="post-username">{username}</p>
          <p className="post-time">{timestamp}</p>
        </div>
      </div>

      {/* Post Content */}
      <p className="post-content">{postContent}</p>

      {/* Comments */}
      <div className="comments-section">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onReply={onReply} />
        ))}
      </div>
    </div>
  );
}
