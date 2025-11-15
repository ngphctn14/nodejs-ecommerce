import express from "express";
import {
  getProductImage,
  createProductImage,
  updateProductImage,
  deleteProductImage,
} from "../controllers/productImageController.js";

const router = express.Router();

router.get("/:id", getProductImage);
router.post("/", createProductImage);
router.put("/:id", updateProductImage);
router.delete("/:id", deleteProductImage);

export default router;
