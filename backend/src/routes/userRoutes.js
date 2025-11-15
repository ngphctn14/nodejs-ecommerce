import express from "express";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", authenticateUser, (req, res) => {
  res.json({ message: "User profile", user: req.user });
});

export default router;