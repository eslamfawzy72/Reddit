import mongoose from "mongoose";
const communitySchema = new mongoose.Schema(
  {
    commName: { type: String, required: true },
    description: String,
    image: String,
    category: String,
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    created_at: { type: Date, default: Date.now },
    rules: [String],
    privacystate: { type: String, enum: ["public", "private"], default: "public" },
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
   //force Mongoose to use your collection
);

export default mongoose.model("Community", communitySchema);


