// server/routes/bookingRoutes.js
import express from "express";
import mongoose from "mongoose";
import Booking from "../models/bookingModel.js"; // ✅ corrected import

const router = express.Router();

// ✅ Create a new booking
router.post("/", async (req, res) => {
  try {
    const { itemId, userId, startDate, endDate } = req.body;

    if (!itemId || !userId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newBooking = new Booking({
      itemId: new mongoose.Types.ObjectId(itemId),
      userId: new mongoose.Types.ObjectId(userId),
      startDate,
      endDate,
    });

    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
});

// ✅ Get all bookings (optional)
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("itemId").populate("userId");
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

export default router;
