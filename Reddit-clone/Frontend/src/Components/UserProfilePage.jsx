// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from "react";
import {
  Cake, Trophy, Hash, MessageSquare, Settings,
  X, User, Lock, Palette, FileText, Bell, Save
} from "lucide-react";
import Comment from "../Components/Comment.jsx";
import PostCard from "../Components/PostCard.jsx";
import "../styles/userProfilePage.css";

// Mock Posts
const mockPosts = [
  {
    _id: "6929a50c021b68655cbdc96e",
    user_name: "ahmed_dev",
    user_avatar: "https://i.pravatar.cc/48?img=3",
    description: "adham howa entaaa??????!",
    images: ["https://source.unsplash.com/random/800x600?funny,meme"],
    edited: false,
    upvoteCount: 2,
    downvoteCount: 0,
    commentCount: 1,
    date: "2025-11-24T21:46:14.170Z",
    community_name: "b/funny",
    categories: ["meme", "funny"],
    comments: [
      {
        userID: "6924c11062dbde5200745c28",
        username: "eslamFawzy",
        text: "This is my first comment",
        edited: false,
        upvotedCount: 0,
        downvotedCount: 0,
        category: "tech",
        replies: [],
        _id: "692a5f124c321f0e66d753d2",
        date: "2025-11-29T02:48:50.339Z",
        communityID: "6924f0a6098dc4c9933296f0",
      },
    ],
  },
  {
    _id: "6929a50c021b68655cbdc96f",
    user_name: "mariam_codes",
    user_avatar: "https://i.pravatar.cc/48?img=12",
    description: "Check out my new post!",
    images: [],
    edited: false,
    upvoteCount: 1,
    downvoteCount: 0,
    commentCount: 0,
    date: "2025-11-25T10:00:00.000Z",
    community_name: "b/webdev",
    categories: ["web", "project"],
    comments: [],
  },
];

const DARK_BG = "#0A0A0A";
const BLUE = "#0066ff";

// --- About Sidebar ---
function AboutSidebar({ profile, isOwn, onFollow }) {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
    if (!isFollowing && onFollow) onFollow();
  };

  return (
    <div className="sidebar-card">
      <div className="sidebar-user-info">
        <div className="sidebar-username">u/{profile.username}</div>
        <div className="sidebar-stats">
          <div>
            <div className="sidebar-number">{profile.karma?.toLocaleString()}</div>
            <div className="sidebar-label">Karma</div>
          </div>
          <div>
            <div className="sidebar-number">{profile.followers}</div>
            <div className="sidebar-label">Followers</div>
          </div>
        </div>
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-stats-list">
        <div className="sidebar-stat">
          <span>Cake Day</span>
          <span>March 15, 2023</span>
        </div>
        <div className="sidebar-stat">
          <span>Reddit Age</span>
          <span>{profile.redditAge || "2 years"}</span>
        </div>
        <div className="sidebar-stat">
          <span>Active in</span>
          <span>{profile.activeIn} communities</span>
        </div>
      </div>

      {!isOwn && (
        <button
          className={`follow-btn ${isFollowing ? "following" : ""}`}
          onClick={handleFollowClick}
        >
          <User size={16} /> {isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}

// --- Edit Settings Modal ---
function EditSettingsModal({ isOpen, onClose, profileData, onSave }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    wallpaper: "#0EA5E9",
    description: "",
    email: "",
    notifications: true,
  });

  useEffect(() => {
    if (isOpen && profileData) {
      setFormData({
        username: profileData.username || "",
        description: profileData.bio || "",
        wallpaper: profileData.wallpaperColor || "#0EA5E9",
        email: profileData.email || "",
        password: "",
        confirmPassword: "",
        notifications: profileData.notifications ?? true,
      });
    }
  }, [isOpen, profileData]);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

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
      email: formData.email,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>Profile Settings</h2>
            <p>Customize your profile appearance and information</p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-section">
            <h3><User size={16} /> Account Information</h3>
            <input
              type="text"
              value={formData.username}
              onChange={e => handleChange("username", e.target.value)}
              placeholder="Username"
            />
            <input
              type="email"
              value={formData.email}
              onChange={e => handleChange("email", e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className="modal-section">
            <h3><Lock size={16} /> Security</h3>
            <input
              type="password"
              value={formData.password}
              onChange={e => handleChange("password", e.target.value)}
              placeholder="New Password"
            />
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={e => handleChange("confirmPassword", e.target.value)}
              placeholder="Confirm Password"
            />
            {formData.password && formData.password !== formData.confirmPassword && (
              <p className="error-text">Passwords don't match</p>
            )}
          </div>

          <div className="modal-section">
            <h3><FileText size={16} /> Bio Description</h3>
            <textarea
              value={formData.description}
              onChange={e => handleChange("description", e.target.value)}
              rows={4}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-save"><Save size={16} /> Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main UserProfilePage ---
function UserProfilePage({ isOwn }) {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showEditModal, setShowEditModal] = useState(false);
  const [posts, setPosts] = useState(mockPosts);

  const [profileData, setProfileData] = useState(
    isOwn
      ? {
          username: "Toka_Elsayed",
          displayName: "Toka Elsayed",
          karma: 1482,
          bio: "Frontend developer passionate about UX design. Love hiking and photography.",
          wallpaperColor: BLUE,
          followers: 248,
          activeIn: 12,
          redditAge: "2 years",
          avatarLetter: "T",
          email: "user@example.com",
          comments: [
            { id: 1, username: "Toka_Elsayed", avatar: "T", timestamp: "2h ago", text: "This new animation library is incredible!", votes: 89 },
          ],
        }
      : {
          username: "flag9801",
          displayName: "flag9801",
          karma: 369486,
          followers: 47,
          activeIn: 38,
          redditAge: "5 years",
          avatarLetter: "F",
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

  const handleFollow = () => {
    setProfileData(prev => ({ ...prev, followers: prev.followers + 1 }));
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-avatar" style={{ backgroundColor: profileData.wallpaperColor }}>
          {profileData.avatarLetter || profileData.username[0].toUpperCase()}
        </div>
        <div className="profile-name">
          <h1>{profileData.displayName}</h1>
          <p>u/{profileData.username}</p>
        </div>
        {isOwn && <button className="edit-profile-btn" onClick={() => setShowEditModal(true)}><Settings size={18} /> Edit Profile</button>}
      </div>

      {profileData.bio && <p className="profile-bio">{profileData.bio}</p>}

      {/* Main Grid */}
      <div className="profile-grid">
        <div className="profile-tabs">
          <div className="tabs-header">
            {["Overview", "Posts", "Comments"].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "Posts" && (
            <div className="tab-content">
              {posts.length === 0 ? (
                <div className="loading-posts">Loading posts...</div>
              ) : (
                posts.map(post => (
                  <PostCard key={post._id} {...post} />
                ))
              )}
            </div>
          )}

          {activeTab === "Comments" && (
            <div className="tab-content">
              {profileData.comments?.length > 0 ? (
                profileData.comments.map(c => <Comment key={c.id} comment={c} />)
              ) : (
                <div className="no-comments">No comments yet</div>
              )}
            </div>
          )}
        </div>

        <div className="profile-sidebar">
          <AboutSidebar profile={profileData} isOwn={isOwn} onFollow={handleFollow} />
        </div>
      </div>

      <EditSettingsModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profileData={profileData}
        onSave={handleSaveSettings}
      />
    </div>
  );
}

export default UserProfilePage;
