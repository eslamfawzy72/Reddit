import express from "express";
import {
  createCommunity,
  getAllCommunities,
  getCommunityById,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
} from "../Controllers/CommunityController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllCommunities);
router.get("/:id", getCommunityById);


// Protected routes
router.post("/", authMiddleware, createCommunity);
router.patch("/:id", authMiddleware, updateCommunity);
router.delete("/:id", authMiddleware, deleteCommunity);

router.post("/:id/join", authMiddleware, joinCommunity);
router.post("/:id/leave", authMiddleware, leaveCommunity);

export default router;
