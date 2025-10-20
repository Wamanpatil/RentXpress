// server/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";

// Import routes
import itemRoutes from "./routes/itemRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ Allow cross-origin (Frontend)
app.use(
  cors({
    origin: ["https://rentxpress.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ File Upload must come BEFORE JSON parser
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // 🟢 Render allows only /tmp for temporary files
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  })
);

// ✅ JSON parsers (after fileUpload)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Basic test route
app.get("/", (req, res) => {
  res.json({ message: "🌐 RentXpress Backend Running Successfully!" });
});

// ✅ API routes
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);

// ✅ 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
