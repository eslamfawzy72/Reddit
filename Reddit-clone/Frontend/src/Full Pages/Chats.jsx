import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

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


const getUserNameById = async (id) => {
  try {
    const res = await axios.get(`http://localhost:5000/users/${id}`);
    return res.data?.user?.userName || res.data?.data?.userName || "Unknown User";
  } catch (err) {
    console.error("Failed to fetch username:", err);
    return "Unknown User";
  }
};

function OtherUserName({ participants }) {
  const myId = localStorage.getItem("userId");
  const [name, setName] = React.useState("Loading...");

  useEffect(() => {
    if (!participants || participants.length < 2) {
      setName("Unknown User");
      return;
    }

    // participants are FULL USER OBJECTS from populate()
    const otherUser = participants.find(p => p._id !== myId);

    if (otherUser) {
      setName(otherUser.userName);
    } else {
      setName("Unknown User");
    }
  }, [participants]);

  return <>{name}</>;
}




function ChatSidebar({ chats, selectedChat, handleChatSelect }) {

  const sortedChats = [...chats].sort((a, b) => {
  const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
  const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;

  return timeB - timeA; // recent first
});

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

        </Box>
        <List sx={{ flexGrow: 1, overflow: "auto" }}>
          {sortedChats.map((chat) => {

            // 🔥 ADD THESE DEBUG LOGS RIGHT HERE 🔥
            console.log("Chat Participants:", chat.participants);
            console.log("My ID:", localStorage.getItem("userId"));

            return (
              <ListItem key={chat._id} disablePadding>
                <ListItemButton
                  selected={selectedChat?._id === chat._id}
                 onClick={() => handleChatSelect(chat)}
                  sx={{
                    py: 2,
                    borderBottom: "1px solid #1e293b",
                    "&.Mui-selected": { bgcolor: "#0f172a" },
                  }}
                >

                  <ListItemText
                    primary={
                      <Typography color="white" fontWeight="600">
                        {chat.isGroupChat ? (
                          chat.name
                        ) : (
                          <OtherUserName participants={chat.participants} />
                        )}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="gray" noWrap>
                        {chat.lastMessage?.content || "No messages yet"}
                      </Typography>
                    }
                  />

                  <Typography variant="caption" color="gray" sx={{ ml: 2 }}>
                    {formatTimestamp(chat.lastMessage?.createdAt)}
                  </Typography>

                </ListItemButton>
              </ListItem>
            );
          })}
        </List>


      </Box>

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

 const handleSendClick = async () => {
  if (!selectedChat || (!message.trim() && attachedFiles.length === 0)) return;

  try {
    const payload = {
      sender: localStorage.getItem("userId"),
      content: message.trim(),
      attachments: attachedFiles.map((file) => ({
        url: file.url,
        type: "file"
      }))
    };

    // WAIT FOR THE RESPONSE
    const res = await axios.post(
      `http://localhost:5000/messages/${selectedChat._id}`,
      payload
    );

    const realMsg = res.data.data; // populated message from backend

    // Update chat messages
    setSelectedChat((prev) => ({
      ...prev,
      messages: [...prev.messages, realMsg],
    }));

    // Update chat list (sidebar)
    setChats((prev) =>
      prev.map((chat) =>
        chat._id === selectedChat._id
          ? {
              ...chat,
              lastMessage: realMsg,
              updatedAt: realMsg.createdAt,
            }
          : chat
      )
    );

    setMessage("");
    setAttachedFiles([]);

  } catch (err) {
    console.error("Send message failed:", err);
  }
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

        <Typography variant="h6" color="white" sx={{ flexGrow: 1 }}>
          {selectedChat.isGroupChat
            ? selectedChat.name
            : <OtherUserName participants={selectedChat.participants} />
          }
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
              <Typography variant="caption" sx={{ opacity: 0.6, fontSize: "0.75rem", display: "block", mt: 0.5 }}>
                {msg.sender.userName}
              </Typography>
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
                {formatTimestamp(msg.createdAt)}
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


export default function ChatApp(props) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  localStorage.setItem("userId", "6924c11062dbde5200745c28");
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
  const chatIdToFetch =chat._id; // use chatId if exists

  setSelectedChat({ ...chat, messages: [], loading: true });

  try {
    const res = await axios.get(`http://localhost:5000/messages/${chatIdToFetch}`);
    setSelectedChat({ ...chat, messages: res.data.data, loading: false });
  } catch (err) {
    console.error("Error loading messages:", err);
  }
};


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
        <ChatSidebar chats={chats}
          selectedChat={selectedChat}
          handleChatSelect={handleChatSelect}
        />

        <ChatPanel selectedChat={selectedChat} setSelectedChat={setSelectedChat} chats={chats} setChats={setChats} />
      </Box>
    </ThemeProvider>
  );
}