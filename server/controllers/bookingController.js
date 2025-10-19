import Booking from "../models/bookingModel.js";
import Item from "../models/itemModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

// ✅ Create Booking
export const createBooking = async (req, res) => {
  try {
    console.log("📥 Booking Request Body:", req.body);
    const { itemId, startDate, endDate, totalPrice, userId } = req.body;

    let finalUserId = userId;
    if (!finalUserId && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        finalUserId = decoded.id;
      } catch {
        console.log("⚠️ Invalid or missing token");
      }
    }

    if (!finalUserId || !itemId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const userExists = await User.findById(finalUserId);
    if (!userExists) return res.status(404).json({ success: false, message: "User not found" });

    const itemExists = await Item.findById(itemId);
    if (!itemExists) return res.status(404).json({ success: false, message: "Item not found" });

    const booking = new Booking({
      user: finalUserId,
      item: itemId,
      startDate,
      endDate,
      totalPrice,
      status: "confirmed",
    });

    await booking.save();
    console.log("✅ Booking created:", booking._id);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (err) {
    console.error("❌ Error in createBooking:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};

// ✅ Get All Bookings
export const getAllBookings = async (req, res) => {
  try {
    console.log("📡 Fetching all bookings...");
    const bookings = await Booking.find().populate("item").populate("user");
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Error fetching bookings:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

// ✅ Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(`📡 Fetching bookings for user: ${userId}`);
    const bookings = await Booking.find({ user: userId }).populate("item");
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Error fetching user bookings:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch user bookings" });
  }
};

// ✅ Delete Booking
export const deleteBooking = async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Booking not found" });
    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting booking:", err.message);
    res.status(500).json({ success: false, message: "Failed to delete booking" });
  }
};
