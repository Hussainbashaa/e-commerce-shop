import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: String,
    name: String,
    brand: String,
    category: String,

    price: Number,

    images: {
      type: [String],
      default: [],
    },

    thumbnail: {
      type: String,
      default: "",
    },
  },
  { strict: false }
);

export const Product = mongoose.model("Product", productSchema);
