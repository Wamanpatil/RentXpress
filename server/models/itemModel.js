import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerContact: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
