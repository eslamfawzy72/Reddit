import express from "express";
import {getAllUsers,getUserByID, getUserByName,deleteUserByID,getUserCommunities} from "../Controllers/UserController.js";


const router = express.Router();

// GET all users
router.get("/",getAllUsers);
//get user by username
router.get("/username/:username", getUserByName);
//get user Communities
router.get("/communities/:userID",getUserCommunities)
//get user by ID
router.get("/:userID",getUserByID);
//delete
router.delete("/:userID",deleteUserByID);
export default router;
