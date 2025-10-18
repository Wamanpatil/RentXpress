import axios from "axios";

// ✅ Dynamic backend URL (auto switches between local & live)
const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  withCredentials: true, // allow cookies / JWT
});

// ✅ Add new item
export const addItem = async (formData) => {
  try {
    const res = await API.post("/items/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("❌ Error adding item:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Get all items
export const getAllItems = async () => {
  try {
    const res = await API.get("/items");
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching items:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Delete an item
export const deleteItem = async (id) => {
  try {
    const res = await API.delete(`/items/${id}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error deleting item:", err.response?.data || err.message);
    throw err;
  }
};
