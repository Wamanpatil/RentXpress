// server/routes/itemRoutes.js
import express from "express";
import cloudinary from "cloudinary";
import Item from "../models/itemModel.js";

const router = express.Router();

// ✅ Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Add new item
router.post("/add", async (req, res) => {
  console.log("🟢 Add Item route hit");
  try {
    const { name, category, price, location, description, ownerName, ownerContact } = req.body;
    console.log("📦 Incoming form fields:", req.body);

    if (!name || !category || !price || !location || !description || !ownerName) {
      return res.status(400).json({ success: false, message: "⚠️ Missing required fields" });
    }

    if (!req.files || !req.files.image) {
      console.log("⚠️ No image file uploaded");
      return res.status(400).json({ success: false, message: "Please upload an image file" });
    }

    const imageFile = req.files.image;

    // ✅ Upload to Cloudinary
    console.log("☁️ Uploading to Cloudinary...");
    const uploadResult = await cloudinary.v2.uploader.upload(imageFile.tempFilePath, {
      folder: "rentxpress/items",
      resource_type: "image",
      timeout: 120000, // 2 min to handle slow uploads
    });

    console.log("✅ Uploaded to Cloudinary:", uploadResult.secure_url);

    // ✅ Save to MongoDB
    const newItem = new Item({
      name,
      category,
      price,
      location,
      description,
      ownerName,
      ownerContact,
      image: uploadResult.secure_url,
    });

    const saved = await newItem.save();
    console.log("✅ Item saved:", saved.name);

    res.status(201).json({ success: true, message: "✅ Item added successfully!", item: saved });
  } catch (error) {
    console.error("❌ Add Item Error:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to add item",
      error: error.message,
    });
  }
});

// ✅ Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "🚫 Failed to fetch items" });
  }
});

export default router;
