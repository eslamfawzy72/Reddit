import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";                // 🔥 add this
import { Server } from "socket.io";    // 🔥 add this

import userRoutes from "./routes/UserRouter.js";
import commentRouter from "./routes/CommentRouter.js";
import PostRouter from "./routes/PostRouter.js";
import chatRoutes from "./routes/ChatRouter.js";
import messageRoutes from "./routes/MessageRouter.js";
import communityRouter from "./routes/CommunityRouter.js";
import authRouter from "./routes/authRouter.js";
import NotificationRouter from "./routes/NotificationRouter.js";


dotenv.config(); // load .env

const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5175","http://localhost:5174"],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// ---------------- SOCKET.IO SETUP ----------------
const server = http.createServer(app); // wrap express app
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174","http://localhost:5175"],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io accessible in controllers
app.set("io", io);

// Track sockets on chat page
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // When user opens chat page
  socket.on("in_chats_page", () => {
    socket.join("chats_page");
    console.log(`Socket ${socket.id} joined chats_page`);
  });

  // When user leaves chat page
  socket.on("leave_chats_page", () => {
    socket.leave("chats_page");
    console.log(`Socket ${socket.id} left chats_page`);
  });

  // When a new message is sent
  socket.on("new_message", (msg) => {
    // Emit to everyone on chat page except sender
    socket.to("chats_page").emit("message_update", msg);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes 

app.use("/auth", authRouter);
app.use("/users", userRoutes);
app.use("/posts", PostRouter);
app.use("/chat", chatRoutes);
app.use("/messages", messageRoutes);
app.use("/communities", communityRouter);
app.use("/notifications", NotificationRouter);
//notifications router
// comment routes(middleware)
app.use("/comments", commentRouter);

// ---------------- START SERVER ----------------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {    // 🔥 use server.listen instead of app.listen
  console.log(`Server running on http://localhost:${PORT}`);
});
