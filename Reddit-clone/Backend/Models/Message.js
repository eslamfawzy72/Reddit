import mongoose, { Mongoose } from "mongoose";

const messageSchema = new mongoose.Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String },
  date: { type: Date, default: Date.now },
  image: { type: String },
  chatID: { type: Schema.Types.ObjectId, ref: "Chat", required: true }
});
export default mongoose.Model("Message",messageSchema);
