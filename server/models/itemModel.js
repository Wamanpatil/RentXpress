import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  ownerName: { type: String, required: true },  // ✅ Required
  ownerContact: { type: String },               // Optional
});

// ✅ Use “default” export
const Item = mongoose.model("Item", itemSchema);
export default Item;
