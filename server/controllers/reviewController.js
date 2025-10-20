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

    const item = await Item.findById(itemId);
    const user = await User.findById(userId);
    if (!item || !user) {
      return res.status(404).json({ success: false, message: "❌ Invalid item or user." });
    }

    const review = new Review({ item: itemId, user: userId, rating, comment });
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
    const reviews = await Review.find({ item: itemId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (err) {
    console.error("❌ Get Reviews Error:", err);
    res.status(500).json({ success: false, message: "🚫 Failed to fetch reviews.", error: err.message });
  }
};
