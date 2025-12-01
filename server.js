import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Load env vars first
dotenv.config();

import UserRouter from "./routes/userRoutes.js";
import ProductRouter from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRouters from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import adminAuthRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "Nodejs_practice_shop",
  })
  .then(() => console.log(" MongoDB connected"))
  .catch((error) => console.log(" MongoDB connection error:", error));

// routes
app.use("/api", UserRouter);
app.use("/api", ProductRouter);
app.use("/api", cartRoutes);
app.use("/api", orderRouter);
app.use("/api", authRouters);
app.use("/api/admin", adminAuthRoutes);

app.listen(process.env.PORT, () => {
  console.log(` Server running on port ${process.env.PORT}`);
});
