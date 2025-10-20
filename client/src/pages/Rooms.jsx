import React, { useEffect, useState } from "react";
import API from "../api";
import ReviewSection from "../components/ReviewSection";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dates, setDates] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/items");
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

  const handleBooking = async (room) => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!token || !userData) return alert("⚠️ Please login first.");
    if (!dates.startDate || !dates.endDate)
      return alert("⚠️ Please select booking dates.");

    const start = new Date(dates.startDate);
    const end = new Date(dates.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    if (days <= 0) return alert("⚠️ End date must be after start date.");

    const totalPrice = room.price * days;
    const bookingData = {
      itemId: room._id,
      userId: userData._id,
      startDate: dates.startDate,
      endDate: dates.endDate,
      totalPrice,
    };

    try {
      const res = await API.post("/bookings", bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) alert("✅ Room booked successfully!");
      else alert("❌ Booking failed. Please try again.");
    } catch (err) {
      console.error("❌ Booking failed:", err);
      alert("❌ Booking failed. Try again.");
    }
  };

  if (loading)
    return <div className="text-center p-10">⏳ Loading rooms...</div>;
  if (error)
    return <div className="text-center p-10 text-red-600">⚠️ {error}</div>;
  if (!rooms.length)
    return (
      <div className="text-center p-10 text-gray-600">
        ⚠️ No rooms found.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-center text-yellow-600 text-3xl font-bold mb-8">
        🏨 Rooms & Hotels Available for Rent
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
        {rooms.map((room) => (
          <div key={room._id} className="bg-white p-4 shadow-md rounded-lg">
            <img
              src={
                room.image ||
                "https://cdn-icons-png.flaticon.com/512/1532/1532688.png"
              }
              alt={room.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-3">{room.name}</h2>
            <p>{room.description}</p>
            <p className="text-yellow-600 font-bold mt-1">
              ₹{room.price} / day
            </p>
            <p className="text-gray-600 mb-2">📍 {room.location}</p>

            <p className="text-sm text-gray-500">
              👤 {room.ownerName}{" "}
              {room.ownerContact && ` | 📞 ${room.ownerContact}`}
            </p>

            <button
              onClick={() => handleBooking(room)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded w-full mt-2"
            >
              Book Now
            </button>

            <div className="mt-4 border-t pt-2">
              <ReviewSection itemId={room._id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
