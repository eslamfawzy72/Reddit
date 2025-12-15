import Post from "../Models/Post.js";
import User from "../Models/User.js";
import axios from "axios"

export async function getAllPosts(req, res) {
  try {
   const posts = await Post.find()
  .populate({
    path: "userID",
    select: "userName image",
  })
  .populate({
    path: "communityID",
    select: "commName", // ✅ add this
  })
  .sort({ date: -1 });


    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    const formattedPosts = posts.map(post => ({
  _id: post._id,
  postID: post.postID,
  communityID: post.communityID?._id,       // keep the ID
  commName: post.communityID?.commName,     // ✅ add this
  categories: post.categories,
  description: post.description,
  images: post.images,
  edited: post.edited,
  upvoteCount: post.upvoteCount,
  downvoteCount: post.downvoteCount,
  commentCount: post.commentCount,
  comments: post.comments,
  date: post.date,
  user: post.userID ? {
    userName: post.userID.userName,
    image: post.userID.image,
    _id: post.userID._id
  } : null
}));


    res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export async function getPostByID(req, res) {
  try {
    const id = req.params.postID
    const post = await Post.findById(id)
    if (!post) {
      res.status(404).json("Post Not Found!")
      return;
    }
    res.json(post)
  }
  catch (err) {
    res.status(500).json({ error: err.message })
  }
}
export async function getPostByCategory(req, res) {
  try {
    const postCat = req.params.postCategory;

    const posts = await Post.find({
      categories: { $in: [postCat] }
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: "Posts Not Found!" });
    }

    res.status(200).json(posts);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
}

export async function createPost(req, res) {
  try {
    const {
      userId,
      imgs = [],
      upvotedCount = 0,
      downvotedCount = 0,
      commentCount = 0,
      date = new Date(),
      cmnts = [],
      commID,
      cat
    } = req.body;

    const newPost = new Post({
      userID: userId,
      images: imgs,
      upvoteCount: upvotedCount,
      downvoteCount: downvotedCount,
      commentCount: commentCount,
      date: date,
      comments: cmnts,
      communityID: commID,
      category: cat
    });

    await newPost.save();
    res.status(201).json(newPost);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function getUserByID(req, res) {
  try {
    const { postID, userID } = req.params;

    const post = await Post.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    if (post.userID.toString() !== userID) {
      return res.status(400).json({ message: "User ID does not match post's user ID!" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json(user);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export async function deletePostByID(req, res) {
  try {
    const id = req.params.postID;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json("Post not found!");
    }
    await Post.deleteOne({ _id: id });
    res.json("Post has been deleted!");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


export const updatePostByID = async (req, res) => {
  console.log("✅ updatePostByID START");

  try {
    // ✅ DEFINE postID FIRST
    const { postID } = req.params;
    const { action } = req.body;

    console.log("POST ID:", postID);
    console.log("ACTION:", action);
    console.log("REQ.USER:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user._id;

    const post = await Post.findById(postID);
    const user = await User.findById(userId);

    if (!post || !user) {
      return res.status(404).json({ message: "Post or user not found" });
    }

    // safety
    post.upvoteCount ??= 0;
    post.downvoteCount ??= 0;

    const hasUpvoted = user.upvotedPosts.some(
      id => id.toString() === postID
    );

    const hasDownvoted = user.downvotedPosts.some(
      id => id.toString() === postID
    );

    if (action === "upvote") {
      if (hasUpvoted) {
        user.upvotedPosts.pull(postID);
        post.upvoteCount--;
      } else {
        user.upvotedPosts.push(postID);
        post.upvoteCount++;

        if (hasDownvoted) {
          user.downvotedPosts.pull(postID);
          post.downvoteCount--;
        }
      }
    }

    if (action === "downvote") {
      if (hasDownvoted) {
        user.downvotedPosts.pull(postID);
        post.downvoteCount--;
      } else {
        user.downvotedPosts.push(postID);
        post.downvoteCount++;

        if (hasUpvoted) {
          user.upvotedPosts.pull(postID);
          post.upvoteCount--;
        }
      }
    }

    await user.save();
    await post.save({ validateBeforeSave: false });


    res.json({
      upvoteCount: post.upvoteCount,
      downvoteCount: post.downvoteCount,
    });

  } catch (err) {
    console.error("🔥 CONTROLLER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};



export async function getSummary(req, res) {
  try {
    const { postID } = req.params;
    const post = await Post.findById(postID);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    let summary = "";

    if (post.description && post.description.length > 100) {
      try {
        const response = await axios.post(
          `${process.env.GEMINI_API_URL}/v1beta2/models/gemini-1.5:generateMessage`,
          {
            input: {
              messages: [
                {
                  author: "user",
                  content: [
                    {
                      type: "text",
                      text: `Summarize this post in one short sentence: ${post.description}`,
                    },
                  ],
                },
              ],
            },
            temperature: 0.5,
            maxOutputTokens: 50,
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Gemini response:", JSON.stringify(response.data, null, 2));

        summary =
          response.data?.candidates?.[0]?.content?.[0]?.text?.trim() || "no summary";

      } catch (apiError) {
        console.error("Gemini API Error:", apiError.response?.data || apiError.message);
        summary = "no summary";
      }
    }

    return res.status(200).json({ summary });

  } catch (err) {
    console.error("Server Error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

// Get all posts for a specific community
export async function getPostsByCommunityID(req, res) {
  try {
    const { communityID } = req.params;

    // Fetch posts for this community, newest first
      const posts = await Post.find({ communityID }) 
  .populate({
    path: "userID",
    select: "userName image",
  })

  .populate({
    path: "communityID",
    select: "commName",
  })
  .sort({ date: -1 });



    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this community" });
    }

    // Format posts
    const formattedPosts = posts.map(post => ({
  _id: post._id,
  postID: post.postID,
  communityID: post.communityID?._id,      
  commName: post.communityID?.commName,    
  categories: post.categories,
  description: post.description,
  images: post.images,
  edited: post.edited,
  upvoteCount: post.upvoteCount,
  downvoteCount: post.downvoteCount,
  commentCount: post.commentCount,
  comments: post.comments,
  date: post.date,
  user: post.userID ? {
    userName: post.userID.userName,
    image: post.userID.image,
    _id: post.userID._id
  } : null
}));


    return res.status(200).json(formattedPosts);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}