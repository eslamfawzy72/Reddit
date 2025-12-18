import React, { useState } from "react";
import { Bell, MessageSquare, ArrowUp, Mail } from "lucide-react";
import "../styles/notificationPage.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Avatar = ({ avatar, username }) => (
  <div className="avatar">{avatar || username.charAt(0).toUpperCase()}</div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="empty-state">
    <div className="empty-icon">
      <Icon size={40} color="#878A8C" />
    </div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const NotificationTile = ({ notification, onClick }) => {
  const navigate = useNavigate();
const handleClick = async () => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/notifications/${notification._id}/read`,
      {},
      { withCredentials: true }
    );
  } catch (err) {}



  
  if (
    notification.type === "post_share" &&
    notification.postId &&
    notification.communityId
  ) {
    navigate(
      `/community/${notification.communityId}?focusPost=${notification.postId}`
    );
    return;
  }
};

  const getIcon = () => {
    switch (notification.type) {
      case "comment":
        return <MessageSquare size={16} color="#0079D3" />;
      case "upvote":
        return <ArrowUp size={16} color="#FF4500" />;
      case "message":
        return <Mail size={16} color="#46D160" />;
      case "post_share":
      return <Mail size={16} color="#46D160" />
      default:
        return <Bell size={16} />;
    }
  };
  const displayUsername =
  notification.username ||
  notification.actorId?.userName ||
  "user";

const displayAvatar =
  notification.avatar ||
  notification.actorId?.image;


  return (
    <div
      className={`notification-tile ${notification.isRead ? "read" : "unread"}`}
      onClick={handleClick}
    >
      {!notification.isRead && <div className="unread-dot" />}
      <Avatar avatar={displayAvatar} username={displayUsername} />
      <div className="notification-content">
        <div className="notification-text">
          {getIcon()}
          <span className={notification.isRead ? "read-text" : "unread-text"}>
            u/{displayUsername} {notification.text}
          </span>
        </div>
        <div className="notification-time">{notification.timestamp}</div>
      </div>
    </div>
  );
};

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-left">
      <div className="logo">B</div>
      <span className="brand">bluedit</span>
    </div>
    <div className="navbar-right">{/* Empty for now */}</div>
  </nav>
);

const NotificationPage = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Messages", "Comments", "Upvotes"];

  const handleNotificationClick = (n) => {
    setNotifications(
      notifications.map((x) => (x.id === n.id ? { ...x, isRead: true } : x))
    );
  };

  const filteredAndSorted = (filter === "All"
    ? notifications
    : notifications.filter((n) =>
        filter === "Messages"
          ? n.type === "message"
          : filter === "Comments"
          ? n.type === "comment"
          : n.type === "upvote"
      )
  ).sort((a, b) => new Date(b.actualDate) - new Date(a.actualDate));


  return (
    <div className="notification-page">
      <Navbar />
      <main className="notification-main">
        <div className="notification-container">
          <div className="notification-header">
            <h1>Notifications</h1>
          </div>
          <div className="notification-filters">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={filter === f ? "filter-active" : ""}
              >
                {f}
              </button>
            ))}
          </div>
          {filteredAndSorted.length > 0 ? (
            filteredAndSorted.map((notification) => (
              <NotificationTile
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
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
      </main>
    </div>
  );
};

export default NotificationPage;
