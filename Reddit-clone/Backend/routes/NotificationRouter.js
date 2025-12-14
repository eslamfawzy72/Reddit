import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  notifyComment,
  notifyPostUpvote,
  notifyCommentUpvote,
  notifyFollow
} from "../Controllers/NotificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all notifications
router.get("/", protect, getNotifications);

// ✅ Get unread count
router.get("/unread-count", protect, getUnreadCount);

// ✅ Mark a single notification as read
router.patch("/:notificationId/read", protect, markAsRead);

// ✅ Trigger notifications (used internally by your app)
router.post("/comment", protect, async (req, res) => {
  const { postId } = req.body;
  await notifyComment(req.user._id, postId);
  res.status(200).json({ message: "Comment notification sent" });
});

router.post("/post-upvote", protect, async (req, res) => {
  const { postId } = req.body;
  await notifyPostUpvote(req.user._id, postId);
  res.status(200).json({ message: "Post upvote notification sent" });
});

router.post("/comment-upvote", protect, async (req, res) => {
  const { commentId } = req.body;
  await notifyCommentUpvote(req.user._id, commentId);
  res.status(200).json({ message: "Comment upvote notification sent" });
});

router.post("/follow", protect, async (req, res) => {
  const { targetUserId } = req.body;
  await notifyFollow(req.user._id, targetUserId);
  res.status(200).json({ message: "Follow notification sent" });
});

export default router;