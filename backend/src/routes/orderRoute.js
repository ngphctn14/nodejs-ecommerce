import express from "express";
import {
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import { getOrderItemsByOrderId } from "../controllers/orderItemController.js";

const router = express.Router();

router.get("/:id", getOrder);
router.get("/:orderId/items", getOrderItemsByOrderId);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
