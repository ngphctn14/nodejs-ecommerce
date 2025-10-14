import { login, logout, signup, getCurrentUser } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateUser, getCurrentUser);

export default router;