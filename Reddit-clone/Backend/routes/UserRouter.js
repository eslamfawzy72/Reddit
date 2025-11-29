import express from "express";
import {getAllUsers,getUserByID, getUserByName,
    deleteUserByID,getUserCommunities,getUserFollowers
    ,getSpecificPosts,addNewUser,updateUser,getUserPosts} from "../Controllers/UserController.js";


const router = express.Router();

// GET all users
router.get("/",getAllUsers);
//add user will be used in sign up
router.post('/',addNewUser)
//get user by username
router.get("/username/:username", getUserByName);
//get user Communities
router.get("/communities/:userID",getUserCommunities)
//get user Followers
router.get("/followers/:userID",getUserFollowers)
//get posts
router.get("/userposts/:userID",getUserPosts)
//get specific posts
router.get("/posts/:field/:userID",getSpecificPosts)
//get user by ID
router.get("/:userID",getUserByID);
//delete user
router.delete("/:userID",deleteUserByID);
//update user will be used in edit profile
router.patch("/:userID",updateUser)
//follow and unfollow user


export default router;
