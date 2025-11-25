import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  chatID: { type: String, required: true, unique: true },
  userIDs: [{ type: Schema.Types.ObjectId, ref: "User" }],
  media: [{ type: String }]
});

export default mongoose.model("Chat",chatSchema)