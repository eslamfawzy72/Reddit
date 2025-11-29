import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Share2, Bookmark, Flag, Award, MessageSquare } from 'lucide-react';

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

const formatVotes = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n);

const Avatar = ({ avatar, username }) => (
  <div style={{
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#0079D3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    fontWeight: '600',
    color: 'white',
    flexShrink: 0,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  }}>
    {avatar || username.charAt(0).toUpperCase()}
  </div>
);

const VoteButtons = ({ votes = 0, orientation = 'vertical' }) => {
  const [voteState, setVoteState] = useState(null); // null, 'up', or 'down'

  const handleVote = (type) => {
    if (voteState === type) {
      setVoteState(null); // Remove vote if clicking same button
    } else {
      setVoteState(type); // Set new vote
    }
  };

  // Calculate displayed count based on vote state
  const getCount = () => {
    if (voteState === 'up') return votes + 1;
    if (voteState === 'down') return votes - 1;
    return votes;
  };

  const baseBtn = {
    padding: '6px',
    borderRadius: '4px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  };

  const upColor = voteState === 'up' ? '#FF4500' : '#878A8C';
  const downColor = voteState === 'down' ? '#7193FF' : '#878A8C';

  if(orientation === 'horizontal') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          style={{...baseBtn, backgroundColor: voteState === 'up' ? '#FFF3F0' : 'transparent'}} 
          onClick={() => handleVote('up')}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = voteState === 'up' ? '#FFF3F0' : '#F6F7F8'} 
          onMouseLeave={e => e.currentTarget.style.backgroundColor = voteState === 'up' ? '#FFF3F0' : 'transparent'}
        >
          <ChevronUp size={18} color={upColor} strokeWidth={2.5}/>
        </button>
        <span style={{ fontSize: '13px', fontWeight: '700', color: voteState ? (voteState === 'up' ? '#FF4500' : '#7193FF') : '#1c1c1c', minWidth: '40px', textAlign: 'center' }}>
          {formatVotes(getCount())}
        </span>
        <button 
          style={{...baseBtn, backgroundColor: voteState === 'down' ? '#F0F5FF' : 'transparent'}} 
          onClick={() => handleVote('down')}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = voteState === 'down' ? '#F0F5FF' : '#F6F7F8'} 
          onMouseLeave={e => e.currentTarget.style.backgroundColor = voteState === 'down' ? '#F0F5FF' : 'transparent'}
        >
          <ChevronDown size={18} color={downColor} strokeWidth={2.5}/>
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginRight: '14px' }}>
      <button 
        style={{...baseBtn, backgroundColor: voteState === 'up' ? '#FFF3F0' : 'transparent'}} 
        onClick={() => handleVote('up')}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = voteState === 'up' ? '#FFF3F0' : '#F6F7F8'} 
        onMouseLeave={e => e.currentTarget.style.backgroundColor = voteState === 'up' ? '#FFF3F0' : 'transparent'}
      >
        <ChevronUp size={20} color={upColor} strokeWidth={2.5}/>
      </button>
      <span style={{ fontSize: '13px', fontWeight: '700', color: voteState ? (voteState === 'up' ? '#FF4500' : '#7193FF') : '#1c1c1c' }}>
        {formatVotes(getCount())}
      </span>
      <button 
        style={{...baseBtn, backgroundColor: voteState === 'down' ? '#F0F5FF' : 'transparent'}} 
        onClick={() => handleVote('down')}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = voteState === 'down' ? '#F0F5FF' : '#F6F7F8'} 
        onMouseLeave={e => e.currentTarget.style.backgroundColor = voteState === 'down' ? '#F0F5FF' : 'transparent'}
      >
        <ChevronDown size={20} color={downColor} strokeWidth={2.5}/>
      </button>
    </div>
  );
};

const ActionBar = ({ onReplyClick }) => {
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '6px 10px',
    borderRadius: '4px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    color: '#878A8C',
    transition: 'all 0.2s ease'
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px' }}>
      <button style={buttonStyle} onMouseEnter={e => {e.currentTarget.style.backgroundColor = '#F6F7F8'; e.currentTarget.style.color = '#1c1c1c'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#878A8C'}}>
        <Share2 size={15} />
        <span>Share</span>
      </button>
      <button style={buttonStyle} onMouseEnter={e => {e.currentTarget.style.backgroundColor = '#F6F7F8'; e.currentTarget.style.color = '#1c1c1c'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#878A8C'}}>
        <Bookmark size={15} />
        <span>Save</span>
      </button>
      <button style={buttonStyle} onMouseEnter={e => {e.currentTarget.style.backgroundColor = '#F6F7F8'; e.currentTarget.style.color = '#1c1c1c'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#878A8C'}}>
        <Flag size={15} />
        <span>Report</span>
      </button>
      <button style={buttonStyle} onMouseEnter={e => {e.currentTarget.style.backgroundColor = '#F6F7F8'; e.currentTarget.style.color = '#1c1c1c'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#878A8C'}}>
        <Award size={15} />
        <span>Award</span>
      </button>
      <button onClick={onReplyClick} style={buttonStyle} onMouseEnter={e => {e.currentTarget.style.backgroundColor = '#F6F7F8'; e.currentTarget.style.color = '#1c1c1c'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#878A8C'}}>
        <MessageSquare size={15} />
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

  const tooDeep = depth >= maxDepth && replies.length > 0;

  return (
    <div style={{
      padding: '10px 0',
      ...(depth > 0 ? { paddingLeft: '18px', borderLeft: '2px solid #E8EAED' } : {})
    }}>
      <div style={{ display: 'flex' }}>
        {depth === 0 && <VoteButtons votes={comment.votes} orientation="vertical" />}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Avatar avatar={comment.avatar} username={comment.username} />
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#1c1c1c' }}>u/{comment.username}</span>
            {comment.isOP && <span style={{ fontSize: '11px', backgroundColor: '#0079D3', color: 'white', padding: '3px 8px', borderRadius: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>OP</span>}
            {comment.isMod && <span style={{ fontSize: '11px', backgroundColor: '#46D160', color: 'white', padding: '3px 8px', borderRadius: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>MOD</span>}
            <span style={{ fontSize: '12px', color: '#7c7c7c', fontWeight: '500' }}>• {comment.timestamp}</span>
            <button 
              onClick={() => setCollapsed(!collapsed)}
              style={{
                marginLeft: 'auto',
                fontSize: '14px',
                color: '#878A8C',
                fontWeight: '700',
                padding: '4px 8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F6F7F8'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              [{collapsed ? '+' : '−'}]
            </button>
          </div>

          {!collapsed && (
            <>
              <div style={{ fontSize: '14px', color: '#1c1c1c', lineHeight: '22px', marginBottom: '10px' }}>
                {comment.text}
              </div>

              {comment.awards && comment.awards.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  {comment.awards.map((award, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '11px',
                      backgroundColor: '#FFF8E7',
                      color: '#C18700',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      border: '1px solid #F4E5B8',
                      fontWeight: '600',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                      <Award size={13} />
                      <span>{award}</span>
                    </div>
                  ))}
                </div>
              )}

              {depth > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <VoteButtons votes={comment.votes} orientation="horizontal" />
                </div>
              )}

              <ActionBar onReplyClick={() => setShowReply(!showReply)} />

              {showReply && (
                <div style={{ marginTop: '14px', padding: '12px', backgroundColor: '#F8F9FA', borderRadius: '8px', border: '1px solid #E8EAED' }}>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    style={{
                      width: '100%',
                      borderRadius: '6px',
                      border: '1px solid #E0E3E6',
                      padding: '10px',
                      fontSize: '14px',
                      color: '#1c1c1c',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s ease',
                      outline: 'none'
                    }}
                    onFocus={e => e.target.style.borderColor = '#0079D3'}
                    onBlur={e => e.target.style.borderColor = '#E0E3E6'}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', gap: '10px' }}>
                    <button
                      onClick={() => setShowReply(false)}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '20px',
                        border: '1.5px solid #0079D3',
                        color: '#0079D3',
                        fontSize: '13px',
                        fontWeight: '700',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={e => {e.currentTarget.style.backgroundColor = '#E8F4FD'; e.currentTarget.style.transform = 'translateY(-1px)'}}
                      onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.transform = 'translateY(0)'}}
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
                        backgroundColor: replyText.trim() ? '#0079D3' : '#E0E3E6',
                        color: replyText.trim() ? 'white' : '#A0A3A6',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: replyText.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        boxShadow: replyText.trim() ? '0 2px 4px rgba(0,121,211,0.2)' : 'none'
                      }}
                      onMouseEnter={e => {if(replyText.trim()) {e.currentTarget.style.backgroundColor = '#005EA6'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,121,211,0.3)'}}}
                      onMouseLeave={e => {if(replyText.trim()) {e.currentTarget.style.backgroundColor = '#0079D3'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,121,211,0.2)'}}}
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}

              {replies && replies.length > 0 && (
                <div style={{ marginTop: '14px' }}>
                  {tooDeep ? (
                    <div style={{ paddingLeft: '10px' }}>
                      <a href="#" style={{ fontSize: '13px', color: '#0079D3', textDecoration: 'none', fontWeight: '600', transition: 'color 0.2s ease' }} onMouseEnter={e => e.target.style.color = '#005EA6'} onMouseLeave={e => e.target.style.color = '#0079D3'}>
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

const CommentSection = ({ initialComments}) => {
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
      maxWidth: '850px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#DAE0E6',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '20px',
        border: '1px solid #E0E3E6',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#1c1c1c' }}>Sort by</label>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              backgroundColor: 'white',
              border: '1.5px solid #E0E3E6',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#1c1c1c',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none'
            }}
            onFocus={e => e.target.style.borderColor = '#0079D3'}
            onBlur={e => e.target.style.borderColor = '#E0E3E6'}
          >
            {sortOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <textarea
            rows={4}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Add a top-level comment"
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1.5px solid #E0E3E6',
              padding: '14px',
              fontSize: '14px',
              color: '#1c1c1c',
              fontFamily: 'inherit',
              resize: 'vertical',
              transition: 'all 0.2s ease',
              outline: 'none',
              backgroundColor: '#FAFAFA'
            }}
            onFocus={e => {e.target.style.borderColor = '#0079D3'; e.target.style.backgroundColor = 'white'}}
            onBlur={e => {e.target.style.borderColor = '#E0E3E6'; e.target.style.backgroundColor = '#FAFAFA'}}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '12px' }}>
            <button
              onClick={() => setNewComment('')}
              style={{
                padding: '10px 24px',
                borderRadius: '24px',
                border: '1.5px solid #0079D3',
                color: '#0079D3',
                fontSize: '14px',
                fontWeight: '700',
                backgroundColor: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {e.currentTarget.style.backgroundColor = '#E8F4FD'; e.currentTarget.style.transform = 'translateY(-2px)'}}
              onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.transform = 'translateY(0)'}}
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
                backgroundColor: newComment.trim() ? '#0079D3' : '#E0E3E6',
                color: newComment.trim() ? 'white' : '#A0A3A6',
                fontSize: '14px',
                fontWeight: '700',
                cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                boxShadow: newComment.trim() ? '0 3px 6px rgba(0,121,211,0.25)' : 'none'
              }}
              onMouseEnter={e => {if(newComment.trim()) {e.currentTarget.style.backgroundColor = '#005EA6'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 5px 12px rgba(0,121,211,0.35)'}}}
              onMouseLeave={e => {if(newComment.trim()) {e.currentTarget.style.backgroundColor = '#0079D3'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,121,211,0.25)'}}}
            >
              Comment
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {getSortedComments().map(c => <Comment key={c.id} comment={c} depth={0} />)}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;