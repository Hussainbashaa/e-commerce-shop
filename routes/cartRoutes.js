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

// =============================
// CART ROUTES
// =============================

// Get user cart
router.get("/user/cart", authMiddleware, getUserCart);

// Add item to cart
router.post("/user/cart/add", authMiddleware, addToCart);

// Update quantity ✔ fixed
router.put("/user/cart/update/:productId", authMiddleware, updateUserCart);

// Delete specific item ✔ fixed
router.delete(
  "/user/cart/delete/:productId",
  authMiddleware,
  deleteItemFromCart
);

// Clear entire cart
router.delete("/user/cart/clear", authMiddleware, clearCart);

export default router;
