import axios from "axios";

// ✅ Auto-detect if the site is running locally or in production
const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://rentxpress.onrender.com";

console.log("🌍 Using API base URL:", BASE_URL);

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

// ✅ Add new item
export const addItem = async (formData) => {
  try {
    const res = await API.post("/items/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error adding item:", err);
    throw err;
  }
};

// ✅ Get all items
export const getAllItems = async () => {
  try {
    const res = await API.get("/items");
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching items:", err);
    throw err;
  }
};

// ✅ Delete an item
export const deleteItem = async (id) => {
  try {
    const res = await API.delete(`/items/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting item:", err);
    throw err;
  }
};
