import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Components
import Navbar from "./components/Navbar";

// ✅ Pages
import Home from "./pages/Home";
import Equipment from "./pages/Equipment";
import Vehicles from "./pages/Vehicles";
import Rooms from "./pages/Rooms";
import ItemManager from "./pages/ItemManager"; // Owner Add Item Page
import Bookings from "./pages/Bookings";       // User Booking Dashboard
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard"; // Admin Panel

function App() {
  return (
    <Router>
      {/* ✅ Persistent Navbar (appears on all pages) */}
      <Navbar />

      {/* ✅ Main Layout Container */}
      <div className="bg-gray-50 min-h-screen">
        <Routes>
          {/* 🏠 Home Page */}
          <Route path="/" element={<Home />} />

          {/* 🧰 Rental Category Pages */}
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/rooms" element={<Rooms />} />

          {/* 🧾 Bookings Dashboard (For Users) */}
          <Route path="/bookings" element={<Bookings />} />

          {/* 🧳 Owner Panel (To Add or Manage Items) */}
          <Route path="/itemmanager" element={<ItemManager />} />

          {/* 🧑‍💼 Admin Dashboard (Full Access) */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* 🔐 Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🚧 Catch-All 404 Page */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen text-gray-600 text-xl">
                404 - Page Not Found 🚧
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
