
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  ],
  isGroupChat: { type: Boolean, default: false },
  name: { type: String, default: null }, // group name optional
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });


chatSchema.index({ participants: 1, updatedAt: -1 });

chatSchema.index(
  { participants: 1 },
  { unique: false, partialFilterExpression: { isGroupChat: false } }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
