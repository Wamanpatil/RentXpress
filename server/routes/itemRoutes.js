import express from "express";
import { addItem, getItems, deleteItem } from "../controllers/itemController.js";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";

const router = express.Router();

router.use(
  fileUpload({
    useTempFiles: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Add new item
router.post("/add", async (req, res) => {
  try {
    const { name, category, price, location, description, ownerName, ownerContact } = req.body;
    if (!name || !category || !price || !location || !description || !ownerName) {
      return res.status(400).json({ success: false, message: "⚠️ Missing required fields." });
    }

    let imageUrl = "";
    if (req.files && req.files.image) {
      const upload = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
        folder: "rentxpress/items",
      });
      imageUrl = upload.secure_url;
    }

    const savedItem = await addItem({
      ...req.body,
      image: imageUrl,
    });

    res.status(201).json({ success: true, message: "✅ Item added successfully!", item: savedItem });
  } catch (error) {
    console.error("❌ Error adding item:", error);
    res.status(500).json({ success: false, message: "🚫 Failed to add item.", error: error.message });
  }
});

// ✅ Get all items
router.get("/", async (req, res) => {
  try {
    const items = await getItems();
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "🚫 Failed to fetch items." });
  }
});

// ✅ Delete item
router.delete("/:id", async (req, res) => {
  try {
    const result = await deleteItem(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: "⚠️ Item not found." });
    res.status(200).json({ success: true, message: "✅ Item deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: "🚫 Failed to delete item." });
  }
});

export default router;
