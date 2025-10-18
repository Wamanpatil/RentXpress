import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// ✅ Optional: Tailwind or CSS import (keep this if you use Tailwind)
import "./index.css";

// ✅ Error Logging
window.addEventListener("error", (e) => {
  console.error("❌ Window Error:", e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("❌ Promise Rejection:", e.reason);
});

// ✅ Render App
const root = document.getElementById("root");

if (!root) {
  console.error("❌ Root element not found in index.html!");
} else {
  console.log("✅ Root element found, rendering App...");
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
