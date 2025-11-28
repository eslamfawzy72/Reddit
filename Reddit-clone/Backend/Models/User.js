import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  createdAt: Date,
  description: String,
  image: String,
  interests: [String],
  upvotedPosts: [String],
  downvotedPosts: [String],
  historyPosts: [String],
  followers:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  joinedCommunities:[{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }]
},{ collection: "users" }
);

export default mongoose.model("User", userSchema);
