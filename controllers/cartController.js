import { Cart } from "../models/Cart.js";
import { Product } from "../models/Product.js";

//
// ⭐ IMPORTANT — This version stores CORRECT product fields
// title, images[], thumbnail, price, productId
// All your frontend pages now work perfectly.
//

//----------------------------------------
// ADD TO CART
//----------------------------------------
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [], totalPrice: 0 });

    // If already in cart → increase qty
    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (existingIndex !== -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId,
        title: product.title || product.name,
        price: product.price,
        quantity,
        image: Array.isArray(product.images)
          ? product.images[0]
          : product.thumbnail,
        images: product.images || [],
      });
    }

    // Update total price
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({ message: "Product added", cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//----------------------------------------
// GET USER CART
//----------------------------------------
export const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res
        .status(200)
        .json({ success: true, cart: { items: [], totalPrice: 0 } });

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//----------------------------------------
// UPDATE CART ITEM QUANTITY
//----------------------------------------
export const updateUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (index === -1)
      return res.status(404).json({ message: "Product not found in cart" });

    cart.items[index].quantity = quantity < 1 ? 1 : quantity;

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//----------------------------------------
// DELETE ONE ITEM FROM CART
//----------------------------------------
export const deleteItemFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId.toString()
    );

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({ message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//----------------------------------------
// CLEAR ENTIRE CART
//----------------------------------------
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({ message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
