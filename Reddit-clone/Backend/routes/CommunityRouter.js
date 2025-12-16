 import express from "express";
 import {
  createCommunity,
   getAllCommunities,
  getCommunityById,
   joinCommunity,
//   updateCommunity,
  deleteCommunity,
  promoteToModerator,
  leaveCommunity,
  demoteModerator,
//   getCommunityByName,
 } from "../Controllers/CommunityController.js";
// import { authMiddleware } from "../middlewares/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";
const router = express.Router();

// Public routes
 router.get("/",optionalAuth,getAllCommunities);
 router.get("/:id", optionalAuth,getCommunityById);
// router.get("/name/:commName", getCommunityByName);

// // Protected routes
router.post("/:communityId/promote", protect, promoteToModerator);
router.post("/:communityId/demote", protect, demoteModerator);
 router.post("/", protect, createCommunity);
// router.patch("/:id", authMiddleware, updateCommunity);
 router.delete("/:id", protect, deleteCommunity);

 router.post("/:id/join",protect , joinCommunity);
 router.post("/:id/leave", protect, leaveCommunity);

 export default router;
