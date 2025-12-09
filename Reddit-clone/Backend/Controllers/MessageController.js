import Message from "../Models/Message.js";
import Chat from "../Models/Chat.js";
export const createMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { sender, content, attachments } = req.body;

        if (!chatId || !sender || (!content && (!attachments || attachments.length === 0))) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        // 1️⃣ Create the message
        let message = await Message.create({
            chatId,
            sender,
            content: content || "",
            attachments: attachments || []
        });

        // 2️⃣ Populate sender before returning
        message = await message.populate("sender", "userName image");

        // 3️⃣ UPDATE LAST MESSAGE IN CHAT
        await Chat.findByIdAndUpdate(
            chatId,
            {
                lastMessage: message._id,  // set new last message
                updatedAt: Date.now()      // update timestamp
            }
        );

        // 4️⃣ Return the created message
        res.status(201).json({ success: true, data: message });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};




/**
 * Get all messages for a specific chat
 */
export const getMessagesByChat = async (req, res) => {
    try {
        const { chatId } = req.params;

        // Populate sender info and sort by creation time
        const messages = await Message.find({ chatId })
            .populate("sender", "userName image")  // show sender's name and avatar
            .sort({ createdAt: 1 })               // oldest messages first
            .lean();

        res.json({ success: true, data: messages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};