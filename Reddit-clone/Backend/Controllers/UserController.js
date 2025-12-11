import User from "../Models/User.js";
import Community from "../Models/Community.js"
import Post from "../Models/Post.js"
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

    if (!user) return res.status(404).json({ error: "User not found" });
    const Posts = await Post.find({ _id: { $in: user[field] } })
    res.json(Posts);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};

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
export async function updateUser(req, res) {
  try {
    const { userID } = req.params;
    const updates = { ...req.body }; // all fields sent in body

    //id and email can not be updated
    delete updates._id;
    delete updates.email;

    // id password updated so, bcrybt it first
    if (updates.password) {
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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
export async function getUserPosts(req, res) {
  try {
    const Id = req.params.userID;
    const posts = await Post.find({ userID: Id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}




