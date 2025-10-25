import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import brandRoutes from "./routes/brandRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import productRoutes from "./routes/productRoute.js";
import addressRoutes from "./routes/addressRoute.js";
import productImageRoutes from "./routes/productImageRoute.js";
import productVariantRoutes from "./routes/productVariantRoute.js";

import cartRoutes from "./routes/cartRoute.js";
import cartItemRoutes from "./routes/cartItemRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import orderItemRoutes from "./routes/orderItemRoute.js";

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Hello"));
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

app.use("/api/ordres", orderRoutes);
app.use("/api/order-items", orderItemRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});