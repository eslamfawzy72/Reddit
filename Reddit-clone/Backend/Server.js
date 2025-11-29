import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/UserRouter.js";
import commentRouter from "./routes/CommentRouter.js";
dotenv.config(); // load .env

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

//connection to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// user routes (middleware)
app.use("/users", userRoutes);
// Posts routes(middleware)

// comment routes(middleware)
app.use("/comments", commentRouter);



const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
