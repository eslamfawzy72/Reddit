import React, { useState } from 'react';
import { Bell, MessageSquare, ArrowUp, Mail, Search, User, Settings, LogOut } from 'lucide-react';

// Sample notifications with actual dates for sorting //test
const sampleNotifications = [
  {
    id: 1,
    type: 'comment',
    username: 'adham_walid',
    avatar: 'AW',
    text: 'commented on your post in r/gaming',
    timestamp: '2 hours ago',
    actualDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false,
    link: '/post/123'
  },
  {
    id: 2,
    type: 'upvote',
    username: 'jana_hasheesh',
    avatar: 'JH',
    text: 'upvoted your comment in r/technology',
    timestamp: '5 hours ago',
    actualDate: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isRead: false,
    link: '/comment/456'
  },
  {
    id: 3,
    type: 'message',
    username: 'Eslam_fawzy',
    avatar: 'EF',
    text: 'sent you a message',
    timestamp: '1 day ago',
    actualDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isRead: true,
    link: '/messages/789'
  },
  {
    id: 4,
    type: 'comment',
    username: 'Carol_Kamal',
    avatar: 'CK',
    text: 'replied to your comment in r/movies',
    timestamp: '30 minutes ago',
    actualDate: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isRead: false,
    link: '/comment/789'
  }
];

// Avatar Component //temp
const Avatar = ({ avatar, username, size = 40 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: '#0079D3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: 'white'
    }}
  >
    {avatar || username.charAt(0).toUpperCase()}
  </div>
);

// Empty State //temp
const EmptyState = ({ icon: Icon, title, description }) => (
  <div
    style={{
      padding: '60px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}
  >
    <div
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: '#F6F7F8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}
    >
      <Icon size={40} color="#878A8C" />
    </div>

    <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{title}</h3>
    <p style={{ fontSize: '14px', color: '#7c7c7c', marginTop: '6px' }}>{description}</p>
  </div>
);

// Notification Tile
const NotificationTile = ({ notification, onClick }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'comment':
        return <MessageSquare size={16} color="#0079D3" />;
      case 'upvote':
        return <ArrowUp size={16} color="#FF4500" />;
      case 'message':
        return <Mail size={16} color="#46D160" />;
      default:
        return <Bell size={16} />;
    }
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        gap: '12px',
        padding: '16px',
        backgroundColor: notification.isRead ? 'white' : '#F0F7FF',
        borderBottom: '1px solid #E0E3E6',
        cursor: 'pointer'
      }}
    >
      {!notification.isRead && (
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#0079D3',
            marginTop: '16px'
          }}
        />
      )}

      <Avatar avatar={notification.avatar} username={notification.username} />

      <div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {getIcon()}
          <span style={{ fontWeight: notification.isRead ? '400' : '600' }}>
            u/{notification.username} {notification.text}
          </span>
        </div>

        <div style={{ fontSize: '12px', color: '#777' }}>{notification.timestamp}</div>
      </div>
    </div>
  );
};

// Navbar /after removing bell and dropdownn
const Navbar = () => {
  return (
    <nav
      style={{
        height: '56px',
        backgroundColor: 'white',
        borderBottom: '1px solid #E0E3E6',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#005effff',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontWeight: '700'
          }}
        >
          B
        </div>
        <span style={{ fontSize: '20px', fontWeight: '700' }}>bluedit</span>
      </div>

      {/* Right Side Menu - Removed bell and dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Empty space where bell and dropdown used to be */}
      </div>
    </nav>
  );
};

// Main Notification Page
const NotificationPage = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Messages', 'Comments', 'Upvotes'];

  const handleNotificationClick = (n) => {
    setNotifications(notifications.map(x =>
      x.id === n.id ? { ...x, isRead: true } : x
    ));
  };

  // Filter and sort notifications by date (newest first)
  const filteredAndSorted = (
    filter === 'All'
      ? notifications
      : notifications.filter(n =>
          filter === 'Messages'
            ? n.type === 'message'
            : filter === 'Comments'
            ? n.type === 'comment'
            : n.type === 'upvote'
        )
  )
  .sort((a, b) => new Date(b.actualDate) - new Date(a.actualDate)); // Sort by date (newest first)

  return (
    <div style={{ backgroundColor: '#DAE0E6', minHeight: '100vh' }}>
     

      {/* Main Center Only */}
      <main
        style={{
          maxWidth: '750px',
          margin: '0 auto',
          padding: '20px'
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #ddd'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '20px',
              borderBottom: '1px solid #ddd'
            }}
          >
            <h1 style={{ fontSize: '20px', fontWeight: '700' }}>Notifications</h1>
          </div>

          {/* Filters */}
          <div
            style={{
              padding: '12px 20px',
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid #ddd',
              background: '#FAFAFA'
            }}
          >
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  border: filter === f ? 'none' : '1px solid #ddd',
                  background: filter === f ? '#0079D3' : 'white',
                  color: filter === f ? 'white' : '#333',
                  fontWeight: '600'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Notification List */}
          {filteredAndSorted.length > 0 ? (
            filteredAndSorted.map(notification => (
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