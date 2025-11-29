import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRouter.js";
<<<<<<< HEAD
import chatRoutes from "./routes/ChatRouter.js";
import messageRoutes from "./routes/MessageRouter.js";
dotenv.config();
=======
import PostRouter from "./routes/PostRouter.js";
dotenv.config(); // load .env
>>>>>>> 0af11d224ab482e43347755a08bf83d9f748f54c

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

<<<<<<< HEAD
// Routes without /api prefix
app.use("/users", userRoutes);       // User routes
app.use("/chat", chatRoutes);       // Chat routes
app.use("/messages", messageRoutes); // Message routes

=======
// user routes (middleware)
app.use("/users", userRoutes);
// Posts routes(middleware)
app.use("/posts", PostRouter);
>>>>>>> 0af11d224ab482e43347755a08bf83d9f748f54c


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
