import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
    createdAt: {
    type: Date,
    default: Date.now, 
  },
  description: String,
  image: String,
  interests: [String],
upvotedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  downvotedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  historyPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  followers:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  joinedCommunities:[{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }]
},{ collection: "users" }
);

export default mongoose.model("User", userSchema);
 