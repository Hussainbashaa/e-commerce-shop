import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  // ACCEPT ANY PRODUCT ID TYPE (number or string)
  productId: {
    type: String,
    required: false,
  },

  // Support name/title
  name: { type: String, required: true },

  // Images support
  image: { type: String, default: null },
  images: { type: [String], default: [] },

  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [cartItemSchema],

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
