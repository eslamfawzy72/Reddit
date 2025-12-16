import mongoose from "mongoose";
const { Schema } = mongoose;

const commentSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },

  text: { type: String, required: true },
  edited: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },

  upvotedCount: { type: Number, default: 0 },
  downvotedCount: { type: Number, default: 0 },
  replies: []      
});

// Add recursive replies (nested comments)
commentSchema.add({ replies: [commentSchema] });

export default mongoose.model("Comment", commentSchema);
export { commentSchema };
