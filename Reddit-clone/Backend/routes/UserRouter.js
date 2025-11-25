import express from "express";
import getAllUsers from "../Controllers/UserController.js";


const router = express.Router();

// GET all users
router.get("/",getAllUsers);


export default router;
