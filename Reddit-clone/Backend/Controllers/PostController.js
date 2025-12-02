import Post from "../Models/Post.js";
import User from "../Models/User.js";
import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();
  const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAllPosts(req, res) {
  try {
    const posts = await Post.find();
    if (!posts) {
      return;
    }
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getPostByID(req,res){
    try{
    const id=req.params.postID
    const post= await Post.findById(id)
    if(!post){
        res.status(404).json("Post Not Found!")
        return;
    }
    res.json(post)
    }
    catch(err){
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

export async function updatePostByID(req, res) {
  try {
    const id = req.params.postID;
    const updatedData = req.body;

    const post = await Post.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: false }   // validators disabled->open it later!!!!!!!!!!
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    return res.json(post);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}



export async function getSummary(req, res) {
  try {
    const { postID } = req.params;
    const post = await Post.findById(postID);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    let summary = '';

    // Check if post contains long text
    if (post.description && post.description.length > 100) {
      try {
        const response = await openai.responses.create({
          model: "gpt-3.5-turbo",
          input: `Summarize this post in one short sentence: ${post.description}`
        });

      summary = response.output[0].content[0].text;
      } catch (aiError) {
        console.error("OpenAI Error:", aiError);
      }
    }

    return res.status(200).json({ summary });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
