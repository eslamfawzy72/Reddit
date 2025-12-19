import mongoose from "mongoose";
const { Schema } = mongoose;

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // recipient
  actorId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // who triggered it
  // Added 'post_share' so share notifications validate correctly
  type: { type: String, enum: ["post_comment","comment_reply", "post_upvote","post_downvote","comment_upvote", "follow","post_share"], required: true },
  targetType: { type: String, enum: ["post", "comment","user"], required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  subreddit: { type: String, default: null }, // optional, for community context
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", notificationSchema);