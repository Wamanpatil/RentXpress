// client/src/pages/ItemManager.jsx
import React, { useState } from "react";
import { addItem } from "../api";

export default function ItemManager() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    location: "",
    description: "",
    ownerName: "",
    ownerContact: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) data.append(k, v);
      });

      // token optional — if you store auth token, pass it:
      const token = localStorage.getItem("token") || null;
      const res = await addItem(data, token);
      alert(res.message || "Item added");
      // reset
      setFormData({
        name: "",
        category: "",
        price: "",
        location: "",
        description: "",
        ownerName: "",
        ownerContact: "",
        image: null,
      });
    } catch (err) {
      console.error("Add item failed:", err);
      alert(err.message || "Failed to add item. Check console & server logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">🧳 Add Item for Rent</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Item Name" className="border p-3 w-full rounded" required />
          <select name="category" value={formData.category} onChange={handleChange} required className="border p-3 w-full rounded">
            <option value="">Select Category</option>
            <option value="equipment">Equipment</option>
            <option value="vehicle">Vehicle</option>
            <option value="room">Room</option>
          </select>
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price (₹)" required className="border p-3 w-full rounded" />
          <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required className="border p-3 w-full rounded" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="border p-3 w-full rounded" />
          <input name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Owner Name" required className="border p-3 w-full rounded" />
          <input name="ownerContact" value={formData.ownerContact} onChange={handleChange} placeholder="Owner Contact" className="border p-3 w-full rounded" />
          <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full" />
          <button type="submit" disabled={loading} className={`w-full py-3 rounded text-white ${loading ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"}`}>
            {loading ? "Uploading..." : "Add Item"}
          </button>
        </form>
      </div>
    </div>
  );
}
