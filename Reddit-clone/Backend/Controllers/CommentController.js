import Post from "../Models/Post.js"

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
function findCommentRecursive(comments, commId) {
  for (const c of comments) {
    if (c._id.toString() === commId) {
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
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

     const { userID, username, description, category } = req.body;
    if (!userID || !username || !description) {
      return res.status(400).json({ message: "userID, username, and description are required" });
    }

    const newComment = {
      userID,
      username,
      description,
      category: category || "general", 
      edited: false,
      upvotedCount: 0,
      downvotedCount: 0,
      replies: []
    };

    post.comments.push(newComment);
    await post.save();

    return res.status(201).json({ message: "Comment added", comment: newComment });

  } catch (err) {
    return res.status(500).json({ err: err.message });
  }

 }


 export async function addReply(req, res) {
  try {
    const postId = req.params.postID;
    const parentCommId = req.params.commId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const parentComment = findCommentRecursive(post.comments, parentCommId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const { userID, username, description, category } = req.body;
    if (!userID || !username || !description) {
      return res.status(400).json({ message: "userID, username, and description are required" });
    }

    const newReply = {
      userID,
      username,
      description,
      category: category || parentComment.category || "general", 
      edited: false,
      upvotedCount: 0,
      downvotedCount: 0,
      replies: []
    };

    parentComment.replies.push(newReply);
    await post.save();

    return res.status(201).json({ message: "Reply added", reply: newReply });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}

// Edit comment or reply
// export async function editComment(req, res) {
//   try {
//     const post = await Post.findById(req.params.postID);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const comment = findCommentRecursive(post.comments, req.params.commId);
//     if (!comment) return res.status(404).json({ message: "Comment not found" });

//     const { description, category } = req.body;
//     if (description) comment.description = description;
//     if (category) comment.category = category;
//     comment.edited = true;

//     await post.save();
//     return res.status(200).json({ message: "Comment updated", comment });
//   } catch (err) {
//     return res.status(500).json({ err: err.message });
//   }
// }

export async function editComment(req, res) {
  try {
    const { description, category } = req.body;
    const postID = req.params.postID;
    const commId = req.params.commId;            // can be comment or reply
    const parentCommId = req.params.parentCommId; // used only for replies

    if (!description && !category) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // Data to update
    const updateData = {};
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    // ----------------------------------------
    // CASE 1: Top-level comment update
    // ----------------------------------------
    if (!parentCommId) {
      const setObj = {
        "comments.$.edited": true
      };

      if (description) setObj["comments.$.description"] = description;
      if (category) setObj["comments.$.category"] = category;

      const result = await Post.updateOne(
        { _id: postID, "comments._id": commId },
        { $set: setObj }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Comment not found" });
      }

      return res.status(200).json({ message: "Top-level comment updated" });
    }

    // ----------------------------------------
    // CASE 2: Reply update (nested)
    // ----------------------------------------
    const setReplyObj = {
      "comments.$[c].replies.$[r].edited": true
    };

    if (description)
      setReplyObj["comments.$[c].replies.$[r].description"] = description;

    if (category)
      setReplyObj["comments.$[c].replies.$[r].category"] = category;

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

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Reply not found" });
    }

    return res.status(200).json({ message: "Reply updated" });

  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
}



// Delete comment or reply
// export async function deleteComment(req, res) {
//   try {
//     const post = await Post.findById(req.params.postID);
//     if (!post) return res.status(404).json({ message: "Post not found" });

//     const deleteRecursive = (comments, commId) => {
//       for (let i = 0; i < comments.length; i++) {
//         if (comments[i]._id.toString() === commId) {
//           comments.splice(i, 1);
//           return true;
//         }
//         if (comments[i].replies && comments[i].replies.length > 0) {
//           if (deleteRecursive(comments[i].replies, commId)) return true;
//         }
//       }
//       return false;
//     };

//     const deleted = deleteRecursive(post.comments, req.params.commId);
//     if (!deleted) return res.status(404).json({ message: "Comment not found" });

//     await post.save();
//     return res.status(200).json({ message: "Comment deleted" });
//   } catch (err) {
//     return res.status(500).json({ err: err.message });
//   }
// }

export async function deleteComment(req, res) {
  try {
    const { postID, commId } = req.params;

    // First try: delete as a top-level comment
    const topLevelDelete = await Post.updateOne(
      { _id: postID },
      { $pull: { comments: { _id: commId } } }
    );

    if (topLevelDelete.modifiedCount > 0) {
      return res.status(200).json({ message: "Top-level comment deleted" });
    }

    // Second try: delete from ANY nested replies (recursive by MongoDB)
    const nestedDelete = await Post.updateOne(
      { _id: postID },
      {
        $pull: {
          "comments.$[].replies": { _id: commId }
        }
      }
    );

    if (nestedDelete.modifiedCount > 0) {
      return res.status(200).json({ message: "Nested reply deleted" });
    }

    // Third try: use deep recursive delete (for replies inside replies)
    const deepDelete = await Post.updateOne(
      { _id: postID },
      {
        $pull: {
          "comments.$[].replies.$[].replies": { _id: commId }
        }
      }
    );

    if (deepDelete.modifiedCount > 0) {
      return res.status(200).json({ message: "Deep nested reply deleted" });
    }

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