import express from "express";
import { updateUserProfile, changeUserPassword } from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/profile", authenticateUser, updateUserProfile);
router.put("/change-password", authenticateUser, changeUserPassword);

export default router;