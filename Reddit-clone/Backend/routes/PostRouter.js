import express from "express";
import { getAllPosts,getPostByID,getPostByCategory,createPost,getUserByID,deletePostByID,getSummary, updatePostByID} from "../Controllers/PostController.js";


const router = express.Router();

//get all Posts
router.get('/',getAllPosts)
//add post will be used in create post
router.post('/',createPost)
//get post by username
router.get('/category/:postCategory',getPostByCategory)
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

export default router;