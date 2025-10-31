import express from "express";
import {
  cancelOrder,
  getOrderById,
  getOrdersByUser,
  placeOrder,
} from "../controllers/orderController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/user/orderitem", authMiddleware, placeOrder);
router.get("/user/myorders", authMiddleware, getOrdersByUser);
router.get("/user/myorders/order/:orderId", authMiddleware, getOrderById);
router.delete("/user/myorders/ordercancel/:orderId", authMiddleware, cancelOrder);

export default router;
