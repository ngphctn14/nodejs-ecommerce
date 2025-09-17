import express from "express";
import { auth } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", auth, (req, res) => {
  res.json({ message: "User profile", user: req.user });
});

export default router;