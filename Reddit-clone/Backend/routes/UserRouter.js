import express from "express";
import {getAllUsers,getUserByID, getUserByName,
    deleteUserByID,getUserCommunities,getUserFollowers
    ,getSpecificPosts,addNewUser,updateUser,getUserPosts,checkUsernameAvailability,toggleFollowUser, checkUsernameEmailAvailability} from "../Controllers/UserController.js";
import { protect } from "../middleware/authMiddleware.js";
import optionalAuth from "../middleware/optionalAuth.js";

const router = express.Router();
//http:localhost/reddit/users/
// GET all users
router.get("/", optionalAuth,getAllUsers);
//add user will be used in sign up
//router.post('/', addNewUser)
//get user by username
router.get("/username/:username", getUserByName);
//get user Communities
router.get("/communities",protect, getUserCommunities)
//get user Followers
router.get("/followers", protect,getUserFollowers)
//get posts
router.get("/userposts/:userID",optionalAuth,getUserPosts)
//get specific posts
router.get("/posts/:field/:userID",optionalAuth,getSpecificPosts)
//get user by ID
router.get("/:userID", getUserByID);
//delete user
router.delete("/:userID", deleteUserByID);
//update user will be used in edit profile
router.get("/check-username/:username", checkUsernameAvailability);
router.patch("/:userID/follow", protect, toggleFollowUser);

// Update user profile
router.patch("/:userID", updateUser);
router.post("/check-username-email", checkUsernameEmailAvailability);
//follow and unfollow user


export default router;
