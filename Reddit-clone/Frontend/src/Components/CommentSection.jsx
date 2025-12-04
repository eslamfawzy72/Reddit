import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Share2, Bookmark, Flag, Award, MessageSquare, Clock } from 'lucide-react';

// Sample data
const sampleComments = [
  {
    id: 1,
    username: 'jane_doe',
    avatar: 'JD',
    timestamp: '3 hours ago',
    text: 'Top-level comment',
    votes: 1520,
    isOP: true,
    isMod: false,
    awards: ['Gold'],
    replies: [],
    createdAt: Date.now() - 10800000
  }
];

const formatVotes = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "m";
  if (n >= 1000)     return (n / 1000).toFixed(1) + "k";
  return n;
};

const Avatar = ({ avatar, username, size = 32 }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: '#0079D3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.4,
    fontWeight: '600',
    color: 'white',
    flexShrink: 0,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease'
  }}
  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  >
    {avatar || username.charAt(0).toUpperCase()}
  </div>
);

const VoteButtons = ({ votes = 0, isLiked, isDisliked, onVote }) => {
  const getCount = () => {
    let count = votes;
    if (isLiked) count += 1;
    if (isDisliked) count -= 1;
    return count;
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '4px', 
      marginRight: '16px',
      minWidth: '40px'
    }}>
      <button 
        onClick={() => onVote('up')}
        style={{
          padding: '6px',
          borderRadius: '4px',
          border: 'none',
          background: isLiked ? 'rgba(255, 69, 0, 0.1)' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = isLiked ? 'rgba(255, 69, 0, 0.15)' : '#F8FAFC'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = isLiked ? 'rgba(255, 69, 0, 0.1)' : 'transparent'}
      >
        <ChevronUp size={20} color={isLiked ? '#FF4500' : '#878A8C'} strokeWidth={2.5}/>
      </button>
      <span style={{ 
        fontSize: '13px', 
        fontWeight: '700', 
        color: isLiked ? '#FF4500' : isDisliked ? '#7193FF' : '#1c1c1c',
        padding: '2px 8px',
        borderRadius: '12px',
        backgroundColor: isLiked ? 'rgba(255, 69, 0, 0.08)' : isDisliked ? 'rgba(113, 147, 255, 0.08)' : 'transparent'
      }}>
        {formatVotes(getCount())}
      </span>
      <button 
        onClick={() => onVote('down')}
        style={{
          padding: '6px',
          borderRadius: '4px',
          border: 'none',
          background: isDisliked ? 'rgba(113, 147, 255, 0.1)' : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = isDisliked ? 'rgba(113, 147, 255, 0.15)' : '#F8FAFC'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = isDisliked ? 'rgba(113, 147, 255, 0.1)' : 'transparent'}
      >
        <ChevronDown size={20} color={isDisliked ? '#7193FF' : '#878A8C'} strokeWidth={2.5}/>
      </button>
    </div>
  );
};

const ActionBar = ({ onReplyClick }) => {
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    color: '#64748B',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '12px', flexWrap: 'wrap' }}>
      <button 
        style={buttonStyle}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Share2 size={16} />
        <span>Share</span>
      </button>
      <button 
        style={buttonStyle}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Bookmark size={16} />
        <span>Save</span>
      </button>
      <button 
        style={buttonStyle}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Flag size={16} />
        <span>Report</span>
      </button>
      <button 
        style={buttonStyle}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <Award size={16} />
        <span>Give Award</span>
      </button>
      <button 
        onClick={onReplyClick}
        style={{...buttonStyle, color: '#0079D3', fontWeight: '600'}}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <MessageSquare size={16} />
        <span>Reply</span>
      </button>
    </div>
  );
};

const Comment = ({ comment, depth = 0, maxDepth = 10 }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleAddReply = () => {
    if(!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      username: 'current_user',
      avatar: 'CU',
      timestamp: 'just now',
      text: replyText.trim(),
      votes: 0,
      isOP: false,
      isMod: false,
      awards: [],
      replies: [],
      createdAt: Date.now()
    };
    setReplies([...replies, newReply]);
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

  const tooDeep = depth >= maxDepth && replies.length > 0;

  return (
    <div style={{
      padding: '16px 0',
      borderBottom: depth === 0 ? '1px solid #F1F5F9' : 'none',
      ...(depth > 0 ? { 
        paddingLeft: '32px', 
        marginLeft: '16px',
        borderLeft: '2px solid #E2E8F0'
      } : {})
    }}>
      <div style={{ display: 'flex' }}>
        <VoteButtons 
          votes={comment.votes} 
          isLiked={isLiked} 
          isDisliked={isDisliked} 
          onVote={handleVote}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Avatar avatar={comment.avatar} username={comment.username} size={32} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>
                u/{comment.username}
              </span>
              {comment.isOP && (
                <span style={{ 
                  fontSize: '11px', 
                  backgroundColor: '#0079D3', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontWeight: '700', 
                  letterSpacing: '0.3px' 
                }}>
                  OP
                </span>
              )}
              {comment.isMod && (
                <span style={{ 
                  fontSize: '11px', 
                  backgroundColor: '#10B981', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '12px', 
                  fontWeight: '700' 
                }}>
                  MOD
                </span>
              )}
              <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                {comment.timestamp}
              </span>
            </div>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              style={{
                marginLeft: 'auto',
                fontSize: '12px',
                color: '#94A3B8',
                fontWeight: '600',
                padding: '4px 8px',
                border: '1px solid #E2E8F0',
                background: 'white',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.backgroundColor = '#F8FAFC';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              {collapsed ? 'Show' : 'Hide'}
            </button>
          </div>

          {!collapsed && (
            <>
              <div style={{ 
                fontSize: '14px', 
                color: '#334155', 
                lineHeight: '1.6', 
                marginBottom: '12px',
                paddingRight: '16px'
              }}>
                {comment.text}
              </div>

              {comment.awards && comment.awards.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  {comment.awards.map((award, i) => (
                    <div 
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#7C5900',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        border: '1px solid #F4E5B8',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(255, 215, 0, 0.2)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <Award size={12} />
                      <span>{award}</span>
                    </div>
                  ))}
                </div>
              )}

              <ActionBar onReplyClick={() => setShowReply(!showReply)} />

              {showReply && (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '16px', 
                  backgroundColor: '#F8FAFC', 
                  borderRadius: '8px', 
                  border: '1px solid #E2E8F0' 
                }}>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="What are your thoughts?"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      padding: '12px',
                      fontSize: '14px',
                      color: '#1E293B',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = '#0079D3';
                      e.target.style.boxShadow = '0 0 0 3px rgba(0, 121, 211, 0.1)';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor = '#CBD5E1';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '12px' }}>
                    <button
                      onClick={() => setShowReply(false)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        color: '#64748B',
                        fontSize: '13px',
                        fontWeight: '600',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = '#94A3B8';
                        e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.backgroundColor = 'white';
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddReply}
                      disabled={!replyText.trim()}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '20px',
                        border: 'none',
                        backgroundColor: replyText.trim() ? '#0079D3' : '#E2E8F0',
                        color: replyText.trim() ? 'white' : '#94A3B8',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        boxShadow: 'none'
                      }}
                      onMouseEnter={e => {
                        if(replyText.trim()) {
                          e.currentTarget.style.backgroundColor = '#005EA6';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 121, 211, 0.2)';
                        }
                      }}
                      onMouseLeave={e => {
                        if(replyText.trim()) {
                          e.currentTarget.style.backgroundColor = '#0079D3';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}

              {replies && replies.length > 0 && (
                <div style={{ marginTop: '14px' }}>
                  {tooDeep ? (
                    <div style={{ paddingLeft: '10px' }}>
                      <a 
                        href="#" 
                        style={{ fontSize: '13px', color: '#0079D3', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s ease' }}
                        onMouseEnter={e => e.target.style.color = '#005EA6'}
                        onMouseLeave={e => e.target.style.color = '#0079D3'}
                      >
                        Continue this thread →
                      </a>
                    </div>
                  ) : (
                    replies.map(r => <Comment key={r.id} comment={r} depth={depth + 1} maxDepth={maxDepth} />)
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ initialComments = sampleComments }) => {
  const [comments, setComments] = useState(initialComments);
  const [sort, setSort] = useState('Best');
  const [newComment, setNewComment] = useState('');

  const sortOptions = ['Best', 'Top', 'New', 'Controversial', 'Old', 'Q&A'];

  const handleAddTopLevel = () => {
    if(!newComment.trim()) return;
    const payload = {
      id: Date.now(),
      username: 'current_user',
      avatar: 'CU',
      timestamp: 'just now',
      text: newComment.trim(),
      votes: 0,
      isOP: false,
      isMod: false,
      awards: [],
      replies: [],
      createdAt: Date.now()
    };
    setComments([payload, ...comments]);
    setNewComment('');
  };

  const getSortedComments = () => {
    const sorted = [...comments];
    
    switch(sort) {
      case 'Top':
        return sorted.sort((a, b) => b.votes - a.votes);
      
      case 'New':
        return sorted.sort((a, b) => (b.createdAt || b.id) - (a.createdAt || a.id));
      
      case 'Old':
        return sorted.sort((a, b) => (a.createdAt || a.id) - (b.createdAt || b.id));
      
      case 'Controversial':
        return sorted.sort((a, b) => Math.abs(a.votes) - Math.abs(b.votes));
      
      case 'Q&A':
        return sorted.sort((a, b) => {
          if (a.isOP && !b.isOP) return -1;
          if (!a.isOP && b.isOP) return 1;
          return b.votes - a.votes;
        });
      
      case 'Best':
      default:
        return sorted.sort((a, b) => {
          const scoreA = a.votes + ((a.createdAt || a.id) / 1000000000);
          const scoreB = b.votes + ((b.createdAt || b.id) / 1000000000);
          return scoreB - scoreA;
        });
    }
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#F8FAFC',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Sort by</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #CBD5E1',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#1E293B',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={e => {
              e.target.style.borderColor = '#0079D3';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 121, 211, 0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#CBD5E1';
              e.target.style.boxShadow = 'none';
            }}
          >
            {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <textarea
            rows={4}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              padding: '14px',
              fontSize: '14px',
              color: '#1E293B',
              fontFamily: 'inherit',
              resize: 'vertical',
              transition: 'all 0.2s ease',
              outline: 'none',
              backgroundColor: '#FAFAFA'
            }}
            onFocus={e => {
              e.target.style.borderColor = '#0079D3';
              e.target.style.backgroundColor = 'white';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 121, 211, 0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = '#CBD5E1';
              e.target.style.backgroundColor = '#FAFAFA';
              e.target.style.boxShadow = 'none';
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '12px' }}>
            <button
              onClick={() => setNewComment('')}
              style={{
                padding: '10px 24px',
                borderRadius: '24px',
                border: '1px solid #CBD5E1',
                color: '#64748B',
                fontSize: '14px',
                fontWeight: '600',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#F8FAFC';
                e.currentTarget.style.borderColor = '#94A3B8';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddTopLevel}
              disabled={!newComment.trim()}
              style={{
                padding: '10px 24px',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: newComment.trim() ? '#0079D3' : '#E2E8F0',
                color: newComment.trim() ? 'white' : '#94A3B8',
                fontSize: '14px',
                fontWeight: '600',
                cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                boxShadow: newComment.trim() ? '0 2px 4px rgba(0,121,211,0.15)' : 'none'
              }}
              onMouseEnter={e => {
                if(newComment.trim()) {
                  e.currentTarget.style.backgroundColor = '#005EA6';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,121,211,0.25)';
                }
              }}
              onMouseLeave={e => {
                if(newComment.trim()) {
                  e.currentTarget.style.backgroundColor = '#0079D3';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,121,211,0.15)';
                }
              }}
            >
              Comment
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {getSortedComments().map(c => <Comment key={c.id} comment={c} depth={0} />)}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;