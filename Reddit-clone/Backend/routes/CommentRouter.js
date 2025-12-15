import express from "express";
import {
  addComment,
  addReply,
  getCommentByID,
  editComment,
  deleteComment,
  getCommentsByCategory
} from "../Controllers/CommentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get a specific comment by ID (top-level or reply)
router.get("/:postID/:commId", getCommentByID);

// Add a top-level comment to a post
router.post("/:postID",protect, addComment);

// Add a reply to a specific comment
router.post("/:postID/:commId/reply",protect, addReply);

// Edit a comment or reply
router.patch("/:postID/:commId",protect, editComment);

// Delete a comment or reply
router.delete("/:postID/:commId",protect, deleteComment);

// Get top-level comments by category
router.get("/:postID/category/:category", getCommentsByCategory);

export default router;
