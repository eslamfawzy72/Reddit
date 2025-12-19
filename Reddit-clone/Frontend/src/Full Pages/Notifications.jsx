import React, { useEffect, useState } from "react";
import { Bell, MessageSquare, ArrowUp, ArrowDown, Mail } from "lucide-react";
import axios from "axios";
import SidebarLeft from "../Components/SidebarLeft";
import PrimarySearchAppBar from "../Components/PrimarySearchAppBar";
import { useNavigate } from "react-router-dom";

const Avatar = ({ avatar, username, size = 40 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: "#0079D3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      fontWeight: "600",
      color: "white",
    }}
  >
    {avatar || username?.charAt(0)?.toUpperCase()}
  </div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div
    style={{
      padding: "60px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: "#0F172A",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      <Icon size={40} color="#878A8C" />
    </div>

    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#E5E7EB" }}>
      {title}
    </h3>
    <p style={{ fontSize: "14px", color: "#9CA3AF", marginTop: "6px" }}>
      {description}
    </p>
  </div>
);

const NotificationTile = ({ notification, onClick }) => {
  const user = notification.actorId?.userName || "Someone";

  const getIcon = () => {
    switch (notification.type) {
      case "post_comment":
      case "comment_reply":
        return <MessageSquare size={16} color="#0079D3" />;

      case "post_upvote":
      case "comment_upvote":
        return <ArrowUp size={16} color="#FF4500" />;

      case "post_downvote":
      case "comment_downvote":
        return <ArrowDown size={16} color="#7193FF" />;

      case "message":
        return <Mail size={16} color="#0079D3" />;

      default:
        return <Bell size={16} />;
    }
  };

  const getText = () => {
    switch (notification.type) {
      case "post_comment":
        return `u/${user} commented on your post`;
      case "comment_reply":
        return `u/${user} replied to your comment`;
      case "post_upvote":
        return `u/${user} upvoted your post`;
      case "comment_upvote":
        return `u/${user} upvoted your comment`;
      case "post_downvote":
        return `u/${user} downvoted your post`;
      case "comment_downvote":
        return `u/${user} downvoted your comment`;
      case "message":
        return `u/${user} sent you a message`;
      case "post_share":
        return `u/${user} shared a post with you`;
      default:
        return `u/${user} followed you`;
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        gap: "12px",
        padding: "16px",
        backgroundColor: notification.isRead ? "#0B0F1A" : "#1E2A47",
        borderBottom: "1px solid #1F2933",
        cursor: "pointer",
        borderRadius: "8px",
      }}
    >
      {!notification.isRead && (
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#0079D3",
            marginTop: "16px",
          }}
        />
      )}

      <Avatar
        avatar={notification.actorId?.image}
        username={notification.actorId?.userName}
      />

      <div>
        <div
          style={{
            display: "flex",
            gap: "6px",
            alignItems: "center",
            color: "#E5E7EB",
          }}
        >
          {getIcon()}
          <span style={{ fontWeight: notification.isRead ? "400" : "600" }}>
            {getText()}
          </span>
        </div>

        <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
          {new Date(notification.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

const Notifications = ({ onOpenCreateCommunity, onOpenCreatePost }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");
  const API = import.meta.env.VITE_API_URL;
  const [currentUser, setCurrentUser] = useState(null);
 const handleNotificationClick = async (n) => {
  try {
    // mark as read
    await axios.patch(`${API}/notifications/${n._id}/read`, {}, { withCredentials: true });
    setNotifications(prev =>
      prev.map(x => (x._id === n._id ? { ...x, isRead: true } : x))
    );

    // post_share → community
    if (n.type === "post_share" && n.postId && n.communityId) {
      navigate(`/community/${n.communityId}?focusPost=${n.postId}`);
      return;
    }

    // follow → profile page
    if (n.type === "follow" && n.actorId?._id) {
      navigate(`/Profile/${n.actorId._id}`);
      return;
    }

    // post-related notifications
    if ([
      "post_upvote",
      "post_downvote",
      "post_comment",
      "comment_reply",
      "comment_upvote",
      "comment_downvote",
      "post_share"
    ].includes(n.type)) {
      const postId = n.postId || n.targetId;
      try {
        const postRes = await axios.get(`${API}/posts/${postId}`);
        const communityId = postRes.data.communityID;
        navigate(`/community/${communityId}?focusPost=${postId}`);
      } catch {
        alert("The post no longer exists."); // fallback if post deleted
      }
      return;
    }

  } catch (err) {
    console.error("Notification click error:", err);
    alert("Failed to open this notification."); // friendly fallback
  }
};




useEffect(() => {
  axios.get(`${API}/auth/me`, { withCredentials: true })
    .then(res => setCurrentUser(res.data.user))
    .catch(() => setCurrentUser(null));
}, []);
  const searchFunction = async (query) => {
    if (!query || !query.trim()) return { results: [], renderItem: null }; // ✅ always return object

  try {
    // fetch users
    const userRes = await axios.get(`${API}/users`);
    const users = (userRes.data || [])
      .filter(u => u.userName?.toLowerCase().startsWith(query.toLowerCase())&& u._id !== currentUser?._id  )
      .map(u => ({ type: "user", id: u._id, label: u.userName, avatar: u.image }));

      // fetch communities
      const commRes = await axios.get(`${API}/communities`);
      const communities = (commRes.data || [])
        .filter(c => c.commName?.toLowerCase().startsWith(query.toLowerCase()))
        .map(c => ({ type: "community", id: c._id, label: c.commName, image: c.image }));

      const results = [...users, ...communities];

      const renderItem = (item) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src={item.avatar || item.image || "https://i.pravatar.cc/32"}
            alt=""
            style={{ width: 32, height: 32, borderRadius: "50%" }}
          />
          <span>{item.label} ({item.type})</span>
        </div>
      );

      return { results, renderItem };
    } catch (err) {
      console.error("Search error:", err);
      return { results: [], renderItem: null }; // ✅ fallback
    }
  };


  const filters = ["All", "Comments", "Upvotes", "Downvotes", "Shares"];

  const fetchNotifications = async () => {
    try {
      const filterMap = {
        All: "all",
        Comments: "comments",
        Upvotes: "upvotes",
        Downvotes: "downvotes",
        Shares: "shares",
      };
      const typeQuery = filterMap[filter] || "all";

      const res = await axios.get(
        `${API}/notifications?type=${typeQuery}`,
        { withCredentials: true }
      );

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);



  return (
    <div className="homeContainer">
      {/* Top Navbar */}
      <div className="topNavbar">
        <PrimarySearchAppBar onOpenCreatePost={onOpenCreatePost} searchFunction={searchFunction} />
      </div>

      {/* Left Sidebar */}
      <div className="leftSidebar">
        <SidebarLeft
          onOpenCreateCommunity={onOpenCreateCommunity}
          onOpenCreatePost={onOpenCreatePost}
        />
      </div>

      {/* Main Feed */}
      <div className="mainFeed" style={{ padding: "28px 36px" }}>
        <div className="feedWrapper">
          {/* Page Title */}
          <div style={{ padding: "12px 0", color: "#E5E7EB" }}>
            <h1 style={{ fontSize: "22px", fontWeight: "700" }}>
              Notifications
            </h1>
          </div>

          {/* Filters */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "16px",
              flexWrap: "wrap",
            }}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  border: filter === f ? "none" : "1px solid #1F2933",
                  background: filter === f ? "#0079D3" : "#1E2A47",
                  color: filter === f ? "#fff" : "#E5E7EB",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <NotificationTile
                key={n._id}
                notification={n}
                onClick={() => handleNotificationClick(n)}
              />
            ))
          ) : (
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="When something happens, it will show here."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
