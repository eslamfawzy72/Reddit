import User from "../Models/User.js";
import Notification from "../Models/Notification.js";
import Post from "../Models/Post.js";
import Comment from "../Models/Comment.js";
import Community from "../Models/Community.js";




export const notifyComment = async (actorId, postID) => {
  try{
  const post = await Post.findById(postID).lean();
  if (!post) return;

    // don't notify yourself
   if (post.userID.toString() === actorId.toString()) return;

     const notification = new Notification({
      userId: post.userID,   
      actorId,
      type: "post_comment",
      targetType: "post",
      targetId: postID,
    });

    await notification.save();
  }
  catch(err){
    throw err;
  }
};

export const notifyReply  = async (actorId, comment) => {
try{
   // don't notify yourself
   if (comment.userID.toString() === actorId.toString()) return;

      const notification = new Notification({
      userId: comment.userID,   // comment owner (receiver)
      actorId,                  // who replied
      type: "comment_reply",
      targetType: "comment",
      targetId: comment._id,
    });

    await notification.save();

}
catch(err){
  throw err;
}

}

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
            .populate("communityID", "commName members privacestate")
            .lean();

          communityName = post?.communityID?.commName || null;
          postPreview = post?.description?.slice(0, 100) || null;

          // include communityId and postId for frontend navigation
          return {
            ...n,
            communityName,
            communityId: post?.communityID?._id || null,
            postPreview,
            postId: n.targetId,
          };
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
const createNotification = async ({
  userId,
  actorId,
  type,
  targetType,
  targetId,
  subreddit = null,
}) => {
  if (!userId || !actorId || !type) return;

  await Notification.create({
    userId,
    actorId,
    type,
    targetType,
    targetId,
    subreddit,
    isRead: false,
  });
};

// Share a post with specific recipients (permissions checked per recipient)
export const sharePost = async (req, res) => {
  try {
    const actorId = req.user._id;
    const { postId, recipients } = req.body;
    if (!postId || !Array.isArray(recipients)) {
      return res.status(400).json({ message: 'postId and recipients[] required' });
    }

    const post = await Post.findById(postId).populate('communityID').lean();
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const community = post.communityID || null;

    let created = 0;
    for (const recipientId of recipients) {
      // don't notify yourself
      if (recipientId.toString() === actorId.toString()) continue;

      // permission: if post has community, recipient must be member or community public
      if (community) {
        if (community.privacestate === 'private') {
          // check membership
          const isMember = community.members.map(m => m.toString()).includes(recipientId.toString());
          if (!isMember) continue; // skip creating notification for this recipient
        }
      }

      await createNotification({
        userId: recipientId,
        actorId,
        type: 'post_share',
        targetType: 'post',
        targetId: postId,
        subreddit: community ? community.commName || null : null
      });
      created += 1;
    }

    res.status(200).json({ message: `Notifications created: ${created}`, created });
  } catch (error) {
    console.error('sharePost error', error);
    res.status(500).json({ message: 'Server error' });
  }
};
