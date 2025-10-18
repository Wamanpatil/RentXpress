import express from "express";
import multer from "multer";
import Item from "../models/itemModel.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ✅ Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* ==============================
   ✅ ADD ITEM
============================== */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      location,
      description,
      ownerName,
      ownerContact,
    } = req.body;

    if (!name || !category || !price || !location || !description || !ownerName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let imageUrl = "";

    if (req.file) {
      const buffer = req.file.buffer;
      const uploadStream = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "rentxpress/items" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

      const result = await uploadStream();
      imageUrl = result.secure_url;
    }

    const item = new Item({
      name,
      category,
      price,
      location,
      description,
      ownerName,
      ownerContact,
      image: imageUrl,
    });

    await item.save();
    res.status(201).json({
      success: true,
      message: "✅ Item added successfully!",
      item,
    });
  } catch (error) {
    console.error("❌ Error adding item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding item",
      error: error.message,
    });
  }
});

/* ==============================
   ✅ GET ALL ITEMS
============================== */
router.get("/", async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    console.error("❌ Error fetching items:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

/* ==============================
   ✅ DELETE ITEM BY ID
============================== */
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    res.status(200).json({
      success: true,
      message: "🗑️ Item deleted successfully!",
    });
  } catch (error) {
    console.error("❌ Error deleting item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting item",
      error: error.message,
    });
  }
});

export default router;
