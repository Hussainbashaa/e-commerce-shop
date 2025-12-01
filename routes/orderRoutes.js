import express from "express";
import {
  cancelOrder,
  getOrderById,
  getOrdersByUser,
  placeOrder,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Place an order
router.post("/user/orders", authMiddleware, placeOrder);

// Get all orders of logged-in user
router.get("/user/orders", authMiddleware, getOrdersByUser);

// Get a single order
router.get("/user/orders/:orderId", authMiddleware, getOrderById);

// Cancel an order
router.delete("/user/orders/:orderId", authMiddleware, cancelOrder);

export default router;
