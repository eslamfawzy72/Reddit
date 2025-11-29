import express from "express";
<<<<<<< HEAD
import {
    getAllUsers, getUserByID, getUserByName,
    deleteUserByID, getUserCommunities, getUserFollowers
    , getSpecificPosts, addNewUser, updateUser
} from "../Controllers/UserController.js";
=======
import {getAllUsers,getUserByID, getUserByName,
    deleteUserByID,getUserCommunities,getUserFollowers
    ,getSpecificPosts,addNewUser,updateUser,getUserPosts} from "../Controllers/UserController.js";
>>>>>>> 0af11d224ab482e43347755a08bf83d9f748f54c


const router = express.Router();

// GET all users
router.get("/", getAllUsers);
//add user will be used in sign up
router.post('/', addNewUser)
//get user by username
router.get("/username/:username", getUserByName);
//get user Communities
router.get("/communities/:userID", getUserCommunities)
//get user Followers
router.get("/followers/:userID", getUserFollowers)
//get posts
<<<<<<< HEAD
router.get("/posts/:field/:userID", getSpecificPosts)
=======
router.get("/userposts/:userID",getUserPosts)
//get specific posts
router.get("/posts/:field/:userID",getSpecificPosts)
>>>>>>> 0af11d224ab482e43347755a08bf83d9f748f54c
//get user by ID
router.get("/:userID", getUserByID);
//delete user
router.delete("/:userID", deleteUserByID);
//update user will be used in edit profile
<<<<<<< HEAD
router.patch("/:userID", updateUser)

=======
router.patch("/:userID",updateUser)
//follow and unfollow user
>>>>>>> 0af11d224ab482e43347755a08bf83d9f748f54c


export default router;
