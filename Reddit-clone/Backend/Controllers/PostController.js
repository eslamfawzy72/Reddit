import 'dotenv/config';
import Post from "../Models/Post.js";
import User from "../Models/User.js";
import Community from '../Models/Community.js';
import { notifyPostUpvote } from "./NotificationController.js";//added t
import { notifyPostDownvote } from "./NotificationController.js";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// 2.5-flash-lite is the 'Goldilocks' model for 2025 Free Tier users
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export async function getSummary(req, res) {
  try {
    const { postID } = req.params;
    const post = await Post.findById(postID);

    if (!post || !post.description || post.description.length < 50) {
      return res.status(200).json({ summary: "Content too short to summarize." });
    }

    const prompt = `Summarize this in one short sentence: ${post.description}`;
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    return res.status(200).json({ summary });

  } catch (err) {
    if (err.status === 429) {
      console.error("QUOTA EXCEEDED: You are hitting the 2025 Free Tier limits.");
      return res.status(429).json({ 
        error: "AI is currently resting. Please try again in 30 seconds.",
        retryAfter: "30s" 
      });
    }
    
    console.error("Gemini Error:", err.message);
    return res.status(500).json({ error: "Summary generation failed." });
  }
}



export async function getAllPosts(req, res) {
  try {
   const posts = await Post.find()
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
      return res.status(404).json({ message: "No posts found" });
    }
const userPollVotes = req.user?.pollVotes || [];

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      postID: post.postID,
      communityID: post.communityID,
      community_name: post.communityID ? post.communityID.commName : null,
      title: post.title,
      categories: post.categories,
      description: post.description,
      images: post.images,
      edited: post.edited,
      upvoteCount: post.upvoteCount,
      downvoteCount: post.downvoteCount,
      commentCount: post.commentCount,
      comments: post.comments,
      poll: post.poll?.isPoll
  ? {
      ...post.poll.toObject(),
      userOptionId: userPollVotes.find(
        v => v.post.toString() === post._id.toString()
      )?.option || null
    }
  : { isPoll: false },


      date: post.date,
      user: post.userID
        ? {
            userName: post.userID.userName,
            image: post.userID.image,
            _id: post.userID._id,
          }
        : null,
    }));

    res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getPostByID(req, res) {
  try {
    const id = req.params.postID;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found!" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getPostByCategory(req, res) {
  try {
    const postCat = req.params.postCategory;

    const posts = await Post.find({
      categories: { $in: [postCat] },
    });

    if (!posts || posts.length === 0) {
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
      images = [],
      upvotedCount = 0,
      downvotedCount = 0,
      commentCount = 0,
      date = new Date(),
      cmnts = [],
      commID,
      cat,
      title = "",
      description = "",
      poll,
    } = req.body;

    // Accept either `images` or legacy `imgs` from client; prefer `images` if provided
    const incomingImgs = (Array.isArray(images) && images.length > 0) ? images : (Array.isArray(imgs) ? imgs : []);
    
  

    // Log incoming media for diagnosis
    try {
      const count = incomingImgs.length;
      console.log(`createPost: received images count = ${count}`);
      if (count > 0 && typeof incomingImgs[0] === 'string') {
        console.log(`createPost: first image length = ${incomingImgs[0].length} chars, prefix=${incomingImgs[0].slice(0,40)}`);
      }
    } catch (logErr) {
      console.warn('createPost: failed to log images info', logErr);
    }
    console.log("REQ BODY KEYS:", Object.keys(req.body));
    console.log("IMGS TYPE:", typeof imgs);
    console.log("IMGS IS ARRAY:", Array.isArray(imgs));
    console.log("IMGS LENGTH:", imgs?.length);

    if (Array.isArray(imgs) && imgs.length > 0) {
      console.log("FIRST IMAGE PREFIX:", imgs[0].slice(0, 50));
    }

    // Log incoming media info for diagnosis


    // Normalize poll payload: if client sent options or isPoll flag, ensure stored poll has options with vote counts
    let pollData = { isPoll: false, options: [] };
    if (poll && (poll.isPoll || (Array.isArray(poll.options) && poll.options.length > 0))) {
      pollData.isPoll = true;
      pollData.question = poll.question ||"Poll";
      pollData.options = (poll.options || []).map((opt) => {
        if (typeof opt === "string") return { text: opt, votes: 0 };
        return { text: opt.text || "", votes: Number(opt.votes) || 0 };
      });
      if (poll.expiresAt) pollData.expiresAt = poll.expiresAt;
    }

    const newPost = new Post({
      userID: (req.user && req.user._id) ? req.user._id : userId,
      images: incomingImgs,
      upvoteCount: upvotedCount,
      downvoteCount: downvotedCount,
      commentCount: commentCount,
      date: date,
      comments: cmnts,
      communityID: commID,
      categories: cat || [],
      title: title?.trim() || "",
      description: description?.trim() || "",

      poll: pollData,
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
          if (post.userID.toString() !== userId.toString()) {
      await notifyPostUpvote(userId, post._id);
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
        if (post.userID.toString() !== userId.toString()) {
      await notifyPostDownvote(userId, post._id);
    }
      }
    }

    // Poll voting
    if (action === "pollVote") {
      const { optionId } = req.body;
      if (!optionId) {
        return res.status(400).json({ message: "optionId is required" });
      }

      // ensure post has poll
      if (!post.poll || !post.poll.isPoll) {
        return res.status(400).json({ message: "Post is not a poll" });
      }

      // find option
      const option = post.poll.options.id(optionId);
      if (!option) {
        return res.status(404).json({ message: "Option not found" });
      }

      // check user's existing vote for this post
      const existing = user.pollVotes.find(pv => pv.post.toString() === postID);

      if (!existing) {
        // add vote
        option.votes = (option.votes || 0) + 1;
        user.pollVotes.push({ post: postID, option: option._id });
      } else if (existing.option.toString() === optionId) {
        // undo vote
        option.votes = Math.max((option.votes || 1) - 1, 0);
        user.pollVotes = user.pollVotes.filter(pv => pv.post.toString() !== postID);
      } else {
        // change vote
        // decrement previous option
        const prevOption = post.poll.options.id(existing.option);
        if (prevOption) prevOption.votes = Math.max((prevOption.votes || 1) - 1, 0);
        // increment new
        option.votes = (option.votes || 0) + 1;
        existing.option = option._id;
      }

      await user.save();
      await post.save({ validateBeforeSave: false });
return res.json({
  poll: {
    ...post.poll.toObject(),
    userOptionId: user.pollVotes.find(
      v => v.post.toString() === postID
    )?.option || null
  }
});

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



// Get all posts for a specific community
export async function getPostsByCommunityID(req, res) {
  try {
    const { communityID } = req.params;

    // Fetch posts for this community, newest first
    const posts = await Post.find()
  .find({ communityID })
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
        return res.status(200).json([]);
    }
const userPollVotes = req.user?.pollVotes || [];

    // Format posts
    const formattedPosts = posts.map(post => ({
      _id: post._id,
      postID: post.postID,
      communityID: post.communityID,
      title:post.title,
      community_name: post.communityID ? post.communityID.commName : null,
      categories: post.categories,
      description: post.description,
      images: post.images,
      edited: post.edited,
      upvoteCount: post.upvoteCount,
      downvoteCount: post.downvoteCount,
      commentCount: post.commentCount,
      comments: post.comments,
poll: post.poll?.isPoll
  ? {
      ...post.poll.toObject(),
      userOptionId: userPollVotes.find(
        v => v.post.toString() === post._id.toString()
      )?.option || null
    }
  : { isPoll: false },

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

// get all comments for a specific post
export async function getCommentsByPostId(req,res) {
  try{
    const postid = req.params.id;
    const post = await Post.findById(postid);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }
    const comments = post.comments.sort((a, b) => new Date(b.date) - new Date(a.date))
    return res.json(comments);
    
  }
  catch(err){
     return res.status(500).json({ error: err.message });
  }
  
}