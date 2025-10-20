import express from "express";
import {
  addBooking,
  getAllBookings,
  getBookingsByUser,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// ✅ Create booking
router.post("/", addBooking);

// ✅ Get all bookings (admin)
router.get("/", getAllBookings);

// ✅ Get bookings by user ID
router.get("/user/:userId", getBookingsByUser);

// ✅ Delete booking
router.delete("/:id", deleteBooking);

export default router;
