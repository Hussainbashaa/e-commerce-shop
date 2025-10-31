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

//!create a product
router.post("/product/create", createProduct);
//! search products by name price category
router.get("/product/allproducts/search", searchProduct);
//!get all products
router.get("/product/allproducts", getAllProducts);
//!get single product by id
router.get("/product/allproducts/:id", getProductById);
//!update product by id
router.put("/product/allproducts/update/:id", updateProductById);
//! delete product by id
router.delete("/product/allproducts/delete/:id", deleteProductById);

export default router;
