// server/routes/itemRoutes.js
import express from "express";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import Item from "../models/itemModel.js";

const router = express.Router();

// ✅ Ensure fileUpload middleware
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

// ✅ Configure Cloudinary
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

    // Validate fields
    if (!name || !category || !price || !location || !description || !ownerName) {
      return res.status(400).json({ success: false, message: "⚠️ Missing required fields." });
    }

    // Check for image
    if (!req.files || !req.files.image) {
      console.log("⚠️ No image received in form-data");
      return res.status(400).json({ success: false, message: "⚠️ Please upload an image file." });
    }

    let imageUrl = "";
    try {
      console.log("☁️ Uploading image to Cloudinary...");
      const upload = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
        folder: "rentxpress/items",
      });
      imageUrl = upload.secure_url;
      console.log("✅ Image uploaded:", imageUrl);
    } catch (err) {
      console.error("❌ Cloudinary Upload Error:", err);
      return res.status(500).json({
        success: false,
        message: "🚫 Failed to upload image to Cloudinary.",
        error: err.message,
      });
    }

    // Save item to MongoDB
    const newItem = new Item({
      name,
      category,
      price,
      location,
      description,
      ownerName,
      ownerContact,
      image: imageUrl,
    });

    const savedItem = await newItem.save();
    console.log("✅ Item saved:", savedItem);
    res.status(201).json({ success: true, message: "✅ Item added successfully!", item: savedItem });
  } catch (error) {
    console.error("❌ Add Item Route Error:", error);
    res.status(500).json({ success: false, message: "🚫 Failed to add item.", error: error.message });
  }
});

// ✅ Fetch all items
router.get("/", async (_req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "🚫 Failed to fetch items." });
  }
});

// ✅ Delete item
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "⚠️ Item not found." });
    res.status(200).json({ success: true, message: "✅ Item deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "🚫 Failed to delete item." });
  }
});

export default router;
