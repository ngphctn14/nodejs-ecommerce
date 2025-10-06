import express from "express";
import {createOrderItem, updateOrderItem, deleteOrderItem} from "../controllers/orderItemController.js";

const router = express.Router();

router.post("/", createOrderItem);
router.put("/:id", updateOrderItem);
router.delete("/:id", deleteOrderItem);

export default router;