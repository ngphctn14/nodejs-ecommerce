import express from "express";
import {
  getOrder,
  getOrdersByUserId,
  createOrder,
  updateOrder,
  deleteOrder,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { getOrderItemsByOrderId } from "../controllers/orderItemController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/my-orders", authenticateUser, getOrdersByUserId);
router.get("/:id", getOrder);
router.get("/", getAllOrders)
router.get("/:orderId/items", getOrderItemsByOrderId);
router.post("/", createOrder);
router.put("/:id/status", updateOrderStatus);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;
