import React, { useState } from "react";
import { Bell, MessageSquare, ArrowUp, Mail } from "lucide-react";
import "../styles/notificationPage.css";

// Sample notifications
const sampleNotifications = [
  {
    id: 1,
    type: "comment",
    username: "adham_walid",
    avatar: "AW",
    text: "commented on your post in r/gaming",
    timestamp: "2 hours ago",
    actualDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
    link: "/post/123",
  },
  {
    id: 2,
    type: "upvote",
    username: "jana_hasheesh",
    avatar: "JH",
    text: "upvoted your comment in r/technology",
    timestamp: "5 hours ago",
    actualDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: false,
    link: "/comment/456",
  },
  {
    id: 3,
    type: "message",
    username: "Eslam_fawzy",
    avatar: "EF",
    text: "sent you a message",
    timestamp: "1 day ago",
    actualDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isRead: true,
    link: "/messages/789",
  },
  {
    id: 4,
    type: "comment",
    username: "Carol_Kamal",
    avatar: "CK",
    text: "replied to your comment in r/movies",
    timestamp: "30 minutes ago",
    actualDate: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false,
    link: "/comment/789",
  },
];

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
  const getIcon = () => {
    switch (notification.type) {
      case "comment":
        return <MessageSquare size={16} color="#0079D3" />;
      case "upvote":
        return <ArrowUp size={16} color="#FF4500" />;
      case "message":
        return <Mail size={16} color="#46D160" />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <div
      className={`notification-tile ${notification.isRead ? "read" : "unread"}`}
      onClick={onClick}
    >
      {!notification.isRead && <div className="unread-dot" />}
      <Avatar avatar={notification.avatar} username={notification.username} />
      <div className="notification-content">
        <div className="notification-text">
          {getIcon()}
          <span className={notification.isRead ? "read-text" : "unread-text"}>
            u/{notification.username} {notification.text}
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
