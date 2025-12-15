import express from "express";
import { getAllPosts,getPostByID,getPostByCategory
    ,createPost,getUserByID,deletePostByID,
    getSummary, updatePostByID,getPostsByCommunityID,getCommentsByPostId} from "../Controllers/PostController.js";

import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

//get all Posts
router.get('/',getAllPosts)
//add post will be used in create post
router.post('/',protect,createPost)
//get post by category
router.get('/category/:postCategory',getPostByCategory)
//get posts by comm id
router.get("/community/:communityID", getPostsByCommunityID);
//get post by id
router.get('/:postID',getPostByID)
//delete post by id
router.delete('/:postID',deletePostByID)
//get user 
router.get('/:postID/user/:userID',getUserByID)
//get summary
router.get('/:postID/summary',getSummary)
//update post will be used in upvote and comment
router.patch('/:postID',updatePostByID)
//get all post comments
router.get("/:postID/comments",getCommentsByPostId)

export default router;