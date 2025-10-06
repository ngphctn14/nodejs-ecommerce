import express from "express";
import {
  getProductVariant,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
} from "../controllers/productVariantController.js";

const router = express.Router();

router.get("/:id", getProductVariant);
router.post("/", createProductVariant);
router.put("/:id", updateProductVariant);
router.delete("/:id", deleteProductVariant);

export default router;
