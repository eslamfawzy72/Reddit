import React, { useState, useEffect } from "react";
import axios from "axios";
import { Settings, X, Save, Users, MessageCircle, Calendar, Award } from "lucide-react";
import PostCard from "../Components/PostCard.jsx";
import "../styles/userProfilePage.css";

const ACCENT_BLUE = "#3b82f6";
const ACCENT_PINK = "#f63bf3ff";

/* ================= About Sidebar ================= */
/* ================= About Sidebar ================= */
function AboutSidebar({ profile, isOwn, postCount }) {
  const formatRedditAge = (dateString) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffYears = Math.floor(diffWeeks / 52);

    if (diffYears > 0) return `${diffYears}y`;
    if (diffWeeks > 0) return `${diffWeeks}w`;
    return `${diffDays}d`;
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-card glass-card">
        <div className="sidebar-user-info">
          

          <div className="sidebar-stats-grid grid grid-cols-2 gap-4 mb-6">
            {/* Posts */}
            <div className="stat-box text-center">
              <div className="stat-number text-2xl font-bold text-white">{postCount}</div>
              <div className="stat-label text-xs text-gray-400 mt-1">Posts</div>
            </div>

            {/* Followers */}
            <div className="stat-box text-center">
              <div className="stat-number text-2xl font-bold text-white">{profile.followers}</div>
              <div className="stat-label text-xs text-gray-400 flex items-center justify-center gap-1 mt-1">
                <Users size={12} className="text-blue-400" /> Followers
              </div>
            </div>
          </div>
        </div>

        <hr className="sidebar-divider border-gray-700 my-6" />

        <div className="sidebar-info-section space-y-4">
          {/* Reddit Age */}
          <div className="info-row flex items-center justify-between text-sm">
            <span className="info-label text-gray-400 flex items-center gap-2">
              <Calendar size={14} className="text-purple-400" /> Reddit Age
            </span>
            <span className="info-value text-white font-semibold">
              {formatRedditAge(profile.createdAt)}
            </span>
          </div>

          {/* Active in */}
          <div className="info-row flex items-center justify-between text-sm">
            <span className="info-label text-gray-400 flex items-center gap-2">
              <MessageCircle size={14} className="text-green-400" /> Active in
            </span>
            <span className="info-value text-white font-semibold">{profile.activeIn} communities</span>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ================= Edit Modal ================= */
function EditSettingsModal({ isOpen, onClose, profileData, onSave }) {
  const API = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (profileData) {
      setFormData({
        userName: profileData.username,
        password: "",
        confirmPassword: ""
      });
    }
    setErrors({});
    setSuccessMessage("");
  }, [profileData, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Username is required";
    else if (formData.userName.length < 3) newErrors.userName = "Username must be at least 3 characters";
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.userName)) newErrors.userName = "Username can only contain letters, numbers, and underscores";

    if (formData.password) {
      if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkUsernameAvailability = async (username) => {
    try {
      const response = await axios.get(`${API}/users/check-username/${username}`);
      return response.data.available;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      if (formData.userName !== profileData.username) {
        const isAvailable = await checkUsernameAvailability(formData.userName);
        if (!isAvailable) {
          setErrors({ userName: "Username is already taken" });
          setLoading(false);
          return;
        }
      }

      const updateData = {};
      if (formData.userName !== profileData.username) updateData.userName = formData.userName;
      if (formData.password) updateData.password = formData.password;

      if (Object.keys(updateData).length === 0) {
        setErrors({ general: "No changes to save" });
        setLoading(false);
        return;
      }

      const response = await axios.patch(
        `${API}/users/${profileData._id}`,
        updateData,
        { withCredentials: true }
      );

      setSuccessMessage("Profile updated successfully!");
      if (onSave) onSave(response.data);

      setTimeout(() => onClose(), 1500);

    } catch (err) {
      console.error(err);
      setErrors({ general: err.response?.data?.error || "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {successMessage && <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">{successMessage}</div>}
        {errors.general && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">{errors.general}</div>}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
            <input
              className={`w-full bg-white/5 border ${errors.userName ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none transition`}
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              placeholder="Enter username"
              disabled={loading}
            />
            {errors.userName && <p className="mt-1 text-sm text-red-400">{errors.userName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">New Password (optional)</label>
            <input
              type="password"
              className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none transition`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter new password"
              disabled={loading}
            />
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Confirm Password</label>
            <input
              type="password"
              className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none transition`}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="Confirm new password"
              disabled={loading}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className={`save-btn mt-6 w-full flex items-center justify-center gap-2 ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#3b82f6] hover:bg-blue-600'} text-white font-semibold py-3 rounded-lg transition transform ${!loading && 'hover:scale-105'}`}
        >
          {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Saving...</> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}

/* ================= MAIN PAGE ================= */
function UserProfilePage({ isOwn, username }) {
  const API = import.meta.env.VITE_API_URL;

  const [activeTab, setActiveTab] = useState("Posts");
  const [showEditModal, setShowEditModal] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const [userPosts, setUserPosts] = useState([]);
  const [upvotedPosts, setUpvotedPosts] = useState([]);
  const [downvotedPosts, setDownvotedPosts] = useState([]);
  const [voteCounts, setVoteCounts] = useState({});

  /* ===== AUTH ===== */
  useEffect(() => {
    axios.get(`${API}/auth/me`, { withCredentials: true })
      .then(res => setCurrentUser(res.data.user))
      .catch(() => setCurrentUser(null));
  }, [API]);

  /* ===== LOAD PROFILE + POSTS ===== */
  useEffect(() => {
  if (!username && !isOwn) return;
  if (isOwn && !currentUser) return;

  setUserPosts([]);
  setUpvotedPosts([]);
  setDownvotedPosts([]);
  setVoteCounts({});
  setProfileData(null);

    const fetchProfile = async () => {
      try {
        let user;
        if (isOwn) {
          user = currentUser;
        } else {
          const res = await axios.get(`${API}/users/${username}`);
          user = res.data;

        if (currentUser) {
  const isUserFollowing = user.followers?.includes(currentUser._id);
  setIsFollowing(isUserFollowing);
}
        }

        setProfileData({
          _id: user._id,
          username: user.userName,
          displayName: user.userName,
          karma: user.karma || 0,
          followers: user.followers?.length || 0,
          activeIn: user.joinedCommunities?.length || 0,
          createdAt: user.createdAt,
          avatarLetter: user.userName[0].toUpperCase(),
        });

        const [postsRes, upRes, downRes] = await Promise.all([
          axios.get(`${API}/users/userposts/${user._id}`),
          axios.get(`${API}/users/posts/upvotedPosts/${user._id}`),
          axios.get(`${API}/users/posts/downvotedPosts/${user._id}`),
       { withCredentials: true }
        ]);

        setUserPosts(postsRes.data || []);
        setUpvotedPosts(upRes.data || []);
        setDownvotedPosts(downRes.data || []);

        const votes = {};
        [...postsRes.data, ...upRes.data, ...downRes.data].forEach(p => {
          votes[p._id] = {
            upvoteCount: p.upvoteCount || 0,
            downvoteCount: p.downvoteCount || 0,
          };
        });
        setVoteCounts(votes);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [isOwn, currentUser, username, API]);

const toggleFollow = async () => {
  if (!currentUser || isOwn) return;

  try {
    const res = await axios.patch(
      `${API}/users/${profileData._id}/follow`,
      {},
      { withCredentials: true }
    );

    setIsFollowing(res.data.following);

    setProfileData(prev => ({
      ...prev,
      followers: res.data.followersCount,
    }));

  } catch (err) {
    console.error("Follow/unfollow failed", err);
  }
};


  const handleProfileUpdate = (updatedUser) => {
    setProfileData({
      _id: updatedUser._id,
      username: updatedUser.userName,
      displayName: updatedUser.userName,
      karma: updatedUser.karma || 0,
      followers: updatedUser.followers?.length || 0,
      activeIn: updatedUser.joinedCommunities?.length || 0,
      createdAt: updatedUser.createdAt,
      avatarLetter: updatedUser.userName[0].toUpperCase(),
    });
    setCurrentUser({ ...currentUser, userName: updatedUser.userName });
  };

  const handleVote = (postId, voteData) => {
    setVoteCounts(prev => ({
      ...prev,
      [postId]: {
        upvoteCount: voteData.upvoteCount,
        downvoteCount: voteData.downvoteCount,
      },
    }));
  };

  if (!profileData) {
    return <div className="loading-profile text-white text-center py-20 text-2xl">Loading profile...</div>;
  }

  // Dynamic colors: blue for own profile, pink for others
  const bannerColor = isOwn ? ACCENT_BLUE : ACCENT_PINK;
  const avatarBgColor = isOwn ? ACCENT_BLUE : ACCENT_PINK;

  const renderPosts = (posts) =>
    posts.length ? posts.map(post => (
      <PostCard
  key={post._id}
  id={post._id}
  user_name={`u/${post.user?.userName || "Unknown"}`}
  user_avatar={post.user?.image || "https://i.pravatar.cc/48?img=1"}
  title={post.title}                
  description={post.description}
  images={post.images || []}
  comments={post.comments}
  upvoteCount={voteCounts[post._id]?.upvoteCount || 0}
  downvoteCount={voteCounts[post._id]?.downvoteCount || 0}
  commentCount={post.commentCount || 0}
  date={post.date}             
  community_name={`b/${post.commName || "unknown"}`}
  communityId={post.communityID?._id || post.communityID}
  
  poll={post.poll}
  edited={post.edited || false}
  onVote={handleVote}
  currentUser={currentUser}
/>

    )) : (
      <div className="empty-state glass-card text-center py-12 text-gray-400">Nothing here yet</div>
    );

  return (
    <div className="profile-page">
      <div className="profile-banner-container">
        {/* Banner with dynamic color */}
        <div className="profile-banner" style={{ backgroundColor: bannerColor }}></div>

        <div className="profile-info-container">
          <div className="profile-avatar-wrapper">
            {/* Avatar with dynamic background color */}
            <div className="profile-avatar-large" style={{ backgroundColor: avatarBgColor }}>
              {profileData.avatarLetter}
            </div>
          </div>

          <div className="profile-name-section">
            <h1 className="profile-display-name">{profileData.displayName}</h1>
            <p className="profile-username">u/{profileData.username}</p>
          </div>

          {isOwn ? (
            <button onClick={() => setShowEditModal(true)} className="edit-profile-btn">
              <Settings size={18} /> Edit Profile
            </button>
          ) : (
            <button
              onClick={toggleFollow}
              className={`edit-profile-btn ${isFollowing ? "bg-purple-600 text-white" : "bg-white text-purple-700"}`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>

      <div className="profile-grid">
        <div>
          <div className="tabs-header glass-card mb-6">
            {["Posts", "Upvoted", "Downvoted"].map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === "Posts" && renderPosts(userPosts)}
            {activeTab === "Upvoted" && renderPosts(upvotedPosts)}
            {activeTab === "Downvoted" && renderPosts(downvotedPosts)}
          </div>
        </div>

        <AboutSidebar profile={profileData} isOwn={isOwn} postCount={userPosts.length} />
      </div>

      <EditSettingsModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profileData={profileData}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}

export default UserProfilePage;