// server/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";

// ✅ Import all route files
import itemRoutes from "./routes/itemRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// ✅ Enable CORS (Frontend URLs)
app.use(
  cors({
    origin: ["https://rentxpress.netlify.app", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ File Upload (MUST come before JSON parser)
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

// ✅ Body Parsers
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ✅ Root API test
app.get("/", (req, res) => {
  res.json({ message: "🌐 RentXpress Backend Running Successfully!" });
});

// ✅ Mount API Routes
app.use("/api/items", itemRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);

// ✅ Global Error / 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "RentXpressDB",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 RentXpress backend running on port ${PORT}`);
});
