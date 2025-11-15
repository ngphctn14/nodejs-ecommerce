import express from "express";
import {
  getCart,
  createCart,
  updateCart,
  deleteCart,
} from "../controllers/cartController.js";

import { getCartItemsByCartId } from "../controllers/cartItemController.js";

const router = express.Router();

router.get("/:id", getCart);
router.get("/:cartId/items", getCartItemsByCartId);
router.post("/", createCart);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

export default router;
