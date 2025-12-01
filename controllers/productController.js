import { Product } from "../models/Product.js";

// ---------------------------------------------------------
// CREATE PRODUCT
// ---------------------------------------------------------
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      images: req.body.images || [],
      thumbnail: req.body.thumbnail || req.body.images?.[0] || "",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------------------------------------------------
// GET ALL PRODUCTS
// ---------------------------------------------------------
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------------------------------------------------
// GET PRODUCT BY MONGO _id ONLY
// ---------------------------------------------------------
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------------------------------------------------
// UPDATE PRODUCT
// ---------------------------------------------------------
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        images: req.body.images || [],
        thumbnail: req.body.thumbnail || req.body.images?.[0],
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------------------------------------------------
// DELETE PRODUCT
// ---------------------------------------------------------
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// ---------------------------------------------------------
// SEARCH PRODUCT  (added here)
// ---------------------------------------------------------
export const searchProduct = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Please enter a search term",
      });
    }

    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json({ success: true, products });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
