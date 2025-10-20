import express from "express";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import Item from "../models/itemModel.js";

const router = express.Router();

// ✅ File upload middleware
router.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

// ✅ Cloudinary setup
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Add Item
router.post("/add", async (req, res) => {
  console.log("🟢 Received Add Item request");
  try {
    const { name, category, price, location, description, ownerName, ownerContact } = req.body;

    // Log body for debugging
    console.log("📦 Item Data:", req.body);

    // Validate
    if (!name || !category || !price || !location || !description || !ownerName) {
      return res.status(400).json({ success: false, message: "⚠️ Missing required fields" });
    }

    // Check image file
    if (!req.files || !req.files.image) {
      console.log("⚠️ No image uploaded");
      return res.status(400).json({ success: false, message: "⚠️ Please upload an image file" });
    }

    // Upload image to Cloudinary
    let imageUrl = "";
    try {
      console.log("☁️ Uploading image to Cloudinary...");
      const upload = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
        folder: "rentxpress/items",
      });
      imageUrl = upload.secure_url;
      console.log("✅ Cloudinary Upload Success:", imageUrl);
    } catch (uploadErr) {
      console.error("❌ Cloudinary Upload Error:", uploadErr);
      return res.status(500).json({
        success: false,
        message: "🚫 Failed to upload image",
        error: uploadErr.message,
      });
    }

    // Save to MongoDB
    try {
      const newItem = new Item({
        name,
        category,
        price,
        location,
        description,
        image: imageUrl,
        ownerName,
        ownerContact,
      });

      const savedItem = await newItem.save();
      console.log("✅ Item Saved Successfully:", savedItem);
      res.status(201).json({ success: true, message: "✅ Item added successfully!", item: savedItem });
    } catch (dbErr) {
      console.error("❌ MongoDB Save Error:", dbErr);
      res.status(500).json({ success: false, message: "🚫 Database error", error: dbErr.message });
    }
  } catch (error) {
    console.error("❌ Add Item Route Error:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Unexpected error occurred while adding item.",
      error: error.message,
    });
  }
});

// ✅ Get all items
router.get("/", async (_req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "🚫 Failed to fetch items.", error: err.message });
  }
});

export default router;
