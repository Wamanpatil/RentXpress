import express from "express";
import { addReview, getReviewsByItem } from "../controllers/reviewController.js";

const router = express.Router();

// ✅ Add Review
router.post("/add", addReview);

// ✅ Get Reviews for an Item
router.get("/item/:itemId", getReviewsByItem);

export default router;
