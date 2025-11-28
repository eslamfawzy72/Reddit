
import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, default: "file" } // image, file, etc.
}, { _id: false });

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, default: "" },
  attachments: { type: [attachmentSchema], default: [] },
  readBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

messageSchema.index({ chatId: 1, createdAt: 1 });

messageSchema.index({ chatId: 1, readBy: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
