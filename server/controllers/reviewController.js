import Review from "../models/reviewModel.js"; // ✅ correct filename
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";

// ✅ Add Review
export const addReview = async (req, res) => {
  try {
    const { itemId, userId, rating, comment } = req.body;

    if (!itemId || !userId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "⚠️ All fields are required.",
      });
    }

    const item = await Item.findById(itemId);
    const user = await User.findById(userId);

    if (!item || !user) {
      return res.status(404).json({
        success: false,
        message: "❌ Item or User not found.",
      });
    }

    const review = new Review({
      item: itemId,
      user: userId,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "✅ Review added successfully.",
      review,
    });
  } catch (error) {
    console.error("❌ Add Review Error:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to add review.",
      error: error.message,
    });
  }
};

// ✅ Get Reviews by Item
export const getReviewsByItem = async (req, res) => {
  try {
    const reviews = await Review.find({ item: req.params.itemId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("❌ Fetch Reviews Error:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to fetch reviews.",
      error: error.message,
    });
  }
};
