import express from "express";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";
import Item from "../models/itemModel.js";
import Booking from "../models/bookingModel.js";

const router = express.Router();

// ✅ Get all users (admin)
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json({ users });
});

// ✅ Get all items with owner info
router.get("/items", requireAuth, requireAdmin, async (req, res) => {
  const items = await Item.find({}).populate("owner", "name email role");
  res.json({ items });
});

// ✅ Get all bookings (with renter & owner populated)
router.get("/bookings", requireAuth, requireAdmin, async (req, res) => {
  const bookings = await Booking.find({})
    .populate("user", "name email")
    .populate({
      path: "item",
      populate: { path: "owner", select: "name email" },
    });

  res.json({ bookings });
});

// ✅ Delete an item (admin)
router.delete("/items/:id", requireAuth, requireAdmin, async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "🗑️ Item deleted successfully" });
});

export default router;
