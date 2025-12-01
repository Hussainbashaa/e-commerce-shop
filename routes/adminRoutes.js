import express from "express";
import { protectAdmin } from "../middlewares/adminMiddleware.js";
import {
  addProduct,
  deleteProduct,
  deleteUser,
  getAllOrders,
  getAllProducts,
  getAllUsers,
  getDashboardStats,
  getOrdersByUserId,
  getPaymentHistory,
  getPaymentsByUserId,
  getUserById,
  loginAdmin,
  registerAdmin,
  updateOrderStatus,
  updateProduct,
} from "../controllers/adminController.js";

const router = express.Router();

// ===========================
// AUTH ROUTES
// ===========================
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// ===========================
// USERS
// ===========================
router.get("/users", protectAdmin, getAllUsers);
router.get("/users/:id", protectAdmin, getUserById);
router.delete("/users/:id", protectAdmin, deleteUser);

// ===========================
// ORDERS
// ===========================
router.get("/orders", protectAdmin, getAllOrders);
router.get("/orders/user/:userId", protectAdmin, getOrdersByUserId);
router.put("/orders/:id", protectAdmin, updateOrderStatus);

// ===========================
// PRODUCTS
// ===========================
router.post("/products/add", protectAdmin, addProduct);
router.get("/products", protectAdmin, getAllProducts);
router.put("/products/:id", protectAdmin, updateProduct);
router.delete("/products/:id", protectAdmin, deleteProduct);

// ===========================
// PAYMENTS
// ===========================

// 🔥 FIXED: Get all payments (No id needed)
router.get("/payments/all", protectAdmin, getPaymentHistory);

// Get payments for a specific user
router.get("/payments/user/:userId", protectAdmin, getPaymentsByUserId);

// ===========================
// DASHBOARD
// ===========================
router.get("/dashboard/stats", protectAdmin, getDashboardStats);

export default router;
