import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// ✅ Create new booking
router.post("/", createBooking);

// ✅ Get all bookings (admin)
router.get("/", getAllBookings);

// ✅ Get user-specific bookings
router.get("/user/:id", getUserBookings);

// ✅ Delete a booking
router.delete("/:id", deleteBooking);

export default router;
