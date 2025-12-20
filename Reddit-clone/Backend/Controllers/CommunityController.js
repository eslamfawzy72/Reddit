 import Community from "../Models/Community.js";
import User from "../Models/User.js";
import Post from "../Models/Post.js";
import mongoose from "mongoose";
// // Create a new community
export const createCommunity = async (req, res) => {
  try {
    const newCommunity = new Community({
      ...req.body,
      created_by: req.user._id,  
      members: [req.user._id],   
    });
    const savedCommunity = await newCommunity.save();
    const user = await User.findById(req.user._id);
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }
    user.joinedCommunities.push(savedCommunity._id);
    await user.save();
    res.status(201).json(savedCommunity);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
//promote member to modreator
export const promoteToModerator = async (req, res) => {
  try {
    const  communityId  = req.params.communityId;
    const { userId } = req.body;
    const adminId = req.user._id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    //ONLY ADMIN CAN PROMOTE
    if (!community.created_by.equals(adminId)) {
      return res.status(403).json({ message: "Only admin can promote moderators" });
    }

    // Admin cannot be promoted
    if (community.created_by.equals(userId)) {
      return res.status(400).json({ message: "Admin cannot be a moderator" });
    }

    // Must be a member
    const isMember = community.members.some(id => id.equals(userId));
    if (!isMember) {
      return res.status(400).json({ message: "User is not a community member" });
    }

    // Already moderator
    if (community.moderators.some(id => id.equals(userId))) {
      return res.status(400).json({ message: "User is already a moderator" });
    }

    community.moderators.push(userId);
    await community.save();

    return res.status(200).json({
      message: "User promoted to moderator",
      userId,
    });

  } catch (err) {
    console.error("Promote error:", err);
    return res.status(500).json({ error: err.message });
  }
};

//demote moderator to member

export const demoteModerator = async (req, res) => {
  try {
    const  communityId  = req.params.communityId;
    const { userId } = req.body;
    const adminId = req.user._id;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    // ONLY ADMIN CAN DEMOTE
    if (!community.created_by.equals(adminId)) {
      return res.status(403).json({ message: "Only admin can demote moderators" });
    }

    //  Admin cannot demote themselves
    if (community.created_by.equals(userId)) {
      return res.status(409).json({ message: "Admin cannot be demoted" });
    }

    //  Must be moderator
    const isModerator = community.moderators.some(id => id.equals(userId));
    if (!isModerator) {
      return res.status(400).json({ message: "User is not a moderator" });
    }

    community.moderators = community.moderators.filter(
      id => !id.equals(userId)
    );

    await community.save();

    return res.status(200).json({
      message: "Moderator demoted successfully",
      userId,
    });

  } catch (err) {
    console.error("Demote error:", err);
    return res.status(500).json({ error: err.message });
  }
};

   
    // const isModerator = community.moderators.some(
    //   (modId) => modId.toString() === userId.toString()
    // );

    // if (!isModerator) {
    //   return res.status(400).json({ message: "User is not a moderator" });
    // }

    
//     community.moderators = community.moderators.filter(
//       (modId) => modId.toString() !== userId.toString()
//     );

//     await community.save();

//     return res.status(200).json({
//       message: "Moderator demoted successfully",
//       demotedUserId: userId,
//     });

//   } catch (err) {
//     console.error("Demote moderator error:", err);
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


//  Get a single community by ID
export const getCommunityById = async (req, res) => {
  try {
    const userId = req.user?._id;

    const community = await Community.findById(req.params.id)
      .populate("members", "userName image")
      .populate("moderators", "userName image")
      .populate("created_by", "userName image")
      ;

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const isJoined = Boolean(
      userId &&
      community.members.some(
        (member) => member._id.toString() === userId.toString()
      )
    );
    console.log("Community:", community.commName, "isJoined:", isJoined,"created_by:",community.created_by  );
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


// Delete community (only moderators)
export const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: "Community not found" });
    if (!community.created_by.equals(req.user._id))
      return res.status(403).json({ message: "Not authorized" });
    await Post.deleteMany({ communityID: community._id });
    await community.deleteOne();
  
    res.status(200).json({ message: "Community deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const isCreator = community.created_by.equals(userId);
    // If creator is the only member prevent leaving (or delete)
    if (isCreator && community.members.length === 1) {
      return res.status(400).json({
        message: "You cannot leave a community you own as the only member",
      });
    }
 
     //  REMOVE USER FROM MEMBERS
    community.members = community.members.filter(
      (id) => !id.equals(userId)
    );

    
       //REMOVE USER FROM MODERATORS
    community.moderators = community.moderators.filter(
      (id) => !id.equals(userId)
    );

    /* ----------------------------
       HANDLE CREATOR LEAVING
    ---------------------------- */
    if (isCreator) {
      let newCreator = null;

      // Pick another moderator
      if (community.moderators.length > 0) {
        newCreator = community.moderators[0];
      }
      // Else pick a member
      else if (community.members.length > 0) {
        newCreator = community.members[0];
        community.moderators.push(newCreator); // promote to moderator
      }

      if (!newCreator) {
        return res.status(400).json({
          message: "No eligible user to transfer ownership",
        });
      }

      community.created_by = newCreator;
    }

    /* ----------------------------
       UPDATE USER DOC
    ---------------------------- */
 await User.findByIdAndUpdate(userId, {
  $pull: { joinedCommunities: new mongoose.Types.ObjectId(communityId) },
});

    await community.save();

    res.status(200).json({
      message: "Left the community successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

