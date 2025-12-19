import express from "express";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  notifyComment,
  notifyPostUpvote,
  notifyPostDownvote,
  notifyCommentUpvote,
  notifyFollow,
  resolveNotification
} from "../Controllers/NotificationController.js";
import { sharePost } from "../Controllers/NotificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Get all notifications
router.get("/", protect, getNotifications);
router.get("/:notificationId/resolve", protect, resolveNotification);

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
router.post('/post-downvote',protect,async(req,res)=>{
  const{ postId }=req.body;
  await notifyPostDownvote(req.user._id , postId);
  res.status(200).json({ message: "Post downvote notification sent" })
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

// Share a post with recipients (creates notifications)
router.post("/share", protect, async (req, res) => {
  await sharePost(req, res);
});

export default router;