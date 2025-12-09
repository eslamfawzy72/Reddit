import express from "express";
import { register, login, logout ,check} from "../Controllers/AuthController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
//check
router.get("/me", protect, check);
export default router;
