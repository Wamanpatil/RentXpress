import express from "express";
import { addReview, getReviewsByItem } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/add", addReview);
router.get("/item/:itemId", getReviewsByItem);

export default router;
