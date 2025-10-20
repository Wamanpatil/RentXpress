import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
} from "../controllers/authController.js";

const router = express.Router();

// ✅ Register
router.post("/register", registerUser);

// ✅ Login
router.post("/login", loginUser);

// ✅ Get all users (for Admin Dashboard)
router.get("/users", getAllUsers);

export default router;
