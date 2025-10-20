import mongoose from "mongoose";

// ✅ Define Item Schema
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["equipment", "vehicle", "room", "Equipment", "Vehicle", "Room"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be greater than 0"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 500,
    },
    ownerName: {
      type: String,
      required: [true, "Owner name is required"],
      trim: true,
    },
    ownerContact: {
      type: String,
      trim: true,
      match: [/^[0-9]{10}$/, "Invalid contact number"],
    },
    image: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
    },
  },
  {
    timestamps: true, // ✅ Adds createdAt & updatedAt automatically
  }
);

// ✅ Create model if not already defined
const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

export default Item;
