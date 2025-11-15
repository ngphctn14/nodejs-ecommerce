import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import productImageRoutes from "./routes/productImageRoutes.js";
import productVariantRoutes from "./routes/productVariantRoutes.js";

import cartRoutes from "./routes/cartRoutes.js";
import cartItemRoutes from "./routes/cartItemRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import orderItemRoutes from "./routes/orderItemRoutes.js";

import paymentRoutes from "./routes/paymentRoutes.js";

import connectDB from "./config/db.js";
import passport from "./config/passport.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/addresses", addressRoutes);

app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

app.use("/api/product-images", productImageRoutes);
app.use("/api/product-variants", productVariantRoutes);

app.use("/api/carts", cartRoutes);
app.use("/api/cart-items", cartItemRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);

app.use("/api/payments/vnpay", paymentRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});