import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/authRoute.js";
import userRoutes from "./routes/userRoute.js";
import brandRoutes from "./routes/brandRoute.js"
import categoryRoutes from "./routes/categoryRoute.js"
import productRoutes from "./routes/productRoute.js"

import connectDB from "./config/db.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Hello"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// Connect to Atlas and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
