import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("✅ Login successful!");
      navigate("/");
    } catch (err) {
      console.error("❌ Login Error:", err);
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Login to RentXpress
        </h2>
        <input type="email" name="email" placeholder="Email" className="border p-2 w-full mb-4 rounded" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="border p-2 w-full mb-4 rounded" onChange={handleChange} required />
        <button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600 text-white py-2 w-full rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
