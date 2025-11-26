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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#1e90ff" },
    background: { default: "#0f172a", paper: "#111827" },
  },
  typography: { fontFamily: '"Inter", sans-serif' },
});
const sortChatsByLastMessage = (chats) => {
  return [...chats].sort((a, b) => {
    const timeA = a.lastMessage?.time || "00:00";
    const timeB = b.lastMessage?.time || "00:00";

    const now = new Date();
    const dateA = new Date(`${now.toDateString()} ${timeA}`);
    const dateB = new Date(`${now.toDateString()} ${timeB}`);

    // If same time, prioritize "Now" > "Today" > "Yesterday"
    if (dateA - dateB === 0) {
      const order = { "Now": 3, "Today": 2, "Yesterday": 1 };
      return (order[b.timestamp] || 0) - (order[a.timestamp] || 0);
    }
    return dateA - dateB; // newest first
  });
};
const initialChats = [
  {
    id: 1,
    name: "Alex Chen",
    lastMessage:  { id: 2, senderId: 0, content: "All good here, just cruising", time: "10:32 AM" },
    timestamp: "10:32 AM",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    messages: [
      { id: 1, senderId: 1, content: "Hey! How's it going?", time: "10:30 AM" },
      { id: 2, senderId: 0, content: "All good here, just cruising", time: "10:32 AM" },
    ],
  },
  // ... other chats same as yours
  {
    id: 2,
    name: "Sarah Johnson",
    lastMessage: { id: 4, senderId: 0, content: "Glad it helped", time: "9:17 PM" },
    timestamp: "Yesterday",
    avatarUrl: null,
    messages: [
      { id: 3, senderId: 2, content: "That article was super helpful!", time: "9:15 PM" },
      { id: 4, senderId: 0, content: "Glad it helped", time: "9:17 PM" },
    ],
  },
  {
    id: 3,
    name: "Mike Rivera",
    lastMessage: { id: 6, senderId: 0, content: "Locked and loaded", time: "6:42 PM" },
    timestamp: "Monday",
    avatarUrl: null,
    messages: [
      { id: 5, senderId: 3, content: "Don't forget the slides tomorrow.", time: "6:40 PM" },
      { id: 6, senderId: 0, content: "Locked and loaded", time: "6:42 PM" },
    ],
  },
  {
    id: 4,
    name: "Emma Davis",
    lastMessage: { id: 8, senderId: 0, content: "You're a legend", time: "12:10 PM" },
    timestamp: "12:10 PM",
    avatarUrl: null,
    messages: [
      { id: 7, senderId: 4, content: "I'll start designing the layout now.", time: "12:05 PM" },
      { id: 8, senderId: 0, content: "You're a legend", time: "12:10 PM" },
    ],
  },
  {
    id: 5,
    name: "Tom Wilson",
    lastMessage:  { id: 9, senderId: 5, content: "Do you have the latest version?", time: "11:40 AM" },
    timestamp: "11:45 AM",
    avatarUrl: null,
    messages: [
      { id: 9, senderId: 5, content: "Do you have the latest version?", time: "11:40 AM" },
    ],
  },
];

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

function ChatSidebar({ chats, selectedChat, setSelectedChat }) {
  return (
    <Box sx={{ width: "30%", minWidth: 320, bgcolor: "#020617", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid #1e293b" }}>
        <Typography variant="h6" fontWeight="bold" color="primary">Chats</Typography>
      </Box>

      <List sx={{ flexGrow: 1, overflow: "auto" }}>
        {chats.map((chat) => (
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
                primary={<Typography fontWeight="600">{chat.name}</Typography>}
                secondary={<Typography variant="body2" color="gray" noWrap>{chat.lastMessage.content}</Typography>}
              />
              <Typography variant="caption" color="gray" sx={{ ml: 2 }}>
                {chat.timestamp}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

function ChatPanel({ setSelectedChat,selectedChat, chats, setChats }) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  // ... inside ChatPanel component
const handleSendClick = () => {
    if (!message.trim()) return;

    const newMessage = {
        id: Date.now(),
        senderId: 0,
        content: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    
    let updatedChat = null; // Declare a variable to hold the new chat object

    // IMMUTABLE UPDATE
    setChats(prevChats =>sortChatsByLastMessage(
        prevChats.map(chat => {
            if (chat.id === selectedChat.id) {
                // Create the updated chat object
                updatedChat = { // Assign the new object to updatedChat
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: newMessage,
                    timestamp: "Now",
                };
                return updatedChat; // Return the new object for the chats array
            }
            return chat;
        }))
    );

    // 1. Update selectedChat state with the newly created chat object.
    // We use a guard check for updatedChat in case the selectedChat was somehow null,
    // though in a typical flow it won't be.
    if (updatedChat) {
        setSelectedChat(updatedChat);
    }
    
    // 2. Clear the message input
    setMessage("");
};
// ...

  if (!selectedChat) {
    return (
      <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#0f172a" }}>
        <Typography variant="h5" color="gray">Select a chat to begin</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Box sx={{ bgcolor: "#020617", p: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #1e293b" }}>
        <ChatAvatar name={selectedChat.name} avatarUrl={selectedChat.avatarUrl} />
        <Typography variant="h6" color="white" sx={{ flexGrow: 1 }}>{selectedChat.name}</Typography>
        <IconButton color="primary"><MoreVertIcon /></IconButton>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, p: 3, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, bgcolor: "#0f172a" }}>
        {selectedChat.messages.map((msg) => (
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
            <Typography variant="body1">{msg.content}</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, fontSize: "0.7rem", textAlign: "right", mt: 0.5 }}>
              {msg.time}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ p: 2, bgcolor: "#020617" }}>
        <TextField
          fullWidth
          multiline
          maxRows={5}
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendClick();
            }
          }}
          variant="outlined"
          sx={{
            bgcolor: "#111827",
            borderRadius: 3,
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
            input: { color: "white" },
            textarea: { color: "white" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton color="primary">
                  <AttachFileIcon />
                </IconButton>
                <IconButton color="primary">
                  <EmojiEmotionsIcon />
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendClick}
                  disabled={!message.trim()}
                  sx={{
                    bgcolor: message.trim() ? "#1e90ff" : "transparent",
                    color: "white",
                    "&:hover": { bgcolor: message.trim() ? "#1e80ff" : "#334155" },
                    transition: "all 0.2s",
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}

export default function Chats() {
  const [chats, setChats] = useState(initialChats);
  const [selectedChat, setSelectedChat] = useState(initialChats[0]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
        <ChatSidebar chats={chats} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
        <ChatPanel  setSelectedChat={setSelectedChat}selectedChat={selectedChat} chats={chats} setChats={setChats} />
      </Box>
    </ThemeProvider>
  );
}