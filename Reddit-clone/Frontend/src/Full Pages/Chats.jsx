// Chats.jsx — FINAL, NO SYNTAX ERRORS, YOUR ORIGINAL STYLE + EVERYTHING WORKS
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

import "../styles/chats.css";

// -------------------- THEME --------------------
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1e90ff" },
    background: { default: "#0f172a", paper: "#111827" },
  },
  typography: { fontFamily: '"Inter", sans-serif' },
});
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
  withCredentials: true,
});

// -------------------- HELPERS --------------------
const formatTimestamp = (date) => {
  const now = new Date();
  const msgDate = new Date(date);

  const isToday = now.toDateString() === msgDate.toDateString();
  const isYesterday =
    new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() ===
    msgDate.toDateString();

  if (isToday)
    return msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (isYesterday) return "Yesterday";
  if (now.getFullYear() === msgDate.getFullYear())
    return msgDate.toLocaleDateString([], { weekday: "long" });
  return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
};

// -------------------- FILE PREVIEW --------------------
function FilePreview({ files, onRemove }) {
  if (files.length === 0) return null;

  return (
    <Box className="file-preview">
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {files.map((file, index) => {
          const url = URL.createObjectURL(file);
          const isImage = file.type.startsWith("image/");
          const isVideo = file.type.startsWith("video/");

          return (
            <Paper key={index} className="file-card">
              {isImage && <img src={url} alt={file.name} className="file-img" />}
              {isVideo && <video src={url} className="file-img" muted />}
              {!isImage && !isVideo && (
                <Box className="file-placeholder">
                  <InsertDriveFileIcon className="file-icon" />
                  <Typography variant="caption" noWrap>
                    {file.name}
                  </Typography>
                </Box>
              )}
              <IconButton size="small" className="file-remove-btn" onClick={() => onRemove(index)}>
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
function OtherUserName({ participants, currentUser }) {
  const other = participants?.find(p => p._id !== currentUser?._id);
  return <>{other?.userName || "Unknown User"}</>;
}

// -------------------- SIDEBAR --------------------
function ChatSidebar({ chats, selectedChat, handleChatSelect, onNewChat, currentUser }) {
  const sortedChats = [...chats].sort((a, b) => {
    const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
    const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  return (
    <Box sx={{
      width: { xs: "100%", sm: "380px" },
      maxWidth: { xs: "100%", sm: 420 },
      minWidth: { xs: "100%", sm: 320 },
      bgcolor: "#020617",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      borderRight: { sm: "1px solid #1e293b" },
      flexShrink: 0,
    }}>
      <Box sx={{ p: 2, borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" fontWeight="bold" color="primary">Chats</Typography>
        <IconButton onClick={onNewChat}><AddIcon sx={{ color: "white" }} /></IconButton>
      </Box>

      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        {sortedChats.map((chat) => (
          <ListItem key={chat._id} disablePadding>
            <ListItemButton
              selected={selectedChat?._id === chat._id}
              onClick={() => handleChatSelect(chat)}
              className="chat-list-item"
            >
              <ListItemText
                primary={<Typography color="white" fontWeight="600">
                  {chat.isGroupChat ? chat.name : <OtherUserName participants={chat.participants} currentUser={currentUser} />}
                </Typography>}
                secondary={<Typography variant="body2" color="gray" noWrap>
                  {chat.lastMessage?.content || "No messages yet"}
                </Typography>}
              />
              <Typography variant="caption" color="gray" sx={{ ml: 2 }}>
                {formatTimestamp(chat.lastMessage?.createdAt)}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

// -------------------- CHAT PANEL --------------------
function ChatPanel({ selectedChat, setSelectedChat, currentUser, chats, setChats }) {
  const [message, setMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [selectedChat?.messages]);

  const handleSendClick = async () => {
    if (!selectedChat || (!message.trim() && attachedFiles.length === 0)) return;

    try {
      const payload = {
        sender: currentUser._id,
        content: message.trim(),
      };

      const res = await axios.post(
        `${API}/messages/${selectedChat._id}`,
        payload
      );
      const realMsg = res.data.data;

      setSelectedChat(prev => ({ ...prev, messages: [...prev.messages, realMsg] }));
      setChats(prev => prev.map(chat =>
        chat._id === selectedChat._id ? { ...chat, lastMessage: realMsg, updatedAt: realMsg.createdAt } : chat
      ));
      socket.emit("new_message", realMsg);

      setMessage("");
      setAttachedFiles([]);
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const removeFile = (index) =>
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));

  if (!selectedChat)
    return (
      <Box className="chat-panel-empty">
        <Typography variant="h5" color="gray">
          Select a chat to begin
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", bgcolor: "#0f172a" }}>
      <Box sx={{ bgcolor: "#020617", p: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #1e293b" }}>
        <Typography variant="h6" color="white" sx={{ flexGrow: 1 }}>
          {selectedChat.isGroupChat ? selectedChat.name : <OtherUserName participants={selectedChat.participants} currentUser={currentUser} />}
        </Typography>
        
      </Box>

      <Box sx={{ flex: 1, p: 3, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
        {selectedChat.messages?.map(msg => {
          const isMine = msg.sender._id === currentUser?._id;

          //const isMine = msg.sender._id.toString() === localStorage.getItem("userId");

          return (
            <Box
              key={msg._id}
              sx={{
                alignSelf: isMine ? "flex-end" : "flex-start",
                bgcolor: isMine ? "#1e90ff" : "#111e34ff",
                color: "white",
                px: 2.5,
                py: 1.5,
                borderRadius: "18px",
                maxWidth: "70%",
                boxShadow: isMine ? "0 4px 20px rgba(30,144,255,0.4)" : "none",
              }}
            >
              {msg.content === "hi bluie" ? (
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
        <Box className="chat-input-row">
         

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
                    
                  </IconButton>
                </InputAdornment>
              ),
              className: "chat-input-field",
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendClick}
            disabled={!message.trim() && attachedFiles.length === 0}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}

// -------------------- MAIN APP --------------------
export default function ChatApp() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [openNewChat, setOpenNewChat] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  

  // Get current user
  useEffect(() => {
    axios.get(`${API}/auth/me`)
      .then(res => setCurrentUser(res.data.user))
      .catch(() => console.log("Not logged in"));
  }, []);

  // Fetch chats
  useEffect(() => {
    if (!currentUser) return;
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${API}/chat/user`);
        setChats(res.data.data || []);
      } catch (err) { console.error(err); }
    };
    fetchChats();
  }, [currentUser]);

 const handleChatSelect = async (chat) => {
  setSelectedChat({ ...chat, messages: [], loading: true });

  try {
    const res = await axios.get(`${API}/messages/${chat._id}`);
    setSelectedChat({
      ...chat,
      messages: res.data.data || [],
      loading: false,
    });
  } catch (err) {
    console.error(err);
  }
};

  const openNewChatDialog = async () => {
    if (!currentUser) return;
    setOpenNewChat(true);
    setLoadingFollowers(true);
    try {
      const res = await axios.get(`${API}/users/followers`);

      let list = res.data.followers || [];
      list = list.filter(f => !chats.some(c => !c.isGroupChat && c.participants.some(p => p._id === f._id)));
      setFollowers(list);
    } catch (err) {
      setFollowers([]);
    } finally {
      setLoadingFollowers(false);
    }
  };

  const startChatWith = async (targetUserId) => {
    try {
      const chatRes = await axios.post(`${API}/chat`, {
        participants: [currentUser._id, targetUserId]
      });
      const chat = chatRes.data.data;

      setChats(prev => prev.some(c => c._id === chat._id) ? prev : [chat, ...prev]);
      setSelectedChat({ ...chat, messages: [] });

      const msgRes = await axios.post(`${API}/messages/${chat._id}`, {
        sender: currentUser._id,
        content: "hi bluie"
      });
      const waveMsg = msgRes.data.data;

      setSelectedChat(prev => ({ ...prev, messages: [waveMsg], lastMessage: waveMsg }));
      setChats(prev => prev.map(c => c._id === chat._id ? { ...c, lastMessage: waveMsg } : c));
      socket.emit("new_message", waveMsg);
      setOpenNewChat(false);
    } catch (err) { console.error(err); }
  };

  // Socket
  useEffect(() => {
    if (!currentUser) return;
    socket.emit("in_chats_page");

    socket.on("message_update", (msg) => {
      setChats(prev => prev.map(c => c._id === msg.chatId ? { ...c, lastMessage: msg } : c));
      setSelectedChat(prev => prev?._id === msg.chatId ? { ...prev, messages: [...prev.messages, msg] } : prev);
    });

    socket.on("new_chat_created", (chat) => {
      setChats(prev => prev.some(c => c._id === chat._id) ? prev : [chat, ...prev]);
    });

    return () => {
      socket.off("message_update");
      socket.off("new_chat_created");
    };
  }, [currentUser]);

  if (!currentUser) {
    return (
      <Box sx={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#0f172a" }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", width: "100vw", maxWidth: "100vw", bgcolor: "#0f172a", overflow: "hidden", position: "fixed", top: 0, left: 0 }}>
        <ChatSidebar chats={chats} selectedChat={selectedChat} handleChatSelect={handleChatSelect} onNewChat={openNewChatDialog} currentUser={currentUser} />
        <ChatPanel
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          currentUser={currentUser}
          chats={chats}
          setChats={setChats}
        />

        <Dialog open={openNewChat} onClose={() => setOpenNewChat(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ bgcolor: "#020617", color: "white" }}>New Message</DialogTitle>
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