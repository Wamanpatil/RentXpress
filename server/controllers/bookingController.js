import Booking from "../models/bookingModel.js";
import Item from "../models/itemModel.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const createBooking = async (req, res) => {
  try {
    console.log("📥 Incoming Booking Request Body:", req.body);

    const { itemId, startDate, endDate, totalPrice, userId } = req.body;

    // ✅ Step 1: Get user ID from token if not provided
    let finalUserId = userId;
    if (!finalUserId && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        finalUserId = decoded.id;
      } catch (err) {
        console.log("⚠️ Invalid or missing token:", err.message);
      }
    }

    // ✅ Step 2: Validate required fields
    if (!finalUserId || !itemId || !startDate || !endDate || !totalPrice) {
      console.log("⚠️ Missing required booking fields.");
      return res.status(400).json({
        success: false,
        message: "Missing required booking fields",
      });
    }

    // ✅ Step 3: Verify user exists
    const userExists = await User.findById(finalUserId);
    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Step 4: Verify item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // ✅ Step 5: Create booking
    const booking = new Booking({
      user: finalUserId,
      item: itemId,
      startDate,
      endDate,
      totalPrice,
      status: "confirmed",
    });

    await booking.save();

    console.log("✅ Booking saved successfully:", booking);
    res.status(201).json({ success: true, message: "Booking confirmed", booking });
  } catch (err) {
    console.error("❌ Error creating booking:", err.message);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// ✅ Get all bookings (for admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("item user");
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch bookings", error: err.message });
  }
};

// ✅ Get user-specific bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;
    const bookings = await Booking.find({ user: userId }).populate("item");
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user bookings", error: err.message });
  }
};

// ✅ Delete booking (Admin)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete booking", error: err.message });
  }
};
