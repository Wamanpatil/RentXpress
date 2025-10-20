import Booking from "../models/bookingModel.js";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";

/**
 * ✅ Create a new booking
 */
export const addBooking = async (req, res) => {
  try {
    const { itemId, userId, startDate, endDate, totalPrice } = req.body;

    // Validate required fields
    if (!itemId || !userId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: "⚠️ All fields (itemId, userId, startDate, endDate, totalPrice) are required.",
      });
    }

    // Validate item and user existence
    const item = await Item.findById(itemId);
    const user = await User.findById(userId);

    if (!item || !user) {
      return res.status(404).json({
        success: false,
        message: "❌ Item or User not found.",
      });
    }

    // Create booking entry
    const newBooking = new Booking({
      item: item._id,
      user: user._id,
      startDate,
      endDate,
      totalPrice,
    });

    await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "✅ Booking successful!",
      booking: newBooking,
    });
  } catch (err) {
    console.error("❌ Booking creation error:", err);
    return res.status(500).json({
      success: false,
      message: "🚫 Failed to create booking.",
      error: err.message,
    });
  }
};

/**
 * ✅ Get all bookings (for admin dashboard)
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("item", "name category price location")
      .populate("user", "name email");
    return res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Fetch all bookings error:", err);
    return res.status(500).json({
      success: false,
      message: "🚫 Failed to fetch bookings.",
    });
  }
};

/**
 * ✅ Get bookings for a specific user
 */
export const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId)
      return res.status(400).json({ success: false, message: "⚠️ User ID is required." });

    const bookings = await Booking.find({ user: userId })
      .populate("item", "name category price location image");
    return res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Fetch user bookings error:", err);
    return res.status(500).json({
      success: false,
      message: "🚫 Failed to fetch user bookings.",
    });
  }
};

/**
 * ✅ Delete a booking
 */
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "⚠️ Booking not found." });

    await Booking.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "✅ Booking deleted successfully.",
    });
  } catch (err) {
    console.error("❌ Delete booking error:", err);
    return res.status(500).json({
      success: false,
      message: "🚫 Failed to delete booking.",
    });
  }
};
