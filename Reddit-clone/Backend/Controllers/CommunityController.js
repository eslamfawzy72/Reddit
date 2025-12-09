 import Community from "../Models/Community.js";

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

    const communities = await Community.find();

    const communitiesWithJoinState = communities.map((community) => {
      const isJoined =
        userId &&
        community.members.some(
          (memberId) => memberId.toString() === userId.toString()
        );

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
    const community = await Community.findById(req.params.id)
      .populate("members", "username")
      .populate("moderators", "username");
    if (!community) return res.status(404).json({ message: "Community not found" });
    res.status(200).json(community);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get a single community by ID
export const getCommunityByName = async (req, res) => {
  try {
    const community = await Community.findById(req.params.commName)
      .populate("members", "username")
      .populate("moderators", "username");
    if (!community) return res.status(404).json({ message: "Community not found" });
    res.status(200).json(community);
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
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });

    if (community.members.includes(req.user._id))
      return res.status(400).json({ message: "Already a member" });

    community.members.push(req.user._id);
    await community.save();
    res.status(200).json({ message: "Joined the community" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// // Leave community
// export const leaveCommunity = async (req, res) => {
//   try {
//     const community = await Community.findById(req.params.id);
//     if (!community) return res.status(404).json({ message: "Community not found" });

//     community.members = community.members.filter(
//       (memberId) => memberId.toString() !== req.user._id.toString()
//     );

//     // Also remove from moderators if leaving
//     community.moderators = community.moderators.filter(
//       (modId) => modId.toString() !== req.user._id.toString()
//     );

//     await community.save();
//     res.status(200).json({ message: "Left the community" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };
