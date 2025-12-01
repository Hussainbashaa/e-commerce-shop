import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";

const generateToken = (id) =>
  jwt.sign({ adminId: id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ======================================================
// ✅ ADMIN REGISTER
// ======================================================
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashed,
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email },
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ ADMIN LOGIN
// ======================================================
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(admin._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ GET ALL USERS
// ======================================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json({ users, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ======================================================
// ✅ GET USER BY ID
// ======================================================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ======================================================
// ✅ DELETE USER
// ======================================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const exists = await User.findById(id);
    if (!exists) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `User ${id} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ======================================================
// ✅ ADD PRODUCT
// ======================================================
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      message: "Product added successfully",
      product,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ GET ALL PRODUCTS
// ======================================================
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ UPDATE PRODUCT
// ======================================================
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      product,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ DELETE PRODUCT
// ======================================================
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ GET ALL ORDERS
// ======================================================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price images");

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ GET ORDERS BY USER ID
// ======================================================
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId }).populate("items.productId");

    if (!orders.length)
      return res.status(404).json({ message: "No orders found for this user" });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ UPDATE ORDER STATUS
// ======================================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ PAYMENT HISTORY (All payments of a user)
// ======================================================
export const getPaymentHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const payments = await Payment.find({ userId: id })
      .populate("userId", "name email")
      .populate("orderId", "totalPrice status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ======================================================
// ✅ GET PAYMENTS FOR SPECIFIC USER
// ======================================================
export const getPaymentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ userId });

    if (!payments.length)
      return res.status(404).json({ message: "No payments found" });

    res.status(200).json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ======================================================
// ✅ ADMIN DASHBOARD SUMMARY
// ======================================================
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalPayments = await Payment.countDocuments();

    const totalSalesAgg = await Payment.aggregate([
      { $match: { paymentStatus: "Completed" } },
      { $group: { _id: null, totalSales: { $sum: "$amount" } } },
    ]);

    const totalSales = totalSalesAgg[0]?.totalSales || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalPayments,
        totalSales,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
