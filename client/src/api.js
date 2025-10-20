// client/src/api.js
import axios from "axios";

const baseURL = "https://rentxpress.onrender.com/api";
console.log("🌐 Using API Base URL:", baseURL);

const API = axios.create({
  baseURL,
  timeout: 15000,
});

// Retry logic for network/cold-starts (single retry)
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const shouldRetry =
      error.code === "ERR_NETWORK" ||
      error.message.includes("timeout") ||
      (error.response && error.response.status >= 500);

    if (shouldRetry && !error.config.__retry) {
      error.config.__retry = true;
      await new Promise((r) => setTimeout(r, 3500));
      return API.request(error.config);
    }

    // Convert to friendly message
    if (error.response) throw new Error(error.response.data?.message || "Server error");
    if (error.request) throw new Error("No response from server");
    throw error;
  }
);

/* ---------------- ITEMS ---------------- */

// Note: DO NOT set Content-Type when sending FormData; browser adds boundary.
export const addItem = async (formData, token) => {
  const config = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const res = await API.post("/items/add", formData, config);
  return res.data;
};

export const getAllItems = async () => {
  const res = await API.get("/items");
  return res.data;
};

export const deleteItem = async (id, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await API.delete(`/items/${id}`, config);
  return res.data;
};

/* ---------------- BOOKINGS ---------------- */

export const createBooking = async (bookingData, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await API.post("/bookings", bookingData, config);
  return res.data;
};

export const getUserBookings = async (userId, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await API.get(`/bookings/user/${userId}`, config);
  return res.data;
};

export const getAllBookings = async (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await API.get("/bookings", config);
  return res.data;
};

/* ---------------- AUTH ---------------- */

export const loginUser = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await API.post("/auth/register", userData);
  return res.data;
};

/* ---------------- REVIEWS ---------------- */

export const addReview = async (reviewData, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await API.post("/reviews/add", reviewData, config);
  return res.data;
};

export const getItemReviews = async (itemId) => {
  const res = await API.get(`/reviews/item/${itemId}`);
  return res.data;
};

export default API;
