import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("📡 Fetching bookings from backend...");
        const res = await axios.get("http://localhost:5000/api/bookings");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        ⏳ Loading bookings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl">
        ⚠️ {error}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-xl">
        📝 No bookings found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-center text-3xl font-bold text-blue-700 mb-6">
        📅 Bookings Dashboard
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-blue-100 text-gray-800">
            <tr>
              <th className="py-3 px-4 border">#</th>
              <th className="py-3 px-4 border">Item Name</th>
              <th className="py-3 px-4 border">Category</th>
              <th className="py-3 px-4 border">User</th>
              <th className="py-3 px-4 border">Start Date</th>
              <th className="py-3 px-4 border">End Date</th>
              <th className="py-3 px-4 border">Total Price</th>
              <th className="py-3 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={booking._id} className="text-center hover:bg-gray-50">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">
                  {booking.item?.name || "Unknown Item"}
                </td>
                <td className="py-2 px-4 border">
                  {booking.item?.category || "-"}
                </td>
                <td className="py-2 px-4 border">
                  {booking.user?.name || "Guest"}
                </td>
                <td className="py-2 px-4 border">
                  {new Date(booking.startDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border">
                  {new Date(booking.endDate).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border text-green-600 font-semibold">
                  ₹{booking.totalPrice}
                </td>
                <td className="py-2 px-4 border">{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
