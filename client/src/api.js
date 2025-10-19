import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://rentxpress.onrender.com/api",
});

// ✅ Add item
export const addItem = async (formData) => {
  const res = await API.post("/items/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ Get all items
export const getAllItems = async () => {
  const res = await API.get("/items");
  return res.data;
};

// ✅ Delete item
export const deleteItem = async (id) => {
  const res = await API.delete(`/items/${id}`);
  return res.data;
};
