import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Ongoing", "Failed"],
      default: "Pending",
    },

    // UPI Payments
    upiId: {
      type: String,
      default: null,
    },

    // Card Payments — Never store CVV in production!!
    cardDetails: {
      cardNumber: { type: String, default: null },
      name: { type: String, default: null },
      expiry: { type: String, default: null },
    },

    transactionId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
