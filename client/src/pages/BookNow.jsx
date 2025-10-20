import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllItems, createBooking } from "../api";

export default function BookNow() {
  const { id } = useParams(); // itemId
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState("");

  // ✅ Load item details by ID
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await getAllItems();
        const found = res.items.find((i) => i._id === id);
        setItem(found);
      } catch (err) {
        console.error("❌ Failed to fetch item:", err.message);
        setMessage("⚠️ Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // ✅ Calculate total price based on date range
  useEffect(() => {
    if (item && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = (end - start) / (1000 * 60 * 60 * 24);
      if (days > 0) {
        setTotalPrice(days * item.price);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, item]);

  // ✅ Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      setMessage("⚠️ Please log in before booking.");
      return navigate("/login");
    }

    try {
      const bookingData = {
        itemId: item._id,
        userId: storedUser._id,
        startDate,
        endDate,
        totalPrice,
      };

      const res = await createBooking(bookingData);
      if (res.success) {
        setMessage("✅ Booking successful!");
        setTimeout(() => navigate("/bookings"), 2000);
      } else {
        setMessage("⚠️ Booking failed, please try again.");
      }
    } catch (err) {
      console.error("❌ Booking error:", err.message);
      setMessage("🚫 Server error, please try again later.");
    }
  };

  if (loading) return <p className="text-center mt-8">⏳ Loading item...</p>;

  if (!item)
    return (
      <p className="text-center text-red-600 mt-8">⚠️ Item not found.</p>
    );

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4 text-blue-700 text-center">
        Book {item.name}
      </h1>

      <div className="mb-4 text-gray-700">
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Price per day:</strong> ₹{item.price}</p>
        <p><strong>Location:</strong> {item.location}</p>
      </div>

      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Start Date:</label>
          <input
            type="date"
            className="border rounded-lg w-full p-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Date:</label>
          <input
            type="date"
            className="border rounded-lg w-full p-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div>
          <p className="font-semibold text-blue-700">
            Total Price: ₹{totalPrice}
          </p>
        </div>

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-medium px-6 py-2 rounded-lg w-full"
        >
          Confirm Booking
        </button>
      </form>

      {message && <p className="text-center mt-4 text-gray-800">{message}</p>}
    </div>
  );
}
