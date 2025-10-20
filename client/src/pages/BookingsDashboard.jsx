import React, { useEffect, useState } from "react";
import API from "../api";

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("📡 Fetching bookings from backend...");
        const res = await API.get("/bookings");
        console.log("✅ Bookings Response:", res.data);

        if (res.data && res.data.success) {
          setBookings(res.data.bookings || []);
        } else {
          setError("Failed to fetch bookings from server.");
        }
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setError("Failed to fetch bookings from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        ⏳ Loading bookings...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl">
        ⚠️ {error}
      </div>
    );

  if (bookings.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl">
        📝 No bookings found.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold text-green-700 mb-6">
        🧾 Bookings Dashboard
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-green-100 text-gray-800">
            <tr>
              <th className="py-3 px-4 border">#</th>
              <th className="py-3 px-4 border">Item</th>
              <th className="py-3 px-4 border">Category</th>
              <th className="py-3 px-4 border">User</th>
              <th className="py-3 px-4 border">Start Date</th>
              <th className="py-3 px-4 border">End Date</th>
              <th className="py-3 px-4 border">Total Price (₹)</th>
              <th className="py-3 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, index) => (
              <tr key={b._id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{b.item?.name || "—"}</td>
                <td className="py-2 px-4 border">{b.item?.category || "—"}</td>
                <td className="py-2 px-4 border">{b.user?.name || "Guest"}</td>
                <td className="py-2 px-4 border">
                  {new Date(b.startDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">
                  {new Date(b.endDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border text-green-700 font-semibold">
                  ₹{b.totalPrice}
                </td>
                <td className="py-2 px-4 border">
                  {b.status || "Confirmed"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
