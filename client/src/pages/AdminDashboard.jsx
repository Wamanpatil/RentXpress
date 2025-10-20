import React, { useState, useEffect } from "react";
import { getAllItems, deleteItem, getAllBookings } from "../api";
import axios from "axios";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");

  const API_BASE = "https://rentxpress.onrender.com/api";

  // ✅ Fetch all items
  const fetchItems = async () => {
    try {
      const res = await getAllItems();
      if (res.success) setItems(res.items);
    } catch (err) {
      console.error("❌ Failed to fetch items:", err.message);
    }
  };

  // ✅ Fetch all bookings
  const fetchBookings = async () => {
    try {
      const res = await getAllBookings();
      if (res.success) setBookings(res.bookings);
    } catch (err) {
      console.error("❌ Failed to fetch bookings:", err.message);
    }
  };

  // ✅ Fetch all users (for stats)
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/auth/users`);
      if (res.data.success) setUsers(res.data.users);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err.message);
    }
  };

  // ✅ Delete item
  const handleDeleteItem = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(id);
      setMessage("✅ Item deleted successfully.");
      fetchItems();
    } catch (err) {
      console.error("❌ Error deleting item:", err.message);
      setMessage("🚫 Failed to delete item.");
    }
  };

  // ✅ Delete booking
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("⚠️ Delete this booking?")) return;
    try {
      await axios.delete(`${API_BASE}/bookings/${id}`);
      setMessage("✅ Booking deleted successfully.");
      fetchBookings();
    } catch (err) {
      console.error("❌ Error deleting booking:", err.message);
      setMessage("🚫 Failed to delete booking.");
    }
  };

  // ✅ Initial data load
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchItems(), fetchBookings(), fetchUsers()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-lg">⏳ Loading admin data...</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        Admin Dashboard
      </h1>

      {message && (
        <div className="bg-yellow-100 text-yellow-700 p-2 text-center rounded-md mb-4">
          {message}
        </div>
      )}

      {/* ✅ Navigation Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {["overview", "items", "bookings", "users"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg font-medium ${
              activeTab === tab
                ? "bg-blue-700 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ✅ Overview Section */}
      {activeTab === "overview" && (
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-blue-100 p-5 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-blue-800">
              Total Items
            </h2>
            <p className="text-2xl font-bold text-blue-900 mt-2">
              {items.length}
            </p>
          </div>

          <div className="bg-green-100 p-5 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-green-800">
              Total Bookings
            </h2>
            <p className="text-2xl font-bold text-green-900 mt-2">
              {bookings.length}
            </p>
          </div>

          <div className="bg-purple-100 p-5 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-purple-800">
              Total Users
            </h2>
            <p className="text-2xl font-bold text-purple-900 mt-2">
              {users.length}
            </p>
          </div>
        </div>
      )}

      {/* ✅ Items Section */}
      {activeTab === "items" && (
        <div>
          <h2 className="text-2xl font-semibold text-blue-800 mb-4">
            Manage Items
          </h2>
          {items.length === 0 ? (
            <p>No items found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="border rounded-lg shadow p-3 hover:shadow-lg transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg font-bold text-blue-700">{item.name}</h3>
                  <p>Category: {item.category}</p>
                  <p>Price: ₹{item.price}</p>
                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-md mt-2 hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ✅ Bookings Section */}
      {activeTab === "bookings" && (
        <div>
          <h2 className="text-2xl font-semibold text-green-800 mb-4">
            Manage Bookings
          </h2>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border text-sm">
                <thead className="bg-green-100">
                  <tr>
                    <th className="border p-2">User</th>
                    <th className="border p-2">Item</th>
                    <th className="border p-2">Duration</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-100">
                      <td className="border p-2">{b.user?.name || "N/A"}</td>
                      <td className="border p-2">{b.item?.name || "N/A"}</td>
                      <td className="border p-2">
                        {new Date(b.startDate).toLocaleDateString()} →{" "}
                        {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="border p-2">₹{b.totalPrice}</td>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ✅ Users Section */}
      {activeTab === "users" && (
        <div>
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">
            Registered Users
          </h2>
          {users.length === 0 ? (
            <p>No users registered.</p>
          ) : (
            <table className="w-full border text-sm">
              <thead className="bg-purple-100">
                <tr>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-100">
                    <td className="border p-2">{user.name}</td>
                    <td className="border p-2">{user.email}</td>
                    <td className="border p-2 capitalize">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
