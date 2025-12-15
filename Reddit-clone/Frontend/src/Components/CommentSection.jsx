import React, { useState } from "react";
import axios from "axios";
import "../styles/commentSection.css";

const API = import.meta.env.VITE_API_URL;

// Recursive component for a comment and its replies
const CommentItem = ({ comment, onReply }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const submitReply = async () => {
    if (!replyText.trim()) return;

    await onReply(comment._id, replyText);
    setReplyText("");
    setShowReplyBox(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-username">{comment.username}</span>
          <span className="comment-time">
            {new Date(comment.date).toLocaleString()}
          </span>
        </div>

        <p className="comment-text">{comment.text}</p>

        <div className="action-bar">
          <button onClick={() => setShowReplyBox(!showReplyBox)}>Reply</button>
        </div>

        {showReplyBox && (
          <div className="reply-box"  style={{
              marginTop: '0.5rem',
              display: 'flex',
              gap: '0.5rem',
              padding: '0.5rem',
              borderRadius: '8px',
               border: 'none',
              backgroundColor: '#f5f5f5'  // Light gray background
            }}>
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
               style={{
                flex: 1,
                padding: '0.4rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                 border: 'none',  // Light gray border instead of black
                backgroundColor: '#fff',
                color: '#333',
                fontSize: '0.9rem'
              }}
            />
            <button onClick={submitReply}>Post</button>
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className="replies">
            {comment.replies.map((r) => (
              <CommentItem key={r._id} comment={r} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Recursive function to update a comment with its new reply
const addReplyToComments = (comments, commentId, reply) => {
  return comments.map((c) => {
    if (c._id === commentId) {
      return { ...c, replies: [...c.replies, reply] };
    }
    if (c.replies?.length > 0) {
      return { ...c, replies: addReplyToComments(c.replies, commentId, reply) };
    }
    return c;
  });
};

export default function CommentSection({ postId, comments = [] }) {
  const [allComments, setAllComments] = useState(comments);
  const [text, setText] = useState("");

  
  // ADD COMMENT
  const handleAddComment = async () => {
    if (!text.trim()) return;
    try {
      const res = await axios.post(
        `${API}/comments/${postId}`,
        { text },
        { withCredentials: true }
      );

      setAllComments((prev) => [...prev, res.data.comment]);
      setText("");
    } catch (err) {
      console.error("Add comment failed", err);
    }
  };

  
  // ADD REPLY
  const handleAddReply = async (commentId, replyText) => {
    if (!replyText.trim()) return;

    try {
      const res = await axios.post(
        `${API}/comments/${postId}/${commentId}/reply`,
        { text: replyText },
        { withCredentials: true }
      );

      setAllComments((prev) => addReplyToComments(prev, commentId, res.data.reply));
    } catch (err) {
      console.error("Add reply failed", err);
    }
  };

  return (
    <div className="comments-section">
      {/* ADD COMMENT */}
      <div className="add-comment">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Post</button>
      </div>

      {/* COMMENTS */}
      {allComments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onReply={handleAddReply}
        />
      ))}
    </div>
  );
}
