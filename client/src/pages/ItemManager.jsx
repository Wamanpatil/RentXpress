import React, { useState } from "react";
import axios from "axios";

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

  const [status, setStatus] = useState({ message: "", type: "" }); // ✅ For success/error messages

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      console.log("📦 Sending item data:", Object.fromEntries(data));

      const res = await axios.post("http://localhost:5000/api/items", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Server response:", res.data);
      setStatus({ message: "✅ Item added successfully!", type: "success" });

      // Reset form
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
      document.getElementById("imageInput").value = "";
    } catch (error) {
      console.error("❌ Error adding item:", error);
      setStatus({
        message:
          "❌ Failed to add item. Please check all fields and try again.",
        type: "error",
      });
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ color: "#1E40AF", fontWeight: "bold" }}>
        🧳 RentXpress Item Manager (For Owners)
      </h1>

      {/* ✅ Feedback Message */}
      {status.message && (
        <div
          style={{
            margin: "20px auto",
            padding: "10px",
            width: "fit-content",
            color: status.type === "error" ? "red" : "green",
            fontWeight: "bold",
          }}
        >
          {status.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "20px auto",
          padding: "20px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          textAlign: "left",
        }}
      >
        {/* Item Name */}
        <label>Item Name:</label>
        <input
          type="text"
          name="name"
          placeholder="e.g., Honda City"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Category */}
        <label>Category:</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Category</option>
          <option value="Equipment">Equipment</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Room">Room</option>
        </select>

        {/* Price */}
        <label>Price (₹ / day):</label>
        <input
          type="number"
          name="price"
          placeholder="Enter price per day"
          value={formData.price}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Location */}
        <label>Location:</label>
        <input
          type="text"
          name="location"
          placeholder="e.g., Mumbai"
          value={formData.location}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Description */}
        <label>Description:</label>
        <textarea
          name="description"
          placeholder="Enter a short description"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ ...inputStyle, height: "80px" }}
        />

        {/* Owner Info */}
        <label>Owner Full Name:</label>
        <input
          type="text"
          name="ownerName"
          placeholder="Owner's full name"
          value={formData.ownerName}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label>Owner Contact (Optional):</label>
        <input
          type="text"
          name="ownerContact"
          placeholder="Mobile number or email"
          value={formData.ownerContact}
          onChange={handleChange}
          style={inputStyle}
        />

        {/* Image Upload */}
        <label>Upload Image:</label>
        <input
          id="imageInput"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          style={inputStyle}
        />

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "#1E40AF",
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          + Add Item
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  margin: "6px 0 14px",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "15px",
};
