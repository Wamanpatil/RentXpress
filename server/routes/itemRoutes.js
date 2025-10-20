import express from "express";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";
import Item from "../models/itemModel.js";

const router = express.Router();

// ✅ File Upload
router.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  })
);

// ✅ Cloudinary Config
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
      try {
        const upload = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
          folder: "rentxpress/items",
        });
        imageUrl = upload.secure_url;
      } catch (uploadErr) {
        console.error("❌ Cloudinary Upload Failed:", uploadErr);
        return res.status(500).json({
          success: false,
          message: "🚫 Image upload failed",
          error: uploadErr.message,
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "⚠️ Please upload an image file",
      });
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
    res.status(201).json({
      success: true,
      message: "✅ Item added successfully!",
      item: savedItem,
    });
  } catch (error) {
    console.error("❌ Server Error in Add Item:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to add item.",
      error: error.message,
    });
  }
});

// ✅ Get All Items
router.get("/", async (_req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "🚫 Failed to fetch items.",
      error: error.message,
    });
  }
});

// ✅ Delete Item
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, message: "⚠️ Item not found" });
    res.status(200).json({ success: true, message: "✅ Item deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "🚫 Failed to delete item.",
      error: error.message,
    });
  }
});

export default router;
