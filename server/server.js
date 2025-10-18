// ✅ Import dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

// ✅ Import route files
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ Admin route

// ✅ Initialize environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();

// ✅ Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect to MongoDB
(async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
})();

// ✅ Middleware Setup
app.use(
  cors({
    origin: ["http://localhost:5173"], // Frontend URL (Vite)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // Prevent large body payloads
app.use(express.urlencoded({ extended: true }));

// ✅ Serve uploaded images (local uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Root Route (Health Check)
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 RentXpress Backend Running Successfully!",
    version: "3.3.0",
    serverTime: new Date().toLocaleString(),
  });
});

// ✅ API Routes
app.use("/api/auth", authRoutes);        // Authentication routes
app.use("/api/items", itemRoutes);       // Item CRUD
app.use("/api/bookings", bookingRoutes); // Booking CRUD
app.use("/api/reviews", reviewRoutes);   // Review system
app.use("/api/admin", adminRoutes);      // ✅ Admin operations

// ✅ 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `🚫 Route not found: ${req.originalUrl}`,
  });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// ✅ Cloudinary Connection Check
(async () => {
  try {
    await cloudinary.api.ping();
    console.log("✅ Cloudinary Connected Successfully");
  } catch (error) {
    console.warn("⚠️ Cloudinary Connection Failed:", error.message);
  }
})();

// ✅ Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\n===============================");
  console.log(`✅ RentXpress Server running on port ${PORT}`);
  console.log(`🌐 Access API at: http://localhost:${PORT}`);
  console.log("===============================\n");
});

// ✅ Handle unexpected promise rejections
process.on("unhandledRejection", (reason) => {
  console.error("⚠️ Unhandled Promise Rejection:", reason);
});
