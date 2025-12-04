import React, { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronUp, Share2, Bookmark, Flag, Award, MessageSquare,
  X, Save, Settings, User, Lock, Palette, FileText, Calendar, Trophy,
  Heart, TrendingUp, Clock, Hash, Cake, Users
} from 'lucide-react';

// DARK BLUE THEME
const BLUE = "#0066ff";
const DARK_BG = "#0A0A0A";
const CARD_BG = "#1a1a1b";
const BORDER = "#343536";
const TEXT = "#EDEFF1";
const TEXT_SECONDARY = "#818384";
const TEXT_MUTED = "#5c5d61";

// PROFESSIONAL COMMENT COMPONENT (your original — untouched)
const Comment = ({ comment, depth = 0 }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [replyText, setReplyText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleAddReply = () => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      username: 'current_user',
      avatar: 'CU',
      timestamp: 'just now',
      text: replyText.trim(),
      votes: 1,
      replies: []
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

  const formatVotes = (n) => {
    if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n;
  };

  const getVoteCount = () => {
    let count = comment.votes || 0;
    if (isLiked) count += 1;
    if (isDisliked) count -= 1;
    return count;
  };

  return (
    <div style={{
      padding: depth === 0 ? '16px 0' : '12px 0',
      borderBottom: depth === 0 ? `1px solid ${BORDER}` : 'none',
      paddingLeft: depth > 0 ? '48px' : '0',
      position: 'relative',
    }}>
      {depth > 0 && (
        <div style={{
          position: 'absolute',
          left: '24px',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: BORDER,
        }} />
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Vote Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '40px' }}>
          <button onClick={() => handleVote('up')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', color: isLiked ? BLUE : TEXT_SECONDARY }}>
            <ChevronUp size={22} strokeWidth={2.5} />
          </button>
          <span style={{ fontWeight: '700', fontSize: '13px', color: isLiked ? BLUE : isDisliked ? '#7193ff' : TEXT }}>
            {formatVotes(getVoteCount())}
          </span>
          <button onClick={() => handleVote('down')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px', color: isDisliked ? '#7193ff' : TEXT_SECONDARY }}>
            <ChevronDown size={22} strokeWidth={2.5} />
          </button>
        </div>

        {/* Comment Body */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', backgroundColor: BLUE,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '700', fontSize: '14px'
            }}>
              {comment.avatar || comment.username[0].toUpperCase()}
            </div>
            <span style={{ fontWeight: '600', color: TEXT }}>u/{comment.username}</span>
            {comment.isOP && <span style={{ backgroundColor: BLUE, color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>OP</span>}
            {comment.isMod && <span style={{ backgroundColor: '#10b981', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>MOD</span>}
            <span style={{ color: TEXT_SECONDARY, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> {comment.timestamp}
            </span>
          </div>

          {!collapsed && (
            <>
              <div style={{ color: TEXT, lineHeight: '1.6', marginBottom: '12px', fontSize: '14px' }}>
                {comment.text}
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                <button style={{ color: TEXT_SECONDARY, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                  <Share2 size={16} /> Share
                </button>
                <button style={{ color: TEXT_SECONDARY, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                  <Bookmark size={16} /> Save
                </button>
                <button onClick={() => setShowReply(!showReply)} style={{ color: BLUE, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                  <MessageSquare size={16} /> Reply
                </button>
              </div>

              {showReply && (
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#272729', borderRadius: '8px', border: `1px solid ${BORDER}` }}>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="What are your thoughts?"
                    style={{
                      width: '100%',
                      backgroundColor: '#0d1117',
                      color: TEXT,
                      border: `1px solid ${BORDER}`,
                      borderRadius: '8px',
                      padding: '12px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button onClick={() => setShowReply(false)} style={{ padding: '8px 20px', borderRadius: '20px', background: 'transparent', color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}>
                      Cancel
                    </button>
                    <button
                      onClick={handleAddReply}
                      disabled={!replyText.trim()}
                      style={{
                        padding: '8px 20px',
                        borderRadius: '20px',
                        backgroundColor: replyText.trim() ? BLUE : '#444',
                        color: 'white',
                        border: 'none',
                        fontWeight: '600',
                        cursor: replyText.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}

              {replies.map((reply) => (
                <Comment key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// DARK ABOUT SIDEBAR — THE ONE YOU WANTED
const AboutSidebar = ({ profile }) => {
  return (
    <div style={{
      backgroundColor: CARD_BG,
      border: `1px solid ${BORDER}`,
      borderRadius: '16px',
      padding: '24px',
      position: 'sticky',
      top: '100px',
      height: 'fit-content',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: TEXT, margin: '0 0 20px 0' }}>
        About u/{profile.username}
      </h3>

      {profile.bio && (
        <p style={{
          color: TEXT,
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '24px',
          backgroundColor: '#272729',
          padding: '16px',
          borderRadius: '12px',
          border: `1px solid ${BORDER}`
        }}>
          {profile.bio}
        </p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#272729', padding: '16px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: TEXT }}>{profile.karma?.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: TEXT_SECONDARY }}>Karma</div>
        </div>
        <div style={{ backgroundColor: '#272729', padding: '16px', borderRadius: '12px', textAlign: 'center', border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: '22px', fontWeight: '800', color: TEXT }}>{profile.followers}</div>
          <div style={{ fontSize: '13px', color: TEXT_SECONDARY }}>Followers</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', color: TEXT_SECONDARY }}>
          <Cake size={20} />
          <div>
            <div style={{ color: TEXT, fontWeight: '600' }}>Cake Day</div>
            <div>March 15, 2023</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', color: TEXT_SECONDARY }}>
          <Hash size={20} />
          <div>
            <div style={{ color: TEXT, fontWeight: '600' }}>Active In</div>
            <div>{profile.activeIn} communities</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', color: TEXT_SECONDARY }}>
          <Trophy size={20} />
          <div>
            <div style={{ color: TEXT, fontWeight: '600' }}>Member For</div>
            <div>{profile.redditAge || '2 years'}</div>
          </div>
        </div>
      </div>

      <button style={{
        width: '100%',
        marginTop: '28px',
        padding: '14px',
        backgroundColor: BLUE,
        color: 'white',
        border: 'none',
        borderRadius: '999px',
        fontWeight: '700',
        fontSize: '15px',
        cursor: 'pointer',
        transition: '0.2s'
      }}
        onMouseEnter={e => e.target.style.backgroundColor = '#0055cc'}
        onMouseLeave={e => e.target.style.backgroundColor = BLUE}
      >
        Follow
      </button>
    </div>
  );
};

// MAIN PROFILE PAGE
const UserProfilePage = ({ isOwnProfile = true }) => {
  const [activeTab, setActiveTab] = useState('Comments');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({});

  const initialData = isOwnProfile ? {
    username: 'Toka_Elsayed',
    displayName: 'Toka Elsayed',
    karma: 1482,
    bio: 'Frontend developer passionate about UX design. Love hiking and photography. Always learning!',
    wallpaperColor: BLUE,
    followers: '248',
    activeIn: '12',
    redditAge: '2 years',
    comments: [
      { id: 1, username: 'Toka_Elsayed', avatar: 'T', timestamp: '2h ago', text: 'This new animation library is incredible! The spring physics feel so natural.', votes: 89 },
      { id: 2, username: 'Toka_Elsayed', avatar: 'T', timestamp: '5h ago', text: 'Just shipped a major refactor using the new React Server Components pattern. The performance gains are unreal.', votes: 156 },
      { id: 3, username: 'Toka_Elsayed', avatar: 'T', timestamp: '1d ago', text: 'Can someone explain why useMemo doesn\'t always prevent re-renders? Still wrapping my head around it.', votes: 34 },
    ]
  } : {
    username: 'desyx_',
    displayName: 'Alex Morgan',
    karma: 38058,
    bio: 'Senior software engineer • Open source contributor • Coffee enthusiast',
    wallpaperColor: '#8B5CF6',
    followers: '12.4k',
    activeIn: '75',
    redditAge: '8 years'
  };

  useEffect(() => {
    setProfileData(initialData);
  }, [isOwnProfile]);

  return (
    <>
      {/* Full dark background */}
      <div style={{ position: 'fixed', inset: 0, backgroundColor: DARK_BG, zIndex: -1 }} />

      <div style={{ minHeight: '100vh', color: TEXT, paddingTop: '80px' }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '40px'
        }}>
          {/* LEFT: Main Content */}
          <div>
            {/* Profile Header */}
            <div style={{ backgroundColor: CARD_BG, borderRadius: '16px', border: `1px solid ${BORDER}`, overflow: 'hidden', marginBottom: '24px' }}>
              <div style={{ height: '200px', background: `linear-gradient(135deg, ${profileData.wallpaperColor || BLUE}, ${profileData.wallpaperColor || BLUE}cc)` }} />
              <div style={{ padding: '32px', position: 'relative', marginTop: '-100px' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
                  <div style={{
                    width: '160px', height: '160px', borderRadius: '50%', backgroundColor: profileData.wallpaperColor || BLUE,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                    fontSize: '64px', fontWeight: 'bold', border: '8px solid #0A0A0A', boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                  }}>
                    {profileData.username?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0 0 8px 0', color: TEXT }}>{profileData.displayName}</h1>
                    <p style={{ color: TEXT_SECONDARY, margin: 0 }}>u/{profileData.username} • {profileData.karma?.toLocaleString()} karma</p>
                    {profileData.bio && <p style={{ margin: '16px 0', fontSize: '15px', lineHeight: '1.6', color: TEXT }}>{profileData.bio}</p>}
                  </div>
                  {isOwnProfile && (
                    <button onClick={() => setShowEditModal(true)} style={{ padding: '14px 32px', backgroundColor: BLUE, color: 'white', border: 'none', borderRadius: '999px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Settings size={20} /> Edit Profile
                    </button>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderTop: `1px solid ${BORDER}`, backgroundColor: CARD_BG }}>
                {['Overview', 'Posts', 'Comments'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '18px 32px', background: 'none', border: 'none',
                      color: activeTab === tab ? BLUE : TEXT_SECONDARY,
                      borderBottom: activeTab === tab ? `4px solid ${BLUE}` : '4px solid transparent',
                      fontWeight: activeTab === tab ? '700' : '500', cursor: 'pointer'
                    }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments Tab */}
            {activeTab === 'Comments' && (
              <div style={{ backgroundColor: CARD_BG, borderRadius: '12px', border: `1px solid ${BORDER}`, padding: '24px' }}>
                {profileData.comments?.map(c => <Comment key={c.id} comment={c} />)}
              </div>
            )}
          </div>

          {/* RIGHT: About Sidebar */}
          <div>
            <AboutSidebar profile={profileData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;