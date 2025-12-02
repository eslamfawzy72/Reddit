import React, { useState, useEffect } from 'react';
import {
  ChevronDown, ChevronUp, Share2, Bookmark, Flag, Award, MessageSquare,
  X, Save, Edit, User, Lock, Palette, FileText, Calendar, Trophy,
  Heart, TrendingUp, Clock, Hash, Globe, Settings, Bell, Mail, Shield
} from 'lucide-react';

const BLUE = "#0066ff";
const BLUE_HOVER = "#0055cc";
const DARK_BG = "#0A0A0A";
const CARD_BG = "#1a1a1b";
const BORDER = "#343536";
const TEXT = "#EDEFF1";
const TEXT_SECONDARY = "#818384";

// PROFESSIONAL COMMENT COMPONENT
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
      username: 'you',
      avatar: 'Y',
      timestamp: 'just now',
      text: replyText.trim(),
      votes: 1,
      isOP: false,
      isMod: false,
      awards: [],
      replies: [],
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
    if (Math.abs(n) >= 1000000) return (n / 1000000).toFixed(1) + 'M';
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
      padding: '12px 0',
      borderBottom: depth === 0 ? `1px solid ${BORDER}` : 'none',
      paddingLeft: depth > 0 ? '40px' : '0',
      position: 'relative',
    }}>
      {depth > 0 && (
        <div style={{
          position: 'absolute',
          left: '20px',
          top: 0,
          bottom: 0,
          width: '2px',
          backgroundColor: BORDER,
        }} />
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Vote Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: '40px' }}>
          <button
            onClick={() => handleVote('up')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              color: isLiked ? BLUE : TEXT_SECONDARY,
            }}
          >
            <ChevronUp size={22} strokeWidth={2.5} />
          </button>
          <span style={{
            fontWeight: '700',
            fontSize: '13px',
            color: isLiked ? BLUE : isDisliked ? '#7193ff' : TEXT,
          }}>
            {formatVotes(getVoteCount())}
          </span>
          <button
            onClick={() => handleVote('down')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              color: isDisliked ? '#7193ff' : TEXT_SECONDARY,
            }}
          >
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
                <div style={{ marginTop: '16px', padding: '16px', backgroundColor: CARD_BG, borderRadius: '8px', border: `1px solid ${BORDER}` }}>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="What are your thoughts?"
                    style={{
                      width: '100%',
                      backgroundColor: '#272729',
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

              {/* Render Replies */}
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

// EDIT SETTINGS MODAL
const EditSettingsModal = ({ isOpen, onClose, profileData, onSave }) => {
  const [formData, setFormData] = useState({ username: '', bio: '', wallpaper: '#0066ff' });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        username: profileData.username || '',
        bio: profileData.bio || '',
        wallpaper: profileData.wallpaperColor || BLUE,
      });
    }
  }, [isOpen, profileData]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
    }}>
      <div style={{
        backgroundColor: CARD_BG, borderRadius: '16px', width: '100%', maxWidth: '520px',
        maxHeight: '90vh', overflowY: 'auto', border: `1px solid ${BORDER}`, boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: TEXT }}>Profile Settings</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: TEXT_SECONDARY, cursor: 'pointer' }}>
              <X size={28} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', color: TEXT_SECONDARY, fontSize: '14px', marginBottom: '8px' }}>Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#272729', border: `1px solid ${BORDER}`, color: TEXT }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: TEXT_SECONDARY, fontSize: '14px', marginBottom: '8px' }}>Bio</label>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#272729', border: `1px solid ${BORDER}`, color: TEXT, resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button onClick={onClose} style={{ padding: '10px 24px', borderRadius: '20px', background: 'transparent', color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}>
                Cancel
              </button>
              <button
                onClick={() => { onSave(formData); onClose(); }}
                style={{ padding: '10px 24px', borderRadius: '20px', backgroundColor: BLUE, color: 'white', border: 'none', fontWeight: '600' }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// MAIN PROFILE PAGE
const UserProfilePage = ({ isOwnProfile = true }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileData, setProfileData] = useState({});

  const initialData = isOwnProfile ? {
    username: 'Toka_Elsayed',
    displayName: 'Toka Elsayed',
    karma: 1482,
    bio: 'Frontend developer passionate about UX design. Love hiking and photography.',
    wallpaperColor: BLUE,
    followers: '248',
    activeIn: '12',
    posts: [/* your posts */],
    comments: [
      { id: 1, username: 'Toka_Elsayed', avatar: 'T', timestamp: '1h ago', text: 'This looks amazing! Great work on the animation.', votes: 42 },
    ]
  } : {
    username: 'desyx_',
    displayName: 'Alex Morgan',
    karma: 38058,
    bio: 'Senior software engineer • Open source contributor • Coffee enthusiast',
    wallpaperColor: '#8B5CF6',
    followers: '12.4k',
    activeIn: '75',
  };

  useEffect(() => {
    setProfileData(initialData);
  }, [isOwnProfile]);

  const handleSave = (data) => {
    setProfileData(prev => ({ ...prev, ...data }));
  };

  return (
    <>
      {/* Full Dark Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundColor: DARK_BG, zIndex: -1 }} />

      <div style={{ minHeight: '100vh', color: TEXT, paddingTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {/* Profile Header */}
          <div style={{ backgroundColor: CARD_BG, borderRadius: '16px', border: `1px solid ${BORDER}`, overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ height: '180px', background: `linear-gradient(135deg, ${profileData.wallpaperColor || BLUE}, ${profileData.wallpaperColor || BLUE}cc)` }} />

            <div style={{ padding: '32px', position: 'relative', marginTop: '-80px' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
                <div style={{
                  width: '140px', height: '140px', borderRadius: '50%', backgroundColor: profileData.wallpaperColor || BLUE,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                  fontSize: '56px', fontWeight: 'bold', border: '6px solid #0A0A0A'
                }}>
                  {profileData.username?.[0]?.toUpperCase() || 'U'}
                </div>

                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 8px 0' }}>{profileData.displayName}</h1>
                  <p style={{ color: TEXT_SECONDARY, margin: 0 }}>u/{profileData.username} • {profileData.karma?.toLocaleString()} karma</p>
                  {profileData.bio && <p style={{ margin: '16px 0', fontSize: '15px', lineHeight: '1.6' }}>{profileData.bio}</p>}
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    style={{ padding: '12px 24px', backgroundColor: BLUE, color: 'white', border: 'none', borderRadius: '999px', fontWeight: '600' }}
                  >
                    <Settings size={18} style={{ marginRight: '8px' }} /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderTop: `1px solid ${BORDER}`, backgroundColor: CARD_BG }}>
              {['Overview', 'Posts', 'Comments'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '16px 32px',
                    background: 'none',
                    border: 'none',
                    color: activeTab === tab ? BLUE : TEXT_SECONDARY,
                    borderBottom: activeTab === tab ? `3px solid ${BLUE}` : '3px solid transparent',
                    fontWeight: activeTab === tab ? '600' : '500',
                    cursor: 'pointer'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            {activeTab === 'Comments' && profileData.comments?.length > 0 && (
              <div style={{ backgroundColor: CARD_BG, borderRadius: '12px', border: `1px solid ${BORDER}`, padding: '24px' }}>
                {profileData.comments.map(c => <Comment key={c.id} comment={c} />)}
              </div>
            )}
          </div>
        </div>

        <EditSettingsModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profileData={profileData}
          onSave={handleSave}
        />
      </div>
    </>
  );
};

// Demo
export default UserProfilePage;