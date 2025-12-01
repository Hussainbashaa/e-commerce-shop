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
        productId: {
          type: String, // FIXED!
          required: false,
        },
        name: { type: String, required: true },
        image: { type: String, default: null },
        images: { type: [String], default: [] },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
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
