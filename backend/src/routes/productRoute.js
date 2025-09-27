import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import productVariantRoutes from "./productVariantRoute.js";
import productImageRoutes from "./productImageRoute.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.use("/:productId/variants", productVariantRoutes);
router.use("/:productId/images", productImageRoutes);

export default router;
