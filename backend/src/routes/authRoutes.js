import {
  login,
  logout,
  signup,
  getCurrentUser,
  googleLogin,
  googleCallback,
  verifiyEmail,
  resendVerification,
} from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authenticateUser, getCurrentUser);
router.get("/google", googleLogin);
router.get("/oauth2/redirect", googleCallback);
router.get("/verify-email", verifiyEmail);
router.post("/resend-verification", resendVerification);

export default router;
