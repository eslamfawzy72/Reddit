import express from "express";
import { createMessage, getMessagesByChat } from "../Controllers/MessageController.js";

const router = express.Router();

router.post("/:chatId", createMessage);          // Send a message
router.get("/:chatId", getMessagesByChat); // Get all messages for a chat

export default router;
