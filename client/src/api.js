import axios from "axios";

// ✅ Determine environment
const isLocal = window.location.hostname === "localhost";

// ✅ Dynamic Base URL
const baseURL = isLocal
  ? "http://localhost:5000/api"
  : import.meta.env.VITE_API_BASE_URL || "https://rentxpress.onrender.com/api";

// ✅ Axios instance
const API = axios.create({
  baseURL,
  withCredentials: true, // for cookies/auth if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Debug log (helps verify in console)
console.log("🌍 API Base URL in use:", API.defaults.baseURL);

// ✅ Add Item
export const addItem = async (formData) => {
  try {
    const res = await API.post("/items/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error adding item:", error.message);
    if (error.response) console.error("🧾 Server Response:", error.response.data);
    throw error;
  }
};

// ✅ Get All Items
export const getAllItems = async () => {
  try {
    const res = await API.get("/items");
    return res.data;
  } catch (error) {
    console.error("❌ Error fetching items:", error.message);
    if (error.response) console.error("🧾 Server Response:", error.response.data);
    throw error;
  }
};

// ✅ Delete Item
export const deleteItem = async (id) => {
  try {
    const res = await API.delete(`/items/${id}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error deleting item:", error.message);
    if (error.response) console.error("🧾 Server Response:", error.response.data);
    throw error;
  }
};

// ✅ Register User
export const registerUser = async (formData) => {
  try {
    const res = await API.post("/auth/register", formData);
    return res.data;
  } catch (error) {
    console.error("❌ Registration failed:", error.message);
    if (error.response) console.error("🧾 Server Response:", error.response.data);
    throw error;
  }
};

// ✅ Login User
export const loginUser = async (credentials) => {
  try {
    const res = await API.post("/auth/login", credentials);
    return res.data;
  } catch (error) {
    console.error("❌ Login failed:", error.message);
    if (error.response) console.error("🧾 Server Response:", error.response.data);
    throw error;
  }
};
