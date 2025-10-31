import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "dotenv";
import dotenv from "dotenv";
import UserRouter from "./routes/userRoutes.js";
import ProductRouter from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRouters from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
// import paymentRouter from "./routes/paymentRoutes.js";
import adminAuthRoutes from "./routes/adminRoutes.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
config({ path: ".env" });
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
  .then(() => console.log("mongoDB connected ..!"))
  .catch((error) => console.log(error));

//! Routes
app.use("/api", UserRouter);
app.use("/api", ProductRouter);
app.use("/api", cartRoutes);
app.use("/api", orderRouter);
// app.use("/api", paymentRouter);

//!auth routes
app.use("/api", authRouters);
app.use("/api/admin", adminAuthRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
