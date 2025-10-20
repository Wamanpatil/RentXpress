import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// ✅ Page Imports
import Home from "./pages/Home";
import Equipment from "./pages/Equipment";
import Vehicles from "./pages/Vehicles";
import Rooms from "./pages/Rooms";
import BookNow from "./pages/BookNow";
import Bookings from "./pages/Bookings";
import BookingsDashboard from "./pages/BookingsDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ItemManager from "./pages/ItemManager";
import Login from "./pages/Login";
import Register from "./pages/Register";

// ✅ Optional Footer
function Footer() {
  return (
    <footer className="bg-blue-700 text-white text-center py-3 mt-10">
      © {new Date().getFullYear()} RentXpress — All Rights Reserved.
    </footer>
  );
}

// ✅ 404 Page
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404</h1>
      <p className="text-gray-600 text-lg mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <a
        href="/"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Go Back Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      {/* ✅ Navbar always visible */}
      <Navbar />

      <div className="min-h-[90vh] bg-gray-50">
        <Routes>
          {/* ✅ Main Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/rooms" element={<Rooms />} />

          {/* ✅ Booking Related */}
          <Route path="/booknow" element={<BookNow />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/bookingsdashboard" element={<BookingsDashboard />} />

          {/* ✅ Admin & Owner */}
          <Route path="/itemmanager" element={<ItemManager />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* ✅ Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {/* ✅ Footer */}
      <Footer />
    </Router>
  );
}
