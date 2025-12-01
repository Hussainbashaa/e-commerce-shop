import jwt from "jsonwebtoken";

import { User } from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "User not found, authorization denied" });
    }
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Token is not valid", error: error.message });
  }
};
