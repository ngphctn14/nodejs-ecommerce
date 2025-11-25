import express from "express";
import { updateUserProfile, changeUserPassword, getUsers, updateUser, changeBanStatus } from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.put("/profile", authenticateUser, updateUserProfile);
router.put("/change-password", authenticateUser, changeUserPassword);
router.get("/", getUsers)
router.put("/:id", updateUser)
router.patch("/:id/ban-status", changeBanStatus)
export default router;