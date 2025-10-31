import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select("-password");

    if (!req.admin) return res.status(404).json({ message: "Admin not found" });

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token", err });
  }
};
