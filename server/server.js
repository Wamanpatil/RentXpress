// ✅ Import dependencies
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import cloudinary from "./config/cloudinary.js";

// ✅ Import routes
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// ✅ Load environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// ✅ Allowed Origins for CORS (Production + Dev)
const allowedOrigins = [
  "http://localhost:5173",            // Local development (Vite)
  "https://rentxpress.netlify.app",   // ✅ Your live frontend (Netlify)
  "https://rentxpress.onrender.com"   // ✅ Backend itself
];

// ✅ Advanced CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server calls

      if (allowedOrigins.includes(origin)) {
        console.log("✅ CORS allowed origin:", origin);
        callback(null, true);
      } else {
        console.warn("🚫 CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests explicitly
app.options("*", cors());

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 RentXpress Backend Running Successfully!",
  });
});

// ✅ API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `🚫 Route not found: ${req.originalUrl}`,
  });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

// ✅ Cloudinary connection check
(async () => {
  try {
    await cloudinary.api.ping();
    console.log("✅ Cloudinary Connected Successfully");
  } catch (error) {
    console.warn("⚠️ Cloudinary Connection Failed:", error.message);
  }
})();

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("\n===============================");
  console.log(`✅ RentXpress Server running on port ${PORT}`);
  console.log(`🌐 Access API at: https://rentxpress.onrender.com`);
  console.log("===============================\n");
});
