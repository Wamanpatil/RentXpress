import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/user/:id", getUserBookings);
router.delete("/:id", deleteBooking);

export default router;
