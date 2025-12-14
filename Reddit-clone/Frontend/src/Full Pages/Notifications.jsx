import React, { useState, useEffect } from "react";
import { Bell, MessageSquare, ArrowUp, Mail } from "lucide-react";
import axios from "axios";

// Avatar Component
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

// Empty State
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
        backgroundColor: "#F6F7F8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
      }}
    >
      <Icon size={40} color="#878A8C" />
    </div>

    <h3 style={{ fontSize: "18px", fontWeight: "600" }}>{title}</h3>
    <p style={{ fontSize: "14px", color: "#7c7c7c", marginTop: "6px" }}>
      {description}
    </p>
  </div>
);

// Notification Tile
const NotificationTile = ({ notification, onClick }) => {
  const getIcon = () => {
    switch (notification.type) {
      case "post_comment":
      case "comment_reply":
        return <MessageSquare size={16} color="#0079D3" />;
      case "post_upvote":
      case "comment_upvote":
        return <ArrowUp size={16} color="#FF4500" />;
      case "message":
        return <Mail size={16} color="#46D160" />;
      default:
        return <Bell size={16} />;
    }
  };

  const getText = () => {
    const user = notification.actorId?.userName || "Someone";
    const community = notification.subreddit || "general";

    switch (notification.type) {
      case "post_comment":
        return `u/${user} commented on your post`;
      case "comment_reply":
        return `u/${user} replied to your comment`;
      case "post_upvote":
        return `u/${user} upvoted your post`;
      case "comment_upvote":
        return `u/${user} upvoted your comment`;
      case "message":
        return `u/${user} sent you a message`;
      default:
        return `u/${user} interacted with you`;
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        gap: "12px",
        padding: "16px",
        backgroundColor: notification.isRead ? "white" : "#F0F7FF",
        borderBottom: "1px solid #E0E3E6",
        cursor: "pointer",
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
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {getIcon()}
          <span style={{ fontWeight: notification.isRead ? "400" : "600" }}>
            {getText()}
          </span>
        </div>

        <div style={{ fontSize: "12px", color: "#777" }}>
          {new Date(notification.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

// Main Notification Page
const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Comments", "Upvotes"];

  const fetchNotifications = async () => {
    try {
      const typeQuery =
        filter === "All" ? "all" : filter === "Comments" ? "comments" : "upvotes";

      const res = await axios.get(
        `http://localhost:5000/notifications?type=${typeQuery}`,
        { withCredentials: true }
      );

      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log("Error fetching notifications:", err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const handleNotificationClick = async (n) => {
    try {
      await axios.patch(
        `http://localhost:5000/notifications/${n._id}/read`,
        {},
        { withCredentials: true }
      );

      setNotifications((prev) =>
        prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x))
      );
    } catch (err) {
      console.log("Error marking as read:", err);
    }
  };

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <main style={{ maxWidth: "750px", margin: "0 auto", padding: "20px" }}>
        <div style={{ background: "white", borderRadius: "8px", border: "1px solid #ddd" }}>
          <div style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
            <h1 style={{ fontSize: "20px", fontWeight: "700" }}>Notifications</h1>
          </div>

          <div
            style={{
              padding: "12px 20px",
              display: "flex",
              gap: "8px",
              borderBottom: "1px solid #ddd",
              background: "#FAFAFA",
            }}
          >
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: filter === f ? "none" : "1px solid #ddd",
                  background: filter === f ? "#0079D3" : "white",
                  color: filter === f ? "white" : "#333",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationTile
                key={notification._id}
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
