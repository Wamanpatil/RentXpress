import Booking from "../models/Booking.js";
import Item from "../models/Item.js";
import User from "../models/User.js";

export const addBooking = async (req, res) => {
  try {
    const { itemId, userId, startDate, endDate, totalPrice } = req.body;
    if (!itemId || !userId || !startDate || !endDate || !totalPrice)
      return res.status(400).json({ success: false, message: "⚠️ Missing fields." });

    const item = await Item.findById(itemId);
    const user = await User.findById(userId);
    if (!item || !user)
      return res.status(404).json({ success: false, message: "❌ Invalid item or user." });

    const newBooking = new Booking({ item: itemId, user: userId, startDate, endDate, totalPrice });
    await newBooking.save();
    res.status(201).json({ success: true, message: "✅ Booking successful!", booking: newBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: "🚫 Failed to create booking.", error: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("item", "name category price")
      .populate("user", "name email");
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "🚫 Failed to fetch bookings." });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate("item", "name category price location");
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "🚫 Failed to fetch user bookings." });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ success: false, message: "⚠️ Booking not found." });

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "✅ Booking deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "🚫 Failed to delete booking." });
  }
};
