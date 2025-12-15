import express from "express";
import {
    getAllPosts, getPostByID, getPostByCategory
    , createPost, getUserByID, deletePostByID,
    getSummary, updatePostByID, getPostsByCommunityID
} from "../Controllers/PostController.js";

import { protect } from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";
const router = express.Router();

//get all Posts
router.get('/', getAllPosts)
//add post will be used in create post
router.post('/', protect, createPost)
//get post by category
router.get('/category/:postCategory', getPostByCategory)
//get posts by comm id
router.get("/community/:communityID", optionalAuth,getPostsByCommunityID);
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

export default router;