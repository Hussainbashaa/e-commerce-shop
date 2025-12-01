import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//!  CREATE USER / SIGNUP

export const createUsers = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: `Signup successful! Welcome ${newUser.name}`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      },
      token,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      success: false,
      error: err.message,
    });
  }
};

//!login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        message: "Email & password are required",
        success: false,
      });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User not found",
        success: false,
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      success: false,
      error: err.message,
    });
  }
};

//! get all user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({
      message: "All users fetched successfully",
      users,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      success: false,
      error: err.message,
    });
  }
};

//!get user by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user)
      return res.status(404).json({
        message: "User not found",
        success: false,
      });

    res.status(200).json({
      message: "User fetched successfully",
      user,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      success: false,
      error: err.message,
    });
  }
};
//!update user by id
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    const updatedData = { name, email, phone };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    }).select("-password");

    if (!user)
      return res.status(404).json({
        message: "User not found",
        success: false,
      });

    res.status(200).json({
      message: "User updated successfully",
      user,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      success: false,
      error: err.message,
    });
  }
};
//!delete user
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user)
      return res.status(404).json({
        message: "User not found",
        success: false,
      });

    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      success: false,
      error: err.message,
    });
  }
};
