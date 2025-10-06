import express from "express";
import {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/addressController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateUser);

router.post("/", createAddress);
router.get("/", getAddresses);
router.get("/", getAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
