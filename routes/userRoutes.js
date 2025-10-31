import express from "express";
import {
  createUsers,
  deleteUserById,
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/userController.js";

const router = express.Router();
//! create a user
router.post("/user/create", createUsers);
//! get all users
router.get("/user/allusers", getAllUsers);
//! get single user by id
router.get("/user/allusers/:id", getUserById);
//! update user by id
router.put("/user/update/:id", updateUserById);
//! delete user by id
router.delete("/user/delete/:id", deleteUserById);

export default router;
