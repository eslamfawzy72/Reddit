// controllers/ChatController.js
import Chat from "../Models/Chat.js";
import Message from "../Models/Message.js";
import mongoose from "mongoose";

/**
 * GET /api/chats
 * Get all chats
 */
export const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find()
            .populate("participants", "userName image")
            .populate("lastMessage")
            .sort({ updatedAt: -1 })
            .lean();

        res.json({ success: true, data: chats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * GET /api/chats/:chatId
 * Get chat + all its messages
 */
export const getChatWithMessages = async (req, res) => {
    try {
        const chatId = req.params.chatId;

        if (!mongoose.Types.ObjectId.isValid(chatId))
            return res.status(400).json({ success: false, message: "Invalid chatId" });

        const chat = await Chat.findById(chatId)
            .populate("participants", "userName image")
            .populate("lastMessage")
            .lean();

        if (!chat)
            return res.status(404).json({ success: false, message: "Chat not found" });

        const messages = await Message.find({ chatId })
            .populate("sender", "userName image")
            .sort({ createdAt: 1 })
            .lean();

        res.json({ success: true, chat, messages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * POST /api/chats
 * Create a chat (group or private)
 */
export const createChat = async (req, res) => {
    try {
        const { participants, isGroupChat = false, name = null } = req.body;

        if (!participants || participants.length < 2)
            return res.status(400).json({ success: false, message: "At least 2 participants required." });

        // For private chat, check if already exists
        if (!isGroupChat && participants.length === 2) {
            const existingChat = await Chat.findOne({
                isGroupChat: false,
                participants: { $all: participants },
            });

            if (existingChat)
                return res.json({ success: true, data: existingChat });
        }

        const newChat = await Chat.create({
            participants,
            isGroupChat,
            name,
            updatedAt: new Date(),
        });

        res.status(201).json({ success: true, data: newChat });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

/**
 * PATCH /api/chats/:chatId
 * Update chat (rename or update participants)
 */
export const updateChat = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const { name, addParticipants = [], removeParticipants = [] } = req.body;

        const update = {};

        if (name) update.name = name;

        if (addParticipants.length)
            update.$addToSet = { participants: { $each: addParticipants } };

        if (removeParticipants.length)
            update.$pull = { participants: { $in: removeParticipants } };

        const updatedChat = await Chat.findByIdAndUpdate(chatId, update, { new: true });

        if (!updatedChat)
            return res.status(404).json({ success: false, message: "Chat not found" });

        res.json({ success: true, data: updatedChat });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
