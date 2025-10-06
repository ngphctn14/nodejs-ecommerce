import express from "express";
import {
  getCartItemsByCartId,
  createCartItem,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cartItemController.js";

const router = express.Router();
router.post("/", createCartItem);
router.put("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);

export default router;
