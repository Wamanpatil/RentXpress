import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ["equipment", "vehicle", "room", "Equipment", "Vehicle", "Room"],
    },
    price: { type: Number, required: true, min: 1 },
    location: { type: String, required: true },
    description: { type: String, required: true, maxlength: 500 },
    ownerName: { type: String, required: true },
    ownerContact: { type: String, match: [/^[0-9]{10}$/, "Invalid contact"] },
    image: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/1048/1048953.png",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", itemSchema);
