import { Order } from "../models/Order.js";
import { Cart } from "../models/Cart.js";
import { Payment } from "../models/Payment.js";

// -----------------------------------------------------
// PLACE ORDER
// -----------------------------------------------------
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const {
      deliveryAddress,
      paymentMethod,
      upiId,
      cardDetails,
      items,
      totalAmount,
    } = req.body;

    // Log to debug
    console.log("📦 Incoming Order:", req.body);
    console.log("🟦 Auth User:", req.user);

    // ---- Fetch cart from DB ----
    let cart = await Cart.findOne({ userId });

    // If DB cart empty → use frontend items
    if ((!cart || cart.items.length === 0) && items?.length > 0) {
      cart = {
        items: items.map((i) => ({
          productId: i.productId,
          name: i.title || i.name, // FIXED — always give name
          price: i.price,
          quantity: i.quantity,
          image: i.image || null,
          images: i.images || [],
        })),
        totalPrice: totalAmount,
      };
    }

    // Still empty → reject
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty!" });
    }

    if (!deliveryAddress || !paymentMethod) {
      return res.status(400).json({
        message: "deliveryAddress & paymentMethod required",
      });
    }

    // ---- CREATE ORDER ----
    const newOrder = await Order.create({
      userId,
      items: cart.items,
      totalPrice: cart.totalPrice,
      deliveryAddress,
      paymentMethod,
      status: paymentMethod === "COD" ? "Pending" : "Processing",
    });

    // ---- PAYMENT ----
    let paymentInfo = {
      orderId: newOrder._id,
      userId,
      amount: cart.totalPrice,
      paymentMethod,
    };

    if (paymentMethod === "COD") {
      paymentInfo.paymentStatus = "Pending";
    }

    if (paymentMethod === "UPI") {
      if (!upiId)
        return res.status(400).json({ message: "UPI ID is required" });

      paymentInfo.paymentStatus = "Completed";
      paymentInfo.upiId = upiId;
      paymentInfo.transactionId = "TXN-" + Date.now();
    }

    if (paymentMethod === "Card") {
      if (!cardDetails?.cardNumber)
        return res.status(400).json({ message: "Card details missing" });

      paymentInfo.paymentStatus = "Completed";
      paymentInfo.cardDetails = cardDetails;
      paymentInfo.transactionId = "TXN-" + Date.now();
    }

    const payment = await Payment.create(paymentInfo);

    // ---- CLEAR DB CART ----
    if (cart?._id) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
      payment,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// -----------------------------------------------------
// GET ORDERS BY USER
// -----------------------------------------------------
export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// -----------------------------------------------------
// GET ORDER BY ID
// -----------------------------------------------------
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

// -----------------------------------------------------
// UPDATE ORDER STATUS (Admin)
// -----------------------------------------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// -----------------------------------------------------
// CANCEL ORDER
// -----------------------------------------------------
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
