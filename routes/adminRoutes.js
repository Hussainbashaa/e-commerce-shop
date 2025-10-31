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

// Auth routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// User routes
router.get("/users", protectAdmin, getAllUsers);
router.get("/users/:id", protectAdmin, getUserById);
router.delete("/users/:id", protectAdmin, deleteUser);

// Order routes
router.get("/orders", protectAdmin, getAllOrders);
router.get("/orders/user/:userId", protectAdmin, getOrdersByUserId);
router.put("/orders/:id", protectAdmin, updateOrderStatus);

// Product routes
router.post("/products/add", protectAdmin, addProduct);
router.get("/products", protectAdmin, getAllProducts);
router.put("/products/:id", protectAdmin, updateProduct);
router.delete("/products/:id", protectAdmin, deleteProduct);

// Payment routes ✅
router.get("/payments", protectAdmin, getPaymentHistory); 
router.get("/payments/user/:userId", protectAdmin, getPaymentsByUserId); 

// Dashboard
router.get("/dashboard/stats", protectAdmin, getDashboardStats);

export default router;
