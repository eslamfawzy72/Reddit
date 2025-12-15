 import Community from "../Models/Community.js";
import User from "../Models/User.js";
// // Create a new community
// export const createCommunity = async (req, res) => {
//   try {
//     const newCommunity = new Community({
//       ...req.body,
//       created_by: req.user._id, // requires auth middleware
//       moderators: [req.user._id], // creator is the first moderator
//       members: [req.user._id], // creator joins automatically
//     });
//     const savedCommunity = await newCommunity.save();
//     res.status(201).json(savedCommunity);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Get all communities (with optional search)
export const getAllCommunities = async (req, res) => {
  try {
    const userId = req.user?._id; 
    console.log("Fetching communities for user ID:", userId);
    const communities = await Community.find();

    const communitiesWithJoinState = communities.map((community) => {
 const isJoined = Boolean(
  userId &&
  community.members.some(
    (memberId) => memberId.toString() === userId.toString()
  )
);

        console.log("Community:", community.commName, "isJoined:", isJoined);
      return {
        ...community.toObject(),
        isJoined,
      };
    });

    res.status(200).json(communitiesWithJoinState);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// // Get a single community by ID
export const getCommunityById = async (req, res) => {
  try {
    const userId = req.user?._id;

    const community = await Community.findById(req.params.id)
      .populate("members", "userName image")
      .populate("moderators", "userName image");

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const isJoined = Boolean(
      userId &&
      community.members.some(
        (member) => member._id.toString() === userId.toString()
      )
    );

    res.status(200).json({
      ...community.toObject(),
      isJoined,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Update community (only moderators)
// export const updateCommunity = async (req, res) => {
//   try {
//     const community = await Community.findById(req.params.id);
//     if (!community) return res.status(404).json({ message: "Community not found" });

//     // Only moderators can update
//     if (!community.moderators.includes(req.user._id))
//       return res.status(403).json({ message: "Not authorized" });

//     Object.assign(community, req.body); // only updates provided fields
//     const updatedCommunity = await community.save();
//     res.status(200).json(updatedCommunity);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


// // Delete community (only moderators)
// export const deleteCommunity = async (req, res) => {
//   try {
//     const community = await Community.findById(req.params.id);
//     if (!community) return res.status(404).json({ message: "Community not found" });

//     if (!community.moderators.includes(req.user._id))
//       return res.status(403).json({ message: "Not authorized" });

//     await community.deleteOne();
//     res.status(200).json({ message: "Community deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Join community
export const joinCommunity = async (req, res) => {
  try {
    const userId = req.user._id;

    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    console.log("Current members:", community.members);

    const alreadyMember = community.members.some(
      (memberId) => memberId.equals(userId)
    );

    if (alreadyMember) {
      return res.status(400).json({ message: "Already a member" });
    }

    community.members.push(userId);

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.joinedCommunities.push(community._id);

    await Promise.all([
      community.save(),
      user.save()
    ]);

    res.status(200).json({
      message: "Joined the community",
      isJoined: true
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// // Leave community
export const leaveCommunity = async (req, res) => {
const communityId = req.params.id;
const userId = req.user._id;
console.log("User ID leaving community:", userId);
console.log("Community ID to leave:", communityId);
  try {
    const community = await Community.findById(communityId);
    if (!community) return res.status(404).json({ message: "Community not found" });
    console.log("Current members before leaving:", community.members);
    community.members = community.members.filter(
      (memberId) => memberId.toString() !== userId.toString()
    );
    console.log("Members after leaving:", community.members);
    // Also remove from moderators if leaving
    community.moderators = community.moderators.filter(
      (modId) => modId.toString() !== userId.toString()
    );
    console.log("Moderators after leaving:", community.moderators);
    await User.findByIdAndUpdate(userId, {
      $pull: { joinedCommunities: communityId },
    }).exec();
    console.log("User's joined communities updated.");
    await Promise.all([
      community.save(),
     
    ]);
    console.log("User updated after user left.");
    res.status(200).json({ message: "Left the community" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
