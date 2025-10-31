import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

//! Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [], totalPrice: 0 });

    cart.items.push({
      productId,
      name: product.name,
      image: product.image,
      quantity: quantity,
      price: product.price,
    });

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//! Get cart by user ID
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "your cart has", cart, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

//! update user cart
export const updateUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    if (quantity >= 1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();
    res.json({ message: "cart updates successfully", cart, success: true });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err: err.message });
  }
};
//! delete items from the cart
export const deleteItemFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();
    res.json({
      message: "cart deleted successfully ",
      cart,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err: err.message });
  }
};
//! delete entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.json({
      message: "cart deleted successfully ",
      cart,
      success: true,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err: err.message });
  }
};
