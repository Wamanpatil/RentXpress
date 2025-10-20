import express from "express";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import Item from "../models/itemModel.js";

const router = express.Router();

// ✅ Enable file uploads
router.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  })
);

// ✅ Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ======================================================
// 🟢 ADD ITEM (multipart + Cloudinary upload)
// ======================================================
router.post("/add", async (req, res) => {
  try {
    const { name, category, price, location, description, ownerName, ownerContact } = req.body;

    if (!name || !category || !price || !location || !description || !ownerName || !ownerContact) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Please fill all required fields.",
      });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Please upload an image for the item.",
      });
    }

    // ✅ Upload image to Cloudinary
    const file = req.files.image;
    const uploadRes = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "rentxpress/items",
    });

    // ✅ Save item in MongoDB
    const newItem = new Item({
      name,
      category,
      price,
      location,
      description,
      ownerName,
      ownerContact,
      image: uploadRes.secure_url,
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
      message: "🚫 Failed to add item. Please try again.",
      error: error.message,
    });
  }
});

// ======================================================
// 🟡 GET ALL ITEMS
// ======================================================
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("❌ Fetch Items Error:", error.message);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to fetch items.",
      error: error.message,
    });
  }
});

// ======================================================
// 🔴 DELETE ITEM BY ID
// ======================================================
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "⚠️ Item not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Item deleted successfully.",
    });
  } catch (error) {
    console.error("❌ Delete Item Error:", error.message);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to delete item.",
      error: error.message,
    });
  }
});

export default router;
