// server/controllers/reviewController.js
import Review from "../models/reviewModel.js";   // ✅ Match actual file name in your models folder
import Item from "../models/itemModel.js";       // ✅ Match actual file name
import User from "../models/userModel.js";       // ✅ Match actual file name

/**
 * 📝 Add a new review
 */
export const addReview = async (req, res) => {
  try {
    const { itemId, userId, rating, comment } = req.body;

    // ✅ Validation
    if (!itemId || !userId || !rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "⚠️ All fields are required." });
    }

    // ✅ Ensure referenced item & user exist
    const item = await Item.findById(itemId);
    const user = await User.findById(userId);

    if (!item || !user) {
      return res
        .status(404)
        .json({ success: false, message: "❌ Item or user not found." });
    }

    // ✅ Create and save review
    const review = new Review({
      item: itemId,
      user: userId,
      rating,
      comment,
    });

    await review.save();

    res
      .status(201)
      .json({ success: true, message: "✅ Review added successfully!", review });
  } catch (err) {
    console.error("❌ Add review error:", err);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to add review.",
      error: err.message,
    });
  }
};

/**
 * 📦 Get all reviews for a specific item
 */
export const getReviewsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    // ✅ Fetch and populate with user info
    const reviews = await Review.find({ item: itemId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error("❌ Get reviews error:", err);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to fetch reviews.",
      error: err.message,
    });
  }
};
