// server/controllers/bookingController.js
import Booking from "../models/bookingModel.js";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";

// ✅ Add a new booking
export const addBooking = async (req, res) => {
  try {
    const { itemId, userId, startDate, endDate, totalPrice } = req.body;

    // Validate inputs
    if (!itemId || !userId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Missing booking details.",
      });
    }

    // Check if user and item exist
    const item = await Item.findById(itemId);
    const user = await User.findById(userId);
    if (!item || !user) {
      return res.status(404).json({
        success: false,
        message: "❌ Invalid user or item ID.",
      });
    }

    // Check for overlapping bookings (optional but safe)
    const conflict = await Booking.findOne({
      item: itemId,
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $lte: endDate, $gte: startDate } },
      ],
    });
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: "⚠️ Item already booked for selected dates.",
      });
    }

    // Create booking
    const newBooking = new Booking({
      item: itemId,
      user: userId,
      startDate,
      endDate,
      totalPrice,
    });

    await newBooking.save();
    console.log("✅ Booking saved:", newBooking._id);

    res.status(201).json({
      success: true,
      message: "✅ Booking successful!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("❌ Booking error:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to create booking.",
      error: error.message,
    });
  }
};

// ✅ Get all bookings (for admin or debug)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("item", "name category price location")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("❌ Fetch all bookings error:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to fetch bookings.",
      error: error.message,
    });
  }
};

// ✅ Get bookings by a specific user
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId })
      .populate("item", "name category price location image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("❌ Fetch user bookings error:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to fetch user bookings.",
      error: error.message,
    });
  }
};

// ✅ Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "⚠️ Booking not found.",
      });
    }

    await Booking.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "✅ Booking deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Delete booking error:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to delete booking.",
      error: error.message,
    });
  }
};
