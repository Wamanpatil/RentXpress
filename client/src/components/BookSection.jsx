import React, { useState } from "react";
import axios from "axios";

export default function BookSection({ itemId, itemName, price }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please login before booking!");
        return;
      }

      if (!startDate || !endDate) {
        alert("Please select both start and end dates!");
        return;
      }

      // ✅ Calculate total price based on days
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
      const totalPrice = days * price;

      const bookingData = {
        itemId: itemId,
        userId: user._id, // ✅ send logged-in user ID
        startDate,
        endDate,
        totalPrice,
      };

      console.log("📤 Sending Booking Data:", bookingData);

      const res = await axios.post("http://localhost:5000/api/bookings", bookingData);
      alert("✅ Booking Successful!");
    } catch (err) {
      console.error("❌ Booking error:", err);
      alert("❌ Booking Failed. Try again.");
    }
  };

  return (
    <div className="mt-2 p-2 border-t border-gray-200">
      <h3 className="text-gray-700 font-medium mb-2">Book {itemName}</h3>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 rounded mr-2"
      />
      <button
        onClick={handleBooking}
        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
      >
        Book Now
      </button>
    </div>
  );
}
