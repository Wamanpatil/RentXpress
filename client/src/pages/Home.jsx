import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
        Welcome to RentXpress 🚀
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mb-10">
        RentXpress makes renting easy and reliable. Whether you need
        <strong> equipment</strong>, <strong>vehicles</strong>, or
        <strong> rooms</strong> — find everything you need in one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Equipment Section */}
        <Link
          to="/equipment"
          className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-6 border-l-4 border-blue-500"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2830/2830318.png"
            alt="Equipment"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-blue-700 mb-2">
            Rent Equipment
          </h2>
          <p className="text-gray-600 text-sm">
            Tools, electronics, and gear for every need.
          </p>
        </Link>

        {/* Vehicles Section */}
        <Link
          to="/vehicles"
          className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-6 border-l-4 border-green-500"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png"
            alt="Vehicles"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Rent Vehicles
          </h2>
          <p className="text-gray-600 text-sm">
            Cars, bikes, and more — for your travel needs.
          </p>
        </Link>

        {/* Rooms Section */}
        <Link
          to="/rooms"
          className="bg-white shadow-md hover:shadow-lg transition rounded-2xl p-6 border-l-4 border-yellow-500"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1532/1532688.png"
            alt="Rooms"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-yellow-600 mb-2">
            Book Rooms & Hotels
          </h2>
          <p className="text-gray-600 text-sm">
            Affordable rooms, hotels, and stays.
          </p>
        </Link>
      </div>

      <footer className="mt-16 text-sm text-gray-500">
        © {new Date().getFullYear()} RentXpress — All Rights Reserved.
      </footer>
    </div>
  );
}
