// ChatApp.jsx — FINAL WORKING VERSION
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import WavingHandIcon from "@mui/icons-material/WavingHand";

// -------------------- THEME & SOCKET --------------------
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1e90ff" },
    background: { default: "#0f172a", paper: "#111827" },
  },
  typography: { fontFamily: '"Inter", sans-serif' },
});

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

// -------------------- HELPERS --------------------
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

// -------------------- FILE PREVIEW --------------------
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

// -------------------- OTHER USER NAME --------------------
function OtherUserName({ participants }) {
  const myId = localStorage.getItem("userId");
  const [name, setName] = React.useState("Loading...");

  useEffect(() => {
    if (!participants || participants.length < 2) {
      setName("Unknown User");
      return;
    }
    const otherUser = participants.find(p => p._id !== myId);
    setName(otherUser ? otherUser.userName : "Unknown User");
  }, [participants]);

  return <>{name}</>;
}

// -------------------- CHAT SIDEBAR WITH + BUTTON --------------------
function ChatSidebar({ chats, selectedChat, handleChatSelect, onNewChat }) {
  const sortedChats = [...chats].sort((a, b) => {
    const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  return (
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
      <Box sx={{ p: 2, borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold" color="primary">Chats</Typography>
        <IconButton onClick={onNewChat}>
          <AddIcon sx={{ color: "white" }} />
        </IconButton>
      </Box>

      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        {sortedChats.map((chat) => (
          <ListItem key={chat._id} disablePadding>
            <ListItemButton
              selected={selectedChat?._id === chat._id}
              onClick={() => handleChatSelect(chat)}
              sx={{ py: 2, borderBottom: "1px solid #1e293b", "&.Mui-selected": { bgcolor: "#0f172a" } }}
            >
              <ListItemText
                primary={<Typography color="white" fontWeight="600">{chat.isGroupChat ? chat.name : <OtherUserName participants={chat.participants} />}</Typography>}
                secondary={<Typography variant="body2" color="gray" noWrap>{chat.lastMessage?.content || "No messages yet"}</Typography>}
              />
              <Typography variant="caption" color="gray" sx={{ ml: 2 }}>{formatTimestamp(chat.lastMessage?.createdAt)}</Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

// -------------------- CHAT PANEL (100% original) --------------------
function ChatPanel({ selectedChat, setSelectedChat, chats, setChats }) {
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [selectedChat?.messages]);

  const handleSendClick = async () => {
    if (!selectedChat || (!message.trim() && attachedFiles.length === 0)) return;

    try {
      const payload = {
        sender: localStorage.getItem("userId"),
        content: message.trim(),
        attachments: attachedFiles.map(file => ({ url: file.url, type: "file" })),
      };

      const res = await axios.post(`http://localhost:5000/messages/${selectedChat._id}`, payload);
      const realMsg = res.data.data;

      setSelectedChat(prev => ({ ...prev, messages: [...prev.messages, realMsg] }));
      setChats(prev => prev.map(chat => chat._id === selectedChat._id ? { ...chat, lastMessage: realMsg, updatedAt: realMsg.createdAt } : chat));
      socket.emit("new_message", realMsg);

      setMessage("");
      setAttachedFiles([]);
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  const removeFile = (index) => setAttachedFiles(prev => prev.filter((_, i) => i !== index));

  if (!selectedChat) return (
    <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#0f172a" }}>
      <Typography variant="h5" color="gray">Select a chat to begin</Typography>
    </Box>
  );

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#0f172a" }}>
      <Box sx={{ bgcolor: "#020617", p: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #1e293b" }}>
        <Typography variant="h6" color="white" sx={{ flexGrow: 1 }}>
          {selectedChat.isGroupChat ? selectedChat.name : <OtherUserName participants={selectedChat.participants} />}
        </Typography>
        <IconButton color="primary"><MoreVertIcon /></IconButton>
      </Box>

      <Box sx={{ flex: 1, p: 3, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {selectedChat.messages.map(msg => {
          const isWave = msg.content === "waved at you";
          return (
            <Box
              key={msg._id}
              sx={{
                alignSelf: msg.sender._id.toString() === localStorage.getItem("userId") ? "flex-end" : "flex-start",
                bgcolor: msg.sender._id.toString() === localStorage.getItem("userId") ? "#1e90ff" : "#111e34ff",
                color: "white",
                px: 2.5,
                py: 1.5,
                borderRadius: "18px",
                maxWidth: "70%",
                boxShadow: msg.sender._id.toString() === localStorage.getItem("userId") ? "0 4px 20px rgba(30,144,255,0.4)" : "none",
              }}
            >
              {isWave ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <WavingHandIcon sx={{ fontSize: 28 }} />
                  <Typography>waved at you</Typography>
                </Box>
              ) : (
                <Typography variant="body1">{msg.content}</Typography>
              )}
              <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "0.75rem", display: "block", mt: 0.5 }}>
                {formatTimestamp(msg.createdAt)}
              </Typography>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ p: 2, borderTop: "1px solid #1e293b", bgcolor: "#020617" }}>
        <FilePreview files={attachedFiles} onRemove={removeFile} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton component="label">
            <AttachFileIcon sx={{ color: "gray" }} />
            <input type="file" hidden multiple onChange={e => { if (e.target.files) setAttachedFiles(prev => [...prev, ...Array.from(e.target.files)]); }} />
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
                  <IconButton><EmojiEmotionsIcon sx={{ color: "gray" }} /></IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "30px", bgcolor: "#0f172a", color: "white" },
            }}
          />
          <IconButton color="primary" onClick={handleSendClick} disabled={!message.trim() && attachedFiles.length === 0}><SendIcon /></IconButton>
        </Box>
      </Box>
    </Box>
  );
}

// -------------------- MAIN CHAT APP --------------------
export default function ChatApp() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [openNewChat, setOpenNewChat] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);

  // demo user — change later with auth
  localStorage.setItem("userId", "6924c11062dbde5200745c28");

  const userId = localStorage.getItem("userId");

  // Fetch chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/chat/user/${userId}`);
        setChats(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChats();
  }, []);

  const handleChatSelect = async (chat) => {
    setSelectedChat({ ...chat, messages: [], loading: true });
    try {
      const res = await axios.get(`http://localhost:5000/messages/${chat._id}`);
      setSelectedChat({ ...chat, messages: res.data.data, loading: false });
    } catch (err) {
      console.error(err);
    }
  };

  // Open new chat dialog
 const openNewChatDialog = async () => {
  setOpenNewChat(true);
  setLoadingFollowers(true);
  try {
    const res = await axios.get(`http://localhost:5000/users/followers/${userId}`);
    let followersList = res.data.followers || [];

    // Filter out followers you already have chats with
    followersList = followersList.filter(follower => 
      !chats.some(chat => 
        !chat.isGroupChat && chat.participants.some(p => p._id === follower._id)
      )
    );

    setFollowers(followersList);
  } catch (err) {
    console.error(err);
    setFollowers([]);
  } finally {
    setLoadingFollowers(false);
  }
};


  // Start chat + send wave
  const startChatWith = async (targetUserId) => {
  try {
    // 1. Create/get the chat
    const chatRes = await axios.post(`http://localhost:5000/chat`, {
      participants: [userId, targetUserId]
    });
    const chat = chatRes.data.data;

    // 2. Add chat to sidebar (if not already there)
    setChats(prev => {
      if (prev.some(c => c._id === chat._id)) return prev;
      return [chat, ...prev];
    });

    // 3. Immediately select the chat (with empty messages)
    setSelectedChat({ ...chat, messages: [] });

    // 4. Send the wave
    const msgRes = await axios.post(`http://localhost:5000/messages/${chat._id}`, {
      sender: userId,
      content: "hi bluie"
    });
    const waveMessage = msgRes.data.data;

    // THIS IS THE KEY LINE YOU WERE MISSING
    setSelectedChat(prev => ({
      ...prev,
      messages: [...(prev?.messages || []), waveMessage],
      lastMessage: waveMessage
    }));

    // Optional: update sidebar lastMessage too
    setChats(prev => prev.map(c =>
      c._id === chat._id ? { ...c, lastMessage: waveMessage } : c
    ));
    socket.emit("new_message", waveMessage);
    setOpenNewChat(false);
  } catch (err) {
    console.error("Failed to start chat:", err);
  }
};

  // Socket
  useEffect(() => {
    socket.emit("in_chats_page");

    socket.on("message_update", (msg) => {
      setChats(prev => prev.map(chat => chat._id === msg.chatId ? { ...chat, lastMessage: msg, updatedAt: msg.createdAt } : chat));
      setSelectedChat(prev => prev && prev._id === msg.chatId ? { ...prev, messages: [...prev.messages, msg] } : prev);
    });
    socket.on("new_chat_created", (chat) => {
    setChats(prev => {
        // prevent duplicates just in case
        if (prev.some(c => c._id === chat._id)) return prev;
        return [chat, ...prev];
    });
});

    return () => {
      socket.emit("leave_chats_page");
      socket.off("message_update");
      socket.off("new_chat_created");
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", width: "100vw", maxWidth: "100vw", bgcolor: "#0f172a", overflow: "hidden", position: "fixed", top: 0, left: 0 }}>
        <ChatSidebar chats={chats} selectedChat={selectedChat} handleChatSelect={handleChatSelect} onNewChat={openNewChatDialog} />
        <ChatPanel selectedChat={selectedChat} setSelectedChat={setSelectedChat} chats={chats} setChats={setChats} />

        {/* NEW CHAT DIALOG */}
        <Dialog open={openNewChat} onClose={() => setOpenNewChat(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: "#020617", color: "white" }}>
            New Message
          </DialogTitle>
          <DialogContent sx={{ bgcolor: "#0f172a", p: 0 }}>
            {loadingFollowers ? (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <CircularProgress />
              </Box>
            ) : followers.length === 0 ? (
              <Typography sx={{ p: 4, color: "gray", textAlign: "center" }}>
                No followers yet
              </Typography>
            ) : (
              <List>
                {followers.map((user) => (
                  <ListItemButton key={user._id} onClick={() => startChatWith(user._id)}>
                    <ListItemAvatar>
                      <Avatar src={user.image} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.userName}
                      primaryTypographyProps={{ color: "white" }}
                    />
                  </ListItemButton>
                ))}
              </List>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}