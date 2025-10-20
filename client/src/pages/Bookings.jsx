import React, { useState, useEffect } from "react";
import { getUserBookings } from "../api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setMessage("⚠️ Please log in to view your bookings.");
          return;
        }
        const res = await getUserBookings(user._id);
        if (res.success) setBookings(res.bookings);
        else setMessage("⚠️ Failed to load bookings.");
      } catch (err) {
        console.error("❌ Error fetching bookings:", err.message);
        setMessage("🚫 Unable to fetch bookings right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p className="text-center mt-8">⏳ Loading bookings...</p>;

  if (message) return <p className="text-center mt-8 text-red-600">{message}</p>;

  if (bookings.length === 0)
    return <p className="text-center mt-8">📭 No bookings found.</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
        My Bookings
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
          >
            <img
              src={booking.item?.image || "/no-image.jpg"}
              alt={booking.item?.name}
              className="w-full h-48 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-semibold text-blue-800">
              {booking.item?.name}
            </h3>
            <p>📅 {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}</p>
            <p>💰 ₹{booking.totalPrice}</p>
            <p className="text-sm text-gray-600 mt-2">
              Location: {booking.item?.location || "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
