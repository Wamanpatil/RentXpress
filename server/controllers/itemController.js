import { Item } from "../models/itemModel.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ✅ Create new item (for owners)
export const createItem = async (req, res) => {
  try {
    let imageUrl = "";

    // ✅ Upload image to Cloudinary if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "rentxpress_items",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // delete local temp file
    }

    console.log("📥 Incoming form data:", req.body);

    // ✅ Create item using correct field names
    const newItem = new Item({
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      location: req.body.location,
      description: req.body.description,
      ownerName: req.body.ownerName, // ✅ exact schema match
      ownerContact: req.body.ownerContact || "",
      image: imageUrl,
    });

    await newItem.save();
    console.log("✅ Item saved successfully:", newItem);

    res.status(201).json({
      success: true,
      message: "Item added successfully!",
      item: newItem,
    });
  } catch (error) {
    console.error("❌ Error adding item:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add item",
      error: error.message,
    });
  }
};
