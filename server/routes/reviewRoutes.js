import express from "express";
import { addReview, getReviewsByItem } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", addReview);
router.get("/:itemId", getReviewsByItem);

export default router;
