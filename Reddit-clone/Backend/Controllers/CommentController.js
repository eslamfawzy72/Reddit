import Post from "../Models/Post.js"
import User from "../Models/User.js"

// Get top comment only by commId without getting the replies
export async function getTopLevelCommentByID(req,res){
    try {
    const postId = req.params.postID;
    const commId = req.params.commId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.find(
      (c) => c._id.toString() === commId
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.json(comment);
}
catch(err){
      res.status(500).json({ err: err.message });
}
}

// bec each comment has replies and each reply has replies and so on
// Finds a comment or reply at ANY depth
function findCommentRecursive(comments, commId) {
  for (const c of comments) {
    if (!c._id) continue;

    // Use ObjectId-safe comparison
    if (c._id.equals(commId)) {
      return c;
    }

    if (c.replies && c.replies.length > 0) {
      const result = findCommentRecursive(c.replies, commId);
      if (result) return result;
    }
  }
  return null;
}



// More generic one bec it returns either top comment or even reply 
export async function getCommentByID(req, res) {
  try {
    const postId = req.params.postID;
    const commId = req.params.commId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Recursive search inside post.comments
    const comment = findCommentRecursive(post.comments, commId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.json(comment);
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}

export async function addComment(req, res) {
  try {
    const postId = req.params.postID;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { text, category } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    // Proper Mongoose subdocument creation
    const newComment = post.comments.create({
      userID: user._id,
      username: user.userName,
      text,
      category: category || "general",
      edited: false,
      upvotedCount: 0,
      downvotedCount: 0,
      replies: []
    });

    post.comments.push(newComment);
    await post.save();

    return res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (err) {
    console.error("Add comment error:", err);
    return res.status(500).json({ err: err.message });
  }
}


// Add a reply to a comment
import mongoose from "mongoose";

export async function addReply(req, res) {
  try {
    const { postID, commId } = req.params;
    const { text, category } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const parentComment = findCommentRecursive(post.comments, commId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newReply = {
      _id: new mongoose.Types.ObjectId(), 
      userID: user._id,
      username: user.userName,
      text,
      category: category || parentComment.category || "general",
      edited: false,
      upvotedCount: 0,
      downvotedCount: 0,
      replies: []
    };

    if (!Array.isArray(parentComment.replies)) {
      parentComment.replies = [];
    }
    parentComment.replies.push(newReply);
    await post.save();
    return res.status(201).json({
      message: "Reply added",
      reply: newReply
    });

  } catch (err) {
    console.error("Add reply error:", err);
    return res.status(500).json({ error: err.message });
  }
}



// Edit a comment or reply
export async function editComment(req, res) {
  try {
    const { text, category } = req.body;
    const postID = req.params.postID;
    const commId = req.params.commId; // can be comment or reply
    const parentCommId = req.params.parentCommId; // only for reply

    if (!text && !category)
      return res.status(400).json({ message: "Nothing to update" });

    // CASE 1: Top-level comment
    if (!parentCommId) {
      const setObj = { "comments.$.edited": true };
      if (text) setObj["comments.$.text"] = text;
      if (category) setObj["comments.$.category"] = category;

      const result = await Post.updateOne(
        { _id: postID, "comments._id": commId },
        { $set: setObj }
      );

      if (result.matchedCount === 0)
        return res.status(404).json({ message: "Comment not found" });

      return res.status(200).json({ message: "Top-level comment updated" });
    }

    // CASE 2: Reply (nested)
    const setReplyObj = { "comments.$[c].replies.$[r].edited": true };
    if (text) setReplyObj["comments.$[c].replies.$[r].text"] = text;
    if (category) setReplyObj["comments.$[c].replies.$[r].category"] = category;

    const result = await Post.updateOne(
      { _id: postID },
      { $set: setReplyObj },
      {
        arrayFilters: [
          { "c._id": parentCommId },
          { "r._id": commId }
        ]
      }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Reply not found" });

    return res.status(200).json({ message: "Reply updated" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}


// Delete a comment or reply
export async function deleteComment(req, res) {
  try {
    const { postID, commId } = req.params;

    // Try top-level comment
    const topLevelDelete = await Post.updateOne(
      { _id: postID },
      { $pull: { comments: { _id: commId } } }
    );

    if (topLevelDelete.modifiedCount > 0)
      return res.status(200).json({ message: "Top-level comment deleted", deletedId: commId });

    // Nested reply one level deep
    const nestedDelete = await Post.updateOne(
      { _id: postID },
      { $pull: { "comments.$[].replies": { _id: commId } } }
    );

    if (nestedDelete.modifiedCount > 0)
      return res.status(200).json({ message: "Nested reply deleted", deletedId: commId });

    // Deep nested reply (replies inside replies)
    const deepDelete = await Post.updateOne(
      { _id: postID },
      { $pull: { "comments.$[].replies.$[].replies": { _id: commId } } }
    );

    if (deepDelete.modifiedCount > 0)
      return res.status(200).json({ message: "Deep nested reply deleted", deletedId: commId });

    return res.status(404).json({ message: "Comment not found" });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}


// Get comments by category (top-level only)
export async function getCommentsByCategory(req, res) {
  try {
    const post = await Post.findById(req.params.postID);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const filteredComments = post.comments.filter(c => c.category === req.params.category);
    return res.status(200).json({ comments: filteredComments });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}