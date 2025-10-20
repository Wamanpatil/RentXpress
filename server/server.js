// server/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";

import itemRoutes from "./routes/itemRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ Allow cross-origin from Netlify and local dev
app.use(
  cors({
    origin: ["https://rentxpress.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ File upload middleware FIRST (important)
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/", // Render allows writing only to /tmp
    createParentPath: true,
    abortOnLimit: false,
    preserveExtension: true,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  })
);

// ✅ Now JSON parsers
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ✅ Root test route
app.get("/", (req, res) => {
  res.json({ message: "🌐 RentXpress Backend Running Successfully!" });
});

// ✅ API Routes
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "RentXpressDB" })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
