import express from "express";
import {
  addBooking,
  getAllBookings,
  getBookingsByUser,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", addBooking);
router.get("/", getAllBookings);
router.get("/user/:userId", getBookingsByUser);
router.delete("/:id", deleteBooking);

export default router;
