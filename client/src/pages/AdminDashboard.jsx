import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch Admin Data (Items + Bookings)
  const fetchAdminData = async () => {
    try {
      const [itemsRes, bookingsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/items"),
        axios.get("http://localhost:5000/api/bookings"),
      ]);

      setItems(itemsRes.data.items || []);
      setBookings(bookingsRes.data.bookings || []);
    } catch (err) {
      console.error("❌ Failed to fetch admin data:", err);
      alert("Failed to load admin data. Please check your server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // ✅ Delete Item Function
  const handleDeleteItem = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this item?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/items/${id}`);
      if (res.data.success) {
        alert("✅ Item deleted successfully!");
        setItems((prev) => prev.filter((i) => i._id !== id)); // update instantly
      } else {
        alert("❌ Failed to delete item.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting item.");
    }
  };

  // ✅ Delete Booking Function
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this booking?")) return;
    try {
      const res = await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      if (res.data.success) {
        alert("✅ Booking deleted successfully!");
        setBookings((prev) => prev.filter((b) => b._id !== id)); // instant refresh
      } else {
        alert("❌ Failed to delete booking.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Server error while deleting booking.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 text-xl">
        ⏳ Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ✅ Header */}
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        🧑‍💼 RentXpress Admin Dashboard
      </h1>

      {/* ✅ Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center border-l-4 border-blue-600">
          <h2 className="text-3xl font-bold text-blue-600">{items.length}</h2>
          <p className="text-gray-500">Total Items Listed</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center border-l-4 border-green-600">
          <h2 className="text-3xl font-bold text-green-600">{bookings.length}</h2>
          <p className="text-gray-500">Total Bookings</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center border-l-4 border-yellow-500">
          <h2 className="text-3xl font-bold text-yellow-600">
            {[...new Set(items.map((i) => i.ownerName))].length}
          </h2>
          <p className="text-gray-500">Total Owners</p>
        </div>
      </div>

      {/* ✅ Items Section */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-600">
            📦 All Listed Items
          </h2>
          <span className="text-sm text-gray-500">
            Manage all equipment, vehicles, and rooms.
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No items found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-700">
                  <th className="p-3 border">Item Name</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Price (₹)</th>
                  <th className="p-3 border">Owner</th>
                  <th className="p-3 border">Contact</th>
                  <th className="p-3 border">Location</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border capitalize">{item.category}</td>
                    <td className="p-3 border">₹{item.price}</td>
                    <td className="p-3 border">{item.ownerName || "N/A"}</td>
                    <td className="p-3 border">{item.ownerContact || "—"}</td>
                    <td className="p-3 border">{item.location}</td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
      </section>

      {/* ✅ Bookings Section */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-600">
            🧾 All User Bookings
          </h2>
          <span className="text-sm text-gray-500">
            Monitor and manage all active bookings.
          </span>
        </div>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-green-700">
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border">User</th>
                  <th className="p-3 border">From</th>
                  <th className="p-3 border">To</th>
                  <th className="p-3 border">Total Price (₹)</th>
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{b.item?.name || "—"}</td>
                    <td className="p-3 border">{b.user?.name || "Guest"}</td>
                    <td className="p-3 border">
                      {new Date(b.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 border">
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 border font-semibold text-green-700">
                      ₹{b.totalPrice}
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleDeleteBooking(b._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
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
      </section>
    </div>
  );
}
