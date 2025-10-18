import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewSection from "../components/ReviewSection";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items");
        const allItems = res.data.items || [];
        const filtered = allItems.filter(
          (item) => item.category?.toLowerCase().trim() === "room"
        );
        setRooms(filtered);
      } catch (err) {
        console.error("❌ Fetch rooms failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleBooking = async (item) => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!token || !userData) return alert("⚠️ Please login first.");
    if (!dates.startDate || !dates.endDate)
      return alert("⚠️ Please select booking dates.");

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) return alert("⚠️ End date must be after start date.");

    const totalPrice = item.price * days;
    const bookingData = {
      itemId: item._id,
      userId: userData._id,
      startDate: dates.startDate,
      endDate: dates.endDate,
      totalPrice,
    };

    console.log("📦 Booking Data Sending:", bookingData);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        bookingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) alert("✅ Booking Successful!");
      else alert("❌ " + (res.data.message || "Booking Failed"));
    } catch (err) {
      console.error("❌ Booking Failed:", err.response?.data || err.message);
      alert("❌ Booking Failed. Try again.");
    }
  };

  if (loading)
    return <div className="text-center p-10">⏳ Loading rooms...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">⚠️ {error}</div>;
  if (!rooms.length)
    return <div className="text-center p-10 text-gray-600">⚠️ No rooms found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-center text-purple-700 text-3xl font-bold mb-8">
        🏨 Rooms Available for Rent
      </h1>

      <div className="flex gap-2 justify-center mb-6">
        <input
          type="date"
          className="border p-2 rounded"
          value={dates.startDate}
          onChange={(e) => setDates({ ...dates, startDate: e.target.value })}
        />
        <input
          type="date"
          className="border p-2 rounded"
          value={dates.endDate}
          onChange={(e) => setDates({ ...dates, endDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((item) => (
          <div key={item._id} className="bg-white p-4 shadow-md rounded-lg">
            <img
              src={
                item.image || "https://cdn-icons-png.flaticon.com/512/484/484167.png"
              }
              alt={item.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-3">{item.name}</h2>
            <p>{item.description}</p>
            <p className="text-purple-600 font-bold mt-1">₹{item.price} / day</p>
            <p className="text-gray-600 mb-2">📍 {item.location}</p>

            <button
              onClick={() => handleBooking(item)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full mt-2"
            >
              Book Now
            </button>

            <div className="mt-4 border-t pt-2">
              <ReviewSection itemId={item._id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
