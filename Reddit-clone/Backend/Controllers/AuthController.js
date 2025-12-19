import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// REGISTER
export const register = async (req, res) => {
  const { username, email, password, interests } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(409).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    userName: username, 
    email,
    password: hashedPassword,
    interests,
    createdAt: new Date()
  });

  generateToken(res, user._id);

  res.status(201).json({
    id: user._id,
    username: user.userName, 
    email: user.email,
    interests: user.interests,
  });
};

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(401).json({ message: "Invalid credentials" });

  generateToken(res, user._id);

  res.json({
    id: user._id,
    username: user.userName, 
    email: user.email,
  });
};

// LOGOUT
export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.json({ message: "Logged out successfully" });
};

export const check=(req,res)=>{
  res.json({ user: req.user });
}
