// Comment.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Award } from 'lucide-react';
import { ArrowBigUp, ArrowBigDown } from "lucide-react";


// === Small Helper Components (you probably already have these) ===
const Avatar = ({ avatar, username, size = 32 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: '#0079D3',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: size / 2.2,
      flexShrink: 0,
    }}
  >
    {avatar || username[0].toUpperCase()}
  </div>
);

const VoteButtons = ({ votes, isLiked, isDisliked, onVote }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "4px",
      marginRight: "12px",
      userSelect: "none",
    }}
  >
    <button
      onClick={() => onVote("up")}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: isLiked ? "#FF4500" : "#94A3B8", // Reddit orange
        padding: 0,
      }}
    >
      <ArrowBigUp size={22} strokeWidth={2.2} />
    </button>

    <span
      style={{
        fontWeight: "700",
        fontSize: "13px",
        color: isLiked ? "#FF4500" : isDisliked ? "#7193FF" : "#D7DADC",
      }}
    >
      {votes || 0}
    </span>

    <button
      onClick={() => onVote("down")}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        color: isDisliked ? "#7193FF" : "#94A3B8",
        padding: 0,
      }}
    >
      <ArrowBigDown size={22} strokeWidth={2.2} />
    </button>
  </div>
);

const ActionBar = ({ onReplyClick }) => (
  <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
    <button
      onClick={onReplyClick}
      style={{
        fontSize: '13px',
        color: '#64748B',
        background: 'none',
        border: 'none',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '6px 10px',
        borderRadius: '4px',
      }}
      onMouseEnter={(e) => (e.target.style.backgroundColor = '#F1F5F9')}
      onMouseLeave={(e) => (e.target.style.backgroundColor = 'transparent')}
    >
      Reply
    </button>
    
  </div>
);

// === MAIN COMMENT COMPONENT ===
function Comment({ key,comment, depth = 0, maxDepth = 7 }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  // This is the key fix: local replies that stay in sync with props
  const [localReplies, setLocalReplies] = useState(comment.replies);

  // Sync replies from comment.replies (in case parent updates them)
  useEffect(() => {
    setLocalReplies(comment.replies || []);
  }, [comment.replies]);

  const handleAddReply = () => {
    if (!replyText.trim()) return;

    const newReply = {
      id: Date.now(),
      username: 'current_user',
      avatar: 'CU',
      timestamp: 'just now',
      text: replyText.trim(),
      votes: 1,
      isOP: false,
      isMod: false,
      awards: [],
      replies: [],
    };

    setLocalReplies((prev) => [...prev, newReply]);
    setReplyText('');
    setShowReply(false);
  };

  const handleVote = (type) => {
    if (type === 'up') {
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
      style={{
        padding: '16px 0',
        borderBottom: depth === 0 ? '1px solid #343536' : 'none',
        ...(depth > 0
          ? {
              paddingLeft: '40px',
              marginLeft: '20px',
              borderLeft: '2px solid #343536',
            }
          : {}),
      }}
    >
      <div style={{ display: 'flex' }}>
        {/* Vote Buttons */}
        <VoteButtons votes={5} isLiked={false} isDisliked={false} onVote={handleVote} />

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Avatar avatar={comment.avatar} username={comment.username} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '600', color: '#D7DADC' }}>u/{comment.username}</span>

              

              

              <span style={{ fontSize: '12px', color: '#818384', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                {comment.date}
              </span>
            </div>

            {/* Collapse Button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                marginLeft: 'auto',
                padding: '4px 10px',
                background: 'transparent',
                border: '1px solid #343536',
                color: '#818384',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {collapsed ? '[+]' : '[–]'}
            </button>
          </div>

          {/* Collapsed State */}
          {collapsed ? (
            <div style={{ color: '#818384', fontSize: '13px', fontStyle: 'italic' }}>
              [comment hidden]
            </div>
          ) : (
            <>
              {/* Comment Text */}
              <div style={{ color: '#1b5597ff', lineHeight: '1.5', marginBottom: '12px', fontSize: '14px' }}>
                {comment.text}
              </div>

              {/* Awards */}
            
              {/* Action Bar */}
              <ActionBar onReplyClick={() => setShowReply(!showReply)} />

              {/* Reply Box */}
              {showReply && (
                <div style={{ marginTop: '16px', backgroundColor: '#1a1a1b', padding: '16px', borderRadius: '8px', border: '1px solid #343536' }}>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="What are your thoughts?"
                    style={{
                      width: '100%',
                      backgroundColor: '#0a0a0a',
                      color: '#D7DADC',
                      border: '1px solid #343536',
                      borderRadius: '8px',
                      padding: '12px',
                      fontSize: '14px',
                      resize: 'vertical',
                      outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button
                      onClick={() => setShowReply(false)}
                      style={{ padding: '8px 16px', background: 'transparent', color: '#818384', border: '1px solid #343536', borderRadius: '999px' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddReply}
                      disabled={!replyText.trim()}
                      style={{
                        padding: '8px 20px',
                        backgroundColor: replyText.trim() ? '#0079D3' : '#343536',
                        color: 'white',
                        border: 'none',
                        borderRadius: '999px',
                        cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                        fontWeight: '600',
                      }}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}

              {/* Nested Replies */}
              {localReplies?.length > 0 && (
  <div style={{ marginTop: '16px' }}>
    {tooDeep ? (
      <div style={{ paddingLeft: '12px' }}>
        <a
          href="#"
          style={{ color: '#0079D3', fontSize: '13px', fontWeight: '600' }}
        >
          Continue this thread →
        </a>
      </div>
    ) : (
      localReplies.map((reply) => (
        <Comment
          key={reply._id || reply.id || Math.random()} // fallback if neither exists
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