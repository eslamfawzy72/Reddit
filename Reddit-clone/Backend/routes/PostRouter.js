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
import optionalAuth from "../middleware/optionalAuth.js";
const router = express.Router();

//get all Posts (optional auth so responses can include user's poll votes when logged in)
router.get('/', optionalAuth, getAllPosts)
//add post will be used in create post
router.post('/', protect, createPost)
//get post by category
router.get('/category/:postCategory', getPostByCategory)
//get posts by comm id (optional auth to include user's poll votes when available)
router.get("/community/:communityID", optionalAuth, getPostsByCommunityID);
//get post by id
router.get('/:postID', getPostByID)
//delete post by id
router.delete('/:postID', deletePostByID)
//get user 
router.get('/:postID/user/:userID', getUserByID)
//get summary
router.get('/:postID/summary', getSummary)
//update post will be used in upvote and comment
router.patch("/:postID", protect, updatePostByID);

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
router.get('/:postID/summary',protect, getSummary);

// Update post (requires authentication)
router.patch('/:postID', protect, updatePostByID);

// Get all comments for a post
router.get("/:postID/comments", getCommentsByPostId);

export default router;
