// server/routes/bookingRoutes.js
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

// ✅ Get all bookings
router.get("/", getAllBookings);

// ✅ Get user-specific bookings
router.get("/user/:userId", getBookingsByUser);

// ✅ Delete a booking
router.delete("/:id", deleteBooking);

export default router;
