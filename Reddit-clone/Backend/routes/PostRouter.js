import express from "express";
import {
    getAllPosts,
    getPostByID,
    getPostByCategory,
    createPost,
    getUserByID,
    deletePostByID,
    getSummary,
    updatePostByID,
    getPostsByCommunityID,
    getCommentsByPostId
} from "../Controllers/PostController.js";

import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Get all posts
router.get('/', getAllPosts);

// Add post (requires authentication)
router.post('/', protect, createPost);

// Get post by category
router.get('/category/:postCategory', getPostByCategory);

// Get posts by community ID
router.get("/community/:communityID", protect, getPostsByCommunityID);

// Get post by ID
router.get('/:postID', getPostByID);

// Delete post by ID
router.delete('/:postID', deletePostByID);

// Get user by post ID and user ID
router.get('/:postID/user/:userID', getUserByID);

// Get summary of post
router.get('/:postID/summary', getSummary);

// Update post (requires authentication)
router.patch('/:postID', protect, updatePostByID);

// Get all comments for a post
router.get("/:postID/comments", getCommentsByPostId);

export default router;
