import express from "express";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import Item from "../models/itemModel.js";

const router = express.Router();

// enable file upload
router.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

// ✅ Cloudinary config (safety)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Add Item
router.post("/add", async (req, res) => {
  try {
    const { name, category, price, location, description, ownerName, ownerContact } = req.body;
    if (!name || !category || !price || !location || !description || !ownerName) {
      return res.status(400).json({ success: false, message: "⚠️ Missing required fields" });
    }

    let imageUrl = "";
    if (req.files && req.files.image) {
      const upload = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
        folder: "rentxpress/items",
      });
      imageUrl = upload.secure_url;
    }

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
    res.status(201).json({ success: true, message: "✅ Item added successfully!", item: savedItem });
  } catch (err) {
    console.error("❌ Add Item Error:", err);
    res.status(500).json({ success: false, message: "🚫 Failed to add item.", error: err.message });
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

// ✅ Delete item
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "⚠️ Item not found" });
    res.status(200).json({ success: true, message: "✅ Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "🚫 Failed to delete item.", error: err.message });
  }
});

export default router;
