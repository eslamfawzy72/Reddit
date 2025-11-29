import Chat from "../Models/Chat.js";

export const createChat = async (req, res) => {
    try {
        const { participants } = req.body;

        if (!participants || participants.length < 2) {
            return res.status(400).json({ success: false, message: "At least 2 participants required." });
        }

        // Check if a chat with exactly the same participants already exists (for non-group chats)
        if (participants.length === 2) {
            const existingChat = await Chat.findOne({
                isGroupChat: false,
                participants: { $all: participants, $size: 2 },
            }).populate("participants", "userName image");

            if (existingChat) {
                return res.json({ success: true, data: existingChat, message: "Chat already exists." });
            }
        }

        // Create a new chat
        const newChat = await Chat.create({ participants, isGroupChat: participants.length > 2, name: req.body.name || null });
        const populatedChat = await Chat.findById(newChat._id).populate("participants", "userName image");

        res.status(201).json({ success: true, data: populatedChat });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};




export const getUserChats = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        const chats = await Chat.find({ participants: userId })
            .populate("participants", "userName image")  // populate user info
            .populate("lastMessage")                    // optional: include last message
            .sort({ updatedAt: -1 })                    // newest chats first
            .lean();

        res.json({ success: true, data: chats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};


export const getChatById = async (req, res) => {
    try {
        const { chatId } = req.params;

        if (!chatId) {
            return res.status(400).json({ success: false, message: "Chat ID is required." });
        }
        const chat = await Chat.findById(chatId)
            .populate("participants", "userName image")
            .populate("lastMessage")
            .lean();
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }
        res.json({ success: true, data: chat });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });


    }

};
export const deleteChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        if (!chatId) {
            return res.status(400).json({ success: false, message: "Chat ID is required." });
        }
        const chat = await Chat.findByIdAndDelete(chatId);
        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }
        res.json({ success: true, message: "Chat deleted successfully." });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}
export const renameGroupChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { name } = req.body;

        if (!chatId || !name) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and new name are required."
            });
        }

        // Find the chat and make sure it's a group
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found."
            });
        }

        if (!chat.isGroupChat) {
            return res.status(400).json({
                success: false,
                message: "This is not a group chat."
            });
        }

        // Update the name
        chat.name = name;
        await chat.save();

        // Populate after update
        const updatedChat = await Chat.findById(chatId)
            .populate("participants", "userName image");

        return res.status(200).json({
            success: true,
            data: updatedChat,
            message: "Group name updated successfully."
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
export const addParticipantsToGroup = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { participants } = req.body;

        if (!chatId || !Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and participants array are required."
            });
        }

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return res.status(404).json({ success: false, message: "Chat not found." });
        }

        if (!chat.isGroupChat) {
            return res.status(400).json({
                success: false,
                message: "Cannot add participants to a non-group chat."
            });
        }

        // Convert all IDs to string to avoid mismatch
        const existing = chat.participants.map(id => id.toString());
        const incoming = participants.map(id => id.toString());

        // Merge & remove duplicates
        const merged = Array.from(new Set([...existing, ...incoming]));

        chat.participants = merged;
        await chat.save();

        const updatedChat = await Chat.findById(chatId)
            .populate("participants", "userName image");

        return res.json({
            success: true,
            data: updatedChat,
            message: "Participants added successfully."
        });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
export const removeParticipantsFromGroup = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { participants } = req.body; // array of userIds

        if (!chatId || !participants || !Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({ success: false, message: "Chat ID and participants are required." });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });
        if (!chat.isGroupChat) return res.status(400).json({ success: false, message: "Cannot remove participants from a non-group chat." });

        // Remove participants
        chat.participants = chat.participants.filter(
            id => !participants.includes(id.toString())
        );

        await chat.save();

        const updatedChat = await Chat.findById(chatId).populate("participants", "userName image");

        return res.status(200).json({ success: true, data: updatedChat, message: "Participants removed successfully." });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};
