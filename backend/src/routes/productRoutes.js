import express from "express";
import {
  getProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByBrand,
  getProductsByCategory,
  getProductFilters
} from "../controllers/productController.js";

import { getProductVariantsByProductId } from "../controllers/productVariantController.js";
import { getProductImagesByProductId } from "../controllers/productImageController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/filters", getProductFilters);
router.get("/:id", getProductDetails);
router.get("/brand/:slug", getProductsByBrand);
router.get("/category/:slug", getProductsByCategory);
router.get("/:productId/variants", getProductVariantsByProductId);
router.get("/:productId/images", getProductImagesByProductId);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
