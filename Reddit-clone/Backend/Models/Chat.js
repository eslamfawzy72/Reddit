import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  isGroupChat: { type: Boolean, default: false },
  name: { type: String, default: null },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true, collection: "chats" }); // <-- exact collection name in MongoDB


chatSchema.index({ participants: 1, updatedAt: -1 });
// In Chat model
chatSchema.index(
  { participants: 1, isGroupChat: 1 },
  { unique: false } // we don't enforce uniqueness now
);

const Chat = mongoose.model("Chat", chatSchema); // model name can still be "Chat"
export default Chat;
