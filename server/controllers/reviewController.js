// server/controllers/reviewController.js
import mongoose from "mongoose";
import Review from "../models/reviewModel.js";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";

// ✅ Add Review
export const addReview = async (req, res) => {
  try {
    const { itemId, userId, rating, comment } = req.body;

    if (!itemId || !userId || !rating || !comment) {
      return res.status(400).json({ success: false, message: "⚠️ All fields are required." });
    }

    // Convert IDs to ObjectId type safely
    const validItemId = new mongoose.Types.ObjectId(itemId);
    const validUserId = new mongoose.Types.ObjectId(userId);

    const item = await Item.findById(validItemId);
    const user = await User.findById(validUserId);

    if (!item || !user) {
      return res.status(404).json({ success: false, message: "❌ Invalid item or user." });
    }

    const review = new Review({
      item: validItemId,
      user: validUserId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json({
      success: true,
      message: "✅ Review added successfully!",
      review,
    });
  } catch (err) {
    console.error("❌ Add Review Error:", err);
    res.status(500).json({ success: false, message: "🚫 Failed to add review.", error: err.message });
  }
};

// ✅ Get Reviews for an Item
export const getReviewsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // Convert safely to ObjectId
    const validItemId = new mongoose.Types.ObjectId(itemId);

    const reviews = await Review.find({ item: validItemId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error("❌ Get Reviews Error:", err);
    res.status(500).json({ success: false, message: "🚫 Failed to fetch reviews.", error: err.message });
  }
};
