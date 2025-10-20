// server/routes/itemRoutes.js
import express from "express";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import Item from "../models/itemModel.js";

const router = express.Router();

// ✅ Enable file uploads
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  })
);

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Add new item (POST /api/items/add)
router.post("/add", async (req, res) => {
  try {
    const { name, category, price, location, description, ownerName, ownerContact } = req.body;

    // Field validation
    if (!name || !category || !price || !location || !description || !ownerName || !ownerContact) {
      return res.status(400).json({ success: false, message: "⚠️ Missing required fields" });
    }

    // Upload image to Cloudinary
    let imageUrl = "";
    if (req.files?.image) {
      const upload = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
        folder: "rentxpress/items",
      });
      imageUrl = upload.secure_url;
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

    await newItem.save();
    res.status(201).json({
      success: true,
      message: "✅ Item added successfully!",
      item: newItem,
    });
  } catch (error) {
    console.error("❌ Add Item Error:", error.message);
    res.status(500).json({
      success: false,
      message: "🚫 Server error while adding item.",
      error: error.message,
    });
  }
});

// ✅ Get all items
router.get("/", async (req, res) => {
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
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ success: false, message: "⚠️ Item not found." });
    res.status(200).json({ success: true, message: "✅ Item deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "🚫 Failed to delete item." });
  }
});

export default router;
