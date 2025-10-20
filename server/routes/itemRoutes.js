import express from "express";
import { addItem, getItems, deleteItem } from "../controllers/itemController.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";

const router = express.Router();

// ✅ Middleware to ensure file upload
router.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  })
);

// ✅ Cloudinary configuration (in case global config not loaded yet)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Add new item route with image upload
router.post("/add", async (req, res) => {
  try {
    const { name, category, price, location, description, ownerName, ownerContact } = req.body;

    if (!name || !category || !price || !location || !description || !ownerName) {
      return res.status(400).json({ success: false, message: "⚠️ Please fill all required fields." });
    }

    let imageUrl = "";
    if (req.files && req.files.image) {
      console.log("📸 Uploading image to Cloudinary...");
      const file = req.files.image;

      // ✅ Upload image to Cloudinary
      const uploadResult = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "rentxpress/items",
      });

      imageUrl = uploadResult.secure_url;
      console.log("✅ Image uploaded successfully:", imageUrl);
    } else {
      console.log("⚠️ No image uploaded, using placeholder.");
      imageUrl = "https://cdn-icons-png.flaticon.com/512/1048/1048953.png"; // fallback image
    }

    // ✅ Create new item
    const newItem = {
      name,
      category,
      price,
      location,
      description,
      ownerName,
      ownerContact,
      image: imageUrl,
    };

    // ✅ Use your controller to save item
    const savedItem = await addItem(newItem);
    return res.status(201).json({
      success: true,
      message: "✅ Item added successfully!",
      item: savedItem,
    });
  } catch (error) {
    console.error("❌ Error adding item:", error);
    res.status(500).json({
      success: false,
      message: "🚫 Failed to add item.",
      error: error.message,
    });
  }
});

// ✅ Get all items
router.get("/", async (req, res) => {
  try {
    const items = await getItems();
    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ success: false, message: "🚫 Failed to fetch items." });
  }
});

// ✅ Delete an item
router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteItem(req.params.id);
    if (!result) {
      return res.status(404).json({ success: false, message: "⚠️ Item not found." });
    }
    res.status(200).json({ success: true, message: "✅ Item deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    res.status(500).json({ success: false, message: "🚫 Failed to delete item." });
  }
});

export default router;
