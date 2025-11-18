import {
  login,
  logout,
  signup,
  getCurrentUser,
  googleLogin,
  googleCallback,
  verifiyEmail,
  resendVerification,
  handleGuestFlow,
  verifyGuestToken,
  requestPasswordReset,
  resetPassword
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
router.post("/guest-checkout-init", handleGuestFlow);
router.get("/verify-guest-token", verifyGuestToken);
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

export default router;
