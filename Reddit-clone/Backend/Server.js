import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/UserRouter.js";
import commentRouter from "./routes/CommentRouter.js";
import PostRouter from "./routes/PostRouter.js";
import chatRoutes from "./routes/ChatRouter.js";
import messageRoutes from "./routes/MessageRouter.js";
import communityRouter from "./routes/CommunityRouter.js";
import authRouter from "./routes/authRouter.js"





dotenv.config(); // load .env

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  credentials: true,               // allow cookies
}));app.use(cookieParser());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes 
//auth router (middleware)
app.use("/auth",authRouter)
// user routes (middleware)
app.use("/users", userRoutes);
// Posts routes(middleware)
app.use("/posts", PostRouter);
app.use("/chat", chatRoutes);       // Chat routes
app.use("/messages", messageRoutes); // Message routes
app.use("/Communities", communityRouter);
//notifications router


// comment routes(middleware)
app.use("/comments", commentRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
