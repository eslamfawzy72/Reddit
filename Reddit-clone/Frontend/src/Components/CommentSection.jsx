import React, { useState } from "react";
import axios from "axios";
import "../styles/commentSection.css";

const API = import.meta.env.VITE_API_URL;

// Recursive function to add a reply to a comment
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

// Recursive function to remove a comment/reply by id
const removeCommentRecursive = (comments, commId) =>
  comments
    .filter((c) => c._id !== commId)
    .map((c) => ({
      ...c,
      replies: c.replies ? removeCommentRecursive(c.replies, commId) : [],
    }));

// Recursive CommentItem component
const CommentItem = ({ comment, onReply, onEdit, onDelete, currentUser }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const submitReply = async () => {
    if (!replyText.trim()) return;
    await onReply(comment._id, replyText);
    setReplyText("");
    setShowReplyBox(false);
  };

  const submitEdit = async () => {
    if (!editText.trim()) return;
    await onEdit(comment._id, editText);
    setEditing(false);
  };

  return (
    <div className="comment-item">
      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-username">{comment.username}</span>
          <span className="comment-time">
            {new Date(comment.date).toLocaleString()}
            {comment.edited && " (edited)"}
          </span>
        </div>

      {editing ? (
  <div className="comment-edit-box">
    <input
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
    />
    <button className="save-btn" onClick={submitEdit}>Save</button>
    <button className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
  </div>
        ) : (
          <p className="comment-text">{comment.text}</p>
        )}

        <div className="action-bar">
          <button onClick={() => setShowReplyBox(!showReplyBox)}>Reply</button>

          {currentUser._id === comment.userID && !editing && (
            <>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={() => onDelete(comment._id)}>Delete</button>
            </>
          )}
        </div>

        {showReplyBox && (
          <div
            className="reply-box"
            style={{
              marginTop: "0.5rem",
              display: "flex",
              gap: "0.5rem",
              padding: "0.5rem",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              style={{
                flex: 1,
                padding: "0.4rem 0.6rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
                backgroundColor: "#fff",
                color: "#333",
                fontSize: "0.9rem",
              }}
            />
            <button onClick={submitReply}>Post</button>
          </div>
        )}

        {comment.replies?.length > 0 && (
          <div className="replies">
            {comment.replies.map((r) => (
              <CommentItem
                key={r._id}
                comment={r}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main CommentSection component
export default function CommentSection({ postId, comments = [], currentUser }) {
  const [allComments, setAllComments] = useState(comments);
  const [text, setText] = useState("");

  // Add Comment
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

  // Add Reply
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

  // Edit Comment/Reply
  const handleEdit = async (commId, newText) => {
    try {
      await axios.patch(
        `${API}/comments/${postId}/${commId}`,
        { text: newText },
        { withCredentials: true }
      );

      const updateCommentText = (comments) =>
        comments.map((c) => {
          if (c._id === commId)
            return { ...c, text: newText, edited: true, date: new Date() };
          if (c.replies?.length > 0)
            return { ...c, replies: updateCommentText(c.replies) };
          return c;
        });

      setAllComments((prev) => updateCommentText(prev));
    } catch (err) {
      console.error("Edit comment failed", err);
    }
  };

  // Delete Comment/Reply
  const handleDelete = async (commId) => {
    try {
      await axios.delete(`${API}/comments/${postId}/${commId}`, { withCredentials: true });
      setAllComments((prev) => removeCommentRecursive(prev, commId));
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  return (
    <div className="comments-section">
      {/* Add Comment */}
      <div className="add-comment">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Post</button>
      </div>

      {/* Comments */}
      {allComments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onReply={handleAddReply}
          onEdit={handleEdit}
          onDelete={handleDelete}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
}
