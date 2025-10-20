import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import itemRoutes from "./routes/itemRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cloudinary from "cloudinary";
import fileUpload from "express-fileupload";

// ✅ Initialize
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Dynamic path resolution (for static use if needed later)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS setup (Netlify + localhost)
const allowedOrigins = [
  "https://rentxpress.netlify.app", // ✅ your production frontend
  "http://localhost:5173",          // ✅ for local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Middleware setup
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true }));

// ✅ Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 15000, // handles MongoDB timeout better
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ Routes
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 RentXpress API running successfully!",
    environment: process.env.NODE_ENV || "development",
  });
});

// ✅ Catch invalid routes
app.use((req, res) => {
  console.warn(`⚠️ Invalid route requested: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `🚫 Route not found: ${req.originalUrl}`,
  });
});

// ✅ Global error handler (extra safety)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "⚠️ Internal Server Error",
    error: err.message,
  });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log("===============================");
  console.log(`✅ RentXpress Server running on port ${PORT}`);
  console.log(`🌐 Access API at: https://rentxpress.onrender.com`);
  console.log("===============================");
});
