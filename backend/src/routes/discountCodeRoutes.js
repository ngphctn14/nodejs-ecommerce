import express from "express";
import {
  getDiscountCodes,
  createDiscountCode
} from "../controllers/discountCodeController.js";

const router = express.Router();

router.get("/", getDiscountCodes);
router.post("/", createDiscountCode)

export default router;