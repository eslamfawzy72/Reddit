import User from "../Models/User.js";
import Notification from "../Models/Notification.js";
import Post from "../Models/Post.js";
import Comment from "../Models/Comment.js";
import Community from "../Models/Community.js";



// Create notification when user comments on a post
export const notifyComment = async (actorId, postID) => {
  const post = await Post.findById(postID).lean();
  if (!post) return;

  await createNotification({
    userId: post.userID,
    actorId,
    type: "post_comment",
    targetType: "post",
    targetId: postID,

  });
};

// Create notification when user upvotes a post
export const notifyPostUpvote = async (actorId, postId) => {
  const post = await Post.findById(postId).lean();
  if (!post) return;

  await createNotification({
    userId: post.userID,
    actorId,
    type: "post_upvote",
    targetType: "post",
    targetId: postId,
  });
};

// ✅ Create notification when user upvotes a comment
export const notifyCommentUpvote = async (actorId, commentId) => {
  const comment = await Comment.findById(commentId).lean();
  if (!comment) return;

  await createNotification({
    userId: comment.userID,
    actorId,
    type: "comment_upvote",
    targetType: "comment",
    targetId: commentId
  });
};

//  Create notification when user follows another user
export const notifyFollow = async (actorId, followedUserId) => {
  await createNotification({
    userId: followedUserId,
    actorId,
    type: "follow",
    targetType: "user",
    targetId: followedUserId
  });
};

//  Existing: Get notifications
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = "all", page = 1, limit = 20 } = req.query;

    const query = { userId };

    if (type !== "all") {
      if (type === "messages") {
        query.type = "message";
      } else if (type === "comments") {
        query.type = { $in: ["comment_reply", "post_comment"] };
      } else if (type === "upvotes") {
        query.type = { $in: ["post_upvote", "comment_upvote"] };
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("actorId", "userName image")
      .lean();

    const enriched = await Promise.all(
      notifications.map(async (n) => {
        let communityName = null;
        let postPreview = null;

        if (n.targetType === "post") {
          const post = await Post.findById(n.targetId)
            .populate("communityID", "name")
            .lean();

          communityName = post?.communityID?.name || null;
          postPreview = post?.description?.slice(0, 100) || null;
        }

        if (n.targetType === "comment") {
          const comment = await Comment.findById(n.targetId).lean();
          postPreview = comment?.description?.slice(0, 100) || null;
        }

        return {
          ...n,
          communityName,
          postPreview
        };
      })
    );

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json({
      notifications: enriched,
      unreadCount,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalNotifications: total,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Existing: Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const unread = await Notification.countDocuments({ userId, isRead: false });
    res.status(200).json({ unreadCount: unread });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Existing: Mark as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json({ message: "Marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};