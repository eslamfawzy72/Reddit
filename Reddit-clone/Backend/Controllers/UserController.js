import User from "../Models/User.js";
import Community from "../Models/Community.js"
import Post from "../Models/Post.js"
import { notifyFollow } from "./NotificationController.js";
import bcrypt from "bcrypt";
//get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, '-password');
    if (users.length === 0) {
      return
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

//get user by id
export async function getUserByID(req, res) {
  try {
    const userId = req.params.userID
    const user = await User.findById(userId, "-password")
    if (!user) {
      res.status(404).json("user not found!")
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}
//get user by username
export async function getUserByName(req, res) {
  try {
    const username = req.params.username;

    const user = await User.findOne({ userName: username });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteUserByID(req, res) {
  try {
    const id = req.params.userID
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json("User not found!");
    }
    const username = user.userName
    await User.deleteOne({ _id: id })
    res.json(`user ${username} have been deleted!`)
  } catch (err) {
    res.status(500).json({ error: err.message });

  }
}
export async function getUserCommunities(req, res) {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json("User not found!");
    console.log("joinedCommunities:", user.joinedCommunities);

    const communities = await Community.find({
      _id: {
        $in: user.joinedCommunities
      }
    })
    res.json(communities);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
// controllers/UserController.js

export async function getUserFollowers(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // THIS IS THE FIX — convert ObjectId to string
    const followerIds = user.followers.map(id => id.toString());

    const followers = await User.find({
      _id: { $in: followerIds }
    }).select("userName image _id"); // send _id too

    // Send exactly what frontend expects
    res.json({ followers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
export async function getSpecificPosts(req, res) {
  try {
    const { field, userID } = req.params;

    const allowed = ["upvotedPosts", "downvotedPosts", "historyPosts"];
    if (!allowed.includes(field)) {
      return res.status(400).json({ error: "Invalid field" });
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const postIds = user[field] || [];

    const posts = await Post.find({ _id: { $in: postIds } })
      .populate({
        path: "userID",
        select: "userName image _id",
      })
      .populate({
        path: "communityID",
        select: "commName _id",
      })
      .sort({ date: -1 });

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

    res.json(formattedPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

export async function addNewUser(req, res) {

  try {
    const { userName, email, password, description, image, interests } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      description: description || "",
      image: image || "",
      interests: interests || [],
      upvotedPosts: [],
      downvotedPosts: [],
      historyPosts: [],
      followers: [],
      joinedCommunities: []
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }


}
export async function checkUsernameAvailability(req, res) {
  try {
    const { username } = req.params;

    // Basic validation
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ 
        available: false, 
        error: "Username must be at least 3 characters" 
      });
    }

    // Check if username contains only valid characters
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.status(400).json({ 
        available: false, 
        error: "Username can only contain letters, numbers, and underscores" 
      });
    }

    // Check if username exists (case-insensitive)
    const existingUser = await User.findOne({ 
      userName: { $regex: new RegExp(`^${username}$`, 'i') } 
    });

    if (existingUser) {
      return res.json({ 
        available: false, 
        message: "Username is already taken" 
      });
    }

    res.json({ 
      available: true, 
      message: "Username is available" 
    });

  } catch (err) {
    console.error("Error checking username:", err);
    res.status(500).json({ 
      available: false, 
      error: "Server error while checking username" 
    });
  }
}

/**
 * Update user profile
 * PATCH /users/:userID
 */
export async function toggleFollowUser(req, res) {
  try {
    const targetUserID = req.params.userID;
    const currentUserID = req.user._id;

    if (targetUserID === currentUserID.toString()) {
      return res.status(400).json({ error: "You can't follow yourself" });
    }

    const targetUser = await User.findById(targetUserID);

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure followers array exists
    if (!Array.isArray(targetUser.followers)) {
      targetUser.followers = [];
    }

    const isFollowing = targetUser.followers.some(
      id => id.toString() === currentUserID.toString()
    );

    if (isFollowing) {
      // UNFOLLOW
      targetUser.followers = targetUser.followers.filter(
        id => id.toString() !== currentUserID.toString()
      );
    } else {
      // FOLLOW
      targetUser.followers.push(currentUserID);

      // Fire notification asynchronously, but don't block
      notifyFollow(currentUserID, targetUserID).catch(err =>
        console.error("⚠️ notifyFollow failed:", err.message)
      );
    }

    await targetUser.save();

    res.json({
      following: !isFollowing,
      followersCount: targetUser.followers.length,
    });
  } catch (err) {
    console.error("🔥 TOGGLE FOLLOW ERROR 🔥", err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { userID } = req.params;
    const updates = { ...req.body };

    // Fields that cannot be updated
    delete updates._id;
    delete updates.email;
    delete updates.createdAt;
    delete updates.__v;

    // Validate that user is updating their own profile (optional security check)
    // Uncomment if you have auth middleware that adds req.user
    // if (req.user && req.user._id !== userID) {
    //   return res.status(403).json({ error: "Unauthorized to update this profile" });
    // }

    // If username is being updated, check if it's available
    if (updates.userName) {
      const trimmedUsername = updates.userName.trim();
      
      // Validate username format
      if (trimmedUsername.length < 3) {
        return res.status(400).json({ error: "Username must be at least 3 characters" });
      }

      if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
        return res.status(400).json({ 
          error: "Username can only contain letters, numbers, and underscores" 
        });
      }

      // Check if username is taken by another user
      const existingUser = await User.findOne({ 
        userName: { $regex: new RegExp(`^${trimmedUsername}$`, 'i') },
        _id: { $ne: userID } // Exclude current user
      });

      if (existingUser) {
        return res.status(400).json({ error: "Username is already taken" });
      }

      updates.userName = trimmedUsername;
    }

    // If password is being updated, hash it
    if (updates.password) {
      if (updates.password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(
      userID,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-__v -password"); // exclude password and __v from response

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);

  } catch (err) {
    console.error("Error updating user:", err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }

    res.status(500).json({ error: "Server error while updating profile" });
  }
}
export async function getUserPosts(req, res) {
  try {
    const Id = req.params.userID;

    const posts = await Post.find({ userID: Id })
      .populate({
        path: "userID",
        select: "userName image _id",
      })
      .populate({
        path: "communityID",
        select: "commName _id",
      })
      .sort({ date: -1 });

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

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

    res.json(formattedPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}




