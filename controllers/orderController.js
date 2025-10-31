import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Payment } from "../models/Payment.js";

//! place an order

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { deliveryAddress, paymentMethod, upiId, cardDetails } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty!" });
    }

    // Validate required fields
    if (!deliveryAddress || !paymentMethod) {
      return res
        .status(400)
        .json({ message: "deliveryAddress and paymentMethod are required" });
    }

    // Create the order first (for all methods)
    const newOrder = new Order({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      deliveryAddress,
      paymentMethod,
      status: paymentMethod === "COD" ? "Pending" : "Processing",
    });

    await newOrder.save();

    // Handle payment logic
    let payment;

    if (paymentMethod === "COD") {
      payment = await Payment.create({
        orderId: newOrder._id,
        userId,
        amount: cart.totalPrice,
        paymentMethod,
        paymentStatus: "Pending",
        transactionId: null,
      });
    } else if (paymentMethod === "UPI") {
      if (!upiId) {
        return res
          .status(400)
          .json({ message: "UPI ID is required for UPI payments" });
      }

      payment = await Payment.create({
        orderId: newOrder._id,
        userId,
        amount: cart.totalPrice,
        paymentMethod,
        paymentStatus: "Completed",
        upiId,
        transactionId: "TXN-" + Date.now().toString(),
      });
    } else if (paymentMethod === "Card") {
      if (!cardDetails || !cardDetails.cardNumber) {
        return res
          .status(400)
          .json({ message: "Card details are required for card payments" });
      }

      payment = await Payment.create({
        orderId: newOrder._id,
        userId,
        amount: cart.totalPrice,
        paymentMethod,
        paymentStatus: "Completed",
        cardDetails,
        transactionId: "TXN-" + Date.now().toString(),
      });
    } else {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Clear cart after order & payment success
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message:
        paymentMethod === "COD"
          ? "Order placed successfully with Cash on Delivery!"
          : "Payment successful, order is being processed!",
      order: newOrder,
      payment,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//! get users orders
export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ message: "your orders", success: true, orders });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
//! get order by an id
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//!update order status

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

//! Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "You can only cancel pending orders" });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
