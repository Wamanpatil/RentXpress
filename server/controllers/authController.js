import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * ✅ Register a new user
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "⚠️ All fields are required." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "⚠️ Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default role
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "✅ User registered successfully.",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ success: false, message: "🚫 Failed to register user." });
  }
};

/**
 * ✅ Login user
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "⚠️ Email and password required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "❌ User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ success: false, message: "⚠️ Invalid credentials." });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "✅ Login successful.",
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ success: false, message: "🚫 Failed to log in." });
  }
};

/**
 * ✅ Get all users (Admin Dashboard)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email role createdAt");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("❌ Fetch Users Error:", error);
    res.status(500).json({ success: false, message: "🚫 Failed to fetch users." });
  }
};
