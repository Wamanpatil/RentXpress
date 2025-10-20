// server/routes/reviewRoutes.js
import express from "express";
import { addReview, getReviewsByItem } from "../controllers/reviewController.js";

const router = express.Router();

/**
 * ✅ Add new review
 * POST /api/reviews/add
 */
router.post("/add", addReview);

/**
 * ✅ Get reviews for a specific item
 * GET /api/reviews/item/:itemId
 */
router.get("/item/:itemId", getReviewsByItem);

export default router;
