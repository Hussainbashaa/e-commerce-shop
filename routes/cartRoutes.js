import express from "express";
import {
  addToCart,
  clearCart,
  deleteItemFromCart,
  getUserCart,
  updateUserCart,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
const router = express.Router();

//!routes
router.get("/user/cart", authMiddleware, getUserCart);
router.post("/user/cart/add", authMiddleware, addToCart);
router.put("/user/cart/update", authMiddleware, updateUserCart);
router.delete("/user/cart/delete", authMiddleware, deleteItemFromCart);
router.delete("/user/cart/clearcart", authMiddleware, clearCart);
export default router;
