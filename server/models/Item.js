import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Equipment", "Vehicle", "Room"],
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    ownerName: { type: String, required: true },
    ownerContact: { type: String },
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;
