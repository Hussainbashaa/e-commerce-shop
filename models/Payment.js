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
    upiId: {
      type: String,
    },
    cardDetails: {
      cardNumber: String,
      expiryDate: String,
      cvv: String,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
