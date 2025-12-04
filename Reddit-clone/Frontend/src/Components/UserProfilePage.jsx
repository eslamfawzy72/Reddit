import React, { useState, useEffect } from 'react';
import {
  Cake, Trophy, Hash, MessageSquare, Settings,
  X, User, Lock, Palette, FileText, Bell, Save
} from 'lucide-react';
import Comment from "../Components/Comment.jsx";

// DARK THEME COLORS
const DARK_BG = "#0A0A0A";
const CARD_BG = "#1a1a1b";
const BORDER = "#343536";
const TEXT = "#EDEFF1";
const TEXT_SECONDARY = "#818384";
const BLUE = "#0066ff";

// ABOUT SIDEBAR
function AboutSidebar({profile,accountDir}){
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      setProfileData(prev => ({
        ...prev,
       
      }));
    }
  };

  return (
    <div
      style={{
        backgroundColor: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: "12px",
        padding: "16px",
        fontSize: "14px",
        color: TEXT,
        position: "sticky",
        top: "90px",
      }}
    >
      {/* USER INFO */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "8px" }}>
          u/{profile.username}
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "20px", fontWeight: "800" }}>
              {profile.karma?.toLocaleString()}
            </div>
            <div style={{ color: TEXT_SECONDARY, fontSize: "12px" }}>Karma</div>
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: "800" }}>
              {profile.followers}
            </div>
            <div style={{ color: TEXT_SECONDARY, fontSize: "12px" }}>Followers</div>
          </div>
        </div>
      </div>

      <hr style={{ border: `0.5px solid ${BORDER}`, margin: "16px 0" }} />

      {/* STATS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: TEXT_SECONDARY }}>Cake Day</span>
          <span>March 15, 2023</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: TEXT_SECONDARY }}>Reddit Age</span>
          <span>{profile.redditAge || "2 years"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ color: TEXT_SECONDARY }}>Active in</span>
          <span>{profile.activeIn} communities</span>
        </div>
      </div>

      {/* FOLLOW + CHAT BUTTONS */}
      {!(accountDir===true) && (
        <>
          <button
            onClick={handleFollowClick}
            style={{
              marginTop: "16px",
              backgroundColor: isFollowing ? "#F1F5F9" : "#0079D3",
              color: isFollowing ? "#475569" : "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <User size={16} />
            {isFollowing ? "Following" : "Follow"}
          </button>

          
        </>
      )}
    </div>
  );
};

// EDIT SETTINGS MODAL
// Add this inside your UserProfilePage file (or separate file)
const EditSettingsModal = ({ isOpen, onClose, profileData, onSave }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    wallpaper: '#0EA5E9',
    description: '',
    email: '',
    notifications: true
  });

  // THIS WAS MISSING BEFORE → now fixed
  useEffect(() => {
    if (isOpen && profileData) {
      setFormData(prev => ({
        ...prev,
        username: profileData.username || '',
        description: profileData.bio || '',
        wallpaper: profileData.wallpaperColor || '#0EA5E9',
        email: profileData.email || ''
      }));
    }
  }, [isOpen, profileData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    onSave({
      username: formData.username,
      bio: formData.description,
      wallpaperColor: formData.wallpaper,
      email: formData.email
    });
    onClose();
  };

  const wallpaperOptions = [
    { name: 'Sky Blue', value: '#0EA5E9' },
    { name: 'Royal Purple', value: '#8B5CF6' },
    { name: 'Emerald Green', value: '#10B981' },
    { name: 'Crimson Red', value: '#EF4444' },
    { name: 'Sunset Orange', value: '#F97316' },
    { name: 'Slate Gray', value: '#64748B' }
  ];

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '20px', backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        color: '#0F172A'
      }}>
        <div style={{ padding: '32px' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0' }}>Profile Settings</h2>
              <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                Customize your profile appearance and information
              </p>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <X size={24} color="#64748B" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Account Information */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} /> Account Information
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Username</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => handleChange('username', e.target.value)}
                      style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#0079D3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,121,211,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
                    />
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleChange('email', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                    onFocus={e => { e.target.style.borderColor = '#0079D3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,121,211,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Security */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={16} /> Security
              </h3>

              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => handleChange('password', e.target.value)}
                      style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none' }}
                      onFocus={e => { e.target.style.borderColor = '#0079D3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,121,211,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
                    />
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                    style={{
                      width: '100%', padding: '12px', borderRadius: '8px',
                      border: formData.password && formData.password !== formData.confirmPassword ? '1px solid #EF4444' : '1px solid #CBD5E1',
                      fontSize: '14px', outline: 'none'
                    }}
                    onFocus={e => {
                      e.target.style.borderColor = formData.password && formData.password !== formData.confirmPassword ? '#EF4444' : '#0079D3';
                      e.target.style.boxShadow = formData.password && formData.password !== formData.confirmPassword ? '0 0 0 3px rgba(239,68,68,0.1)' : '0 0 0 3 coalition rgba(0,121,211,0.1)';
                    }}
                    onBlur={e => { e.target.style.borderColor = formData.password && formData.password !== formData.confirmPassword ? '#EF4444' : '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
                  />
                  {formData.password && formData.password !== formData.confirmPassword && (
                    <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '4px' }}>Passwords don't match</p>
                  )}
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Palette size={16} /> Appearance
              </h3>

              

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} /> Bio Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                  rows={4}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                  onFocus={e => { e.target.style.borderColor = '#0079D3'; e.target.style.boxShadow = '0 0 0 3px rgba(0,121,211,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#CBD5E1'; e.target.style.boxShadow = 'none'; }}
                />
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Max 500 characters</p>
              </div>
            </div>

            {/* Notifications */}
            <div style={{ marginBottom: '32px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={16} /> Notifications
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '4px' }}>Email Notifications</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Receive updates about your activity</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('notifications', !formData.notifications)}
                  style={{
                    width: '44px', height: '24px', borderRadius: '12px', border: 'none',
                    backgroundColor: formData.notifications ? '#0079D3' : '#CBD5E1',
                    position: 'relative', cursor: 'pointer'
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '2px',
                    left: formData.notifications ? '22px' : '2px',
                    width: '20px', height: '20px', borderRadius: '50%',
                    backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease'
                  }} />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #F1F5F9', paddingTop: '24px' }}>
              <button type="button" onClick={onClose}
                style={{ padding: '12px 24px', borderRadius: '8px', border: '1px solid #CBD5E1', backgroundColor: 'white', color: '#64748B', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.backgroundColor = '#F8FAFC'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.backgroundColor = 'white'; }}
              >
                Cancel
              </button>
              <button type="submit"
                style={{ padding: '12px 24px', borderRadius: '8px', backgroundColor: '#0079D3', color: 'white', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#005EA6'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,121,211,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0079D3'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <Save size={16} /> Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
// MAIN PAGE
function UserProfilePage(props){
  const [activeTab, setActiveTab] = useState('Overview');
  const [showEditModal, setShowEditModal] = useState(false);

  // This is the fix: profile data is now in state
  const [profileData, setProfileData] = useState(
   props.isOwn? {
      username: 'Toka_Elsayed',
      displayName: 'Toka Elsayed',
      karma: 1482,
      bio: 'Frontend developer passionate about UX design. Love hiking and photography. Always learning!',
      wallpaperColor: BLUE,
      followers: '248',
      activeIn: '12',
      redditAge: '2 years',
      avatarLetter: 'T',
      email: 'user@example.com',

      comments: [
        { id: 1, username: 'Toka_Elsayed', avatar: 'T', timestamp: '2h ago', text: 'This new animation library is incredible!', votes: 89 },
        { id: 2, username: 'Toka_Elsayed', avatar: 'T', timestamp: '5h ago', text: 'Just shipped a React Server Components refactor!', votes: 156 },
      ]
    } : {
      username: 'flag9801',
      displayName: 'flag9801',
      karma: 369486,
      followers: '47',
      activeIn: '38',
      redditAge: '5 years',
      avatarLetter: 'F',
    }
  );

  const handleSaveSettings = (newData) => {
    setProfileData(prev => ({
      ...prev,
      username: newData.username,
      displayName: newData.username,
      bio: newData.bio,
      wallpaperColor: newData.wallpaperColor,
    }));
  };

  return (
    <>
      <div style={{ backgroundColor: DARK_BG, minHeight: '100vh', color: TEXT }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 0', maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '20px' }}>
            <div style={{
              width: '120px', height: '120px', borderRadius: '50%',
              backgroundColor: profileData.wallpaperColor || BLUE,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '48px', fontWeight: 'bold',
              border: '6px solid #0A0A0A', boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            }}>
              {profileData.avatarLetter || profileData.username[0].toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: TEXT }}>
                {profileData.displayName}
              </h1>
              <p style={{ margin: '4px 0 0', color: TEXT_SECONDARY, fontSize: '16px' }}>
                u/{profileData.username}
              </p>
            </div>

            {props.isOwnProfile && (
              <button
                onClick={() => setShowEditModal(true)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  color: TEXT,
                  borderRadius: '999px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                }}
              >
                <Settings size={18} /> Edit Profile
              </button>
            )}
          </div>

          {profileData.bio && (
            <p style={{ margin: '0 0 20px 140px', fontSize: '15px', lineHeight: '1.5', color: TEXT, maxWidth: '600px' }}>
              {profileData.bio}
            </p>
          )}
        </div>

        {/* Main Grid */}
        <div style={{
          maxWidth: '1400px', margin: '0 auto', padding: '0 24px',
          display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px'
        }}>
          {/* Left: Tabs */}
          <div>
            <div style={{
              display: 'flex', backgroundColor: CARD_BG,
              borderRadius: '8px 8px 0 0', border: `1px solid ${BORDER}`, borderBottom: 'none'
            }}>
              {['Overview', 'Posts', 'Comments'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '14px 24px', background: 'none', border: 'none',
                    color: activeTab === tab ? TEXT : TEXT_SECONDARY,
                    fontWeight: activeTab === tab ? '700' : '500',
                    fontSize: '15px', cursor: 'pointer',
                    borderBottom: activeTab === tab ? `3px solid ${BLUE}` : '3px solid transparent',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'Comments' && (
              <div style={{
                backgroundColor: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderTop: 'none',
                borderRadius: '0 0 8px 8px',
                padding: '20px'
              }}>
                {profileData.comments?.map(c => <Comment comment={c} depth={0} maxDepth ={7} />) || (
                  <div style={{ textAlign: 'center', padding: '60px', color: TEXT_SECONDARY }}>
                    No comments yet
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div>
            <AboutSidebar profile={profileData} accountDir={props.isOwn} />
          </div>
        </div>

        {/* Modal */}
        <EditSettingsModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          profileData={profileData}
          onSave={handleSaveSettings}
        />
      </div>
    </>
  );
};

export default UserProfilePage;