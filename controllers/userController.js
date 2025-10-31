import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//! create a user
export const createUsers = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    await newUser.save();
    res.status(200).json({
      message: `sign up successful ,welcome ${newUser.name}`,
      users: newUser,
      token: token,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server Error", error: err.message, success: false });
  }
};

//! get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      message: "All users fetched successfully",
      users: users,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server Error", error: err.message, success: false });
  }
};

//! get single user by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.find({ _id: id });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      message: "User details fetched successfully",
      users: user,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server Error", error: err.message, success: false });
  }
};
//! update user by id
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;
    const user = await User.findByIdAndUpdate(
      id,
      { name, email, phone, password },
      { new: true }
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      message: "User updated successfully",
      users: user,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server Error", error: err.message, success: false });
  }
};

//! delete user by id
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    res.status(200).json({
      message: "User deleted successfully",

      users: user,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Server Error", error: err.message, success: false });
  }
};
