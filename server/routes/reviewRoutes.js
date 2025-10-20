// server/routes/reviewRoutes.js
import express from "express";
import { addReview, getReviewsByItem } from "../controllers/reviewController.js";

const router = express.Router();

/**
 * 📝 Add Review (POST)
 * Endpoint: /api/reviews/add
 */
router.post("/add", addReview);

/**
 * 📦 Get Reviews for an Item (GET)
 * Endpoint: /api/reviews/item/:itemId
 */
router.get("/item/:itemId", getReviewsByItem);

export default router;
