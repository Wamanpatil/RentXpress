// server/controllers/reviewController.js
import Review from "../models/review.js";      // <-- ensure file name matches models/review.js
import Item from "../models/item.js";          // or itemModel.js — use the exact filename in your repo
import User from "../models/user.js";

export const addReview = async (req, res) => {
  try {
    const { itemId, userId, rating, comment } = req.body;
    if (!itemId || !userId || !rating || !comment) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    const item = await Item.findById(itemId);
    const user = await User.findById(userId);
    if (!item || !user) return res.status(404).json({ success: false, message: "Item or user not found" });

    const review = new Review({ item: itemId, user: userId, rating, comment });
    await review.save();

    res.status(201).json({ success: true, message: "Review added", review });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ success: false, message: "Failed to add review", error: err.message });
  }
};

export const getReviewsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ item: itemId }).populate("user", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};
