import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
  communityID: { type: String, required: true, unique: true },
  users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  commName: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  created_by: { type: Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  rules: [{ type: String }],
  privacystate: { type: String, enum: ["public", "restricted", "private"], default: "public" },
  moderators: [{ type: Schema.Types.ObjectId, ref: "User" }]
});

export default mongoose.model("Community",communitySchema);