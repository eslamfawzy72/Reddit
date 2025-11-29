import mongoose from "mongoose";
import { commentSchema } from "./Comment.js"; 
const { Schema } = mongoose;

const postSchema = new Schema({
  date: { type: Date, default: Date.now },
  postID: { type: String, required: true, unique: true },
  communityID: { type: Schema.Types.ObjectId, ref: "Community" },
  categories: [{ type: String }],
  userID: { type: Schema.Types.ObjectId, ref: "User" },
  description: { type: String },
  images: [{ type: String }],
  edited: { type: Boolean, default: false },
  upvoteCount: { type: Number, default: 0 },
  downvoteCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  comments: [commentSchema] 
});

export default mongoose.model("Post", postSchema);
