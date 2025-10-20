import Item from "../models/Item.js";
import cloudinary from "cloudinary";

// ✅ Add Item Controller
export const addItem = async (reqBody) => {
  try {
    console.log("🧩 Adding new item:", reqBody);

    // ✅ Validate required fields
    const { name, category, price, location, description, ownerName, ownerContact, image } = reqBody;
    if (!name || !category || !price || !location || !description || !ownerName) {
      throw new Error("Missing required fields");
    }

    // ✅ Create and save item in MongoDB
    const newItem = new Item({
      name,
      category,
      price,
      location,
      description,
      ownerName,
      ownerContact,
      image: image || "https://cdn-icons-png.flaticon.com/512/1048/1048953.png", // fallback
    });

    const savedItem = await newItem.save();
    console.log("✅ Item saved successfully:", savedItem._id);
    return savedItem;
  } catch (error) {
    console.error("❌ Error in addItem Controller:", error.message);
    throw new Error("Failed to add item.");
  }
};

// ✅ Get All Items
export const getItems = async () => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    console.log(`📦 Found ${items.length} items`);
    return items;
  } catch (error) {
    console.error("❌ Error fetching items:", error.message);
    throw new Error("Failed to fetch items.");
  }
};

// ✅ Delete Item
export const deleteItem = async (id) => {
  try {
    console.log("🗑️ Deleting item with ID:", id);

    const item = await Item.findById(id);
    if (!item) {
      console.warn("⚠️ Item not found:", id);
      return null;
    }

    // ✅ Delete image from Cloudinary if exists
    if (item.image && item.image.includes("cloudinary.com")) {
      const publicId = item.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.v2.uploader.destroy(`rentxpress/items/${publicId}`);
        console.log("🧹 Cloudinary image deleted:", publicId);
      } catch (cloudErr) {
        console.warn("⚠️ Cloudinary image delete failed:", cloudErr.message);
      }
    }

    await Item.findByIdAndDelete(id);
    console.log("✅ Item deleted successfully:", id);
    return true;
  } catch (error) {
    console.error("❌ Error deleting item:", error.message);
    throw new Error("Failed to delete item.");
  }
};
