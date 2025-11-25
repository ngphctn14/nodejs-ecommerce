import express from "express";
import { getProductReviews, createReview } from "../controllers/reviewController.js";
// Import your optional auth middleware. 
// It should NOT block guests, but should populate req.user if a token is present.
import { authenticateUserOptional } from "../middlewares/authMiddleware.js"; 

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/", authenticateUserOptional, createReview);

export default router;