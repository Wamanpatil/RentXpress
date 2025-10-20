// server/routes/bookingRoutes.js
import express from "express";
import {
  addBooking,
  getAllBookings,
  getBookingsByUser,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// ✅ Create new booking
router.post("/", addBooking);

// ✅ Get all bookings (admin/debug)
router.get("/", getAllBookings);

// ✅ Get user-specific bookings
router.get("/user/:userId", getBookingsByUser);

// ✅ Delete booking by ID
router.delete("/:id", deleteBooking);

export default router;
