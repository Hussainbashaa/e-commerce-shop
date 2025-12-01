import express from "express";
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  searchProduct,
  updateProductById,
} from "../controllers/productController.js";

const router = express.Router();

// Create
router.post("/products", createProduct);

// Read all
router.get("/products", getAllProducts);

// Search
router.get("/products/search", searchProduct);

// Read one
router.get("/products/:id", getProductById);

// Update
router.put("/products/:id", updateProductById);

// Delete
router.delete("/products/:id", deleteProductById);

export default router;
