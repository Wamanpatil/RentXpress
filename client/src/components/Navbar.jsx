import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Sync user info whenever route or storage changes
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // ✅ Helper to highlight active link
  const isActive = (path) =>
    location.pathname === path
      ? "text-yellow-300 font-semibold"
      : "hover:text-yellow-300";

  return (
    <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* ✅ Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide hover:text-yellow-300 transition"
        >
          RentXpress
        </Link>

        {/* ✅ Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/equipment" className={isActive("/equipment")}>
            Equipment
          </Link>
          <Link to="/vehicles" className={isActive("/vehicles")}>
            Vehicles
          </Link>
          <Link to="/rooms" className={isActive("/rooms")}>
            Rooms
          </Link>
          <Link to="/bookings" className={isActive("/bookings")}>
            Bookings
          </Link>

          {/* ✅ Add Item always visible for logged-in users */}
          {user && (
            <Link
              to="/itemmanager"
              className="text-green-300 hover:text-green-400 font-medium"
            >
              + Add Item
            </Link>
          )}

          {/* ✅ Admin Access */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-red-300 hover:text-red-400 font-medium"
            >
              Admin
            </Link>
          )}
        </div>

        {/* ✅ Auth Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <>
              <span className="text-sm opacity-80">
                👋 {user.name || "User"}{" "}
                {user.role === "admin" && (
                  <span className="text-yellow-300">(Admin)</span>
                )}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-700 px-4 py-1 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-blue-800 px-4 py-1 rounded-lg font-medium hover:bg-yellow-300 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* ✅ Mobile Menu Toggle */}
        <button
          className="md:hidden flex flex-col space-y-1 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* ✅ Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 text-white px-6 py-4 space-y-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className={isActive("/")}>
            Home
          </Link>
          <Link
            to="/equipment"
            onClick={() => setMenuOpen(false)}
            className={isActive("/equipment")}
          >
            Equipment
          </Link>
          <Link
            to="/vehicles"
            onClick={() => setMenuOpen(false)}
            className={isActive("/vehicles")}
          >
            Vehicles
          </Link>
          <Link
            to="/rooms"
            onClick={() => setMenuOpen(false)}
            className={isActive("/rooms")}
          >
            Rooms
          </Link>
          <Link
            to="/bookings"
            onClick={() => setMenuOpen(false)}
            className={isActive("/bookings")}
          >
            Bookings
          </Link>

          {user && (
            <Link
              to="/itemmanager"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-green-300"
            >
              + Add Item
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-red-300"
            >
              Admin Dashboard
            </Link>
          )}

          <div className="flex flex-col space-y-2 pt-2 border-t border-blue-500">
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium text-center hover:bg-gray-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-yellow-400 text-blue-800 px-4 py-2 rounded-lg font-medium text-center hover:bg-yellow-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
