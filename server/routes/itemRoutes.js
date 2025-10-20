import express from "express";
import { addReview, getReviewsByItem } from "../controllers/reviewController.js";

const router = express.Router();

// Add a review
router.post("/add", addReview);

// Get reviews for specific item
router.get("/item/:itemId", getReviewsByItem);

export default router;
