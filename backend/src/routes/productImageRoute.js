import express from "express";
import {
  getProductImages,
  getProductImage,
  createProductImage,
  updateProductImage,
  deleteProductImage,
} from "../controllers/productImageController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getProductImages);
router.get("/:id", getProductImage);
router.post("/", createProductImage);
router.put("/:id", updateProductImage);
router.delete("/:id", deleteProductImage);

export default router;
