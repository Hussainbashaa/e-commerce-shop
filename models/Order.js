import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        image: String,
        quantity: Number,
        price: Number,
      },
    ],
    totalPrice: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Processing",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
