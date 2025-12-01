import express from "express";
import {
  createUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";

const router = express.Router();

// Create new user (Signup) api/users
router.post("/users", createUsers);

// Get all users
router.get("/users", getAllUsers);

// Get user by ID
router.get("/users/:id", getUserById);

// Update user by ID
router.put("/users/:id", updateUserById);

// Delete user by ID
router.delete("/users/:id", deleteUserById);

export default router;
