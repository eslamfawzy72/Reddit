// controllers/MessageController.js
import Message from "../Models/Message.js";
import Chat from "../Models/Chat.js";

/**
 * POST /api/messages
 * Create and save a message
 */
export const sendMessage = async (req, res) => {
  try {
    const { chatId, sender, content } = req.body;

    if (!chatId || !sender || !content)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const message = await Message.create({
      chatId,
      sender,
      content,
      readBy: [sender],
    });

    // Update chat lastMessage
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: message._id,
      updatedAt: new Date(),
    });

    res.status(201).json({ success: true, data: message });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/messages/:chatId
 * Get all messages of a chat
 */
export const getMessagesForChat = async (req, res) => {
  try {
    const chatId = req.params.chatId;

    const messages = await Message.find({ chatId })
      .populate("sender", "userName image")
      .sort({ createdAt: 1 });

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
