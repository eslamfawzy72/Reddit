import mongoose from "mongoose";
const { Schema } = mongoose;

// Recursive comment schema
const commentSchema = new Schema({
  commentID: { type: String, required: true, unique: true },
  userID: { type: Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  description: { type: String, required: true },
  edited: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  replys: [] 
});

// Make replies recursive
commentSchema.add({ replys: [commentSchema] });

export default mongoose.model("Comment", commentSchema);
export { commentSchema };
