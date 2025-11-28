// routes/ChatRouter.js
import express from "express";
import {
  getAllChats,
  getChatWithMessages,
  createChat,
  updateChat
} from "../Controllers/ChatController.js";

const router = express.Router();

// GET all chats
router.get("/", getAllChats);

// GET chat + messages
router.get("/:chatId", getChatWithMessages);

// Create Chat
router.post("/", createChat);

// Update chat
router.patch("/:chatId", updateChat);

export default router; // ✅ default export
