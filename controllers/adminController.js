import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { Payment } from "../models/Payment.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//! Admin Registration
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ name, email, password });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//! Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(admin._id);

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//!get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//!get user by id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
//!delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // user ID from URL

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `User with ID ${id} deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//! add products
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
    });
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//! get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//!update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "✅ Product updated successfully",
      updatedData: product,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//!delete products
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//! view all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price");
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//!get order  user by id
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).populate("items.productId");
    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
//!update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//! payments history
export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.id })
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

//! get specific user payment history
export const getPaymentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId });
    if (!payments.length) {
      return res
        .status(404)
        .json({ message: "No payments found for this user" });
    }
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//! admin dashboard
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
