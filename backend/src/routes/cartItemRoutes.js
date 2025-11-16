import express from "express";
import {
  getCartItemsByCartId,
  createCartItem,
  updateCartItem,
  deleteCartItem,
  increaseQuantity,
  decreaseQuantity,
} from "../controllers/cartItemController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/:cartId", getCartItemsByCartId);
router.post("/", authenticateUser, createCartItem);
router.put("/:id", updateCartItem);
router.put("/:id/increase", increaseQuantity);
router.put("/:id/decrease", decreaseQuantity);
router.delete("/:id", deleteCartItem);

export default router;
