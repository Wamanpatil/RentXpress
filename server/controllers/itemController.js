import Item from "../models/Item.js";
import cloudinary from "cloudinary";

export const addItem = async (req, res) => {
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

    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.files.image.tempFilePath, {
      folder: "rentxpress_items",
    });

    const newItem = new Item({
      name,
      category,
      price,
      location,
      description,
      ownerName,
      ownerContact,
      image: result.secure_url,
    });

    await newItem.save();

    res.json({ success: true, message: "✅ Item added successfully", item: newItem });
  } catch (error) {
    console.error("❌ Add item error:", error);
    res.status(500).json({ success: false, message: "Failed to add item" });
  }
};

// Get all items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json({ success: true, items });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch items" });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Item.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: "Item not found" });
    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting item" });
  }
};
