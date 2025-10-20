import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";

// ✅ Import Routes
import itemRoutes from "./routes/itemRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS
app.use(
  cors({
    origin: [
      "https://rentxpress.netlify.app", // frontend
      "https://rentxpress.onrender.com", // backend self-origin
      "http://localhost:5173",           // dev
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.options("*", cors());

// ✅ Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(fileUpload({ useTempFiles: true }));

// ✅ Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ API ROUTES — ensure all are mounted under /api/
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/reviews", reviewRoutes);

// ✅ Health Route
app.get("/api", (req, res) => {
  res.status(200).json({ message: "🌐 RentXpress Backend Running Successfully!" });
});

// ✅ Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log("===============================");
  console.log(`✅ RentXpress Server running on port ${PORT}`);
  console.log(`🌐 API Base: https://rentxpress.onrender.com/api`);
  console.log("===============================");
});
