import Review from "../models/reviewModel.js";
import Item from "../models/Item.js";
 // ✅ No curly braces



// ✅ Add a review
export const addReview = async (req, res) => {
  try {
    const { itemId, user, rating, comment } = req.body;

    if (!itemId || !user || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const review = await Review.create({ item: itemId, user, rating, comment });
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to add review", error: error.message });
  }
};

// ✅ Get reviews for an item
export const getReviewsByItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const reviews = await Review.find({ item: itemId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};
