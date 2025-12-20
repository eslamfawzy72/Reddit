import jwt from "jsonwebtoken";
import User from "../Models/User.js";

const optionalAuth = async (req, res, next) => {
  const token = req.cookies.jwt; 

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
  } catch (err) {
    req.user = null;
  }

  next();
};

export default optionalAuth;
