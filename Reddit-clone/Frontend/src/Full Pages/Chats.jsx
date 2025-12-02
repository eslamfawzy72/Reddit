import React, { useState, useRef, useEffect } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  InputBase,
  Paper,
  Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1e90ff" },
    background: { default: "#0f172a", paper: "#111827" },
  },
  typography: { fontFamily: '"Inter", sans-serif' },
});

const availableUsers = [
  { id: 6, name: "Jordan Lee", avatarUrl: null },
  { id: 7, name: "Taylor Swift", avatarUrl: "https://randomuser.me/api/portraits/women/65.jpg" },
  { id: 8, name: "Chris Hemsworth", avatarUrl: null },
  { id: 9, name: "Lana Del Rey", avatarUrl: "https://randomuser.me/api/portraits/women/22.jpg" },
  { id: 10, name: "Elon Musk", avatarUrl: null },
  { id: 11, name: "Zendaya", avatarUrl: "https://randomuser.me/api/portraits/women/77.jpg" },
  { id: 12, name: "Drake", avatarUrl: null },
  { id: 13, name: "Ariana Grande", avatarUrl: "https://randomuser.me/api/portraits/women/33.jpg" },
];

const initialChats = [
  {
    id: 1,
    name: "Alex Chen",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    lastMessage: { content: "All good here, just cruising", time: new Date(Date.now() - 2 * 60 * 1000) },
    messages: [
      { id: 1, senderId: 1, content: "Hey! How's it going?", time: new Date(Date.now() - 4 * 60 * 1000) },
      { id: 2, senderId: 0, content: "All good here, just cruising", time: new Date(Date.now() - 2 * 60 * 1000) },
    ],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatarUrl: null,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    lastMessage: { content: "Glad it helped", time: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    messages: [
      { id: 3, senderId: 2, content: "That article was super helpful!", time: new Date(Date.now() - 24 * 60 * 60 * 1000 - 2 * 60 * 1000) },
      { id: 4, senderId: 0, content: "Glad it helped", time: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: 3,
    name: "Mike Rivera",
    avatarUrl: null,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    lastMessage: { content: "Locked and loaded", time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    messages: [
      { id: 5, senderId: 3, content: "Don't forget the slides tomorrow.", time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 2 * 60 * 1000) },
      { id: 6, senderId: 0, content: "Locked and loaded", time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
    ],
  },
  {
    id: 4,
    name: "Emma Davis",
    avatarUrl: null,
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    lastMessage: { content: "You're a legend", time: new Date(Date.now() - 30 * 60 * 1000) },
    messages: [
      { id: 7, senderId: 4, content: "I'll start designing the layout now.", time: new Date(Date.now() - 35 * 60 * 1000) },
      { id: 8, senderId: 0, content: "You're a legend", time: new Date(Date.now() - 30 * 60 * 1000) },
    ],
  },
  {
    id: 5,
    name: "Tom Wilson",
    avatarUrl: null,
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    lastMessage: { content: "Do you have the latest version?", time: new Date(Date.now() - 20 * 60 * 1000) },
    messages: [
      { id: 9, senderId: 5, content: "Do you have the latest version?", time: new Date(Date.now() - 20 * 60 * 1000) },
    ],
  },
];

const formatTimestamp = (date) => {
  const now = new Date();
  const msgDate = new Date(date);
  const isToday = now.toDateString() === msgDate.toDateString();
  const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === msgDate.toDateString();

  if (isToday) return msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isYesterday) return "Yesterday";
  if (now.getFullYear() === msgDate.getFullYear()) return msgDate.toLocaleDateString([], { weekday: "long" });
  return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
};

function ChatAvatar({ name, avatarUrl, ...props }) {
  const firstLetter = name.charAt(0).toUpperCase();
  return (
    <Avatar
      alt={name}
      src={avatarUrl || undefined}
      {...props}
      sx={{
        width: 50,
        height: 50,
        bgcolor: avatarUrl ? undefined : "#1e90ff",
        boxShadow: "0 0 15px rgba(30,144,255,0.5)",
        ...props.sx,
      }}
    >
      {!avatarUrl && firstLetter}
    </Avatar>
  );
}

function FilePreview({ files, onRemove }) {
  if (files.length === 0) return null;

  return (
    <Box sx={{ mt: 1, mb: 2 }}>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          const isImage = file.type.startsWith("image/");
          const isVideo = file.type.startsWith("video/");

          return (
            <Paper
              key={index}
              sx={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#1e293b",
              }}
            >
              {isImage && <img src={url} alt={file.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              {isVideo && <video src={url} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />}
              {!isImage && !isVideo && (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "gray" }}>
                  <InsertDriveFileIcon sx={{ fontSize: 40 }} />
                  <Typography variant="caption" noWrap sx={{ px: 1 }}>
                    {file.name}
                  </Typography>
                </Box>
              )}
              <IconButton
                size="small"
                onClick={() => onRemove(index)}
                sx={{ position: "absolute", top: 4, right: 4, bgcolor: "rgba(0,0,0,0.6)", color: "white" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}

function AddChatDialog({ open, onClose, chats, setChats, setSelectedChat }) {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = (user) => {
    const now = new Date();
    const exists = chats.some((c) => c.id === user.id);

    if (exists) {
      setSelectedChat(chats.find((c) => c.id === user.id));
      onClose();
      return;
    }

    const waveMessage = {
      id: Date.now(),
      senderId: 0,
      content: "You started a chat",
      time: now,
    };

    const newChat = {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      timestamp: now,
      lastMessage: waveMessage,
      messages: [waveMessage],
    };

    setChats((prev) => [...prev, newChat]);
    setSelectedChat(newChat);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { bgcolor: "#0f172a" } }}>
      <DialogTitle sx={{ bgcolor: "#020617", color: "white" }}>Start New Chat</DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #1e293b" }}>
          <InputBase
            fullWidth
            placeholder="Search people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startAdornment={<SearchIcon sx={{ mr: 1, color: "gray" }} />}
            sx={{ bgcolor: "#111827", borderRadius: 2, px: 2, py: 1, color: "white" }}
          />
        </Box>

        <List sx={{ maxHeight: 400, overflow: "auto" }}>
          {filteredUsers.length === 0 ? (
            <Typography sx={{ p: 3, textAlign: "center", color: "gray" }}>No users found</Typography>
          ) : (
            filteredUsers.map((user) => (
              <ListItem key={user.id} disablePadding>
                <ListItemButton onClick={() => handleStartChat(user)}>
                  <ListItemAvatar>
                    <ChatAvatar name={user.name} avatarUrl={user.avatarUrl} />
                  </ListItemAvatar>
                  <ListItemText primary={user.name} />
                </ListItemButton>
              </ListItem>
            ))
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}

function ChatSidebar({ chats, selectedChat, setSelectedChat, setChats }) {
  const [addChatOpen, setAddChatOpen] = useState(false);
  const sortedChats = [...chats].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <>
      {/* Responsive Sidebar */}
      <Box
        sx={{
          width: { xs: "100%", sm: "380px" },
          maxWidth: { xs: "100%", sm: 420 },
          minWidth: { xs: "100%", sm: 320 },
          bgcolor: "#020617",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          borderRight: { sm: "1px solid #1e293b" },
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid #1e293b",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight="bold" color="primary">
            Chats
          </Typography>

          <Button variant="contained" color="success" size="small" startIcon={<WavingHandIcon />} onClick={() => setAddChatOpen(true)}>
            New Chat
          </Button>
        </Box>

        <List sx={{ flexGrow: 1, overflow: "auto" }}>
          {sortedChats.map((chat) => (
            <ListItem key={chat.id} disablePadding>
              <ListItemButton
                selected={selectedChat?.id === chat.id}
                onClick={() => setSelectedChat(chat)}
                sx={{
                  py: 2,
                  borderBottom: "1px solid #1e293b",
                  "&.Mui-selected": { bgcolor: "#0f172a" },
                }}
              >
                <ListItemAvatar>
                  <ChatAvatar name={chat.name} avatarUrl={chat.avatarUrl} />
                </ListItemAvatar>

                <ListItemText
                  primary={<Typography color="white" fontWeight="600">{chat.name}</Typography>}
                  secondary={
                    <Typography variant="body2" color="gray" noWrap>
                      {chat.lastMessage.content}
                    </Typography>
                  }
                />

                <Typography variant="caption" color="gray" sx={{ ml: 2 }}>
                  {formatTimestamp(chat.timestamp)}
                </Typography>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <AddChatDialog
        open={addChatOpen}
        onClose={() => setAddChatOpen(false)}
        chats={chats}
        setChats={setChats}
        setSelectedChat={setSelectedChat}
      />
    </>
  );
}

function ChatPanel({ selectedChat, setSelectedChat, chats, setChats }) {
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const handleSendClick = () => {
    if (!selectedChat || (!message.trim() && attachedFiles.length === 0)) return;

    const now = new Date();
    const newMessages = [];

    if (message.trim()) {
      newMessages.push({
        id: Date.now(),
        senderId: 0,
        type: "text",
        content: message.trim(),
        time: now,
      });
    }

    attachedFiles.forEach((file) =>
      newMessages.push({
        id: Date.now() + Math.random(),
        senderId: 0,
        type: "file",
        file,
        fileName: file.name,
        fileType: file.type,
        time: now,
      })
    );

    const lastMsgContent =
      message.trim() || (attachedFiles.length === 1 ? attachedFiles[0].name : `${attachedFiles.length} files`);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              messages: [...chat.messages, ...newMessages],
              timestamp: now,
              lastMessage: { content: lastMsgContent, time: now },
            }
          : chat
      )
    );

    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, ...newMessages],
      timestamp: now,
    }));

    setMessage("");
    setAttachedFiles([]);
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!selectedChat) {
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#0f172a" }}>
        <Typography variant="h5" color="gray">
          Select a chat to begin
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#0f172a" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "#020617", p: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #1e293b" }}>
        <ChatAvatar name={selectedChat.name} avatarUrl={selectedChat.avatarUrl} />
        <Typography variant="h6" color="white" sx={{ flexGrow: 1 }}>
          {selectedChat.name}
        </Typography>
        <IconButton color="primary">
          <MoreVertIcon />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, p: 3, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {selectedChat.messages.map((msg) => {
          const isFile = msg.type === "file";
          const isImage = isFile && msg.fileType?.startsWith("image/");
          const isVideo = isFile && msg.fileType?.startsWith("video/");

          return (
            <Box
              key={msg.id}
              sx={{
                alignSelf: msg.senderId === 0 ? "flex-end" : "flex-start",
                bgcolor: msg.senderId === 0 ? "#1e90ff" : "#1e293b",
                color: "white",
                px: 2.5,
                py: 1.5,
                borderRadius: "18px",
                maxWidth: "70%",
                boxShadow: msg.senderId === 0 ? "0 4px 20px rgba(30,144,255,0.4)" : "none",
              }}
            >
              {isFile && (isImage || isVideo) ? (
                <Box sx={{ borderRadius: 2, overflow: "hidden", mb: 1 }}>
                  {isImage && (
                    <img
                      src={URL.createObjectURL(msg.file)}
                      alt={msg.fileName}
                      style={{ maxWidth: "100%", borderRadius: 8, display: "block" }}
                    />
                  )}
                  {isVideo && (
                    <video
                      src={URL.createObjectURL(msg.file)}
                      controls
                      style={{ maxWidth: "100%", borderRadius: 8, display: "block" }}
                    />
                  )}
                </Box>
              ) : isFile ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <InsertDriveFileIcon />
                  <Typography variant="body2">{msg.fileName}</Typography>
                </Box>
              ) : (
                <Typography variant="body1">{msg.content}</Typography>
              )}

              <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "0.75rem", display: "block", mt: 0.5 }}>
                {formatTimestamp(msg.time)}
              </Typography>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: "1px solid #1e293b", bgcolor: "#020617" }}>
        <FilePreview files={attachedFiles} onRemove={removeFile} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton component="label">
            <AttachFileIcon sx={{ color: "gray" }} />
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => {
                if (e.target.files) setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
              }}
            />
          </IconButton>

          <TextField
            fullWidth
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSendClick()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <EmojiEmotionsIcon sx={{ color: "gray" }} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "30px", bgcolor: "#0f172a", color: "white" },
            }}
          />

          <IconButton color="primary" onClick={handleSendClick} disabled={!message.trim() && attachedFiles.length === 0}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

export default function ChatApp() {
  const [chats, setChats] = useState(initialChats);
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      {/* Full Screen Container */}
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          maxWidth: "100vw",
          bgcolor: "#0f172a",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          left: 0,
          m: 0,
          p: 0,
        }}
      >
        <ChatSidebar chats={chats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} setChats={setChats} />
        <ChatPanel selectedChat={selectedChat} setSelectedChat={setSelectedChat} chats={chats} setChats={setChats} />
      </Box>
    </ThemeProvider>
  );
}