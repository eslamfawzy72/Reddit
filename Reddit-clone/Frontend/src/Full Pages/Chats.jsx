import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import {
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme,
  Paper,
  Stack,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CloseIcon from "@mui/icons-material/Close";

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

// -------------------- SOCKET --------------------
const socket = io("http://localhost:5000");

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
function OtherUserName({ participants }) {
  const myId = localStorage.getItem("userId");
  const [name, setName] = React.useState("Loading...");

  useEffect(() => {
    if (!participants || participants.length < 2) {
      setName("Unknown User");
      return;
    }
    const otherUser = participants.find((p) => p._id !== myId);
    setName(otherUser ? otherUser.userName : "Unknown User");
  }, [participants]);

  return <>{name}</>;
}

// -------------------- CHAT SIDEBAR --------------------
function ChatSidebar({ chats, selectedChat, handleChatSelect }) {
  const sortedChats = [...chats].sort((a, b) => {
    const timeA = a.lastMessage?.createdAt
      ? new Date(a.lastMessage.createdAt).getTime()
      : 0;
    const timeB = b.lastMessage?.createdAt
      ? new Date(b.lastMessage.createdAt).getTime()
      : 0;
    return timeB - timeA;
  });

  return (
    <Box className="chat-sidebar">
      <Box className="chat-sidebar-header">
        <Typography variant="h6" fontWeight="bold" color="primary">
          Chats
        </Typography>
      </Box>
      <List className="chat-list">
        {sortedChats.map((chat) => (
          <ListItem key={chat._id} disablePadding>
            <ListItemButton
              selected={selectedChat?._id === chat._id}
              onClick={() => handleChatSelect(chat)}
              className="chat-list-item"
            >
              <ListItemText
                primary={
                  <Typography color="white" fontWeight="600">
                    {chat.isGroupChat ? chat.name : <OtherUserName participants={chat.participants} />}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="gray" noWrap>
                    {chat.lastMessage?.content || "No messages yet"}
                  </Typography>
                }
              />
              <Typography variant="caption" color="gray" className="chat-timestamp">
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
function ChatPanel({ selectedChat, setSelectedChat, chats, setChats }) {
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
        sender: localStorage.getItem("userId"),
        content: message.trim(),
        attachments: attachedFiles.map((file) => ({ url: file.url, type: "file" })),
      };

      const res = await axios.post(
        `http://localhost:5000/messages/${selectedChat._id}`,
        payload
      );
      const realMsg = res.data.data;

      setSelectedChat((prev) => ({ ...prev, messages: [...prev.messages, realMsg] }));
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, lastMessage: realMsg, updatedAt: realMsg.createdAt }
            : chat
        )
      );

      socket.emit("new_message", realMsg);

      setMessage("");
      setAttachedFiles([]);
    } catch (err) {
      console.error("Send message failed:", err);
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
    <Box className="chat-panel">
      <Box className="chat-panel-header">
        <Typography variant="h6" className="chat-panel-title">
          {selectedChat.isGroupChat ? selectedChat.name : <OtherUserName participants={selectedChat.participants} />}
        </Typography>
        <IconButton color="primary">
          <MoreVertIcon />
        </IconButton>
      </Box>

      <Box className="chat-messages">
        {selectedChat.messages.map((msg) => {
          const isFile = msg.type === "file";
          const isImage = isFile && msg.fileType?.startsWith("image/");
          const isVideo = isFile && msg.fileType?.startsWith("video/");

          const isMine = msg.sender._id.toString() === localStorage.getItem("userId");

          return (
            <Box
              key={msg._id}
              className={`chat-message ${isMine ? "mine" : "other"}`}
            >
              <Typography variant="caption" className="msg-sender">
                {msg.sender.userName}
              </Typography>
              {isFile && (isImage || isVideo) ? (
                <Box className="msg-file">
                  {isImage && <img src={URL.createObjectURL(msg.file)} alt={msg.fileName} className="msg-file-img" />}
                  {isVideo && <video src={URL.createObjectURL(msg.file)} controls className="msg-file-img" />}
                </Box>
              ) : isFile ? (
                <Box className="msg-file-placeholder">
                  <InsertDriveFileIcon />
                  <Typography variant="body2">{msg.fileName}</Typography>
                </Box>
              ) : (
                <Typography variant="body1">{msg.content}</Typography>
              )}
              <Typography variant="caption" className="msg-time">
                {formatTimestamp(msg.createdAt)}
              </Typography>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Box className="chat-input">
        <FilePreview files={attachedFiles} onRemove={removeFile} />
        <Box className="chat-input-row">
          <IconButton component="label">
            <AttachFileIcon className="icon-gray" />
            <input
              type="file"
              hidden
              multiple
              onChange={(e) => {
                if (e.target.files)
                  setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
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
                    <EmojiEmotionsIcon className="icon-gray" />
                  </IconButton>
                </InputAdornment>
              ),
              className: "chat-input-field",
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

// -------------------- CHAT APP --------------------
export default function ChatApp() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  localStorage.setItem("userId", "6924c11062dbde5200745c28"); // demo user

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`http://localhost:5000/chat/user/${userId}`);
        setChats(res.data.data);
      } catch (err) {
        console.error("Error fetching chats:", err);
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
      console.error("Error loading messages:", err);
    }
  };

  useEffect(() => {
    socket.emit("in_chats_page");

    socket.on("message_update", (msg) => {
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === msg.chatId
            ? { ...chat, lastMessage: msg, updatedAt: msg.createdAt }
            : chat
        )
      );
      setSelectedChat((prev) =>
        prev && prev._id === msg.chatId
          ? { ...prev, messages: [...prev.messages, msg] }
          : prev
      );
    });

    return () => {
      socket.emit("leave_chats_page");
      socket.off("message_update");
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box className="chat-app-container">
        <ChatSidebar chats={chats} selectedChat={selectedChat} handleChatSelect={handleChatSelect} />
        <ChatPanel selectedChat={selectedChat} setSelectedChat={setSelectedChat} chats={chats} setChats={setChats} />
      </Box>
    </ThemeProvider>
  );
}
