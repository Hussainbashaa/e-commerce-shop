import { Product } from "../models/Product.js";

//! create a product
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      message: "Product created successfully",
      product: product,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
//! get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      return res
        .status(404)
        .json({ message: "No products found", success: false });
    }
    res.status(200).json({
      message: "Products fetched successfully",
      products: products,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
//! get single product by id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product: product,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
//! update product by id
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct)
      return res.json({
        message: "Product not found",
        success: false,
      });
    res.json({
      message: "Product updated successfully",
      product: updatedProduct,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
//! delete product by id
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }
    res
      .status(200)
      .json({ message: "Product deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//! search product by name,price,category
export const searchProduct = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        message: "enter either name ,price or category to be searched",
      });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },

        ...(isNaN(Number(query)) ? [] : [{ price: Number(query) }]),
      ],
    });
    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found", success: false });
    }
    res.status(200).json({
      message: "Products fetched successfully",
      products: products,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
